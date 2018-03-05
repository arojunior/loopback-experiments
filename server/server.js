'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');
const config = require('./component-config.json');
const graphQLConfig = config['loopback-graphql-server'];
const app = loopback();

// start the web server
app.start = () => app.listen(function() {
  app.emit('started');
  const baseUrl = app.get('url').replace(/\/$/, '');
  console.log('Web server listening at: %s', baseUrl);

  if (app.get('loopback-component-explorer')) {
    const explorerPath = app.get('loopback-component-explorer').mountPath;
    console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  }

  if (graphQLConfig) {
    const graphql = graphQLConfig.path;
    const playground = graphQLConfig.graphiqlPath;
    console.log('GraphQL listening at: %s%s', baseUrl, graphql);
    console.log('Browse GraphQL IDE at: %s%s', baseUrl, playground);
  }
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

module.exports = app;
