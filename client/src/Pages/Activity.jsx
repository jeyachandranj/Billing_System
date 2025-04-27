import { Link, useNavigate,useLocation } from "react-router-dom";
import UploadPage from '../components/UploadPage';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";
import { useSearchParams } from "react-router-dom";
import { toPng } from 'html-to-image';
import QRCodeStyling from "qr-code-styling";
import { 
  Bell, 
  User, 
  Clock, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  Upload,
  Pen,
  File,
  BarChart2,
  Settings,
  LogOut,
  Download,
  Share2,
  ChevronRight,
  SquareActivity
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Activity = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get("url");

   const location = useLocation();
    const currentPath = location.pathname;
  
    // Function to determine if a link is active
    const isActive = (path) => currentPath === path;

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

      // Fetch recent activity
      let { data: recent_activity, activity_error } = await supabase
        .from('recent_activity')
        .select('action,time,type')
        .eq('user_id', user.id);

      if (!activity_error) {
        setRecentActivity(recent_activity);
      } else {
        console.log("Failed to fetch recent activity:", activity_error);
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
      {/* Sidebar */}
      <Sidebar 
        waitingCount={waitingCount}
        completedCount={completedCount}
        draftsCount={draftsCount}
        pendingCount={pendingCount}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
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

          {/* Documents and Sidebar */}
          <div className="flex gap-6">
            {/* Document List */}
            <div className="flex-1">

              {/* Recent Activity */}
              <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="px-6 py-4 flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            activity.type === 'sign' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            {activity.type === 'sign' ? (
                              <Pen className="h-5 w-5 text-blue-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-4 text-center text-gray-500">
                      No recent activity
                    </div>
                  )}
                </div>
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

export default Activity;