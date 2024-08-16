import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import Spinner from '../../components/Spinner';
import { Modal, Alert } from 'antd';

const CreateGrade = () => {
    const [grades, setGrades] = useState([]);
    const [name, setName] = useState("");
    const [updatedName, setUpdatedName] = useState("");
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    //create grade
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const gradeData = new FormData();
            gradeData.append("name", name);
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/grade/create-grade`, gradeData)
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(`${data.message}`)
                getAllGrades();
                //clear fields
                setName("");
                setListSpinnerLoading(false);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setSpinnerLoading(false);
            } else {
                toast.error("Something went wrong");
                setSpinnerLoading(false);
            }
        }
    };

    //Get All Grades
    const getAllGrades = async (req, res) => {
        setListSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data.success) {
                setGrades(data.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching grades")
        } finally {
            setListSpinnerLoading(false)
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])

    //update grade
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSpinnerLoading(true);
        try {
            const updatedGradeData = new FormData();
            updatedGradeData.append("name", updatedName);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/grade/update-grade/${selected._id}`, updatedGradeData)
            if (data.success) {
                setUpdateSpinnerLoading(false);
                toast.success(`${data.message}`)
                getAllGrades();
                //clear fields
                setSelected(null);
                setVisible(false);
                setUpdatedName("");
                setListSpinnerLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                setUpdateSpinnerLoading(false);
            } else {
                toast.error("Something went wrong");
                setUpdateSpinnerLoading(false);
            }
        }
    };

    // Open modal with selected result data
    const openModal = (grade) => {
        setVisible(true);
        setSelected(grade);
        setUpdatedName(grade.name);
    }

    //Delete grade
    const handleDelete = async (gId) => {
        let answer = window.confirm("Are you sure? Deleting this grade will also delete all associated users, user data, and associated content.");
        if (!answer) {
            return;
        }
        const loadingToastId = toast.loading('Deleting grade...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/grade/delete-grade/${gId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllGrades();
            } else {
                toast.error(data.message, { id: loadingToastId });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting grade", { id: loadingToastId });
        }
    }


    return (
        <Layout title={"Admin - Create Grade"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Grade</h2>
                        <form className="p-3" onSubmit={handleCreate}>
                            <div>
                                <input
                                    type="text"
                                    placeholder='Enter grade'
                                    className='form-control m-2'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    minLength={4} maxLength={20}
                                    required
                                />
                            </div>
                            <div className="mt-3 text-center">
                                <button type='submit' className="btn btn-warning fw-bold">
                                    {spinnerLoading ? <Spinner /> : "Create Grade"}
                                </button>
                            </div>
                        </form>
                        <div className="d-flex justify-content-center">
                            <Alert
                                className='m-2 col-md-9'
                                message={
                                    <>
                                        <b>Deleting a grade will also delete all associated users, their data (result, payment status etc), and associated content.</b>
                                    </>
                                }
                                type="warning"
                                showIcon
                            />
                        </div>
                        <h6 className='text-start'>Count: {grades.length}</h6>
                        <div className="table-container">
                            {
                                listSpinnerLoading ? <div className="m-5"><Spinner /></div> :
                                    <table className='table table-fixed-header'>
                                        <thead className='table-dark'>
                                            <tr>
                                                <th scope='row'>#</th>
                                                <th>Grade</th>
                                                <th>Created</th>
                                                <th>Modified</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grades.map((g, i) => (
                                                <tr>
                                                    <th scope='row'>{i + 1}</th>
                                                    <td className='fs-5 fw-bold'>{g.name}</td>
                                                    <td>{moment(g?.createdAt).fromNow()}</td>
                                                    <td>{moment(g?.updatedAt).fromNow()}</td>
                                                    <td className='d-flex'>
                                                        <button className='btn btn-primary mx-1' onClick={() => { openModal(g) }}
                                                            disabled={g.name === "Administration"}>
                                                            <i class="fa-solid fa-pen-to-square"></i> Edit
                                                        </button>
                                                        <button className='btn btn-danger mx-1' onClick={() => { handleDelete(g._id) }}
                                                            disabled={g.name === "Administration"}>
                                                            <i class="fa-solid fa-trash-can"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </div>
                    <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                        <h5 className='text-center'>Update Grade</h5>
                        <form onSubmit={handleUpdate}>
                            <div className='mt-4'>
                                <input
                                    type="text"
                                    placeholder='Updated Grade Name'
                                    className='form-control mb-3'
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    minLength={4} maxLength={20}
                                    required
                                />
                            </div>
                            <div className="text-center mt-2">
                                <button type='submit' className="btn btn-warning fw-bold">
                                    {updateSpinnerLoading ? <Spinner /> : "Update Grade"}
                                </button>
                            </div>
                        </form>
                    </Modal>
                </div>
            </div>
        </Layout>
    );
};

export default CreateGrade;