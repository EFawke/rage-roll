const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const errorHandler = require('errorhandler');

//makes a router for all express api routes.
const apiRouter = require('./api/apiRouter')
app.use('/api', apiRouter);

const port = 5000;

//using dependencies
app.use(morgan('dev'));
app.use(cors());
app.use(errorHandler());

app.listen(port, () => console.log(`listening on port ${port}`));

const path = require('path')

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/src')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/public/index.html'))
})