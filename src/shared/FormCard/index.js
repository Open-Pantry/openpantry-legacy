import React from 'react';
import NoImage from 'shared/images/NoImage.png';
import CircularProgress from 'material-ui/CircularProgress';
import './style.css';

const FormCard = (props) => {
    return (
        <div className={props.className}>
            <h2 className="__login-header">{props.headerText}</h2>
            <span className="__hr-header" />
            {props.orgImage ? <div><div className="__logo-container">
                <img style={{ "width": "64px", "height": "64px" }} alt={NoImage} src={props.orgImage} />
            </div> <span className="__hr-header" /></div> : ""}
            {props.loading?
            <div className="loading-bar-wrapper">
            <CircularProgress size={150} thickness={10} />
            <div className="__loading-bar-text">
            {props.loadingText}
            </div>
            </div>:props.children
            }
            <span className="__hr-header" />
        </div>
    );
};

export default FormCard;