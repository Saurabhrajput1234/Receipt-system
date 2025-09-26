import { useState, useEffect } from "react";
import "./App.css";
import ReceiptForm from "./components/ReceiptForm";
import ReceiptsList from "./components/ReceiptsList";
import PrintReceiptModal from "./components/PrintReceiptModal";

function App() {
  const [currentView, setCurrentView] = useState("form"); // 'form' or 'list'
  const [currentReceiptType, setCurrentReceiptType] = useState("token"); // 'token', 'banking', 'emi'
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printReceiptId, setPrintReceiptId] = useState(null);

  // API base URL - use environment variable or fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.VITE_NODE_ENV === "production"
      ? "http://localhost:5000/api"
      : "/api");

  const handleSubmit = async (receiptData) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/receipts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiptData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("Receipt saved successfully!");
        if (currentView === "list") fetchReceipts();
        return true;
      } else {
        alert("Error saving receipt: " + (result.message || "Unknown error"));
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save receipt. Please check if the server is running.");
      return false;
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

  const getReceiptTypeLabel = (type) => {
    switch (type) {
      case 'token': return 'Token Receipt';
      case 'banking': return 'Banking Receipt';
      case 'emi': return 'EMI Receipt';
      default: return 'Token Receipt';
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="company-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="company-info">
            <h1>{import.meta.env.VITE_APP_NAME || "SUBH SANKALP ESTATE PVT. LTD."}</h1>
            <p className="address">
              The Grover Square, 2nd Floor, Near Maruti Showroom,
              <br />
              Sec-49, Barohi, Gautam Budh Nagar.
            </p>
          </div>
        </div>

        <div className="nav-buttons">
          {/* Receipt Type Selection */}
          <div className="receipt-type-selector">
            <label>Receipt Type:</label>
            <select
              value={currentReceiptType}
              onChange={(e) => setCurrentReceiptType(e.target.value)}
              className="receipt-type-dropdown"
            >
              <option value="token">Token Receipt</option>
              <option value="banking">Banking Receipt</option>
              <option value="emi">EMI Receipt</option>
            </select>
          </div>

          {/* View Navigation */}
          <button
            className={currentView === "form" ? "active" : ""}
            onClick={() => setCurrentView("form")}
          >
            Create {getReceiptTypeLabel(currentReceiptType)}
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
        <ReceiptsList 
          receipts={receipts}
          loading={loading}
          onRefresh={fetchReceipts}
          onCreateNew={() => setCurrentView("form")}
          onPrintReceipt={(receiptId) => setPrintReceiptId(receiptId)}
        />
      ) : (
        <ReceiptForm 
          receiptType={currentReceiptType}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      {/* Print Modal */}
      {printReceiptId && (
        <PrintReceiptModal
          receiptId={printReceiptId}
          onClose={() => setPrintReceiptId(null)}
        />
      )}
    </div>
  );
}

export default App;