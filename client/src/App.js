import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect ,Switch} from 'react-router-dom'
import './App.css';

import Auth from './components/Auth'
import Bookings from './components/Bookings'
import Events from './components/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import Context from './context'

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  componentDidMount(){
    if(localStorage.getItem('token')!==null && localStorage.getItem('userId')!==null){
      this.setState({token: localStorage.getItem('token'),userId: localStorage.getItem('userId')})
    }
  }

  login = () => {
    var token = localStorage.getItem('token')
    var userId = localStorage.getItem('userId')
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    this.setState({ token: null, userId: null });
  };


  render() {
    return (
      <BrowserRouter>
      <React.Fragment>
        <Context.Provider value={{
          token: this.state.token,
          userId: this.state.userId,
          login: this.login,
          logout: this.logout
        }}>
        <MainNavigation />
        <div className="main-content">
        <Switch>
          {!this.state.token && <Redirect from="/" to="/auth" exact />}
          {this.state.token && <Redirect from="/" to="/events" exact />}
          {this.state.token && <Redirect from="/auth" to="/events" exact />}
          {!this.state.token && (
            <Route path="/auth" component={Auth} />
          )}
          <Route path="/events" component={Events} />
          {this.state.token && (
            <Route path="/bookings" component={Bookings} />
          )}

        </Switch>
        </div>
        </Context.Provider>
      </React.Fragment>
      </BrowserRouter>
    );
  }
  
}

export default App
