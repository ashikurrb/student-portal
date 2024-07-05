import React from 'react';
import { NavLink } from 'react-router-dom';
import GoBackButton from '../../components/GoBackButton';

const AdminMenu = () => {
    return (
        <>
            <div className="text-center" >
                <div className="list-group">
                    <div className='border-bottom'>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <GoBackButton />
                            </div>
                            <div className="col">
                                <NavLink to="/dashboard/admin" className="product-link">
                                    <h4 className="mb-0 me-5 text-center">Admin Menu</h4>
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
                        <NavLink to="/dashboard/admin/create-grade" className="list-group-item list-group-item-action">
                            Create Grade
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
                        <NavLink to="/dashboard/student" className="list-group-item list-group-item-action">
                            Demo Student
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminMenu;