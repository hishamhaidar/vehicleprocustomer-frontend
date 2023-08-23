import React, { useState } from "react";
import Slots from "./Slots";
import { Button, Modal, Form, Input, Select, Alert, FloatButton } from "antd";
import "../App.css";
import { axiosGarage } from "../api/AxiosConfig";
import useAuth from "../hooks/useAuth";

const BookingSlot = ({ userFullName, vehicles }) => {
  const [bookingSlots, setBookingSlots] = useState([]);
  const [chosenSlot, setChosenSlot] = useState({});
  const [isBooking, setIsBooking] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [sucessMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [vehicleProblem, setVehicleProblem] = useState("");
  const { auth } = useAuth();
  const clientEmail = auth?.userEmail;
  const { TextArea } = Input;

  const handleBooking = (slot) => {
    setIsBooking(true);
    setChosenSlot(slot);
  };
  const handleConfirmedBooking = async () => {
    const body = {
      clientName: userFullName,
      clientEmail: clientEmail,
      vehicleID: selectedVehicleId,
      vehicleProblem: vehicleProblem,
    };
    setIsBooking(false);
    try {
      const response = await axiosGarage.post(
        `/booking/book/${chosenSlot?.slotID}`,
        body
      );
      setSuccessMessage(
        `You booked Slot with ID ${chosenSlot?.slotID} ,wait for reply mail`
      );
      setSuccess(true);
    } catch (err) {
      setFailMessage(err?.response?.data);
      setFail(true);
    }
  };
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
          banner
          type="error"
          message={failMessage}
          closable
          afterClose={() => setFail(false)}
          className="custom-alert"
        />
      )}
      <Slots
        bookingSlots={bookingSlots}
        setBookingSlots={setBookingSlots}
        handleBooking={handleBooking}
      />
      <Modal
        open={isBooking}
        title="Confirm Booking"
        onCancel={() => setIsBooking(false)}
        footer={null}
      >
        <p>Are you sure that you wanna book this slot?</p>
        <p>
          <strong>
            your request will be pending, wait for confirmation/denial mail
          </strong>
        </p>
        <Form onFinish={handleConfirmedBooking}>
          <Form.Item label="Client email">
            <Input value={clientEmail} disabled />
          </Form.Item>
          <Form.Item label="Client Name">
            <Input value={userFullName} disabled />
          </Form.Item>
          <Form.Item required label="Vehicle ID">
            <Select
              required
              value={selectedVehicleId}
              onChange={(value) => setSelectedVehicleId(value)}
            >
              {vehicles.map((vehicle) => (
                <Select.Option
                  key={vehicle?.vehicleID}
                  value={vehicle?.vehicleID}
                >
                  {vehicle?.vehicleID}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item required label="Vehicle Problem">
            <TextArea
              required
              rows={4}
              value={vehicleProblem}
              onChange={(e) => setVehicleProblem(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
            <Button danger onClick={() => setIsBooking(false)}>
              discard
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <FloatButton.BackTop />
    </div>
  );
};

export default BookingSlot;
