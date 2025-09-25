import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, X } from 'lucide-react';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'profile' | 'settings' | 'signin'>('profile');
  const [isSignedIn, setIsSignedIn] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
    setActiveView('profile');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setActiveView('signin');
  };

  const renderSignInForm = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Hestia</h2>
      
      <div className="space-y-4 mb-6">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Sign in with Google
        </button>
        <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Sign in with GitHub
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="#" className="text-green-600 text-sm hover:underline">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
          <p className="text-gray-600">john.doe@example.com</p>
          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Premium Member
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button 
          onClick={() => setActiveView('settings')}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Settings</span>
        </button>
        
        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Notifications</span>
        </button>
        
        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
          <Shield className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Privacy & Security</span>
        </button>
        
        <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700">Help & Support</span>
        </button>
        
        <div className="border-t border-gray-200 pt-2 mt-4">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setActiveView('profile')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Appearance</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">Dark mode</span>
              <input type="checkbox" className="rounded" />
            </label>
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">High contrast</span>
              <input type="checkbox" className="rounded" />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">Email notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">Push notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Data & Privacy</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">Data collection</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-gray-700">Analytics cookies</span>
              <input type="checkbox" className="rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            {!isSignedIn ? 'Sign In' : activeView === 'settings' ? 'Settings' : 'Profile'}
          </h1>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSignedIn ? renderSignInForm() : 
         activeView === 'settings' ? renderSettings() : renderProfile()}
      </div>
    </>
  );
};