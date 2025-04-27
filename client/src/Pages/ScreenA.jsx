import React, { useRef, useState, useEffect } from 'react';
import { Designer } from '@pmee/ui';
import { text, image, barcodes, dateTime } from '@pmee/schemas';
import { generatePDF } from './helper';
import { base64Image, basePdfUrl, base64Document, updateBaseImageUrl, updateBasePdfUrl, updateImageDimensions, updateSignerName, signerName } from './variables';

const ScreenA = () => {
  const containerRef = useRef(null);
  const designerRef = useRef(null);
  const [fields, setFields] = useState([]);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('design');

  useEffect(() => {
    if (containerRef.current) {
      const template = {
        basePdf: basePdfUrl, // Base PDF data URL
        schemas: [
          [
            {
              name: 'Text',
              type: 'text',
              position: { x: 100, y: 60 },
              content: signerName,
              width: 10,
              height: 10,
            },
            {
              name: 'qrCode',
              type: 'qrcode',
              content: 'https://pdfme.com/',
              position: { x: 100, y: 70 },
              width: 30,
              height: 30,
              rotate: 0,
            },
            {
              name: 'photo',
              type: 'image',
              content: base64Image,
              position: { x: 24.99, y: 65.61 },
              width: 40,
              height: 16,
            },
            {
              name: 'dateTime',
              type: 'dateTime',
              position: { x: 50, y: 200 },
              width: 45,
              height: 10,
              readOnly: false,
              format: 'yyyy/MM/dd HH:mm',
              placeholder: 'Select Date and Time',
              content: '2024/11/19 13:28',
            },
          ],
        ],
      };

      const designer = new Designer({
        domContainer: containerRef.current,
        template,
        plugins: {
          text,
          image,
          dateTime,
          qrcode: barcodes.qrcode,
        },
      });

      designerRef.current = designer;
      setFields(template.schemas);
      setTemplateLoaded(true);

      return () => {
        designer.destroy();
        designerRef.current = null;
      };
    }
  }, []);

  const handleGetAllFields = () => {
    if (designerRef.current) {
      const currentTemplate = designerRef.current.getTemplate();
      setFields(currentTemplate.schemas);
      console.log('All Template Fields:', currentTemplate.schemas);
    }
  };

  const handleDownloadPDF = () => {
    if (designerRef.current) {
      generatePDF(designerRef.current);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Premium Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-800 tracking-tight">PDF Designer</h1>
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Document
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('design')}
                className={`${
                  activeTab === 'design'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Document Design
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('fields')}
                className={`${
                  activeTab === 'fields'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Field Properties
              </button>
            </nav>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Document Actions</h2>
            <div className="flex space-x-3">
              <button
                onClick={handleGetAllFields}
                className="px-4 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                Get All Fields
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                Download PDF
              </button>
            </div>
          </div>
          
          {/* Tool Selection */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-3">
              {['Text', 'Image', 'Signature', 'Date & Time', 'QR Code'].map((tool) => (
                <button
                  key={tool}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Designer Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div 
            ref={containerRef} 
            className="w-full h-[70vh]"
            style={{ border: '1px solid #e5e7eb' }}
          />
        </div>

        {/* Field Properties Panel - only visible when fields tab is active */}
        {activeTab === 'fields' && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-700 text-white">
              <h2 className="text-xl font-semibold">Field Properties</h2>
            </div>
            <div className="p-6">
              {templateLoaded && fields.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {fields[0].map((field, index) => (
                    <div key={index} className="py-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{field.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span> {field.type}
                        </div>
                        <div>
                          <span className="text-gray-500">Position:</span> x: {field.position.x}, y: {field.position.y}
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span> {field.width} × {field.height}
                        </div>
                        {field.content && (
                          <div>
                            <span className="text-gray-500">Content:</span> {field.content.substring(0, 30)}{field.content.length > 30 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No fields available</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScreenA;