import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateQueryType, toggleResults } from 'reduxStore/search';
import queryString from 'qs';
import Toggle from 'material-ui/Toggle';

import './style.css';


class SearchFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: 0,
            orgTitle:"Organizations",
            filters: [
                { title: "All", location: "all" },
                { title: window.innerWidth<360?"Orgs":"Organizations", location: "organization" },
                { title: "Products", location: "product" },
                { title: "Events", location: "event" },
                { title: "Map", location: "map" }
            ]
        };
        this.getFilters = this.getFilters.bind(this);
        this.updateIndex = this.updateIndex.bind(this);
        this.resizeOrglabel = this.resizeOrglabel.bind(this);
    }

resizeOrglabel(){
    if(window.innerWidth<360 && this.state.orgTitle === "Organizations"){
      this.setState({
          orgTitle:"Orgs"
      });
    }else if(window.innerWidth>360 && this.state.orgTitle === "Orgs"){
      this.setState({
          orgTitle:"Organizations"
      });
    }
  }
componentDidMount() {
  window.addEventListener('resize', this.resizeOrglabel)
}

componentWillUnmount() {
  window.removeEventListener('resize', this.resizeOrglabel)
}

    getFilters() {
        return this.state.filters.map((filter, index) => {
            return <div onClick={(e) => this.updateIndex(index, filter.location)} key={index} className={queryString.parse(window.location.search, { ignoreQueryPrefix: true }).results === filter.location ? "__search-filters-item-highlighted" : "__searchpage-filters-item"}>{filter.title==="Organizations"?this.state.orgTitle:filter.title}</div>;
        });
    }

    updateIndex(key, pathName) {
        this.setState({
            selected: key
        });
        this.props.history.push(`/search?results=${pathName}${this.props.searchValue===''?'':'&value='+this.props.searchValue}`);
    }

    render() {

        return (
            <div className="searchpage-filters-container">
                <div className="__searchpage-filters-items">
                    {this.getFilters()}
                </div>
                <Toggle
                    style={{ width: "auto", paddingRight: 16 }}
                    inputStyle={{ with: "auto" }}
                    labelStyle={{ width: "auto" }}
                    label={this.props.fancyResults?"Fancy Results":"Classic Results"}
                    toggled={this.props.fancyResults}
                    onToggle={this.props.toggleResults}
                />
            </div>
        );
    }
}

export default withRouter(connect(state => (
    { fancyResults: state.search.fancyResults,
        searchValue:state.search.searchValue 
    }), 
    { updateQueryType, toggleResults 
    })(SearchFilters));