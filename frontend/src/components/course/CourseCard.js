
import React, { useState } from "react";
import {
    Card,
    Divider,
    Tag,
    Space,
    Button,
    Modal
} from "antd";
import { 
    MailOutlined,
    HomeOutlined,
    ReadOutlined
} from "@ant-design/icons";
import CourseDescription from "./CourseDescription";
import { useOutletContext, Link } from "react-router-dom";
import { userTypes } from "../../types";

const { Meta } = Card;

const tabList = [
    {
        key: 'Description',
        tab: 'Description'
    },
    {
        key: 'Tags',
        tab: 'Tags',
    },
]

const CourseCard = ({ course }) => {
    // console.log(course);

    const [, authContext] = useOutletContext();
    const userType = authContext.userType;

    const [ openModal, setOpenModal ] = useState(false);
    const handleCancel = () => {
        setOpenModal(false);
    };
    
    return (<>
            <Modal
                title={ course.courseName }
                width={ 650 }
                open={ openModal }
                footer={
                userType === userTypes.Student ? (
                    <Link
                    to={{
                        pathname: `/appointments/booking/${course.id}`,
                    }}
                    >
                    <Button size="medium">Book An Appointment</Button>
                    </Link>
                ) : null
            }
            onCancel={handleCancel}
            destroyOnClose="true"
        >
            <CourseDescription course={course} />
        </Modal>
        <Card
            style={{ width: '22%', maxwidth: '22%' }}
            tabProps={{ size: 'middle' }}
            hoverable
            onClick={ () => { setOpenModal(true) } }
        >
            <Space
                direction="vertical"
                size="middle"
                style={{ display: 'flex' }}
            >
                <div>
                    <ReadOutlined />
                    <b>{ "  " + course.courseName }</b>
                </div>
                <div>
                    { course.description }
                </div>
            </Space>
        </Card>
    </>)
  
   
};
export default CourseCard;
