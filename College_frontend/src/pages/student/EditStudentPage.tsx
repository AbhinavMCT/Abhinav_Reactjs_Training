import { useState, useEffect } from "react";
import { getProfile, getStudentById, updateProfile, updateStudents } from "../../services/StudentApi.ts";
import { pageprops, ProfileData, UpdateProfilePayload } from "../../types/Datatypes.ts";
import "../../styles/student/editStudent.css";
import { toast } from "react-toastify";
import ProfileForm from "../../components/ProfileForm.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";


const EditProfile = ({id,navigate,isEditMode}: pageprops) => {
  const isProfilePage = !id;
  
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    contact: "",
    gender: "",
    DOB: "",
    address_id: undefined, 

    address: {
      city: "",
      district: "",
      state: "",
      pin: 0,
    },

    login: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {



const res = isProfilePage
  ? await getProfile()
  : await getStudentById(Number(id));        
                setFormData({
                  ...res.data,
                  DOB: res.data.DOB
                    ? res.data.DOB.split("T")[0]
                    : "",
                });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [e.target.name]:
          e.target.name === "pin" ? Number(e.target.value) : e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: UpdateProfilePayload = {
        userData: {
          name: formData.name || "",
          email: formData.email || "",
          contact: formData.contact || "",
          gender: formData.gender || "",
          DOB: formData.DOB || "",
          address_id: formData.address_id ?? undefined,
        },

        addressData: {
          city: formData.address.city || "",
          district: formData.address.district || "",
          state: formData.address.state || "",
          pin: formData.address.pin || 0,
        },
      };

      if(isProfilePage) {
        await updateProfile(payload);
      toast.success("Updated SuccessFully");
      } else {
        await updateStudents(Number(id), payload);
           toast.success("Edited Successfully");
      }
      navigate("/student-management");
    } catch (error) {
      console.error("Update Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileForm
  title={isEditMode
          ? "Edit Profile"
          : "Edit Student"}
  formData={formData}
  loading={loading}
  buttonText={isEditMode
          ? "Update Profile"
          : "Update Student"}
  handleChange={handleChange}
  handleAddressChange={handleAddressChange}
  handleSubmit={handleSubmit}
/>
  );
};

export default withCrudPage(EditProfile);