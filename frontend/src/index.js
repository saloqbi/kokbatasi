// Entry point for enhanced Kokbatasi TASI UI Integration
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LayerManager from './components/LayerManager';
import SignalFilter from './components/SignalFilter';
import ToolboxControls from './components/ToolboxControls';
import ExportPanel from './pages/ExportPanel';
import SignalDashboard from './pages/SignalDashboard';
import AutoRefreshWrapper from './pages/AutoRefreshWrapper';
import { initWebSocket } from './utils/websocket';
import { saveSetting } from './utils/settingsStorage';
import { exportToPDF } from './utils/exportUtils';

initWebSocket();
saveSetting('theme', 'dark');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AutoRefreshWrapper>
      <SignalDashboard />
      <ToolboxControls />
      <LayerManager />
      <SignalFilter />
      <ExportPanel />
      <App />
    </AutoRefreshWrapper>
  </React.StrictMode>
);
