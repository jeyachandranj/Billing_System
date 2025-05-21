import { useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/Navbar/NavBar';

// Import your image assets
import img1 from '../images/product10.jpeg';
import img2 from '../images/product1.jpeg';
import img3 from '../images/product2.jpeg';
import img4 from '../images/product3.jpeg';
import img5 from '../images/product4.jpeg';
import img6 from '../images/product5.jpeg';
import img7 from '../images/product6.jpeg';
import img8 from '../images/product7.jpeg';
import img9 from '../images/product8.jpeg';
import img10 from '../images/product9.jpeg';
import img11 from '../images/product11.jpeg';
import img12 from '../images/product12.jpeg';
import img13 from '../images/product13.jpeg';
import img14 from '../images/product14.jpeg';
import img15 from '../images/product15.jpeg';

// Product image gallery with imported images
const productImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15
];

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Using your NavBar component */}
      
      {/* Page Title Section */}
      <div className="bg-blue-700 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">Our Products</h1>
          <p className="text-white text-center mt-2">Explore our premium cotton products</p>
        </div>
      </div>
      
      {/* Image Gallery */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productImages.map((image, index) => (
            <div 
              key={index} 
              className="cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative pb-[100%]"> {/* Creates a square aspect ratio */}
                <img 
                  src={image} 
                  alt={`Product ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Lightbox for enlarged image view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button 
              className="absolute top-4 right-4 text-white bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold hover:bg-blue-800 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged product view" 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      
      {/* Footer - Using your Footer component */}
      <Footer />
    </div>
  );
}