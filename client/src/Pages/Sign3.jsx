import React, { useState, useCallback } from 'react';
import { X, Check, Edit, Upload } from 'lucide-react';

const Sign3 = () => {
  const [isPrimary, setIsPrimary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(true);
  const [signature, setSignature] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target.result);
        setShowSuccess(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target.result);
        setShowSuccess(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 17l6-6-4-4 1.5-1.5 4 4L17 3l1.5 1.5-12 12L4 17z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Signature Management</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
          <div className="text-green-500 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-green-800 font-medium">Signature Saved Successfully!</h3>
            <p className="text-green-700">Your signature has been saved and is ready to use.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Signature Preview</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Set as Primary Signature</span>
          </label>
        </div>

        <div
          className={`bg-gray-50 rounded-lg p-8 mb-6 flex flex-col justify-center items-center border-2 border-dashed transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {signature ? (
            <img
              src={signature}
              alt="Signature"
              className="max-w-full h-auto"
            />
          ) : (
            <label className="cursor-pointer text-center">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Drag & drop your signature image or click to upload</p>
            </label>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Use Signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sign3;