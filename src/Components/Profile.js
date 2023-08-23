import React, { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import useAuth from "../hooks/useAuth";
import { UserOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import "../App.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const { Title, Text } = Typography;

const Profile = ({ firstName, lastName, userID, signOut }) => {
  const { auth } = useAuth();
  const email = auth.userEmail;
  const authApi = useAxiosPrivate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [modifiedFName, setModifiedFName] = useState(firstName);
  const [modifiedLName, setModifiedLName] = useState(lastName);
  const [modifiedEmail, setModifiedEmail] = useState(email);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async () => {
    const modifiedData = {
      firstName: modifiedFName,
      lastName: modifiedLName,
      email: modifiedEmail,
    };
    try {
      const response = await authApi.put(
        `/customer/modify/${email}`,
        modifiedData
      );
      message.success(response?.data);
      signOut();
    } catch (err) {
      message.error(err?.response?.data);
    }

    setIsEditMode(false);
  };
  const handlePasswordChange = async () => {
    try {
      const response = await authApi.put(`/customer/password/${email}`, {
        currentPassword: currPass,
        newPassword: newPass,
      });
      console.log(response?.data);
      message.success(response?.data);
      setIsChangingPass(false);
    } catch (err) {
      message.error(err?.response?.data);
    }
  };
  const discardSaving = () => {
    setIsChangingPass(false);
    setIsEditMode(false);
    setCurrPass("");
    setNewPass("");
    setModifiedFName(firstName);
    setModifiedEmail(email);
    setModifiedLName(lastName);
  };

  return (
    <div className="Profile">
      <Card className="ProfileCard">
        <Avatar
          size={64}
          icon={<UserOutlined />}
          style={{ marginBottom: 20 }}
        />
        <Title level={1}>User Profile</Title>
        <div className="ProfileContent">
          <div>
            <Text strong>Customer ID:</Text> <Text italic>{userID}</Text>
            <br />
            {isEditMode ? (
              <>
                <Form onFinish={handleSaveClick}>
                  <Form.Item label={"First Name"}>
                    <input
                      type="text"
                      defaultValue={modifiedFName}
                      onChange={(e) => setModifiedFName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label={"Last Name"}>
                    <input
                      type="text"
                      defaultValue={modifiedLName}
                      onChange={(e) => setModifiedLName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    rules={[
                      {
                        type: "email",
                        message: "Enter valid email",
                        required: true,
                        pattern: new RegExp(
                          "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                        ),
                        message: "Please enter a valid email address.",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      value={modifiedEmail}
                      onChange={(e) => setModifiedEmail(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      htmlType="submit"
                    >
                      Save
                    </Button>
                    <Button onClick={discardSaving}>cancel</Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <Text strong>First Name:</Text> <Text italic>{firstName}</Text>
                <br />
                <Text strong>Last Name:</Text> <Text italic>{lastName}</Text>
                <br />
                <Text strong>Email:</Text> <Text italic>{email}</Text>
              </>
            )}
          </div>
          <div className="ProfileActions">
            {isEditMode ? (
              <></>
            ) : (
              <>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              </>
            )}
            <Button onClick={() => setIsChangingPass(true)}>
              Change password
            </Button>
            <Modal open={isChangingPass} footer={null} onCancel={discardSaving}>
              <Form onFinish={handlePasswordChange}>
                <Form.Item label="Current password">
                  <Input
                    type="password"
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="New password">
                  <Input
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    save
                  </Button>
                  <Button onClick={discardSaving} danger>
                    discard
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
