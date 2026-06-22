import { useState } from "react";

import { importStudents } from "../services/StudentApi.ts";

import { toast } from "react-toastify";

import "../styles/importmodal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ImportStudentModal = ({ isOpen, onClose }: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }

    try {
      setLoading(true);

      const res = await importStudents(file);

      toast.success(`Imported ${res.data.successfulImports} students`);

      if (res.data.failedFile) {
        window.open(res.data.failedFile, "_blank");
      }

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Import Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="import-modal">
        <h2>Import Students</h2>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>

          <button onClick={handleImport} disabled={loading} className="import-btn">
            {loading ? "Uploading..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentModal;
