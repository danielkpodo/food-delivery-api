const logger = require('morgan');
const compression = require('compression');
const { PRODUCTION, DEVELOPMENT } = require('./utils/environment');
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const { BASE_URL } = process.env;
/**
 * Import all application routes here
 */
const restaurantRoutes = require('./routes/restaurant');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

module.exports = (app) => {
  if (process.env.NODE_ENV === DEVELOPMENT) {
    app.use(logger('dev'));
  }
  if (process.env.NODE_ENV === PRODUCTION) {
    app.use(compression());
    app.set('view cache', true);
  }

  /**
   * Serve application routes as middlewares
   */
  app.use(`/${BASE_URL}/restaurants`, restaurantRoutes);
  app.use(`/${BASE_URL}/users`, userRoutes);
  app.use(`/${BASE_URL}/menu`, menuRoutes);
  app.use(`/${BASE_URL}/orders`, orderRoutes);
  /**
   * Error Middlewares
   */
  app.use(errorHandlerMiddleware);
  app.use(notFoundMiddleware);
};
