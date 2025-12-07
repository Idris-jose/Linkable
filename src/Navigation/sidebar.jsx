import React, { useState } from 'react';
import pfp from "../assets/pfp.jpeg";
import { Menu, X, Home, FileText, Layers, Book, Link, Palette, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { title: 'My Links', route: '/Mylinks', icon: <Link size={18} /> },
    { title: 'Customize', route: '/Customize', icon: <Palette size={18} /> },
    { title: 'Stickers', route: '/Stickers', icon: <Layers size={18} /> },
    { title: 'QR Code', route: '/Qrcode', icon: <QrCode size={18} /> },
];

const Sidebar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState(window.location.pathname);

    const handleNavClick = (route) => {
        setActiveRoute(route);
        setIsOpen(false); // Optionally close sidebar on mobile
    };

    return (
        <>
            {/* Hamburger Menu Button for Mobile */}
            <button
                className="md:hidden p-2 bg-gray-100 rounded fixed top-4 left-4 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`${isOpen ? 'block' : 'hidden'
                    } md:block w-64 h-screen bg-white shadow-2xl shadow-black/30 fixed p-4 transition-all duration-300 z-40`}
            >
                <h2 className="text-xl font-bold mb-4 text-black">Linkable</h2>
                <div className='flex items-center gap-2 mb-8'>
                    <img
                        src={user?.displayImage || pfp}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="Employer profile"
                    />
                    <div>
                        <h1 className='font-medium'>{user?.displayName || 'User'}</h1>
                        <p className='text-gray-600 text-sm'>@{user?.email?.split('@')[0] || 'user'}</p>
                    </div>
                </div>

                <div className='border-t border-gray-300 mb-4'></div>
                <nav>
                    {navItems.map((item) => (
                        <a
                            key={item.title}
                            href={item.route}
                            onClick={() => handleNavClick(item.route)}
                            className={`block p-2 text-gray-800 hover:bg-gray-300 rounded mb-2 ${activeRoute === item.route ? 'bg-blue-100 font-semibold' : ''
                                }`}
                        >
                            <div className='flex items-center gap-2'>
                                {item.icon}
                                <span className="ml-2 font-medium text-sm">{item.title}</span>
                            </div>

                        </a>
                    ))}
                </nav>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
