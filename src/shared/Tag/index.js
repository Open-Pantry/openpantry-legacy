import React from 'react';
import './style.css'

const Tag = ({ name, onClick, showIcon }) => (
	<div className="tag">
		{name}
		{showIcon && <i className="material-icons" onClick={onClick}>
			cancel
		</i>}
	</div>
);
export default Tag;
