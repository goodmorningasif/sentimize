import React from 'react';
import ReactDom from 'react-dom';


export default class RecordQuestions extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    console.log('in the textarea render', this.props);

    return (
    	<div className="record-questions pure-u-1-1">
    		<h1>Transcript</h1>
         <div className="button-bar">
           <form id="form" onSubmit={(e) => this.props.clicked(e)}>
            <button type="submit" className="stop-button pure-button pure-button-error">Stop</button>
    		    <textarea rows="4" cols="20" value={this.props.speech} form="form" id="textarea" />
          </form>
        </div>
    	</div>
  )}
}