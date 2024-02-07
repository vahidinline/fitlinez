// TimeSpentContext.js
import React, { createContext, useState } from 'react';

const UnitContext = createContext();

const UnitProvider = ({ children }) => {
  const [unit, setUnit] = useState([
    {
      massureUnit: 'metric',
    },
    {
      weightUnit: 'kg',
    },
  ]);

  return (
    <UnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export { UnitContext, UnitProvider };
