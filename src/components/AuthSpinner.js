import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSpinner = ({ path = "login", isLoading = true }) => {
    const [count, setCount] = useState(10);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setCount((prevValue) => prevValue > 0 ? prevValue - 1 : prevValue);
        }, 1000);

        if (count === 0) {
            navigate(`/${path}`, {
                state: { from: location.pathname },
            });
        }

        return () => clearInterval(interval);
    }, [isLoading, count, navigate, location, path]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
            <p className='text-center'>Redirecting to you in {count} second{count !== 1 ? 's' : ''}</p>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default AuthSpinner;
