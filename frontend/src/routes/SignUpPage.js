import React, { useState } from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Spin } from "antd";
import { userTypes } from "../types";
import { signUp } from "../clients/authClient";
import {
  errorNotification,
  successNotification,
} from "../components/notifications";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    setIsLoading(true);
    console.log("Received values of form: ", values);
    const authPayload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      userType: values.userType,
    };
    signUp(authPayload)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        successNotification(
          "The account has been successfully created",
          "You may login now"
        );
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Sign Up Failed", res.message);
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
        // Sign Up form
        <>
          <h1 className="form-title">Sign Up</h1>
          <Form
            className="signup-form"
            onFinish={onFinish}
            initialValues={{
              userType: userTypes.Student,
            }}
          >
            {/* First Name */}
            <Form.Item
              name="firstName"
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastName"
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 8px",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm your password"
              />
            </Form.Item>

            {/* Sign up as which user type */}
            <Form.Item
              name="userType"
              label="Sign up as a"
              rules={[{ required: true, message: "Please select an option!" }]}
            >
              <Radio.Group>
                <Radio value={userTypes.Tutor}> Tutor </Radio>
                <Radio value={userTypes.Student}> Student </Radio>
              </Radio.Group>
            </Form.Item>

            {/* Button & Login Link */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="signup-form-button"
              >
                Create Account
              </Button>
              <div>
                Or <a href="/login">log in now!</a>
              </div>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};
export default SignUpPage;
