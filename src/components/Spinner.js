import React from 'react';

const Spinner = () => {
return (
    <>
        <div className="d-flex flex-column align-items-center m-1">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </>
);
};

export default Spinner;