const mongoose = require('mongoose');
const hotelSchema = mongoose.Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    location: { type: String, required: false },
    image: { type: String, required: false },
    rooms: [{ 
        name: String,
        people: Number,
        price: Number
     }],  
});

module.exports = mongoose.model('hotels', hotelSchema)