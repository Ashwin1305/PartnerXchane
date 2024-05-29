import React, { createContext, useContext, useState } from 'react';

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [Users, setUsers] = useState([]);

    return (
        <UserContext.Provider value={{ Users, setUsers }}>
            {children}
        </UserContext.Provider>
    );
}

// Create a custom hook to use the UserContext
export const useUserContext = () => {
    return useContext(UserContext);
}
