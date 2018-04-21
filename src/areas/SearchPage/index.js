import React from 'react';
import Header from 'shared/Header';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Footer from 'shared/Footer';
import FontIcon from 'material-ui/FontIcon';

import { updateSearchValue } from 'reduxStore/search';
import { white } from 'material-ui/styles/colors';

import './style.css';

class SearchPage extends React.Component {
	constructor(props) {
		super(props);

		this.updateSearch = this.updateSearch.bind(this);
		this.checkForNeccessaryScrollButton = this.checkForNeccessaryScrollButton.bind(this);
	}

	updateSearch(e) {
		this.props.updateSearchValue(e);
	}

	checkForNeccessaryScrollButton() {
		if (window.outerHeight > window.innerHeight) {
			return (<div onClick={() => {
				window.scroll({ top: 0, left: 0, behavior: 'smooth' })
			}} className="__searchpage-scroll-up"><div className="__searchpage-scroll-wrapper"><FontIcon style={{ fontSize: 38 }} className="material-icons" color={white}>change_history</FontIcon></div></div>);
		}
	}

	render() {
		return (
			<div className="app-search-page">
				<Header
					searchValue={this.props.searchValue}
					searchEntered={true}
					updateSearch={this.updateSearch}
					loggedIn={this.props.loggedIn}
				/>
				<div className="__app-search-content">
					<SearchFilters />
					<SearchResults />
				</div>
				<Footer />
			</div>
		);
	}
}

// Export the App component
export default withRouter(
	connect(
		state => ({
			searchValue: state.search.searchValue,
			loggedIn: state.login.loggedIn,
			searchEntered: state.search.searchEntered
		}),
		{
			updateSearchValue,
		}
	)(SearchPage)
);
