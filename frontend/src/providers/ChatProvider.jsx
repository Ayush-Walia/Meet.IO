import React, { useState, useContext } from 'react';

const ChatContext = React.createContext();
const ChatToggleContext = React.createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function useChatToggle() {
    return useContext(ChatToggleContext);
}

export function ChatProvider({ children }) {
    // chat panel is open(true) or close(false).
    const [showChat, setShowChat] = useState(false);

    const toggleChat = () => {
        setShowChat(prevState => !prevState);
    }
  
    return (
        <ChatContext.Provider value={showChat}>
            <ChatToggleContext.Provider value={toggleChat}>
                {children}
            </ChatToggleContext.Provider>
        </ChatContext.Provider>
    )
}
