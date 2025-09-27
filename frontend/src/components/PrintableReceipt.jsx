import { useState, useEffect } from "react";

const PrintableReceipt = ({ receiptId, onClose }) => {
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.VITE_NODE_ENV === "production"
      ? "http://localhost:5000/api"
      : "/api");

  // Function to convert number to words (same as ReceiptForm)
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

    while (numStr.length > 0) {
      let groupSize = groupIndex === 0 ? 3 : 2;
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

  // Fetch receipt data
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/receipts/${receiptId}`);
        const result = await response.json();

        if (response.ok && result.success) {
          setReceiptData(result.data);
        } else {
          setError(result.message || "Failed to fetch receipt");
        }
      } catch (err) {
        setError("Error fetching receipt: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (receiptId) {
      fetchReceipt();
    }
  }, [receiptId, API_BASE]);

  const getReceiptTitle = () => {
    if (!receiptData) return "RECEIPT";
    switch (receiptData.receiptType) {
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="print-modal">
        <div className="print-modal-content">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="print-modal">
        <div className="print-modal-content">
          <p>Error: {error}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="print-modal">
        <div className="print-modal-content">
          <p>Receipt not found</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="print-modal">
      <div className="print-modal-content">
        {/* Print controls - hidden in print */}
        <div className="print-controls">
          <button onClick={handlePrint} className="print-btn">
            Print Receipt
          </button>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>

        {/* Receipt content - same structure as ReceiptForm */}
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
                  {import.meta.env.VITE_APP_NAME ||
                    "SUBH SANKALP ESTATE PVT. LTD."}
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

          {/* Receipt info */}
          <div className="receipt-info">
            <div className="receipt-row">
              <label>
                Receipt No.
                <input
                  type="text"
                  value={receiptData.receiptNo}
                  readOnly
                  className="receipt-no-readonly"
                />
              </label>
              <label>
                Date
                <input type="date" value={receiptData.date} readOnly />
              </label>
              <label>
                Token Expiry Date:
                <input
                  type="date"
                  value={receiptData.tokenExpiryDate}
                  readOnly
                />
              </label>
            </div>
          </div>

          {/* Customer info */}
          <div className="customer-info">
            <div className="form-row">
              <label>
                Customer Name:
                <input type="text" value={receiptData.fromName} readOnly />
              </label>
              <label>
                <div className="relation-label-container">
                  <span className="relation-label">
                    {receiptData.relationType || "S/O"}:
                  </span>
                </div>
                <input type="text" value={receiptData.relationName} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Address:
                <input type="text" value={receiptData.address} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Mobile:
                <input type="tel" value={receiptData.mobile} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Received sum of Rupees:
                <input
                  type="text"
                  value={
                    receiptData.receivedAmount ||
                    numberToWords(receiptData.amount)
                  }
                  readOnly
                />
              </label>
            </div>
            <div className="form-row">
              <label className="form-half">
                Reference Name:
                <input type="text" value={receiptData.referenceName} readOnly />
              </label>
              <label className="form-half">
                Site Name:
                <input type="text" value={receiptData.siteName} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Plot No:
                <input type="text" value={receiptData.plotVillaNo} readOnly />
              </label>
              <label>
                Plot Size Sq. (yd.):
                <input type="text" value={receiptData.plotSize} readOnly />
              </label>
              <label>
                Basic Rate:
                <input type="text" value={receiptData.basicRate} readOnly />
              </label>
            </div>
          </div>

          {/* Print-only payment display */}
          <div className="print-payment-display">
            <div className="print-payment-row">
              <span>Other: {receiptData.other || "___________"}</span>
              <span>Amount (Rs.): {receiptData.amount || "___________"}</span>
              <span>
                Rest Amount (Rs.): {receiptData.restAmount || "___________"}
              </span>
            </div>
            <div className="print-payment-methods">
              <span>Payment Methods:</span>
              <div className="payment-methods-list">
                <span className="payment-method-item">
                  <span className="large-checkbox">
                    {receiptData.cashChecked ? "☑" : "☐"}
                  </span>
                  Cash
                </span>
                <span className="payment-method-item">
                  <span className="large-checkbox">
                    {receiptData.chequeChecked ? "☑" : "☐"}
                  </span>
                  Cheque{" "}
                  {receiptData.chequeNo ? `(No: ${receiptData.chequeNo})` : ""}
                </span>
               
              </div>
              <div>
                 <span className="payment-method-item">
                  <span className="large-checkbox">
                    {receiptData.rtgsNeft &&
                    receiptData.rtgsNeft.toString().trim() !== ""
                      ? "☑"
                      : "☐"}
                  </span>
                  RTGS/NEFT: {receiptData.rtgsNeft || "___________"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-section">
            <div className="terms">
              <h4>Terms & Conditions</h4>
              <ul>
                <li>Token amount will be expire after 7 days</li>
                <li>Refund applicable within 7 days only</li>
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
                <p>(Authorised Signatory)</p>
              </div>
            </div>
          </div>

          {/* Print-only bottom images */}
          <div className="print-bottom-section">
            <div style={{ marginTop: "30px" }} className="print-bottom-left">
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
                alt="Address Information"
                className="receipt-address-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
