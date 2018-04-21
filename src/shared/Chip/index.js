import React from 'react';
import './style.css';

const Chip = (props) => {
    return(
    <div onClick={props.onClick} style={{background:`${props.background}`,color:`${props.color}`}}className={`base-chip-container ${props.classNmae}`}>
        {props.children}
    </div>)
};

export default Chip;