const mongoose = require('mongoose'); 
require('dotenv').config();


const connectDB = async () => { 
	try { 
		const uri = process.env.DB_URI;
		mongoose.connect(uri, { ssl: false }
		);
		console.log('MongoDB Connected'); 
 	} catch (error) { 
		console.error('MongoDB connection error:', error); 
		process.exit(1); 
	} 
}; 
 
module.exports = connectDB;