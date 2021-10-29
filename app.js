/*jshint esversion: 6 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const https = require('https');
require('dotenv').config();

// console.log(process.env);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, '..', 'public', 'img')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const api_key = process.env.API_KEY;
	const jsonData = JSON.stringify(data);
	const url = 'https://us6.api.mailchimp.com/3.0/lists/cf43d7bc5f';
	const options = {
		method: 'POST',
		auth: api_key,
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + '/success.html');
		} else {
			res.sendFile(__dirname + '/failure.html');
		}

		response.on('data', function (data) {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post('/failure', function (req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Server is running on port 3000');
});
