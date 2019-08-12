import React,{Component} from 'react';

import './EventItem.css';

class EventItem extends Component<props> {

  constructor(props) {
    super(props);
    this.onclick = this.onclick.bind(this);
  }

  onclick = () => {
    this.props.onDetail(this.props.eventId)
  }

  render(){
    return(
      <li key={this.props.eventId} className="events__list-item">
      <div>
        <h1>{this.props.title}</h1>
      </div>
      <div>
        {this.props.userId === this.props.creatorId ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button className="btn" onClick={this.onclick}>
            View Details
          </button>
        )}
      </div>
    </li>
    )
  }

}
 
;

export default EventItem;
