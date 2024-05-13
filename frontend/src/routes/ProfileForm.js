import React, { useEffect, useState } from "react";
import { Spin, Button, Cascader, Form, Input, Select } from "antd";
import UploadAvatar from "../components/profile/UploadAvatar";
import formatTimeZones from "../components/profile/formatTimeZones";
import UploadFile from "../components/profile/UploadFile";
import {
  errorNotification,
  successNotification,
} from "../components/notifications";

import { updateUserInfo, getUser } from "../utils/util";
import { userTypes } from "../types";
import { getAllTimeZones } from "../clients/generalClient";
import { getAllCourseNames } from "../clients/courseClient";
import { useOutletContext } from "react-router-dom";

// for bio
const { TextArea } = Input;

const isTutor = (userType) => {
  return userType === userTypes.Tutor;
};

const ProfileForm = () => {
  const [setTitle, authContext] = useOutletContext();

  const userId = authContext.id;
  const userType = authContext.userType;

  // whether the profile is editable
  const [componentDisabled, setComponentDisabled] = useState(true);

  // the user info to be rendered on the profile page
  const [user, setUser] = useState(null);

  // list of all available time zones obtained from backend
  const [allTimeZones, setAllTimeZones] = useState(null);

  // list of courses selected by user (only for tutor)
  const [selectedCourses, setSelectedCourses] = useState([]);

  // list of all available courses on the platform (only for tutor)
  const [allCourses, setAllCourses] = useState(null);

  /**
   * send user JSON to backend
   * @param {Object} updatedUser contains fields value collected by antd.Form
   */
  const handleSumbitForm = (updatedUser) => {
    let userPayload = updatedUser;

    // Process timeZone
    if (userPayload.timeZone) {
      userPayload = {
        ...updatedUser,
        timeZone: updatedUser.timeZone.join("/"),
      };
    }
    setComponentDisabled(true);

    updateUserInfo(userId, userType, userPayload)
      .then((res) => res.json())
      .then((data) => {
        successNotification(data.message);
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Profile Error", res.message);
        });
      });
  };

  /**
   * Send an HTTP GET request to get the user
   */
  const fetchUser = () => {
    getUser(userId, userType)
      .then((res) => res.json())
      .then((data) => {
        let user = data.data;
        user = {
          ...user,
          timeZone: user.timeZone ? user.timeZone.split("/") : null,
        };
        setUser(user);
        isTutor(userType) && setSelectedCourses(user.courses);
      })
      .catch((err) => {
        err.response.json().then((res) => {
          errorNotification("Profile Error", res.message);
        });
      });
  };

  /**
   * Send an HTTP GET request to get all available time zones
   */
  const fetchTimeZones = () => {
    getAllTimeZones()
      .then((res) => res.json())
      .then((data) => {
        setAllTimeZones(formatTimeZones(data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Send an HTTP GET request to get all courses
   */
  const fetchAllCourses = () => {
    getAllCourseNames()
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setTitle("Profile");
    fetchUser();
    fetchTimeZones();
    isTutor(userType) && fetchAllCourses();
  }, []);

  if (!user || !allTimeZones) {
    return (
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    );
  }

  return (
    <>
      {/* Edit Button */}
      {componentDisabled ? (
        <Button type="primary" onClick={() => setComponentDisabled(false)}>
          Edit
        </Button>
      ) : null}

      {/* Profile Form */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Form
          onFinish={(updateUser) => handleSumbitForm(updateUser)}
          initialValues={user}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizovental"
          disabled={componentDisabled}
          style={{
            width: "60%",
            maxWidth: "500px",
          }}
        >
          {/* Avatar */}
          <Form.Item
            label="Profile Photo"
            name="imgUrl"
            getValueFromEvent={(url) => url}
          >
            <UploadAvatar defultImageUrl={user.imgUrl}></UploadAvatar>
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email">
            <div>{user.email}</div>
          </Form.Item>

          {/* First Name */}
          <Form.Item label="First Name" name="firstName">
            <Input type="text" />
          </Form.Item>

          {/* Last Name */}
          <Form.Item label="Last Name" name="lastName">
            <Input type="text" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item label="Phone No." name="phone">
            <Input type="text" />
          </Form.Item>

          {/* Bio */}
          <Form.Item label="Biography" name="bio">
            <TextArea rows={4} />
          </Form.Item>

          {/* Address */}
          <Form.Item label="Address" name="address">
            <Input type="text" />
          </Form.Item>

          {/* Time Zone */}
          <Form.Item label="Time Zone" name="timeZone">
            <Cascader options={allTimeZones} />
          </Form.Item>

          {/* Upload files for qualification (for tutors only) */}
          {isTutor(userType) ? (
            <Form.Item label="Qualifications" name="docUrls">
              <UploadFile defaultFileUrls={user.docUrls} />
            </Form.Item>
          ) : null}

          {/* Courses (for tutors only) */}
          {isTutor(userType) ? (
            <Form.Item label="Courses" name="coursesName">
              <Select
                mode="multiple"
                placeholder="select courses"
                value={selectedCourses}
                onChange={setSelectedCourses}
                style={{
                  width: "100%",
                }}
                options={allCourses.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          ) : null}

          {/* Save Button */}
          <Form.Item
            wrapperCol={{
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            }}
          >
            {componentDisabled ? null : (
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProfileForm;
