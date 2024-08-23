import React, { useState } from 'react';
import UnknownImageAvatar from '../Assets/UnknownImageAvatar.jpeg';

function Header() {
  const [activeLink, setActiveLink] = useState('');

  const handleClick = (event, link) => {
    event.preventDefault(); 
    setActiveLink(link);
  };

return (
    <header className="font-sans font-bold text-base flex w-full items-center justify-between bg-white bg-opacity-70 py-5 shadow-lg fixed top-0 pl-10 z-50">
        <div className="flex items-center px-3">
            <a className="flex items-center" href="/">
                <img
                    className="mr-4 h-18 w-18 rounded-full"
                    src="https://zubinfoundation.org/wp-content/uploads/2022/07/TZF-logo-svg-img.svg" 
                    alt="Logo" 
                    style={{ height: '60px' }}
                    loading="lazy"
                />
                <span className="text-black text-2xl">The Zubin Foundation</span>
            </a>
        </div>
        <nav className="flex justify-end items-center px-3 pr-10">
            <ol className="flex items-center space-x-4">
                <li>
                    <a
                        href="/events"
                        className={`px-4 py-2 rounded-md text-2xl ${activeLink === '/events' ? 'text-red' : 'text-darkgrey'} hover:text-blue transition duration-150 ease-in-out`}
                        onClick={(e) => handleClick(e, '/events')}
                    >
                        Events
                    </a>
                </li>
                <li>
                    <a
                        href="/dashboard"
                        className={`px-4 py-2 rounded-md text-2xl ${activeLink === '/dashboard' ? 'text-red' : 'text-darkgrey'} hover:text-blue transition duration-150 ease-in-out`}
                        onClick={(e) => handleClick(e, '/dashboard')}
                    >
                        Dashboard
                    </a>
                </li>
                <li>
                    <a
                        href="/admin"
                        className={`px-4 py-2 rounded-md text-2xl ${activeLink === '/admin' ? 'text-red' : 'text-darkgrey'} hover:text-blue transition duration-150 ease-in-out`}
                        onClick={(e) => handleClick(e, '/admin')}
                    >
                        Admin
                    </a>
                </li>
                <li>
                    <a
                        href="/profile"
                        className={`px-4 py-2 rounded-md flex items-center justify-center ${activeLink === '/profile' ? 'text-red' : 'text-white'} hover:text-customBlue transition duration-150 ease-in-out`}
                        onnClick={(e) => handleClick(e, '/profile')}   
                    >
                        <img
                            src={UnknownImageAvatar}
                            className="h-11 w-11 rounded-full"
                            alt="User Avatar"
                            loading="lazy"
                        />
                    </a>
                </li>
            </ol>
        </nav>
    </header>
);
}

export default Header;