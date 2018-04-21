import React, { Component } from 'react';
import { Dialog, FlatButton, GridList, GridTile, TextField } from 'material-ui';

import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import EventModal from 'areas/SearchPage/components/SearchResults/components/EventModal.js';
import Tag from 'shared/Tag';

import './style.css';
class EventPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dateTime: null,
			showEventDialog: false,
			newEvent: {},
			newTagName: '',
			addingTag: -1,
			showEventModal:false,
			eventData:false
		};
		this.setStartDate = this.setStartDate.bind(this);
		this.setEndDate = this.setEndDate.bind(this);
		this.postTag = this.postTag.bind(this);
		this.deleteTag = this.deleteTag.bind(this);
		this.showEventModal = this.showEventModal.bind(this);
		this.closeEventModal = this.closeEventModal.bind(this);
	}

	getEventModal(){
		if(this.state.showEventModal){
			return <EventModal 
                showModal={this.state.showEventModal} 
                closeModal={this.closeEventModal} 
                selectedEvent={this.state.eventData}
				thisOrg={this.props.organizationInfo}
                />;
		}
	}

	setStartDate = dateTime => this.setState({ startTime: dateTime });
	setEndDate = dateTime => this.setState({ endTime: dateTime });

	createNewEvent() {
		fetch(`/api/event`, {
			method: 'POST',
			body: JSON.stringify({
				name: this.state.newEvent.name,
				description: this.state.newEvent.description,
				startTime: this.state.startTime,
				endTime: this.state.endTime,
				orgID: this.props.organization_id
			}),
			headers: {
				'content-type': 'application/json'
			}
		})
			.then(Response => Response.json())
			.then(Response => {
				this.props.getOrganization();
			});
	}

	postTag() {
		fetch(`/api/tag/${this.state.newTagName}?event_id=${this.state.addingTag}`, {
			method: 'POST'
		})
			.then(Response => Response.json())
			.then(Response => {
				this.setState({
					editingProduct: -1,
					addingTag: '',
					newTagName: ''
				});
				this.props.getOrganization();
			});
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

	deleteTag(id) {
		fetch(`/api/tag/${id}`, { method: 'DELETE' })
			.then(Response => Response.json())
			.then(Response => {
				this.props.getOrganization();
			});
	}

	render() {
		return (
			<div className="org-box org-events">
				<Dialog
					open={this.state.showEventDialog}
					actions={[
						<FlatButton
							label="Cancel"
							primary
							onClick={() => this.setState({ showEventDialog: false })}
						/>,
						<FlatButton
							label="Create"
							primary
							keyboardFocused
							onClick={() => {
								this.createNewEvent();
								this.setState({ showEventDialog: false });
							}}
						/>
					]}
					modal={false}
					style={{
						width: 378,
						left: this.state.showEventDialog ? 'calc(50% - 189px)' : '-1000px'
					}}
				>
					<GridList cols={1} cellHeight={64}>
						<GridTile>
							<TextField
								floatingLabelText="Event Title"
								value={this.state.newEvent.name || ''}
								onChange={e =>
									this.setState({
										newEvent: {
											...this.state.newEvent,
											name: e.target.value
										}
									})
								}
							/>
						</GridTile>
						<GridTile>
							<TextField
								floatingLabelText="Event Description"
								value={this.state.newEvent.description || ''}
								onChange={e =>
									this.setState({
										newEvent: {
											...this.state.newEvent,
											description: e.target.value
										}
									})
								}
							/>
						</GridTile>
						<GridTile>
							<DateTimePicker
								floatingLabelText="Start Date"
								minutesStep={10}
								onChange={this.setStartDate}
								DatePicker={DatePickerDialog}
								TimePicker={TimePickerDialog}
							/>
						</GridTile>
						<GridTile>
							<DateTimePicker
								minutesStep={10}
								floatingLabelText="End Date"
								onChange={this.setEndDate}
								DatePicker={DatePickerDialog}
								TimePicker={TimePickerDialog}
							/>
						</GridTile>
					</GridList>
				</Dialog>
				{this.getEventModal()}
				<span className="org-name-container">
					<span className="org-name org-section-label">Events</span>
					{this.props.hasAccess && (
						<i
							onClick={() => this.setState({ showEventDialog: true })}
							className="material-icons add-product-button"
						>
							add_box
						</i>
					)}
				</span>
				<div className="org-event-list">
					{this.props.organizationEvents.map(
						(m, index) =>
							m.name !== null ? (
								<div key={index} className="event-info">
									<div className="event-info-container"onClick={() => this.showEventModal(m)}>
										<div className="event-info-title">{m.name}</div>
										<div className="event-info-details">(click to see details)</div>
									</div>
									<div className="tag-list">
										{this.state.addingTag === m.id
											? [
													<input
														key={'input'}
														value={this.state.newTagName || ''}
														onChange={e =>
															this.setState({
																newTagName: e.target.value
															})
														}
													/>,
													<i
														key="cancel"
														className="material-icons edit"
														onClick={() =>
															this.setState({ addingTag: -1 })
														}
													>
														cancel
													</i>,
													<i
														key={'button'}
														className="material-icons add-tag-button"
														onClick={this.postTag}
													>
														save
													</i>
											  ]
											: this.props.hasAccess && (
													<i
														className="material-icons add-tag-button"
														onClick={() => {
															this.setState({ addingTag: m.id });
														}}
													>
														add_box
													</i>
											  )}
										{(m.tags || []).map(tag => (
											<Tag
												key={tag.name}
												name={tag.name}
												onClick={() => this.deleteTag(tag.id)}
												showIcon={this.props.hasAccess}
											/>
										))}
									</div>
								</div>
							) : (
								''
							)
					)}
				</div>
			</div>
		);
	}
}

export default EventPanel;
