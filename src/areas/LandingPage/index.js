import React from 'react';
import SearchBar from 'material-ui-search-bar'
import RaisedButton from 'material-ui/RaisedButton';
import Header from 'shared/Header';
import Footer from 'shared/Footer';
import { connect } from 'react-redux';
import Logo from 'shared/images/logo.png';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {cyan500} from 'material-ui/styles/colors';


import {
    updateSearchValue,
    filterResults
} from 'reduxStore/search';
import {
    showSnackbar,
    toggleMessage
} from 'reduxStore/home';
import './style.css';


class LandingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSnackbar: false
        };

        this.updateSearch = this.updateSearch.bind(this);
        this.updateSearchEntered = this.updateSearchEntered.bind(this);
        this.enterSearchpage = this.enterSearchpage.bind(this);
    }


    updateSearch(e) {
        this.props.updateSearchValue(e)
    }

    updateSearchEntered() {
        this.props.filterResults(this.props.searchValue);
        this.props.history.push(`/search?results=all&value=${this.props.searchValue}`);
    }

    enterSearchpage(){
        this.props.filterResults(this.props.searchValue);
        this.props.history.push("/search?results=all")
    }

    render() {
        return (
            <div className="app-landing-page">
                <Header orgPage={false} searchValue={this.props.searchValue} searchEntered={false} updateSearch={this.updateSearch}  loggedIn={this.props.loggedIn} />
                <div className="app-landingpage-container">
                <div className="__landing-header">
                    <img alt={Logo}  src={Logo} />
                </div>
                <div className="__search-wrapper">
                    <SearchBar
                        onChange={(e) => this.updateSearch(e)}
                        onRequestSearch={() => this.updateSearchEntered()}
                        value={this.props.searchValue}
                        hintText="Search anything..."
                        searchIcon={<SearchIcon color={cyan500} />}
                    />
                    <div className="__landing-search-buttons">
                        <RaisedButton onClick={(e) => this.props.history.push("/signup")} className="__landing-search-button" label="Create Organization" secondary={true} />
                        <RaisedButton primary={true} onClick={this.enterSearchpage} className="__landing-search-button" type="Submit" label="Search" />
                    </div>
                    <span onClick={() => this.props.history.push("/faq")}className="__landing-page-helptext">Need help? Search our help docs.</span>
                </div>
                </div>
                <Footer />
            </div>);
    }
}


// Export the App component
export default connect(state => ({
    searchValue: state.search.searchValue,
    loggedIn: state.login.loggedIn,
    searchEntered: state.search.searchEntered
}), {
        updateSearchValue,
        showSnackbar,
        toggleMessage,
        filterResults
    })(LandingPage);