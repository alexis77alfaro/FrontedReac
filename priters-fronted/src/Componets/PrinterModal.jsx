function PrinterModal({ isOpen, closeModal }) {
    return (
      <div className={isOpen ? 'modal open' : 'modal'}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>Modal Content</h2>
          <p>Some text in the Modal..</p>
        </div>
      </div>
    );
  }
  


export default PrinterModal;
