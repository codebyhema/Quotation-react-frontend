import { useState } from "react";

function Dheader({ onSortChange, searchTerm, setSearchTerm }) {
  const [showDropDown, setShowDropDown] = useState(false);

  const [activeSort, setActiveSort] = useState("New to Old");

  // All sort options in one array
  const sortOptions = ["New to Old", "Old to New", "A to Z"];

  const handleSortSelect = (option) => {
    setActiveSort(option);
    setShowDropDown(false);
    onSortChange(option);
  };
  return (
    <div className="Dheader">
      <input
        type="text"
        placeholder="Search by Name/Qid"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="sortOptions">
        <div onClick={() => setShowDropDown(!showDropDown)}>
          Sort by: <span className="activeSort">{activeSort}</span>
        </div>

        {showDropDown && (
          <div className="dropdown">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`dropdown-item ${
                  option === activeSort ? "selected " : ""
                }`}
                onClick={() => handleSortSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Dheader;
