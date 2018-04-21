import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import OrganizationPage from '../OrganizationPage';
import LandingPage from '../LandingPage';
import SearchPage from '../SearchPage';
import Snackbar from 'material-ui/Snackbar';
import LoginPage from '../LoginPage';
import SignUpPage from '../SignUpPage';
import HelpPage from '../HelpPage';
import AboutPage from '../AboutPage';
import queryString from 'qs';
import './styles.css';
import {
  logIn,
  updateUsername,
  updatePassword,
  updateLogoURL,
} from 'reduxStore/login';

import {
  loadSearchData,
  updateUserLocation,
  filterResults,
  updateSearchValue
} from 'reduxStore/search';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoginDialog: false,
      showProductDialog: true
    };

    this.closeLoginDialog = this.closeLoginDialog.bind(this);
    this.closeProductDialog = this.closeProductDialog.bind(this);
    this.geoSuccess = this.geoSuccess.bind(this);
  }

  closeLoginDialog() {
    this.setState({ showLoginDialog: false });
  }
  closeProductDialog() {
    this.setState({ showProductDialog: false });
  }

  componentWillMount(){
    if(localStorage.getItem('cached-email') != null){
      this.props.logIn({
        email: localStorage['cached-email'],
        password:localStorage['cached-password'],
        orgID:localStorage['cached-org'],
        organizationName:localStorage['cached-org-name']
      });
      this.props.updateLogoURL(localStorage['cached-logo-url']);
    }
  }

  geoSuccess(position) {
      this.props.updateUserLocation({
        userLat:position.coords.latitude,
        userLng:position.coords.longitude
      });
    }

  async componentDidMount(){
    navigator.geolocation.getCurrentPosition(this.geoSuccess);
    await this.props.loadSearchData(); // Load search data
    const initSearchValue = queryString.parse(window.location.search,{ ignoreQueryPrefix: true }).value;
    if(initSearchValue!==undefined){
      this.props.updateSearchValue(initSearchValue);
    }
    this.props.filterResults(initSearchValue!==undefined?initSearchValue:"");
  }

  render() {
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/faq" component={HelpPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route path="/org/:orgId" component={OrganizationPage} />
          </Switch>
          <Snackbar
            open={this.props.showMessage}
            message={this.props.statusMessage}
            autoHideDuration={this.props.autoHideDuration}
            action={this.props.action}
            onRequestClose={this.props.onRequestClose}
            style={{display:this.props.showMessage?"flex":"none"}}
        />
        </div>
      </Router>
    );
  } // render
}

// Export the App component
export default connect(state => ({
  organizationName: state.login.organizationName,
  loggedIn: state.login.loggedIn,
  userName: state.login.userName,
  password: state.login.password,
  showMessage:state.home.showMessage,
  statusMessage:state.home.statusMessage,
  autoHideDuration:state.home.autoHideDuration,
  action:state.home.action,
  onRequestClose:state.home.onRequestClose
}), {
    updateUsername,
    updatePassword,
    logIn,
    updateLogoURL,
    loadSearchData,
    updateUserLocation,
    filterResults,
    updateSearchValue
  })(App);
