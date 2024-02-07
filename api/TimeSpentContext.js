// TimeSpentContext.js
import React, { createContext, useState } from 'react';

const TimeSpentContext = createContext();

const TimeSpentProvider = ({ children }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  // console.log('timeSpent in context', timeSpent);
  // console.log('children in context', children);
  return (
    <TimeSpentContext.Provider value={{ timeSpent, setTimeSpent }}>
      {children}
    </TimeSpentContext.Provider>
  );
};

export { TimeSpentContext, TimeSpentProvider };
