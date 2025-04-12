import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import StudentMenu from './StudentMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [answer, setAnswer] = useState('');
    // const [photo, setPhoto] = useState(null);
    const [avatar, setAvatar] = useState('');

    // Get user data
    useEffect(() => {
        const { email, name, phone, grade, answer, avatar } = auth?.user;
        setGrade(grade.name);
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAvatar(avatar);
        setAnswer(answer);

    }, [auth?.user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Updating your profile...');
        try {
            const updateProfileData = new FormData();
            if (name) updateProfileData.append("name", name);
            if (phone) updateProfileData.append("phone", phone);
            if (oldPassword) updateProfileData.append("oldPassword", oldPassword);
            if (avatar) updateProfileData.append("photo", avatar);
            if (answer) updateProfileData.append("answer", answer);
            if (email) updateProfileData.append("email", email);
            if (newPassword) updateProfileData.append("newPassword", newPassword);

            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/auth/update-profile`,
                updateProfileData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (data?.error) {
                toast.error(data.error, { id: loadingToastId });
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = Cookies.get("auth");
                if (ls) {
                    ls = JSON.parse(ls);
                    ls.user = data.updatedUser;
                    Cookies.set("auth", JSON.stringify(ls));
                }
                navigate("/dashboard/student");
                toast.success(data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error, { id: loadingToastId });
            } else {
                toast.error("Something went wrong", { id: loadingToastId });
            }
        }
    };

    return (
        <Layout title={"Dashboard - Update Profile"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container">
                            <form onSubmit={handleUpdate} className='custom-profile'>
                                <h4 className="text-center pb-3"><i className="fa-solid fa-pen-to-square" />Update your Profile</h4>
                                <div className="mb-3">
                                    <h6 className='text-center my-3'>Maximum Photo size is 3 MB</h6>
                                    {avatar && (
                                        <div className="text-center">
                                            <img src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)} alt='profile-img' height={'200px'} className='img img-responsive' />
                                            <h6 className='mt-3'>
                                                {typeof avatar === 'string' ? '' : `${(avatar.size / 1048576).toFixed(2)} MB`}
                                            </h6>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3 text-center">
                                    <label className="btn btn-outline-secondary col-md-12">
                                        {avatar ? (typeof avatar === 'string' ? 'Change Photo' : avatar.name) : "Upload Photo"}
                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setAvatar(e.target.files[0]);
                                            }}
                                            hidden
                                        />
                                    </label>
                                </div>

                                <div className="d-flex justify-content-center my-3">
                                    <Alert
                                        message={
                                            <>
                                                <b>Security Answer:</b> Enter new answer to update or Leave blank to unchanged.<br />
                                                <b>Password:</b> Enter only old password to continue or Enter both old and new password to update password.
                                            </>
                                        }
                                        type="info"
                                        showIcon
                                    />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="form-control" placeholder='Grade' readOnly />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder='Name'
                                        minLength={4} maxLength={25}
                                        required />
                                </div>
                                <div className="mb-3">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder='Email' readOnly />
                                </div>
                                <div className="mb-3">
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder='Phone Number' required
                                        minLength={11} maxLength={11} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" placeholder='Your Address'
                                        minLength={3} maxLength={30}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" placeholder='Password' required />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" placeholder='New Password' />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UpdateProfile;
