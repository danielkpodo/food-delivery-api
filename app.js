require('express-async-errors');
require('dotenv').config();
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const { sequelize } = require('./db/models');
const { limiter } = require('./utils/rate-limiter');
const appRouter = require('./router');
/**
 * Security middlewares
 */
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use(express.json());
// sets cookie in the browser
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.urlencoded({ extended: true }));

/** serve application routes */
appRouter(app);

const port = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.info('Connection has been established successfully ✅..');
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.error('Unable to connect to the database ❌:', error);
  }
})();
