import { useState, useEffect } from "react";

const ReceiptForm = ({ receiptType, onSubmit, loading, initialData = null, readOnly = false }) => {
  const [formData, setFormData] = useState(initialData || {
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
    chequeNo: "",
    rtgsNeft: "",
    amount: "",
    restAmount: "",
    cashChecked: false,
    chequeChecked: false,
  });

  // API base URL - use environment variable or fallback
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.VITE_NODE_ENV === "production"
      ? "http://localhost:5000/api"
      : "/api");

  const fetchNextReceiptNumber = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error("No authentication token found");
        return "1";
      }

      const response = await fetch(`${API_BASE}/receipts/next/number`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  // Function to convert number to words
  const numberToWords = (num) => {
    if (!num || isNaN(num)) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Lakh", "Crore"];

    const convertHundreds = (n) => {
      let result = "";
      if (n > 99) {
        result += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n > 19) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n > 9) {
        result += teens[n - 10] + " ";
        return result;
      }
      if (n > 0) {
        result += ones[n] + " ";
      }
      return result;
    };

    if (num === 0) return "Zero";

    let numStr = Math.floor(num).toString();
    let result = "";
    let groupIndex = 0;

    // Handle Indian numbering system (crores, lakhs, thousands)
    while (numStr.length > 0) {
      let groupSize = groupIndex === 0 ? 3 : 2; // First group is 3 digits, rest are 2
      if (groupIndex === 0 && numStr.length < 3) groupSize = numStr.length;
      if (groupIndex > 0 && numStr.length < 2) groupSize = numStr.length;

      let group = numStr.slice(-groupSize);
      numStr = numStr.slice(0, -groupSize);

      if (parseInt(group) > 0) {
        result =
          convertHundreds(parseInt(group)) +
          thousands[groupIndex] +
          " " +
          result;
      }
      groupIndex++;
    }

    return result.trim() + " Only";
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

    // Convert amount to words when amount is changed
    if (name === "amount" && value) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        updatedData.receivedAmount = numberToWords(numericValue);
      }
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
      chequeNo: "",
      rtgsNeft: "",
      amount: "",
      restAmount: "",
      cashChecked: false,
      chequeChecked: false,
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
            <p className="address">
            037UG, BUILDERS SCHEME,<br />
OMAXE ACRADE GOLF LINK-1, Alpha Greater Noida, Noida, Gautam <br />
Buddha Nagar, Uttar Pradesh - 201310
            </p>
            <br />

            <h1>{getReceiptTitle()}</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="receipt-form">
        {/* Receipt info */}
       <div className="receipt-info">
  <div className="receipt-row">
    <label className="receipt-no-label">
      Receipt No.
      <div className="receipt-no-container">
        <input
          type="text"
          name="receiptNo"
          value={formData.receiptNo}
          readOnly
          className="receipt-no-readonly"
        />
      </div>
    </label>

    <label className="date-label">
      Date
      <input 
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
      />
    </label>

    <label className="expiry-label">
      Token Expiry Date:
      <div className="expiry-date-container">
        <input
          type="date"
          name="tokenExpiryDate"
          value={formData.tokenExpiryDate}
          onChange={handleInputChange}
          className="expiry-date-input"
        />
        {/* <h3 className="expiry-note">
          {formData.date && formData.tokenExpiryDate
            ? "(Auto: +7 days)"
            : "(Manual entry)"}
        </h3> */}
      </div>
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
              Mobile Number:
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
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
            <label className="form-half">
              Reference Name:
              <input
                type="text"
                name="referenceName"
                value={formData.referenceName}
                onChange={handleInputChange}
                placeholder="Reference Name"
              />
            </label>

            <label className="form-half">
              Site Name:
              <select
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                className="site-select"
              >
                <option value="">Select Site</option>
                <option value="Hare H.K.T-2">Hare Krishna Township-Phase 2</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label >
              Plot No:
              <input className="plot-input"
                type="text"
                name="plotVillaNo"
                value={formData.plotVillaNo}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Plot Size Sq. (yd.):
              <input className="plot-input"
                type="text"
                name="plotSize"
                value={formData.plotSize}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Basic Rate:
              <input className="plot-input"
                type="text"
                name="basicRate"
                value={formData.basicRate}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>

        {/* Payment section */}
        <div className="payment-section">
          <div className="payment-grid">
            <div className="payment-left">
              <label>
                Amount (Rs.):
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </label>
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

            <div className="payment-middle"></div>

            <div className="payment-right">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="cashChecked"
                  onChange={handleInputChange}
                />
                Cash
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="chequeChecked"
                  onChange={handleInputChange}
                />
                Cheque
              </label>
              {formData.chequeChecked && (
                <label>
                  Cheque No:
                  <input
                    type="text"
                    name="chequeNo"
                    value={formData.chequeNo}
                    onChange={handleInputChange}
                    placeholder="Cheque Number"
                  />
                </label>
              )}
              <label>
                RTGS / NEFT:
                <input className="rtgs-input"
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

          {/* Print-only payment display */}
        <div className="print-payment-display">
  <div className="print-payment-row">
    <span>
      Other: <span className="underline-field">{formData.other}</span>
    </span>
    <span>
      Amount (Rs.): <span className="underline-field">{formData.amount}</span>
    </span>
    <span>
      Rest Amount (Rs.): <span className="underline-field">{formData.restAmount}</span>
    </span>
  </div>

<div className="payment-methods-row">
  <h3>Payment Methods:</h3>
   
  <span className="print-checkbox">
    <span className={formData.cashChecked ? "checked" : ""}></span> Cash
  </span>

  <span className="print-checkbox cheque-field">
    <span className={formData.chequeChecked ? "checked" : ""}></span> Cheque No:
    <span className="underline-field">{formData.chequeNo}</span>
  </span>
</div>

<div className="payment-methods-row">
  <span className="print-checkbox rtgs-field">
    <span className={formData.rtgsNeft?.trim() ? "checked" : ""}></span> RTGS/NEFT:
    <span className="underline-field">{formData.rtgsNeft}</span>
  </span>
</div>

</div>

        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="terms">
            <h4>Terms & Conditions</h4>
            <ul>
              <li>Token amount will be expire after 7 days.</li>
              <li>Refund applicable within 7 days only.</li>
              <li>
                After token expires,amount can be adjusted only in the next
                booking (Self,referral), not refunded.
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
              <pre>(Authorised Signatory)</pre>
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

      {/* Print-only bottom images */}
      <div className="print-bottom-section">
        <div style={{ marginTop: "140px" }} className="print-bottom-left">
          <img
            src="/back.jpg"
            alt="Receipt Bottom Design"
            className="receipt-bottom-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="print-bottom-right">
          <img
            src="/address.png"
            style={{ color: "black" }}
            alt="Address Information"
            className="receipt-address-img"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
