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

// Product data with names, descriptions, materials, etc.
const productData = [
 
  {
    id: 6,
    image: img6,
    name: "Yellow Industrial Thread",
    description: "Heavy-duty yellow industrial thread for commercial sewing machines and high-volume projects.",
    material: "Polyester",
    thickness: "Thick",
    tensileStrength: "Ne 40s",
    finishType: "Matte",
    category: "Industrial",
    color: "Yellow",
    hexCode: "#FFFF00"
  },
  {
    id: 7,
    image: img7,
    name: "Red Decorative Thread",
    description: "Vibrant red decorative thread ideal for adding beautiful accents and details to your sewing projects.",
    material: "Cotton",
    thickness: "Medium",
    tensileStrength: "Ne 60s",
    finishType: "Glossy",
    category: "Decorative",
    color: "Red",
    hexCode: "#FF0000"
  },
  {
    id: 8,
    image: img8,
    name: "Yellow Metallic Thread",
    description: "Shimmering yellow metallic thread to add sparkle and shine to embroidery and decorative sewing projects.",
    material: "Polyester",
    thickness: "Thin",
    tensileStrength: "Ne 40s",
    finishType: "Glossy",
    category: "Metallic",
    color: "Yellow",
    hexCode: "#FFFF00"
  },
  {
    id: 9,
    image: img9,
    name: "Red Elastic Thread",
    description: "Stretchy red elastic thread perfect for smocking, shirring, and other applications requiring flexibility.",
    material: "Polyester",
    thickness: "Medium",
    tensileStrength: "Ne 60s",
    finishType: "Matte",
    category: "Elastic",
    color: "Red",
    hexCode: "#FF0000"
  },
  {
    id: 10,
    image: img10,
    name: "Yellow Cotton Sewing Thread",
    description: "All-purpose yellow cotton thread for general sewing needs, providing strength and reliability.",
    material: "Cotton",
    thickness: "Medium",
    tensileStrength: "Ne 60s",
    finishType: "Matte",
    category: "Sewing",
    color: "Yellow",
    hexCode: "#FFFF00"
  },
  {
    id: 11,
    image: img11,
    name: "Red Embroidery Thread",
    description: "Fine red embroidery thread that creates beautiful, detailed designs with excellent color retention.",
    material: "Cotton",
    thickness: "Thin",
    tensileStrength: "Ne 90s",
    finishType: "Glossy",
    category: "Embroidery",
    color: "Red",
    hexCode: "#FF0000"
  },
  {
    id: 12,
    image: img12,
    name: "Yellow Quilting Thread",
    description: "Premium yellow quilting thread that glides smoothly through layers without breaking or tangling.",
    material: "Cotton",
    thickness: "Medium",
    tensileStrength: "Ne 40s",
    finishType: "Matte",
    category: "Quilting",
    color: "Yellow",
    hexCode: "#FFFF00"
  },
  {
    id: 13,
    image: img13,
    name: "Red Upholstery Thread",
    description: "Strong red upholstery thread designed for heavy fabrics and furniture projects requiring durability.",
    material: "Polyester",
    thickness: "Thick",
    tensileStrength: "Ne 40s",
    finishType: "Satin",
    category: "Upholstery",
    color: "Red",
    hexCode: "#FF0000"
  },
  {
    id: 14,
    image: img14,
    name: "Yellow Serger Thread",
    description: "High-quality yellow serger thread that produces clean, consistent stitches on overlocking machines.",
    material: "Polyester",
    thickness: "Thin",
    tensileStrength: "Ne 90s",
    finishType: "Matte",
    category: "Serger",
    color: "Yellow",
    hexCode: "#FFFF00"
  },
  {
    id: 15,
    image: img15,
    name: "Red Industrial Thread",
    description: "Heavy-duty red industrial thread for professional and commercial sewing applications.",
    material: "Polyester",
    thickness: "Thick",
    tensileStrength: "Ne 40s",
    finishType: "Matte",
    category: "Industrial",
    color: "Red",
    hexCode: "#FF0000"
  }
];

export default function ProductGallery() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Using your NavBar component */}
      <NavBar />
      
      {/* Page Title Section */}
      <div className="bg-blue-700 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">Our Premium Threads</h1>
          <p className="text-white text-center mt-2">Explore our high-quality cotton and polyester threads</p>
        </div>
      </div>
      
      {/* Image Gallery with Hover Effect */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productData.map((product) => (
            <div 
              key={product.id} 
              className="cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white group"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative pb-[100%]"> {/* Creates a square aspect ratio */}
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay with product name on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 w-full">
                    <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                    <div 
                      className="h-3 w-12 mt-2 mx-auto rounded-full" 
                      style={{ backgroundColor: product.hexCode }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Popup Modal for Product Details */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full p-0 overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold hover:bg-blue-800 z-10"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2 relative">
                <div className="relative pb-[100%] md:pb-0 md:h-full">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="md:w-1/2 p-6 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                
                <div className="flex items-center mb-6">
                  <div 
                    className="h-6 w-12 rounded mr-2" 
                    style={{ backgroundColor: selectedProduct.hexCode }}
                  ></div>
                  <span className="text-gray-600">{selectedProduct.color}</span>
                </div>
                
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                
                <div className="grid gap-y-3 mb-6">
                  <div className="grid grid-cols-2">
                    <div className="text-gray-500">Category:</div>
                    <div className="font-medium">{selectedProduct.category}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-gray-500">Material:</div>
                    <div className="font-medium">{selectedProduct.material}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-gray-500">Thickness:</div>
                    <div className="font-medium">{selectedProduct.thickness}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-gray-500">Tensile Strength:</div>
                    <div className="font-medium">{selectedProduct.tensileStrength}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-gray-500">Finish:</div>
                    <div className="font-medium">{selectedProduct.finishType}</div>
                  </div>
                </div>
                
                <button className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg transition-all duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}