import React, { useState } from 'react';
import { Download, Maximize } from 'lucide-react';

const PDFPreviewPage = () => {
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(prev => prev + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(prev => prev - 10);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY - scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const y = e.pageY - startY;
    const container = document.getElementById('pdf-container');
    if (container) {
      container.scrollTop = y;
      setScrollTop(y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Document Preview</h1>
            <p className="text-sm text-gray-500">Agreement Document.pdf</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Submit Document
            </button>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="bg-gray-50 border-b p-2 flex items-center gap-4">
            <button 
              className="hover:bg-gray-200 p-1 rounded disabled:opacity-50"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <span className="text-xl font-medium">−</span>
            </button>
            <span className="text-sm">{zoom}%</span>
            <button 
              className="hover:bg-gray-200 p-1 rounded disabled:opacity-50"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <span className="text-xl font-medium">+</span>
            </button>
          </div>

          <div 
            id="pdf-container"
            className="bg-gray-100 p-8 h-[600px] overflow-auto scroll-smooth"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="bg-white shadow-lg rounded-sm p-8 relative mx-auto transition-all duration-200"
              style={{
                width: `${zoom}%`,
                maxWidth: '2000px',
                minWidth: '320px'
              }}
            >
              <iframe 
        src="/sample.pdf" 
        className="w-full h-[800px] max-w-5xl" 
        title="PDF Preview"
      />
              <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
                <div className="w-24 h-8 border-b border-gray-300"></div>
                <div className="w-16 h-8 border-b border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewPage;