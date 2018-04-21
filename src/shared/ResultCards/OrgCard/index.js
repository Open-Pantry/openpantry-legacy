import React from 'react';
import Paper from 'material-ui/Paper';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './style.css';
import Avatar from 'material-ui/Avatar';
import InventoryImage from 'shared/images/inventory.png';
import MapIcon from 'material-ui/svg-icons/maps/place';
import NotificationIcon from 'material-ui/svg-icons/maps/person-pin';
import InventoryIcon from 'material-ui/svg-icons/action/assignment';
import Badge from 'material-ui/Badge';
import Chip from 'shared/Chip';


import { grey50,grey700,cyan500,pinkA200 } from 'material-ui/styles/colors';


class OrgCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.getDescription = this.getDescription.bind(this);
        this.getChips = this.getChips.bind(this);
    }

    getDescription(description) {
        return description;
    }

    getChips(tags, fancy, updateSearch) {
        return tags.map((tag, index) => {
            if (fancy) {
                return (<Chip onClick={() => updateSearch(tag.name)} color="white" background="rgb(0, 188, 212)" className={"orgCard-chip-item"} key={index}>{tag.name}</Chip>);
            } else {
                return (<div key={index} onClick={() => updateSearch(tag.name)} className="__orgCard-classic-tags-item"><span>{tag.name}</span>{index === tags.length - 1 ? "" : ", "}</div>);
            }
        });
    }

    render() {
        if (this.props.fancy) {
            return (<div style={this.props.style} className="orgCard-paper-wrapper orgCard-hover">
                <div className="__orgCard-header-text-wrapper">
                    <div className="__orgCard-header-text-container">
                        <Avatar
                        	backgroundColor={grey50}
                            onClick={() => this.props.pushOrgRoute(`/org/${this.props.data.name}`)} 
                            style={{ cursor:"pointer",zIndex: 2, border: "2px solid white", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px" }}
                            src={this.props.data.logoName !== "" ? `${this.props.imageStartUrl}${this.props.data.logoName}` : InventoryImage}
                            size={50}
                        />
                        <div onClick={() => this.props.pushOrgRoute(`/org/${this.props.data.name}`)} className="__orgCard-title-header">
                            <div className="__orgCard-title">
                                {this.props.data.name}
                            </div>
                            <div className="__orgCard-location">
                                Show Details
                            </div>
                        </div>
                    </div>
                </div>
                <Paper style={{ borderRadius: 22 }} zDepth={2}>
                    <div className="__orgCard-container">
                        <div className="__orgCard-header">
                            <div className="__orgCard-icons-bar">
                                <MapIcon 
                                className="__orgCard-map-icon"
                                onClick={() => this.props.data.locationLat!==null?this.props.pushOrgRoute(`/search?results=map&initLat=${this.props.data.locationLat}&initLng=${this.props.data.locationLong}`):""} 
                                color={grey700} 
                                hoverColor={cyan500}
                                />
                                <Badge
                                    badgeContent={this.props.data.users.length}
                                    secondary={true}
                                    style={{ left: 10 }}
                                    badgeStyle={{ top: 12, right: 12, position: "absolute" }}
                                >
                                    <NotificationIcon color={grey700} />
                                </Badge>
                                <Badge
                                    badgeContent={this.props.data.products.length}
                                    primary={true}
                                    badgeStyle={{ top: 12, right: 12, position: "absolute" }}
                                >
                                    <InventoryIcon color={grey700} />
                                </Badge>

                            </div>
                        </div>
                        <div className="__orgCard-contents">
                            <div className="__orgCard-contents-description" onClick={() => this.props.pushOrgRoute(`/org/${this.props.data.name}`)}>
                            {this.getDescription(this.props.data.description)}
                            </div>
                            <span className="orgCard-horizontal-rule" />
                            <div ref={`chip-container-${this.props.data.organization_id}-${this.props.data.id}`} className="__orgCard-chip-container">
                                {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                            </div>
                        </div>

                    </div>
                </Paper></div>
            );
        } else {//classic
            return (
                <div className="__orgCard-paper-wrapper">
                    <div onClick={() => this.props.pushOrgRoute(`/org/${this.props.data.name}`)} className="__orgCard-classic-title">
                        {this.props.data.name}
                    </div>
                    <div style={{ display: this.props.data.locationLat !== null ? "inline-block" : "none" }} onClick={() => this.props.pushOrgRoute(`/search?results=map&initLat=${this.props.data.locationLat}&initLng=${this.props.data.locationLong}`)} className="__orgCard-classic-location">
                        Show Location
                    </div>
                    <div className="__orgCard-classic-info">
                        {this.props.data.description.length > 200 ? `${this.props.data.description.substring(0, 200)}...` : this.props.data.description}
                    </div>
                    <div className="__orgCard-classic-tags">
                        Tags - {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                    </div>
                </div>);
        }
    }
}

export default withRouter(connect(state => ({
  imageStartUrl:state.search.imageStartUrl
}), {
  })(OrgCard));