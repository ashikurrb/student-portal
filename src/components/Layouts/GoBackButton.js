import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div>
            <button className='btn' onClick={handleGoBack}><b>⬅️ Back</b></button>
            
        </div>
    );
};

export default GoBackButton;