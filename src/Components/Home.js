import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{}}>
      <h1>Website for VehiclePro Customers</h1>

      <p>
        Already a user ?<Link to={"/login"}>Login here</Link>
      </p>
      <p>
        New User? <Link to={"/register"}>register for an account here</Link>
      </p>
      <main>
        <p>Place where you can book appointments for car maintenance</p>
      </main>
    </div>
  );
};

export default Home;
