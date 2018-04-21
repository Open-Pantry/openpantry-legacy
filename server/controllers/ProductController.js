var models = require('../models/database');
var Product = models.Product;
var Stock = models.Stock;
var Tag = models.Tag;

module.exports.postTag = (req, res) => {
	Tag.findOrCreate({
		where: {
			product_id: req.query.product_id,
			organization_id: req.query.organization_id,
			event_id: req.query.event_id,
			name: req.params.tag_name
		}
	})
		.spread((tag, create) => {
			if (!create) {
				throw new Error('Tag not created');
			} else {
				res.status(200).send({});
			}
		})
		.catch(err => res.status(400).send(err));
};

createTag = (tag, product_id) => {
	console.log('createTag', tag, product_id);
	Tag.findOrCreate({
		where: {
			product_id,
			name: tag
		}
	}).spread((tag, create) => {
		if (!create) {
			throw new Error('Tag not created');
		}
	});
};

module.exports.createProduct = (req, res) => {
	console.log('\n\n\n', req.body);
	Product.findOrCreate({
		where: {
			name: req.body.name,
			organization_id: req.body.organization_id
		},
		defaults: { unit_description: req.body.unit_description }
	})
		.spread((product, create) => {
			if (create) {
				Stock.findOrCreate({
					where: {
						product_id: product.get({ plain: true }).id,
						organization_id: req.body.organization_id
					},
					defaults: {
						amount: req.body.amount
					}
				}).spread((stock, create) => {
					if (create) {
						req.body.tags.forEach(tag =>
							createTag(tag, product.get({ plain: true }).id)
						);
						res.status(200).send({ stock });
					} else {
						res.status(400).send({ error: 'stock not created' });
					}
				});
			} else {
				res.status(400).send({ error: 'product not created/already exists' });
			}
		})
		.catch(err => res.status(400).send(err));
};

module.exports.updateStock = (req, res) => {
	console.log(req.body);
	Stock.update(
		{
			amount: req.body.amount
		},
		{
			where: {
				product_id: req.body.product_id,
				organization_id: req.body.organization_id
			}
		}
	)
		.then(stock => {
			res.send(stock);
		})
		.catch(err => res.send(err));
};

module.exports.deleteProduct = (req, res) => {
	Product.destroy({ where: { id: req.params.product_id } })
		.then(() => {
			Stock.destroy({ where: { product_id: req.params.product_id } });
			res.status(200).send({});
		})
		.catch(err => res.send(err));
};

module.exports.deleteTag = (req, res) => {
	Tag.destroy({ where: { id: req.params.tag_id } })
		.then(() => res.status(200).send({}))
		.catch(err => res.send(err));
};
