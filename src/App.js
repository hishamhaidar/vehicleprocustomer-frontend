import "./App.css";
import { useState, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Components/Header";
import Nav from "./Components/Nav";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import RequireAuth from "./Components/RequireAuth";
import BookingSlot from "./Components/BookingSlot";
import Profile from "./Components/Profile";
import Vehicles from "./Components/Vehicles";
import AuthContext from "./context/AuthProvider";
import Missing from "./Components/Missing";
import Footer from "./Components/Footer";
import useAxiosPrivate from "./hooks/useAxiosPrivate";
import { message } from "antd";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentUserID, setCurrentUserID] = useState("");
  const { setAuth, auth } = useContext(AuthContext);
  const authApi = useAxiosPrivate();
  const navigate = useNavigate();
  const signOut = () => {
    setAuth({});
    setIsLoggedIn(false);
    navigate("/");
  };
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const loggedUserInfo = await authApi.get(
        `/customer/getinfo/${auth?.userEmail}`
      );
      setCurrentUserID(loggedUserInfo?.data?.userID);
      setFirstName(loggedUserInfo?.data?.firstName);
      setLastName(loggedUserInfo?.data?.lastName);
    } catch (error) {
      message.error("Couldnt get user data,please login again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && getUserInfo();
  }, [isLoggedIn]);
  return (
    <div className="App">
      <Header />
      <div className="App-Body">
        <Nav isLoggedIn={isLoggedIn} signOut={signOut} />
        <main className="App-Content">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route exact path="/" element={<Home />} />
              <Route
                path="login"
                element={
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    userEmail={userEmail}
                    setUserEmail={setUserEmail}
                    getUserInfo={getUserInfo}
                  />
                }
              />
              <Route path="register" element={<Signup />} />
              {/* AUTHORIZED ROUTES HERE */}
              <Route element={<RequireAuth signOut={signOut} />}>
                <Route
                  path="booking"
                  element={<BookingSlot currentUserID={currentUserID} />}
                />

                <Route
                  path="vehicles"
                  element={
                    <Vehicles
                      vehicleOwnerID={currentUserID}
                      getUserInfo={getUserInfo}
                      loading={loading}
                    />
                  }
                />

                <Route
                  path="profile"
                  element={
                    <Profile
                      firstName={firstName}
                      lastName={lastName}
                      userID={currentUserID}
                      signOut={signOut}
                    />
                  }
                />
              </Route>

              {/*404 sites */}
              <Route path="*" element={<Missing />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
