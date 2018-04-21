import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';
import Avatar from 'material-ui/Avatar';
import NoImage from 'shared/images/NoImage.png';
import RaisedButton from 'material-ui/RaisedButton';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { grey50 } from 'material-ui/styles/colors';
import Tag from 'shared/Tag';

import './style.css';
class OrgPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			organizationInfo: this.props.organizationInfo,
			location: null,
			image: null,
			imageName: null,
			addingTag: false,
			newTagName: ''
		}; //Store data for org changes

		this.getOrganizationAddress = this.getOrganizationAddress.bind(this);
		this.getOrganizationDescription = this.getOrganizationDescription.bind(this);
		this.onSuggestSelect = this.onSuggestSelect.bind(this);
		this.updateOrganizationInfo = this.updateOrganizationInfo.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
		this.postTag = this.postTag.bind(this);
	}

	onSuggestSelect(suggest) {
		this.setState({
			location: suggest
		});
	}

	getOrganizationAddress() {
		if (this.state.editMode) {
			return (
				<Geosuggest
					initialValue={this.state.organizationInfo.locationName || ''}
					placeholder="Enter your address, the more details, the easier it is for users to find you."
					onSuggestSelect={this.onSuggestSelect}
					style={{ input: { color: 'rgb(0, 188, 212)', fontSize: '.9em' } }}
				/>
			);
		} else {
			return (
				<a
					target="__blank"
					href={`http://maps.google.com/?ll=${this.state.organizationInfo.locationLat},${
						this.state.organizationInfo.locationLong
					}`}
				>
					{this.state.organizationInfo.locationName}
				</a>
			);
		}
	}

	getOrganizationDescription() {
		if (this.state.editMode) {
			return (
				<textarea
					onChange={e =>
						this.setState({
							...this.state,
							organizationInfo: {
								...this.state.organizationInfo,
								description: e.target.value
							}
						})
					}
					placeholder="Description"
					value={this.state.organizationInfo.description}
				/>
			);
		} else {
			return this.state.organizationInfo.description;
		}
	}

	updateOrganizationInfo() {
		if (this.state.editMode) {
			// Update the info
			this.props.updateOrganizationInfo({
				organizationInfo: this.state.organizationInfo,
				location: this.state.location,
				image: this.state.image,
				imageName: this.state.imageName
			});
		}
		this.setState({ editMode: this.state.editMode ? false : true });
	}

	handleUpload(event) {
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		let filename = event.target.files[0].name;
		reader.onloadend = () => {
			this.setState({
				image: reader.result,
				imageName: filename
			});
		};
		reader.readAsDataURL(file);
	}

	postTag() {
		fetch(
			`/api/tag/${this.state.newTagName}?organization_id=${this.state.organizationInfo.id}`,
			{ method: 'POST' }
		)
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

	deleteTag(id) {
		fetch(`/api/tag/${id}`, { method: 'DELETE' })
			.then(Response => Response.json())
			.then(Response => {
				this.props.getOrganization();
			});
	}

	render() {
		return (
			<div className="org-box org-information">
				<span className="org-name">
					<div className="org-name-avatar-wrapper">
						<Avatar
							backgroundColor={grey50}
							src={
								this.state.organizationInfo.logoName !== ''
									? `${this.props.imageStartUrl}${
											this.state.organizationInfo.logoName
									  }`
									: NoImage
							}
							size={48}
							style={{ display: this.state.editMode ? 'none' : 'inline-block' }}
						/>
						<RaisedButton
							style={{ display: this.state.editMode ? 'inline-block' : 'none' }}
							className="org-image-upload-button"
							label={<i className="material-icons edit">build</i>}
							primary={true}
						>
							<input
								onChange={this.handleUpload}
								id="imageButton"
								className="__newOrg-logo-upload"
								type="file"
							/>
						</RaisedButton>
						<span style={{ paddingLeft: 12 }} id="org-title">
							{this.state.organizationInfo.name}
						</span>
					</div>
					{this.props.hasAccess && (
						<i
							onClick={this.updateOrganizationInfo}
							className="material-icons edit"
							style={{ color: this.state.editMode ? 'rgb(255, 64, 129)' : 'inherit' }}
						>
							{this.state.editMode ? 'save' : 'build'}
						</i>
					)}
				</span>
				<span className="org-address">{this.getOrganizationAddress()}</span>
				<span className="org-desc">{this.getOrganizationDescription()}</span>
				<div className="tag-list">
					{this.state.editMode &&
						!this.state.addingTag && (
							<i
								className="material-icons add-tag"
								onClick={() => this.setState({ addingTag: true })}
							>
								add_box
							</i>
						)}
					{
						this.state.addingTag &&
						this.state.editMode && [
							<i key="save" className="material-icons add-tag" onClick={this.postTag}>
								save
							</i>,
							<i
								key="cancel"
								className="material-icons add-tag"
								onClick={() => this.setState({ addingTag: false })}
							>
								cancel
							</i>
						]}
					{this.state.addingTag &&
						this.state.editMode && (
							<input
								value={this.state.newTagName || ''}
								onChange={e => this.setState({ newTagName: e.target.value })}
							/>
						)}
					{this.props.organizationInfo.tags.map(tag => (
						<Tag
							key={tag.id}
							name={tag.name}
							onClick={() => this.deleteTag(tag.id)}
							showIcon={this.props.hasAccess}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default withRouter(connect(state => ({
  imageStartUrl:state.search.imageStartUrl
}), {
  })(OrgPanel));
