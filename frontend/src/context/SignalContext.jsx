
import React, { createContext, useContext, useState } from 'react';

const SignalContext = createContext();

export const SignalProvider = ({ children }) => {
  const [selectedSignal, setSelectedSignal] = useState(null);
  return (
    <SignalContext.Provider value={{ selectedSignal, setSelectedSignal }}>
      {children}
    </SignalContext.Provider>
  );
};

export const useSignalContext = () => useContext(SignalContext);
