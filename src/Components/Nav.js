import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { Menu, Modal } from "antd";

import {
  HomeTwoTone,
  HddTwoTone,
  LogoutOutlined,
  CarTwoTone,
  IdcardTwoTone,
  LoginOutlined,
  UserAddOutlined,
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
            <Menu.Item key={"/"} icon={<HomeTwoTone />}>
              Home
            </Menu.Item>
            <Menu.Item key={"/login"} icon={<LoginOutlined />}>
              Login
            </Menu.Item>
            <Menu.Item key={"/register"} icon={<UserAddOutlined />}>
              Sign up
            </Menu.Item>
          </>
        )}
        {isLoggedIn && (
          <>
            <Menu.Item key={"/booking"} icon={<HomeTwoTone />}>
              Book Slot
            </Menu.Item>
            <Menu.Item key={"/mybookings"} icon={<HddTwoTone />}>
              My Bookings
            </Menu.Item>
            <Menu.Item key={"/vehicles"} icon={<CarTwoTone />}>
              Vehicles
            </Menu.Item>
            <Menu.Item key={"/profile"} icon={<IdcardTwoTone />}>
              Profile
            </Menu.Item>
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
