import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../../components/GoBackButton';

const StudentMenu = () => {
    return (
        <div>
            <div className="text-center">
                <div className="list-group">
                    <div className='border-bottom'>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col mb-1">
                                <NavLink to="/dashboard/student" className="link">
                                    <h4 className="mb-0 me-0 me-md-5 text-center">Student Profile</h4>
                                </NavLink>
                            </div>
                            <div className="col-auto mb-1">
                                <button className='btn d-md-none' data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" >
                                    <i className="fa-solid fa-bars"> </i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='d-md-collapse show rounded' id="collapseExample">
                        <NavLink to="/dashboard/student/update-profile" className="list-group-item list-group-item-action">
                            Update Profile
                        </NavLink>
                        <NavLink to="/dashboard/student/view-content" className="list-group-item list-group-item-action">
                            Content Links
                        </NavLink><NavLink to="/dashboard/student/view-result" className="list-group-item list-group-item-action">
                            View Result
                        </NavLink>
                        <NavLink to="/dashboard/student/view-payment" className="list-group-item list-group-item-action">
                            Payment Status
                        </NavLink>
                        <NavLink to="/dashboard/student/view-order" className="list-group-item list-group-item-action">
                           Orders
                        </NavLink>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentMenu;