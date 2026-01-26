import react from "react";
import logo from "./img/gharwalaInterior-logo2.svg";
function Table({ quotation, formData, onSelectRow, selectedRow }) {
  const data = quotation.json_data || quotation; //  supports both structures
  //Counter for headings
  let headingCounter = 0;
  const safeFormAddress = formData.caddress || [];
  const safeQuoteAddress = quotation.caddress || [];

  // Function to convert number to letter

  const getLetter = (num) => String.fromCharCode(65 + num);

  let serial = 1;

  // format amount
  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN");
  };

  //Calculate total directly from all job amounts
  const totalAmount =
    quotation.headings?.reduce((sum, heading) => {
      return (
        sum +
        heading.subHeadings?.reduce((subsum, sub) => {
          return (
            subsum +
            sub.jobs?.reduce(
              (jobSum, job) => jobSum + (Number(job.amount) || 0),
              0
            )
          );
        }, 0)
      );
    }, 0) || 0;

  // Safe references for preview
  const heading =
    quotation.headings.find((h) => h.headingTitle === formData.heading) || {};
  const subHeading =
    heading?.subHeadings?.find(
      (s) => s.subHeadingTitle === formData.subHeading
    ) || {};
  const jobs = subHeading?.jobs || [];

  return (
    <>
      <section className="estimate-invoice">
        <div className="quote">
          <div className="pdf-format">
            <div className="header">
              <img src={logo} alt="" />
              <div className="contact">
                <h3>Need Help With Interior ?</h3>
                <span>+91 888 999 1327</span>
                <span>hello@gharwalainterior.com</span>
              </div>
            </div>
            <div className="sub-header">
              <div className="client-detail">
                {/* Preview/saved  customer info */}
                <span>
                  Mr. /Ms. &nbsp;
                  {formData.cname || quotation.cname}
                </span>
                {/* Address block */}
                {safeFormAddress.some((line) => line.trim() !== "") ||
                !safeQuoteAddress.every((line) => line.trim() === "")
                  ? (safeFormAddress.some((line) => line.trim() !== "")
                      ? safeFormAddress
                      : safeQuoteAddress
                    )
                      .filter((line) => line.trim() !== "")
                      .map((line, index, arr) => (
                        <span key={index}>
                          {line}
                          {index < arr.length - 1 ? "," : ""}
                        </span>
                      ))
                  : null}
              </div>
              <div className="other-detail-title">
                <span>Date Issued :</span>
                <span>Customer Id :</span>
                <span>Quotation Number :</span>
              </div>
              <div className="other-detail-content">
                <span>{quotation.date}</span>
                <span>{quotation.cid}</span>
                <span>{quotation.qid}</span>
              </div>
            </div>
            <div className="subject">
              Subject :&nbsp; <span>Initial Quote for Home Interior</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Job / Description</th>
                  <th>Amount (₹)</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {/*table rows*/}
                {quotation.headings?.map((h) => (
                  <react.Fragment key={h.headingTitle}>
                    {/*heading Row */}
                    <tr
                      className={`category ${
                        selectedRow?.type === "heading" &&
                        selectedRow.headingTitle === h.headingTitle
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        onSelectRow({
                          type: "heading",
                          headingTitle: h.headingTitle,
                        })
                      }
                    >
                      <td>{getLetter(headingCounter++)}</td>
                      <td>{h.headingTitle}</td>
                      <td></td>
                      <td></td>
                    </tr>

                    {h.subHeadings?.map((s) => (
                      <react.Fragment key={s.subHeadingTitle}>
                        {/*subHeading Row */}
                        <tr
                          className={`subCategory ${
                            selectedRow?.type === "subHeading" &&
                            selectedRow.subHeadingTitle === s.subHeadingTitle
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            onSelectRow({
                              type: "subHeading",
                              headingTitle: h.headingTitle,
                              subHeadingTitle: s.subHeadingTitle,
                            })
                          }
                        >
                          <td>{"\u2022"}</td>
                          <td className="subCategory">
                            {s.subHeadingTitle} -{" "}
                          </td>
                          <td></td>
                          <td></td>
                        </tr>

                        {s.jobs?.map((j, i) => (
                          <tr
                            key={j.jobTitle}
                            className={`jobCategory ${
                              selectedRow?.type === "job" &&
                              selectedRow.jobTitle === j.jobTitle
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              onSelectRow({
                                type: "job",
                                headingTitle: h.headingTitle,
                                subHeadingTitle: s.subHeadingTitle,
                                jobTitle: j.jobTitle,
                                amount: j.amount,
                                comments: j.comments,
                              })
                            }
                          >
                            <td>{serial++}.</td>
                            <td>{j.jobTitle}</td>
                            <td>{formatAmount(j.amount)}</td>
                            <td>{j.comments}</td>
                          </tr>
                        ))}
                        <tr className="empty-space">
                          <td colSpan="4"></td>
                        </tr>
                      </react.Fragment>
                    ))}
                  </react.Fragment>
                ))}
                {/* Preview row */}
                <>
                  {/* Show Heading if exists */}
                  {formData.heading && !heading.headingTitle && (
                    <tr className="preview-row">
                      <td>{getLetter(headingCounter++)}</td>
                      <td>{formData.heading}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {/* Show subHeading if exists */}
                  {formData.subHeading && !subHeading.subHeadingTitle && (
                    <tr className="preview-row">
                      <td>{"\u2022"}</td>
                      <td>{formData.subHeading} - </td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                  {/* Show job.amt.comments if exists */}
                  {formData.job &&
                    !jobs.some((j) => j.jobTitle === formData.job) && (
                      <tr className="preview-row">
                        <td>{serial}</td>
                        <td>{formData.job}</td>
                        <td>{formatAmount(formData.amount)}</td>
                        <td>{formData.comments}</td>
                      </tr>
                    )}
                </>
                <tr className="tfoot">
                  <td colSpan="3">Total Estimated Amount</td>
                  <td> ₹ {formatAmount(totalAmount)}/-</td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
export default Table;
