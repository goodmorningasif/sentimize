import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router';
import $ from 'jquery';
import { browserHistory } from 'react-router';

import StripeCheckout  from 'react-stripe-checkout';

export default class NavBar extends React.Component {

  constructor(){
    super();
    this.state = {
     payed: false // used to control access based on user payment
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

   // if(this.state.payed) {
    browserHistory.push('/sessions');
   // } else {
   //   browserHistory.push('/payment');
  //  }
  }

  onToken(token) {
    console.log('TOKEN', token);
    // xhrStripeTokenToMyServer(token).then(() => {
    //   // please do with HTTPS 
    //   console.log('TOKEN', token);
    // });

    $.ajax({
      method: 'POST',
      data: {stripeToken: token},
      url: '/api/stripe',
      success: function(data) {
        // do nothing
      },
      error: function(err) {
        console.error('_getCurrentUser error', err);
      },
      dataType: 'json'
    });
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
            <li className="pure-menu-item"><a href='' className="pure-menu-link" onClick={(e) => this.handleClick(e)}>Sessions</a></li>
            <li className="pure-menu-item"><StripeCheckout
              token={this.onToken}
              stripeKey="pk_test_Wi3cFI9Ey84WfuWqHOHIOYFJ"
              name="Sentimize Inc."
              image="https://rebel-performance.com/wp-content/uploads/2015/02/blue_brain.jpg"
              description="Analytics Suite"
              panelLabel="Total: "
              amount={1000}
              currency="USD"
              componentClass="button"
              bitcoin={true}
              className="pure-menu-item hideWidth"
              > 
              <button className="pure-menu-link-pay">
              Payment
              </button></StripeCheckout>
            </li>
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