import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  getStudentAssignments,
  submitAssignment,
} from "../../services/AssignmentApi.ts";
import { Assignment } from "../../types/Datatypes.ts";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import "../../styles/assignment/viewassignments.css";


const ViewAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [submittedMap, setSubmittedMap] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await getStudentAssignments();
        setAssignments(res.data);

        const initialMap: Record<number, string> = {};
        res.data.forEach((a: Assignment) => {
          if (a.status === "SUBMITTED" || a.status === "LATE") {
            initialMap[a.id] = a.status;
          }
        });
        setSubmittedMap(initialMap);
      } catch {
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const getStatusBadge = (endDate: string, id?: number) => {
    if (id !== undefined && id in submittedMap) {
      const status = submittedMap[id];
      if (status === "LATE") {
        return { label: "Late", className: "badge badge--late" };
      }
      return { label: "Submitted", className: "badge badge--submitted" };
    }

    const due = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0)
      return { label: "Overdue", className: "badge badge--overdue" };
    if (diffDays <= 2)
      return { label: `Due in ${diffDays}d`, className: "badge badge--urgent" };
    return { label: "Upcoming", className: "badge badge--upcoming" };
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !selectedAssignment) return;

    setSubmitting(true);
    try {
      const res = await submitAssignment(selectedAssignment.id, file);
      toast.success("Assignment submitted successfully!");

      setSubmittedMap((prev) => ({
        ...prev,
        [selectedAssignment.id]: res.data.status,
      }));

      setSelectedAssignment(null);
      setFile(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setFile(null);
  };

  const dropzoneClass = [
    "va-dropzone",
    dragOver && "va-dropzone--active",
    file && "va-dropzone--has-file",
  ]
    .filter(Boolean)
    .join(" ");

  const filteredAssignments = assignments.filter(
    (a) =>
      a.assignment_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.staff_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: Column<Assignment>[] = [
    {
      title: "Assignment Name",
      key: "assignment_name",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Subject",
      key: "subject_name",
    },
    {
      title: "Staff",
      key: "staff_name",
    },
    {
      title: "Start Date",
      key: "start_date",
      render: (value) => (value ? formatDate(value as string) : "N/A"),
    },
    {
      title: "Due Date",
      key: "end_date",
      render: (value) => (value ? formatDate(value as string) : "N/A"),
    },
    {
      title: "Status",
      key: "status",
      render: (value, row) => {
        const badge = getStatusBadge(value as string, (row as Assignment).id);
        return <span className={badge.className}>{badge.label}</span>;
      },
    },
    {
      title: "Action",
      key: "id",
      render: (value, row) => {
        const isSubmitted = (value as number) in submittedMap;
        const submittedStatus = submittedMap[value as number];
        return (
          <button
            className="create-btn"
            onClick={() =>
              !isSubmitted && setSelectedAssignment(row as Assignment)
            }
            disabled={isSubmitted}
            style={{
              opacity: isSubmitted ? 0.5 : 1,
              cursor: isSubmitted ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitted
              ? submittedStatus === "LATE"
                ? "Submitted Late"
                : "Submitted"
              : "Submit"}
          </button>
        );
      },
    },
  ];

  return (
    <div className="assignment-container">
      <div className="management-header">
        <h2>My Assignments</h2>
        <Breadcrumbs />
      </div>

      <div className="table-actions">
        <CommonSearch
          search={search}
          setSearch={setSearch}
          placeholder="Search Assignments..."
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading Assignments...</p>
        ) : (
          <CommonTable data={filteredAssignments} columns={columns} />
        )}
      </div>

      {selectedAssignment && (
  <div className="popup-sheet">
    <div className="popup-sheet__backdrop" onClick={closeModal} />

    <div className="popup-sheet__panel">
      {/* Handle bar */}
      <div className="popup-sheet__handle" />

      {/* Header */}
      <div className="popup-sheet__header">
        <div className="popup-sheet__header-info">
          <span className="popup-sheet__label">Submitting</span>
          <h3 className="popup-sheet__title">
            {selectedAssignment.assignment_name}
          </h3>
        </div>
        <button className="popup-sheet__close" onClick={closeModal}>✕</button>
      </div>

      {/* Meta row */}
      <div className="popup-sheet__meta">
        <div className="popup-sheet__meta-item">
          <span className="popup-sheet__meta-label">Subject</span>
          <span className="popup-sheet__meta-value">
            {selectedAssignment.subject_name}
          </span>
        </div>
        <div className="popup-sheet__meta-divider" />
        <div className="popup-sheet__meta-item">
          <span className="popup-sheet__meta-label">Due</span>
          <span className="popup-sheet__meta-value">
            {formatDate(selectedAssignment.end_date)}
          </span>
        </div>
        <div className="popup-sheet__meta-divider" />
        <div className="popup-sheet__meta-item">
          <span className="popup-sheet__meta-label">Status</span>
          <span
            className={
              getStatusBadge(
                selectedAssignment.end_date,
                selectedAssignment.id,
              ).className
            }
          >
            {getStatusBadge(selectedAssignment.end_date, selectedAssignment.id).label}
          </span>
        </div>
      </div>

      {/* Dropzone */}
      <div
        className={dropzoneClass}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.zip"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {file ? (
          <div className="va-dropzone__file">
            <span className="va-dropzone__file-icon">📄</span>
            <div>
              <p className="va-dropzone__file-name">{file.name}</p>
              <p className="va-dropzone__file-size">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              className="va-dropzone__remove"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="va-dropzone__prompt">
            <span className="va-dropzone__icon">📁</span>
            <p className="va-dropzone__text">Drag & drop your file here</p>
            <p className="va-dropzone__hint">
              or click to browse — PDF, DOC, DOCX, ZIP
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="popup-sheet__actions">
        <button className="popup-sheet__cancel" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="popup-sheet__confirm"
          onClick={handleSubmit}
          disabled={!file || submitting}
        >
          {submitting ? (
            <>
              <span className="popup-sheet__spinner" /> Submitting…
            </>
          ) : (
            "Submit Assignment"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ViewAssignments;
