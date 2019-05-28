import Express from 'express';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';

mongoose.Promise = require('bluebird');

// Initialize the Express App
const app = new Express();

// Set Development modes checks
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isTestMode = process.env.NODE_ENV === 'test' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode || isTestMode) {
  // Webpack Requirements
  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  // eslint-disable-next-line global-require
  const config = require('../webpack.config.dev');
  // eslint-disable-next-line global-require
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      poll: 1000,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
// import { configureStore } from '../client/store';
// import { Provider } from 'react-redux';
// import React from 'react';
// import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../client/routes';
import calendar from './routes/calendar.routes';
import team from './routes/team.routes';
import login from './routes/login.routes';
import serverConfig from './config';
import glossary from './util/glossary';

// Set bluebird promises as mongoose promise
mongoose.Promise = require('bluebird');

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  /* istanbul ignore next */
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});


// Apply body Parser and server public assets and routes
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../dist/client')));
app.use(session({
  secret: 'randomSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {},
}));
app.use('/api/calendar/login', login);
// check login and teamId


app.use((req, res, next) => {
  // check userId in session.
  if (req.method === 'POST') {
    if (!req.session.userId) {
      res.status(403)
        .send({ status: 403, msg: glossary.notLoginMSG[serverConfig.language] });
    } else if (!req.session.teamId) {
      res.status(403)
        .send({ status: 403, msg: glossary.noTeamId[serverConfig.language] });
    } else {
      next();
    }
  } else {
    next();
  }
});
app.use('/api/calendar', calendar);
app.use('/api/team', team);


// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const head = Helmet.rewind();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        ${isProdMode ? `<link rel='stylesheet' href='${assetsManifest['/app.css']}' />` : ''}
      </head>
      <body>
        <div id="root">${process.env.NODE_ENV === 'production' ? html : `<div>${html}</div>`}</div>
        <script>
          // universal app is unsupported because page login after the hole page loaded
          // window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          ${isProdMode ?
          `//<![CDATA[
          window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${isProdMode ? assetsManifest['/vendor.js'] : '/vendor.js'}'></script>
        <script src='${isProdMode ? assetsManifest['/app.js'] : '/app.js'}'></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  /* istanbul ignore next */
  const errTrace = isProdMode ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    /* istanbul ignore next */
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    // const store = configureStore();
    res
      .set('Content-Type', 'text/html')
      .status(200)
      .end(renderFullPage('', {}));
    // WARNING: Hacking here. I dont know what is required to be returned.
    return '';
    /*
    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );
        // const initialView = 'Nothing Here';
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
      */
  });
});

// start app
app.listen(serverConfig.port, (error) => {
  /* istanbul ignore next */
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

export default app;
