import React, { Component } from 'react';
import Context from '../context';
import axios from 'axios'
import BookingList from './BookingList'

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = Context;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
             }
             user {
                 _id
                 email
             }
            }
          }
        `
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
        this.setState({
            bookings: response.data.data.bookings
        })
    }
    
  };

  deleteBookingHandler = async (bookingId) => {
    const requestBody = {
        query: `
            mutation{
                cancelBooking(bookingId: "${bookingId}") {
                    _id
                     title
                    }
            }
          `
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
          this.fetchBookings()
      }
  }

  render() {
    return (
        <React.Fragment>
           <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          />
        
        </React.Fragment>
    );
  }
}

export default BookingsPage;