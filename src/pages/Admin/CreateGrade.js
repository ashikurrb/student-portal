import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import Spinner from '../../components/Spinner';
import { Modal } from 'antd';

const CreateGrade = () => {
    const [grades, setGrades] = useState([]);
    const [name, setName] = useState("");
    const [updatedName, setUpdatedName] = useState("");
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    //handle GradeForm Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/grade/create-grade`, { name })
            if (data?.success) {
                setSpinnerLoading(false);
                setName("");
                toast.success(`${name} | Grade created successfully`)
                getAllGrades();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            setSpinnerLoading(false);
        }
    }

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data.success) {
                setGrades(data.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error while fetching grades")
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
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/grade/update-grade/${selected._id}`, { name: updatedName })
            if (data.success) {
                setUpdateSpinnerLoading(false);
                toast.success(`${updatedName} updated successfully`)
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllGrades();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error updating grade");
            setUpdateSpinnerLoading(false);
        }
    }
    // Open modal with selected result data
    const openModal = (grade) => {
        setVisible(true);
        setSelected(grade);
        setUpdatedName(grade.name);
    }

    //Delete grade
    const handelDelete = async (pId) => {
        try {
            let answer = window.confirm("Are you sure you want to delete this Grade? All Content related to this grade will also be deleted.")
            if (!answer) {
                return
            }
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/grade/delete-grade/${pId}`)
            if (data.success) {
                toast.success('Grade deleted successfully')
                getAllGrades();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Getting error while updating Grade")
        }
    }

    return (
        <Layout title={"Admin - Create Grade"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Grade</h2>
                        <form className="p-3" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    placeholder='New Grade Name'
                                    className='form-control m-2'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} required
                                />
                            </div>
                            <div className="mt-3 text-center">
                                <button type='submit' className="btn btn-warning fw-bold">
                                    {spinnerLoading ? <Spinner /> : "Create Grade"}
                                </button>
                            </div>
                        </form>
                        <h6 className='text-start'>Total Grade: {grades.length}</h6>
                        <div className="table-container">
                            <table className='table'>
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
                                                <button className='btn btn-primary mx-1' onClick={() => { openModal(g) }}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                                <button className='btn btn-danger mx-1' onClick={() => { handelDelete(g._id) }}><i class="fa-solid fa-trash-can"></i> Delete</button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
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
                                    onChange={(e) => setUpdatedName(e.target.value)} required
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