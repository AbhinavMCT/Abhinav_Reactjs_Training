import { ProfileData } from "../types/Datatypes.ts";
import Breadcrumbs from "./Breadcrumbs.tsx";

type Props = {
  title: string;
  formData: ProfileData;
  loading: boolean;
  buttonText: string;
  showLoginFields?: boolean;
  errors?: {
    [key: string]: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAddressChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleLoginChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleSubmit: (
    e: React.SubmitEvent<HTMLFormElement>
  ) => void;
};

const ProfileForm = ({
  title,
  formData,
  loading,
  buttonText,
  showLoginFields = false,
  errors = {},
  handleChange,
  handleAddressChange,
  handleLoginChange,
  handleSubmit,
}: Props) => {
  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>

        <div className="error-control">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="error-control">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="error-control">
          <label htmlFor="contact">Contact Number:</label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p className="error-text">{errors.contact}</p>}
        </div>

        <div className="error-control">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="error-text">{errors.gender}</p>
          )}
        </div>

        <div className="error-control">
          <label htmlFor="DOB">Date of Birth:</label>
          <input
            id="DOB"
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
          />
          {errors.DOB && (
            <p className="error-text">{errors.DOB}</p>
          )}
        </div>

        <div className="error-control">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleAddressChange}
          />
          {errors.city && (
            <p className="error-text">{errors.city}</p>
          )}
        </div>

        <div className="error-control">
          <label htmlFor="district">District:</label>
          <input
            id="district"
            type="text"
            name="district"
            value={formData.address.district}
            onChange={handleAddressChange}
          />
          {errors.district && (
            <p className="error-text">{errors.district}</p>
          )}
        </div>

        <div className="error-control">
          <label htmlFor="state">State:</label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
          />
          {errors.state && (
            <p className="error-text">{errors.state}</p>
          )}
        </div>

        <div className="error-control">
          <label htmlFor="pin">PIN Code:</label>
          <input
            id="pin"
            type="number"
            name="pin"
            value={formData.address.pin}
            onChange={handleAddressChange}
          />
          {errors.pin && (
            <p className="error-text">{errors.pin}</p>
          )}
        </div>

        {showLoginFields && (
          <>
            <div className="error-control">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.login.username}
                onChange={handleLoginChange}
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            <div className="error-control">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.login.password}
                onChange={handleLoginChange}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : buttonText}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;

