import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createSubjectStaff } from '../../services/SubjectStaffApi.ts';
import { getAllSubjects } from '../../services/SubjectApi.ts';
import { SubjectStaffPayload } from '../../types/Datatypes.ts';
import { getAllStaff } from '../../services/StaffApi.ts';

interface SubjectItem {
  id: number;
  subject_name: string; 
}

interface StaffItem {
  id: number;
  staff_name: string; 
}

const AddSubjectStaff = () => {
  const [formData, setFormData] = useState<SubjectStaffPayload>({
    subject_id: 0,
    staff_id: 0,
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        const [subjectRes, staffRes] = await Promise.all([
          getAllSubjects(),
          getAllStaff()
        ]);
        
        setSubjects(Array.isArray(subjectRes) ? subjectRes : subjectRes.data || []);
        setStaffList(Array.isArray(staffRes) ? staffRes : staffRes.data || []);
      } catch (err) {
        console.error('Failed to look up mapping relationships:', err);
        setError('Could not populate staff or subject selection menus.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDropdownData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.subject_id === 0 || formData.staff_id === 0) {
      alert('Please select both a valid staff member and a subject.');
      return;
    }

    try {
      await createSubjectStaff(formData);
      navigate('/subjectstaff');
    } catch (error) {
      console.error('Error adding subject staff:', error);
      alert('Failed to save assignment. Please verify inputs.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading form options...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-xl border border-gray-100 mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Add Subject Staff Allocation</h2>
      <p className="text-sm text-gray-500 mb-6">Assign an active staff educator to an operational subject track.</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Subject</label>
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          >
            <option value={0}>-- Choose Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subject_name || `Subject #${sub.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Select Staff Member</label>
          <select
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          >
            <option value={0}>-- Choose Staff Member --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.staff_name || `Staff #${staff.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/subjectstaff')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow transition-colors"
          >
            Add Subject Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubjectStaff;