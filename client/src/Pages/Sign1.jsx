import { useState, useRef, useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';

import {
  Bell,
  User,
  Clock,
  CheckCircle,
  FileText,
  AlertTriangle,
  Pen,
  File,
  BarChart2,
  Settings,
  LogOut,
  SquareActivity
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Sign1 = () => {
  const [signatures, setSignatures] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [draftsCount, setDraftsCount] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
   const location = useLocation();
    const currentPath = location.pathname;
  
    // Function to determine if a link is active
    const isActive = (path) => currentPath === path;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    getSignatures();
  }, [user]);

  async function getSignatures() {
    if (!user) return;
    let { data, error } = await supabase
      .from('user_signs')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    const updatedData = await Promise.all(
      data.map(async (obj) => {
        const response = await fetch(obj.public_url);
        const solved_url = await response.text();
        return { ...obj, solved_url };
      })
    );

    console.log(updatedData);
    setSignatures(updatedData);
  }

  const startDrawing = (e) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Note: navigate is not defined in the original code, so I've commented it out
    // navigate("/login");
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) / scaleX,
        offsetY: (e.touches[0].clientY - rect.top) / scaleY
      };
    }
    return {
      offsetX: (e.clientX - rect.left) / scaleX,
      offsetY: (e.clientY - rect.top) / scaleY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = async () => {
    let { data, error } = await supabase
      .from('user_signs')
      .select('*').eq('user_id', user.id);
    const canvas = canvasRef.current;
    const newSignature = {
      id: Date.now(),
      type: `${user.id}-${data.length}`,
      createdOn: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      isPrimary: signatures.length === 0,
      image: canvas.toDataURL('image/png')
    };

    clearCanvas();

    const { data: signDetails, error: uploadError } = await supabase.storage
      .from('signatures')
      .upload(`public/${newSignature.type}`, newSignature.image, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return;
    }

    console.log("Signature uploaded successfully:", signDetails);

    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(signDetails.path);

    const publicUrl = publicUrlData.publicUrl;

    const { data: insertedFile, error: insertError } = await supabase
      .from("user_signs")
      .insert([
        {
          sign_id: signDetails.id,
          user_id: user.id,
          public_url: publicUrl,
          path: signDetails.path
        },
      ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return;
    }

    console.log("Sign details inserted successfully:", insertedFile);

    const { data: recentActivity, error: activityError } = await supabase
      .from('recent_activity')
      .insert([{ action: `You signed ${newSignature.type}`, type: 'sign', user_id: user.id }]);

    if (activityError) {
      console.error("Activity error:", activityError);
    } else {
      console.log("Recent activity details inserted successfully:", recentActivity);
      getSignatures();
      // redirect('/dashboard');
    }
  };

  const makePrimary = (id) => {
    setSignatures(signatures.map(sig => ({
      ...sig,
      isPrimary: sig.id === id
    })));
  };

  const deleteSignature = async (id, path) => {
    try {
      const { data, error: storageError } = await supabase
        .storage
        .from("signatures")
        .remove([path]);

      if (storageError) {
        console.error("Storage Error:", storageError.message);
        return;
      }

      const { error: dbError } = await supabase
        .from("user_signs")
        .delete()
        .eq("sign_id", id);

      if (dbError) {
        console.error("Database Error:", dbError.message);
        return;
      }

      setSignatures((prevSignatures) =>
        prevSignatures.filter((sig) => sig.sign_id !== id)
      );
    } catch (err) {
      console.error("Unexpected Error:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let { data: user_details, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.user_metadata.email);

      if (!error) {
        setUserDetails(user_details);
      } else {
        console.log("Failed to fetch user details:", error);
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
        

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Signature Management</h1>
              <Link to='/sign-2'>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Upload Signature
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Signature Drawing Area */}
              <div className="bg-white rounded-lg shadow-sm p-4 order-2 lg:order-1">
                <div className="border border-gray-200 rounded-lg mb-4">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-48 touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={saveSignature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Existing Signatures */}
              <div className="space-y-4 order-1 lg:order-2">
                <h2 className="text-lg font-medium text-gray-900">My Signatures</h2>
                <div className="space-y-3">
                  {signatures.length > 0 ? (
                    signatures.map(signature => (
                      <div
                        key={signature.id}
                        className={`p-4 rounded-lg border ${signature.isPrimary ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{signature.type}</h3>
                            <p className="text-sm text-gray-500">Created on {signature.createdOn}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!signature.isPrimary && (
                              <button
                                onClick={() => makePrimary(signature.id)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                Make Primary
                              </button>
                            )}
                            <button
                              onClick={() => deleteSignature(signature.sign_id, signature.path)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <img
                            src={signature.solved_url && signature.solved_url.startsWith("data:image/")
                              ? signature.solved_url
                              : signature.public_url || ""}
                            alt="Signature"
                            className="max-h-24 border rounded"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">No signatures found. Create one by drawing in the canvas.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign1;