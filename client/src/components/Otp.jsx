import React, { useState } from "react";
import { X } from "lucide-react";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResend = () => {
    console.log("Resend OTP clicked");
  };

  const handleVerify = () => {
    console.log("OTP entered:", otp.join(""));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
          <X size={18} />
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">Aadhan OTP Verification</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Please enter the 4-digit OTP sent to your registered mobile number
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mb-6">
          Didn’t receive OTP? <button onClick={handleResend} className="text-blue-500 hover:underline">Resend OTP</button>
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;