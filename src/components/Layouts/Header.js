import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import DarkModeButton from './DarkModeButton';


const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">STUDENT PORTAL</Link>
                    <button className="navbar-toggler ms-auto my-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="d-lg-none">
                        <DarkModeButton />
                    </div>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <form className="d-flex ms-auto" role="search">
                            <input className="form-control " type="search" placeholder="Search" aria-label="Search" />
                            &nbsp;
                            <button className="btn btn-outline-success" type="submit"> Search</button>
                        </form>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link">Home</NavLink>
                                </li>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/courses" className="nav-link" >Courses</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link" >Register</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link" >Log in</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink to=" " className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    UserName
                                </NavLink>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink to="/dashboard" className="dropdown-item">Dashboard</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/logout" className="dropdown-item">Log Out
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/admin" className="dropdown-item">Admin
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/student" className="dropdown-item">Student
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">About Us</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="d-none d-lg-block">
                        <DarkModeButton />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;