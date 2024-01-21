//import modules
const mongoose = require('mongoose');

require('dotenv').config();

const dbConfig = async () => {
  try {
    const URL = "mongodb+srv://wllmswalmart:123WwM456@bihelix.rrnc1u2.mongodb.net/wsec?retryWrites=true&w=majority";

    await mongoose.connect(URL, {
      //define connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection; //assign database connection for a constant variable

    connection.once('open', () => {
      console.log('MongoDB connection was successful');
    });
  } catch (error) {
    console.error('MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = dbConfig;
