import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import config from './config';
import errorHandler from './middlewares/errorHandler';
import router from './routes';
import undefinedRequestHandler from './middlewares/undefinedRequestHandler';

const { corsConfig, CORS_ALLOWED_LINK } = config;
const app = express();

app.use(require('morgan')('dev'));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', CORS_ALLOWED_LINK);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use(cors(corsConfig));
app.use(cookieParser());
app.use('/api', router);
app.use(undefinedRequestHandler);
app.use(errorHandler);

module.exports = app;
