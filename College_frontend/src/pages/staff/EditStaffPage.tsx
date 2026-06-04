import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStaffById,
  getstaffProfile,
  updateStaff,
  updateProfile,
} from "../../services/StaffApi.ts";

import {
  ProfileData,
  UpdateProfilePayload,
} from "../../types/Datatypes.ts";

import ProfileForm from "../../components/ProfileForm.tsx";

import "../../styles/staff/editStaff.css";

import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";


type DepartmentPageProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const StaffPage = ({
  id,
  navigate,
  isEditMode
}: DepartmentPageProps) => {

  const [formData, setFormData] =
    useState<ProfileData>({
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

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = isEditMode
          ? await getstaffProfile()
          : await getStaffById(Number(id));

        setFormData({
          ...res.data,
          DOB: res.data.DOB
            ? res.data.DOB.split("T")[0]
            : "",
        });
      } catch (error) {
        console.error(
          "Error fetching staff data:",
          error
        );
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,

      address: {
        ...prev.address,

        [e.target.name]:
          e.target.name === "pin"
            ? Number(e.target.value)
            : e.target.value,
      },
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload: UpdateProfilePayload =
        {
          userData: {
            name: formData.name,
            email: formData.email,
            contact: formData.contact,
            gender: formData.gender,
            DOB: formData.DOB,
            address_id:
              formData.address_id,
          },

          addressData: {
            city: formData.address.city,
            district:
              formData.address.district,
            state:
              formData.address.state,
            pin: formData.address.pin,
          },
        };

      if (isEditMode) {
        await updateProfile(payload);

        toast.success(
          "Profile Updated Successfully"
        );

        navigate("/staff/profile");
      } else {
        await updateStaff(
          Number(id),
          payload
        );

        toast.success(
          "Staff Updated Successfully"
        );

        navigate(
          "/staff-management"
        );
      }
    } catch (error) {
      console.error(
        "Update Failed:",
        error
      );

      toast.error(
        "Failed to update"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileForm
      title={
        isEditMode
          ? "Edit Profile"
          : "Edit Staff"
      }
      formData={formData}
      loading={loading}
      buttonText={
        isEditMode
          ? "Update Profile"
          : "Update Staff"
      }
      handleChange={handleChange}
      handleAddressChange={
        handleAddressChange
      }
      handleSubmit={handleSubmit}
    />
  );
};

export default withCrudPage(StaffPage);