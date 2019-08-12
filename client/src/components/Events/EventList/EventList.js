import React,{Component} from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

class EventList extends Component {

  constructor(props) {
    super(props);
    this.onclick = this.onclick.bind(this);
  }

  onclick = (eventId) => {
    this.props.onViewDetail(eventId)
    }

  render() {
    const events = this.props.events.map(event => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          title={event.title}
          userId={this.props.authUserId}
          creatorId={event.creator._id}
          onDetail={this.onclick}
        />
      );
    });

    return(
      <ul className="event__list">{events}</ul>
    )
  }
  };

export default EventList;
