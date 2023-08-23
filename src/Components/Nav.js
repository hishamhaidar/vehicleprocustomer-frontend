import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { Menu, Modal } from "antd";

import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  UserOutlined,
  SoundTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const Nav = ({ isLoggedIn, signOut }) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const hideLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const handleMenuClick = ({ key }) => {
    if (key === "/logout") {
      setIsLogoutModalVisible(true);
    } else navigate(key);
  };
  return (
    <div className="App-Nav">
      <Menu
        className="App-Nav"
        onClick={handleMenuClick}
        defaultSelectedKeys={[location.pathname]}
      >
        {!isLoggedIn && (
          <>
            <Menu.Item key={"/"}>Home</Menu.Item>
            <Menu.Item key={"/login"}>Login</Menu.Item>
            <Menu.Item key={"/register"}>Sign up</Menu.Item>
          </>
        )}
        {isLoggedIn && (
          <>
            <Menu.Item key={"/booking"}>Booking</Menu.Item>
            <Menu.Item key={"/vehicles"}>Vehicles</Menu.Item>
            <Menu.Item key={"/profile"}>Profile</Menu.Item>
            <Menu.Item key="/logout" danger icon={<LogoutOutlined />}>
              Logout
            </Menu.Item>
          </>
        )}
        <Modal
          title="Confirm Logout"
          open={isLogoutModalVisible}
          onCancel={hideLogoutModal}
          onOk={() => {
            signOut();
            hideLogoutModal();
          }}
        >
          Are you sure you want to log out?
        </Modal>
      </Menu>
    </div>
  );
};

export default Nav;
