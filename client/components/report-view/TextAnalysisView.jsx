import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import {Doughnut as DoughnutChart} from 'react-chartjs';
import {Pie as PieChart} from 'react-chartjs';
import {browserHistory} from 'react-router';

const options = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
}

const styles = {
  graphContainer: {
    border: '1px solid black',
    padding: '15px'
  }
}

export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      emotion: { // DONUT
        labels: ['sadness', 'anger', 'fear', 'happiness', 'disgust'], // this.state.emotion.labels[i]
        datasets: [
          {
            data: [], // this.state.emotion.datasets[0].data[i]
            backgroundColor: [
              "#FF6384", // this.state.emotion.datasets[0].backgroundColor[0]
              "#36A2EB",
              "#FFCE56",
              "#cc0000",
              "#1F8261"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB"
            ]
          }
        ]
      },
      language: { // Pie
        labels: ['analytical', 'confident', 'tentative'],
        datasets: [
          {
            cutoutPercentage: '50',
            data: [],
            backgroundColor: [
              "#F7464A", // this.state.emotion.datasets[0].backgroundColor[0]
              "#46BFBD",
              "#FDB45C"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
            ]

          }
        ]
      },
      social: { // RADAR
        labels: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'Emotional Range', 'Dummy'],
        datasets: [
          {
            label: 'Social Tendencies',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
      },
      emoData: [],
      langData: [],
      socData: []
    }
  }

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/api/text',
      data: { sessionId: this.props.params.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching report data', error);
      },
      success: function(sessionData) {
        console.log('sD', sessionData);

        // clones of state
        var emotionClone = Object.assign({}, this.state.emotion);
        var languageClone = Object.assign({}, this.state.language);
        var socialClone = Object.assign({}, this.state.social);        

        // clones of labels
        var emotionLabelsClone = this.state.emotion.labels.slice();
        var languageLabelsClone = this.state.language.labels.slice();
        var socialLabelsClone = this.state.social.labels.slice();        

        // following 3 blocks could be abstracted
        // writing data in preparation to be saved as state
        for (var i = 0; i < this.state.emotion.labels.length; i++) {
          var feature = emotionLabelsClone[i];
          emotionClone.datasets[0]['data'].push(sessionData[0][feature]);
        }

        for (var i = 0; i < this.state.language.labels.length; i++) {
          var feature = languageLabelsClone[i];
          languageClone.datasets[0]['data'].push(sessionData[0][feature]);
        }

        for (var i = 0; i < this.state.social.labels.length; i++) {
          var feature = socialLabelsClone[i]
          socialClone.datasets[0]['data'].push(sessionData[0][feature])
        }

        // setting state to new 
        // radar chart's data is handled differently, so I've
        // separated it out here
        this.setState({social: socialClone});

        var emotionData=[];
        var languageData = [];

        // populating emotion data for the chart
        for (var i = 0; i < this.state.emotion.labels.length; i++) {
          var dataPoint = {
            color: this.state.emotion.datasets[0].backgroundColor[i],
            label: this.state.emotion.labels[i],
            value: this.state.emotion.datasets[0].data[i]
          }
          emotionData.push(dataPoint);
        }

        // populating language data for the chart
        for (var i = 0; i < this.state.language.labels.length; i++) {
          var dataPoint = {
            color: this.state.language.datasets[0].backgroundColor[i],
            label: this.state.language.labels[i],
            value: this.state.language.datasets[0].data[i]
          }
          languageData.push(dataPoint);
        }

        // setting data for emotion and language analysis
        this.setState({
          emoData: emotionData,
          langData: languageData
        })
      }.bind(this)
    })
  };

  handleClick(e) {
    e.preventDefault();
    browserHistory.push('/reports/' + this.props.params.sessionId.toString());
  };

  render() {
    return (
      <div>
        <span>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleClick.bind(this)}>View Text Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleClick.bind(this)}>View Performance Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleClick.bind(this)}>View Concept Insights</button>
        </span>
        <div style={styles.graphContainer}>
          <h3>Emotional Analysis</h3>
          <DoughnutChart 
            data={this.state.emoData}
            redraw
            options={options}
            generateLegend
            width="600" height="250"/>
        </div>
        <div style={styles.graphContainer}>
          <h3>Language Style</h3>
          <PieChart
            data={this.state.langData} 
            redraw options={options}
            width="600" height="250"/>
        </div>

        <div style={styles.graphContainer}>
          <h3>Social Tendencies</h3>
          <RadarChart data={this.state.social} 
            redraw options={options}
            width="600" height="250"/>
        </div>
      </div>
    )
  }
}

// {
        // <div style={styles.graphContainer}>
        //   <h3>Social Tendencies</h3>
        //   <RadarChart data={this.state.social} 
        //          redraw options={options}
        //          width="600" height="250"/>
        // </div>
// }
