import { ProfileData } from "../types/Datatypes.ts";

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
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="error-control">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="error-control">
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p className="error-text">{errors.contact}</p>}
        </div>

        <div className="error-control">
          <select
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
          <input
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
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.address.city}
            onChange={handleAddressChange}
          />

          {errors.city && (
            <p className="error-text">{errors.city}</p>
          )}
        </div>

        <div className="error-control">
          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.address.district}
            onChange={handleAddressChange}
          />

          {errors.district && (
            <p className="error-text">{errors.district}</p>
          )}
        </div>

        <div className="error-control">
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.address.state}
            onChange={handleAddressChange}
          />

          {errors.state && (
            <p className="error-text">{errors.state}</p>
          )}
        </div>

        <div className="error-control">
          <input
            type="number"
            name="pin"
            placeholder="PIN"
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
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.login.username}
                onChange={handleLoginChange}
              />

              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            <div className="error-control">
              <input
                type="password"
                name="password"
                placeholder="Password"
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