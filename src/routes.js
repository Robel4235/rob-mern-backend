const express = require('express');
const UserController = require('./controllers/UserController');
const EventController = require('./controllers/EventController');
const DashboardController = require ('./controllers/DashboardController');
const LoginController = require ('./controllers/LoginController');
const RegistrationController = require ('./controllers/RegistrationController');
const ApprovalController =require ('./controllers/ApprovalController');
const RejectionController =require ('./controllers/RejectionController');
const AlreadyRegistaredController =require('./controllers/AlreadyRegistaredController')
const MessageController = require('./controllers/MessageController')


const verifyToken = require ('./config/verifyToken');
const multer = require ('multer');
//const uploadConfig= require('./config/upload');
const uploadToS3= require('./config/s3Uploads');
const { getConversationAsEventOwner } = require('./controllers/MessageController');

const routes = express.Router();
//const upload = multer(uploadConfig);

routes.get('/status',(req,res)=>{
    res.send ({status:200})
})

//Registration
routes.post('/registration/:eventId',verifyToken,RegistrationController.create)
routes.get('/registration/:event_id/sent',verifyToken, AlreadyRegistaredController.getMySentRegistration)
routes.get ('/registration',verifyToken,RegistrationController.getMyRegistrations)
routes.post('/registration/:registration_id/approvals',verifyToken,ApprovalController.approval)
routes.post('/registration/:registration_id/rejections',verifyToken,RejectionController.rejection)


//Login
routes.post('/login',LoginController.store)


//Dashboard
routes.get('/dashboard',verifyToken,DashboardController.getAllEvents)
routes.get('/dashboard/:event',verifyToken,DashboardController.getAllEvents)
routes.get('/event/:eventId',verifyToken,DashboardController.getEventById)
routes.get('/user/events',verifyToken,DashboardController.getEventByUserId)



//Event
routes.post('/event',verifyToken,uploadToS3.single("thumbnail"),EventController.createEvent)
routes.delete('/event/:eventId',verifyToken,EventController.delete)

//Message
routes.post('/message/:eventId',verifyToken,MessageController.CreateAndSend)
routes.post('/replymessage/:messageId',verifyToken,MessageController.CreateAndReply)
routes.get('/messages/:eventId',verifyToken,MessageController.getMessagesRecievedToEventOwner)
routes.get ('/conversationowner/:messageId',verifyToken,MessageController.getConversationAsEventOwner)
routes.get ('/conversationwithowner/:eventId',verifyToken,MessageController.getConversationWithEventOwner)
routes.delete('/message/:messageId',verifyToken,MessageController.DeleteMesssage)
//User
routes.post('/user/register',UserController.createUser)
routes.get('/user/:userId', UserController.getUserbyId)

module.exports = routes;