import React from "react";
//Css Imports
import "./styles/App.css";
import "./styles/EmployeeList.css";
import "./styles/Header.css";
import "./styles/Slider.css";
import "./styles/ClientList.css";
import "./styles/HostedSites.css";
import "./styles/TemplateAdmin.css";
import "./styles/Home.css";
import "./styles/approval.css";
import "./styles/pagination.css";
import "./styles/reset.css";
import Login from "./Pages/Login";
import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import HostedSite from "./Pages/HostedSites";
import TemplateAdmin from "./Pages/TemplateAdmin";
import EmployeeList from "./Pages/EmployeeList";
import ClientList from "./Pages/ClientList";
import Approvals from "./Pages/Approvals";
import DashBoard from "./Pages/SuperAdmin";
import ResetPassword from "./Pages/ResetPassword";


function App() {
  return(
          <div className="App">
          <Router>
            <Routes>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/dashboard" element={<DashBoard/>}></Route>
              <Route path="/hosted-list" element={<HostedSite/>}></Route>
              <Route path="/template-admins" element={<TemplateAdmin/>}></Route>
              <Route path="/employee-list" element={<EmployeeList/>}></Route>
              <Route path="/client-list" element={<ClientList/>}></Route>
              <Route path="/approvals" element={<Approvals/>}></Route>
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </Router>
          </div>
)}

export default App;
