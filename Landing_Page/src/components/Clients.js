import React from 'react';

const Clients = () => {
    const clientList = [
        "Green Cotton",
        "Oothukuli Cotton Mill",
        "Shri Krishna Cotton Mill"
    ];

    return (
        <div className="py-20 bg-gradient-to-b from-gray-50 to-gray-200">
            <section data-aos="fade-up" className="container mx-auto">
                <div className="mb-16 px-4">
                    <h2 className="text-center text-4xl text-blue-900 uppercase font-bold tracking-wider">Our Clients</h2>
                    <div className='flex justify-center my-6'>
                        <div className='w-32 border-b-4 border-blue-900'></div>
                    </div>
                    <h2 className="mt-8 mx-auto max-w-3xl text-center text-2xl lg:text-3xl font-semibold text-blue-800">
                        Trusted by leading cotton mills across the industry
                    </h2>
                </div>

                <div className="px-8 md:px-16" data-aos="fade-in" data-aos-delay="600">
                    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-10 text-center">
                        {clientList.map((client, index) => (
                            <div key={index} className="p-12 bg-white rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                                <p className="text-blue-900 text-2xl font-bold">{client}</p>
                                <div className="mt-4 h-1 w-16 bg-blue-900 mx-auto"></div>
                                <p className="mt-6 text-gray-600">Valued Partner</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Clients;