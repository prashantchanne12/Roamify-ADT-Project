import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Menu, X, User, LogOut, Heart, Bookmark, Hotel } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // Desktop profile dropdown open state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle desktop profile dropdown on click
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Home className="h-8 w-8 text-primary-500" strokeWidth={2} />
            <span className="ml-2 text-xl font-bold text-primary-500">Roamify</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'host' && (
                  <Link to="/host" className="text-sm font-medium text-neutral-700 hover:text-primary-500">
                    Hosting
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center text-sm font-medium text-neutral-700 hover:text-primary-500 focus:outline-none"
                  >
                    <span className="mr-1">{user?.name.split(' ')[0]}</span>
                    <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="h-8 w-8 object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition duration-150 ease-in-out ${isProfileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        Profile
                      </Link>
                      <Link to="/bookings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        My Bookings
                      </Link>
                      <Link to="/saved" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                        Saved Properties
                      </Link>
                      {user?.role === 'host' && (
                        <>
                          <Link to="/host/listings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                            My Listings
                          </Link>
                          <Link to="/host/bookings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                            Host Bookings
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-neutral-700 hover:text-primary-500">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <form onSubmit={handleSearch} className="p-2">
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-5 h-5 w-5 text-neutral-400" />
            </form>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </div>
                </Link>
                <Link
                  to="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Bookmark className="mr-3 h-5 w-5" />
                    My Bookings
                  </div>
                </Link>
                <Link
                  to="/saved"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Heart className="mr-3 h-5 w-5" />
                    Saved Properties
                  </div>
                </Link>
                {user?.role === 'host' && (
                  <>
                    <Link
                      to="/host"
                      className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Hotel className="mr-3 h-5 w-5" />
                        Host Dashboard
                      </div>
                    </Link>
                    <Link
                      to="/host/listings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 ml-6"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/host/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 ml-6"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Host Bookings
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-500 hover:bg-neutral-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-500 hover:bg-primary-600 m-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="py-2 px-4 text-center">Sign up</div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;