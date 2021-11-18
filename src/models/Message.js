const mongoose = require ('mongoose');

const MessageSchema = new mongoose.Schema ({
    date:()=> Date.now(),
    seen: Boolean,
    messageText:String,
    senderUserId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    senderFirstName:String ,
    senderLastName:String,
    senderEmail:String,
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    chatPartner_firstName: String,
    chatPartner_lastName:String,
    chatPartner_email:String,
    chatPartner_user: String

});
module.exports = mongoose.model("Message",MessageSchema)