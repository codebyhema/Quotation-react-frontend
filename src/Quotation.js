import { useState, useEffect } from "react";
import { produce } from "immer";
import "./scss/main.scss";
import "./scss/Quotation.scss";
import Form from "./form";
import Table from "./table";
import QuotationTemplate from "./Qstructure";

// 🗓 Common date formatter for reuse
const getFormattedDate = () => {
  const today = new Date();
  return today.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const generateNewQuotation = () => {
  // Format date as "Thu 19 Sep, 2024"

  const formattedDate = getFormattedDate();

  // Get previous quotation number from localStorage
  const lastId = JSON.parse(localStorage.getItem("lastQuotationId")) || 1;

  // Generate new IDs
  const newCustomerId = `A-${400 + lastId}-${new Date().getFullYear()}`;

  const newQuotationNumber = `QTN${new Date().getFullYear()}${String(
    lastId
  ).padStart(3, "0")}`;

  // increment lastId for next quotation
  localStorage.setItem("lastQuotationId", JSON.stringify(lastId + 1));

  return {
    ...QuotationTemplate,
    date: formattedDate,
    cid: newCustomerId,
    qid: newQuotationNumber,
  };
};

function Quotation({ quotationToEdit, setQuotationToEdit, setActiveTab }) {
  //state lives here
  const [formData, setFormData] = useState({
    cname: "",
    caddress: ["", "", ""],
    heading: "",
    subHeading: "",
    job: "",
    amount: "",
    comments: "",
  });

  // State for quotation (hierarchical structure)
  const [quotation, setQuotation] = useState(() => {
    const saved = localStorage.getItem("firstQuotation");
    return saved ? JSON.parse(saved) : generateNewQuotation();
  });

  // selected row (heading, subheading, or job)
  const [selectedRow, setSelectedRow] = useState(null);
  // Save to localStorage whenever quotation changes

  //quotation to update

  useEffect(() => {
    if (quotationToEdit) {
      // console.log("Editing:", quotationToEdit);

      const jsonData = quotationToEdit.json_data || {};
      setFormData({
        cname: quotationToEdit.cname || "",
        caddress: jsonData.caddress || ["", "", ""],
        heading: "",
        subHeading: "",
        job: "",
        amount: "",
        comments: "",
      });

      setQuotation({
        ...jsonData, // full structure for table display
        cname: quotationToEdit.cname,
        qid: quotationToEdit.qid,
        cid: jsonData.cid,
        date: getFormattedDate(),
      });
    }
  }, [quotationToEdit]);

  useEffect(() => {
    localStorage.setItem("firstQuotation", JSON.stringify(quotation));
  }, [quotation]);

  // ---------------- Customer Info Save ----------------
  // Handle saving Customer Name + Address only

  const handleSaveCinfo = () => {
    const { cname, caddress } = formData;

    // Prevent saving empty values
    if (!cname.trim() && caddress.every((line) => line.trim() === "")) {
      alert("Please fill in customer name or address before saving.");
      return;
    }
    // Get previous quotation number from localStorage
    const lastId = JSON.parse(localStorage.getItem("lastQuotationId")) || 1;

    const updatedQuotation = produce(quotation, (draft) => {
      draft.cname = cname;
      draft.caddress = [...caddress];
      draft.date = quotation.date;
      draft.cid = quotation.cid;
      draft.qid = quotation.qid;
    });

    setQuotation(updatedQuotation);

    // Save next ID for next time
    localStorage.setItem("lastQuotationId", JSON.stringify(lastId + 1));

    setFormData((prev) => ({ ...prev, cname, caddress: ["", "", ""] }));
  };

  // ---------------- Heading/Job Save ----------------
  // Handle saving data into hierarchical structure
  const handleSave = () => {
    const { heading, subHeading, job, amount, comments } = formData;
    if (!heading) return alert("plz select a heading !!");

    // Use Immer to update quotation
    const updatedQuotation = produce(quotation, (draft) => {
      // Ensure headings array exists
      draft.headings = draft.headings || [];

      //Find or create Heading

      let headingObj = draft.headings.find((h) => h.headingTitle === heading);

      if (!headingObj) {
        headingObj = { headingTitle: heading, subHeadings: [] };
        draft.headings.push(headingObj);
      }

      //Find or create Subheading
      let subObj = null;
      if (subHeading) {
        subObj = headingObj.subHeadings.find(
          (s) => s.subHeadingTitle === subHeading
        );

        if (!subObj) {
          subObj = { subHeadingTitle: subHeading, jobs: [] };
          headingObj.subHeadings.push(subObj);
        }
      }
      // Add job to the subheading
      if (job && subObj) {
        let jobObj = subObj.jobs.find((j) => j.jobTitle === job);

        if (!jobObj) {
          jobObj = { jobTitle: job, amount, comments };
          subObj.jobs.push(jobObj);
        }
      }
    });

    //  Update state
    setQuotation(updatedQuotation);

    //  Reset form
    setFormData({
      ...formData,
      heading: "",
      subHeading: "",
      job: "",
      amount: "",
      comments: "",
    });
  };

  const [isEditing, setIsEditing] = useState(false);

  // ----------------  Select Row ----------------

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    setIsEditing(row.type !== ""); // editing state ON

    // Fill the form automatically
    if (row.type === "heading") {
      setFormData((prev) => ({
        ...prev,
        heading: row.headingTitle,
        subHeading: "",
        job: "",
        amount: "",
        comments: "",
      }));
    } else if (row.type === "subHeading") {
      setFormData((prev) => ({
        ...prev,
        heading: row.headingTitle,
        subHeading: row.subHeadingTitle,
        job: "",
        amount: "",
        comments: "",
      }));
    } else if (row.type === "job") {
      setFormData((prev) => ({
        ...prev,
        heading: row.headingTitle,
        subHeading: row.subHeadingTitle,
        job: row.jobTitle,
        amount: row.amount,
        comments: row.comments,
      }));
    }
  };

  // ---------------- Delete Selected ----------------

  const handleDeleteSelected = () => {
    if (!selectedRow) return alert("select a row first!");

    const updatedQuotation = produce(quotation, (draft) => {
      draft.headings = draft.headings
        .map((heading) => {
          if (
            selectedRow.type === "heading" &&
            heading.headingTitle === selectedRow.headingTitle
          ) {
            return null;
          }
          heading.subHeadings = heading.subHeadings
            .map((sub) => {
              if (
                selectedRow.type === "subHeading" &&
                sub.subHeadingTitle === selectedRow.subHeadingTitle
              ) {
                return null;
              }
              if (selectedRow.type === "job") {
                sub.jobs = sub.jobs.filter(
                  (j) => j.jobTitle !== selectedRow.jobTitle
                );
              }
              return sub;
            })
            .filter(Boolean);

          return heading;
        })
        .filter(Boolean);
    });

    setQuotation(updatedQuotation);
    setSelectedRow(null);
    setFormData({
      cname: "",
      caddress: ["", "", ""],
      heading: "",
      subHeading: "",
      job: "",
      amount: "",
      comments: "",
    });
  };

  const handleEdit = () => {
    if (!selectedRow) return alert("select a row to edit !!");

    if (selectedRow.type !== "job")
      return alert("Only job rows can be edited!");

    const updatedQuotation = produce(quotation, (draft) => {
      //edit heading

      const headingObj = draft.headings.find(
        (h) => h.headingTitle === selectedRow.headingTitle
      );

      if (headingObj) {
        const subObj = headingObj.subHeadings.find(
          (s) => s.subHeadingTitle === selectedRow.subHeadingTitle
        );

        if (subObj) {
          const jobObj = subObj.jobs.find(
            (j) => j.jobTitle === selectedRow.jobTitle
          );

          if (jobObj) {
            jobObj.jobTitle = formData.job;
            jobObj.amount = formData.amount;
            jobObj.comments = formData.comments;
          }
        }
      }
    });

    setQuotation(updatedQuotation);
    setSelectedRow(null);
    setIsEditing(false); //  unlock dropdowns
    setFormData({
      cname: "",
      caddress: ["", "", ""],
      heading: "",
      subHeading: "",
      job: "",
      amount: "",
      comments: "",
    });
  };

  //generating new quotation

  const handleNewQuotaton = () => {
    const emptyQuotation = generateNewQuotation();

    setFormData(emptyQuotation);
    setQuotation(emptyQuotation);
  };
  // inside App() — add this function above return
  const saveQuotation = async () => {
    console.log("SAVE CLICKED");
    try {
      // Basic validation
      if (!quotation.qid || !quotation.cname) {
        alert(
          "Please make sure Customer name and QID are present before saving."
        );
        return;
      }

      // Build payload: send qid, cname separately + full quotation JSON
      const payload = {
        qid: quotation.qid,
        cname: quotation.cname,
        jsonData: quotation,
      };

      const isEditingExisting = !!quotationToEdit;
      const endpoint = isEditingExisting
        ? "http://localhost/projects/gharwala_backend/updateQuotation.php"
        : "http://localhost/projects/gharwala_backend/saveQuotation.php";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert(
          isEditingExisting
            ? "Quotation updated successfully!"
            : "Quotation saved successfully!"
        );

        // optional: clear localStorage or keep draft
        localStorage.removeItem("firstQuotation");

        setQuotationToEdit(null);

        // Redirect to dashboard to view updated quotation
        setActiveTab("dashboard");
      } else {
        console.error(data);
        alert("Failed to save/update quotation. Check console for details.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network or server error while saving quotation.");
    }
  };

  return (
    <div className="App">
      <div className="content-container">
        {/* pass state + updater to form */}
        <Form
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onSaveCustomer={handleSaveCinfo}
          onDelete={handleDeleteSelected}
          selectedRow={selectedRow}
          onEdit={handleEdit}
          isEditing={isEditing}
          newQuotation={handleNewQuotaton}
          saveQuotation={saveQuotation}
        />

        {/* Pass state to Table */}
        <Table
          quotation={quotation}
          formData={formData}
          onSelectRow={handleSelectRow}
          selectedRow={selectedRow}
        />
      </div>
    </div>
  );
}

export default Quotation;
