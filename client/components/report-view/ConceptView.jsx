import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import {Doughnut as DoughnutChart} from 'react-chartjs';
import {browserHistory} from 'react-router';


export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/api/concept',
      data: { sessionId: this.props.params.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching report data', error);
      },
      success: function(sessionData) {
        var concept = JSON.parse(sessionData[0].concept);
        this.setState({concept})
        console.log('sD', sessionData[0].concept);
        console.log('sD', sessionData[0].concept);

      }.bind(this)
    })
  };

  handleConceptClick(e) {
    e.preventDefault();
    browserHistory.push('/concepts/' + this.props.params.sessionId.toString());
  };

  handleTextClick(e) {
    e.preventDefault();
    browserHistory.push('/textAnalysis/' + this.props.params.sessionId.toString());
  };

  handlePerformanceClick(e) {
    e.preventDefault();
    browserHistory.push('/reports/' + this.props.params.sessionId.toString());
  };
  render() {
    return (
      <div>
        <span>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleTextClick.bind(this)}>View Text Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handlePerformanceClick.bind(this)}>View Performance Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleConceptClick.bind(this)}>View Concept Insights</button>
        </span>
        <div>
          <h3>Concept Insight</h3>
        </div>
      </div>
    )
  }
}
