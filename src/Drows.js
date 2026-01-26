function Drows({ cname, qid, data, onView, onUpdate, onDelete, match }) {
  // helper function to shorten text
  const getShortText = (text, wordLimit = 3) => {
    // If the incoming data is an object, convert it to a readable string first
    if (typeof text === "object" && text !== null) {
      try {
        text = JSON.stringify(text); // convert object to string
      } catch (err) {
        return ""; // fail-safe
      }
    }
    if (!text || typeof text !== "string") return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  return (
    <div className={`dashboardRows ${match ? "highlight" : ""}`}>
      <div className="qInfo">
        <span className="cname">{cname}</span>
        <span className="qid">{qid}</span>
        <span className="data">{getShortText(data)}</span>
      </div>
      <div className="actionsButtons">
        <button className="view" onClick={onView}>
          View
        </button>
        <button className="update" onClick={onUpdate}>
          Update
        </button>
        <button className="delete" onClick={onDelete}>
          🗑️
        </button>
      </div>
    </div>
  );
}
export default Drows;
