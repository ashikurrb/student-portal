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
        if (newMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    };

    // Apply the theme on component mount based on localStorage value
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            const isDarkMode = JSON.parse(savedMode);
            if (isDarkMode) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', 'light');
            }
        }
    }, []);

    return (
        <div>
            <button onClick={toggleDarkMode} className='btn'>
                <i className='fa-solid fa-circle-half-stroke'></i> {darkMode ? ' Light' : ' Dark'}
            </button>
        </div>
    );
};

export default DarkModeButton;
