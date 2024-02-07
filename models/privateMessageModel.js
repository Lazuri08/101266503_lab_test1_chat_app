/* Sample Mongodb private message schema
{
“_id”: 847het8nieigouy4v”,
“from_user”: “pritamworld”,
“to_user”: “moxdroid”,
“message”: “What about covid19 vaccine?”
“date_sent”: “01-28-2021 18:30 PM”
} */



const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
    from_user : {
        type: String, 
    },
    to_user:{
        type: String
    },
    message: {
        type: String
    }
})


module.exports = mongoose.model("privateMessage", privateMessageSchema);