import React from 'react';
import ReactDom from 'react-dom';


export default (props) => (
	<div className="record-questions pure-u-1-1">
		<h1>Transcript</h1>
     <div className="button-bar">
       <form id="form" onSubmit={(e) => props.clicked(e)}>
        <button type="submit" className="stop-button pure-button pure-button-error">Stop</button>
		    <textarea rows="4" cols="20" value=" Value from textarea" form="form" id="textarea" />
      </form>
    </div>
	</div>
)