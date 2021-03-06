import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./landing_page/Home";
import About from "./landing_page/About";
import Contact from "./landing_page/Contact";
import LogIn from "./landing_page/LogIn";
import Register from "./landing_page/Register";
import ForgotPasswordAuth from "./landing_page/ForgotPasswordAuth";
import UpdatePassword from "./landing_page/UpdatePassword";
import VerifyEmail from "./landing_page/VerifyEmail";
import Navbar from "./landing_page/Navbar";

import AllContracts from "./main_page/AllContracts";
import Contributions from "./main_page/Contributions";
import PersonalCampaigns from "./main_page/PersonalCampaigns";
import CreateContract from "./main_page/CreateContract";
import Profile from "./main_page/Profile";
import VendorRegistration from "./main_page/VendorRegistration";
import RequestsPage from "./main_page/RequestsPage";
import CreateRequest from "./main_page/CreateRequest";
import ManagerInfo from "./main_page/ManagerInfo";
import CampaignDetail from "./main_page/CampaignDetail";
import CampaignDisp from "./main_page/CampaignDisp";
import VendorDetails from "./main_page/VendorDetails";
import MainNavBar from "./main_page/MainNavBar";

import Footer from "./Footer";

import { isAuthenticated } from "./auth/helper";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
  return (
    <>
      {!isAuthenticated() && <Navbar />}
      {isAuthenticated() && <MainNavBar />}
      <Routes>
        <Route
          end
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          end
          path="/about"
          element={
            <PublicRoute>
              <About />
            </PublicRoute>
          }
        />
        <Route
          end
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />
        <Route
          end
          path="/login"
          element={
            <PublicRoute>
              <LogIn />
            </PublicRoute>
          }
        />
        <Route
          end
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          end
          path="/verifyEmail/:email/:otp"
          element={
            <PublicRoute>
              <VerifyEmail />
            </PublicRoute>
          }
        />

        <Route
          end
          path="/forgotPassAuth"
          element={
            <PublicRoute>
              <ForgotPasswordAuth />
            </PublicRoute>
          }
        />

        <Route
          end
          path="/updatePassword"
          element={
            <PublicRoute>
              <UpdatePassword />
            </PublicRoute>
          }
        />

        <Route
          end
          path="/allcontracts"
          element={
            <PrivateRoute>
              <AllContracts />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/contributions"
          element={
            <PrivateRoute>
              <Contributions />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/personalcampaigns"
          element={
            <PrivateRoute>
              <PersonalCampaigns />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/createcontract"
          element={
            <PrivateRoute>
              <CreateContract />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/vendorRegistration"
          element={
            <PrivateRoute>
              <VendorRegistration />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/campaignDetail"
          element={
            <PrivateRoute>
              <CampaignDetail />
            </PrivateRoute>
          }
        />

        <Route
          end
          path="/viewRequests"
          element={
            <PrivateRoute>
              <RequestsPage />
            </PrivateRoute>
          }
        />
        <Route
          end
          path="/createRequest"
          element={
            <PrivateRoute>
              <CreateRequest />
            </PrivateRoute>
          }
        />

        <Route
          end
          path="/managerInfo"
          element={
            <PrivateRoute>
              <ManagerInfo />
            </PrivateRoute>
          }
        />

        <Route
          end
          path="/campaigns/:email"
          element={
            <PrivateRoute>
              <CampaignDisp />
            </PrivateRoute>
          }
        />

        <Route
          end
          path="/vendors/:address"
          element={
            <PrivateRoute>
              <VendorDetails />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default App;
