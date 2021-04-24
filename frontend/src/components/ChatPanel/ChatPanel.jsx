import React, { useState, useEffect, useRef } from 'react'
import { Card, Input, Typography, Button, Divider } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import { initChat, sendMessage } from '../../controllers/Controller';
import { useChat, useChatToggle } from '../../providers/ChatProvider';
import { usePendingMessageToggle } from '../../providers/MessageNotificationProvider';
import styles from './ChatPanel.module.css';

const { Paragraph, Title } = Typography;

const scrollToBottom = (chatBodyRef) => {
    if (!chatBodyRef || !chatBodyRef.current) return;
    let chatBodyRefElement = chatBodyRef.current;
    chatBodyRefElement.scrollTop = chatBodyRefElement.scrollHeight + 1000;
}

export default function ChatPanel() {
    const chatBodyRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const pendingMessageToggle = usePendingMessageToggle();
    const isChatPanelOpen = useChat();

    const handleSendMessage = (event) => {
        if (event.target.value !== '') {
            sendMessage(event.target.value);
            scrollToBottom(chatBodyRef);
            setInput('');
        }
    }

    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

    useEffect(() => {
        initChat(setMessages)
    }, []);

    useEffect(() => {
        if (!isChatPanelOpen && messages.length) {
            pendingMessageToggle();
        }
    }, [messages]);

    return (
        // Set display none on chat panel close to fix animation artificats.
        <div className={styles.chat_panel} style={isChatPanelOpen ? { display: 'unset' } : { display: 'none' }}>
            <div className={styles.chat_header}>
                <div className={styles.chat_title}>
                    <Title style={{ margin: 0 }} level={2}>Chat:</Title>
                    <Button type="primary" icon={<CloseOutlined />} onClick={useChatToggle()} danger />
                </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <div className={styles.chat_content} ref={chatBodyRef}>
                <Card bordered={false}>
                    <Typography style={{ position: 'relative' }}>
                        {
                            messages.map(({ userName, message }, index) => (
                                <Paragraph key={index}>{userName}: {message}</Paragraph>
                            ))
                        }
                    </Typography>
                </Card>
            </div>
            <Input value={input} className={styles.chatBox} placeholder="Enter Message!" onChange={handleInputChange} onPressEnter={handleSendMessage} suffix={<SendOutlined />} />
        </div>
    )
}
