import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllCourses } from '../clients/courseClient'
import {
  updateCourse,
  deleteCourse,
} from "../clients/adminClient";
import '../App.css'
import {
    Layout, theme, Table, Spin, Button, Badge, Radio, Popconfirm, Avatar,
} from 'antd';
import {
    LoadingOutlined, PlusOutlined, QuestionCircleOutlined, BookOutlined
} from '@ant-design/icons';
import {
    Space,
    Tag,
} from 'antd';
import AddCourseForm from "./AddCourseForm.js";
import { userTypes } from "../types.js";
import { errorNotification, successNotification } from "../components/notifications";
import EditCourseForm from "./EditCourseForm";
import { getColumnSearchPropsHelper } from "../components/homepage/getColumnSearchProps";


const { Header, Content } = Layout;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const removeCourse = (id, callback) => {
  deleteCourse(id).then(() => {
        successNotification(
            `Successfully remove course ${id}`
        );
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            errorNotification(
                "Course deletion failed",
                res.message
            )
        })
    });
}

const flattenTags = courses =>
    [...new Set(courses.flatMap(c => c.tagSet))];

const mapTags = tags =>
    tags.map(tag => {
        return {
            text: tag,
            value: tag.toLowerCase(),
        }
    })


function AdminCourses () {

    const [ courseList, setCourseList ] = useState([]);
    const [ fetching, setFetching ] = useState(true);
    const [ showDrawer, setShowDrawer ] = useState(false);
    const [ showContent, setShowContent ] = useState(userTypes.Admin);
    const [ setTitle, ] = useOutletContext();
    // for course editing
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editingCourse, setEditingCourse ] = useState({
        courseName: '',
        description: '',
        tagSet: [],
    });
    // for tag filtering
    const [ courseTags, setCourseTags ] = useState([]);

    // for sorting
    const [ sortedInfo, setSortedInfo ] = useState({});
    const [ searchedColumn, setSearchedColumn ] = useState("");
    const searchInput = useRef(null);
    // for searching
    const [ searchText, setSearchText ] = useState("");
    const [, setFilteredInfo ] = useState({});
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => {
        return getColumnSearchPropsHelper(
            dataIndex,
            searchInput,
            handleSearch,
            handleReset,
            searchedColumn,
            searchText
        );
    };

    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
      };


    const columnsCourse = fetchCourses => [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
        },
        {
            title: 'Course Name',
            dataIndex: 'courseName',
            key: 'courseName',
            ...getColumnSearchProps("courseName"),
        },
        {
            title: 'Tags',
            dataIndex: 'tagSet',
            key: 'tagSet',
            width: '40%',
            render: (text, course) =>
                course.tagSet.map(tag => <Tag color="geekblue">{ tag }</Tag>),
            filters: mapTags(courseTags),
            onFilter: (value, record) => record.tagSet.includes(value),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, course) =>
            <Radio.Group defaultValue="c" buttonStyle="solid" >
                <Space style={{ width: '100%' }} direction="horizontal">
                    <Popconfirm
                        title="Delete this course"
                        description={`Are you sure to delete ${course.courseName}?`}
                        okText="Yes"
                        icon={
                            <QuestionCircleOutlined
                                style={ {color: 'red'} }
                            />
                        }
                        onConfirm={() => removeCourse(course.id, fetchCourses)}
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
        
                    <Button
                        onClick={() => {
                            setIsEditing(!isEditing);
                            setEditingCourse(course);
                        }}
                    >
                        Edit
                    </Button>
                </Space>
            </Radio.Group>
      },
    ];

    const fetchCourses = () =>
        getAllCourses()
            .then(res => res.json())
            .then(data => {
                setCourseList(data.data);
                setCourseTags(flattenTags(data.data));
            }).catch(err => {
                err.response.json().then(res => {
                    console.log(res)
                    errorNotification(
                        "Course fetch failed",
                        res.message
                    )
                });
            }).finally(() => setFetching(false));


    useEffect(() => {
        fetchCourses();
        setTitle("Manage Courses");
    }, []);

    const renderCourses = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />
        }
        return <>
            <AddCourseForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchCourses={fetchCourses}
            />
            <EditCourseForm
                showDrawer={isEditing}
                setShowDrawer={setIsEditing}
                fetchCourses={fetchCourses}
                course={ editingCourse }
            />
            {courseTable(courseList, columnsCourse, fetchCourses, showContent)}
        </>
    }

    const courseTable = (dataSource, columnsUser, fetchCourses, identity) => {
        return <>
            <Table
                dataSource={dataSource}
                columns={columnsUser(fetchCourses)}
                rowKey={(course) => course.id}
                onChange={handleChange}
                title={() =>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Space>
                            Total number of courses:
                            <Badge
                                className="site-badge-count-109"
                                count={dataSource.length}
                                showZero
                                style={{ backgroundColor: "#52c41a" }}
                            >
                                <Avatar shape="square" icon={<BookOutlined />} />
                            </Badge>
                        </Space>

                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            icon={<PlusOutlined />}
                        >
                            Add A New Course
                        </Button>
                    </div>
                }
            />
        </>
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    if (fetching) return antIcon;

    return (<>
        <Content
            style={{
                margin: '0 16px',
            }}
        >
            <div
                style={{
                    padding: 20,
                    minHeight: 360,
                    background: colorBgContainer,
                }}
            >
                {renderCourses(showContent)}
            </div>
        </Content>
    </>)
}
export default AdminCourses;
