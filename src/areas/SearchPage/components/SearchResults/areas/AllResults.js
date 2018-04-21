import React from 'react';
import { OrgCard, EventCard, ProductCard } from 'shared/ResultCards';
import Masonry from 'react-masonry-css'
import ResultsSum from '../components/ResultsSum.js';
import EventModal from '../components/EventModal.js';
import ProductModal from '../components/ProductModal.js';
import './style.css';

class AllResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEventModal:false,
            showProductModal:false,
            eventData:null,
            productData:null
        };

        this.getAllItems = this.getAllItems.bind(this);
        this.showEventModal = this.showEventModal.bind(this);
        this.closeEventModal = this.closeEventModal.bind(this);
        this.showProductModal = this.showProductModal.bind(this);
        this.closeProductModal = this.closeProductModal.bind(this);
    }

    /**
    * Randomize array element order in-place.
    * Using Durstenfeld shuffle algorithm.
    */
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array//.concat(array).concat(array).concat(array).concat(array).concat(array).concat(array);
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

    showProductModal(data){
        this.setState({
            showProductModal:true,
            productData:data
        });
    }
    closeProductModal(){
        this.setState({
            showProductModal:false,
            productData:null
        })
    }

    getAllItems() {
        var productArr = this.props.productResults.map((result, index) => {
            return <ProductCard
                showModal={this.showProductModal}            
                updateSearch={this.props.updateSearch}
                fancy={this.props.fancyResults}
                key={index + 100}
                data={result}
            />
        });
        var eventArr = this.props.eventResults.map((result, index) => {
            return <EventCard
                showModal={this.showEventModal}
                pushRouteForOrganizationId={this.props.pushRouteForOrganizationId}
                updateSearch={this.props.updateSearch}
                fancy={this.props.fancyResults}
                key={index + 200}
                data={result}
            />;
        });
        var orgArr = this.props.orgResults.map((org, index) => {
            return <OrgCard
                pushOrgRoute={this.props.pushOrgRoute}
                updateSearch={this.props.updateSearch}
                fancy={this.props.fancyResults}
                key={index}
                data={org} />;
        });

        return this.shuffleArray(productArr.concat(orgArr).concat(eventArr));
    };

    render() {
        return (<div className="__all-results-container">
            <EventModal 
                showModal={this.state.showEventModal} 
                closeModal={this.closeEventModal} 
                selectedEvent={this.state.eventData}
            />
            <ProductModal 
                showModal={this.state.showProductModal} 
                closeModal={this.closeProductModal} 
                selectedEvent={this.state.productData}
            />
            <ResultsSum
                style={{ paddingLeft: 188 }}
                total={this.props.orgResults.length + this.props.eventResults.length + this.props.productResults.length}
                searchTime={this.props.searchTime}
            />
            <div className={`__searchpage-all-results-contents ${this.props.fancyResults ? "" : "__searchpage-all-results-classic"}`}>
                {this.props.fancyResults ? <Masonry
                    breakpointCols={{
                        default: 4,
                        1405: 3,
                        1063: 2,
                        711: 1
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {this.getAllItems()}
                </Masonry> : this.getAllItems()}
            </div>
        </div>
        );
    }
}

export default AllResults;