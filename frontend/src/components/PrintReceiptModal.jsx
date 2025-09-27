import PrintableReceipt from "./PrintableReceipt";

const PrintReceiptModal = ({ receiptId, onClose, apiBase }) => {
  return (
    <PrintableReceipt
      receiptId={receiptId}
      onClose={onClose}
      apiBase={apiBase}
    />
  );
};

export default PrintReceiptModal;