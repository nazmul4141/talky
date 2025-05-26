import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

function App() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const [peerId, setPeerId] = useState('');
  const [peer, setPeer] = useState(null);
  const [callId, setCallId] = useState('');

  useEffect(() => {
    const p = new Peer();
    p.on('open', id => {
      setPeerId(id);
    });

    p.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        localVideo.current.srcObject = stream;
        call.answer(stream);
        call.on('stream', remoteStream => {
          remoteVideo.current.srcObject = remoteStream;
        });
      });
    });

    setPeer(p);
  }, []);

  const makeCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideo.current.srcObject = stream;
      const call = peer.call(callId, stream);
      call.on('stream', remoteStream => {
        remoteVideo.current.srcObject = remoteStream;
      });
    });
  };

  return (
    <div>
      <h2>Your ID: {peerId}</h2>
      <input type="text" placeholder="Enter peer ID to call" onChange={e => setCallId(e.target.value)} />
      <button onClick={makeCall}>Call</button>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <video ref={localVideo} autoPlay muted width="300" />
        <video ref={remoteVideo} autoPlay width="300" />
      </div>
    </div>
  );
}

export default App;
