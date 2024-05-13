import React from "react";
import { Avatar, Descriptions, Tag, Space, List } from "antd";

import { extractFileName } from "../profile/extractFilename";

const processUnknown = (string) => {
  return string ? string : "unknown";
};

const TutorDesciption = ({ tutor }) => {
  const items = [
    {
      key: "1",
      label: "Name",
      children: `${[tutor.firstName, tutor.lastName].join(" ")}`,
    },
    {
      key: "2",
      label: "Email",
      children: `${tutor.email}`,
    },
    {
      key: "3",
      label: "Phone No.",
      children: `${processUnknown(tutor.phone)}`,
    },
    {
      key: "4",
      label: "Location",
      children: `${processUnknown(tutor.timeZone)}`,
    },
    {
      key: "8",
      label: "Bio",
      children: `${processUnknown(tutor.bio)}`,
    },

    {
      key: "5",
      label: "Address",
      children: `${processUnknown(tutor.address)}`,
    },
  ];
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <img
          style={{
            width: "20%",
          }}
          src={
            tutor.imgUrl
              ? tutor.imgUrl
              : "https://www.unsw.edu.au/content/unsw-sites/au/en/science/our-schools/babs/about-us/professional-and-technical-staff/_jcr_content/root/responsivegrid-layout-fixed-width/responsivegrid-full-top/column_layout_copy_c/par_2_1_50/column_layout_copy/par_2_1_50/image.coreimg.82.1170.jpeg/1668559537766/2021-07-blank-avatar.jpeg"
          }
          alt=""
        />
      </div>

      <Descriptions items={items} />

      <Space>
        <p>Courses: </p>
        <div
          style={{
            display: "flex",
          }}
        >
          {tutor.coursesName.length > 0
            ? tutor.coursesName.map((course) => {
                return <Tag color="magenta">{course}</Tag>;
              })
            : "unknown"}
        </div>
      </Space>

      <List
        style={{
          marginTop: "10px",
          maxHeight: "200px",
          overflowY: "auto",
        }}
        header={<div>Qualifications</div>}
        bordered
        dataSource={tutor.docUrls}
        renderItem={(url) => (
          <List.Item>
            <a href={url}>{extractFileName(url)}</a>
          </List.Item>
        )}
      />
    </>
  );
};
export default TutorDesciption;
