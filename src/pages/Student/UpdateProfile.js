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
    const [photo, setPhoto] = useState(null);
    const [avatar, setAvatar] = useState('');

    // Get user data
    useEffect(() => {
        const { email, name, phone, grade, avatar } = auth.user;
        setGrade(grade.name);
        setName(name);
        setEmail(email);
        setPhone(phone);
        setAvatar(avatar);
        setPhoto(avatar);
    }, [auth?.user]);

    // Upload photo function
    const uploadPhoto = async (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.url; // Return the URL of the uploaded photo
        } catch (error) {
            console.error('Photo upload failed:', error);
            toast.error('Photo upload failed');
            throw error;
        }
    };

    // Update profile
    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Updating your profile...');
        try {
            let avatar = auth.user.photoUrl; // Keep existing photo URL if not updating

            if (photo && photo !== auth.user.avatar) {
                // Upload new photo and get the URL
                avatar = await uploadPhoto(photo);
            }

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/update-profile`, {
                name,
                email,
                oldPassword,
                newPassword,
                phone,
                answer,
                avatar,
            });

            if (data?.error) {
                toast.error(data.error, { id: loadingToastId });
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = Cookies.get("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                Cookies.set("auth", JSON.stringify(ls));
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
                                <h4 className="text-center pb-3">Update your Profile</h4>
                                <div className="mb-3">
                                    <h6 className='text-center my-3'>Maximum Photo size is 1 MB</h6>
                                    {photo && (
                                        <div className="text-center">
                                            <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt='profile-img' height={'200px'} className='img img-responsive' />
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3 text-center">
                                    <label className="btn btn-outline-secondary col-md-12">
                                        {photo ? (typeof photo === 'string' ? 'Change Photo' : photo.name) : "Upload Photo"}
                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            onChange={(e) => setPhoto(e.target.files[0])}
                                            hidden
                                        />
                                    </label>
                                </div>
                                <div className="mb-3">
                                    <Alert
                                        className='my-2 mx-4'
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
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder='Name' required />
                                </div>
                                <div className="mb-3">
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder='Email' readOnly />
                                </div>
                                <div className="mb-3">
                                    <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder='Phone Number' required />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" placeholder='Security Answer' />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" placeholder='Password' required />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" placeholder='New Password' />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className=" btn btn-primary">
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
