import React from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  setSidebarOpen?: any;
  sidebarOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, setSidebarOpen, sidebarOpen }) => {

  const navigate = useNavigate();

  const headerClassName = `bg-blue-900 text-white py-4 shadow-md sticky top-0 z-50`;

  // Logout handler
  const handleClick = () => {
    // dispatch(expireUser()); // Clear user slice state in Redux
    // persister.purge(); // Clear persisted user slice in localStorage
    navigate("/login");
  };

  return (
    <header className={headerClassName}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Title - Hidden on Mobile */}
        <p className="text-xl font-semibold hidden md:block">
          {/* {headerTitle} */}
        </p>

        {/* Greeting and Toggle Button */}
        <div className="flex flex-row justify-between items-center w-full md:w-auto">
          {/* Greeting (Always left on mobile) */}
          <div className="flex items-center space-x-2">
            <span className="">Hi, {userName}</span>
            {/* Profile Icon (Hidden on Mobile) */}
            <svg
              data-testid="profile-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 mr-2 h-6 hidden md:block"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>

          {/* Toggle Button (children) - Always right on mobile */}
          
            <div data-testid="mobile-menu" className="ml-auto md:ml-0 mt-0">
              <Button
                className="md:hidden mr-4 p-2 rounded-md bg-white hover:bg-gray-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Open sidebar"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>

              <Button
                variant="primary"
                onClick={handleClick}
                className="hidden md:inline-block"
              >
                Log Out
              </Button>
            </div>
            
        </div>
      </div>
    </header>
  );
};

export default Header;