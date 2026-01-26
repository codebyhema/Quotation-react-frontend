// import { useState } from "react";
import logo from "./img/gharwalaInterior-logo2.svg";
import "./scss/Navbar.scss";

function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "quotation", label: "Quotation" },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="" />
      </div>

      <div className="navbar-center">
        {/* Toggle highlight */}
        <div
          className="tab-highlight"
          style={{
            transform: `translateX(${
              tabs.findIndex((t) => t.id === activeTab) * 100
            }%)`,
          }}
        ></div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </nav>
  );
}
export default Navbar;
