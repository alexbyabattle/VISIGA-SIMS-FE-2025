import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';


const Header = () => {
    // Get base URL
    const baseUrl = window.location.origin;

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-[#040720] text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Left Side - Logo */}
                <div className="flex items-center space-x-2">
                    <img
                        src={image.visiga}
                        alt="visiga Logo"
                        className="w-12 h-12 rounded-full object-cover" // Small and circular image
                    />
                    <span className="text-2xl text-blue-600 font-bold">VISIGA-SMS</span>
                </div>

                {/* Middle - Navigation Links */}
                <nav className="hidden md:flex space-x-6">
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
                </nav>

                {/* Right Side - Menu Icon */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        <FaBars className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu for Mobile */}
            {isOpen && (
                <div className="md:hidden bg-blue-600">
                    <a
                        href={`${baseUrl}/login`}
                        className="block text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </a>
                    <a
                        href={`${baseUrl}/register`}
                        className="block text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
                    >
                        Register
                    </a>
                </div>
            )}
        </header>
    );
};

export default Header;
