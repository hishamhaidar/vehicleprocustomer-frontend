import React, { useEffect, useState } from "react";
import { FloatButton, Table, message } from "antd";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const MyBookings = ({ currentUserID, mybookings, setMyBookings }) => {
  const authApi = useAxiosPrivate();
  const getMyBookings = async () => {
    try {
      const response = await authApi.get(`/bookings/${currentUserID}`);
      setMyBookings(response?.data);
    } catch (err) {
      message.error("error while getting bookings");
    }
  };
  useEffect(() => {
    getMyBookings();
  }, []);

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Slot ID",
      dataIndex: "slotID",
      key: "slotID",
    },
    {
      title: "Vehicle ID",
      dataIndex: "vehicleID",
      key: "vehicleID",
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (_, record) => (
        <span
          style={{
            color:
              record.bookingStatus === "CONFIRMED"
                ? "green"
                : record.bookingStatus === "DENIED"
                ? "red"
                : "aqua",
          }}
        >
          {record.bookingStatus}
        </span>
      ),
    },
    {
      title: "Vehicle Problem",
      dataIndex: "vehicleProblem",
      key: "vehicleProblem",
    },
  ];

  return (
    <div>
      <h1>My Bookings</h1>
      <Table dataSource={mybookings} columns={columns} rowKey={"bookingID"} />
      <FloatButton.BackTop />
    </div>
  );
};

export default MyBookings;
