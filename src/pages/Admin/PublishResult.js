import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import Spinner from '../../components/Spinner'
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import { SearchOutlined } from '@ant-design/icons';
import { Modal, DatePicker, Select, Tooltip, Input } from 'antd';
import dayjs from 'dayjs';
const dateFormat = 'DD-MMM-YYYY';
const { Option } = Select;

const PublishResult = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [updateSpinnerLoading, setUpdateSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [auth] = useAuth();
    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState("");
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [type, setType] = useState('');
    const [examDate, setExamDate] = useState('');
    const [result, setResult] = useState([]);
    const [updatedType, setUpdatedType] = useState('');
    const [updatedExamDate, setUpdatedExamDate] = useState('');
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false);
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResult, setSelectedResult] = useState([]);
    const [subjects, setSubjects] = useState([{ subject: '', marks: '' }]);
    const [updatedSubjects, setUpdatedSubjects] = useState([{ subject: '', marks: '' }]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalResult, setModalResult] = useState(null);

    //Get All Grades
    const getAllGrades = async (req, res) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/grade/all-grades`)
            if (data?.success) {
                setGrades(data?.grade);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Grades")
        }
    }
    useEffect(() => {
        getAllGrades();
    }, [])

    //Get all users
    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`)
            setUsers(data)
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Users")
        }
    }
    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token])

    // Filter users by grade
    useEffect(() => {
        if (grade) {
            const filtered = users.filter(user => user.grade._id === grade);
            setFilteredUsers(filtered);
            setUser('');
        } else {
            setFilteredUsers([]);
        }
    }, [grade, users]);

    //get all result
    const getAllResults = async () => {
        setListSpinnerLoading(true)
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/result/all-result`)
            setResult(data)
        } catch (error) {
            console.log(error);
            toast.error("Error fetching Results")
        } finally {
            setListSpinnerLoading(false)
        }
    }
    useEffect(() => {
        getAllResults();
    }, [])

    // Create Form
    const handleAddField = (indexToAdd) => {
        const newSubjects = [...subjects];
        newSubjects.splice(indexToAdd + 1, 0, { subject: '', marks: '' });
        setSubjects(newSubjects);
    };

    const handleRemoveField = (indexToRemove) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter((_, index) => index !== indexToRemove));
        } else {
            alert("At least one subject is required.");
        }
    };

    // Update Form
    const updatedAddField = (indexToAdd) => {
        const newUpdatedSubjects = [...updatedSubjects];
        newUpdatedSubjects.splice(indexToAdd + 1, 0, { updatedSubject: '', updatedMarks: '' });
        setUpdatedSubjects(newUpdatedSubjects);
    };

    const updatedRemoveField = (indexToRemove) => {
        if (updatedSubjects.length > 1) {
            setUpdatedSubjects(updatedSubjects.filter((_, index) => index !== indexToRemove));
        } else {
            alert("At least one subject is required.");
        }
    };

    // Function to handle changes in the dynamically added fields
    const handleFieldChange = (index, field, value) => {
        const newFields = [...subjects];
        newFields[index][field] = value;
        setSubjects(newFields);
    };

    const handleUpdatedFieldChange = (index, field, value) => {
        const newFields = [...updatedSubjects];
        newFields[index][field] = value;
        setUpdatedSubjects(newFields);
    };

    //publish result
    const handlePublish = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const resultData = {
                grade,
                user,
                type,
                subjects,
                examDate,
            };
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/result/create-result`,
                resultData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            if (data?.success) {
                setSpinnerLoading(false);
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setUser(undefined);
                setType('');
                setSubjects([{ subject: '', marks: '' }]); 
                setExamDate(undefined);
                setListSpinnerLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
            setSpinnerLoading(false);
        }
    };

    //clear create modal on cancel
    const createModalCancel = () => {
        setGrade('');
        setUser('');
        setSubjects([{ subject: '', marks: '' }]);
        setType('');
        setExamDate(undefined);
        setIsCreateModalVisible(false)
    }

    //update result
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateSpinnerLoading(true);
        try {
            // Prepare the request payload
            const updateResultData = {
                type: updatedType,
                subjects: updatedSubjects, // Ensure this is an array of objects [{subject, marks}, ...]
                examDate: updatedExamDate,
            };

            // Make the API call
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/result/update-result/${selected._id}`,
                updateResultData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle the response
            if (data?.success) {
                toast.success(data?.message);
                getAllResults();
                // Clear form fields
                setUpdatedType('');
                setUpdatedSubjects([[{ subject: '', marks: '' }]]);
                setUpdatedExamDate(undefined);
                setVisible(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setUpdateSpinnerLoading(false); // Stop the spinner in any case
        }
    };

    // Open modal with selected result data
    const openModal = (result) => {
        setVisible(true);
        setSelected(result);
        setUpdatedType(result.type);
        setUpdatedSubjects(result.subjects);
        setUpdatedExamDate(dayjs(result.examDate))
    };

    // Open modal with selected result data
    const openResultModal = (result) => {
        setModalVisible(true);
        setModalResult(result);
    };

    // Filter content based on search query
    const filteredResult = result.filter(r =>
        dayjs(r?.examDate).format('DD MMMM YYYY').toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //delete individual result
    const handleDelete = async (rId) => {
        let answer = window.confirm("Are you sure want to delete this result?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting result...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/result/delete-result/${rId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllResults();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while delete', { id: loadingToastId })
        }
    }

    // Handle selecting all content
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allResultIds = filteredResult.map(r => r._id);
            setSelectedResult(allResultIds);
        } else {
            setSelectedResult([]);
        }
    };

    // Handle selecting individual content
    const handleSelectResult = (rId) => {
        if (selectedResult.includes(rId)) {
            setSelectedResult(selectedResult.filter(id => id !== rId));
        } else {
            setSelectedResult([...selectedResult, rId]);
        }
    };

    //delete selected result
    const handleDeleteSelected = async (rId) => {
        let answer = window.confirm("Are you sure want to delete the selected result?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting result...');
        try {
            await Promise.all(selectedResult.map(async (rId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/result/delete-result/${rId}`);
            }));
            toast.success('Selected result deleted successfully', { id: loadingToastId });
            setSelectedResult([]);
            getAllResults();
        } catch (error) {
            toast.error('Something wrong while Delete', { id: loadingToastId })
        }
    }

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected content
                setSelectedResult([]);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <Layout title={"Admin - Publish Result"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className="text-center my-4 mb-md-5">
                            <i className="fa-solid fa-square-poll-vertical" /> Publish Result ({result.length})
                        </h2>
                        <div className='d-flex justify-content-between mb-3'>
                            <Input
                                allowClear={true}
                                type="text"
                                placeholder='Search'
                                size='large'
                                prefix={
                                    <span style={{ paddingRight: '4px' }}>
                                        <SearchOutlined />
                                    </span>
                                }
                                style={{ flexBasis: '50%' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setIsCreateModalVisible(true)} className="btn btn-success fw-bold mx-1 py-2 px-4">
                                <i className="fa-solid fa-plus" /> Publish Result
                            </button>
                            {selectedResult.length > 0 && (
                                <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                    <i className="fa-solid fa-trash-can"></i> Delete Selected
                                </button>
                            )}
                        </div>
                        <Modal width={650} open={createModalVisible} onCancel={createModalCancel} footer={null} maskClosable={false}>
                            <h5 className='text-center mb-3'>Publish Result</h5>
                            <form onSubmit={handlePublish}>
                                <div className="mt-4 d-lg-flex">
                                    <Select
                                        placeholder="Select Grade"
                                        size='large'
                                        className='mb-3 me-2 w-100'
                                        value={grade || undefined}
                                        onChange={(value) => { setGrade(value) }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.children || '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {grades?.map(g => (
                                            <Option key={g._id} value={g._id}>{g.name}</Option>
                                        ))}
                                    </Select>
                                    <Select
                                        placeholder="Select Student"
                                        size='large'
                                        className='mb-3 w-100'
                                        value={user || undefined}
                                        onChange={(value) => { setUser(value) }}
                                        required>
                                        {filteredUsers?.map(u => (
                                            <Option key={u._id} value={u._id}>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        className='me-1'
                                                        style={{ width: "23px", height: "23px", borderRadius: "100%" }}
                                                        src={u?.avatar}
                                                        alt="dp" />
                                                    {u.name}
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="d-lg-flex">
                                    <Input
                                        type="text"
                                        placeholder='Exam Type'
                                        className='mb-3 me-2 w-100'
                                        size='large'
                                        value={type}
                                        onChange={(e) => setType(e.target.value)} required
                                    />
                                    <DatePicker
                                        placeholder='Exam Date'
                                        format={dateFormat}
                                        className='mb-3 w-100'
                                        size='large'
                                        value={examDate}
                                        onChange={(date) => setExamDate(date)}
                                        required
                                    />
                                </div>
                                {subjects.map((field, index) => (
                                    <div className="d-flex" key={index}>
                                        <button
                                            onClick={() => handleAddField(index)}
                                            type="button"
                                            className='btn btn-light mb-3 me-2 p-0 mt-0'
                                        >
                                            <i className="fa-solid fa-circle-plus" />
                                        </button>
                                        <Input
                                            type="text"
                                            placeholder={`Subject ${index + 1}`}
                                            className='mb-3 me-2 w-100'
                                            size='large'
                                            value={field.subject}
                                            onChange={(e) => handleFieldChange(index, 'subject', e.target.value)}
                                            required
                                        />
                                        <Input
                                            type="text"
                                            placeholder='Marks'
                                            className='mb-3 w-100'
                                            size='large'
                                            value={field.marks}
                                            onChange={(e) => handleFieldChange(index, 'marks', e.target.value)}
                                            required
                                        />
                                        <button
                                            onClick={() => handleRemoveField(index)}
                                            type="button"
                                            className='btn btn-light mb-3 ms-2 p-0 mt-0'
                                        >
                                            <i className="fa-solid fa-circle-minus" />
                                        </button>
                                    </div>
                                ))}
                                <div className="text-center">
                                    <button type="submit" className="btn btn-warning fw-bold mt-2">
                                        {spinnerLoading ? <div><Spinner /> </div> : "Create Result"}
                                    </button>
                                </div>
                            </form>
                        </Modal>
                        {
                            selectedResult.length > 0 ?
                                <h6 className='d-flex justify-content-start'>{selectedResult.length} selected</h6> :
                                <h6 className='justify-content-start'> Count: {filteredResult.length}</h6>
                        }
                        <div className='table-container'>
                            {
                                listSpinnerLoading ? <div className="m-5 text-center">
                                    <Spinner /><p>Loading results...</p>
                                </div> :
                                    <table className="table table-fixed-header table-hover">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th className='ps-4'>
                                                    <input
                                                        className='form-check-input'
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedResult.length === filteredResult.length && filteredResult.length > 0}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Grade</th>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Date</th>
                                                <th>Result</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredResult.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="9" className="text-center">
                                                            <div className="my-5">
                                                                <h3 className='text-secondary'>No Result Found</h3>
                                                                {searchQuery && (
                                                                    <button
                                                                        onClick={() => setSearchQuery('')}
                                                                        className="btn btn-warning mt-2 fw-bold"
                                                                    >
                                                                        <i className="fa-solid fa-xmark"></i> Reset Search
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredResult.map((r, i) => (
                                                        <tr key={r._id}>
                                                            <td className='ps-4'>
                                                                <input
                                                                    className='form-check-input'
                                                                    type="checkbox"
                                                                    checked={selectedResult.includes(r._id)}
                                                                    onChange={() => handleSelectResult(r._id)}
                                                                />
                                                            </td>
                                                            <th scope="row">{i + 1}</th>
                                                            <td>{r?.grade?.name}</td>
                                                            <td>
                                                                <Tooltip title={`Created: ${dayjs(r.createdAt).format('ddd, MMM D, YYYY h:mm A')} Updated: ${dayjs(r.updatedAt).format('ddd, MMM D, YYYY h:mm A')}`}>
                                                                    <div className="d-flex align-items-center">
                                                                        <img
                                                                            className='me-1'
                                                                            style={{ width: "23px", height: "23px", borderRadius: "100%" }}
                                                                            src={r?.user.avatar}
                                                                            alt="dp" />
                                                                        <span>{r?.user?.name}</span>
                                                                    </div>
                                                                </Tooltip>
                                                            </td>
                                                            <td>{r.type}</td>
                                                            <td>{dayjs(r.examDate).format('DD MMM YYYY')}</td>
                                                            <td>
                                                                <button
                                                                    onClick={() => openResultModal(r)}
                                                                    className='btn btn-outline-primary'>
                                                                    <i className="fa-solid fa-square-poll-vertical" />
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <button className='btn btn-primary mx-1' onClick={() => { openModal(r) }}>
                                                                        <i className="fa-solid fa-pen-to-square" /> Edit
                                                                    </button>
                                                                    <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(r._id)}>
                                                                        <i className="fa-solid fa-trash-can" /> Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal onCancel={() => setVisible(false)} open={visible} footer={null} destroyOnClose={true}>
                <h5 className='text-center'>Update Result</h5>
                <div className='text-center my-3'>
                    <span className="d-flex justify-content-center align-items-center">
                        <img
                            className='me-1'
                            style={{ width: "23px", height: "23px", borderRadius: "100%" }}
                            src={selected?.user?.avatar}
                            alt="dp"
                        />
                        <b>{selected?.user?.name}</b>&nbsp;- {selected?.grade?.name}
                    </span>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="mt-4 d-lg-flex">
                        <Input
                            type="text"
                            placeholder='Exam Type'
                            className='mb-3 me-2 w-100'
                            size='large'
                            value={updatedType}
                            onChange={(e) => setUpdatedType(e.target.value)} required
                        />
                        <DatePicker
                            placeholder='Exam Date'
                            value={updatedExamDate}
                            format={dateFormat}
                            className='mb-3 w-100'
                            size='large'
                            onChange={(date) => setUpdatedExamDate(date)}
                            required
                        />
                    </div>
                    {updatedSubjects.map((updateField, index) => (
                        <div className="d-flex" key={index}>
                            <button
                                onClick={() => updatedAddField(index)}
                                type="button"
                                className='btn btn-light mb-3 me-2 p-0'
                            >
                                <i className="fa-solid fa-circle-plus" />
                            </button>
                            <Input
                                type="text"
                                placeholder={`Subject ${index + 1}`}
                                className='mb-3 me-2 w-100'
                                size='large'
                                value={updateField.subject}
                                onChange={(e) => handleUpdatedFieldChange(index, 'subject', e.target.value)}
                                required
                            />
                            <Input
                                type="text"
                                placeholder='Marks'
                                className='mb-3 w-100'
                                size='large'
                                value={updateField.marks}
                                onChange={(e) => handleUpdatedFieldChange(index, 'marks', e.target.value)}
                                required
                            />
                            <button
                                onClick={() => updatedRemoveField(index)}
                                type="button"
                                className='btn btn-light mb-3 ms-2 p-0'
                            >
                                <i className="fa-solid fa-circle-minus" />
                            </button>
                        </div>
                    ))}
                    <div className="text-center">
                        <button type='submit' className="btn btn-warning fw-bold" >
                            {updateSpinnerLoading ? <Spinner /> : "Update Result"}
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                <div>
                    <h5 className='text-center'>Result</h5>
                    <div className='text-center my-3'>
                        <span className="d-flex justify-content-center align-items-center">
                            <img
                                className='me-1'
                                style={{ width: "23px", height: "23px", borderRadius: "100%" }}
                                src={modalResult?.user?.avatar}
                                alt="dp"
                            />
                            <b>{modalResult?.user?.name}</b>&nbsp;- {modalResult?.grade?.name}
                        </span>
                    </div>
                    <table className="table table-striped">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                modalResult && modalResult.subjects.map((s, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{s.subject}</td>
                                            <td>{s.marks}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className='text-center form-text'>
                        {modalResult?.type}: {modalResult?.examDate && dayjs(modalResult.examDate).format('MMM DD, YYYY')}
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default PublishResult;