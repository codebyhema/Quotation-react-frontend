import { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Quotation from "./Quotation";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quotationToEdit, setQuotationToEdit] = useState(null);
  return (
    <div style={{ transition: "opacity 0.4s ease-in" }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "dashboard" && (
        <Dashboard
          setActiveTab={setActiveTab}
          setQuotationToEdit={setQuotationToEdit}
        />
      )}
      {activeTab === "quotation" && (
        <Quotation
          quotationToEdit={quotationToEdit}
          setQuotationToEdit={setQuotationToEdit}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
export default App;
