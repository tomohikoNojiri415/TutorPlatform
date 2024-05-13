import React, { useState, useEffect } from "react";
import { Layout, Button, theme, Avatar, Dropdown, Spin } from "antd";

import { HomeOutlined } from "@ant-design/icons";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { Link } from "react-router-dom";
import { logout } from "../clients/authClient";
import { getAuthContext } from "../utils/util";

import "../css/Root.css";
import { getUser } from "../utils/util";

const { Header, Sider, Content } = Layout;

const Root = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Welcome to the platform");
  const [authContext] = useState(getAuthContext());

  const [isLoading, setIsLoading] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (
      authContext === null ||
      authContext.id === null ||
      authContext.userType === null
    ) {
      window.location.href = "/login";
      return;
    }
    getUser(authContext.id, authContext.userType)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [authContext, location]);

  // Dropdown menu for the avatar
  const items = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "0",
    },
    {
      label: (
        <Link onClick={() => logout()} to="/login">
          Logout
        </Link>
      ),
      key: "1",
    },
  ];

  if (isLoading) {
    return (
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    );
  }

  return (
    <>
      {isLoading ? null : (
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Link to={`/homepage`}>
                <Button type="primary" icon={<HomeOutlined />}>
                  {collapsed ? null : "Homepage"}
                </Button>
              </Link>
            </div>
            <Sidebar
              userType={authContext === null ? null : authContext.userType}
            />
          </Sider>

          <Layout>
            <Header className="header">
              <div className="header__left">
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 80,
                    height: 64,
                    color: "white",
                  }}
                />
              </div>
              <div className="header__center">{title}</div>
              <div className="header__right">
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <Avatar
                    size={50}
                    src={user && user.imgUrl ? user.imgUrl : <UserOutlined />}
                  />
                </Dropdown>
              </div>
            </Header>
            <Content
              className="content"
              style={{
                background: colorBgContainer,
                minHeight: 'calc(100vh -48px)',//header 64px + 2* content padding 24px = 112px,
              }}
            >
              <Outlet context={[setTitle, authContext]} />
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default Root;