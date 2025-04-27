import { IoPersonSharp } from "react-icons/io5";
import { MdFactory } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";

const Signup1 = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/signup-2");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen max-w-7xl mx-auto">
        {/* Left side */}
        <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 md:p-8 bg-white">
          {/* Logo Section  */}
          <div className="w-full flex justify-center lg:justify-start">
            <img
              src={logo}
              alt="SignUp"
              className="w-32 sm:w-40 h-16 sm:h-24 object-contain"
            />
          </div>

          {/* Main Content Container */}
          <div className="flex flex-col flex-grow items-center lg:items-start mt-8 lg:mt-12 max-w-xl mx-auto w-full">
            {/* Heading */}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left px-4">
              How are you planning to use Shake?
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base mt-4 text-center lg:text-left px-4">
              We'll fit the experience to your needs. Don't worry, you can change it later.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full justify-center px-4">
              {/* Personal Button */}
              <button className="w-full sm:w-64 bg-gray-100 hover:bg-blue-50 transition-colors duration-200 rounded-xl p-6 flex flex-col items-center group">
                <IoPersonSharp className="text-gray-700 text-2xl sm:text-3xl mb-3 group-hover:text-blue-600" />
                <h3 className="text-gray-900 font-semibold mb-1">Personal</h3>
                <p className="text-gray-500 text-xs">Person</p>
              </button>

              {/* Corporate Button */}
              <button className="w-full sm:w-64 bg-gray-100 hover:bg-blue-50 transition-colors duration-200 rounded-xl p-6 flex flex-col items-center group">
                <MdFactory className="text-gray-700 text-2xl sm:text-3xl mb-3 group-hover:text-blue-600" />
                <h3 className="text-gray-900 font-semibold mb-1">Corporate</h3>
                <p className="text-gray-500 text-xs">Corporate</p>
              </button>
            </div>

            {/* Let's Create Button */}
            <div className="w-full px-4 mt-12">
              <button
                onClick={handleNavigate}
                className="w-full sm:w-96 mx-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <span>Let's Create</span>
                <FaLongArrowAltRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden lg:block w-1/2 bg-blue-700">
          {/* You can add content here for the right side */}
        </div>
      </div>
    </div>
  );
};

export default Signup1;