// variables
var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recording = false;
var recordingLength = 0;
var volume = null;
var audioInput = null;
var sampleRate = null;
var audioContext = null;
var context = null;
var outputElement = document.getElementById('output');
var outputString;

var FACE = (function() {
  // Private Section
  var K_VERSION                   = "1.0";
  var K_SERVICE_URL               = "http://api.sightcorp.com/api/detect/";
  var K_FORM_IMG_FIELD_NAME       = "img";
  var K_FORM_URL_FIELD_NAME       = "url";
  var K_FORM_CLIENT_ID_FIELD_NAME = "client_id";
  var K_FORM_APP_KEY_FIELD_NAME   = "app_key";
  var K_FORM_ATTRIBUTE_FIELD_NAME = "attribute";

  var sendForm = function( formData, onSuccessCallback, onFailureCallback ) {
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open( "POST", K_SERVICE_URL, true );
    ajaxRequest.onreadystatechange = ( function( tmpEvent ) {
      if( ajaxRequest.status == 200 ) {
        var jsonResponse = JSON.parse( ajaxRequest.responseText );
        if( jsonResponse.error_code && onFailureCallback ) {
          onFailureCallback( "F.A.C.E. request failed : " + jsonResponse.description );
        } else if( onSuccessCallback ) {
          onSuccessCallback( JSON.parse( ajaxRequest.responseText ) );
        }
      } else {
        console.log( "FACE request failed. HTTP Status = " + ajaxRequest.status );
        if( onFailureCallback ) {
          onFailureCallback( "FACE request failed. HTTP Status = " + ajaxRequest.status );
        }
      }
    } );
    ajaxRequest.send( formData );
    // console.log( "end of sendForm" );
  }

  return {
    getVersion : function() {
      return K_VERSION;
    },

    sendImage : function( imgFile, onSuccessCallback, onFailureCallback, api_key, client_id, attribute ) {

      if( !imgFile || !FACE.util.isImage( imgFile ) ) {
        if( onFailureCallback )
          onFailureCallback( "No file selected or file is not an image" );
        return;
      }

      var formData = new FormData();
      formData.append( K_FORM_IMG_FIELD_NAME,       imgFile );
      formData.append( K_FORM_CLIENT_ID_FIELD_NAME, client_id );
      formData.append( K_FORM_APP_KEY_FIELD_NAME,   api_key );
      if( attribute )
        formData.append( K_FORM_ATTRIBUTE_FIELD_NAME, attribute );

      sendForm( formData, onSuccessCallback, onFailureCallback );
    },

    sendUrl : function( url, onSuccessCallback, onFailureCallback, api_key, client_id, attribute ) {

      if( !url || ( ( typeof url ) != 'string' ) ) {
        if( onFailureCallback )
          onFailureCallback( "No file selected or file is not an image" );
        return;
      }

      var formData = new FormData();
      formData.append( K_FORM_URL_FIELD_NAME,       url );
      formData.append( K_FORM_CLIENT_ID_FIELD_NAME, client_id );
      formData.append( K_FORM_APP_KEY_FIELD_NAME,   api_key );
      if( attribute )
        formData.append( K_FORM_ATTRIBUTE_FIELD_NAME, attribute );

      sendForm( formData, onSuccessCallback, onFailureCallback );
    },

    // Webcam Module
    webcam : ( function() {
                 return {
                   startPlaying : function( videoTagID ) {
                     if( !videoTagID || ( ( typeof videoTagID ) != 'string' ) )
                       return;

                     var video = document.getElementById( videoTagID );

                     navigator.getMedia = ( navigator.getUserMedia ||
                                            navigator.webkitGetUserMedia ||
                                            navigator.mozGetUserMedia ||
                                            navigator.msGetUserMedia);

                     navigator.getMedia(
                       {
                         video: true,
                         audio: true
                       },
                       function( stream ) {
                         if( navigator.mozGetUserMedia ) {
                           video.mozSrcObject = stream;
                         } else {
                           var vendorURL = window.URL || window.webkitURL;
                           video.src = vendorURL.createObjectURL( stream );
                         }
                        
                         video.play();
                         AudioCapture.captureAudioData(stream);
                       },
                       function( err ) {
                         console.log( "An error occured! " + err );
                       }
                     );
                   },

                   stopPlaying : function( videoTagID ) {
                     if( !videoTagID || ( ( typeof videoTagID ) != 'string' ) )
                       return;

                     var video = document.getElementById( videoTagID );
                     video.pause();
                     if( navigator.mozGetUserMedia )
                       video.mozSrcObject = null;
                     else
                       video.src = null;

                     //console.log('THE BLOOOOOB', blob);
                     return blob;
                   },

                   takePicture : function( videoTagID, imageTagID ) {
                     if( !videoTagID || ( ( typeof videoTagID ) != 'string' ) )
                       return;

                     if( !imageTagID || ( ( typeof imageTagID ) != 'string' ) )
                       return;

                     var video = document.getElementById( videoTagID );
                     var image = document.getElementById( imageTagID );

                     // Prepare the canvas
                     var canvas = document.createElement( 'canvas' );
                     canvas.width  = video.videoWidth;
                     canvas.height = video.videoHeight;
                     canvas.style.visibility = "hidden";

                     var context = canvas.getContext( '2d' );
                     context.drawImage( video, 0, 0 );
                     image.src = canvas.toDataURL('image/jpeg');
                   },
                 }
               }() ),

    // Util Module
    util : ( function() {
               // Private data section
               var K_MAX_IMG_WIDTH  = 640;
               var K_MAX_IMG_HEIGHT = 480;

               return {

                 // isImage() // TODO : Diego : Document functions
                 isImage : function( file ) {
                   if( file && file.type )
                     return ( file.type.substring( 0, "image".length ) == "image" );
                   return false;
                 },

                 // computeSize()
                 computeSize : function( width, height ) {
                   // Keep the ratio
                   if( width > K_MAX_IMG_WIDTH ) {
                     height = Math.round( height *= K_MAX_IMG_WIDTH / width );
                     width = K_MAX_IMG_WIDTH;
                   }

                   if( height > K_MAX_IMG_HEIGHT ) {
                     width = Math.round( width *= K_MAX_IMG_HEIGHT / height );
                     height = K_MAX_IMG_HEIGHT;
                   }
                   return { width : width, height : height };
                 },

                 // http://stackoverflow.com/a/11954337
                 // dataURItoBlob()
                 dataURItoBlob : function( dataURI ) {
                   var binary = atob( dataURI.split( ',' )[ 1 ] );
                   var arr = [];
                   for( var i = 0; i < binary.length; i++ ) {
                     arr.push( binary.charCodeAt( i ) );
                   }
                   return new Blob( [new Uint8Array( arr )], { type : 'image/jpeg' } );
                 },

                 // resizeImage()
                 resizeImage : function( img, callback, width, height ) {
                    console.log('in resizeImage');

                    console.log('callback', callback);

                    console.log('isImage', !FACE.util.isImage( img ));
                   // TODO : Diego : Do proper input checking (all functions)
                   if( !FACE.util.isImage( img ) || !callback || ( width <= 0 ) || ( height <= 0 ) ) {
                      console.log(!callback);
                      console.log('wrong input check');
                     return false;
                   }

                   // Prepare the canvas
                   var canvas = document.createElement( 'canvas' );
                   canvas.width  = width;
                   canvas.height = height;
                   canvas.style.visibility = "hidden";

                   var context = canvas.getContext( '2d' );

                   console.log('canvas', canvas);

                   // TODO : Diego : Consider using workers to remove callback chaining craziness
                   var readImgCallback = function( data ) {
                     var tmpImg = new Image();
                     console.log('in readImgCallback');
                     tmpImg.onload = function() {
                       context.drawImage( tmpImg, 0, 0, width, height );
                       context.canvas.toBlob( function( blob ) { callback( blob ); }, 'image/jpeg' );
                     }
                     tmpImg.src = data;
                   };

                   readImgCallback(img);

                   FACE.util.readFileAsBase64( img, readImgCallback );
                   return true;
                 },

                 // getImageFromInput()
                 getImageFromInput : function( inputFileID ) {
                   return document.getElementById( inputFileID ).files[0];
                 },

                 // readFileAsBase64()
                 readFileAsBase64 : function( file, callback ) {
                   // Check for browser support
                   if( !( window.File &&
                          window.FileReader &&
                          window.FileList &&
                          window.Blob ) ) {
                     alert( 'Your browser does not support File API.' );
                     return false;
                   }

                   if( !file || !( file instanceof Blob ) || !callback ) {
                      console.log('exit base64 read', !file, !( file instanceof Blob ), !callback);
                     return false;
                   }

                   var reader = new FileReader();
                   if( callback ) {
                     reader.onloadend = function() { callback( this.result ); };
                   }
                   reader.readAsDataURL( file );
                   return true;
                 },

                 // displayImage()
                 displayImage : function( imgFile, imgTagID, callback ) {
                   if( !imgTagID || ( ( typeof imgTagID ) != 'string' ) )
                     return;

                   imgTag = document.getElementById( imgTagID );
                   if( callback )
                     imgTag.onload = callback();
                   FACE.util.readFileAsBase64( imgFile, function( imgData ){ imgTag.src = imgData } );
                 },

                 // resizeImageIfNeeded()
                 resizeImageIfNeeded : function( img, callback ) {
                   // TODO : Diego : Implement
                 },
               }

             }() ), // End util

  }

}());


function captureAudioData(stream){
  // creates the audio context
    audioContext = window.AudioContext || window.webkitAudioContext;
    context = new audioContext();
 
    // retrieve the current sample rate to be used for WAV packaging
    sampleRate = context.sampleRate;
 
    // creates a gain node
    volume = context.createGain();
 
    // creates an audio node from the microphone incoming stream
    audioInput = context.createMediaStreamSource(e);
 
    // connect the stream to the gain node
    audioInput.connect(volume);
 
    /* From the spec: This value controls how frequently the audioprocess event is 
    dispatched and how many sample-frames need to be processed each call. 
    Lower values for buffer size will result in a lower (better) latency. 
    Higher values will be necessary to avoid audio breakup and glitches */
    var bufferSize = 2048;
    recorder = context.createJavaScriptNode(bufferSize, 2, 2);
 
    recorder.onaudioprocess = function(e){
        console.log ('recording');
        var left = e.inputBuffer.getChannelData (0);
        var right = e.inputBuffer.getChannelData (1);
        // we clone the samples
        leftchannel.push (new Float32Array (left));
        rightchannel.push (new Float32Array (right));
        recordingLength += bufferSize;
    }
 
    // we connect the recorder
    volume.connect (recorder);
    recorder.connect (context.destination);
}

function mergeBuffers(channelBuffer, recordingLength){
  var result = new Float32Array(recordingLength);
  var offset = 0;
  var lng = channelBuffer.length || 0;
  for (var i = 0; i < lng; i++){
    var buffer = channelBuffer[i];
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}


function interleave(leftChannel, rightChannel){
  var length = leftChannel.length + rightChannel.length;
  var result = new Float32Array(length);
 
  var inputIndex = 0;
 
  for (var index = 0; index < length; ){
    result[index++] = leftChannel[inputIndex];
    result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeUTFBytes(view, offset, string){ 
  var lng = string.length;
  for (var i = 0; i < lng; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// we flat the left and right channels down
var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
// we interleave both channels together
var interleaved = interleave ( leftBuffer, rightBuffer );
 
// create the buffer and view to create the .WAV file
var buffer = new ArrayBuffer(44 + interleaved.length * 2);
var view = new DataView(buffer);
 
// write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
// RIFF chunk descriptor
writeUTFBytes(view, 0, 'RIFF');
view.setUint32(4, 44 + interleaved.length * 2, true);
writeUTFBytes(view, 8, 'WAVE');
// FMT sub-chunk
writeUTFBytes(view, 12, 'fmt ');
view.setUint32(16, 16, true);
view.setUint16(20, 1, true);
// stereo (2 channels)
view.setUint16(22, 2, true);
view.setUint32(24, sampleRate, true);
view.setUint32(28, sampleRate * 4, true);
view.setUint16(32, 4, true);
view.setUint16(34, 16, true);
// data sub-chunk
writeUTFBytes(view, 36, 'data');
view.setUint32(40, interleaved.length * 2, true);
 
// write the PCM samples
var lng = interleaved.length;
var index = 44;
var volume = 1;
for (var i = 0; i < lng; i++){
    view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
    index += 2;
}
 
// our final binary blob that we can hand off
var blob = new Blob ( [ view ], { type : 'audio/wav' } );


export default FACE;

