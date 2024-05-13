import { Badge, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const NumUsersBadge = ({ title, numUsers }) => {
  return (
    <Space>
      {title}
      <Badge
        className="site-badge-count-109"
        count={numUsers}
        showZero
        style={{ backgroundColor: "#52c41a" }}
      >
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
    </Space>
  );
};

export default NumUsersBadge;
