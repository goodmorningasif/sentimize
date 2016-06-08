import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import StripeCheckout  from 'react-stripe-checkout';
// import dummyData from './../../../data/session-data.json';

export default class PaymentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionEntries: []
    }
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
        // console.log(data);
        callback(data);
      },
      error: function(err) {
        console.error('_getCurrentUser error', err);
      },
      dataType: 'json'
    });
  }

  render() {
    return (
      <StripeCheckout
          token={this.onToken}
          stripeKey="pk_test_Wi3cFI9Ey84WfuWqHOHIOYFJ"
          name="Sentimize Inc."
          image="https://rebel-performance.com/wp-content/uploads/2015/02/blue_brain.jpg"
          description="Analytics Suite"
          panelLabel="Total: "
          amount={1000}
          currency="USD"
          bitcoin={true} />
    )
  }
}
 