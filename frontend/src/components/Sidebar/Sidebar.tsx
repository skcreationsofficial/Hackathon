import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export interface SidebarLink {
  label: string;
  path: string;
}

interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Sidebar: React.FC<SidebarProps> = ({ links, isOpen, onClose, title }) => {
  
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const hasPathChanged = location.pathname !== previousPath.current;

    if (hasPathChanged && window.innerWidth < 768) {
      onClose(); // only close sidebar on real route change
    }

    previousPath.current = location.pathname;
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "backdrop-blur-sm pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`w-64 bg-blue-900 text-white shadow-lg fixed inset-y-0 left-0 transform z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}
      >
        <div className="h-full p-6 space-y-6">
          <div className="w-full  flex items-center justify-center rounded-lg shadow border-white border-2 border-rounded p-2 text-3xl font-semibold hidden md:block">
            {title}
          </div>

          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-white py-2 px-4 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-blue-500 text-white font-semibold border-b-4"
                    : "hover:bg-blue-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;