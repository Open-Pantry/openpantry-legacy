import React from 'react';
import Paper from 'material-ui/Paper';
import Chip from 'shared/Chip';
import Avatar from 'material-ui/Avatar';
import FoodIcon from 'shared/images/food.png';
import GeneralIcon from 'shared/images/general.png';
import ClothingIcon from 'shared/images/clothing.png';
import NotificationIcon from 'material-ui/svg-icons/social/location-city';
import InventoryIcon from 'material-ui/svg-icons/device/storage';
import Badge from 'material-ui/Badge';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { grey700 } from 'material-ui/styles/colors';

import './style.css';

class ProductCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemType:null
        };

        this.getChips = this.getChips.bind(this);
        this.kFormatter = this.kFormatter.bind(this);
        this.pushOrgRouteFromId = this.pushOrgRouteFromId.bind(this);
        this.getOrgNameFromId = this.getOrgNameFromId.bind(this);
    }

    pushOrgRouteFromId(orgId){
        const org = this.props.orgs.find((organization) => {
            return orgId == organization.id;
        });
        this.props.history.push(`org/${org.name}`);
    }

    getOrgNameFromId(productId){
        return this.props.orgs.find((organization) => {
            const product = organization.products.find((product) => {
                product.id === productId
            });
            if(product !== null){
                return true;
            }else{
                return false;
            }
        }).name;
    }

    componentWillMount(){
        this.props.data.tags.map((tag, index) => {
            if(this.state.itemType == null){
                if(tag.name.toLowerCase().includes("food")){
                    this.setState({
                        itemType:"food"
                    });
                }else if(tag.name.toLowerCase().includes("cloth")){
                    this.setState({
                        itemType:"clothing"
                    });
                }
            }
        });
    }

    getChips(tags, fancy, updateSearch) {
        return tags.map((tag, index) => {
            if (fancy) {
                return <Chip onClick={() => updateSearch(tag.name)} key={index} color="white" background="rgb(0, 188, 212)">{tag.name}</Chip>
            } else {
                return (<div onClick={() => updateSearch(tag.name)} key={index} className="__productCard-classic-tags-item"><span>{tag.name}</span>{index === tags.length - 1 ? "" : ", "}</div>);
            }
        });
    }

    kFormatter(num) {
        return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
    }

    render() {
        if (this.props.fancy) {
            return (
                <div className="productCard-paper-wrapper product-hover">
                    <Paper onClick={() => this.pushOrgRouteFromId(this.props.data.organization_id)} style={{ cursor:"pointer",height: "50px", borderBottomLeftRadius: "25px", "borderTopLeftRadius": "25px" }} zDepth={2}>
                        <div className="__productCard-container">
                            <div className="__productCard-avatar-container">
                                <Avatar
                                    style={{ "display": "flex", "flexDirection": "row", "justifyContent": "center" }}
                                    src={this.state.itemType===null?GeneralIcon:this.state.itemType==="food"?FoodIcon:ClothingIcon}
                                    size={50}
                                />
                            </div>
                            <div className="__productCard-title-container">
                                {this.props.data.name}
                                <div className="__productCard-location-container">
                                    Show Details
                        </div>
                            </div>
                            <div className="__productCard-icon-container">
                                <Badge
                                    style={{ padding: "0px 12px" }}
                                    badgeContent={this.kFormatter(this.props.data.amount)}
                                    secondary={true}
                                    badgeStyle={{ top: -10, right: 0, position: "absolute" }}
                                >
                                    <InventoryIcon style={{ padding: 0 }} color={grey700} />
                                </Badge>
                            </div>
                        </div>
                    </Paper>
                    {this.props.data.tags.length > 0 ? <div className="__productCard-tags-wrapper">
                        <div className="__productCard-tags-icon-spacing"></div>
                        <Paper style={{ borderTop:"2px solid rgb(0, 188, 212)",overflow: "hidden", "boxShadow": "rgba(0, 0, 0, 0.16) 0px 5px 10px, rgba(0, 0, 0, 0.23) 0px 15px 35px", "borderBottomLeftRadius": "25px", maxWidth: "calc(100% - 50px)" }} zDepth={2}>
                            <div className="__productCard-tags-container">
                                {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                            </div>
                        </Paper></div> : ""}
                </div>);
        } else {//We are rendering a basic card
            return (
                <div className="productCard-paper-wrapper">
                    <div onClick={() => this.pushOrgRouteFromId(this.props.data.organization_id)}  className="__productCard-classic-title">
                        {this.props.data.name}
                    </div>
                    <div onClick={() => this.pushOrgRouteFromId(this.props.data.organization_id)} className="__productCard-classic-location">
                        Show Details <i style={{position:"relative",left:-4,height:13,top:-5}}className="material-icons">
									expand_more
								</i>
                    </div>
                    <div className="__productCard-classic-info">
                        {`${this.getOrgNameFromId(this.props.data.id)} has ${this.kFormatter(this.props.data.amount)} units of this item.`}
                </div>
                    <div className="__productCard-classic-tags">
                        Tags - {this.getChips(this.props.data.tags, this.props.fancy, this.props.updateSearch)}
                    </div>
                </div>
            );
        }
    }
}

// Export the App component
export default withRouter(connect(state => ({
  orgs:state.search.orgs
}), {
  })(ProductCard));
