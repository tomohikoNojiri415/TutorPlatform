import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Spin } from "antd";
import { userTypes } from "../types";
import { login } from "../clients/authClient";
import {
  errorNotification,
  successNotification,
} from "../components/notifications";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setIsLoading(true);
    const loginPayload = {
      email: values.email,
      password: values.password,
    };
    login(loginPayload)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("authContext", JSON.stringify(data.data));
        successNotification("Login succeeded");
        navigate("/homepage");
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Login Failed", res.message);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="page-container">
      {isLoading ? (
        // Spinning page
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      ) : (
        // Login form
        <>
          <h1 className="form-title">Log in</h1>
          <Form
            className="login-form"
            onFinish={onFinish}
            initialValues={{
              userType: userTypes.Student,
            }}
          >
            {/* Email */}
            <Form.Item
              name="email"
              validateDebounce={500} // validate after 0.5 seconds
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            {/* Button & Login Link */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="signup-form-button"
              >
                Log in
              </Button>
              <div>
                Do not have an account? <a href="/sign-up">Sign up</a> now!
              </div>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default LoginPage;
