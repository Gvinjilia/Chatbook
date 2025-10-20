const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRouter = require('./router/post.router');
const globalErrorHandler = require('./controllers/error.controller');
const commentRouter = require('./router/comment.router');
const authRouter = require('./router/auth.router');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'dist')))
app.use(cookieParser());
app.use(express.json());

app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);

// app.use((err, req, res, next) => {
//     res.status(err.statusCode).json(err);
// });

app.use(globalErrorHandler); // თუ error - ი დაფიქსირდება რომელიმე route - ში ან middleware ფუნქციაში, მაშინ ამ error - ს გადავცემთ globalErrorHandler ფუნქციას

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('connected to MongoDB');

        app.listen(process.env.PORT, () => {
            console.log('The server is running on port', process.env.PORT);
        });
    })
    .catch(err => {
        console.log('Error', err);

        process.exit(1);
    });