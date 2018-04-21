import React, { Component } from 'react';
import { Dialog, FlatButton, GridList, GridTile, TextField } from 'material-ui';
import './style.css';

class MemberPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showProductDialog: false,
			newEmail: {}
		};
	}

	createUserInvitation() {
		fetch('/api/userinvite', {
			method: 'POST',
			body: JSON.stringify({
				email: this.state.newEmail.email,
				orgID: this.props.organizationInfo.id,
				name: this.state.newEmail.name
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

	render() {
		return (
			<div className="org-box org-members">
				<Dialog
					open={this.state.showProductDialog}
					actions={[
						<FlatButton
							label="Cancel"
							primary
							onClick={() => this.setState({ showProductDialog: false })}
						/>,
						<FlatButton
							label="Send Invite"
							primary
							keyboardFocused
							onClick={() => {
								this.createUserInvitation();
								this.setState({ showProductDialog: false });
							}}
						/>
					]}
					modal={false}
					style={{
						width: 378,
						left: this.state.showProductDialog ? 'calc(50% - 189px)' : '-1000px'
					}}
				>
					<GridList cols={1} cellHeight={64}>
						<GridTile>
							<TextField
								floatingLabelText="Full Name"
								value={this.state.newEmail.name || ''}
								onChange={e =>
									this.setState({
										newEmail: {
											...this.state.newEmail,
											name: e.target.value
										}
									})
								}
							/>
						</GridTile>
						<GridTile>
							<TextField
								floatingLabelText="Enter Email"
								value={this.state.newEmail.email || ''}
								onChange={e =>
									this.setState({
										newEmail: {
											...this.state.newEmail,
											email: e.target.value
										}
									})
								}
							/>
						</GridTile>
					</GridList>
				</Dialog>
				<span className="org-name-container">
					<span className="org-name org-section-label">Members</span>
					{this.props.hasAccess && (
						<i
							onClick={() => this.setState({ showProductDialog: true })}
							className="material-icons add-product-button"
						>
							add_box
						</i>
					)}
				</span>
				<div className="org-member-list">
					{this.props.organizationInfo.users.map(
						(m, index) =>
							m.name !== null ? (
								<div key={index} className="member-container">
									<div className="__member-info-name">
									{m.name}
									<a class="mailto" href={`mailto:${m.email}`}>
									<i className="material-icons expand-question">
										mail
									</i></a>
									</div>
									<div className="__member-status-container">
									<span className={`${m.role==="admin"?"__admin-status":"__member-status"}`}>{m.role}</span>
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

export default MemberPanel;
