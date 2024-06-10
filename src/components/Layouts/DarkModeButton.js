import React, { useState } from 'react';

const DarkModeButton = () => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'light')
        }
        else {
            document.documentElement.setAttribute('data-bs-theme', 'dark')
        }
    };

    return (
        <div>
            <button onClick={toggleDarkMode} className='btn fa-solid fa-circle-half-stroke'></button>
            
        </div>
    );
};

export default DarkModeButton;
