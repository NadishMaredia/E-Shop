const app = require('./app');

const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

dotenv.config({path:'backend/config/config.env'});

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log('Listening on ', process.env.PORT);
})

process.on('unhandledRejection', (err) => {
    console.log('Error ', err.message);

    server.close(() => {
        process.exit();
    });
})