import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { createCourse } from '../clients/adminClient.js';
import { successNotification, errorNotification } from '../components/notifications.js';
import {
    Select,
    Space,
    Divider,
} from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const existingTags = [
    'science',
    'math',
    'english',
    'history',
    'design',
    'art',
    'language',
]


const mapTags = tags =>
    tags.map(tag => {
        return {
            label: tag,
            value: tag.toLowerCase(),
        }
    })

const { TextArea } = Input;

function AddCourseForm ({ showDrawer, setShowDrawer, fetchCourses }) {

    const [ submitting, setSubmitting ] = useState(false);
    const [ tags, setTags ] = useState(existingTags);
    const [ name, setName ] = useState('');
    
    const onNameChange = (event) => {
        setName(event.target.value);
    };

    const addItem = (e) => {
        e.preventDefault();
        setTags([...tags, name]);
        setName('');
    };

    const onClose = () => {
        setShowDrawer(false);
    };
    
    const onFinish = (course) => {
        setSubmitting(true);
        console.log(JSON.stringify(course));
        createCourse(course)
            .then(() => {
                successNotification(
                    `Successfully add course`
                );
                fetchCourses();
                onClose();
            }).catch(err => {
                err.response.json().then(res => {
                    errorNotification(
                        "Course creation failed",
                        res.message
                    )
                });
            }).finally(() => {
                setSubmitting(false);
            })
    };
    const onFinishFailed = (errorInfo) => {
        alert(JSON.stringify(errorInfo, null, 2));
    };
    return (
        <>
            <Drawer
                title="Create New Course"
                placement="right"
                onClose={onClose}
                open={showDrawer}
            >

                <Form
                    name="add-new-course"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 800,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Course Name"
                        name="courseName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input course name, note that course name cannot be changed later',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Course Tags"
                        name="tagList"
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            allowClear
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <Input
                                            placeholder="Please select course tags"
                                            value={name}
                                            onChange={onNameChange}
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                        Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            options={ mapTags(tags) }
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        {submitting && <Spin indicator={antIcon} />}
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
export default AddCourseForm;
