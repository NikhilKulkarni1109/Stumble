import React, { useState, useEffect } from 'react';
import SimpleWebRTC from 'simplewebrtc';
import Peer from 'peerjs';

const peer = new Peer();


function VideoCall() {
  const [webrtc, setWebrtc] = useState(null);

  useEffect(() => {
    // create a new WebRTC object
    const webrtcObj = new SimpleWebRTC({
      url: 'https://signalserver.example.com',
      media: { audio: true, video: true },
      autoRequestMedia: true
    });

    // set the WebRTC object to the state
    setWebrtc(webrtcObj);

    // listen to the 'readyToCall' event
    webrtcObj.on('readyToCall', function () {
      // join the video call with a specific room name
      webrtcObj.joinRoom('my-room');
    });

    // listen to the 'streamAdded' event
    webrtcObj.on('streamAdded', handleRemoteStreamAdded);
  }, []);

  const startLocalVideo = () => {
    // check if WebRTC object is available
    if (webrtc) {
      // get the local video stream and attach it to a video element
      webrtc.startLocalVideo();
      const localVideo = document.getElementById('localVideo');
      webrtc.localVideoEl = localVideo;
    }
  };
  
  const handleRemoteStreamAdded = (event) => {
    // check if WebRTC object is available
    if (webrtc) {
      // get the remote video stream and attach it to a video element
      const stream = event.stream;
      const remoteVideo = document.getElementById('remoteVideo');
      remoteVideo.srcObject = stream;
    }
  };  

  // function to initiate a video call
  const initiateCall = () => {
    console.log(`My ID is ${peer.id}`);

    // check if WebRTC object is available
    if (webrtc) {
      // call the other participant
      startLocalVideo();
    }
  };

  return (
    <div>
      <button onClick={initiateCall}>Call</button>
      <div>
        <video id="localVideo" autoPlay playsInline muted></video>
        <video id="remoteVideo" autoPlay playsInline></video>
      </div>
    </div>
  
  );
}

export default VideoCall;
