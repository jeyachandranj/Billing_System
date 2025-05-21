import React from 'react';

const CottonProducts = () => {
    return (
        <>
            <div className="my-4 py-4" id='products'>
                <h2 className="my-2 text-center text-3xl text-blue-900 uppercase font-bold">Products</h2>
                <div className='flex justify-center'>
                    <div className='w-24 border-b-4 border-blue-900 mb-8'></div>
                </div>

                <div className="px-4" data-aos="fade-down" data-aos-delay="600">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">                            
                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3 min-h-max">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Cotton Dropping Waste</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our premium Cotton Dropping Waste is carefully collected and processed to provide high-quality material for various industrial applications. This by-product of cotton processing is eco-friendly and cost-effective, making it an excellent choice for sustainable manufacturing practices. 
                                    Ideal for padding, insulation, and textile recycling industries.
                                </p>
                                
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Cotton Yarn Waste</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our Cotton Yarn Waste is sourced from spinning mills and textile factories, providing a versatile and affordable material for numerous applications. This product is perfect for creating affordable yarn blends, manufacturing paper products, and developing innovative eco-friendly materials.
                                    We ensure consistent quality with proper sorting and processing methods.
                                </p>
                                
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Organic Cotton</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our certified Organic Cotton is grown without harmful pesticides or synthetic fertilizers, making it environmentally friendly and safer for farmers and end users. This premium cotton variety features exceptional softness, breathability, and durability, perfect for high-quality textiles and sustainable fashion.
                                    Available in various grades to meet different manufacturing requirements.
                                </p>
                                
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Raw Cotton</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our Raw Cotton is harvested from selected farms to ensure the highest quality fibers. With consistent staple length and strength, our raw cotton meets the standards of textile manufacturers worldwide. We offer various grades suitable for different applications, from premium clothing to industrial uses.
                                    Available in bulk quantities with competitive pricing.
                                </p>
                                
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Cotton</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our standard Cotton product offers excellent quality and versatility for a wide range of textile applications. Processed to meet industry standards, this cotton provides the perfect balance of quality and affordability. Suitable for everyday clothing, home textiles, and various industrial uses.
                                    We ensure consistent supply with flexible delivery options.
                                </p>
                                
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:scale-105 rounded-lg shadow-2xl p-3">
                            <div className="m-2 text-justify text-sm">
                                <h4 className="font-semibold my-4 text-lg md:text-2xl text-center mb-4 h-12">Cotton Waste</h4>
                                <p className="text-md font-medium leading-5 h-auto md:h-48">
                                    Our Cotton Waste product consists of various cotton by-products collected during different stages of processing. This versatile material can be repurposed for numerous applications including cleaning materials, low-cost yarn production, padding, and more. 
                                    An environmentally responsible choice that helps reduce textile waste while providing cost-effective raw material.
                                </p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CottonProducts;