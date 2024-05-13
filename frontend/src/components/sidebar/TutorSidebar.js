import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
  MessageOutlined,
  CalendarOutlined,
  SearchOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const TutorSidebar = () => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={[
        {
          key: "1",
          icon: <MessageOutlined />,
          label: <Link to={`/messages`}>Messages</Link>,
        },
        {
          key: "2",
          icon: <SearchOutlined />,
          label: <Link to={`/find-a-tutor`}>Find a Tutor</Link>,
        },
        {
          key: "3",
          icon: <DatabaseOutlined />,
          label: <Link to={`/courses`}>Courses</Link>,
        }
      ]}
    />
  );
};

export default TutorSidebar;
