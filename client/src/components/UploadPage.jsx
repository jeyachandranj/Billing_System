import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, File, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthProvider";

const UploadPage = ({ isOpen, onClose }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [signature, setSignature] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodePublicUrl, setQrPublicUrl] = useState('');
  const fileInputRef = useRef(null);
  const qrCodeRef = useRef(null);
  
  const {user} = useAuth();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedDocument(file);
    }
  };
  
  const getSignature = async () => {
    if (user?.id) {
      let { data: signDetails, error } = await supabase
        .from('user_signs')
        .select('*')
        .eq('user_id', user.id);
      
      if (signDetails && signDetails.length > 0) {
        try {
          const response = await fetch(signDetails[signDetails.length - 1]?.public_url);
          setSignature(response);
        } catch (error) {
          console.error("Error fetching signature:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      getSignature();
    }
  }, [user]);

  // Function to convert SVG to image data URL
  const convertQRToImage = () => {
    if (qrCodeRef.current) {
      // Get the SVG element
      const svgElement = qrCodeRef.current.querySelector('svg');
      
      if (svgElement) {
        // Convert SVG to a string
        const svgString = new XMLSerializer().serializeToString(svgElement);
        
        // Create a Blob from the SVG string
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        
        // Create an Image object
        const img = new Image();
        const url = URL.createObjectURL(svgBlob);
        
        return new Promise((resolve) => {
          img.onload = () => {
            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image on the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Get the data URL from the canvas
            const dataUrl = canvas.toDataURL('image/png');
            
            // Clean up
            URL.revokeObjectURL(url);
            
            resolve(dataUrl);
          };
          
          img.src = url;
        });
      }
    }
    return null;
  };

  // Function to convert data URL to Blob
  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  };

  const generateQRCode = (docId, url) => {
    // Create a display URL that includes our prefix and the document ID
    const displayUrl = `http://localhost:5173/display-pdf/${docId}`;
    
    setQrCodeUrl(displayUrl);
    setDocumentId(docId);
    setShowQRCode(true);
    
    return docId;
  };

  const handleContinue = async () => {
    if (!selectedDocument || !documentType) {
      alert('Please select a document, enter document type, and upload your signature');
      return;
    }

    try {
      // Get existing files
      let { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Generate a unique file name and document ID
      const uniqueDocId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      const uniqueFileName = `${user.id}-${data?.length || 0}-${uniqueDocId}`;
      
      // Upload file to storage
      const { data: fileDetails, error: uploadError } = await supabase.storage
        .from('files')
        .upload(`public/${uniqueFileName}`, selectedDocument, {
          cacheControl: '3600',
          upsert: false
        });
    
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(fileDetails.path);

      const publicUrl = publicUrlData.publicUrl;
      
      // Generate QR code for this document
      const docIdentifier = generateQRCode(uniqueDocId, publicUrl);
      
      // Save file metadata to database
      const { data: insertedFile, error: insertError } = await supabase
        .from('user_files')
        .insert([
          { 
            file_id: fileDetails.id, 
            user_id: user.id,
            public_url: publicUrl,
            path: fileDetails.fullPath,
            document_id: uniqueDocId,
            qr_url: `http://localhost:5173/display-pdf/${uniqueDocId}`
          }
        ]);
    
      if (insertError) throw insertError;
      
      // Log activity
      const { data: recentActivity, error: activityError } = await supabase
        .from('recent_activity')
        .insert([{ 
          action: `You uploaded ${selectedDocument.name}`, 
          type: 'upload', 
          user_id: user.id 
        }]);
    
      if (activityError) throw activityError;

      // Add to recent documents with a placeholder for the QR code image
      const { data: recentDocuments, error: documentError } = await supabase
        .from('recent_documents')
        .insert([{ 
          name: selectedDocument.name, 
          status: 'Waiting', 
          recipients: [], 
          due_date: new Date().toISOString(), 
          user_id: user.id, 
          public_url: publicUrl, 
          document_type: documentType,
          document_id: uniqueDocId,
          qr_url: `http://localhost:5173/display-pdf/${uniqueDocId}`,
          qrcode_img: qrCodePublicUrl 
        }]);

      if (documentError) throw documentError;
      
      // Create the QR code image after a small delay to ensure it's rendered
      setTimeout(async () => {
        try {
          // Convert QR code to image
          const qrImageDataUrl = await convertQRToImage();
          if (!qrImageDataUrl) {
            console.error("Failed to generate QR code image");
            return;
          }
          
          setQrCodeImage(qrImageDataUrl);
          
          // Convert data URL to Blob object
          const qrCodeBlob = dataURLtoBlob(qrImageDataUrl);
          
          // Upload QR code image to storage
          const { data: qrImageDetails, error: qrUploadError } = await supabase.storage
            .from('qrcodes')
            .upload(`${user.id}/${uniqueDocId}-qrcode.png`, qrCodeBlob, {
              cacheControl: '3600',
              contentType: 'image/png',
              upsert: false
            });
          
          if (qrUploadError) {
            console.error("Error uploading QR code:", qrUploadError);
            throw qrUploadError;
          }
          
          // Get QR code public URL
          const { data: qrPublicUrlData } = supabase.storage
            .from("qrcodes")
            .getPublicUrl(qrImageDetails.path);
          
          const qrPublicUrl = qrPublicUrlData.publicUrl;
          setQrPublicUrl(qrPublicUrl);
          
          // Update the document record with QR code image URL
          const { data: updatedDocument, error: updateError } = await supabase
            .from('recent_documents')
            .update({ qrcode_img: qrPublicUrl })
            .eq('document_id', uniqueDocId);
          
          if (updateError) {
            console.error("Error updating document with QR code:", updateError);
            throw updateError;
          }
          
        } catch (error) {
          console.error("Error processing QR code image:", error);
        }
      }, 500); // Increased timeout to ensure the QR code is fully rendered
      
    } catch (error) {
      console.error("Error in upload process:", error);
      alert("There was an error uploading your document. Please try again.");
    }
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      {showQRCode ? (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
          <div className="text-center" ref={qrCodeRef}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Document QR Code</h2>
            <p className="text-gray-600 mb-4">
              Scan this QR code to access your document. You can share this QR code with others to give them access.
            </p>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </div>
            <div className="text-xs text-gray-500 mb-6 break-all">
              <p>URL: {qrCodeUrl}</p>
              <p className="mt-2">Document ID: {documentId}</p>
            </div>
            <button
              onClick={handleCloseQRCode}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Request Signature</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Document Selection */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">
                Select Document
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full px-4 py-2.5 text-left border rounded-lg flex items-center justify-between text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center space-x-2">
                  <File className="w-5 h-5 text-gray-400" />
                  <span className={selectedDocument ? "text-gray-900" : "text-gray-500"}>
                    {selectedDocument ? selectedDocument.name : "Choose a PDF document"}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {selectedDocument && (
                <p className="text-sm text-gray-500 mt-1">
                  File size: {(selectedDocument.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            {/* Document Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">
                Document Type
              </label>
              <div className="relative">
                <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="px-3 py-2.5">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)} 
                    className="w-full py-2.5 pr-4 focus:outline-none text-gray-700"
                  >
                    <option value="">--Select an option--</option>
                    <option value="Single sign">Single Sign</option>
                    <option value="Multi sign">Multi Sign</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
              disabled={!selectedDocument || !documentType}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;