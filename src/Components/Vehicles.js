import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  DatePicker,
  FloatButton,
  Form,
  Input,
  Modal,
  Table,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../App.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Vehicles = ({ vehicleOwnerID, vehicles, getVehicles }) => {
  const [editedVehicle, setEditedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sucessMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const authApi = useAxiosPrivate();

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditedVehicle(record);
  };

  const handleDelete = (record) => {
    setIsDeleting(true);
    setEditedVehicle(record);
  };

  const confirmDelete = async () => {
    setIsDeleting(false);
    try {
      const response = await authApi.delete(
        `/vehicles/delete/${vehicleOwnerID}/${editedVehicle?.vehicleID}`
      );

      await getVehicles();
      setSuccessMessage("Vehicle deleted successfully");
      setSuccess(true);
    } catch (err) {
      setFailMessage("Failed to delete vehicle.");
      setFail(true);
    }
  };

  const handleSavingEditedSlot = async () => {
    const modifiedVehicle = {
      brand: editedVehicle?.vehicleBrand,
      model: editedVehicle?.vehicleModel,
      yearOfProduction: editedVehicle?.yearOfProduction,
    };
    setIsEditing(false);
    try {
      const response = await authApi.put(
        `/vehicles/edit/${vehicleOwnerID}/${editedVehicle?.vehicleID}`,
        modifiedVehicle
      );
      await getVehicles();
      setSuccessMessage("Vehicle edited successfully");
      setSuccess(true);
    } catch (err) {
      setFailMessage("Failed to edit vehicle.");
      setFail(true);
    }
  };
  const handleAddingNewVehicle = async (data) => {
    const formattedData = {
      ...data,
      yearOfProduction: data.yearOfProduction.format("YYYY"),
    };
    setIsCreating(false);
    try {
      const response = await authApi.post(
        `/vehicles/add/${vehicleOwnerID}`,
        formattedData
      );
      await getVehicles();
      setSuccessMessage("Vehicle added successfully");
      setSuccess(true);
    } catch (err) {
      setFailMessage("Failed to add vehicle.");
      setFail(true);
    }
  };
  const columns = [
    {
      title: "Vehicle ID",
      dataIndex: "vehicleID",
      key: "vehicleID",
    },
    {
      title: "Brand",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
    },
    {
      title: "Model",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
    },
    {
      title: "Year of Production",
      dataIndex: "yearOfProduction",
      key: "yearOfProduction",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      {success && (
        <Alert
          type="success"
          message={sucessMessage}
          closable
          afterClose={() => setSuccess(false)}
          banner
          className="custom-alert"
        />
      )}
      {fail && (
        <Alert
          type="error"
          message={failMessage}
          closable
          afterClose={() => setFail(false)}
          className="custom-alert"
        />
      )}
      <Button
        type="primary"
        onClick={() => {
          setIsCreating(true);
        }}
      >
        Add new vehicle
      </Button>
      <Table columns={columns} dataSource={vehicles} rowKey="vehicleID" />
      <Modal
        title="Add Vehicle"
        open={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={null}
      >
        <Form
          onFinish={(data) => {
            handleAddingNewVehicle(data);
          }}
        >
          <Form.Item required name="brand" label="Vehicle Brand">
            <Input required name="brand" />
          </Form.Item>
          <Form.Item required name="model" label="Vehicle Model">
            <Input required name="model" />
          </Form.Item>
          <Form.Item
            required
            name="yearOfProduction"
            label="Year Of Production"
          >
            <DatePicker
              required
              showToday
              picker="year"
              name="yearOfProduction"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={() => setIsCreating(false)} danger>
              Discard
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Vehicle"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form onFinish={handleSavingEditedSlot}>
          <Form.Item label="Vehicle ID">
            <Input value={editedVehicle?.vehicleID} disabled />
          </Form.Item>
          <Form.Item label="Vehicle Brand">
            <Input
              value={editedVehicle?.vehicleBrand}
              onChange={(e) =>
                setEditedVehicle({
                  ...editedVehicle,
                  vehicleBrand: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Vehicle Model">
            <Input
              value={editedVehicle?.vehicleModel}
              onChange={(e) =>
                setEditedVehicle({
                  ...editedVehicle,
                  vehicleModel: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Year Of Production">
            <DatePicker
              showToday
              picker="year"
              onChange={(date, dateString) =>
                setEditedVehicle({
                  ...editedVehicle,
                  yearOfProduction: dateString,
                })
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} danger>
              Discard
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Deletion"
        okText="YES"
        open={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onOk={confirmDelete}
      >
        <p>Are you sure you want to delete this vehicle?</p>
      </Modal>
      <FloatButton.BackTop />
    </div>
  );
};

export default Vehicles;
