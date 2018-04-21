import React from 'react';
import { Card } from 'material-ui/Card';
import { connect } from 'react-redux';
import {
    logIn,
    updateUsername,
    updatePassword,
    updateOrgName,
    checkForCompany,
    updateValidatedFields,
    updateQuery,
    resetLoginPage,
    firstLogIn
} from 'reduxStore/login';

import queryString from 'qs';

import {
    showSnackbar
} from 'reduxStore/home';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Footer from 'shared/Footer';
import FormCard from 'shared/FormCard';
import LoadingGif from 'shared/images/loading.gif';
import OurImage from 'shared/images/inventory.png';

import debounce from 'lodash/debounce';

import './style.css';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbarOpen: false,
            loggingIn: false,
            loadingText: "Logging you in."
        };

        this.loginUser = this.loginUser.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
        this.updateOrgName = this.updateOrgName.bind(this);
        this.checkIfCompanyExists = debounce(this.checkIfCompanyExists.bind(this),1000);
    }

    componentDidUpdate(prevProps) {
        if ((this.props.loggedIn || this.props.failedAuth) && this.state.loggingIn) {
            if (this.props.failedAuth) {
                this.setState({ loggingIn: false });
            }
            if (this.props.loggedIn) {
                setTimeout(() => 
                this.props.history.push("/")
                ,1000);
            }
        }

        // For focusing fields
        if (prevProps.newEmployee !== this.props.newEmployee) {
            document.getElementById("password-login").focus();
        }
    }

    async loginUser(e) {
        e.preventDefault();
        if ((this.props.userName === "" || this.props.password === "" || this.props.orgID === "") && !this.props.newEmployee) {
            this.props.updateValidatedFields(false);
        } else if (this.props.password === "" && this.props.newEmployee) {
            this.props.updateValidatedFields(false);
        } else if (this.props.validatedFields === true) {
            if (this.props.newEmployee) {

                this.setState({ loggingIn: true, loadingText: "Updating Profile." });
                await this.props.firstLogIn({
                    email: this.props.query.email,
                    password: this.props.password,
                    orgID: this.props.orgID
                });
                setTimeout(() => this.setState({ loadingText: "Logging you in." }),1000);
            }else{
                this.setState({ loggingIn: true});
            }
                // If we are signing in a new employee
            setTimeout(() =>
            this.props.logIn({
                email: this.props.userName === "" ? this.props.query.email : this.props.userName,
                password: this.props.password,
                orgID: this.props.orgID,
                organizationName:this.props.organizationName
            }),1000);
        }// If we have changed any field then validatedFields should be true
    }

    getErrorMessage(fieldName, value, altValue) {
        if (!this.props.validatedFields) {
            if (value === "" && altValue === "") {
                return "This field is required.";
            }// If the value is null then return field required
            // If we have passed this stat then we are on to custom errors
            switch (fieldName) {
                case "orgName":
                    if (!this.props.orgExists) {
                        return "The specified company does not exist.";
                    }
                    break;
                case "email":
                case "password":
                    if (this.props.failedAuth === true) {
                        return "Invalid Username or Password.";
                    }
                    break;
                default:
                    break;
            }// end switch
        }
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.updateSucceeded) {
                this.props.showSnackbar({
                    statusMessage: "Successfully created Organizaton",
                });
            }
        }, 300);
    }
    componentWillMount() {
        var query = queryString.parse(window.location.search,{ ignoreQueryPrefix: true });
        if (Object.keys(query).length !== 0) {
            if (query.email !== "" && query.org !== "" && query.token !== "") {
                this.props.updateQuery({
                    query: queryString.parse(window.location.search)
                });
            }
            this.props.history.push("/login");
        } else {
            this.props.resetLoginPage();
        }
    }


    checkIfCompanyExists(orgName) {
        if (orgName !== this.props.lastOrgNameChecked) {
            this.props.checkForCompany(orgName);
        }
    }

    updateOrgName(value){
        this.props.updateOrgName(value);
        this.checkIfCompanyExists(value);
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <div className="login-screen">
                    <div className="__card-container">
                        <Card className="__card-properties">
                            <FormCard
                                loading={this.state.loggingIn}
                                loadingText={this.state.loadingText}
                                className="__formcard-login-container"
                                headerText={this.props.newEmployee ? "Finish creating your Account." : "Sign in to your Organization."}
                                orgImage={(this.props.lastOrgNameChecked !== this.props.organizationName ? LoadingGif : (this.props.logoURL ? `${this.props.imageStartUrl}${this.props.logoURL}` : OurImage))}
                            >
                                <form
                                    onSubmit={(e) => this.loginUser(e)} className="__login-form-container">
                                    <TextField
                                        autoFocus
                                        autoComplete="new-organization"
                                        id="organization-login"
                                        name="login-field-org"
                                        floatingLabelText="Organization Name"
                                        errorText={this.getErrorMessage("orgName", this.props.organizationName, this.props.query.org)}
                                        onChange={(e) => this.updateOrgName(e.target.value)}
                                        value={this.props.newEmployee ? this.props.query.org : this.props.organizationName}
                                    />
                                    <TextField
                                        autoComplete="new-email"
                                        name="login-field-address"
                                        floatingLabelText="Email Address"
                                        errorText={this.getErrorMessage("email", this.props.userName, this.props.query.email)}
                                        onChange={(e) => this.props.updateUsername(e.target.value)}
                                        value={this.props.newEmployee ? this.props.query.email : this.props.userName}
                                        type="email"
                                    />
                                    <TextField
                                        autoComplete="new-password"
                                        id="password-login"
                                        name="login-field-password"
                                        floatingLabelText={this.props.newEmployee ? "Create Password" : "Password"}
                                        errorText={this.getErrorMessage("password", this.props.password)}
                                        onChange={(e) => this.props.updatePassword(e.target.value)}
                                        value={this.props.password}
                                        type="password"
                                    />
                                    <div className="__login-form-buttons">
                                        <div className="__login-form-buttons-wwrapper">
                                            <RaisedButton style={{ marginRight: 4, display: this.props.newEmployee ? "inherit" : "none" }} onClick={(e) => this.props.history.push('/')} label="CANCEL" className="__login-form-button" />
                                            <RaisedButton style={{ marginRight: 4, display: this.props.newEmployee ? "none" : "inherit" }} onClick={(e) => this.props.history.goBack()} label="GO BACK" className="__login-form-button" />
                                            <RaisedButton style={{ marginLeft: 4 }} className="__login-form-button" type="submit" label="Sign In" primary={true} />
                                        </div>
                                        <RaisedButton onClick={(e) => this.props.history.push('/signup')} label="Create Organization" secondary={true} style={{ width: 256, marginTop: 8, display: this.props.newEmployee ? "none" : "inherit" }} />
                                    </div>
                                </form>
                            </FormCard>
                        </Card>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

// Export the App component
export default connect(state => ({
    organizationName: state.login.organizationName,
    lastOrgNameChecked: state.login.lastOrgNameChecked,
    loggedIn: state.login.loggedIn,
    userName: state.login.userName,
    password: state.login.password,
    updateSucceeded: state.org.updateSucceeded,
    orgID: state.login.orgID,
    logoURL: state.login.logoURL,
    orgExists: state.login.orgExists,
    failedAuth: state.login.failedAuth,
    validatedFields: state.login.validatedFields,
    query: state.login.query,
    newEmployee: state.login.newEmployee,
    imageStartUrl:state.search.imageStartUrl
}), {
        updateUsername,
        updatePassword,
        updateOrgName,
        logIn,
        checkForCompany,
        showSnackbar,
        updateValidatedFields,
        updateQuery,
        firstLogIn,
        resetLoginPage
    })(Login);