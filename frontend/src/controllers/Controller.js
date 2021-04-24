import { io } from "socket.io-client";
import Peer from 'peerjs';

const socket = io('https://meet-io.herokuapp.com');
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    secure: true, 
    host: 'meet-io.herokuapp.com',
    port: '443'
});

let localVideoStream, addParticipantCall, participants, addParticipant, removeParticipant, remoteVideoRef, RoomID, myPeerID, toggleParticipantVideo, setLocalVideoInfo;
let localVideoInfo = true;

const audioToggle = () => {
    const enabled = localVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        localVideoStream.getAudioTracks()[0].enabled = false;
    } else {
        localVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const videoToggle = () => {
    let enabled = localVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        localVideoStream.getVideoTracks()[0].enabled = false;
    } else {
        localVideoStream.getVideoTracks()[0].enabled = true;
    }
    // Update local state for showing Card instead of video and emit video toggle to room.
    setLocalVideoInfo(prevState => !prevState)
    socket.emit('send-toggle-video', myPeerID, RoomID);
}

// Add stream to particular html video ref.
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
}

const initVideo = (localVideoRef, localVideoSecondaryStream, rVideoRef, aParticipantCall, sLocalVideoInfo) => {
    RoomID = window.location.pathname.split('/')[2];

    // Redirect to home page if sessionStorage does not have userName for this room.
    if (sessionStorage.getItem(RoomID) === null) {
        window.location.href = "../../";
    }

    remoteVideoRef = rVideoRef;
    addParticipantCall = aParticipantCall;
    setLocalVideoInfo = sLocalVideoInfo;

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        localVideoStream = stream;
        addVideoStream(localVideoRef, stream);
        addVideoStream(localVideoSecondaryStream, stream);
    }).catch(err => {
        console.error(err);
    })

    // Handle call from other participants, answer with localStream and handle remote stream after answering the call.
    myPeer.on('call', call => {
        call.answer(localVideoStream);
        call.on('stream', async (remoteVideoStream) => {
            let participantId = call.peer;
            await addParticipantCall({ participantId, call });
            addVideoStream(rVideoRef.get(participantId), remoteVideoStream);
        })
    })

    // Get info about other participants after joining the room.
    socket.on('get-peer-info', (participantId, userName) => {
        addParticipant({ participantId, userName });
    })

    // handle event when any participant toggle Video.
    socket.on('get-toggle-video', participantId => {
        if (participantId !== myPeerID) {
            toggleParticipantVideo(participantId);
        }
    })

    // handle event when new participant joins the room.
    socket.on('user-connected', (participantId, participantSocketId, userName) => {
        connectToNewUser(participantId, participantSocketId, userName, localVideoStream);
    })

    socket.on('user-disconnected', participantId => {
        if (participants.get(participantId)) {
            participants.get(participantId).call.close();
            removeParticipant(participantId);
            remoteVideoRef.delete(participantId);
        }
    })

    // Open connection with peerjs and join the room.
    myPeer.on('open', ID => {
        myPeerID = ID;
        socket.emit('join-room', RoomID, myPeerID, sessionStorage.getItem(RoomID));
    })
}

// Set up receiveMessage Listener on init.
const initChat = (setMessages) => {
    socket.on('receiveMessage', message => {
        setMessages(prevState => [...prevState, message]);
    })
}

const initParticipants = (aParticipant, rParticipant, tParticipantVideo, prtcpts) => {
    addParticipant = aParticipant;
    removeParticipant = rParticipant;
    toggleParticipantVideo = tParticipantVideo;
    participants = prtcpts;
}

// Send messages to room.
const sendMessage = (message) => {
    socket.emit('message', {
        userName: sessionStorage.getItem(RoomID),
        message: message
    });
}

const connectToNewUser = (participantId, participantSocketId, userName, stream) => {
    // Create a call to newly joined participant.
    const call = myPeer.call(participantId, stream);
    myPeer.on('error', (err) => console.error(err));

    // Send My info to newly joined participant.
    socket.emit('send-peer-info', myPeerID, participantSocketId, sessionStorage.getItem(RoomID));

    addParticipantCall({ participantId, call });

    // handle participant stream.
    call.on('stream', remoteVideoStream => {
        addVideoStream(remoteVideoRef.get(participantId), remoteVideoStream);
    })

    call.on('close', () => {
        remoteVideoRef.get(participantId).srcObject = null;
    })
    addParticipant({ participantId, userName });

    // If my video is muted, send that info to any new participant who joins the room.
    if(!localVideoInfo) {
        socket.emit('send-toggle-video-to-peer', myPeerID, participantSocketId);
    }
}

// Update value on state change, to used by components as callbacks.
const updateParticipantsValue = (prtcpts) => {
    participants = prtcpts;
}

const updateLocalVideoInfo = (lVideoInfo) => {
    localVideoInfo = lVideoInfo;
}

const leaveMeeting = () => {
    socket.disconnect();
}

export { initVideo, initChat, initParticipants, updateParticipantsValue, audioToggle, videoToggle, sendMessage, leaveMeeting, updateLocalVideoInfo }