import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import {Doughnut as DoughnutChart} from 'react-chartjs';
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
        labels: ['sadness', 'anger', 'fear', 'happiness', 'disgust'],
        datasets: [
          {
            cutoutPercentage: '50',
            data: []
          }
        ]
      },
      language: { // DONUT
        labels: ['Analytical', 'Confident', 'Tentative'],
        datasets: [
          {
            cutoutPercentage: '50',
            data: []
          }
        ]
      },
      social: { // RADAR
        labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Range', 'Dummy'],
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
      }
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
        console.log(sessionData[0]['emotionalRange']);
        // this.setState({
        //   // set sessionData to state key's
        // })

        var emotionClone = Object.assign({}, this.state.emotion);
        console.log('eC', emotionClone);
        console.log(this.state.emotion.labels, this.state.emotion.labels.length);
        var emotionLabelsClone = this.state.emotion.labels.slice();

        for (var i = 0; i < this.state.emotion.labels.length; i++) {
          console.log(emotionLabelsClone);
          var feature = emotionLabelsClone[i]
          console.log(feature, typeof feature);
          console.log(sessionData[0][feature]);
          emotionClone.datasets[0]['data'].push(sessionData[0][feature])
        }


        console.log('EMOTIONCLONE', emotionClone);

        // need to replace state with clone
        
        // console.log('SESH:', sessionData);
        // console.log('HAPPY?', sessionData[0].happiness);

        // console.log('this.state.emotion.labels', this.state.emotion.labels);
        // console.log('this.state.language.labels', this.state.language.labels);
        // console.log('this.state.social.labels', this.state.social.labels);

        // var dataGrabber = function (labels) {
        //   var dataArr = [];

        //   // var lbl = labels.pop();
        //   // console.log('LABELS?', labels);
        //   // console.log('TYPEOFLABELS?', Array.isArray(labels));
        //   labels.forEach(function (feature) {
        //     if (typeof feature === 'string') {
        //       console.log('feat:', feature);
        //       console.log('FROMAJAX', sessionData[0][feature]);
        //       dataArr.push(sessionData[0][feature]);  
        //     }
        //   });
        //   console.log('INDATAGRABBER:', dataArr);
        //   return dataArr;
        // };

        // // Reminder: Need Object.assign() b/c need to modify,
        // // otherwise using equals will only copy the reference.
        // var emotionClone = Object.assign({}, this.state.emotion);
        // var languageClone = Object.assign({}, this.state.language);
        // var socialClone = Object.assign({}, this.state.social);

        // // console.log('emotionClone:', emotionClone);
        // // console.log('emotionCloneData:', emotionClone.datasets[0].data);
        // for (var i=0; i < this.state.emotion.labels; i++) {
        //   emotion
        // }

        // console.log('TESTING DATAGRABBER:', dataGrabber(this.state.emotion.labels));
        // emotionClone.datasets[0].data.concat(dataGrabber(this.state.emotion.labels));
        // languageClone.datasets[0].data.concat(dataGrabber(this.state.language.labels));
        // socialClone.datasets[0].data.concat(dataGrabber(this.state.labels));

        // this.setState({
        //   emotion: emotionClone,
        //   language: languageClone,
        //   social: socialClone
        // });
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
        <button class="pure-button pure-button-active" onClick={this.handleClick.bind(this)}>View VIDEO Analysis</button>
        <div style={styles.graphContainer}>
          <h3>Emotional Analysis</h3>
          <DoughnutChart data={this.state.emotion} 
                 redraw options={options}
                 width="600" height="250"/>
        </div>
{
        // <div style={styles.graphContainer}>
        //   <h3>Language Style</h3>
        //   <DoughnutChart data={this.state.language} 
        //          redraw options={options}
        //          width="600" height="250"/>
        // </div>

        // <div style={styles.graphContainer}>
        //   <h3>Social Tendencies</h3>
        //   <RadarChart data={this.state.social} 
        //          redraw options={options}
        //          width="600" height="250"/>
        // </div>
}
      </div>
    )
  }
}

