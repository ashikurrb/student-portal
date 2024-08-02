import React, { useState, useEffect } from 'react';

const DarkModeButton = () => {
    // Initialize darkMode state based on localStorage value
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    // Apply the theme whenever darkMode state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    }, [darkMode]);

    return (
        <div>
            <button onClick={toggleDarkMode} className='btn ms-2'>
                 {darkMode ? <i className='fa-solid fa-sun'></i> : <i className='fa-solid fa-moon'></i>}
            </button>
        </div>
    );
};

export default DarkModeButton;