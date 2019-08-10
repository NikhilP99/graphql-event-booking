import {Event} from "./models/event"


export const resolvers = {

    Query: {
        events: () => {
            return Event.find({})
          }
    },
    Mutation: {
        createEvent: (_,{ eventInput }) => {
            var event = new Event({               
                title:eventInput.title,
                description:eventInput.description,
                price:eventInput.price,
                date:eventInput.date
            })
            event.save()
            return event
          }
    }
}