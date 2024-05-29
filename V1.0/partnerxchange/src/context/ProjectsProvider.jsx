import React, { createContext, useContext, useState } from 'react';

// Create a context
const ProjectsContext = createContext();

// Create a provider component
export const ProjectsProvider = ({ children }) => {
    const [Projects, setProjects] = useState([]);


    return (
        <ProjectsContext.Provider value={{ Projects, setProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
}

// Create a custom hook to use the ProjectsContext
export const useProjectsContext = () => {
    return useContext(ProjectsContext);
}
