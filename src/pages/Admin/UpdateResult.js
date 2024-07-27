import React from 'react';
import { DatePicker } from 'antd';

const UpdateResult = ({ handleSubmit, updatedSubject, setUpdatedSubject, updatedMarks, setUpdatedMarks, updatedExamDate, setUpdatedExamDate }) => {

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-4">
                <div className="mb-4 d-flex">
                    <input
                        type="text"
                        placeholder='Subject'
                        className='form-control w-75 me-2'
                   
                        onChange={(e) => setUpdatedSubject(e.target.value)} required
                    />
                    <DatePicker className='w-50' onChange={(date) => setUpdatedExamDate(date)} required />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder='Marks'
                        className='form-control'
                       
                        onChange={(e) => setUpdatedMarks(e.target.value)} required
                    />
                </div>
                <div className=" text-center">
                    <button type="submit" className="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i> Update</button>
                </div>
            </div>
        </form>
    );
};

export default UpdateResult;