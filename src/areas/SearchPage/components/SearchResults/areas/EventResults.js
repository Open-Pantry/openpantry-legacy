import React from 'react';
import EventCard from 'shared/ResultCards/EventCard';
import ResultsSum from '../components/ResultsSum.js';
import EventModal from '../components/EventModal.js';

class EventResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEventModal:false,
            eventData:null
        };
        
        this.showEventModal = this.showEventModal.bind(this);
        this.closeEventModal = this.closeEventModal.bind(this);
    }

    showEventModal(data){
        this.setState({
            showEventModal:true,
            eventData:data
        });
    }
    closeEventModal(){
        this.setState({
            showEventModal:false,
            eventData:null
        })
    }

    render() {
        return( 
            <div className="event-results-container">
                <ResultsSum searchTime={this.props.searchTime} total={this.props.eventResults.length} />
                <div className="__searchpage-event-results-contents">
                    {this.props.eventResults.map((result, index) => {
                        return <EventCard
                            showModal={this.showEventModal}
                            pushRouteForOrganizationId={this.props.pushRouteForOrganizationId} 
                            updateSearch={this.props.updateSearch} 
                            fancy={this.props.fancyResults} 
                            key={index * 4} 
                            data={result} />;
                        })}
                </div>
                <EventModal 
                showModal={this.state.showEventModal} 
                closeModal={this.closeEventModal} 
                selectedEvent={this.state.eventData}
                />
            </div>);
    }
}



export default EventResults;