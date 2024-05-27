import React from 'react';
import { NavLink } from 'react-router-dom';

const StudentMenu = () => {
    return (
        <>
            <div className="text-center">
                <div className="list-group ">
                    <NavLink to="/dashboard/student" className="product-link">
                        <h4>Student Menu</h4>
                    </NavLink>
                    <NavLink to="/dashboard/student/profile" className="list-group-item list-group-item-action">
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
        </>
    );
};

export default StudentMenu;