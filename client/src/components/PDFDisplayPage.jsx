// PDFDisplayPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Download, ZoomIn, ZoomOut, Maximize, ChevronLeft } from 'lucide-react';

export default function PDFDisplayPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("Document");
  const { documentId } = useParams();

  useEffect(() => {
    async function fetchPdfUrl() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('recent_documents')
          .select('public_url, document_id')
          .eq('document_id', documentId)
          .single();
        
        if (error) throw error;
        
        if (data && data.public_url) {
          setPdfUrl(data.public_url);
          // Extract filename from document_id or set a default name
          setFileName(`Document-${data.document_id.substring(0, 8)}`);
        } else {
          setError('PDF not found');
        }
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError('Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }

    if (documentId) {
      fetchPdfUrl();
    }
  }, [documentId]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${fileName}.pdf`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8 rounded-lg shadow-lg bg-white text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="mt-4 text-lg font-medium text-red-500">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()} 
              className="p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center">
              {/* SignTusk Logo */}
              <div className="flex items-center mr-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#2563EB"/>
                  <path d="M18.5 10L13 16L9.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-white">SignTusk</span>
              </div>
              
              <div className="h-6 w-px bg-blue-400 mx-3"></div>
              
              <h1 className="text-lg font-medium truncate max-w-md">
                {fileName}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-1 bg-white text-blue-600 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* PDF Viewer */}
      <div className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden border-2 border-blue-200">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-xl text-gray-500">No PDF URL available</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Powered by SignTusk PDF Viewer
          </div>
          <div className="flex space-x-3">
            <button className="text-gray-300 hover:text-white transition-colors" title="Zoom In">
              <ZoomIn size={18} />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors" title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <button className="text-gray-300 hover:text-white transition-colors" title="Full Screen">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}