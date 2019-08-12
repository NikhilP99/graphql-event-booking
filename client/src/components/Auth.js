import React, {Component} from 'react'
import './Auth.css'
import axios from 'axios'
import Context from '../context'

class Auth extends Component{
    state = {
        isLogin: true
    }

    static contextType = Context;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
          return { isLogin: !prevState.isLogin };
        });
    };

    submitHandler = async (e) => {
        e.preventDefault()

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
              query {
                login(email: "${email}", password: "${password}") {
                  userId
                  token
                  expiry
                }
              }
            `
        };
    
        if (!this.state.isLogin) {
        requestBody = {
            query: `
            mutation {
                createUser(email: "${email}", password: "${password}") {
                _id
                email
                }
            }
            `
        };
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
            let data = response.data;
            if(data.data && data.data.login){
                var token = data.data.login.token
                var userId = data.data.login.userId
                localStorage.setItem('token', token)
                localStorage.setItem('userId', userId)
                this.context.login()
            }else {
                localStorage.setItem('token', null)
                localStorage.setItem('userId', null)
            }
        }

    }

    render() {
        return (
          <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
              <label htmlFor="email">E-Mail</label>
              <input type="email" id="email" ref={this.emailEl} />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref={this.passwordEl} />
            </div>
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={this.switchModeHandler}>
                Switch to {this.state.isLogin ? 'Signup' : 'Login'}
              </button>
            </div>
          </form>
        );
      }
}


export default Auth