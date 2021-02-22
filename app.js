const http = require('http');
const morgan = require('morgan');
const express = require('express');

var app = express();

app.use(morgan('short'));

app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
app.use('/', require('./routes/index.js'));
app.use('/settings', require('./routes/settings.js'));


app.listen(80);