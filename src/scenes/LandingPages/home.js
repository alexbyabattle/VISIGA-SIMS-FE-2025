import React, { useState, useEffect } from 'react';


// Get base URL
const baseUrl = window.location.origin;

const Home = () => {
    const images = [image.askofu, image.waseminari, image.visiga];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000); // Change image every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [images.length]);

    return (
        <div className="flex flex-col min-h-screen bg-[#0f172a]">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row flex-grow">
                {/* Right side: 6 columns for background image */}
                <div className="md:w-1/2 flex items-center justify-center p-0 relative">
                    <div className="w-[15cm] h-[15cm] flex items-center justify-center">
                        <img
                            src={images[currentImageIndex]}
                            alt="Server Image"
                            className="w-full h-full object-cover" // Ensure the image covers the container
                        />
                    </div>
                </div>

                {/* Middle side: 6 columns for text and buttons */}
                <div className="md:w-1/2 flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                        ST MARY'S JUNIOR SEMINARY VISIGA
                    </h1>

                    <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8">
                        "Welcome to the St. Mary's Junior Seminary School Management System! We're delighted to have you join us.
                        This platform is designed to streamline administrative tasks, enhance communication,
                        and foster a more efficient learning environment for our students. We hope you find it a valuable tool
                        in supporting the educational journey at St. Mary's."
                    </p>

                    {/* Login and Register Buttons */}
                    <div className="relative bg-[#3c29f2] p-10 rounded-3xl transform rotate-3 shadow-xl w-80">
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full text-[#08637c] font-semibold text-lg shadow">
                            For Parents & Teachers
                        </div>
                        <div className="flex justify-center mt-6">
                            <a
                                href={`${baseUrl}/login`}
                                className="bg-green-600 text-white font-bold py-3 px-8 rounded-full border border-green-600 text-lg hover:bg-green-700 hover:text-white transition duration-300"
                            >
                                Login
                            </a>
                        </div>
                    </div>



                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-[#040720] text-white text-center py-4">
                <p>&copy; 2025 VISIGA-SEMINARY - SMS. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;