import React, { useState } from "react";
import { Button, Drawer, Form, Input, Spin } from "antd";
import {
  LoadingOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { addNewAdmin } from "../clients/adminClient.js";
import {
  successNotification,
  errorNotification,
} from "../components/notifications.js";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function AdminDrawer({ showDrawer, setShowDrawer, fetchAdmins }) {
  const [submitting, setSubmitting] = useState(false);

  const onClose = () => {
    setShowDrawer(false);
  };

  const onFinish = (admin) => {
    setSubmitting(true);
    console.log(JSON.stringify(admin, null, 2));
    addNewAdmin(admin)
      .then(() => {
        successNotification(`The admin is successfully created!`);
        fetchAdmins();
        onClose();
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Admin Creation Failed", res.message);
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    alert(JSON.stringify(errorInfo, null, 2));
  };
  return (
    <>
      <Drawer
        title="Create New Admin"
        placement="right"
        onClose={onClose}
        open={showDrawer}
      >
        <Form
          name="add-new-admin"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your last name!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            validateDebounce={500} // validate after 0.5 seconds
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The email format in invalid")
                  );
                },
              }),
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              () => ({
                validator(_, value) {
                  const isLengthValid = (password) => {
                    return password.length >= 10 && password.length <= 20;
                  };

                  // contains at least one upper case letter and a lower case letter
                  const isContentValid = (password) => {
                    return /[A-Z]/.test(password) && /[a-z]/.test(password);
                  };

                  if (!value) {
                    return Promise.resolve();
                  }

                  if (!isLengthValid(value)) {
                    return Promise.reject(
                      new Error(
                        "The password length must be 10 - 20 characters inclusive!"
                      )
                    );
                  }

                  if (!isContentValid(value)) {
                    console.log("Here");
                    return Promise.reject(
                      new Error(
                        "The password must contain at least one upper and lower case letter"
                      )
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
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

          <Form.Item>{submitting && <Spin indicator={antIcon} />}</Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
export default AdminDrawer;
