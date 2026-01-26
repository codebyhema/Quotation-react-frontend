import "./scss/Dashboard.scss";
import Dheader from "./Dheader";
import Drows from "./Drows";
import Table from "./table";
import { useState, useEffect } from "react";

function Dashboard({ setActiveTab, setQuotationToEdit }) {
  const [quotations, setQuotations] = useState([]);
  const [sortType, setSortType] = useState("New to Old");

  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost/projects/gharwala_backend/get_quotation.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const parsed = data.data.map((q) => ({
            ...q,
            json_data: JSON.parse(q.json_data || "{}"),
          }));
          setQuotations(parsed);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  //  Sorting Logic
  const sortQuotations = (type) => {
    const sorted = [...quotations].sort((a, b) => {
      const numA = parseInt(a.qid.replace("QTN", ""), 10);
      const numB = parseInt(b.qid.replace("QTN", ""), 10);

      if (type === "New to Old") return numB - numA;
      if (type === "Old to New") return numA - numB;
      if (type === "A to Z") return a.cname.localeCompare(b.cname);
      return 0;
    });

    setQuotations(sorted);
  };

  // When dropdown changes
  const handleSortChange = (option) => {
    setSortType(option);
    sortQuotations(option);
  };

  //for view
  const handleView = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  //for update
  const handleUpdate = (quotation) => {
    setQuotationToEdit(quotation);
    setActiveTab("quotation");
  };

  const handleDeleteQuotation = async (qid) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "http://localhost/projects/gharwala_backend/deleteQuotation.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qid }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        alert("Quotation deleted successfully!");
        setQuotations((prev) => prev.filter((q) => q.qid !== qid)); // remove from UI
      } else {
        alert("Failed to delete quotation.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while deleting quotation.");
    }
  };

  const filteredQuotation = quotations
    .map((q) => {
      const isMatching =
        searchTerm.trim() !== "" &&
        (q.cname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.qid.toLowerCase().includes(searchTerm.toLowerCase()));

      return { ...q, match: isMatching };
    })
    .sort((a, b) => b.match - a.match);

  return (
    <div className="wrapper">
      <Dheader
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Map all quotation rows here */}
      {filteredQuotation.length > 0 ? (
        filteredQuotation.map((q) => (
          <Drows
            key={q.id}
            cname={q.cname}
            qid={q.qid}
            data={q.json_data}
            onView={() => handleView(q)}
            onUpdate={() => handleUpdate(q)}
            onDelete={() => handleDeleteQuotation(q.qid)}
            match={q.match}
          />
        ))
      ) : (
        <h2>
          Welcome to Dashboard
          <h3>No quotations found.</h3>
        </h2>
      )}
      {showModal && selectedQuotation && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <Table
              quotation={selectedQuotation.json_data || {}}
              formData={{}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
