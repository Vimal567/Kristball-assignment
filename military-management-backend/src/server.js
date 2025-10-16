const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const PORT = process.env.PORT || 4000;

connectDatabase();

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Default Route
app.get('/', (req, res) => res.send("Issuance api is working!"));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/purchases', require('./routes/purchases.route'));
app.use('/api/transfers', require('./routes/transfers.route'));
app.use('/api/expenditures', require('./routes/expenditures.route'));
app.use('/api/dashboard', require('./routes/dashboard.route'));
app.use('/api/bases', require('./routes/base.route'));

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});