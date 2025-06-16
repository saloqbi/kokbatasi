// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToolProvider } from './context/ToolContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToolProvider>
      <App />
    </ToolProvider>
  </React.StrictMode>
);
