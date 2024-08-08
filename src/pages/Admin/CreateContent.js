import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Modal, Select, Tooltip } from 'antd';
const { Option } = Select;

const CreateContent = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [subject, setSubject] = useState('');
    const [remark, setRemark] = useState('');
    const [contentLink, setContentLink] = useState('');
    const [types] = useState(["PDF", "Doc", "Video", "Audio", "PPT"]);
    const [type, setType] = useState(null);
    const [content, setContent] = useState([]);
    const [contentId, setContentId] = useState([]);
    const [updatedSubject, setUpdatedSubject] = useState('');
    const [updatedReMark, setUpdatedReMark] = useState('');
    const [updatedType, setUpdatedType] = useState('');
    const [updatedContentLink, setUpdatedContentLink] = useState('');
    const [selected, setSelected] = useState(null);
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContent, setSelectedContent] = useState([]);

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`);
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades");
        }
    };
    useEffect(() => {
        getAllGrades();
    }, []);

    //Get all content link list
    const getAllContent = async () => {
        setListSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/content/all-content`);
            setContent(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching contents");
        } finally {
            setListSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getAllContent();
    }, []);

    //Create Content
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const contentData = new FormData();
            contentData.append("subject", subject);
            contentData.append("remark", remark);
            contentData.append("type", type);
            contentData.append("contentLink", contentLink);
            contentData.append("grade", grade);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/content/create-content`, contentData);
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllContent();
                // Clear form fields
                setGrade(undefined);
                setType(undefined);
                setSubject('');
                setRemark('');
                setContentLink('');
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setSpinnerLoading(false);
        }
    };

    //update content link
    const handleUpdate = async (e) => {
        setUpdateSpinnerLoading(true);
        e.preventDefault();
        try {
            const updateResultData = new FormData();
            updateResultData.append("subject", updatedSubject);
            updateResultData.append("remark", updatedReMark);
            updateResultData.append("type", updatedType);
            updateResultData.append("contentLink", updatedContentLink);
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/content/update-content/${selected._id}`, updateResultData);
            setUpdateSpinnerLoading(false);
            if (data?.success) {
                toast.success(data?.message);
                getAllContent();
                // Clear form fields after submit
                setUpdatedSubject('');
                setUpdatedReMark('');
                setUpdatedType(undefined);
                setUpdatedContentLink('');
                setVisible(false);
                setListSpinnerLoading(false);
            } else {
                toast.success(data.message);
                setUpdateSpinnerLoading(false);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setUpdateSpinnerLoading(false);
        }
    };

    // Open modal with selected result data
    const openModal = (content) => {
        setVisible(true);
        setSelected(content);
        setContentId(content._id);
        setUpdatedSubject(content.subject);
        setUpdatedReMark(content.remark);
        setUpdatedType(content.type);
        setUpdatedContentLink(content.contentLink);
    };

    // Filter content based on search query
    const filteredContent = content.filter(c =>
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.remark.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //delete individual content
    const handleDelete = async (cId) => {
        let answer = window.confirm("Are you sure want to delete this content?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting content...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/content/delete-content/${cId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllContent();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while delete', { id: loadingToastId })
        }
    }

    //delete selected contents
    const handleDeleteSelected = async () => {
        let answer = window.confirm("Are you sure you want to delete the selected content?");
        if (!answer) return;

        const loadingToastId = toast.loading('Deleting content...');
        try {
            await Promise.all(selectedContent.map(async (cId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/content/delete-content/${cId}`);
            }));
            toast.success('Selected content deleted successfully', { id: loadingToastId });
            setSelectedContent([]);
            getAllContent();
        } catch (error) {
            toast.error('Something went wrong while deleting', { id: loadingToastId });
        }
    };

    // Handle selecting all content
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allContentIds = filteredContent.map(c => c._id);
            setSelectedContent(allContentIds);
        } else {
            setSelectedContent([]);
        }
    };

    // Handle selecting individual content
    const handleSelectContent = (cId) => {
        if (selectedContent.includes(cId)) {
            setSelectedContent(selectedContent.filter(id => id !== cId));
        } else {
            setSelectedContent([...selectedContent, cId]);
        }
    };

    return (
        <Layout title={"Admin - Create Content Link"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className='text-center my-3'>Create Content Link</h2>
                        <div className='d-flex justify-content-between mb-3'>
                            <input
                                type="text"
                                placeholder='Search'
                                className='form-control mx-1'
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setIsCreateModalVisible(true)} className="btn btn-warning fw-bold mx-1 py-2">
                                <i className="fa-solid fa-plus"></i> Create Content
                            </button>
                            {selectedContent.length > 0 && (
                                <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                    <i className="fa-solid fa-trash"></i> Delete Selected
                                </button>
                            )}
                        </div>

                        <Modal width={650} visible={createModalVisible} onCancel={() => setIsCreateModalVisible(false)} footer={null}>
                            <h5 className='text-center'>Create Content</h5>
                            <form onSubmit={handleCreate}>
                                <div className="mt-4 d-lg-flex">
                                    <Select bordered={false}
                                        placeholder="Select Grade"
                                        size='large'
                                        className='form-select mb-3 me-2'
                                        value={grade || undefined}
                                        onChange={(value) => { setGrade(value) }}>
                                        {grades?.map(g => (
                                            <Option key={g._id} value={g._id}>{g.name}</Option>
                                        ))}
                                    </Select>
                                    <Select bordered={false}
                                        placeholder="Select Content Type"
                                        size='large'
                                        className='form-select mb-3'
                                        value={type}
                                        onChange={(value) => { setType(value) }}
                                        required>
                                        {types.map((t, i) => (
                                            <Option key={i} value={t}>{t}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="d-lg-flex">
                                    <input
                                        type="text"
                                        placeholder='Subject'
                                        className='form-control mb-3 me-2'
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)} required
                                    />
                                    <input
                                        type="text"
                                        placeholder='Remark'
                                        className='form-control mb-3'
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)} required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Paste Link Here'
                                        className='form-control mb-3'
                                        value={contentLink}
                                        onChange={(e) => setContentLink(e.target.value)} required
                                    />
                                </div>
                                <div className=" text-center">
                                    <button type="submit" className="btn btn-warning fw-bold mt-3">
                                        {spinnerLoading ? <Spinner /> : "Create Content Link"}
                                    </button>
                                </div>
                            </form>
                        </Modal>

                        <h6 className='justify-content-start'> Count: {filteredContent.length}</h6>
                        <div className='table-container'>
                            <table className="table">
                                <thead className='table-dark'>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                                            />
                                        </th>
                                        <th>#</th>
                                        <th>Grade</th>
                                        <th>Subject</th>
                                        <th>Remark</th>
                                        <th>Type</th>
                                        <th>Link</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                {
                                    listSpinnerLoading ? <div className="m-5"><Spinner /></div> :
                                        <tbody>
                                            {filteredContent.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        <h3 className='mt-5 text-secondary'>No Content Found</h3>
                                                        <button onClick={() => { setSearchQuery('') }} className="btn btn-warning mt-2 mb-5 fw-bold">
                                                            Reset Search
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredContent.map((c, i) => (
                                                    <tr key={c._id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedContent.includes(c._id)}
                                                                onChange={() => handleSelectContent(c._id)}
                                                            />
                                                        </td>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>{c?.grade?.name}</td>
                                                        <td>
                                                            <Tooltip title={`Created: ${moment(c.createdAt).format('llll')} Updated: ${moment(c.updatedAt).format('llll')}`}>
                                                                <span>{c?.subject}</span>
                                                            </Tooltip>
                                                        </td>
                                                        <td>{c.remark}</td>
                                                        <td>{c.type}</td>
                                                        <td>
                                                            <Link className='link' to={c.contentLink} target='_blank'>
                                                                <i className="fa-solid fa-up-right-from-square"></i> Open
                                                            </Link>
                                                        </td>
                                                        <td className='d-flex'>
                                                            <button className='btn btn-primary mx-1' onClick={() => { openModal(c) }}>
                                                                <i className="fa-solid fa-pen-to-square"></i> Edit
                                                            </button>
                                                            <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(c._id)}>
                                                                <i className="fa-solid fa-trash-can"></i> Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
                <h5 className='text-center'>Update Content</h5>
                <div className='text-center my-3'>
                    {
                        <h6>{selected?.grade?.name}</h6>
                    }
                </div>
                <form onSubmit={handleUpdate}>
                    <div className="mt-4 d-lg-flex">
                        <input
                            type="text"
                            placeholder='Subject'
                            className='form-control mb-2 me-2'
                            value={updatedSubject}
                            onChange={(e) => setUpdatedSubject(e.target.value)} required
                        />
                        <input
                            type="text"
                            placeholder='Remark'
                            className='form-control mb-2'
                            value={updatedReMark}
                            onChange={(e) => setUpdatedReMark(e.target.value)} required
                        />
                    </div>
                    <div className='mb-3'>
                        <Select bordered={false}
                            placeholder="Select Content Type"
                            size='large'
                            className='form-select mb-2'
                            value={updatedType}
                            onChange={(value) => { setUpdatedType(value) }}
                            required>
                            {types.map((t, i) => (
                                <Option key={i} value={t}>{t}</Option>
                            ))}
                        </Select>
                        <input
                            type="text"
                            placeholder='Paste Link Here'
                            className='form-control mb-2'
                            value={updatedContentLink}
                            onChange={(e) => setUpdatedContentLink(e.target.value)} required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-warning fw-bold mt-2">
                            {updateSpinnerLoading ? <Spinner /> : "Update Content"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default CreateContent;
