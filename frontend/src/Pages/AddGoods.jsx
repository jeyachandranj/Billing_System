import React, { useState, useRef } from 'react';
import './AddGoods.css';
import axios from 'axios';



const AddGoods = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    colors: [],
    sizes: [],
    features: [],
    specifications: {
      material: '',
      length: '',
      thickness: '',
      tensileStrength: '',
      finish: ''
    },
    images:[]
  });

  const [newColor, setNewColor] = useState({ name: '', hexCode: '#cccccc' });
  const [newSize, setNewSize] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newImages, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);
  
  const threadCategories = [
    'Sewing Thread',
    'Embroidery Thread',
    'Quilting Thread',
    'Upholstery Thread',
    'Serger Thread',
    'Industrial Thread',
    'Decorative Thread',
    'Metallic Thread',
    'Elastic Thread'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (specifications)
      const [parent, child] = name.split('.');
      setProduct(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleColorAdd = () => {
    if (newColor.name.trim() && newColor.hexCode) {
      setProduct(prev => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }]
      }));
      setNewColor({ name: '', hexCode: '#cccccc' });
    }
  };

  const handleColorRemove = (index) => {
    setProduct(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSizeAdd = () => {
    if (newSize.trim()) {
      setProduct(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
      setNewSize('');
    }
  };

  const handleSizeRemove = (index) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setProduct(prev => ({
        ...prev,
        features: [...prev.features, newFeature]
      }));
      setNewFeature('');
    }
  };

  const handleFeatureRemove = (index) => {
    setProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageAdd = () => {
    if (newImages.trim()) {
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, newImages]
      }));
      setNewFeature('');
    }
  };

  const handleImageRemove = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      axios.post('http://localhost:3000/api/goods', product)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Product submitted:', product);
      
      // Reset form after successful submission
      setProduct({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        colors: [],
        sizes: [],
        features: [],
        specifications: {
          material: '',
          length: '',
          thickness: '',
          tensileStrength: '',
          finish: ''
        }
      });
      setImages([]);
      
   
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form fields not managed by React state
      formRef.current.reset();

      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="thread-product-container">
      <div className="form-header">
        <h2>Add New Thread Details</h2>
        <p>Enter the details below to add a new thread product to your inventory</p>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="thread-product-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="e.g. Premium Cotton Sewing Thread"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Thread Category</option>
              {threadCategories.map((category, index) => (
                <option key={index} value={category.toLowerCase().replace(' ', '-')}>
                  {category}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={product.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={product.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Thread Specifications</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specifications.material">Material</label>
              <input
                type="text"
                id="specifications.material"
                name="specifications.material"
                value={product.specifications.material}
                onChange={handleChange}
                placeholder="e.g. Cotton, Polyester, Silk"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specifications.length">Length</label>
              <input
                type="text"
                id="specifications.length"
                name="specifications.length"
                value={product.specifications.length}
                onChange={handleChange}
                placeholder="e.g. 500 yards"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specifications.thickness">Thickness</label>
              <input
                type="text"
                id="specifications.thickness"
                name="specifications.thickness"
                value={product.specifications.thickness}
                onChange={handleChange}
                placeholder="e.g. Ne 40s"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specifications.tensileStrength">Tensile Strength</label>
              <input
                type="text"
                id="specifications.tensileStrength"
                name="specifications.tensileStrength"
                value={product.specifications.tensileStrength}
                onChange={handleChange}
                placeholder="e.g. Medium, High"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="specifications.finish">Finish Type</label>
            <input
              type="text"
              id="specifications.finish"
              name="specifications.finish"
              value={product.specifications.finish}
              onChange={handleChange}
              placeholder="e.g. Glazed, Mercerized, Matte"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Colors</h3>
          <div className="color-input-container">
            <div className="color-input-group">
              <input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                placeholder="Color Name (e.g. Sky Blue)"
              />
              <input
                type="color"
                value={newColor.hexCode}
                onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})}
              />
            </div>
            <button type="button" className="btn-add" onClick={handleColorAdd}>Add Color</button>
          </div>
          
          <div className="color-chips">
            {product.colors.map((color, index) => (
              <div 
                key={index} 
                className="color-chip"
                style={{ backgroundColor: color.hexCode }}
              >
                <span>{color.name}</span>
                <button type="button" onClick={() => handleColorRemove(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Available Sizes</h3>
          <div className="tag-input-container">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Enter size (e.g. S, M, L or numeric)"
            />
            <button type="button" className="btn-add" onClick={handleSizeAdd}>Add Size</button>
          </div>
          
          <div className="tags">
            {product.sizes.map((size, index) => (
              <div key={index} className="tag">
                <span>{size}</span>
                <button type="button" onClick={() => handleSizeRemove(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Product Features</h3>
          <div className="tag-input-container">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Enter product feature"
            />
            <button type="button" className="btn-add" onClick={handleFeatureAdd}>Add Feature</button>
          </div>
          
          <div className="tags feature-tags">
            {product.features.map((feature, index) => (
              <div key={index} className="tag feature-tag">
                <span>{feature}</span>
                <button type="button" onClick={() => handleFeatureRemove(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Description</h3>
          <div className="form-group">
            <textarea
              id="description"
              name="description"
              rows="6"
              value={product.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of your thread product..."
              required
            ></textarea>
          </div>
        </div>
        

        <div className="form-section">
          <h3>Images</h3>
          <div className="tag-input-container">
            <input
              type="text"
              value={newImages}
              onChange={(e) => setImages(e.target.value)}
              placeholder="Enter image urls"
            />
            <button type="button" className="btn-add" onClick={handleImageAdd}>Add Image</button>
          </div>
          
          <div className="tags feature-tags">
            { product.images.map((image, index) => (
              <div key={index} className="tag feature-tag">
                <span>{image}</span>
                <button type="button" onClick={() => handleImageRemove(index)}>×</button>
              </div>
            ))}
          </div>
        </div>





        <div className="form-actions">
          <button type="button" className="btn-cancel">Cancel</button>
          <button 
            type="submit" 
            className={`btn-submit ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
            disabled={loading}
          >
            {loading ? 'Adding Product...' : success ? 'Product Added!' : 'Add Thread Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGoods;