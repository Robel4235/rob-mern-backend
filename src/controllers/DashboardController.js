
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

module.exports = {
    getEventById(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                 res.sendStatus(401)
            } else {
                const { eventId } = req.params;
                try {
                    const events = await Event.findById(eventId);
                    if (events) {
                        return res.json({ authData, events });
                    }

                } catch (error) {
                    return res.status(400).json({ message: 'event id does not exsit' })
                }
            }
        })
    },
    getAllEvents(req, res) { 

        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                 res.sendStatus(401);
            } else {
                const { event } = req.params;
                const query = event ? { event } : {};

                try {
                    const events = await Event.find(query);
                    if (events) {
                        return res.json({ authData, events })
                    }

                } catch (error) {
                    return res.status(400).json({ message: 'we do not have any events yet' })
                }

            }
        })



    },
    async getEventByUserId(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                 res.sendStatus(401);
            } else {
                const { user_id } = req.headers;

                try {
                    const events = await Event.find({ user: authData.user._id });
                    if (events) {
                        return res.json({authData, events})
                    }

                } catch (error) {
                    return res.status(400).json({ message: `we do not have any events with the user_id ${user_id}` })
                }

            }
        })



    }
}