const mongoose = require('mongoose'); 
const config = require('config');

const connectDB = async () => { 
	try { 
		const uri = config.get("db.uri");
    	console.log(uri); 
		mongoose.connect(uri, { ssl: false }
		);
		console.log('MongoDB Connected'); 
 	} catch (error) { 
		console.error('MongoDB connection error:', error); 
		process.exit(1); 
	} 
}; 
 
module.exports = connectDB;