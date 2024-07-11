import React from 'react';

const GradeForm = ({ handleSubmit, value, setValue }) => {

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" className="form-control" placeholder='Enter New Grade' value={value}
                        onChange={(e) => { setValue(e.target.value) }} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </>
    );
};

export default GradeForm;