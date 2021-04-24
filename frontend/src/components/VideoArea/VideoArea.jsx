import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Card, Space, Typography } from 'antd';
import { initVideo, updateParticipantsValue, updateLocalVideoInfo } from '../../controllers/Controller';
import { useChat } from '../../providers/ChatProvider';
import { useParticipants, useAddParticipantCall } from '../../providers/ParticipantsProvider';
import { UserOutlined } from '@ant-design/icons';
import streamsLayoutHandler from './VideoAreaUtil';
import styles from './VideoArea.module.css';
import './VideoArea.module.css';

const { Title } = Typography;
const userName = sessionStorage.getItem(window.location.pathname.split('/')[2]);

export default function VideoArea() {
    // Map of remote Video refs, key is participantId(peerId), value is react ref.
    const remoteVideoRef = useRef(new Map());
    const videoAreaRef = useRef();
    const localVideoRef = useRef();
    const localVideoSecondaryRef = useRef();
    const showChat = useChat();
    const participants = useParticipants();
    const addParticipantCall = useAddParticipantCall();

    const [localVideoInfo, setLocalVideoInfo] = useState(() => true);
    const [streamArea, setStreamArea] = useState({});

    useEffect(() => {
        initVideo(localVideoRef.current, localVideoSecondaryRef.current, remoteVideoRef.current, addParticipantCall, setLocalVideoInfo);

        // Call Video Conference layout logic on window resize.
        window.addEventListener('resize', streamsLayoutHandler(videoAreaRef, participants.size, setStreamArea));
    }, []);

    // Call Video Conference layout logic when more participants join.
    useEffect(() => {
        streamsLayoutHandler(videoAreaRef, participants.size, setStreamArea);
    }, [showChat, participants]);

    // Callback to update participants in controller.
    useEffect(() => {
        updateParticipantsValue(participants);
    }, [participants]);

    // Callback to update whether localVideo is disabled or enabled in controller.
    useEffect(() => {
        updateLocalVideoInfo(localVideoInfo);
    }, [localVideoInfo]);

    // Styling logic for handling remote Video mute and replace with cards.
    const remoteVideoStyle = (participantId, isVideo) => {
        if (isVideo) {
            return participants.get(participantId).video === false ? { ...streamArea, display: 'none' } : { ...streamArea, display: 'flex' }
        }
        return participants.get(participantId).video === true ? { ...streamArea, display: 'none' } : { ...streamArea, display: 'flex' }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.floating_menu_container}>
                    {/* Only show localVideo in mini window when video is unmuted and we have atleast 1 participant in room. */}
                    <video style={localVideoInfo && participants.size ? {} : { height: '0vh' }} className={styles.menu_video} ref={localVideoRef} muted></video>
                    <Card style={!localVideoInfo && participants.size ? { display: 'flex' } : { opacity: 0 }} className={styles.menu_video_card} bodyStyle={{ padding: 0 }} bordered={false}>
                        <Space align="center" direction="vertical">
                            <Avatar size="medium" icon={<UserOutlined />} />
                            <div className={styles.participant_name}>
                                {userName}
                            </div>
                        </Space>
                    </Card>
                </div>
                {/* Set width according to chat panel state(open/close), this prevents video overflowing the width. */}
                <div id="video_area" ref={videoAreaRef} style={showChat ? {width : '75vw'} : {width: '100vw'}} className={styles.video_area}>
                    <video style={participants.size === 0 && localVideoInfo ? { opacity: 1 } : { width: 0, height: 0, opacity: 0 }} className={styles.main_video} ref={localVideoSecondaryRef} muted></video>
                    <Card style={participants.size === 0 && !localVideoInfo ? { display: 'flex' } : { width: 0, height: 0, opacity: 0 }} className={styles.main_video_card} bodyStyle={{ padding: 0 }} bordered={false}>
                        <Space style={{ padding: 0 }} align="center" direction="vertical">
                            <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 80, xl: 100 }} icon={<UserOutlined />} />
                            <Title className={styles.participant_name} level={1}>
                                {userName}
                            </Title>
                        </Space>
                    </Card>
                    {[...participants.keys()].map(participantId => (
                        <div key={participantId}>
                            <video style={remoteVideoStyle(participantId, true)} ref={(el) => (remoteVideoRef.current.set(participantId, el))} />
                            <Card style={remoteVideoStyle(participantId, false)} className={styles.remote_video_card} bodyStyle={{ padding: 0 }} bordered={false}>
                                <Space style={{ padding: 0 }} align="center" direction="vertical">
                                    <Avatar size={{ xs: 24, sm: 32, md: 40, lg: 80, xl: 100 }} icon={<UserOutlined />} />
                                    <Title className={styles.participant_name} level={1}>
                                        {participants.get(participantId).userName}
                                    </Title>
                                </Space>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
