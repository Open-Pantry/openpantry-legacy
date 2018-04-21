import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import SearchBar from 'material-ui-search-bar';
import { withRouter } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';

import { connect } from 'react-redux';
import Logo from 'shared/images/logo.png';
import TextLogo from 'shared/images/logo-text.png';
import {
  updateSearchValue,
  toggleResults,
  filterResults,
} from 'reduxStore/search';
import { logOut } from 'reduxStore/login';
import Toggle from 'material-ui/Toggle';

import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';

import MoreVertIcon from 'material-ui/svg-icons/navigation/menu';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import LogoutIcon from 'material-ui/svg-icons/navigation/arrow-back';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import OrgIcon from 'material-ui/svg-icons/places/business-center';
import debounce from 'lodash/debounce';

import { cyan500,grey50,redA400,grey500 } from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import NoImage from 'shared/images/NoImage.png';

import SearchIcon from 'material-ui/svg-icons/action/search';

import "./styles.css";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDrawer: false,
      widthUpdated:false
    };

    this.getRightBar = this.getRightBar.bind(this);
    this.handleLoginDialog = this.handleLoginDialog.bind(this);
    this.resize = this.resize.bind(this);
    this.updateSearchInput = this.updateSearchInput.bind(this);
    this.updateSearchValue = debounce(this.updateSearchValue.bind(this),500);
  }

  updateSearchInput(e){
        this.props.updateSearchValue(e);
        this.updateSearchValue(e);
  }

  updateSearchValue(e){
    this.props.filterResults(e);
    this.props.history.push(`/search?results=${this.props.query.results}${this.props.searchValue===''?'':'&value='+this.props.searchValue}`);
  }

  handleLoginDialog() {
    if (this.props.loggedIn) {
      this.props.logOut();
      localStorage.removeItem('cached-email');
      localStorage.removeItem('cached-password');
      localStorage.removeItem('cached-org');      
      localStorage.removeItem('cached-logo-url');
      localStorage.removeItem('cached-org-name');
      window.location.reload();
    } else {
      this.props.history.push("/login");
    }
  }

  resize(){
    if(window.innerWidth<850 && !this.state.widthUpdated){
      this.setState({widthUpdated:true});
    }else if(window.innerWidth>850 && this.state.widthUpdated){
      this.setState({widthUpdated:false});
    }
  }
componentDidMount() {
  window.addEventListener('resize', this.resize)
}

componentWillUnmount() {
  window.removeEventListener('resize', this.resize)
}

  getRightBar() {
    if (this.props.loggedIn) {
      return (<div onClick={() => this.setState({ openDrawer: this.state.openDrawer ? false : true })} className="__landing-header-app-bar">
        <MoreVertIcon style={{cursor:"pointer"}} viewBox="0 0 20 20" hoverColor={grey500} color={cyan500} />
        <Drawer docked={false}
          overlayStyle={{opacity:.5}}
          containerClassName="__app-drawer-container"
          width={200} openSecondary={true} open={this.state.openDrawer} >
          <div className="__drawer-header-container">
            <Avatar
              backgroundColor={grey50}
              src={`${this.props.imageStartUrl}${this.props.logoURL}`||NoImage}
              size={48}
            />
            <div className="__drawer-header-text">
              {this.props.userName}
            </div>
            <CloseIcon style={{ position: "absolute", top: 4, right: 4 }} />
          </div>
          <div className="__drawer-menu-items">
            <MenuItem leftIcon={<OrgIcon color={redA400} />} onClick={() => this.props.history.push(`/org/${this.props.organizationName}`)}>My Organization</MenuItem>
            <Divider />
            <MenuItem leftIcon={<SettingsIcon />} >Settings</MenuItem> 
            <Divider />        
            <MenuItem leftIcon={<LogoutIcon color={cyan500} />} onClick={this.handleLoginDialog}>Logout</MenuItem>
            <Divider />        
            
          </div>
        </Drawer>
      </div>);
    } else {
      return (
      <RaisedButton secondary={true} className={this.props.searchEntered ? "landing-login-button-search" : "landing-login-button-initial"} label="Sign In" onClick={this.handleLoginDialog} />
      );
    }
  }

  render() {
    if (this.props.searchEntered) {
      return (
        <div style={this.props.style} className="app-navbar-search">
          <div onClick={(e) => this.props.history.push('/')} className="__top-search-logo">
            <div className="__top-search-logo-title">
              <img alt={window.innerWidth<750?TextLogo:Logo} src={window.innerWidth<750?TextLogo:Logo} />
            </div>
          </div>
          <div className="__top-search-wrapper">
            <SearchBar
              name="app-search-bar"
              onChange={this.updateSearchInput}
              value={this.props.searchValue}
              onRequestSearch={() => this.updateSearchValue(this.props.searchValue)}
              hintText=""
              searchIcon={<SearchIcon color={cyan500} />}
            />
          </div>
          <div className="landing-login-container">
            {this.getRightBar()}
              <img onClick={() => this.props.history.push('/')} alt={Logo} src={Logo} />            
              <Toggle
                    style={{ width: "auto", paddingRight: 16 }}
                    inputStyle={{ with: "auto" }}
                    labelStyle={{ width: "auto" }}
                    label={""}
                    toggled={this.props.fancyResults}
                    onToggle={this.props.toggleResults}
                />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{...this.props.style,justifyContent:this.props.orgPage?"space-between":"flex-end"}} className="app-navbar-search-alt navbar-search-alt">
          <div onClick={(e) => this.props.history.push('/')} className="__top-search-logo">
            <div className="__top-search-logo-title">
              <img style={{display:this.props.orgPage?"inline-block":"none"}} alt={window.innerWidth<850?TextLogo:Logo} src={window.innerWidth<850?TextLogo:Logo} />
            </div>
          </div>
          {this.getRightBar()}
        </div>
      );
    }
  }
}

// Export the App component
export default withRouter(connect(state => ({
  query:state.search.query,
  searchValue: state.search.searchValue,
  loggedIn: state.login.loggedIn,
  orgID: state.login.orgID,
  organizationName: state.login.organizationName,
  userName: state.login.userName,
  name: state.login.name,
  logoURL: state.login.logoURL,
  fancyResults:state.search.fancyResults,
  imageStartUrl:state.search.imageStartUrl
}), {
    updateSearchValue,
    logOut,
    toggleResults,
    filterResults
  })(Header));
