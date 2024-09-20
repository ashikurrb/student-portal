import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div>
            <button className='btn my-1' onClick={handleGoBack}><b> <i className="fa-solid fa-arrow-left"></i> </b></button>
            
        </div>
    );
};

export default GoBackButton;