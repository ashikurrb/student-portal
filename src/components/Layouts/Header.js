import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import DarkModeButton from '../DarkModeButton';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';


const Header = () => {
    const [auth, setAuth] = useAuth();

    // Logout
    const handleLogOut = () => {
        const logoutPromise = new Promise((resolve) => {
            setAuth({
                ...auth,
                user: null,
                token: '',
            });
            Cookies.remove('auth'); // Remove the auth cookie
            resolve();
        });

        toast.promise(logoutPromise, {
            loading: 'Logging out...',
            success: 'Logout Successful',
            error: 'Error during logout',
        });
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand d-none d-lg-block">5Points STUDENT PORTAL</Link>
                    <Link to="/" className="navbar-brand d-lg-none">STUDENT PORTAL</Link>
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

                            {
                                !auth.user ? (<>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link" >Register</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link"> <i class="fa-solid fa-right-to-bracket"></i> Login</NavLink>
                                    </li>
                                </>) : (<>
                                    <li className="nav-item dropdown">
                                        <NavLink className="nav-link dropdown-toggle mx-1" role="button" data-bs-toggle="dropdown" >
                                            <img style={{ width: "25px" }} className='border rounded-circle' src={auth?.user?.avatar} alt="dp" />
                                            &nbsp; {auth?.user?.name}
                                        </NavLink>
                                        <ul className="dropdown-menu" >
                                            <li>
                                                <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "student"}`} className="dropdown-item"> <i class="fa-solid fa-user"></i> Dashboard </NavLink>
                                            </li>
                                            <li>
                                                <NavLink onClick={handleLogOut} to="/login" className="dropdown-item"><i class="fa-solid fa-right-from-bracket"></i>  Logout </NavLink>
                                            </li>
                                        </ul>
                                    </li>
                                </>)
                            }
                            {/* <li className="nav-item d-none d-lg-block">
                                <NavLink to="/cart" className="nav-link position-relative mx-1">
                                    <i className='fa-solid fa-cart-shopping'></i> Cart
                                    {
                                        cart?.length > 0 ?
                                            <span class="position-absolute start-100 translate-middle badge rounded-pill bg-danger">
                                                {cart.length}
                                            </span> : ""
                                    }
                                </NavLink>
                            </li> */}
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