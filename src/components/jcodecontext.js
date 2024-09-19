import React, { createContext, useState, useContext } from 'react';

const JcodeContext = createContext();

export const JcodeProvider = ({ children }) => {
  const [jcodes, setJcodes] = useState([]);

  return (
    <JcodeContext.Provider value={{ jcodes, setJcodes }}>
      {children}
    </JcodeContext.Provider>
  );
};

export const useJcode = () => useContext(JcodeContext);
