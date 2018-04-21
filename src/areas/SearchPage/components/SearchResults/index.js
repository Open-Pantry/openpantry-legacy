import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import queryString from 'qs';
import { MapResults, AllResults, ProductResults, EventResults, OrgResults } from './areas';
import debounce from 'lodash/debounce';
import {
    updateQuery,
    filterResults,
    updateSearchValue
} from 'reduxStore/search';
import './style.css';
import './areas/style.css'; // Results styles


class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.getSearchResultType = this.getSearchResultType.bind(this);
        this.filterResults = debounce(this.filterResults.bind(this),500);
        this.updateSearch = this.updateSearch.bind(this);
        this.pushOrgRoute = this.pushOrgRoute.bind(this);
        this.pushRouteForOrganizationId = this.pushRouteForOrganizationId.bind(this);
    }

    componentWillUpdate() {
        if (this.props.query.results !== queryString.parse(window.location.search, { ignoreQueryPrefix: true }).results) {
            this.props.updateQuery({
                query: queryString.parse(window.location.search, { ignoreQueryPrefix: true })
            });
        }// If the new query string is different from the old then update the state.
    }

    componentWillMount() {
        this.props.updateQuery({
            query: queryString.parse(window.location.search)
        });
    }

    
    getSearchResultType() {
        if (!this.props.waitingForData && this.props.orgs !== null) {
            switch (this.props.query.results) {
                case "map":
                    return (<MapResults 
                            userLat={this.props.userLng} 
                            userLng={this.props.userLng} 
                            searchQuery={this.props.query} 
                            updateSearch={this.updateSearch} 
                            orgResults={this.props.orgs}                            
                            />);
                case "product":
                    return (<ProductResults 
                            updateSearch={this.updateSearch} 
                            fancyResults={this.props.fancyResults} 
                            productResults={this.props.products} 
                            searchTime={this.props.searchTime}                                                                           
                            />);
                case "organization":
                    return (<OrgResults 
                            pushOrgRoute={this.pushOrgRoute} 
                            updateSearch={this.updateSearch} 
                            fancyResults={this.props.fancyResults} 
                            orgResults={this.props.orgs}         
                            searchTime={this.props.searchTime}                   
                            />);
                case "event":
                    return (<EventResults 
                            pushRouteForOrganizationId={this.pushRouteForOrganizationId}
                            updateSearch={this.updateSearch} 
                            fancyResults={this.props.fancyResults} 
                            eventResults={this.props.events} 
                            searchTime={this.props.searchTime}                                                                          
                            />);
                default:
                    return (<AllResults 
                            pushRouteForOrganizationId={this.pushRouteForOrganizationId}
                            pushOrgRoute={this.pushOrgRoute} 
                            updateSearch={this.updateSearch} 
                            fancyResults={this.props.fancyResults} 
                            productResults={this.props.products}
                            eventResults={this.props.events}
                            orgResults={this.props.orgs}
                            searchTime={this.props.searchTime}                                               
                            />);

            }
        }
    }

    pushRouteForOrganizationId(orgID){
        let org = this.props.orgs.find((organization) => {
            return organization.id === orgID;
        });

        this.props.history.push(`/search?results=map&initLat=${org.locationLat}&initLng=${org.locationLong}`);

    }

    updateSearch(value) {
        this.props.updateSearchValue(value);
        this.filterResults(value);
    }

    filterResults(value){
        this.props.filterResults(value);
    }

    pushOrgRoute(route) {
        this.props.history.push(route);
    }

    //TODO - .searchpage-loading-attr for justifying content center for loading bar
    render() {
        return (
            <div className="searchpage-results-container">
                <CircularProgress className="__circularLoading"style={{ marginTop:50,display: this.props.waitingForData ? "flex" : "none" }} size={this.props.waitingForData ? 100 : 0} thickness={this.props.waitingForData ? 5 : 0} />
                {this.getSearchResultType()}
            </div>
        );
    }
}

export default withRouter(connect(state => ({ 
    query: state.search.query,
    fancyResults: state.search.fancyResults,
    waitingForData: state.search.waitingForData,
    orgs:state.search.orgs,
    events:state.search.events,
    products:state.search.products,
    userLat:state.search.userLat,
    userLng:state.search.userLng,
    searchTime:state.search.searchTime
}), {
    updateQuery,
    filterResults,
    updateSearchValue
})(SearchResults));