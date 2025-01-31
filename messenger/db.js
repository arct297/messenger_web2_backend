const mongoose = require('mongoose'); 

const connectDB = async () => { 
	try { 
		const uri = process.env.DB_URI;
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