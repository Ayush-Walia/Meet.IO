import React from 'react';
import ReactDOM from 'react-dom';
import { ChatProvider } from './providers/ChatProvider';
import './index.css';
import App from './App';

ReactDOM.render(
  <ChatProvider>
    <App />
  </ChatProvider>,
  document.getElementById('root')
);
