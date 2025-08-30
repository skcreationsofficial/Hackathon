import React, { useState } from "react";
import * as Yup from "yup";
import FormikForm from "../components/Form/FormikForm";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoaderSpinner from "../components/Header/LoadingSpinner"; // Adjust path as needed

export interface AuthData {
  name?: string;
  email?: string;
  password?: string;
  dob?: string;
  phoneNumber?: string;
}
export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  as?:
    | "input"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "date"
    | string
    | undefined;
  placeholder?: string;
  rows?: number;
  min?: unknown;
  onChange?: (e: React.ChangeEvent<unknown>) => void;
  options?: string[] | number[];
}

  const registerFormikFields = [
    { name: 'name', label: 'Name', type: 'name', value: '' },
    { name: 'email', label: 'Email', type: 'email', value: '' },
    { name: 'password', label: 'Password', type: 'password', value: '' },
    { name: 'dob', label: 'Date of birth', type: 'dob', value: '' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'phone', value: '' },
  ]

const Register: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values: AuthData) => {
    setError("");
    setSuccessMessage("");

    console.log("values", values);

    try {
      setShowLoading(true);

      const response = await axios.post(
        "http://localhost:5000/register/authData",
        {
          ...values,
        }
      );

      if (response.data && response.data.message === "User already exists") {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setShowLoading(true);

          navigate("/login");
        }, 2000);
      } else {
        toast.success("User registered successfully!");
        setTimeout(() => {
          setShowLoading(true);

          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // setShowLoading(true);
      console.error("Error during registration:", error);
      // toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-blue-100 to-indigo-100">
      <div className="w-full max-w-md">
                  {showLoading && <LoaderSpinner />}

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>
        <ToastContainer position="top-right" autoClose={3000} />

        {error && (
          <p className="text-red-600 p-5 text-center mx-5 mt-5">{error}</p>
        )}

        {successMessage && (
          <p
            data-testid="success-message"
            className={`${
              successMessage === "User already exists"
                ? "text-red-600"
                : "text-green-600"
            } p-5 text-center mx-5 mt-5`}
          >
            {successMessage}
          </p>
        )}

        <div
          className={showLoading ? "filter blur-sm pointer-events-none" : ""}
        >
          <ToastContainer position="top-right" autoClose={3000} />
          <FormikForm
            formikFields={registerFormikFields}
            onSubmit={handleSubmit}
          />
        </div>

        {
          <p className="text-center text-gray-600 mt-4">
            Have an account already?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
              Login
            </Link>
          </p>
        }

      </div>
    </div>
  );
};

export default Register;