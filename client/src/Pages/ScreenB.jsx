import React, { useRef, useState, useEffect } from 'react';
import { Designer } from '@pmee/ui';
import { text, image, barcodes, dateTime } from '@pmee/schemas';
import { generatePDF } from './helper';
import { 
  base64Image, 
  basePdfUrl, 
  base64Document, 
  updateBaseImageUrl, 
  updateBasePdfUrl, 
  updateImageDimensions, 
  updateSignerName, 
  signerName 
} from './variables';

const ScreenB = () => {
  const containerRef = useRef(null);
  const designerRef = useRef(null);
  const [fields, setFields] = useState([]);
  
  useEffect(() => {
    if (containerRef.current) {
      const template = {
        basePdf: base64Document, // Replace with your base PDF data URL
        schemas: [
          [
            {
              name: 'ONe',
              type: 'text',
              position: {x: 85.71, y: 209.22},
              content: signerName,
              width: 81.44,
              height: 6.09,
              alignment: "center",
              verticalAlignment: "middle",
              fontSize: 12
            },
            {
              name: 'photo',
              type: 'image',
              content: base64Image,
              position: { x: 130.29, y: 251.67 },
              width: 60,
              height: 24,
            },
            {
              name: 'Two',
              type: 'text',
              position: {
                x: 32.27,
                y: 232.94
              },
              content: signerName,
              width: 65.04,
              height: 6.09,
              alignment: "center",
              verticalAlignment: "middle",
              fontSize: 12
            },
            {
              name: 'Three',
              type: 'text',
              position: {
                x: 32.27,
                y: 200.94
              },
              content: signerName,
              width: 65.04,
              height: 6.09,
              alignment: "center",
              verticalAlignment: "middle",
              fontSize: 12
            }
          ]
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
      console.log(template.schemas);
      
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
  
  const handleGeneratePDF = () => {
    if (designerRef.current) {
      generatePDF(designerRef.current);
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '500px' }}></div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleGetAllFields} style={{ marginRight: '10px' }}>
          Get All Template Fields
        </button>
        <button onClick={handleGeneratePDF} style={{ marginBottom: '20px' }}>
          Download PDF
        </button>
      </div>
      
      <div>
        <h3>Current Fields:</h3>
        <pre>{JSON.stringify(fields, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ScreenB;