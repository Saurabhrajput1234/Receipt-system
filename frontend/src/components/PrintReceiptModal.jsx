import PrintableReceipt from "./PrintableReceipt";

const PrintReceiptModal = ({ receiptId, onClose }) => {
  return (
    <PrintableReceipt
      receiptId={receiptId}
      onClose={onClose}
    />
  );
};

export default PrintReceiptModal;