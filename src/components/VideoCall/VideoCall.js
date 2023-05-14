import React, { useEffect, useRef, useState } from "react";
import peer from "../../Peer.js";

const VideoCall = () => {
  const myRef = useRef(React.createRef);
  const theirRef = useRef(React.createRef);
  
  const [myStream, setMyStream] = useState(null);
  const [theirStream, setTheirStream] = useState(null);
  const [myPeerId, setMyPeerId] = useState("");
  const [theirPeerId, setTheirPeerId] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {

    peer.on("open", (id) => {
      setMyPeerId(id);
      console.log(id);
    });

    peer.on('call', (call) => {
      answerCall(call);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        myRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    // // Clean up the peer object on unmount
    // return () => {
    //   peer.disconnect();
    //   peer.destroy();
    // };    
  }, []);

  const callUser = (id) => {
    const call = peer.call(id, myStream);

    call.on("stream", (stream) => {
      setTheirStream(stream);
    });

    call.on("close", () => {
      setTheirStream(null);
      setCallEnded(true);
    });

    setCallAccepted(true);
  };

  const answerCall = (call) => {
    setCallAccepted(true);
  
    call.answer(myStream);
  
    call.on("stream", (stream) => {
      setTheirStream(stream);
      theirRef.current.srcObject = stream;
    });
  
    call.on("close", () => {
      setTheirStream(null);
      setCallEnded(true);
    });
  };
  
  return (
    <div>
      {myStream && (
        <div> 
          <h2>My ID: {myPeerId}</h2>
          <video
            playsInline
            muted
            ref={myRef}
            autoPlay
          />
        </div>
      )}

      {!callAccepted && (
        <div>
          <h2>Peer ID: </h2>
          <input
            type="text"
            value={theirPeerId}
            onChange={(e) => setTheirPeerId(e.target.value)}
            placeholder="Enter Peer ID to call"
          />
          <button onClick={() => callUser(theirPeerId)}>Call</button>
        </div>
      )}

      {theirStream && (
        <div> 
        <h2>Their ID: {theirPeerId}</h2>      
          <video
            playsInline
            ref={theirRef}
            autoPlay
          />
        </div> 
      )}
      {callAccepted && !callEnded && (
        <div>
          <button onClick={() => setCallEnded(true)}>End Call</button>
        </div>
      )}

      {theirStream && !callAccepted && (
        <div>
          <h2>Incoming Call...</h2>
          <button onClick={answerCall}>Answer</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
