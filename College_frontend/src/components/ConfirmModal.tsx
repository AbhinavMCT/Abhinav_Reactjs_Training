import "../styles/confirmModal.css";

type Props = {
  isOpen: boolean;

  title?: string;

  message: string;

  onConfirm: () => void;

  onCancel: () => void;
};

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) => {

  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className="confirm-modal">

        <h3>
          {title || "Confirmation"}
        </h3>

        <p>{message}</p>

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-btn"
            onClick={onConfirm}
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;