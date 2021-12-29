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
import Navbar from "./landing_page/Navbar";

import AllContracts from "./main_page/AllContracts";
import Contributions from "./main_page/Contributions";
import PersonalCampaigns from "./main_page/PersonalCampaigns";
import CreateContract from "./main_page/CreateContract";
import Profile from "./main_page/Profile";
import MainNavBar from "./main_page/MainNavBar";

import Footer from "./Footer";

import { isAuthenticated } from "./auth/helper";
import PublicRoute from "./auth/PublicRoute";
import PrivateRoute from "./auth/PrivateRoute";
import CampaignDetail from "./main_page/CampaignDetail";
import RequestsPage from "./main_page/RequestsPage";

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
