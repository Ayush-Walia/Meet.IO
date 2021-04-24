import { BottomBar, VideoArea, ChatPanel, Home, NotFound } from './components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col, Result, Button } from 'antd';
import { useChat } from './providers/ChatProvider';
import { MessageNotificationProvider } from './providers/MessageNotificationProvider';
import { ParticipantsProvider } from './providers/ParticipantsProvider';
import './App.css';
import "antd/dist/antd.css";

const onStartNewMeeting = () => {
  window.location.href = '/';
}

function App() {
  const showChat = useChat();
  return (
    <Router>
      <Switch>
        <Route exact path="/" >
          <Home />
        </Route>
        <Route exact path="/meeting/:id">
          <div>
            <ParticipantsProvider>
              <MessageNotificationProvider>
                <Row className="view_container">
                  {/* Use 3/4 of page width if chatPanel is open else use 100% */}
                  <div style={showChat ? { width: '75vw' } : { width: '100vw' }} className="video_area">
                    <VideoArea />
                  </div>
                  <div style={showChat ? { width: '25vw' } : { width: '0vw' }} className="chat_panel">
                    <ChatPanel />
                  </div>
                </Row>
                <Row align="bottom" className="bottom_bar">
                  <Col span={showChat ? 18 : 24}>
                    <BottomBar />
                  </Col>
                </Row>
              </MessageNotificationProvider>
            </ParticipantsProvider>
          </div>
        </Route>
        <Route path="/meetingDone">
          <Result className="result_page" status="success" title="Meeting Ended!" extra={[<Button type="primary" size="large" key="result_page" onClick={onStartNewMeeting}>Start Another Meeting!</Button>]} />
        </Route>
        <Route path="*">
          <div className="not_found">
            <NotFound />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
