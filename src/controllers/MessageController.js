const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Message = require('../models/Message')
const User = require('../models/User');

module.exports = {
    CreateAndSend(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                const { eventId } = req.params
                const { messageText } = req.body;
                const { _id, email, firstName, lastName } = authData.user;

                const textMessage = await Message.create({
                    messageText: messageText,
                    senderUserId: _id,
                    senderFirstName: firstName,
                    senderLastName: lastName,
                    senderEmail: email,
                    event: eventId,
                    date: Date.now()
                })
                await textMessage
                    .populate('event')
                    .populate('user', '-password')
                    .execPopulate()


                const chatPartnerUser = await User.findById(textMessage.event.user);

                if (chatPartnerUser) {
                    textMessage.chatPartner_firstName = chatPartnerUser.firstName
                    textMessage.chatPartner_lastName = chatPartnerUser.lastName
                    textMessage.chatPartner_email = chatPartnerUser.email
                    textMessage.chatPartner_user = chatPartnerUser._id
                    textMessage.save()
                }

               
                const ownerSocket = req.connectUsers[textMessage.event.user]
                if (ownerSocket) {
                    req.io.to(ownerSocket).emit('message_request', textMessage)
                }
                return res.json(textMessage);

            }
        })
    },

    CreateAndReply(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                return res.sendStatus(401)
            } else {
                try {
                    const { _id, email, firstName, lastName } = authData.user;

                    const { messageId } = req.params;
                    const { messageText } = req.body;
                    const msg = await Message.findById(messageId);

                    const textMessage = await Message.create({
                        messageText: messageText,
                        senderUserId: _id,
                        senderFirstName: firstName,
                        senderLastName: lastName,
                        senderEmail: email,
                        event: msg.event,
                        date: Date.now()
                    })
                    await textMessage
                        .populate('event')
                        .populate('user', '-password')
                        .execPopulate()


                    const chatPartnerUser = await User.findById(msg.senderUserId);

                    if (chatPartnerUser) {
                        textMessage.chatPartner_firstName = chatPartnerUser.firstName
                        textMessage.chatPartner_lastName = chatPartnerUser.lastName
                        textMessage.chatPartner_email = chatPartnerUser.email
                        textMessage.chatPartner_user = chatPartnerUser._id
                        textMessage.save()
                    }

                    console.log(textMessage)
                    const ownerSocket = req.connectUsers[msg.senderUserId]
                    if (ownerSocket) {
                        req.io.to(ownerSocket).emit('message_request', textMessage)
                    }
                    return res.json(textMessage);
                } catch (error) {
                    console.log(error)
                }
            }

        })

    },

    getMessagesRecievedToEventOwner(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                try {
                    const userId = authData.user._id
                    const { eventId } = req.params

                    const message = await Message.find({ "chatPartner_user": userId, "event": eventId })

                    if (message) {
                        
                        return res.json(message);
                    }

                } catch (error) {
                    console.log(error + "that may be")
                }
            }
        })
    },

    getConversationAsEventOwner(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                return res.sendStatus(401);
            } else {
                try {
                    const { messageId } = req.params
                    const { _id } = authData.user;
                    const msg = await Message.findById(messageId)
                   
                    const messages1 = await Message.find({ "senderUserId": _id, "event": msg.event, "chatPartner_user": msg.senderUserId });
                    const messages2 = await Message.find({ "senderUserId": msg.senderUserId, "event": msg.event, "chatPartner_user": _id });
                    if (messages2 || messages1) {
                        
                        const messagesList = messages2.concat(messages1);
                        return res.json(messagesList)
                    }
                } catch (error) { 
                    console.log(error)
                }

            }
        })
    },
    getConversationWithEventOwner(req,res){
        jwt.verify(req.token,'secret',async (err,authData)=>{
            if (err){
                return res.sendStatus(401)
            }else{
                try {
                    const {eventId}=req.params;
                    const { _id } = authData.user;
                    const event = await Event.findById(eventId);   
                        const messages1= await Message.find({"senderUserId": _id, "event":eventId,"chatPartner_user":event.user})
                        const messages2= await Message.find({"senderUserId": event.user, "event":eventId,"chatPartner_user":_id})

                        if (messages1||messages2){
                            const messages = messages1.concat(messages2);
                            return res.json(messages);
                        }
                    
                } catch (error) {
                    console.log(error);
                }
            }
        })
    },
    DeleteMesssage(req,res){
        jwt.verify(req.token,'secret',async(err,authData)=>{
            if (err){
               return res.sendStatus(401)
            }else{
                try {
                   const {messageId}=req.params;
                   await Message.findByIdAndDelete(messageId);
                   return res.status(204).send()
                  
                } catch (error) {
                    return res.status(400).json({ message: 'we do not have a message with the given Id' })
                }
            }
        })
    }
    

}