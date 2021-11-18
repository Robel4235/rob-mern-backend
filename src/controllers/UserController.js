const User = require ('../models/User');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async createUser(req,res){
        try {
            const {firstName,lastName,password,email}= req.body;
            const existentUser = await User.findOne({email});
            if (!existentUser){
                const hashedpassword = await bcrypt.hash(password,10);
                const user = await User.create({
                    firstName:firstName,
                    lastName:lastName,
                    password:hashedpassword,
                    email:email
                });
                return jwt.sign({user:user},'secret',(err,token)=>{
                    return res.json({
                        user: token,
                        user_id: user._id
                    })
                })

            }
            return res.status(400).json({
                message: 'email/user already exist! do you want to login instead?'
            });
           
        } catch (error) {
            throw Error (`error while registering a new user: ${user}`)        
        }
    },
    async getUserbyId(req,res){
        const {userId} = req.params;
        try {
            const user = await User.findById(userId);
             return res.json(user);
        } catch (error) {
            return res.status(400).json({
                message: 'user ID does not exist, do you want to register instead?'
            });
        }
    }
}