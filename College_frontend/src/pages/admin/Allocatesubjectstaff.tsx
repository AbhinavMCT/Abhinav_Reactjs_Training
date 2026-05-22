import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getAllSubjectStaff, deleteSubjectStaff } from "../../services/SubjectStaffApi.ts";
import { SubjectStaffPayload } from '../../types/Datatypes.ts';

interface AllocatedStaffSubject extends SubjectStaffPayload {
    id?: number;
    staff_name?: string;
    subject_name?: string;
}

const AllocateSubjectStaff = () => {
    const [allocations, setAllocations] = useState<AllocatedStaffSubject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadAllocated = async () => {
            try {
                const res = await getAllSubjectStaff();
                if (res && Array.isArray(res.data)) {
                    setAllocations(res.data);
                } else if (Array.isArray(res)) {
                    setAllocations(res);
                } else {
                    setAllocations([]);
                }
            } catch (error) {
                console.error("Failed to load Data", error);
                setAllocations([]);
            } finally {
                setLoading(false);
            }
        };
        loadAllocated();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this allocation assignment?"
        );

        if (!confirmDelete) return;
        try {
            await deleteSubjectStaff(id);

            setAllocations((prev) => prev.filter((data) => data.id !== id));
            alert("Deleted successfully");
        } catch (error) {
            console.error("Error deleting allocated:", error);
            alert("Failed to delete allocation assignment.");
        }
    };

    return (
        <div className="student-management-container">
            <div className='management-header'>
                <h2>Subject Staff Allocation Management</h2>
                <Link to="/subjectstaff/add" className="create-btn">
                    + Allocate New
                </Link>
            </div>
            <div className='table-container'>
                {loading ? (
                    <p>Loading Allocated Staff and Subject matrices...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Staff Name</th>
                                <th>Subject Name</th>
                                <th>Action Rows</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocations.length > 0 ? (
                                allocations.map((data, index) => {
                                    const rowKey = `alloc-${data.id || index}`;
                                    return (
                                        <tr key={rowKey}>
                                            <td>{data.id ?? "N/A"}</td>
                                            <td>{data.staff_name ?? `Staff #${data.staff_id}`}</td>
                                            <td>{data.subject_name ?? `Subject #${data.subject_id}`}</td>
                                            <td className='action-button'>
                                                <Link to={`/subjectstaff/edit/${data.id}`} className='edit-btn'>
                                                    Edit
                                                </Link>
                                                <button 
                                                    className='delete-btn' 
                                                    onClick={() => {
                                                        if (data.id !== undefined) {
                                                            handleDelete(data.id);
                                                        } else {
                                                            alert("Cannot delete an item lacking a unique primary record key database ID.");
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AllocateSubjectStaff;