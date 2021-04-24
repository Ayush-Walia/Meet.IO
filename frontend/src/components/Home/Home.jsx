import React, { useState } from 'react';
import { Typography, Space, Button, Input } from 'antd';
import { VideoCameraTwoTone, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { v4 } from 'uuid';
import styles from './Home.module.css';
const { Title, Text } = Typography;

export default function Home() {
    // Show Meeting join options on true and userName form on false;
    const [componentSwitch, setComponentSwitch] = useState(true);
    const [roomID, setRoomID] = useState('');
    const [userName, setUserName] = useState('');

    const handleRoomIDInput = (event) => {
        setRoomID(event.target.value);
    }

    const handleUserNameInput = (event) => {
        setUserName(event.target.value);
    }

    const handleNewMeeting = () => {
        setComponentSwitch(prevState => !prevState);
        setRoomID(v4());
    }

    const handleOnJoin = () => {
        if (roomID !== '') {
            setComponentSwitch(prevState => !prevState);
        }
    }

    const handleBack = () => {
        setRoomID('');
        setUserName('');
        setComponentSwitch(prevState => !prevState);
    }

    const handleOnJoinMeeting = () => {
        if (userName !== '') {
            sessionStorage.setItem(roomID, userName);
            window.location.href = `/meeting/${roomID}`;
        }
    }

    return (
        <div className={styles.container}>
            <Title>
                <Space className={styles.logo}>
                    <VideoCameraTwoTone />Meet.IO
                </Space>
            </Title>
            <div className={styles.join_options}>
                {componentSwitch ?
                    <Space direction="vertical">
                        <Button type="primary" size="large" onClick={handleNewMeeting}>Create New Meeting</Button>
                        <Text strong className={styles.join_options_or}>OR</Text>
                        <Space>
                            <Input placeholder="Enter Room ID!" size="large" value={roomID} onChange={handleRoomIDInput} onPressEnter={handleOnJoin} />
                            <Button type="primary" size="large" onClick={handleOnJoin}>Join</Button>
                        </Space>
                    </Space>
                    :
                    <Space direction="vertical">
                        <Space>
                            <Input placeholder="User Name" size="large" value={userName} onChange={handleUserNameInput} onPressEnter={handleOnJoinMeeting} prefix={<UserOutlined />} />
                            <Button type="primary" size="large" onClick={handleOnJoinMeeting}>Join</Button>
                        </Space>
                        <Button icon={<ArrowLeftOutlined />} type="default" size="medium" onClick={handleBack}>back</Button>
                    </Space>
                }
            </div>
        </div>
    )
}