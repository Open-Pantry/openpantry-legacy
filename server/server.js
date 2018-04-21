const express = require('express');
var fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
const bodyParser = require('body-parser');
var path = require('path');

const models = require('./models/database');
var TemplateCache = require('./models/cache/template-cache.js');
const mainController = require('./controllers/MainController.js');
const userController = require('./controllers/UserController.js');
const OrganizationController = require('./controllers/OrganizationController.js');
const ProductController = require('./controllers/ProductController.js');
const EventController = require('./controllers/EventController.js');

var Auth = require('./middleware/auth.js');

const static = path.resolve(`${__dirname}/build/`);
const indexFile = path.resolve(`${static}/index.html`);

models.sequelize.authenticate().then(
	err => {
		console.log('Connection established with DB');
	},
	err => {
		console.log('Unable to connect to DB');
	}
);
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
	// CORS headers
	res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

app.use(express.static(static));

// Send the index file
app.get('/', (req, res) => {
	console.log('Sending index file/');
	res.sendFile(indexFile);
});

// ROUTES & CONTROLLER CALLS TO BE DECLARED IN 'routes.js'
app.all('/api/auth/*', [require('./middleware/validateRequest')]);

// =============================== AUTH ROUTES ==========================

app.post('/api/login', Auth.login);

app.get('/api/auth/test', (req, res) => {
	res.send('success');
});

// =============================== ORG ROUTES =============================== //
app.post('/api/organization', OrganizationController.createOrganization);
app.post('/api/organization/:orgID', OrganizationController.updateOrganizationInfo);
app.get('/api/organizations', OrganizationController.getOrganizations);
app.get('/api/organizationsfull', OrganizationController.getFullOrganizationData);
app.get('/api/organization', OrganizationController.getOrganizationByName);
app.get('/api/organizationsimple',OrganizationController.getOrganizationByNameLogin);

// =============================== ORG ROUTES =============================== //

app.post('/api/event', EventController.createNewEvent);

// =============================== ORG ROUTES =============================== //

app.post('/api/product', ProductController.createProduct);
app.delete('/api/product/:product_id', ProductController.deleteProduct);
app.put('/api/stock', ProductController.updateStock);
app.post('/api/userinvite', userController.createUserWithInvitation);
app.post('/api/firstLogin', userController.updateAndLoginUser);
app.delete('/api/tag/:tag_id', ProductController.deleteTag);
app.post('/api/tag/:tag_name', ProductController.postTag);

// ===============================  ROUTES =============================== //

app.get('/api/test', (req, res) => {
	res.send({ 'Hello World!': 'Hello World!' });
});

app.post('/api/user', userController.createUser);

// =============================== END ROUTES =============================== //

app.get('/*', (req, res) => {
	res.sendFile(indexFile);
});

let templateCache = new TemplateCache();
console.log('Creating new template cache!\n');
Promise.all([templateCache.loadTemplateCache()]).then(function() {
	console.log('Email templates loaded.');
	models.sequelize.sync({ force: false }).then(() => {
		app.listen(8080, () => {
			console.log('\n\n\n\n\n\nExpress server listening\n');
		});
	});
});
