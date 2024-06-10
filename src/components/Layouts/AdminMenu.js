import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from './GoBackButton';

const AdminMenu = () => {
    return (
        <>
            <div className="text-center" >
                <div className="list-group ">
                    <NavLink to="/dashboard/admin" className="product-link">
                        <GoBackButton />
                        <h4>Admin Panel</h4>
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-grade" className="list-group-item list-group-item-action">
                        Create & View Grade
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-course" className="list-group-item list-group-item-action">
                        Create Course
                    </NavLink>
                    <NavLink to="/dashboard/admin/courses" className="list-group-item list-group-item-action">
                        All Courses
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-link" className="list-group-item list-group-item-action">
                        Content Links
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-result" className="list-group-item list-group-item-action">
                        Publish Results
                    </NavLink>
                    <NavLink to="/dashboard/admin/create-payment" className="list-group-item list-group-item-action">
                        Set Payment Status
                    </NavLink>
                    <NavLink to="/dashboard/admin/students" className="list-group-item list-group-item-action">
                        All Students
                    </NavLink>
                </div>
            </div>
        </>
    );
};

export default AdminMenu;