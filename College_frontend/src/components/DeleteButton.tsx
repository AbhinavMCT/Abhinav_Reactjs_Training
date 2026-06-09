import "../styles/actionbuttons.css";

type DeleteButtonProps = {
  id?: number;
  onDelete: (id: number) => void;
};

const DeleteButton = ({
  id,
  onDelete,
}: DeleteButtonProps) => {
  return (
    <button
      className="delete-btn"
      onClick={() => {
        if (id) {
          onDelete(id);
        } else {
          alert(
            "Cannot delete an item lacking a unique database record key."
          );
        }
      }}
    >
      Delete
    </button>
  );
};

export default DeleteButton;