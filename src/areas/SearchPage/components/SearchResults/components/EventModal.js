import React from 'react';
import { Dialog, FlatButton, GridList, GridTile, TextField } from 'material-ui';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './style.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

class EventModal extends React.Component {
	constructor(props) {
		super(props);

		this.getFormattedTime = this.getFormattedTime.bind(this);
	}
	getFormattedTime(time,from) {
		let newTime = new Date(time);
		if (newTime !== null) {
			return `${monthNames[newTime.getMonth()]} ${this.getOrdinalNum(newTime.getDate())}, ${newTime.getFullYear()} ${from?"from":"to"} ${ newTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
		}
	}

	getOrdinalNum(n) {
		return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
	}

	getOrganizationFromId(orgId) {
		return this.props.orgs.find((org) => {
			return org.id === orgId
		}).name;
	}

	render() {
		if (this.props.selectedEvent !== null) {
			return <Dialog
				open={this.props.showModal}
				actions={[
					<FlatButton
						label="Close"
						primary
						onClick={this.props.closeModal}
					/>
				]}
				modal={false}
				onRequestClose={this.props.closeModal}
			>
				<div className="__event-modal-container">
					<div className="__event-modal-header">
						<span>{this.props.selectedEvent.name}</span>
						<span onClick={() => this.props.history.push(`/org/${this.getOrganizationFromId(this.props.selectedEvent.organization_id)}`)} className="__event-hosted-by">
							Hosted By: {this.getOrganizationFromId(this.props.selectedEvent.organization_id)}
						</span>
					</div>
					<div className="__event-dates-container">
						<div className="__event-dates-headers">
							<span>Start Time:</span>
							<span>End Time  :</span>
						</div>
						<div className="__event-dates-times">
							<span>{this.getFormattedTime(this.props.selectedEvent.startTime,true)}</span>
							<span>{this.getFormattedTime(this.props.selectedEvent.endTime,false)}</span>
						</div>
					</div>
					<div className="__event-description">
						{this.props.selectedEvent.description}
					</div>
					<div className="__event-chips-container">
					</div>
				</div>
			</Dialog>;
		} else {
			return (<div style={{ display: "none" }} />);
		}
	}
}

// Export the App component
export default withRouter(connect(state => ({
	orgs: state.search.orgs
}), {
	})(EventModal));
