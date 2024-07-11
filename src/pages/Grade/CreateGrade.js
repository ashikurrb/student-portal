import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from '../Admin/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from "moment";
import GradeForm from './GradeForm';
import { Modal } from 'antd';

const CreateGrade = () => {
    const [grades, setGrades] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("")

    //handle GradeForm Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/grade/create-grade`, { name })
            if (data?.success) {
                toast.success(`${name} | Grade created successfully`)
                getAllGrades();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in input")
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
            toast.error("Getting error while fetching Grade")
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])

    //update grade
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/grade/update-grade/${selected._id}`, { name: updatedName })
            if (data.success) {
                toast.success(`${updatedName} updated successfully`)
                setSelected(null);
                setUpdatedName("");
                setVisible(false);
                getAllGrades();
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Getting error while updating Grade")
        }
    }

    //Delete grade
    const handelDelete = async (pId) => {
        try {
            let answer = window.confirm("Are you sure you want to delete this Grade?")
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
                        <h6 className='text-center my-3'>Total Grade: {grades.length}</h6>
                        <div className="p-3">
                            <GradeForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                       <div className="table-container">
                       <table className='table'>
                            <thead className='table-dark'>
                                <tr>
                                    <th scope='row'>#</th>
                                    <th>Grade</th>
                                    <th>Action</th>
                                    <th>Created</th>
                                    <th>Modified</th>
                                </tr>
                            </thead>
                            <tbody>

                                {grades.map((g, i) => (
                                    <tr>
                                        <th scope='row'>{i+1}</th>
                                        <td className='fs-5 fw-bold'>{g.name}</td>
                                        <td className='d-flex'>
                                            <button className='btn btn-primary mx-1' onClick={() => { setVisible(true); setUpdatedName(g.name); setSelected(g) }}><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                            <button className='btn btn-danger mx-1' onClick={() => { handelDelete(g._id) }}><i class="fa-solid fa-trash-can"></i> Delete</button>
                                        </td>
                                        <td>{moment(g?.createdAt).fromNow()}</td>
                                        <td>{moment(g?.updatedAt).fromNow()}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                       </div>
                    </div>
                    <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                        <GradeForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                    </Modal>
                </div>
            </div>
        </Layout>
    );
};

export default CreateGrade;