import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Table, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../App.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Vehicles = ({ vehicleOwnerID, getUserInfo, loading }) => {
  const [vehicles, setVehicles] = useState([]);
  const [editedVehicle, setEditedVehicle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const authApi = useAxiosPrivate();

  const getVehicles = async () => {
    try {
      const response = await authApi.get(
        `/vehicles/view/ownedby/${vehicleOwnerID}`
      );

      setVehicles(response?.data);
    } catch (err) {
      message.error("error while getting vehicles,please refresh");
    }
  };

  useEffect(() => {
    !loading && getVehicles();
  }, [loading]);

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
      message.success(response?.data);
    } catch (err) {
      message.error(err?.response?.data);
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

      message.success("Edited successfully", 2);
      await getVehicles();
    } catch (err) {
      message.error(err?.response?.data);
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

      if (response.status === 200) {
        message.success("Added successfully", 2);
        await getVehicles();
      }
    } catch (err) {
      message.error(err?.response?.data);
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
    </div>
  );
};

export default Vehicles;
