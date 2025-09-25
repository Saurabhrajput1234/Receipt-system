import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("form"); // 'form' or 'list'
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiptNo: "",
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

  // API base URL - use proxy in development, direct URL in production
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "http://localhost:5000/api"
      : "/api";

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
      
      // Format date as YYYY-MM-DD for input
      const formattedExpiryDate = expiryDate.toISOString().split('T')[0];
      updatedData.tokenExpiryDate = formattedExpiryDate;
    }

    setFormData(updatedData);
  };

  const resetForm = async () => {
    // Get the next receipt number
    const nextNumber = await fetchNextReceiptNumber();
    
    setFormData({
      receiptNo: nextNumber,
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
    setLoading(true);

    if (!formData.receiptNo.trim()) {
      alert("Receipt number is required!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/receipts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Receipt saved successfully!");
        await resetForm(); // Load next receipt number
        if (currentView === "list") fetchReceipts();
      } else {
        alert("Error saving receipt: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save receipt. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/receipts`);
      const result = await response.json();

      if (response.ok && result.success) {
        setReceipts(result.data);
      } else {
        alert("Failed to load receipts");
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchNextReceiptNumber = async () => {
    try {
      const response = await fetch(`${API_BASE}/receipts/next/number`);
      const result = await response.json();

      if (response.ok && result.success) {
        return result.data.nextReceiptNumber;
      } else {
        console.error("Failed to get next receipt number:", result.message);
        // Fallback: generate a simple incremental number
        return "1";
      }
    } catch (error) {
      console.error("Error fetching next receipt number:", error);
      // Fallback: generate a simple incremental number
      return "1";
    }
  };

  const loadNextReceiptNumber = async () => {
    const nextNumber = await fetchNextReceiptNumber();
    setFormData(prev => ({
      ...prev,
      receiptNo: nextNumber
    }));
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ Server connection successful!");
      } else {
        alert("❌ Server responded with error: " + result.message);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      alert(
        "❌ Failed to connect to server. Make sure backend is running on port 5000."
      );
    }
  };

  useEffect(() => {
    if (currentView === "list") {
      fetchReceipts();
    }
  }, [currentView]);

  // Load initial receipt number when component mounts
  useEffect(() => {
    loadNextReceiptNumber();
  }, []);

  const ReceiptsList = () => (
    <div className="receipts-list">
      <div className="list-header">
        <h2>All Receipts</h2>
        <div className="list-actions">
          <button onClick={fetchReceipts} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button onClick={() => setCurrentView("form")}>
            Create New Receipt
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading receipts...</div>
      ) : receipts.length === 0 ? (
        <div className="no-receipts">No receipts found</div>
      ) : (
        <div className="receipts-detailed-view">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="receipt-card">
              <div className="receipt-card-header">
                <h3>Receipt #{receipt.receiptNo}</h3>
                <span className="receipt-date">
                  {receipt.date
                    ? new Date(receipt.date).toLocaleDateString()
                    : "No date"}
                </span>
              </div>
              
              <div className="receipt-card-content">
                <div className="receipt-section">
                  <h4>Customer Information</h4>
                  <div className="receipt-details">
                    <div className="detail-row">
                      <span className="label">Customer Name:</span>
                      <span className="value">{receipt.fromName || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{receipt.relationType || "S/O"}:</span>
                      <span className="value">{receipt.relationName || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Address:</span>
                      <span className="value">{receipt.address || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Mobile:</span>
                      <span className="value">{receipt.mobile || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Token Expiry Date:</span>
                      <span className="value">
                        {receipt.tokenExpiryDate
                          ? new Date(receipt.tokenExpiryDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h4>Property Details</h4>
                  <div className="receipt-details">
                    <div className="detail-row">
                      <span className="label">Reference Name:</span>
                      <span className="value">{receipt.referenceName || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Site Name:</span>
                      <span className="value">{receipt.siteName || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Plot/Villa No:</span>
                      <span className="value">{receipt.plotVillaNo || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Plot Size:</span>
                      <span className="value">{receipt.plotSize || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Basic Rate:</span>
                      <span className="value">₹{receipt.basicRate || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h4>Payment Details</h4>
                  <div className="receipt-details">
                    <div className="detail-row">
                      <span className="label">Received Amount:</span>
                      <span className="value">{receipt.receivedAmount || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Cash:</span>
                      <span className="value">₹{receipt.cash || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Cheque:</span>
                      <span className="value">₹{receipt.cheque || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Cheque No:</span>
                      <span className="value">{receipt.chequeNo || "-"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">RTGS/NEFT:</span>
                      <span className="value">₹{receipt.rtgsNeft || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Other:</span>
                      <span className="value">₹{receipt.other || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Amount:</span>
                      <span className="value amount-highlight">₹{receipt.amount || 0}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Rest Amount:</span>
                      <span className="value">₹{receipt.restAmount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="receipt-section">
                  <h4>Record Information</h4>
                  <div className="receipt-details">
                    <div className="detail-row">
                      <span className="label">Created:</span>
                      <span className="value">
                        {new Date(receipt.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src="/logo.png" 
              alt="Subh Sankalp Estate Logo" 
              className="company-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="company-info">
            <h1>SUBH SANKALP ESTATE PVT. LTD.</h1>
            <p className="address">
              The Grover Square, 2nd Floor, Near Maruti Showroom,
              <br />
              Sec-49, Barohi, Gautam Budh Nagar.
            </p>
          </div>
        </div>

        <div className="nav-buttons">
          <button
            className={currentView === "form" ? "active" : ""}
            onClick={() => setCurrentView("form")}
          >
            Create Receipt
          </button>
          <button
            className={currentView === "list" ? "active" : ""}
            onClick={() => setCurrentView("list")}
          >
            View All Receipts
          </button>
          <button onClick={testConnection} className="test-btn">
            Test Connection
          </button>
        </div>
      </div>

      {currentView === "list" ? (
        <ReceiptsList />
      ) : (
        <div className="receipt-container">
          {/* Print-only top image */}
          <div className="print-top-image">
            <img 
              src="/top.jpg" 
              alt="Receipt Top Design" 
              className="receipt-top-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Print-only header */}
          <div className="print-only-header">
            <div className="print-header-content">
              <div className="print-logo-section">
                <img 
                  src="/logo.png" 
                  alt="Subh Sankalp Estate Logo" 
                  className="print-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="print-company-info">
                <h1>SUBH SANKALP ESTATE PVT. LTD.</h1>
                <h1>TOKEN RECEIPT</h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="receipt-form">
            {/* Receipt info */}
            <div className="receipt-info">
              <div className="receipt-row">
                <label>
                  Receipt No:
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
                  Date:
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
                    <span className="relation-label">{formData.relationType || "S/O"}:</span>
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
                      {formData.date && formData.tokenExpiryDate ? 
                        "(Auto: +7 days)" : 
                        "(Manual entry)"
                      }
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
                  {/* Payment methods with optional checkbox */}
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
                    booking (self, referral), not refunded.
                  </li>
                  <li>Cheque bounce charges ₹500/–.</li>
                  <li>
                    If client remains unresponsive, allotment will be canceled.
                  </li>
                </ul>
              </div>
              <div className="signature">
                <p>
                  <strong>SUBH SANKALP ESTATE PVT. LTD.</strong>
                </p>
                <div className="signature-box">
                  <p>(Authorised Signatory)</p>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : "Generate Receipt"}
              </button>
              <button
                type="button"
                className="print-btn"
                onClick={() => window.print()}
              >
                Print Receipt
              </button>
              <button
                type="button"
                className="reset-btn"
                onClick={resetForm}
              >
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
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

