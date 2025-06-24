import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="p-8 text-center text-xl">
      ✅ واجهة كوكبة تعمل بنجاح مع TailwindCSS وخط Cairo
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
