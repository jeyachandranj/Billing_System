import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings, CheckCircle, Clock, AlertTriangle, X, ChevronRight, FileText,Pen } from 'lucide-react';

const Header = ({ userName, userSignature, handleLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Sample notifications data - replace with your actual data
  const notifications = [
    {
      id: 1,
      type: 'signature_request',
      title: 'Signature Request',
      message: 'John Doe requested your signature on "Contract Agreement"',
      time: '5 minutes ago',
      status: 'unread',
      icon: <FileText className="w-4 h-4 text-blue-500" />
    },
    {
      id: 2,
      type: 'document_signed',
      title: 'Document Signed',
      message: 'Sarah Williams signed "Project Proposal"',
      time: '1 hour ago',
      status: 'unread',
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      id: 3,
      type: 'document_expiring',
      title: 'Document Expiring',
      message: 'NDA Agreement expires in 2 days',
      time: 'Yesterday',
      status: 'read',
      icon: <Clock className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 4,
      type: 'document_expired',
      title: 'Document Expired',
      message: 'Service Agreement has expired',
      time: '3 days ago',
      status: 'read',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  ];
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  
  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef, notificationsRef]);
  
  // Get initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return "M";
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {userName || "Master"}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/pricing-plans">
            <button className="text-gray-600 hover:text-gray-900">My Signatures</button>
          </Link>
          
          {/* Notifications Button and Popup */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="relative"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsUserMenuOpen(false);
              }}
            >
              <Bell className={`w-6 h-6 ${isNotificationsOpen ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Popup */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  <div className="flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                  </div>
                </div>
                
                <div className="overflow-y-auto max-h-72">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 relative ${
                            notification.status === 'unread' ? 'bg-blue-50' : ''
                          }`}
                        >
                          {notification.status === 'unread' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                          )}
                          <div className="flex">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                {notification.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                              </div>
                              <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>
                
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <Link 
                    to="/notifications"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    View all notifications
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu Button and Popup */}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center" 
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotificationsOpen(false);
              }}
            >
              {userSignature ? (
                <img 
                  src={userSignature} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium border-2 border-white shadow-sm">
                  {getInitials(userName)}
                </div>
              )}
            </button>
            
            {/* User popup menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    {userSignature ? (
                      <img 
                        src={userSignature} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-medium border-2 border-white shadow">
                        {getInitials(userName)}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{userName || "Master"}</div>
                      <div className="text-sm text-gray-500">User</div>
                    </div>
                  </div>
                  
                  {userSignature && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Your Signature</p>
                      <div className="bg-white p-2 rounded-md border border-gray-200">
                        <img 
                          src={userSignature} 
                          alt="Signature" 
                          className="h-12 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Profile
                  </Link>
                  <Link 
                    to="/sign-1" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                    >
                        <Pen className="w-4 h-4 mr-2 text-gray-500" />
                    Signatures
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2 text-gray-500" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;