import React, {Component} from 'react'
import Modal from './Modal/Modal'
import './Events.css' 
import axios from 'axios'
import EventList from './Events/EventList/EventList';


import Context from '../context'

class Events extends Component{
    state = {
        creating: false,
        events: [],
        selectedEvent: null
    }

    static contextType = Context

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }
    
    componentDidMount() {
        this.isActive = true
        this.fetchEvents();
    }

    isActive = true

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    };

    modalConfirmHandler = async () => {
        this.setState({ creating: false });
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
          ) {
            return;
        }

        const event = { title, price, date, description };

        const requestBody = {
            query: `
            mutation{
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
                    _id
                    title
                    creator{
                        _id
                        email
                    }
                }
            }`
        }

        const token = this.context.token

        let url = "http://localhost:3001/graphql"
        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            data: requestBody
        }

        let response = await axios(options)

        let responseOK = response && response.status === 200;
        if (responseOK) {
            this.fetchEvents()
        }

    };

    

    fetchEvents = async () => {
        let requestBody = {
            query: `
            query{
                events{
                    _id
                    title
                    description
                    creator {
                        _id
                        email
                    }
                }
            }`
        }

        let url = "http://localhost:3001/graphql"
        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        }

        let response = await axios(options)

        let responseOK = response && response.status === 200;
        if (responseOK) {
            let events = response.data.data.events;
            if(this.isActive){
                this.setState({events: events})
            }
        }
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent };
        });
    };

    bookEventHandler = async () => {
        if(!this.context.token){
            this.setState({selectedEvent: null})
            return ;
        }
        let requestBody = {
            query: `
            mutation{
                bookEvent(eventId: "${this.state.selectedEvent._id}"){
                    createdAt
                    updatedAt
                }
            }`
        }

        let url = "http://localhost:3001/graphql"
        const options = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.context.token
            },
            data: requestBody
        }

        let response = await axios(options)

        let responseOK = response && response.status === 200;
        if (responseOK) {
            console.log(response.data.data)
        }
    };

    componentWillMount(){
        this.isActive = false
    }

    render(){
        return(
            <React.Fragment>
            {this.state.creating && (
                <Modal
                title="Add Event"
                canCancel
                canConfirm
                onCancel={this.modalCancelHandler}
                onConfirm={this.modalConfirmHandler}
                confirmText="Confirm"
                >
                <form>
                <div className="form-control">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="date">Date</label>
                    <input type="text" id="date" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="description">Description</label>
                    <textarea
                    id="description"
                    rows="4"
                    ref={this.descriptionElRef}
                    />
                </div>
                </form>
                </Modal>
            )}

            {this.state.selectedEvent && (
            <Modal
                title={this.state.selectedEvent.title}
                canCancel
                canConfirm
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookEventHandler}
                confirmText="Book"
            >
                <h1>{this.state.selectedEvent.title}</h1>
                <p>{this.state.selectedEvent.description}</p>
            </Modal>
            )}

            {this.context.token && (
            <div className="events-control">
                <p>Share your own Events!</p>
                <button className="btn" onClick={this.startCreateEventHandler}>
                Create Event
                </button>
            </div>
            )}
            <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
            />
            </React.Fragment>
        )
    }
}


export default Events