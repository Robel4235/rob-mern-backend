const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    createEvent(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                  res.sendStatus(401);
            } else {
                const { title, description, price, thumbnail, event, date } = req.body;
                const { location } = req.file;
                const user = await User.findById(authData.user._id);

                if (!user) {
                    return res.status(400).json({ message: 'User does not exsit' })
                }

                const event1 = await Event.create({
                    title,
                    description,
                    price: parseFloat(price),
                    event,
                    date,
                    user: user._id,
                    thumbnail: location
                })

                await event1 
                .populate('user', '-password')
                .execPopulate()
                

                return res.json(event);

            }
        })


    },

     delete(req, res) {
         jwt.verify(req.token, 'secret', async (err,authData)=>{
             if (err){
                  res.sendStatus(401)
             }else{
                const { eventId } = req.params;

                try {
                    await Event.findByIdAndDelete(eventId);
                    return res.status(204).send()
        
                } catch (error) {
                    return res.status(400).json({ message: 'we do not have an event with the given Id' })
                }
 
             }
         })
        
    }
}