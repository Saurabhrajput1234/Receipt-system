const ReceiptsList = ({ receipts, loading, onRefresh, onCreateNew }) => {
  const getReceiptTypeLabel = (type) => {
    switch (type) {
      case 'token': return 'Token';
      case 'banking': return 'Banking';
      case 'emi': return 'EMI';
      default: return 'Token'; // Default for existing receipts
    }
  };

  const getReceiptTypeColor = (type) => {
    switch (type) {
      case 'token': return '#007bff';
      case 'banking': return '#28a745';
      case 'emi': return '#ffc107';
      default: return '#007bff';
    }
  };

  return (
    <div className="receipts-list">
      <div className="list-header">
        <h2>All Receipts</h2>
        <div className="list-actions">
          <button onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button onClick={onCreateNew}>
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
                <div className="receipt-header-left">
                  <h3>Receipt #{receipt.receiptNo}</h3>
                  <span 
                    className="receipt-type-badge"
                    style={{ backgroundColor: getReceiptTypeColor(receipt.receiptType) }}
                  >
                    {getReceiptTypeLabel(receipt.receiptType)}
                  </span>
                </div>
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
};

export default ReceiptsList;