import { useState, useEffect } from "react";

const ReceiptForm = ({ receiptType, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    receiptNo: "",
    receiptType: receiptType || "token",
    date: "",
    fromName: "",
    relationType: "S/O",
    relationName: "",
    address: "",
    mobile: "",
    tokenExpiryDate: "",
    receivedAmount: "",
    referenceName: "",
    siteName: "",
    plotVillaNo: "",
    plotSize: "",
    basicRate: "",
    other: "",
    cash: "",
    cheque: "",
    rtgsNeft: "",
    amount: "",
    restAmount: "",
  });

  // API base URL - use environment variable or fallback
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.VITE_NODE_ENV === "production"
      ? "http://localhost:5000/api"
      : "/api");

  const fetchNextReceiptNumber = async () => {
    try {
      const response = await fetch(`${API_BASE}/receipts/next/number`);
      const result = await response.json();

      if (response.ok && result.success) {
        return result.data.nextReceiptNumber;
      } else {
        console.error("Failed to get next receipt number:", result.message);
        return "1";
      }
    } catch (error) {
      console.error("Error fetching next receipt number:", error);
      return "1";
    }
  };

  const loadNextReceiptNumber = async () => {
    const nextNumber = await fetchNextReceiptNumber();
    setFormData((prev) => ({
      ...prev,
      receiptNo: nextNumber,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let updatedData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-calculate token expiry date when date is changed
    if (name === "date" && value) {
      const selectedDate = new Date(value);
      const expiryDate = new Date(selectedDate);
      expiryDate.setDate(selectedDate.getDate() + 7);

      const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
      updatedData.tokenExpiryDate = formattedExpiryDate;
    }

    setFormData(updatedData);
  };

  const resetForm = async () => {
    const nextNumber = await fetchNextReceiptNumber();

    setFormData({
      receiptNo: nextNumber,
      receiptType: receiptType || "token",
      date: "",
      fromName: "",
      relationType: "S/O",
      relationName: "",
      address: "",
      mobile: "",
      tokenExpiryDate: "",
      receivedAmount: "",
      referenceName: "",
      siteName: "",
      plotVillaNo: "",
      plotSize: "",
      basicRate: "",
      other: "",
      cash: "",
      cheque: "",
      rtgsNeft: "",
      amount: "",
      restAmount: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.receiptNo.trim()) {
      alert("Receipt number is required!");
      return;
    }

    const receiptDataWithType = {
      ...formData,
      receiptType: receiptType,
    };

    const success = await onSubmit(receiptDataWithType);
    if (success) {
      await resetForm();
    }
  };

  // Load initial receipt number when component mounts
  useEffect(() => {
    loadNextReceiptNumber();
  }, []);

  const getReceiptTitle = () => {
    switch (receiptType) {
      case "token":
        return "TOKEN RECEIPT";
      case "banking":
        return "BANKING RECEIPT";
      case "emi":
        return "EMI RECEIPT";
      default:
        return "RECEIPT";
    }
  };

  return (
    <div className="receipt-container">
      {/* Print-only top image */}
      <div className="print-top-image">
        <img
          src="/top.jpg"
          alt="Receipt Top Design"
          className="receipt-top-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Print-only header */}
      <div className="print-only-header">
        <div className="print-header-content">
          <div className="print-logo-section">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="print-logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="print-company-info">
            <h1>
              {import.meta.env.VITE_APP_NAME || "SUBH SANKALP ESTATE PVT. LTD."}
            </h1>
            <h1>{getReceiptTitle()}</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="receipt-form">
        {/* Receipt info */}
        <div className="receipt-info">
          <div className="receipt-row">
            <label>
              Receipt No.
              <div className="receipt-no-container">
                <input
                  type="text"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleInputChange}
                />
                {/* <button
                  type="button"
                  className="refresh-receipt-btn"
                  onClick={loadNextReceiptNumber}
                  title="Get next receipt number"
                >
                  🔄
                </button> */}
              </div>
            </label>
            <label>
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>

        {/* Customer info */}
        <div className="customer-info">
          <div className="form-row">
            <label>
              Customer Name:
              <input
                type="text"
                name="fromName"
                value={formData.fromName}
                onChange={handleInputChange}
                placeholder="Customer Name"
              />
            </label>
            <label>
              <div className="relation-label-container">
                <select
                  name="relationType"
                  value={formData.relationType || "S/O"}
                  onChange={handleInputChange}
                  className="relation-type-button"
                >
                  <option value="S/O">S/O</option>
                  <option value="D/O">D/O</option>
                  <option value="W/O">W/O</option>
                </select>
                <span className="relation-label">
                  {formData.relationType || "S/O"}:
                </span>
              </div>
              <input
                type="text"
                name="relationName"
                value={formData.relationName}
                onChange={handleInputChange}
                placeholder="Father/Husband Name"
                className="relation-name-input"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Mobile:
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Token Expiry Date:
              <div className="expiry-date-container">
                <input
                  type="date"
                  name="tokenExpiryDate"
                  value={formData.tokenExpiryDate}
                  onChange={handleInputChange}
                  className="expiry-date-input"
                />
                <span className="expiry-note">
                  {formData.date && formData.tokenExpiryDate
                    ? "(Auto: +7 days)"
                    : "(Manual entry)"}
                </span>
              </div>
            </label>
          </div>
          <div className="form-row">
            <label>
              Received sum of Rupees:
              <input
                type="text"
                name="receivedAmount"
                value={formData.receivedAmount}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Reference Name:
              <input
                type="text"
                name="referenceName"
                value={formData.referenceName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Site Name:
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>

        {/* Payment section */}
        <div className="payment-section">
          <h3>Payment Mode:</h3>
          <div className="payment-grid">
            <div className="payment-left">
              <label>
                Plot:
                <input
                  type="text"
                  name="plotVillaNo"
                  value={formData.plotVillaNo}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Plot Size Sq. (yd.):
                <input
                  type="text"
                  name="plotSize"
                  value={formData.plotSize}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Basic Rate:
                <input
                  type="text"
                  name="basicRate"
                  value={formData.basicRate}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Amount (Rs.):
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="payment-middle">
              <label>
                Other:
                <input
                  type="text"
                  name="other"
                  value={formData.other}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="payment-right">
              <label>
                <input
                  type="checkbox"
                  name="cashChecked"
                  onChange={handleInputChange}
                />
                Cash:
                <input
                  type="text"
                  name="cash"
                  value={formData.cash}
                  onChange={handleInputChange}
                  placeholder="Amount"
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  name="chequeChecked"
                  onChange={handleInputChange}
                />
                Cheque:
                <input
                  type="text"
                  name="cheque"
                  value={formData.cheque}
                  onChange={handleInputChange}
                  placeholder="Amount"
                />
              </label>
              <label>
                RTGS / NEFT:
                <input
                  type="text"
                  name="rtgsNeft"
                  value={formData.rtgsNeft}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Rest Amount (Rs.):
                <input
                  type="text"
                  name="restAmount"
                  value={formData.restAmount}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="terms">
            <h4>Terms & Conditions</h4>
            <ul>
              <li>Token amount is subject to payment realization.</li>
              <li>Refund applicable only within 7 days of Token.</li>
              <li>
                Post 7 days, booking amount can be adjusted only in the next
                booking (self booking , referral explanatory), not refunded.
              </li>
              <li>Cheque bounce charges ₹500/–.</li>
              <li>
                If client remains unresponsive, allotment will be canceled.
              </li>
            </ul>
          </div>
          <div className="signature">
            <p>
              <strong>
                {import.meta.env.VITE_APP_NAME ||
                  "SUBH SANKALP ESTATE PVT. LTD."}
              </strong>
            </p>
            <div className="signature-box">
              <p>(Authorised Signatory)</p>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : `Generate ${getReceiptTitle()}`}
          </button>
          <button
            type="button"
            className="print-btn"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
          <button type="button" className="reset-btn" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </form>

      {/* Print-only bottom image */}
      <div className="print-bottom-image">
        <img
          src="/back.jpg"
          alt="Receipt Bottom Design"
          className="receipt-bottom-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    </div>
  );
};

export default ReceiptForm;
