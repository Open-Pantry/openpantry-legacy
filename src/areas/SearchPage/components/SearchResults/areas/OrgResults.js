import React from 'react';
import OrgCard from 'shared/ResultCards/OrgCard';
import ResultsSum from '../components/ResultsSum.js';

class OrgResults extends React.Component {

    render() {
        return <div className="org-results-container">
            <ResultsSum total={this.props.orgResults.length} searchTime={this.props.searchTime} />
            <div className="__searchpage-org-results-contents">
                {this.props.orgResults.map((org, index) => {
                    return <OrgCard 
                    pushOrgRoute={this.props.pushOrgRoute} 
                    updateSearch={this.props.updateSearch} 
                    key={index} 
                    fancy={this.props.fancyResults} 
                    data={org} />;
                })}
            </div></div>;
    }
}


export default OrgResults;