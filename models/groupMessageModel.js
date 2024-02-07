/* Sample Mongodb group message schema
{
“_id”: 847het8nieigouy4v”,
“from_user”: “pritamworld”,
“room”: “covid19”,
“message”: “What about covid19 vaccine?”
“date_sent”: “01-28-2021 18:30 PM”
} */

const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    from_user : {
        type: String, 
    },
    room:{
        type: String
    },
    message: {
        type: String
    },
    date_sent: {type: Date}
})


module.exports = mongoose.model("groupMessage", groupMessageSchema);