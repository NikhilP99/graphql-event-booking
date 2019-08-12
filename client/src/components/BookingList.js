import React, {Component} from 'react';

import './BookingList.css';

class BookingList extends Component {


  render() {
    return(
      <ul className="bookings__list">
        {this.props.bookings.map(booking => {
          return (
            <li key={booking._id} className="bookings__item">
              <div className="bookings__item-data">
                {booking.event.title} -{' '}
                {booking.user.email} -{' '}
                {booking.createdAt}
              </div>
              <div className="bookings__item-actions">
                <button className="btn" onClick={this.props.onDelete.bind(this, booking._id)}>Cancel</button>
              </div>
            </li>
          );
        })}
      </ul>
    )
  }
};

export default BookingList;