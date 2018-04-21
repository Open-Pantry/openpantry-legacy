import React from 'react';
import Chip from 'shared/Chip';
import FontIcon from 'material-ui/FontIcon';
import { pinkA200 } from 'material-ui/styles/colors';

import './style.css';


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

class EventCard extends React.Component {
    constructor(props) {
        super(props);

        this.getChips = this.getChips.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    getChips(tags, fancy, updateSearch) {
        return tags.map((tag, index) => {
            if (fancy) {
                return (<Chip onClick={() => updateSearch(tag.name)} color="white" background="rgb(0, 188, 212)" className={"eventCard-chip-item"} key={index}>{tag.name}</Chip>);
            } else {
                return (<div onClick={() => updateSearch(tag.name)} key={index} className="__eventCard-classic-tags-item"><span>{tag.name}</span>{index === tags.length - 1 ? "" : ", "}</div>);
            }
        });
    }

    showModal(data){
        this.props.showModal(data);
    }

    render() {
        const startTime = new Date(this.props.data.startTime);
        // const endTime = new Date(this.props.data.endTime);
        if (this.props.fancy) {
            return (
                <div className="eventCard-paper-wrapper">
                    <div className="__eventCard-container">
                        <div onClick={() => this.showModal(this.props.data)} className="__event-calendar-icon">
                            <div className="__event-calendar-icon-date">
                                {startTime.getDate()}
                            </div>
                            <div className={`__event-calendar-icon-month ${startTime < new Date() ? "__event-previousMonth" : ""}`}>
                                {monthNames[startTime.getMonth()]}
                            </div>
                        </div>
                        <div className="__event-information-wrapper">
                            <div onClick={() => this.showModal(this.props.data)} className="__event-information-top-container">
                                <div className="__event-information-container">
                                    <div className="__event-information-eventname">
                                        {this.props.data.name}
                                    </div>
                                    <div className="__event-information-locationname">
                                        Show Details
                            </div>
                                    <div onClick={() => this.showModal(this.props.data)} className="__event-information-description">
                                        {this.props.data.description}
                                    </div>
                                </div>
                                <div onClick={() => this.showModal(this.props.data)} className="__event-location-icon-container">
                                    <FontIcon 
                                    onClick={() => this.props.pushRouteForOrganizationId(this.props.data.organization_id)} 
                                    style={{ fontSize: 40 }} 
                                    className="material-icons __event-location-icon" 
                                    color={pinkA200}>location_on</FontIcon>
                                </div>
                            </div>
                            <div className="__event-location-tag-container">
                                {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                            </div>
                        </div>
                    </div>
                    {/* </Paper> */}
                </div>
            );
        } else {//Classic
            return (
                <div className="eventCard-paper-wrapper-classic">
                    <div onClick={() => this.showModal(this.props.data)} className="__eventCard-classic-title">
                        {this.props.data.name}
                    </div>
                    <div onClick={() => this.props.pushRouteForOrganizationId(this.props.data.organization_id)} className="__eventCard-classic-location">
                        Show Location
                </div>
                    <div className="__eventCard-classic-info">
                        {monthNames[startTime.getMonth()]} {startTime.getDate()}, {startTime.getFullYear()} - {this.props.data.description}
                    </div>
                    <div className="__eventCard-classic-tags">
                        Tags - {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                    </div>
                </div>
            );
        }
    }
}

export default EventCard;