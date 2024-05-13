import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { DatabaseOutlined, UserOutlined } from "@ant-design/icons";

const AdminSidebar = () => {
  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        items={[
          {
            key: "1",
            icon: <UserOutlined />,
            label: <Link to={`/admin/tutors`}>Tutors</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to={`/admin/students`}>Students</Link>,
          },
          {
            key: "3",
            icon: <UserOutlined />,
            label: <Link to={`/admin/admins`}>Admins</Link>,
          },
          {
            key: "4",
            icon: <DatabaseOutlined />,
            label: <Link to={`/admin/courses`}>Courses</Link>,
          },
        ]}
      />
    </>
  );
};

export default AdminSidebar;