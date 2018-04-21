import React from 'react';
import { connect } from 'react-redux';
import FormCard from 'shared/FormCard'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Footer from 'shared/Footer';
import { GridList, GridTile } from 'material-ui/GridList';
import { Card } from 'material-ui/Card';


import './style.css';
import {
    updateImage,
    updateEmail,
    updatePassword,
    updateOrgName,
    updateLocation,
    updateDescription,
    createOrganization,
    checkForCompany,
    updateName,
    updateValidatedFields,
    updateSuccessError
} from 'reduxStore/org';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            creatingOrg: false
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.handleTab = this.handleTab.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkIfCompanyExists = this.checkIfCompanyExists.bind(this);
        this.onSuggestSelect = this.onSuggestSelect.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
    }

    getErrorMessage(fieldName, value) {
        if (!this.props.validatedFields) {
            if (value === "") {
                return "This field is required.";
            }// If the value is null then return field required
            // If we have passed this stat then we are on to custom errors
            switch (fieldName) {
                case "orgName":
                    if (this.props.orgExists) {
                        return "Organization name already in use.";
                    }
                    break;
                case "email":
                    if (this.props.error === 202) {
                        return "You can only own one organization.";
                    }
                    break;
                default:
                    break;
            }// end switch
        }
    }

    componentDidUpdate() {
        if ((this.props.updateSucceeded || !this.props.success) && this.state.creatingOrg) {
            setTimeout(() => {
                this.setState({ creatingOrg: false });
                if (!this.props.success) {
                    this.props.updateSuccessError(true);
                }
                if (this.props.updateSucceeded) {
                    this.props.history.push("/login");
                }
            }, 1000);
        }
    }

    handleUpload(event) {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        let filename = event.target.files[0].name;
        reader.onloadend = () => {
            this.props.updateImage({
                image: reader.result,
                imageName: filename
            });
        };
        reader.readAsDataURL(file);
    }

    handleTab(event, fieldName) {
        if (event.keyCode === 9) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.email === "" || this.props.password === "" || this.props.name === "" || this.props.organizationName === "") {
            this.props.updateValidatedFields(false)
        } else if (this.props.validatedFields === true) {
            this.setState({ creatingOrg: true });
            this.props.createOrganization({
                name: this.props.name,
                organizationName: this.props.organizationName,
                email: this.props.email,
                password: this.props.password,
                description: this.props.description,
                location: this.props.description,
                image: this.props.image,
                imageName: this.props.imageName
            });
        }
    }

    checkIfCompanyExists(e, orgName) {
        if (!this.props.newEmployee) {
            if (!this.state.form) {
                this.setState({ form: e.target.form })
            }
            if (orgName !== this.props.lastOrgNameChecked) {
                this.props.checkForCompany(orgName);
            }
        }
    }
    onSuggestSelect(event) {
        this.props.updateLocation(event);
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <div className="login-screen">
                    <div className="__card-container">
                        <Card className="__card-properties">
                            <FormCard
                                loading={this.state.creatingOrg}
                                loadingText={"Creating Organization"}
                                headerText="Create a new Organization"
                                className="__formcard-signup-container"
                            >
                                <form
                                    name="newOrgForm"
                                    onSubmit={(e) => this.handleSubmit(e)}
                                    className="__newOrg-form-container"
                                >
                                    <div className="__newOrg-form-wrapper">
                                        <div className="__newOrg-credentials-container">
                                            <GridList cols={1} style={{ display: "flex", flexDirection: "column" }} cellHeight={70}>
                                                <GridTile>
                                                    <TextField
                                                        autoComplete='organization'
                                                        autoFocus
                                                        name="login-field-org"
                                                        floatingLabelText="Organization Name"
                                                        onBlur={(e) => this.checkIfCompanyExists(e, e.target.value)}
                                                        onChange={(e) => this.props.updateOrgName(e.target.value)}
                                                        value={this.props.organizationName}
                                                        errorText={this.getErrorMessage("orgName", this.props.organizationName)}
                                                    /></GridTile>
                                                <GridTile>
                                                    <TextField
                                                        autoComplete='name'
                                                        style={{ borderTop: "1px solid black" }}
                                                        name="login-field-fullname"
                                                        floatingLabelText="Full Name"
                                                        errorText={this.getErrorMessage("name", this.props.name)}
                                                        value={this.props.name}
                                                        onChange={(e) => this.props.updateName(e.target.value)}
                                                    /></GridTile>
                                                <GridTile>
                                                    <TextField
                                                        autoComplete="email"
                                                        name="login-field-address"
                                                        errorText={this.getErrorMessage("email", this.props.email)}
                                                        floatingLabelText="Email Address"
                                                        onChange={(e) => this.props.updateEmail(e.target.value)}
                                                        value={this.props.email || ''}
                                                    /></GridTile>
                                                <GridTile>
                                                    <TextField
                                                        autoComplete="new-password"
                                                        name="login-field-password"
                                                        floatingLabelText="Password"
                                                        errorText={this.getErrorMessage("password", this.props.password)}
                                                        onChange={(e) => this.props.updatePassword(e.target.value)}
                                                        value={this.props.password || ''}
                                                        type="password"
                                                    /></GridTile>
                                            </GridList>
                                            <RaisedButton className="image-upload-button" label={this.props.imageName || "Upload LOGO"} primary={true}>
                                                <input onKeyDown={(e) => this.handleTab(e, "file")}
                                                    onChange={this.handleUpload} id="imageButton" className="__newOrg-logo-upload" type="file"></input>
                                            </RaisedButton>
                                            <div className="__newOrg-form-buttons">
                                                <RaisedButton style={{ marginRight: 4 }} onClick={(e) => this.props.history.goBack()} label="GO BACK" className="__newOrg-form-button" />
                                                <RaisedButton style={{ marginLeft: 4 }} type="submit" label="Create" secondary={true} className="__newOrg-form-button" />
                                            </div>
                                        </div>
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
};

export default connect(state => ({
    organizationName: state.org.organizationName,
    lastOrgNameChecked: state.org.lastOrgNameChecked,
    orgExists: state.org.orgExists,
    name: state.org.name,
    email: state.org.email,
    password: state.org.password,
    imageName: state.org.imageName,
    image: state.org.image,
    description: state.org.description,
    location: state.org.location,
    updateSucceeded: state.org.updateSucceeded,
    validatedFields: state.org.validatedFields,
    error: state.org.error
}), {
        updateImage,
        updateEmail,
        updatePassword,
        updateOrgName,
        updateLocation,
        updateDescription,
        createOrganization,
        updateName,
        checkForCompany,
        updateValidatedFields,
        updateSuccessError
    })(SignUp);