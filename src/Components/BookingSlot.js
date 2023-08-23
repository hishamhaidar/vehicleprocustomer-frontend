import React, { useState } from "react";
import Slots from "./Slots";

const BookingSlot = () => {
  const [bookingSlots, setBookingSlots] = useState([]);
  return (
    <div>
      <Slots bookingSlots={bookingSlots} setBookingSlots={setBookingSlots} />
    </div>
  );
};

export default BookingSlot;
