import Header from "../Component/Header";
import SideBar from "../Component/SideBar";
import React, {useState} from 'react';

export default function DashBoard(){
   const [isCollapsed, setIsCollapsed] = useState(false);

   const toggleSidebar = () => {
     setIsCollapsed(!isCollapsed);
   };
return <>
     <SideBar isCollapsed={isCollapsed}/>
     <div className={`dashboardlist ${isCollapsed ? 'dashboard-collapsed' : 'dashboardlist'}`}>
        <Header toggleSidebar={toggleSidebar}/>
    <div className="dashboard-list-contents">
       <h2 className="dashboard-header">Home Page</h2>
      </div>
    </div>
     
     </>
     }