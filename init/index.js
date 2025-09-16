const mongoose= require('mongoose');
const initData= require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderLust";
main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner: '68b06c43fc71044d550ac3c3'})); // Add owner field to each listing
    await Listing.insertMany(initData.data);
    console.log('Database initialized with sample data');
};

initDB();