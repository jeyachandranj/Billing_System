import { useState, useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { MdFactory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../assets/girl.jpg";
import { supabase } from '../supabaseClient';

const SignUp2 = () => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("Personal");
  const [termsPopup, setTermsPopup] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    companyName: "",
    industryField: "",
    employeeCount: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTermsAgree = () => {
    setAgreedToTerms(true);
    setTermsPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!agreedToTerms) {
      setError("Please agree to the Terms and Conditions");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        console.error("Sign-up error:", signUpError);
        setLoading(false);
        return;
      }

      if (data.user) {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: formData.fullName,
          companyName: formData.companyName,
          industryField: formData.industryField,
          email: formData.email,
          employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : 0,
          accountType: accountType
        };

        const { error: userError } = await supabase.from("users").insert([payload]);

        if (userError) {
          setError(userError.message);
          console.error("User data insert error:", userError);
          await supabase.auth.admin.deleteUser(data.user.id);
        } else {
          navigate("/verify-email");
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("General error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex flex-col lg:flex-row h-full max-w-7xl mx-auto rounded-xl shadow bg-white">
        <div className="flex flex-col w-full lg:w-3/6 p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-base sm:text-lg text-gray-500">
              Welcome to <br />
              <p className="font-bold text-xl sm:text-2xl md:text-3xl text-black">
                SignLock, Your Trusted Digital Signature Partner!
              </p>
            </h2>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm mb-6">
            Let's get you started. Create your account below to secure and sign
            your documents with ease.
          </p>

          <div className="mb-6">
            <h3 className="text-xs sm:text-sm font-semibold mb-3">Type of Account</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                className={`rounded-xl py-3 px-4 w-full sm:w-48 ${
                  accountType === "Personal"
                    ? "bg-blue-200 text-blue-600"
                    : "bg-gray-200 text-black"
                } hover:bg-blue-200 hover:text-blue-600 flex items-center justify-center`}
                onClick={() => setAccountType("Personal")}
              >
                <IoPersonSharp className="mr-2" /> Personal
              </button>
              <button
                type="button"
                className={`rounded-xl py-3 px-4 w-full sm:w-48 ${
                  accountType === "Corporate"
                    ? "bg-blue-200 text-blue-600"
                    : "bg-gray-200 text-black"
                } hover:bg-blue-200 hover:text-blue-600 flex items-center justify-center`}
                onClick={() => setAccountType("Corporate")}
              >
                <MdFactory className="mr-2" /> Corporate
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                {error}
              </div>
            )}

            {accountType === "Personal" ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="w-full">
                    <label className="block text-xs font-bold mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your First Name"
                      className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your Last Name"
                      className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="w-full">
                    <label className="block text-xs font-bold mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your First Name"
                      className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your Last Name"
                      className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your Company Name"
                    className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-xs">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => setTermsPopup(true)}
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 mb-6"
            onClick={handleSubmit} >
              Next
            </button>
          </form>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center w-3/6 bg-gray-100">
          <img
            src={logo}
            alt="SignLock"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {termsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Terms and Conditions</h3>
            <div className="text-sm text-gray-600 mb-4">
              <p className="mb-2">Welcome to SignLock. By using our service, you agree to the following terms:</p>

              <h4 className="font-semibold mt-3 mb-1">1. Account Registration</h4>
              <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials.</p>

              <h4 className="font-semibold mt-3 mb-1">2. Service Usage</h4>
              <p>Our digital signature service is to be used for legal and legitimate purposes only. You agree not to use the service for any fraudulent or unauthorized activities.</p>

              <h4 className="font-semibold mt-3 mb-1">3. Privacy</h4>
              <p>We collect and process your data as described in our Privacy Policy. By using our service, you consent to such processing.</p>

              <h4 className="font-semibold mt-3 mb-1">4. Security</h4>
              <p>We implement security measures to protect your data, but you are responsible for maintaining the confidentiality of your account.</p>
            </div>
            <button
              onClick={handleTermsAgree}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full"
            >
              I Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp2;