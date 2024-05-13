import React from "react";
import { Avatar, Descriptions, Tag, Space, List } from "antd";
import CourseTutorsList from './CourseTutorsList';


// const processUnknown = (string) => {
//   return string ? string : "unknown";
// };

const CourseDescription = ({ course }) => {
  const items = [
    {
        key: "1",
        label: "Course Description",
        children: `${course.description}`,
        span: 2,
    },
    {
        key: "2",
        label: "Tags",
        children: course.tagSet.length > 0
            ? course.tagSet.map(tag => {
                return <Tag color="magenta">{tag}</Tag>;
            })
            : "unknown",
        span: 3,
    },
    {
        key: "3",
        label: "Tutors",
        span: 3
    }
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
        </div>

        <Descriptions
            items={items}
            layout="horizontal"
        />

        <CourseTutorsList courseId={course.id} />
    </>
  );
};
export default CourseDescription;
