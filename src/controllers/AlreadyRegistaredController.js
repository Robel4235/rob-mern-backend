const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');

module.exports = {
    getMySentRegistration(req,res){
		jwt.verify(req.token,'secret',async(err,authData)=>{
			debugger;
			if (err){
				res.sendStatus(401) 
			}else{
				try {
					const user_id= authData.user._id;
					const {event_id}=req.params; 
					const registration = await Registration.find({"user":user_id, "event":event_id},(err,data)=>{
						if (err){
							console.log(err)
						}else{  
							console.log(data) 
						}      
					})
					
						return res.json({authData,registration})
					
					
				} catch (error) {
					console.log(error)
					return res.status(400).json(error)
				}
			}
		})
	}
}