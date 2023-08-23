import React from "react";
import "../App.css";
const Footer = () => {
  return (
    <div className="App-Footer">
      &copy; {new Date().getFullYear()} VehiclePro. All rights reserved.
    </div>
  );
};

export default Footer;
