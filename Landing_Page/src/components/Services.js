import React, { useEffect } from 'react';
// Image imports - you'll need to create/source these SVG files
import img1 from '../images/cotton-sorting.jpeg'; // Cotton Waste Sorting SVG
import img2 from '../images/cotton-recycling.jpeg'; // Cotton Recycling SVG
import img3 from '../images/cotton-yarn.jpeg'; // Yarn Production SVG
import img4 from '../images/cotton-quality.jpeg'; // Quality Testing SVG
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        });
        AOS.refresh();
    }, []);

    return (
        <div id="services" className="bg-gray-100 py-12">
            <section data-aos="zoom-in-down" data-aos-duration="800">
                <div className="my-4 py-4">
                    <h2 className="my-2 text-center text-3xl text-blue-900 uppercase font-bold">Our Services</h2>
                    
                    <div className='flex justify-center'>
                        <div className='w-24 border-b-4 border-blue-900'></div>
                    </div>
                    <h2 className="mt-4 mx-12 text-center text-xl lg:text-2xl font-semibold text-blue-900">
                        Transforming Cotton Waste into Premium Textile Resources
                    </h2>
                </div>

                <div className="px-12" data-aos="fade-up" data-aos-delay="400">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:bg-blue-800 hover:text-white rounded-lg shadow-2xl p-3 group">
                            <div className="m-2 text-justify text-sm">
                                <img alt="Cotton Waste Sorting" className="rounded-t group-hover:scale-[1.15] transition duration-1000 ease-in-out" src={img1} />
                                <h2 className="font-semibold my-4 text-2xl text-center">Waste Cotton Sorting</h2>
                                <p className="text-md font-medium">
                                    Our advanced sorting facility processes industrial cotton waste, categorizing materials by quality, fiber length, and purity to maximize recycling potential and value.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:bg-blue-800 hover:text-white rounded-lg shadow-2xl p-3 group">
                            <div className="m-2 text-justify text-sm">
                                <img alt="Cotton Recycling" className="rounded-t group-hover:scale-[1.15] transition duration-1000 ease-in-out" src={img2} />
                                <h2 className="font-semibold my-4 text-2xl text-center">Cotton Recycling</h2>
                                <p className="text-md font-medium">
                                    Using eco-friendly processes, we transform cotton waste into clean, reusable fiber through our proprietary cleaning, decontamination, and regeneration systems.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:bg-blue-800 hover:text-white rounded-lg shadow-2xl p-3 group">
                            <div className="m-2 text-justify text-sm">
                                <img alt="Yarn Production" className="rounded-t group-hover:scale-[1.15] transition duration-1000 ease-in-out" src={img3} />
                                <h2 className="font-semibold my-4 text-2xl text-center">Recycled Yarn Production</h2>
                                <p className="text-md font-medium">
                                    Our spinning facility converts processed cotton fibers into high-quality recycled yarns in various counts and qualities for diverse textile applications.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white transition-all ease-in-out duration-400 overflow-hidden text-gray-700 hover:bg-blue-800 hover:text-white rounded-lg shadow-2xl p-3 group">
                            <div className="m-2 text-justify text-sm">
                                <img alt="Quality Testing" className="rounded-t group-hover:scale-[1.15] transition duration-1000 ease-in-out" src={img4} />
                                <h2 className="font-semibold my-4 text-2xl text-center">Quality Assurance</h2>
                                <p className="text-md font-medium">
                                    Our laboratory conducts rigorous testing on all recycled cotton products, ensuring consistent quality, strength, and performance for your manufacturing needs.
                                </p>
                            </div>
                        </div>                    
                    </div>
                </div>
            </section>

            <section>
                <div className="m-auto max-w-6xl p-2 md:p-12 h-5/6">
                    <div className="flex flex-col-reverse lg:flex-row py-8 justify-between lg:text-left" data-aos="fade-right" data-aos-duration="1000">
                        <div className="lg:w-1/2 flex flex-col lg:mx-4 justify-center">
                            <div className='text-blue-900 mb-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" className='fill-current'>
                                    <path d="M20.92 12.62a1 1 0 0 0-.21-.33l-3-3a1 1 0 0 0-1.42 1.42l1.3 1.29H12a1 1 0 0 0 0 2h5.59l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76zm-8.31 1.71a1 1 0 0 0-1.42 0l-1.29 1.3V10a1 1 0 0 0-2 0v5.63l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 .33.21.94.94 0 0 0 .76 0 1 1 0 0 0 .33-.21l3-3a1 1 0 0 0 0-1.42zm6.18-9.33A12 12 0 1 0 4.21 19.79 12 12 0 0 0 18.79 5.21zm-1.42 13.16A10 10 0 1 1 19 12a9.89 9.89 0 0 1-1.63 6.37z"></path>
                                </svg>
                            </div>
                            <h3 className="text-3xl text-blue-900 font-bold">We <span className='font-black'>Recycle</span></h3>
                            <div>
                                <p className='my-3 text-xl text-gray-600 font-semibold'>
                                    With over 35 years of experience in cotton processing and a commitment to sustainability, we transform textile waste into valuable resources. Our eco-friendly processes reduce landfill waste while providing high-quality recycled cotton products for manufacturers.
                                </p>
                            </div>
                        </div>
                        <div className="lg:w-1/2 flex flex-col lg:mx-4 justify-center" data-aos="fade-left" data-aos-delay="400" data-aos-duration="1000">
                            <div className='text-blue-900 mb-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" className='fill-current'>
                                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                                    <path d="M13 7h-2v6h6v-2h-4z"></path>
                                </svg>
                            </div>
                            <h3 className="text-3xl text-blue-900 font-bold">We <span className='font-black'>Innovate</span></h3>
                            <div>
                                <p className='my-3 text-xl text-gray-600 font-semibold'>
                                    Our research and development team continuously explores new methods to improve cotton recycling efficiency and product quality. We customize solutions for clients seeking to incorporate sustainable materials into their manufacturing processes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Services;