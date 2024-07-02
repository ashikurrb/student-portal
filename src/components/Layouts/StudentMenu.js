import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../../components/Layouts/GoBackButton';

const StudentMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group">
                    <div>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col">
                                <NavLink to="/dashboard/student" className="product-link">
                                    <h4 className="mb-0 me-5 text-center">Student Menu</h4>
                                </NavLink>
                            </div>
                            <div className="col-auto">
                                <button className='btn d-md-none' data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" >
                                    <i className="fa-solid fa-bars"> </i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='d-md-collapse show rounded' id="collapseExample">
                        <NavLink to="/dashboard/student/update-profile" className="list-group-item  list-group-item-action">
                            Update Profile
                        </NavLink>
                        <NavLink to="/dashboard/student/view-result" className="list-group-item list-group-item-action">
                            View Result
                        </NavLink>
                        <NavLink to="/dashboard/student/view-payment" className="list-group-item list-group-item-action">
                            Payment Status
                        </NavLink>
                        <NavLink to="/dashboard/student/content-link" className="list-group-item list-group-item-action">
                            Course Content Links
                        </NavLink>
                    </div>

                </div>
            </div>
        </>
    );
};

export default StudentMenu;