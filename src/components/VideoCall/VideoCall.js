import React, { useEffect, useState } from "react";
import peer from "../../Peer.js";

const VideoCall = () => {
  const [myStream, setMyStream] = useState(null);
  const [theirStream, setTheirStream] = useState(null);
  const [myPeerId, setMyPeerId] = useState("");
  const [theirPeerId, setTheirPeerId] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);

        peer.on("open", (id) => {
          setMyPeerId(id);
        });
      });
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

  const answerCall = () => {
    setCallAccepted(true);

    const call = peer.call(theirPeerId, myStream);

    call.on("stream", (stream) => {
      setTheirStream(stream);
    });

    call.on("close", () => {
      setTheirStream(null);
      setCallEnded(true);
    });
  };

  return (
    <div>
      {myStream && (
        <video
          playsInline
          muted
          ref={(node) => (node.srcObject = myStream)}
          autoPlay
        />
      )}

      {!callAccepted && (
        <div>
          <h2>Peer ID: {myPeerId}</h2>
          <input
            type="text"
            value={theirPeerId}
            onChange={(e) => setTheirPeerId(e.target.value)}
            placeholder="Enter ID to call"
          />
          <button onClick={() => callUser(theirPeerId)}>Call</button>
        </div>
      )}

      {theirStream && (
        <video
          playsInline
          ref={(node) => (node.srcObject = theirStream)}
          autoPlay
        />
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
