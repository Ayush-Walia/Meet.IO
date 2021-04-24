import React, { useState, useContext } from 'react';

const MessageNotificationContext = React.createContext();
const MessageNotificationToggleContext = React.createContext();

export function usePendingMessage() {
    return useContext(MessageNotificationContext);
}

export function usePendingMessageToggle() {
    return useContext(MessageNotificationToggleContext);
}

export function MessageNotificationProvider({ children }) {
    // if pending message are there then state is true else false.
    const [pendingMessage, setPendingMessage] = useState(false);

    const togglePendingMessage = () => {
        setPendingMessage(prevState => !prevState);
    }

    return (
        <MessageNotificationContext.Provider value={pendingMessage}>
            <MessageNotificationToggleContext.Provider value={togglePendingMessage}>
                {children}
            </MessageNotificationToggleContext.Provider>
        </MessageNotificationContext.Provider>
    )
}
