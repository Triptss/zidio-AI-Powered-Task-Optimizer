import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
      ? 'bg-sky-700 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-sky-400">
              TaskNova
            </Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClasses} end>
                Home
              </NavLink>
              <NavLink to="/analyze" className={navLinkClasses}>
                Give Tasks (Analyze)
              </NavLink>
              <NavLink to="/add-task" className={navLinkClasses}>
                Add Task
              </NavLink>
              <NavLink to="/remove-tasks" className={navLinkClasses}>
                Remove Tasks
              </NavLink>
            </div>
          </nav>
          {/* Mobile menu button can be added here later if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;
