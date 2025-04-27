import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { useAuth } from "../context/AuthProvider";
import { useSearchParams } from "react-router-dom";
import { supabase } from '../supabaseClient';
import QRCodeStyling from "qr-code-styling";
import {
  FileText,
  PenTool,
  FileSignature,
  QrCode,
  Edit,
  CheckCircle,
  User,
  Bell,
  Home,
  Plus
} from 'lucide-react';

const Editor = () => {
  const [recipientInput, setRecipientInput] = useState('');
  const [recipients, setRecipients] = useState([]);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name");
  const [basePdfUrl, setBasePdfUrl] = useState('');
  const [signature, setSignature] = useState('');
  const [activePanel, setActivePanel] = useState('document');
  const qrRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchPdf = async () => {
      if (fileUrl) {
        try {
          const base64String = await convertPdfToBase64(fileUrl);
          setBasePdfUrl(`data:application/pdf;base64,${base64String}`);
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      }
    };
    fetchPdf();
  }, [fileUrl]);

  useEffect(() => {
    if (!user) return;

    const getSignature = async () => {
      let { data: signDetails, error } = await supabase
        .from('user_signs')
        .select('*')
        .eq('user_id', user.id);

      if (signDetails && signDetails.length > 0) {
        const response = await fetch(signDetails[0].public_url);
        let solved_url = await response.text();
        solved_url = solved_url && solved_url.startsWith("data:image/")
          ? solved_url
          : signDetails.public_url || "";
        setSignature(solved_url);
      }
    };

    getSignature();
  }, [user]);

  useEffect(()=>{

    if (!user) return;

    const getUserDetails = async() => {
      // Fetch user details
      let { data: user_details, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.user_metadata.email);
      
      if (!error) {
        setUserDetails(user_details);
      } else {
        console.log("Failed to fetch user details:", error);
      }
    }

    getUserDetails();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const getRecipients = async () => {
      const { data, error } = await supabase
        .from('recent_documents')
        .select('recipients')
        .eq('user_id', user.id)
        .single();

      const updatedRecipients = [...(data.recipients || [])];
      console.log(updatedRecipients);

      setRecipients(updatedRecipients);
    };

    getRecipients();
  }, [user]);

  const addRecipient = async () => {
    if (!recipientInput.trim()) return;
  
    const email = recipientInput.trim();
  
    try {
      setRecipients(prev => [...prev, email]);
      setRecipientInput('');
  
      // Send Email
      const emailResponse = await fetch('http://localhost:4000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'New edit request assigned',
          html: `<p>Visit http://localhost:5173/dashboard to edit the document shared by <strong>${user.email}</strong></p>`
        })
      });
  
      if (!emailResponse.ok) {
        const err = await emailResponse.json();
        throw new Error(`Failed to send email: ${err.error || emailResponse.statusText}`);
      }
  
      // Get existing recipients
      const { data, error: fetchError } = await supabase
        .from('recent_documents')
        .select('recipients')
        .eq('user_id', user.id)
        .maybeSingle();
  
      if (fetchError) {
        throw new Error(`Error fetching recipients: ${fetchError.message}`);
      }
  
      const updatedRecipients = [...(data?.recipients || []), email];
  
      // Update recipients
      const { error: updateError } = await supabase
        .from('recent_documents')
        .update({ recipients: updatedRecipients })
        .eq('user_id', user.id);
  
      if (updateError) {
        throw new Error(`Error updating recipients: ${updateError.message}`);
      }
  
      console.log('Recipient added and email sent successfully.');
    } catch (error) {
      console.error('AddRecipient error:', error.message);
      alert(`Something went wrong: ${error.message}`);
    }
  };  

  // QR Code setup
  const [qrCode] = useState(new QRCodeStyling({
    width: 240,
    height: 240,
    type: 'svg',
    data: window.location.href,
    dotsOptions: {
      color: '#0052CC',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#FFFFFF',
    },
    cornersSquareOptions: {
      color: '#0052CC',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#0052CC',
      type: 'dot',
    }
  }));

  useEffect(() => {
    if (qrRef.current && activePanel === 'qrcode') {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);

      // Generate PNG from the QR code
      setTimeout(() => {
        if (qrRef.current) {
          toPng(qrRef.current, { width: 240, height: 240 })
            .then(dataUrl => setImgSrc(dataUrl))
            .catch(error => console.error("Failed to generate QR code image:", error));
        }
      }, 100);
    }
  }, [qrCode, qrRef, activePanel]);

  // Function to convert PDF URL to Base64
  async function convertPdfToBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1]; // Extract only Base64
          resolve(base64String);
        };
      });
    } catch (error) {
      console.error("Error converting PDF to Base64:", error);
      return null;
    }
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'document':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            {/* Document Preview Panel */}
            <div className="flex-1 bg-gray-50">
              {/* Header Bar */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{fileName}</h2>
                  <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Waiting for signatures
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center hover:bg-gray-200 transition-colors">
                    <FileText className="w-4 h-4 mr-2" /> Download
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition-colors">
                    <CheckCircle className="w-4 h-4 mr-2" /> Sign Document
                  </button>
                </div>
              </div>

              {/* Document Container */}
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">

                  <div className="p-4">
                    {basePdfUrl ? (
                      <iframe
                        src={`${basePdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-[calc(100vh-240px)] rounded border border-gray-100"
                      />
                    ) : (
                      <div className="w-full h-[calc(100vh-240px)] bg-gray-50 flex justify-center items-center border border-gray-200 rounded">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">Loading document...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>


            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            {/* Signature Panel */}
            <div className="flex-1 bg-gray-50">
              {/* Header Bar */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Your Signature</h2>
                  <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center hover:bg-blue-700 transition-colors">
                    <PenTool className="w-4 h-4 mr-2" /> Create New
                  </button>
                </div>
              </div>

              {/* Signature Container */}
              <div className="p-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="h-14 bg-blue-600 px-4 flex items-center justify-between">
                    <h3 className="text-white font-medium">Signature Preview</h3>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 flex justify-center">
                    {signature ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex justify-center items-center w-full max-w-md">
                        <img
                          src={signature}
                          alt="Your signature"
                          className="max-w-full max-h-32 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 flex flex-col justify-center items-center w-full max-w-md h-48">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <PenTool className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No signature found</p>
                        <p className="text-gray-400 text-sm mt-1">Create or upload a signature</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                          <PenTool className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Draw</p>
                          <p className="text-xs text-gray-500">Draw your signature</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Type</p>
                          <p className="text-xs text-gray-500">Type your signature</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Upload</p>
                          <p className="text-xs text-gray-500">Upload image</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Mobile</p>
                          <p className="text-xs text-gray-500">Use your phone</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        );

      case 'doctype':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">Document Options</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <option value="contract">Contract</option>
                  <option value="agreement">Agreement</option>
                  <option value="statement">Statement</option>
                  <option value="invoice">Invoice</option>
                  <option value="proposal">Proposal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Status</label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-yellow-800">Waiting for signatures</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Recipient (Format: Email)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., john@example.com"
                  />
                  <button
                    onClick={addRecipient}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                {recipients.length === 0 ? (
                  <p className="text-sm text-gray-500">No recipients added yet.</p>
                ) : (
                  recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{recipient}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4">
                <div className="flex space-x-3">
                  <Link
                    to="/edit-document"
                    className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="w-5 h-5 mr-2" /> Edit Document
                  </Link>
                  {recipients.length > 0 ? (
                    <Link
                      to="/sign-document"
                      className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" /> Share Document
                    </Link>
                  ) : (
                    <div
                      className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-400 cursor-not-allowed opacity-50"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" /> Share Document
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'qrcode':
        return (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">Document QR Code</h2>
            </div>
            <div className="p-6 flex flex-col items-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex justify-center items-center">
                <div ref={qrRef} className="w-60 h-60"></div>
              </div>

              <div className="mt-8 space-y-4 w-full max-w-md">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <FileText className="w-5 h-5 mr-2" /> Download QR Code
                </button>

                <button className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" /> Share QR Code
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      {/* Left Sidebar - Premium Blue Theme */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
        {/* Logo Area */}
        <div className="py-6 px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-xl text-white">ST</span>
            </div>
            <span className="ml-3 text-xl font-bold text-blue-600">SignTusk</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-1">
          <button
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all ${activePanel === 'document'
                ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            onClick={() => setActivePanel('document')}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${activePanel === 'document'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
              }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Document</p>
              <p className="text-xs text-gray-500">View and edit document</p>
            </div>
          </button>

          <button
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all ${activePanel === 'signature'
                ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            onClick={() => setActivePanel('signature')}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${activePanel === 'signature'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
              }`}>
              <PenTool className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Signature</p>
              <p className="text-xs text-gray-500">Manage your signature</p>
            </div>
          </button>

          <button
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all ${activePanel === 'doctype'
                ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            onClick={() => setActivePanel('doctype')}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${activePanel === 'doctype'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
              }`}>
              <FileSignature className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Document Options</p>
              <p className="text-xs text-gray-500">Configure document settings</p>
            </div>
          </button>

          <button
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all ${activePanel === 'qrcode'
                ? 'bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            onClick={() => setActivePanel('qrcode')}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${activePanel === 'qrcode'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
              }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">QR Code</p>
              <p className="text-xs text-gray-500">Generate document QR code</p>
            </div>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 py-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <User className="w-4 h-4" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{userDetails[0]?.firstName}</p>
                <p className="text-xs text-gray-500">Pro Account</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 mr-2">
                <Home className="w-5 h-5" />
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <Link to="/documents" className="text-gray-600 hover:text-gray-800 font-medium">Documents</Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-800 font-medium">{fileName}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default Editor;