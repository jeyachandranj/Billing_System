import React, { useState, useRef } from 'react';
import { Upload, HelpCircle, RotateCcw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";

const Sign2 = () => {
  const {user, loading} = useAuth(); 
  const [signatures, setSignatures] = useState([]);

  const getSignature = async() => {

    let { data: signDetails, error } = await supabase
    .from('user_signs')
    .select('*').eq('user_id', user.id);
    signDetails.forEach(async(item) => {
      const response = await fetch(item.public_url);
      const solved_url = await response.text();
      item.solved_url = solved_url;
    });
    // console.log(signDetails);
    
    setSignatures(signDetails);
  };
  getSignature();

  const [currentSignature, setCurrentSignature] = useState('');
  const [signatureHistory, setSignatureHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const fileInputRef = useRef(null);

  const handleNewSignature = async() => {

  };

  const handleDelete = async(path) => {
    console.log(path);
    const { data, error } = await supabase
    .storage
    .from('signatures')
    .remove([path])

    if(error){
      console.log("Error deleting file");
    } else {
      const response = await supabase
      .from('user_signs')
      .delete()
      .eq('path', path);
      console.log("File deleted successfully");
    }

    let { data: signs, error: signError } = await supabase
    .from('user_signs')
    .select('*').eq('user_id', user.id);
    console.log(signs);

    setSignatures(signs);
  };

  const handleEdit = (id) => {
    const signature = signatures.find(sig => sig.sign_id === id);
    setCurrentSignature(signature?.text || '');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentSignature(signatureHistory[historyIndex - 1]);
    }
  };

  const handleSignatureChange = (e) => {
    const newSignature = e.target.value;
    setCurrentSignature(newSignature);
    setSignatureHistory([...signatureHistory.slice(0, historyIndex + 1), newSignature]);
    setHistoryIndex(historyIndex + 1);
  };

  const handleUpload = async(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setSignatures([...signatures, {
            id: signatures.length + 1,
            image: result,
          }]);
        }
      };
      reader.readAsDataURL(file);
    }

    let { data: count, error } = await supabase
    .from('user_signs')
    .select('*').eq('user_id', user.id);
    
    const { data: signDetails, error: uploadError } = await supabase.storage
      .from('signatures')
      .upload(`public/${user.id}-${count.length}`, file, {
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
      .insert([{ action: `You signed ${user.id}-${count.length}`, type: 'sign', user_id: user.id }]);
  
    if (activityError) {
      console.error("Activity error:", activityError);
    } else {
      console.log("Recent activity details inserted successfully:", recentActivity);
    }

    let { data: signs, error: signError } = await supabase
    .from('user_signs')
    .select('*').eq('user_id', user.id);
    console.log(signs);

    setSignatures(signs);
  };

  const handleDownload = () => {
    if (currentSignature) {
      const element = document.createElement('a');
      const file = new Blob([currentSignature], {type: 'image/png'});
      element.href = URL.createObjectURL(file);
      element.download = `signature-${Date.now()}.png`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleSave = async() => {
    if (currentSignature) {

      const fileBlob = new Blob([currentSignature], {type: 'image/png'});
      const file = new File([fileBlob], "signature.png", { type: "image/png" });

      let { data: count, error } = await supabase
      .from('user_signs')
      .select('*').eq('user_id', user.id);
      
      const { data: signDetails, error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(`public/${user.id}-${count.length}`, file, {
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
        .insert([{ action: `You signed ${user.id}-${count.length}`, type: 'sign', user_id: user.id }]);
    
      if (activityError) {
        console.error("Activity error:", activityError);
      } else {
        console.log("Recent activity details inserted successfully:", recentActivity);
      }

      let { data: signs, error: signError } = await supabase
      .from('user_signs')
      .select('*').eq('user_id', user.id);
      console.log(signs);
  
      setSignatures(signs);

      setCurrentSignature('');
      setSignatureHistory(['']);
      setHistoryIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Signature Manager</h1>
        <button
          onClick={handleNewSignature}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> New Signature
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {signatures.map(sig => (
          <div key={sig.sign_id} className="border rounded-lg p-4 bg-white">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <img
                src={sig.public_url}
                alt="Signature preview"
                className="w-24 h-24 object-cover rounded"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Signature #{sig.sign_id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sig.sign_id)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(sig.path)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border rounded-lg p-4 border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
          <div className="text-center text-gray-500">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <div>Upload or Type Signature</div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Create New Signature</h2>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Type:</span>
              <select className="border rounded px-2 py-1">
                <option>Draw</option>
                <option>Type</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Font:</span>
              <select className="border rounded px-2 py-1">
                <option>Style 1</option>
                <option>Style 2</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 mb-4">
          <input
            type="text"
            placeholder="Type your signature here..."
            className="w-full p-2 text-gray-700 focus:outline-none"
            value={currentSignature}
            onChange={handleSignatureChange}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setCurrentSignature('');
              setSignatureHistory(['']);
              setHistoryIndex(0);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Discard
          </button>
          {/* <Link to='/sign-3'> */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Signature
          </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Sign2;