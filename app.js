require('dotenv').config();
// error handler
require('express-async-errors');

// internal modules
const path = require('path');

// express framework
const express = require('express');
const app = express();

// use front-reg directory as static folder
app.use(express.static(path.join(__dirname, 'front-reg')));


// database connection
const { serverConnection } = require('./db/connect');

// routers
const UserRouter = require('././user/routes/userRoutes');

// error handler middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// extra packages for security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// routes
app.use('/api/v1/users', UserRouter);

app.get('/', (req, res) => {
    res.send('</h1>Hello User<h1>');
})

// middleware initialization
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.set('trust proxy', 1);
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60
}));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const port = process.env.PORT || 8000;

const start = async () => {
    try {
        await serverConnection().then(() => console.log('Connection to DB successful...')).catch(err => console.error(err));
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
