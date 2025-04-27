import { Link, useNavigate, useSearchParams } from "react-router-dom";
import UploadPage from '../components/UploadPage';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";
import { toPng } from 'html-to-image';
import QRCodeStyling from "qr-code-styling";
import { 
  Clock, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  File,
  User
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const Pending = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get("url");

  // Data states
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [signs, setSigns] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);

  // QR Code setup
  const [options, setOptions] = useState({
    width: 200,
    height: 200,
    type: 'svg',
    data: 'https://signtusk.com/document/verify',
    image: '/logo-icon.svg',
    margin: 1,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#1a56db',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#FFFFFF',
    },
    cornersSquareOptions: {
      color: '#1a56db',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#1a56db',
      type: 'dot',
    }
  });
  
  const [qrCode] = useState(new QRCodeStyling(options));
  const qrRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');

  // Stats data
  const stats = [
    { title: 'Pending Signatures', count: waitingCount, icon: <Clock className="w-5 h-5 text-blue-500" />, color: 'blue' },
    { title: 'Completed', count: completedCount, icon: <CheckCircle className="w-5 h-5 text-green-500" />, color: 'green' },
    { title: 'Drafts', count: draftsCount, icon: <File className="w-5 h-5 text-blue-500" />, color: 'blue' },
    { title: 'Expired', count: pendingCount, icon: <AlertTriangle className="w-5 h-5 text-red-500" />, color: 'red' }
  ];

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Handle document selection
  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
  };

  // Generate QR code
  useEffect(() => {
    const generateQrCode = async () => {
      if (qrRef.current) {
        qrCode.append(qrRef.current);

        try {
          const dataUrl = await toPng(qrRef.current, { width: 200, height: 200 });
          setImgSrc(dataUrl);
        } catch (error) {
          console.error("Failed to generate QR code image:", error);
        }
      }
    };

    generateQrCode();
  }, [qrCode, qrRef]);

  // Fetch user signature
  useEffect(() => {
    if (!user) return;
  
    const getSignature = async() => {
      let { data: signDetails, error } = await supabase
        .from('user_signs')
        .select('*')
        .eq('user_id', user.id);
      
      if (signDetails && signDetails.length > 0) {
        const response = await fetch(signDetails[0].public_url);
        let solved_url = await response.text();
        solved_url = solved_url && solved_url.startsWith("data:image/") 
                            ? solved_url 
                            : signDetails[0].public_url || "";
        setSigns(solved_url);
      }
    };
    getSignature();
  }, [user]);

  // Fetch user data, documents and activity
  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
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
      
      // Fetch recent documents
      let { data: recent_documents, document_error } = await supabase
        .from('recent_documents')
        .select('name,document_type,status,recipients,due_date,public_url')
        .eq('status', 'Waiting')
        .eq('user_id', user.id).limit(3);

      if (!document_error) {
        setRecentDocuments(recent_documents);
        if (recent_documents.length > 0) {
          setSelectedDocument(recent_documents[0]);
        }
      } else {
        console.log("Failed to fetch recent documents:", document_error);
      }

      async function getDocumentsByStatus(status) {
        const { count, error } = await supabase
        .from('recent_documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', status);

        return count;
      }
      
      const pending = await getDocumentsByStatus("Expired");
      const waiting = await getDocumentsByStatus("Waiting");
      const completed = await getDocumentsByStatus("Completed");
      const drafts = await getDocumentsByStatus("Drafts");
      setPendingCount(pending);
      setWaitingCount(waiting);
      setCompletedCount(completed);
      setDraftsCount(drafts);   
    }
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        waitingCount={waitingCount}
        completedCount={completedCount}
        draftsCount={draftsCount}
        pendingCount={pendingCount}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Component */}
        <Header userName={userDetails[0]?.firstName} />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Action Button */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center font-medium"
            >
              + Request Signature
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 bg-${stat.color}-100 rounded-md p-3`}>
                    {stat.icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.count}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="flex gap-6">
            {/* Document List */}
            <div className="flex-1">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipients
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentDocuments.length > 0 ? (
                      recentDocuments.map((doc, index) => (
                        <tr 
                          key={index} 
                          onClick={() => handleSelectDocument(doc)}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/editor?url=${doc.public_url}`} className="flex items-center">
                              <File className="w-5 h-5 text-red-500 mr-2" />
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.document_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              doc.status === 'Waiting' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-2">
                              {[...Array(doc.recipients || 1)].map((_, i) => (
                                <div key={i} className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.due_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No documents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadPage
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Pending;