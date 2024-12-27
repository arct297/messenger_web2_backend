const mongoose = require('mongoose'); 
 
const connectDB = async () => { 
  try { 
    await mongoose.connect( 
      'mongodb+srv://beyond3r0:Zappivsminigenerators123@nosqlaitu.5kkwi.mongodb.net/messenger', 
      { useNewUrlParser: true, useUnifiedTopology: true } 
    ); 
    console.log('MongoDB Connected'); 
  } catch (error) { 
    console.error('MongoDB connection error:', error); 
    process.exit(1); 
  } 
}; 
 
module.exports = connectDB;