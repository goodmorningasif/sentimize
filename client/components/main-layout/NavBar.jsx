import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';
import { browserHistory } from 'react-router';


//var x = false;

export default class NavBar extends React.Component {

  constructor(){
    super();
    this.state = {
     payed: false 
    }
  }

  componentDidMount() {    
    $.ajax({
      type: 'GET',
      url: '/api/users',
      success: function(user) {
        console.log('USERinnav',user);
        if (user.payed === 1) {
          //x = true;
          this.setState({payed: true});
        } 
      }.bind(this),
      
      error: function(error) {
        console.error('User Not Found:', error)
      }
    });
    
  }

  handleClick(e) {
    console.log(e);
    e.preventDefault();

    if(this.state.payed) {
      browserHistory.push('/sessions');
    } else {
      browserHistory.push('/payment');
    }
  }

  render() {
    return (
      <div className="nav-bar">
        <div className="pure-menu-heading">
          <Link className="home-link" to="/">Sentimize</Link>
        </div>

        <div className="pure-menu pure-menu-horizontal pure-menu-fixed">
          <ul className="pure-menu-list">
            <li className="pure-menu-item"><Link to="/record" className="pure-menu-link">Record</Link></li>
            <li className="pure-menu-item"><a href='' onClick={(e) => this.handleClick(e)}>Sessions</a></li>
            <li className="pure-menu-item"><Link to="/payment" className="pure-menu-link">Payment</Link></li>
            <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
              <div className="pure-menu-link nav-bar-dropdown"><i className="fa fa-cog fa-lg" aria-hidden="true"></i></div>
              <ul className="pure-menu-children"> 
                <li className="pure-menu-item"><Link to="/settings" className="pure-menu-link dropdown-link">Settings</Link></li>
                <li className="pure-menu-item"><a href="/logout" className="pure-menu-link dropdown-link">Log out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}