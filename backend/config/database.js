const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI)
        .then((data) => {
            console.log('Db connected with ', data.connection.host);
        }).catch((err) => {
            console.log(err);
        });
};

module.exports = connectDatabase;
