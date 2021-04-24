import React, { useState, useEffect } from 'react'
import { Layout, Button, Row, Col, Space, Badge, Popover, Typography, Divider } from 'antd';
import { VideoCameraTwoTone, AudioTwoTone, PhoneTwoTone, UsergroupAddOutlined, MessageOutlined } from '@ant-design/icons';
import { useChatToggle } from '../../providers/ChatProvider';
import { usePendingMessage, usePendingMessageToggle } from '../../providers/MessageNotificationProvider';
import { useParticipants, useAddParticipant, useRemoveParticipant, useToggleParticipantVideo } from '../../providers/ParticipantsProvider';
import { audioToggle, videoToggle, initParticipants, leaveMeeting } from '../../controllers/Controller';
import styles from './BottomBar.module.css';

const { Paragraph, Title } = Typography;
const { Header } = Layout;

const roomID = window.location.pathname.split('/')[2];

export default function BottomBar() {
    const [videoEnabled, setVideoEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const pendingMessageToggle = usePendingMessageToggle();
    const isPendingMessage = usePendingMessage();
    const chatToggle = useChatToggle();
    const participants = useParticipants();
    const addParticipant = useAddParticipant();
    const removeParticipant = useRemoveParticipant();
    const toggleParticipantVideo = useToggleParticipantVideo();

    useEffect(() => {
        initParticipants(addParticipant, removeParticipant, toggleParticipantVideo, participants);
    }, []);

    const handleAudioToggle = () => {
        audioToggle();
        setAudioEnabled((prevAudioState) => !prevAudioState);
    }

    const handleVideoToggle = () => {
        videoToggle();
        setVideoEnabled((prevVideoState) => !prevVideoState);
    }

    const handleChatButton = () => {
        // If pending messages are there, remove Notification on click.
        if (isPendingMessage) {
            pendingMessageToggle();
        }
        chatToggle();
    }

    const handleEndMeeting = () => {
        sessionStorage.removeItem(window.location.pathname.split('/')[2]);
        window.location.href = '/meetingDone';
        leaveMeeting();
    }

    const participantsInfo = () => (
        <div>
            <Title level={5}>Participants:</Title>
            <Paragraph>{sessionStorage.getItem(roomID)}(You)</Paragraph>
            {[...participants.keys()].map(participantId => (
                <Paragraph key={participantId}>{participants.get(participantId).userName}</Paragraph>
            ))}
            <Divider />
            <Title level={5}>Meeting ID:</Title>
            <Paragraph copyable code>{roomID}</Paragraph>
        </div>
    )

    return (
        <>
            <Layout className="layout">
                <Header>
                    <Row className={styles.bottom_bar}>
                        <Col>
                            <Popover placement="topLeft" content={participantsInfo} trigger="click">
                                <Badge count={participants.size + 1}>
                                    <Button shape="circle" icon={<UsergroupAddOutlined />} size="large" />
                                </Badge>
                            </Popover>
                        </Col>
                        <Col>
                            <Space>
                                <Button shape="circle" onClick={handleVideoToggle} icon={videoEnabled ? <VideoCameraTwoTone /> : <VideoCameraTwoTone twoToneColor='red' />} size="large" />
                                <Button shape="circle" onClick={handleAudioToggle} icon={audioEnabled ? <AudioTwoTone /> : <AudioTwoTone twoToneColor='red' />} size="large" />
                                <Button shape="circle" icon={<PhoneTwoTone rotate="225" twoToneColor='red' />} onClick={handleEndMeeting} size="large" />
                            </Space>
                        </Col>
                        <Col>
                            <Badge count={isPendingMessage ? 1 : 0} dot>
                                <Button shape="circle" icon={<MessageOutlined />} size="large" onClick={handleChatButton} />
                            </Badge>
                        </Col>
                    </Row>
                </Header>
            </Layout>
        </>
    )
}
