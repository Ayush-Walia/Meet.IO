import React, { useState, useContext } from 'react';

const ParticipantsContext = React.createContext();
const AddParticipantContext = React.createContext();
const RemoveParticipantContext = React.createContext();
const ToggleParticipantVideoContext = React.createContext();
const AddParticipantCallContext = React.createContext();

export function useParticipants() {
    return useContext(ParticipantsContext);
}

export function useAddParticipant() {
    return useContext(AddParticipantContext);
}

export function useRemoveParticipant() {
    return useContext(RemoveParticipantContext);
}

export function useToggleParticipantVideo() {
    return useContext(ToggleParticipantVideoContext);
}

export function useAddParticipantCall() {
    return useContext(AddParticipantCallContext);
}

export function ParticipantsProvider({ children }) {
    // Stores map of all participants, key is participantId(peerID) and value is array [userName, call, video];
    const [participants, setParticipants] = useState(new Map());

    // Function to add new Participant who joined the room.
    const addParticipant = ({ participantId, userName }) => {
        setParticipants(prevState => {
            const newState = new Map(prevState);
            if (prevState.get(participantId) !== undefined) {
                newState.set(participantId, { ...prevState.get(participantId), userName, video: true });
            }
            else {
                newState.set(participantId, { userName, call: null, video: true });
            }
            return newState;
        });
    }

    // Function to update participant video bool, on toggle-video event. 
    const toggleParticipantVideo = (participantId) => {
        setParticipants(prevState => {
            const newState = new Map(prevState);
            newState.set(participantId, {
                ...prevState.get(participantId),
                video: !prevState.get(participantId).video
            });
            return newState;
        });
    }

    // Remove participant.
    const removeParticipant = (participantId) => {
        setParticipants(prevState => {
            const newState = new Map(prevState);
            newState.delete(participantId);
            return newState;
        });
    }

    // Function to update participant call info in Map.
    const addParticipantCall = ({ participantId, call }) => {
        setParticipants(prevState => {
            const newState = new Map(prevState);
            newState.set(participantId, { ...prevState.get(participantId), call });
            return newState;
        });
    }

    return (
        <ParticipantsContext.Provider value={participants}>
            <AddParticipantContext.Provider value={addParticipant}>
                <ToggleParticipantVideoContext.Provider value={toggleParticipantVideo}>
                    <RemoveParticipantContext.Provider value={removeParticipant}>
                        <AddParticipantCallContext.Provider value={addParticipantCall}>
                            {children}
                        </AddParticipantCallContext.Provider>
                    </RemoveParticipantContext.Provider>
                </ToggleParticipantVideoContext.Provider>
            </AddParticipantContext.Provider>
        </ParticipantsContext.Provider>
    )
}
