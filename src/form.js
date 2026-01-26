import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function Form({
  formData,
  setFormData,
  onSave,
  onSaveCustomer,
  onDelete,
  selectedRow,
  onEdit,
  newQuotation,
  saveQuotation,
}) {
  const [activeForm, setActiveForm] = useState("customer");

  const [dropdownOptions, setDropdownOptions] = useState({});

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const res = await fetch("/dropdownoptions.json");
        const data = await res.json();
        setDropdownOptions(data);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    loadDropdownData();
  }, []);

  const toggleForm = () => {
    setActiveForm(activeForm === "customer" ? "job" : "customer");
  };
  //  Helper to get comment options safely
  const getComments = () => {
    try {
      return (
        dropdownOptions?.[formData.heading]?.[formData.subHeading]?.[
          formData.job
        ] || []
      );
    } catch (e) {
      return [];
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {/* -------- Customer Name & Address -------- */}
      {activeForm === "customer" && (
        <div className="formSide" id="customer">
          <label>Customer Name:</label>
          <input
            type="text"
            placeholder="Write Customer Name"
            value={formData.cname}
            onChange={(e) =>
              setFormData({ ...formData, cname: e.target.value })
            }
          />
          <label>Address Line 1:</label>
          <input
            type="text"
            placeholder="Write address"
            value={formData.caddress[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                caddress: [
                  e.target.value,
                  formData.caddress[1],
                  formData.caddress[2],
                ],
              })
            }
          />
          <label>Address Line 2:</label>
          <input
            type="text"
            placeholder="Write address"
            value={formData.caddress[1]}
            onChange={(e) =>
              setFormData({
                ...formData,
                caddress: [
                  formData.caddress[0],
                  e.target.value,
                  formData.caddress[2],
                ],
              })
            }
          />
          <label>Address Line 3:</label>
          <input
            type="text"
            value={formData.caddress[2]}
            placeholder="Write address"
            onChange={(e) =>
              setFormData({
                ...formData,
                caddress: [
                  formData.caddress[0],
                  formData.caddress[1],
                  e.target.value,
                ],
              })
            }
          />
          <div className="button-container">
            <button
              type="button"
              className="saveButton "
              onClick={onSaveCustomer}
            >
              Save Info
            </button>
            <button type="button" className="toggleButton" onClick={toggleForm}>
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
      {/* -------- Heading/SubHeading/Job -------- */}
      {activeForm === "job" && (
        <div className="formSide">
          {/* -------- HEADING DROPDOWN -------- */}
          <label>Heading:</label>
          <select
            value={formData.heading}
            disabled={
              selectedRow?.type === "heading" ||
              selectedRow?.type === "subHeading" ||
              selectedRow?.type === "job"
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                heading: e.target.value,
                subHeading: "",
              })
            }
          >
            <option value="">Select Heading </option>
            {Object.keys(dropdownOptions).map((heading) => (
              <option key={heading} value={heading}>
                {heading}
              </option>
            ))}
          </select>
          {/* -------- SUBHEADING DROPDOWN -------- */}
          <label>Sub-Heading:</label>
          <select
            value={formData.subHeading}
            disabled={
              !formData.heading ||
              selectedRow?.type === "heading" ||
              selectedRow?.type === "subHeading" ||
              selectedRow?.type === "job"
            }
            onChange={(e) =>
              setFormData({ ...formData, subHeading: e.target.value })
            }
          >
            <option value="">Select Subheading</option>
            {formData.heading &&
              Object.keys(dropdownOptions[formData.heading]).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
          {/* -------- JOB -------- */}
          <label>Job:</label>
          <select
            value={formData.job}
            onChange={(e) => setFormData({ ...formData, job: e.target.value })}
            disabled={
              !formData.subHeading ||
              (selectedRow && selectedRow?.type !== "job")
            } //  only editable when job selected
          >
            <option value="">Select Job</option>
            {formData.heading &&
              formData.subHeading &&
              Object.keys(
                dropdownOptions[formData.heading][formData.subHeading]
              ).map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
          </select>

          {/* -------- AMOUNT -------- */}
          <label>Amount:</label>
          <input
            type="text"
            placeholder="Write Amount"
            value={formData.amount}
            disabled={!formData.job}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          {/* -------- COMMENTS -------- */}
          <label>Comments:</label>
          <select
            value={formData.comments}
            disabled={!formData.job}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          >
            <option value="">Select Comment</option>
            {getComments().map((comment) => (
              <option key={comment} value={comment}>
                {comment}
              </option>
            ))}
          </select>

          <div className="button-container">
            <button type="button" className="deleteButton " onClick={onDelete}>
              Delete Row
            </button>
            <button
              type="button"
              className="editButton "
              onClick={onEdit}
              disabled={selectedRow?.type !== "job"}
            >
              Edit Row
            </button>
            <button
              type="button"
              className="saveButton "
              disabled={!!selectedRow}
              onClick={onSave}
            >
              Save Row
            </button>
            <button type="button" className="toggleButton" onClick={toggleForm}>
              <FaArrowLeft />
            </button>
          </div>
        </div>
      )}
      <div className="allBtn">
        <button type="button" onClick={newQuotation} className="newQ">
          New Quotation
        </button>
        <button type="button" onClick={saveQuotation} className="saveQ">
          Save Quotation
        </button>
        <button type="button" className="printQ" onClick={() => window.print()}>
          Print PDF
        </button>
      </div>
    </form>
  );
}
export default Form;
