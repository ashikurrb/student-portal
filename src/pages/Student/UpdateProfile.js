import React from 'react';
import Layout from '../../components/Layouts/Layout';
import StudentMenu from './StudentMenu';

const UpdateProfile = () => {
    return (
        <Layout title={"Profile"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <StudentMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="form-container ">
                            <form>
                                <h4 className="text-center pb-4">Update your Profile</h4>
                                <div className="mb-3">
                                    <label className="btn btn-outline-secondary col-md-12">
                                        <input
                                            type="file"
                                            name="photo"
                                            accept="image/*"

                                        />
                                    </label>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="exampleInputName" placeholder='Updated Name' required />
                                </div>
                                <div className="mb-3 " >
                                    <input type="email" readonly className="form-control" id="exampleInputEmail" placeholder='Email' disabled />
                                </div>
                                <div className="mb-3">
                                    <input type="number" className="form-control" id="exampleInputPhone" placeholder='Updated Phone Number' required />
                                </div>
                                <div className="mb-3 " >
                                        <input type="text" readonly className="form-control" id="exampleInputEmail" placeholder='Grade' disabled />
                                    </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder='New Password' required />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className=" btn btn-primary">Update</button>
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