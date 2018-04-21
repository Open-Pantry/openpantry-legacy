import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'shared/Header';
import SwipeableViews from 'react-swipeable-views';
import { Tabs, Tab } from 'material-ui/Tabs';

import EventPanel from './EventPanel';
import MemberPanel from './MemberPanel';
import ProductPanel from './ProductPanel';

import OrgPanel from './OrgPanel';

import Footer from 'shared/Footer';
import './styles.css';

class OrganizationView extends Component {
	constructor(props) {
		super(props);
		let initWindowWith = Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.offsetWidth,
			document.documentElement.clientWidth
		);
		this.state = {
			loading: true,
			showProductDialog: false,
			newProduct: {},
			combinedPanel: initWindowWith < 800,
			slideIndex: 0
		};

		this.getOrganization = this.getOrganization.bind(this);
		this.updateOrganizationInfo = this.updateOrganizationInfo.bind(this);
		this.handleSlideChange = this.handleSlideChange.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
		this.getOrganization();
	}

	updateDimensions() {
		let initWindowWith = Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.offsetWidth,
			document.documentElement.clientWidth
		);
		this.setState({
			combinedPanel: initWindowWith < 800
		});
	}

	handleSlideChange = value => {
		this.setState({
			slideIndex: value
		});
	};

	updateOrganizationInfo(data) {
		if (
			data.organizationInfo.description !== this.state.organizationInfo.description ||
			data.image !== null ||
			(data.location !== null &&
				data.location.description !== this.state.organizationInfo.locationName)
		) {
			const config = {
				method: 'POST',
				body: JSON.stringify({
					description: data.organizationInfo.description,
					locationName:
						data.location !== null
							? data.location.description
							: this.state.organizationInfo.locationName,
					locationLat:
						data.location !== null
							? data.location.location.lat
							: this.state.organizationInfo.locationLat,
					locationLong:
						data.location !== null
							? data.location.location.lng
							: this.state.organizationInfo.locationLong,
					imageName:
						data.imageName !== null
							? data.imageName
							: this.state.organizationInfo.logoName,
					image: data.image
				}),
				headers: {
					'content-type': 'application/json'
				}
			};
			if (data.imageName !== null) {
				config.image = data.image;
			}
			fetch(`/api/organization/${data.organizationInfo.id}`, config)
				.then(Response => Response.json())
				.then(Response => {
					if (Response.status === 400) {
						this.setState({ loading: false, notFound: true });
					} else {
						this.getOrganization();
						this.forceUpdate();
					}
				})
				.catch(err => this.setState({ loading: false }));
		}
	}

	getOrganizationPanels() {
		if (this.state.combinedPanel) {
			return (
				<div className="organization">
					<div className="org-column org-col-lg">
						<OrgPanel
							updateOrganizationInfo={this.updateOrganizationInfo}
							getOrganization={this.getOrganization}
							organizationInfo={this.state.organizationInfo}
							hasAccess={
								this.state.organizationInfo.id === this.props.loginData.orgID
							}
						/>
						<div className="org-box tab-wrapper">
							<Tabs
								onChange={this.handleSlideChange}
								value={this.state.slideIndex}
								className="__about-page-tabs"
								style={{ backgroundColor: 'white', borderRadius: '16px' }}
								tabItemContainerStyle={{ backgroundColor: 'white', borderRadius: '16px' }}
							>
								<Tab label="Products" value={0} style={{ color: 'rgb(0, 188, 212)', fontWeight: '600' }}/>
								<Tab label="Events" value={1} style={{ color: 'rgb(0, 188, 212)', fontWeight: '600' }} />
								<Tab label="Members" value={2} style={{ color: 'rgb(0, 188, 212)', fontWeight: '600' }} />
							</Tabs>
							<SwipeableViews
								index={this.state.slideIndex}
								onChangeIndex={this.handleSlideChange}
							>
								<ProductPanel
									getOrganization={this.getOrganization}
									organizationInfo={this.state.organizationInfo}
									hasAccess={
										this.state.organizationInfo.id ===
										this.props.loginData.orgID
									}
								/>
								<EventPanel
									organization_id={this.state.organizationInfo.id}
									getOrganization={this.getOrganization}
									organizationInfo={this.state.organizationInfo}
									organizationEvents={this.state.organizationInfo.events}
									hasAccess={
										this.state.organizationInfo.id ===
										this.props.loginData.orgID
									}
								/>
								<MemberPanel
									getOrganization={this.getOrganization}
									organizationInfo={this.state.organizationInfo}
									hasAccess={
										this.state.organizationInfo.id ===
										this.props.loginData.orgID
									}
								/>
							</SwipeableViews>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="organization">
					<div className="org-column org-col-lg">
						<OrgPanel
							updateOrganizationInfo={this.updateOrganizationInfo}
							organizationInfo={this.state.organizationInfo}
							getOrganization={this.getOrganization}
							hasAccess={
								this.state.organizationInfo.id === this.props.loginData.orgID
							}
						/>
						<ProductPanel
							getOrganization={this.getOrganization}
							organizationInfo={this.state.organizationInfo}
							hasAccess={
								this.state.organizationInfo.id === this.props.loginData.orgID
							}
						/>
					</div>
					<div className="org-column org-col-sm">
						<EventPanel
							organization_id={this.state.organizationInfo.id}
							getOrganization={this.getOrganization}
							organizationEvents={this.state.organizationInfo.events}
							hasAccess={
								this.state.organizationInfo.id === this.props.loginData.orgID
							}
						/>
						<MemberPanel
							getOrganization={this.getOrganization}
							organizationInfo={this.state.organizationInfo}
							hasAccess={
								this.state.organizationInfo.id === this.props.loginData.orgID
							}
						/>
					</div>
				</div>
			);
		}
	}

	getOrganization() {
		fetch(`/api/organization?organizationName=${this.props.match.params.orgId}`)
			.then(Response => Response.json())
			.then(Response => {
				if (Response.status === 400) {
					this.setState({ loading: false, notFound: true });
				} else {
					this.setState({
						organizationInfo: {
							...Response
						},
						loading: false
					});
				}
			})
			.catch(err => this.setState({ loading: false }));
	}

	render() {
		if (!this.state.organizationInfo || this.state.loading) {
			return <div className="organization-container">Loading</div>;
		}
		return (
			<div className="organization-container-wrapper">
				<Header style={{ background: '#fafafa' }} orgPage={true} />
				<div className="organization-container">{this.getOrganizationPanels()}</div>
				<Footer />
			</div>
		);
	} // render
}

export default withRouter(
	connect(state => ({
		data: state.home.data,
		loginData: state.login
	}))(OrganizationView)
);
