import React, { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import useApiRequest from '../utils/useApiRequest';
import FormikForm from '../components/Form/FormikForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '../components/Header/LoadingSpinner';

export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  as?: string;
  placeholder?: string;
  rows?: number;
  min?: unknown;
  onChange?: (e: React.ChangeEvent<unknown>) => void;
  options?: string[] | number[];
}

export interface AuthDataLogin {
  email: string;
  password: string;
}

export interface OtpData {
  otp: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  status: 'success' | 'failure';
  message: string;
  data: T;
}

const fields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
];

const forgotPasswordFields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
];

const otpFields: FieldConfig[] = [
  { name: 'otp', label: 'OTP', type: 'text', placeholder: 'Enter OTP' },
];

const resetPasswordFields: FieldConfig[] = [
  { name: 'password', label: 'New Password', type: 'password', placeholder: 'Enter new password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm new password' },
];

const initialValues: AuthDataLogin = {
  email: '',
  password: '',
};

const forgotPasswordInitialValues = {
  email: '',
};

const validationSchema: Yup.ObjectSchema<AuthDataLogin> = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const otpValidationSchema = Yup.object({
  otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});

const resetPasswordValidationSchema = Yup.object({
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const Login: React.FC = () => {
  const [loginPageFlow, setLoginPageFlow] = useState<'login' | 'forgotPassword' | 'otp' | 'resetPassword'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const { sendRequest } = useApiRequest();
  const navigate = useNavigate();

  const handleSubmit = async (values: AuthDataLogin, resetForm: () => void) => {
    setShowLoading(true);
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/login/authDataLogin',
      data: values,
    };

    const responseData: ApiResponse<unknown> = await sendRequest(config);
    setShowLoading(false);

    if (responseData?.code !== 200) {
      toast.error(responseData?.message || 'Login failed!');
      return;
    }

    toast.success(responseData?.message || 'Login successful!');
    resetForm();

    const userDetail: unknown = responseData?.data;

    setTimeout(() => {
      if (userDetail?.role === 'receptionist') navigate('/receptionist-dashboard');
      else if (userDetail?.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }, 2000);
  };

  const handleForgotPasswordSubmit = async (values: { email: string }, resetForm: () => void) => {
    setShowLoading(true);
    setUserEmail(values.email);

    const config = {
      method: 'POST',
      url: 'http://localhost:5000/api/forgot-password/send-otp',
      data: { email: values.email },
    };

    const responseData: ApiResponse<unknown> = await sendRequest(config);
    setShowLoading(false);

    if (responseData?.code !== 200) {
      toast.error(responseData?.message || 'Failed to send OTP');
      return;
    }

    toast.success('OTP sent to your email');
    resetForm();
    setLoginPageFlow('otp');
  };

  const handleVerifyOtp = async (values: OtpData, resetForm: () => void) => {
    setShowLoading(true);
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/api/forgot-password/verify-otp',
      data: { email: userEmail, otp: values.otp },
    };

    const responseData: ApiResponse<unknown> = await sendRequest(config);
    setShowLoading(false);

    if (responseData?.code !== 200) {
      toast.error(responseData?.message || 'Invalid OTP');
      return;
    }

    toast.success('OTP verified');
    resetForm();
    setLoginPageFlow('resetPassword');
  };

  const handleResetPassword = async (values: ResetPasswordData, resetForm: () => void) => {
    setShowLoading(true);
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/api/forgot-password/reset-password',
      data: { email: userEmail, newPassword: values.password },
    };

    const responseData: ApiResponse<unknown> = await sendRequest(config);
    setShowLoading(false);

    if (responseData?.code !== 200) {
      toast.error(responseData?.message || 'Password reset failed');
      return;
    }

    toast.success('Password reset successful. Redirecting to login...');
    resetForm();

    setTimeout(() => {
      setLoginPageFlow('login');
    }, 2000);
  };

  const formikFields = [
    { name: 'email', label: 'Email', type: 'email', value: '' },
    { name: 'password', label: 'Password', type: 'password', value: '' }
  ]

  const forgotPasswordFormikFields = [
    { name: 'email', label: 'Email', type: 'email', value: '' },
  ]

  const otpFormikFields = [
    { name: 'otp', label: 'OTP', type: 'otp', value: '' },
  ]

  const resetPasswordFormikFields = [
    { name: 'password', label: 'Password', type: 'password', value: '' },
    { name: 'confirmPassword', label: 'Confirm password', type: 'confirmPassword', value: '' },
  ];

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-blue-100 to-indigo-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          {loginPageFlow === 'login'
            ? 'Login'
            : loginPageFlow === 'forgotPassword'
            ? 'Forgot Password'
            : loginPageFlow === 'otp'
            ? 'Enter OTP'
            : 'Reset Password'}
        </h1>

        <ToastContainer position="top-right" autoClose={3000} />
          {showLoading && <LoaderSpinner />}

          


        <div className={showLoading ? 'filter blur-sm pointer-events-none' : ''}>
          {loginPageFlow === 'login' && (
            <FormikForm
              formikFields={formikFields}
              onSubmit={handleSubmit}
              // layout="sideBySide"
            />
          )}

          {loginPageFlow === 'forgotPassword' && (
            <FormikForm
              formikFields={forgotPasswordFormikFields}
              onSubmit={handleForgotPasswordSubmit}
            />
          )}

          {loginPageFlow === 'otp' && (
            <FormikForm
              formikFields={otpFormikFields}
              onSubmit={handleVerifyOtp}
            />
          )}

          {loginPageFlow === 'resetPassword' && (
            <FormikForm
              formikFields={resetPasswordFormikFields}
              onSubmit={handleResetPassword}
            />
          )}

        </div>

        <p className="text-center mt-4">
          {loginPageFlow !== 'login' ? (
            <span
              onClick={() => setLoginPageFlow('login')}
              className="text-blue-500 underline cursor-pointer text-sm"
            >
              Back to Login
            </span>
          ) : (
            <span
              onClick={() => setLoginPageFlow('forgotPassword')}
              className="text-blue-500 underline cursor-pointer text-sm"
            >
              Forgot Password?
            </span>
          )}
        </p>

        {loginPageFlow === 'login' && (
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
