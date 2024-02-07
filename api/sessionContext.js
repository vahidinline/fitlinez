import React, { createContext, useState } from 'react';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState([]);

  return (
    <SessionContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
