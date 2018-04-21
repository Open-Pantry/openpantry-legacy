const models = require('../models/database');

const Organization = models.Organization;
const Tag = models.Tag;
const sequelize = require('sequelize');

// For uploading image
const fs = require('fs');

module.exports.createOrganization = function(req, res) {
	if (req.body.imageName !== '') {
		const buffer = new Buffer(req.body.image.split(',')[1], 'base64');

		fs.writeFile(`uploads/${req.body.imageName}`, buffer, 'binary', (err, data) => {
			if (err) {
				console.log(err); // writes out file without error, but it's not a valid image
			} else {
				// console.log("Success: ",data);
			}
		});
	}
	const newOrg = {
		name: req.body.organizationName,
		location: req.body.location,
		description: req.body.description,
		visibility: req.body.visibility,
		logoName: req.body.imageName === '' ? '' : `uploads/${req.body.imageName}`
	};
	models.User.find({ where: { email: req.body.email, role: 'admin' } }).then(user => {
		if (!user) {
			Organization.create(newOrg)
				.then((org, create) => {
					if (create) {
					}
					const newUser = {
						name: req.body.name,
						email: req.body.email,
						password: req.body.password,
						adminStatus: 1,
						role: 'admin',
						organization_id: org.id
					};
					models.User.create(newUser)
						.then((user, create) => {
							if (create) {
							}
							res.send(user);
						})
						.catch(err => {
							res.send(err);
						});
				})
				.catch(err => {
					res.send({ 'Error Creating Org:': err });
				});
		} else {
			res.send({ error: 202 });
		}
	});
};

module.exports.getOrganizations = function(req, res) {
	Organization.findAll().then(org => {
		if (org) {
			res.send({ status: 200, org });
		} else {
			res.json({
				status: 404,
				message: 'Could not get organizations'
			});
		}
	});
};

module.exports.getFullOrganizationData = function(req, res) {
	let organizations = [];
	Organization.findAll({ raw: true }).then(orgs => {
		organizations = orgs;
		if (organizations) {
			const orgRequests = organizations.map((org, orgIndex) => {
				const info = Object.assign({}, org);

				// Get Tag Info
				const tagRequest = [
					Tag.findAll({
						where: { organization_id: org.id },
						raw: true
					}).then(orgTags => {
						info.tags = orgTags;
					})
				];

				// Get Event Info
				const eventRequests = [
					models.Event.findAll({
						where: { organization_id: org.id },
						raw: true
					}).then(events => {
						info.events = events;
						// Get event tags
						const eventTagRequests = events.map((orgEvent, index) =>
							Tag.findAll({
								where: { event_id: orgEvent.id },
								raw: true
							}).then(tags => {
								const updatedEvent = Object.assign({}, orgEvent, {
									tags
								});
								info.events[index] = updatedEvent;
							})
						);

						return Promise.all(eventTagRequests);
					})
				];

				// Get user info
				const userRequest = models.sequelize
					.query(
						`SELECT u.name FROM users AS u join organizations AS o on u.organization_id = o.id WHERE u.organization_id = ${
							org.id
						};`
					)
					.spread(users => {
						info.users = users;
					});

				// Get Product Info
				const productRequest = [
					models.sequelize
						.query(
							`SELECT p.name,o.id as organization_id, s.amount, p.id as product_id, s.id as stock_id FROM stocks AS s join organizations AS o on s.organization_id = o.id join products AS p on p.id = s.product_id WHERE p.organization_id = ${
								org.id
							};`,
							{ type: sequelize.QueryTypes.SELECT }
						)
						.then(products => {
							info.products = products;
							const requests = (products || []).map((product, index) =>
								Tag.findAll({
									where: { product_id: product.product_id },
									raw: true
								}).then(tags => {
									console.log('tags');
									const updatedProduct = Object.assign({}, product, {
										tags
									});
									info.products[index] = updatedProduct;
								})
							);

							return Promise.all(requests).then(() => {
								orgs[orgIndex] = info;
							});
						})
				];

				return Promise.all(
					tagRequest
						.concat(eventRequests)
						.concat(productRequest)
						.concat([userRequest])
				);
			});
			Promise.all(orgRequests).then(() => {
				console.log('Sending data!');
				res.send({ status: 200, orgs });
			});
		} else {
			res.send({ status: 500, message: 'Could not get organization data.' });
		}
	});
};

module.exports.getOrganizationByNameLogin = function(req,res){
	const query = {
		where: { name: req.query.organizationName },
		raw: true
	};
	Organization.find(query).then(org => {
		if(org == null){
			res.send({status:404});
		}else{
			res.send({status:200,org});
		}
	});
};

module.exports.getOrganizationByName = function(req, res) {
	const query = {
		where: { name: req.query.organizationName },
		raw: true
	};
	Organization.find(query).then(org => {
		if (org) {
			const info = Object.assign({}, org);

			// Get Tag Info
			const tagRequest = [
				Tag.findAll({
					where: { organization_id: org.id },
					raw: true
				}).then(orgTags => {
					info.tags = orgTags;
				})
			];

			// Get Event Info
			const eventRequests = [
				models.Event.findAll({
					where: { organization_id: org.id },
					raw: true
				}).then(events => {
					info.events = events;
					// Get event tags
					const eventTagRequests = events.map((orgEvent, index) =>
						Tag.findAll({
							where: { event_id: orgEvent.id },
							raw: true
						}).then(tags => {
							const updatedEvent = Object.assign({}, orgEvent, {
								tags
							});
							info.events[index] = updatedEvent;
						})
					);

					return Promise.all(eventTagRequests);
				})
			];

			// Get user info
			const userRequest = models.sequelize
				.query(
					`SELECT u.name,u.role,u.email FROM users AS u join organizations AS o on u.organization_id = o.id WHERE u.organization_id = ${
						org.id
					};`
				)
				.spread(users => {
					info.users = users;
				});

			// Get Product Info
			const productRequest = [
				models.sequelize
					.query(
						`SELECT p.name, s.amount, p.id as product_id, s.id as stock_id FROM stocks AS s join organizations AS o on s.organization_id = o.id join products AS p on p.id = s.product_id WHERE p.organization_id = ${
							org.id
						};`,
						{ type: sequelize.QueryTypes.SELECT }
					)
					.then(products => {
						info.products = products;
						const requests = (products || []).map((product, index) =>
							Tag.findAll({
								where: { product_id: product.product_id },
								raw: true
							}).then(tags => {
								console.log('tags');
								const updatedProduct = Object.assign({}, product, {
									tags
								});
								info.products[index] = updatedProduct;
							})
						);

						return Promise.all(requests);
					})
			];

			Promise.all(
				tagRequest
					.concat(eventRequests)
					.concat(productRequest)
					.concat([userRequest])
			).then(() => {
				res.send(info);
			});
		} else {
			res.json({
				status: 400,
				message: 'Could not find organization.'
			});
		}
	});
};

module.exports.updateOrganizationInfo = (req, res) => {
	if (req.body.imageName !== '' && req.body.image !== null) {
		const buffer = new Buffer(req.body.image.split(',')[1], 'base64');
		fs.writeFile(`uploads/${req.body.imageName}`, buffer, 'binary', (err, data) => {
			if (err) {
				console.log(err); // writes out file without error, but it's not a valid image
			} else {
				console.log('\n\n\nWe uploaded an image!');
				// console.log("Success: ",data);
			}
		});
	}

	Organization.update(
		{
			description: req.body.description,
			locationName: req.body.locationName,
			locationLat: `${req.body.locationLat}`,
			locationLong: `${req.body.locationLong}`,
			logoName: req.body.image !== null ? `uploads/${req.body.imageName}` : req.body.imageName
		},
		{
			where: {
				id: req.params.orgID
			}
		}
	)
		.then(organization => {
			res.send(organization);
		})
		.catch(err => res.send(err));
};
