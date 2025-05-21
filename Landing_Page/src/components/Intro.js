import React, { useEffect } from 'react';
import img from '../images/cotton-factory-team.jpg';
import { Link } from 'react-router-dom';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles

const Intro = () => {
    // Initialize AOS animation library
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        });
        // Refresh AOS on component mount
        AOS.refresh();
    }, []);

    return (
        <>
            <div className="m-auto max-w-6xl p-2 md:p-12 h-5/6" id='about'>
                <div className="flex flex-col-reverse lg:flex-row py-8 justify-between lg:text-left" data-aos="fade-up" data-aos-duration="1200">
                <div className="lg:w-3/5 flex flex-col lg:mx-4 justify-center" data-aos="fade-right" data-aos-delay="300">
    <img 
        alt="Cotton factory team" 
        className="rounded-t float-right h-[500px] object-cover transition-all duration-500 hover:scale-105 shadow-lg" 
        src={img} 
    />
</div>

                    <div 
                        className="flex-col my-4 text-center lg:text-left lg:my-0 lg:justify-end w-full lg:w-2/5 px-8" 
                        data-aos="fade-left" 
                        data-aos-delay="500"
                    >
                        <h3 className="text-3xl text-blue-900 font-bold transition-all duration-300 hover:text-blue-700">
                            Experts in Cotton Processing & Manufacturing Solutions
                        </h3>
                        <div data-aos="fade-up" data-aos-delay="600">
                            <p className='my-3 text-xl text-gray-600 font-semibold'>
                                We specialize in providing end-to-end cotton processing services, from raw fiber handling to high-quality yarn production.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="700">
                            <p className='my-3 text-xl text-gray-600 font-semibold'>
                                Our skilled team ensures precision, efficiency, and sustainability at every step — helping modern textile businesses scale effectively.
                            </p>
                        </div>
                        <Link 
                            to="/contact" 
                            className="text-white bg-blue-900 hover:bg-blue-800 inline-flex items-center justify-center w-full px-6 py-2 my-4 text-lg shadow-xl rounded-2xl sm:w-auto sm:mb-0 group transition-all duration-300 transform hover:-translate-y-1"
                            data-aos="zoom-in"
                            data-aos-delay="800"
                        >
                            Contact Us
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Intro;