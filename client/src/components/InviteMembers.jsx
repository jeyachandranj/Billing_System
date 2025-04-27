import { useState } from 'react';
import logo from "../assets/girl.jpg";

const InviteMembers = () => {
  const [members, setMembers] = useState([
    { email: '', role: '', helpText: '' },
    { email: '', role: '', helpText: '' }
  ]);

  const roles = ['Admin', 'Editor', 'Viewer'];

  const handleInputChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const addEmailField = () => {
    setMembers([...members, { email: '', role: '', helpText: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted members:', members);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-4xl h-7xl bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Invite Members to your channel
            </h1>
            <p className="text-gray-600 mb-6">
              Let's get you started. Create your account below to secure and sign your documents with ease.
            </p>

            <form onSubmit={handleSubmit}>
              {members.map((member, index) => (
                <div key={index} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                        placeholder="Type your email address"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />

                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Select role
                      </label>
                      <select
                        value={member.role}
                        onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select your role</option>
                        {roles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>

                    </div>
                  </div>
                </div>
              ))}
              <div>
              <button
                type="button"
                onClick={addEmailField}
                className="text-black w-full bg-white mb-6  py-3 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                Add Email Address
              </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finish Setup
              </button>
            </form>
          </div>

          <div className="hidden lg:block flex-1">
            <img
              src={logo}
              alt="Security illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;