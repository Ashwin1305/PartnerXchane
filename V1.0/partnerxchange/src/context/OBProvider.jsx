import React, { createContext, useContext, useState } from 'react';

// Create a context
const OBContext = createContext();

// Create a provider component
export const OBProvider = ({ children }) => {
    const [OB, setOB] = useState([]);

    return (
        <OBContext.Provider value={{ OB, setOB }}>
            {children}
        </OBContext.Provider>
    );
}

// Create a custom hook to use the OBContext
export const useOBContext = () => {
    return useContext(OBContext);
}
