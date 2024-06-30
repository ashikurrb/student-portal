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
                                <NavLink to="/login" className="nav-link"> <i class="fa-solid fa-right-to-bracket"></i> Login</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle mx-1" role="button" data-bs-toggle="dropdown" >
                                    <img style={{ width: "25px" }} className=' img-thumbnail rounded-circle' src="https://cdn-icons-png.flaticon.com/512/21/21104.png" alt="dp" />   Username
                                </NavLink>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink to="/dashboard" className="dropdown-item"> <i class="fa-solid fa-user"></i> Dashboard </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/login" className="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i>  Logout </NavLink>
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