import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import { SearchOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import { Image, Input, Modal, Select, Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { RangePicker } = DatePicker;
const dateFormat = 'DD-MMM-YYYY';
const { Option } = Select;

const CreateCourse = () => {
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const [listSpinnerLoading, setListSpinnerLoading] = useState(false);
    const [grades, setGrades] = useState([]);
    const [course, setCourse] = useState([]);
    const [grade, setGrade] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [statuses] = useState(["Active", "Upcoming"]);
    const [status, setStatus] = useState(null);
    const [description, setDescription] = useState('');
    const [courseImg, setCourseImg] = useState('');
    const [updatedGrade, setUpdatedGrade] = useState('');
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedPrice, setUpdatedPrice] = useState('');
    const [updatedDateRange, setUpdatedDateRange] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedCourseImg, setUpdatedCourseImg] = useState('');
    const [selected, setSelected] = useState(null);
    const [createModalVisible, setIsCreateModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState([]);

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

    //Get all courses
    const getAllCourses = async () => {
        setListSpinnerLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/course/all-courses`);
            setCourse(data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching all courses");
        } finally {
            setListSpinnerLoading(false);
        }
    };
    useEffect(() => {
        getAllCourses();
    }, []);

    //Create Course
    const handleCreate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const courseData = new FormData();
            courseData.append("grade", grade);
            courseData.append("title", title);
            courseData.append("price", price);
            courseData.append("dateRange", dateRange);
            courseData.append("status", status);
            courseData.append("description", description);
            courseData.append("photo", courseImg);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/course/create-course`, courseData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data?.success) {
                toast.success(data?.message);
                getAllCourses();
                // Clear form fields
                setGrade('');
                setTitle('');
                setPrice('');
                setDateRange(undefined);
                setStatus('');
                setDescription('');
                setCourseImg('');
                setIsCreateModalVisible(false)
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
        } finally {
            setSpinnerLoading(false);
        }
    };

    //clear create modal on cancel
    const createModalCancel = () => {
        setCourseImg(null);
        setGrade('');
        setTitle('');
        setPrice('');
        setDateRange(undefined);
        setStatus(undefined);
        setDescription('');
        setCourseImg('');
        setIsCreateModalVisible(false)
    }

    // Open modal with selected result data
    const openModal = (course) => {
        setVisible(true);
        setSelected(course);
        setUpdatedGrade(course.grade._id);
        setUpdatedTitle(course.title);
        setUpdatedPrice(course.price);
        setUpdatedDateRange(dayjs(course.dateRange));
        setUpdatedStatus(course.status);
        setUpdatedDescription(course.description);
        setUpdatedCourseImg(course.courseImg);
    };

    //Create Course
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSpinnerLoading(true);
        try {
            const updateCourseData = new FormData();
            updateCourseData.append("grade", updatedGrade);
            updateCourseData.append("title", updatedTitle);
            updateCourseData.append("price", updatedPrice);
            updateCourseData.append("dateRange", updatedDateRange);
            updateCourseData.append("status", updatedStatus);
            updateCourseData.append("description", updatedDescription);
            updateCourseData.append("photo", updatedCourseImg);

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/course/update-course/${selected._id}`, updateCourseData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data?.success) {
                toast.success(data?.message);
                getAllCourses();
                // Clear form fields
                setUpdatedGrade('');
                setUpdatedTitle('');
                setUpdatedPrice('');
                setUpdatedDateRange(undefined);
                setUpdatedStatus('');
                setUpdatedDescription('');
                setUpdatedCourseImg('');
                setVisible(false)
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
        } finally {
            setSpinnerLoading(false);
        }
    };

    // Filter course based on search query
    const filteredCourse = course.filter(c =>
        c?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c?.grade?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //total price calculate
    const totalAmount = filteredCourse.reduce((sum, c) => sum + c?.price, 0);

    //delete individual course
    const handleDelete = async (cId) => {
        let answer = window.confirm("Are you sure want to delete this course?")
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting course...');
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/course/delete-course/${cId}`);
            if (data.success) {
                toast.success(data.message, { id: loadingToastId });
                getAllCourses();
            } else {
                toast.error(data.message, { id: loadingToastId })
            }
        } catch (error) {
            toast.error('Something wrong while delete', { id: loadingToastId })
        }
    }

    // Handle selecting all course
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allCourseIds = filteredCourse.map(c => c._id);
            setSelectedCourse(allCourseIds);
        } else {
            setSelectedCourse([]);
        }
    };

    // Handle selecting individual course
    const handleSelectNotice = (cId) => {
        if (selectedCourse.includes(cId)) {
            setSelectedCourse(selectedCourse.filter(id => id !== cId));
        } else {
            setSelectedCourse([...selectedCourse, cId]);
        }
    };

    //delete selected course
    const handleDeleteSelected = async () => {
        let answer = window.confirm("Are you sure you want to delete the selected courses?");
        if (!answer) return;
        const loadingToastId = toast.loading('Deleting courses...');
        try {
            await Promise.all(selectedCourse.map(async (cId) => {
                await axios.delete(`${process.env.REACT_APP_API}/api/v1/course/delete-course/${cId}`);
            }));
            toast.success('Selected course deleted successfully', { id: loadingToastId });
            setSelectedCourse([]);
            getAllCourses();
        } catch (error) {
            toast.error('Something went wrong while deleting', { id: loadingToastId });
        }
    };

    // Handle Escape key functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                // Clear search bar
                setSearchQuery('');
                // Clear selected content
                setSelectedCourse([]);
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    //Quill modules
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            [{ script: "sub" }, { script: "super" }],
            [
                { color: [] },
                { background: [] },
            ],
        ],
    };

    //initializing updated description on html formatted version for react-quill
    useEffect(() => {
        if (visible) {
            setUpdatedDescription(selected.description);
        }
    }, [visible]);

    return (
        <Layout title={"Admin - Create Course"}>
            <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className="text-center my-4 mb-md-5">
                            <i className="fa-solid fa-book" /> Create Course ({course.length})
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
                                <i className="fa-solid fa-plus"></i> Create Course
                            </button>
                            {selectedCourse.length > 0 && (
                                <button onClick={handleDeleteSelected} className="btn btn-danger fw-bold mx-1 py-2 floating-delete-button">
                                    <i className="fa-solid fa-trash-can"></i> Delete Selected
                                </button>
                            )}
                        </div>
                        <h6 className='d-flex justify-content-between'>
                            <span>
                                {
                                    selectedCourse.length > 0 ?
                                        <h6 className='justify-content-start'> {selectedCourse.length} selected</h6> :
                                        <h6 className='justify-content-start'> Count: {filteredCourse.length}</h6>
                                }
                            </span>
                            <span>
                                <h6 className='justify-content-start'> Total: {totalAmount} TK</h6>
                            </span>
                        </h6>
                        <div className='table-container'>
                            {
                                listSpinnerLoading ? <div className="text-center m-5">
                                    <Spinner /> <p>Loading courses...</p>
                                </div> :
                                    <table className="table table-fixed-header table-hover">
                                        <thead className='table-dark'>
                                            <tr>
                                                <th className='ps-4'>
                                                    <input
                                                        className='form-check-input'
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selectedCourse.length === filteredCourse.length && filteredCourse.length > 0}
                                                    />
                                                </th>
                                                <th>#</th>
                                                <th>Grade</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Starting Date</th>
                                                <th>Status</th>
                                                <th>Img</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCourse.length === 0 ? (
                                                <tr>
                                                    <td colSpan="9" className="text-center">
                                                        <div className="my-5">
                                                            <h3 className='text-secondary'>No Course Found</h3>
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
                                                filteredCourse.map((c, i) => (
                                                    <tr key={c._id}>
                                                        <td className='ps-4'>
                                                            <input
                                                                className='form-check-input'
                                                                type="checkbox"
                                                                checked={selectedCourse.includes(c._id)}
                                                                onChange={() => handleSelectNotice(c._id)}
                                                            />
                                                        </td>
                                                        <th scope='row'>{i + 1}</th>
                                                        <td>
                                                            {c.grade.name}
                                                        </td>
                                                        <td>
                                                            <Tooltip title={`Created: ${dayjs(c.createdAt).format('ddd, MMM D, YYYY h:mm A')} Updated: ${dayjs(c.updatedAt).format('ddd, MMM D, YYYY h:mm A')}`}>
                                                                <span>{c?.title}</span>
                                                            </Tooltip>
                                                        </td>
                                                        <td>{c.price} Tk</td>
                                                        <td>{dayjs(c.dateRange).format('DD MMM YYYY')}</td>
                                                        <td>{c.status}</td>
                                                        <td>
                                                            <Image
                                                                fallback="https://demofree.sirv.com/nope-not-here.jpg"
                                                                preview={{
                                                                    mask: <EyeOutlined />
                                                                }}
                                                                style={{ width: "30px" }}
                                                                src={c.courseImg}
                                                                alt="course" />
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <button className='btn btn-primary mx-1' onClick={() => { openModal(c) }}>
                                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                                </button>
                                                                <button className="btn btn-danger fw-bold ms-1" onClick={() => handleDelete(c._id)}>
                                                                    <i className="fa-solid fa-trash-can"></i> Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal width={800} centered open={createModalVisible} onCancel={createModalCancel} footer={null} maskClosable={false}>
                <h5 className='text-center mb-4'>Create Course</h5>
                <form onSubmit={handleCreate}>
                    <div>
                        <div className="mb-1">
                            {courseImg && (
                                <div className="text-center">
                                    <img src={typeof courseImg === 'string' ? courseImg : URL.createObjectURL(courseImg)} alt='profile-img' style={{ height: "200px" }} className='img-fluid rounded'
                                    />
                                    <div className="d-flex justify-content-center">
                                        <div className='mt-1 fw-bold'>
                                            <span> Size: {`${(courseImg.size / 1048576).toFixed(2)} MB`}</span>
                                            <span>{
                                                courseImg.size > 5000000 ? <p className='text-danger'>Image size should be less than 5 MB</p> : null
                                            }</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mb-3 text-center">
                            <label className="btn btn-outline-secondary col-md-8">
                                {courseImg ? (typeof courseImg === 'string' ? 'Change Photo' : courseImg.name) : "Upload Photo"}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setCourseImg(e.target.files[0]);
                                        e.target.value = null;
                                    }}
                                    hidden
                                />
                            </label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    </div>
                    <div className="d-lg-flex">
                        <Select
                            allowClear={true}
                            placeholder="Select Grade"
                            size='large'
                            className='mb-3 me-2 w-100'
                            value={grade || undefined}
                            onChange={(value) => { setGrade(value) }}>
                            {grades?.map(g => (
                                <Option key={g._id} value={g._id}>{g.name}</Option>
                            ))}
                        </Select>
                        <Input
                            showCount
                            type="text"
                            size='large'
                            placeholder='Title'
                            className='mb-3 me-2'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            minLength={4} maxLength={30}
                            required
                        />
                    </div>
                    <div className="d-lg-flex">
                        <DatePicker
                            size='large'
                            format={dateFormat}
                            placeholder='Starting Date'
                            className='mb-3 me-2 w-100'
                            value={dateRange}
                            onChange={(date) => setDateRange(date)}
                            required />
                        <Input
                            prefix="৳"
                            type="number"
                            size='large'
                            placeholder='Price'
                            className='mb-3 me-2'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                        <Select
                            placeholder="Course Status"
                            size='large'
                            className='mb-3 me-2 w-100'
                            value={status}
                            onChange={(value) => { setStatus(value) }}
                            required>
                            {statuses.map((s, i) => (
                                <Option key={i} value={s}>{s}</Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <ReactQuill
                            modules={modules}
                            theme="snow"
                            className="mb-3"
                            value={description}
                            onChange={setDescription}
                            maxLength={1000}
                            required
                            placeholder="Course Description" />
                    </div>
                    <div className=" text-center">
                        <button type="submit" className="btn btn-warning fw-bold mt-2">
                            {spinnerLoading ? <Spinner /> : "Create Course"}
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal width={800} centered onCancel={() => setVisible(false)} open={visible} footer={null}>
                <h5 className='text-center mb-4'>Update Course</h5>
                <form onSubmit={handleUpdate}>
                    <div>
                        <div>
                            {updatedCourseImg && (
                                <div className="text-center">
                                    <img src={typeof updatedCourseImg === 'string' ? updatedCourseImg : URL.createObjectURL(updatedCourseImg)} alt='profile-img' style={{ height: "200px" }} className='img-fluid rounded'
                                    />
                                    <div className="d-flex justify-content-center">
                                        <div className='fw-bold'>
                                            <span className='m-1'>
                                                {
                                                    updatedCourseImg && updatedCourseImg.size > 0
                                                        ? `${(updatedCourseImg.size / 1048576).toFixed(2)} MB`
                                                        : null
                                                }
                                            </span>

                                            <span>
                                                {
                                                    updatedCourseImg.size > 5000000 ? <p className='text-danger'>Image size should be less than 5 MB</p> : null
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-center mb-3">
                            <label className="btn btn-outline-secondary col-md-8">
                                {updatedCourseImg ? (typeof updatedCourseImg === 'string' ? 'Change Photo' : updatedCourseImg.name) : "Upload Photo"}
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setUpdatedCourseImg(e.target.files[0]);
                                        e.target.value = null;
                                    }}
                                    hidden
                                />
                            </label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    </div>
                    <div className="d-lg-flex">
                        <Select
                            allowClear={true}
                            placeholder="Select Grade"
                            size='large'
                            className='mb-3 me-2 w-100'
                            value={updatedGrade || undefined}
                            onChange={(value) => { setUpdatedGrade(value) }}>
                            {grades?.map(g => (
                                <Option key={g._id} value={g._id}>{g.name}</Option>
                            ))}
                        </Select>
                        <Input
                            showCount
                            type="text"
                            size='large'
                            placeholder='Title'
                            className='mb-3 me-2'
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            minLength={4} maxLength={30}
                            required
                        />
                    </div>
                    <div className="d-lg-flex">
                        <DatePicker
                            size='large'
                            format={dateFormat}
                            placeholder='Starting Date'
                            className='mb-3 me-2 w-100'
                            value={updatedDateRange}
                            onChange={(date) => setUpdatedDateRange(date)}
                            required
                        />
                        <Input
                            prefix="৳"
                            type="number"
                            size='large'
                            placeholder='Price'
                            className='mb-3 me-2'
                            value={updatedPrice}
                            onChange={(e) => setUpdatedPrice(e.target.value)}
                            required
                        />
                        <Select
                            placeholder="Course Status"
                            size='large'
                            className='mb-3 me-2 w-100'
                            value={updatedStatus}
                            onChange={(value) => { setUpdatedStatus(value) }}
                            required>
                            {statuses.map((s, i) => (
                                <Option key={i} value={s}>{s}</Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <ReactQuill
                            key={selected?._id}
                            modules={modules}
                            theme="snow"
                            className="mb-3"
                            value={updatedDescription}
                            onChange={setUpdatedDescription}
                            maxLength={1000}
                            required
                            placeholder="Course Description" />
                    </div>
                    <div className=" text-center">
                        <button type="submit" className="btn btn-warning fw-bold mt-2">
                            {spinnerLoading ? <Spinner /> : "Update Course"}
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default CreateCourse;