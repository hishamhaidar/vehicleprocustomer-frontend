import React, { useEffect } from "react";
import { axiosGarage } from "../api/AxiosConfig";
import { Button, Table } from "antd";
const Slots = ({ bookingSlots, setBookingSlots, handleBooking }) => {
  const getSlots = async () => {
    try {
      const response = await axiosGarage.get("/slots/search/all");
      setBookingSlots(response?.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSlots();
  }, []);
  const columns = [
    {
      title: "Slot ID",
      dataIndex: "slotID",
      key: "slotID",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },

    {
      title: "Current Capacity",
      dataIndex: "currCapacity",
      key: "currCapacity",
    },
    {
      title: "Max Capacity",
      dataIndex: "maxCapacity",
      key: "maxCapacity",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span className="SlotsTableActions">
          <Button
            onClick={() => {
              handleBooking(record);
            }}
            type="primary"
            shape="round"
          >
            Book
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={bookingSlots}
        columns={columns}
        rowKey="slotID"
      ></Table>
    </div>
  );
};

export default Slots;
