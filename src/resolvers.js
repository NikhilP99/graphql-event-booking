import {Event} from "./models/event"
import {User} from "./models/users"
import { Booking } from "./models/booking";
const jwt = require('jsonwebtoken')

export const resolvers = {

    Query: {
        events: () => {
            return Event.find({}).populate({
                path:'creator',
                populate:{
                    path:'createdEvents',
                    model: 'Event'
                }
            })
          },

        users: () => {
            return User.find({}).populate({
                path: 'createdEvents',
                populate: {
                    path:'creator',
                    model: 'User'
                }
            })
        },

        bookings: (_,{},req) => {
            if(!req.isAuth){
                throw Error("not authenticated")
            }
            return Booking.find({user: req.userId}).populate([{
                path:'user',
                model:'User',
                populate:{
                    path:'createdEvents',
                    model:'Event'
                }
            },
            {
                path:'event',
                model: 'Event',
                populate: {
                    path: 'creator',
                    model: 'User'
                }
            }
        ])
        },

        login: async (_,{email,password}) => {
            const user = await User.findOne({email:email})
            if(!user){
                throw Error("username not found")
            }
            if(password!==user.password){
                throw Error('Passwords dont match')
            }

            const token = await jwt.sign({userId: user.id, email: user.email},"secretkey", {expiresIn: '1h'})

            return {
                userId : user.id,
                token : token,
                expiry: 1
            }
        }   
    },
    Mutation: {
        createEvent: async (_,{ eventInput },req) => {
            if(!req.isAuth){
                throw Error("not authenticated")
            }
            var event = new Event({               
                title:eventInput.title,
                description:eventInput.description,
                price:eventInput.price,
                date:eventInput.date,
                creator: req.userId
            })
            await event.save()
            const eventID = event.id.toString()
            var host = await User.findById(req.userId)
            host.createdEvents.push(event)
            await host.save()
            return Event.findById(eventID).populate('creator')
          },

        createUser: async (_,{email,password}) => {
            var userCheck = await User.findOne({email : email})
            if(userCheck){
                throw new Error("Username already exists")
            }

            var user = new User({
                email: email,
                password: password
            })

            await user.save()
            const userID = user.id.toString()
            return User.findById(userID).populate('createdEvents')
        },

        bookEvent: async (_,{eventId},req) => {
           
            if(!req.isAuth){
                throw Error("not authenticated")
            }
            const booking = new Booking({
                event: eventId,
                user: req.userId
            })
            await booking.save()
            const bookingId = booking.id.toString() 
            return Booking.findById(bookingId).populate([{
                path:'user',
                model:'User'
            },
            {
                path:'event',
                model: 'Event'
            }
        ])

        },

        cancelBooking: async (_, {bookingId},req) => {
            if(!req.isAuth){
                throw Error("not authenticated")
            }
            const booking = await Booking.findById(bookingId)
            const event = await Event.findById(booking.event)

            await Booking.deleteOne({_id: bookingId})
            return event
        }
    }
}