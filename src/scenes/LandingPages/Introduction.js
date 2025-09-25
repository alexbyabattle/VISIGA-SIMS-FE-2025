import React from 'react';


// Get base URL
const baseUrl = window.location.origin;

const Introduction = () => {
    return (
        <section className="bg-[#0f172a] min-h-screen grid grid-cols-1 md:grid-cols-12">
            {/* Left side: 1 column for image */}
            <div className="md:col-span-3 flex items-center justify-center p-0 relative">
                <img
                    src={image.hailmary}
                    alt="GCLA Circular"
                    className="w-full h-full object-cover " // Cover the entire space
                />
            </div>


            {/* Middle side: 5 columns for text and buttons */}
            <div className="md:col-span-6 flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4">
                    St Mary's junior  Seminary Visiga
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-8">
                    St. Mary's Junior Seminary, under the Diocese of Dar es Salaam, is dedicated to nurturing young
                    men called to the priesthood. With a foundation in faith, discipline, and academic excellence,
                    the seminary provides a holistic education that prepares students spiritually and intellectually
                    for their vocation. Guided by the motto "Prayers, Work, Education, and Sports,
                    " the school fosters an environment where students grow in faith, excel academically,
                    and develop strong moral character. Through prayer, reflection, and service, St.
                    Mary’s shapes future priests to serve the Church with wisdom, humility, and devotion.
                </p>

                {/* Login and Register Buttons */}
                <div className="space-x-2 md:space-x-4">
                    <a
                        href={`${baseUrl}/login`}
                        className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </a>
                    <a
                        href={`${baseUrl}/register`}
                        className="bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
                    >
                        Register
                    </a>
                </div>
            </div>

            


            {/* Right side: 6 columns for background image */}
            <div className="md:col-span-3 flex items-center justify-center p-0 relative">
                <img
                    src={image.askofu3}
                    alt="Server Image"
                    className="w-[800px] h-[600px] object-cover" // Adjust size and ensure it covers the container
                />
            </div>

        </section>

    );
};

export default Introduction;
