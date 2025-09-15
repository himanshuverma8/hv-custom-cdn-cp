'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session, status } = useSession();
  
  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user && session.user.email === 'hvinprimary@gmail.com';
  const user = isAuthenticated ? session.user : null;

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30">
        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600 dark:text-gray-300">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-gray-700/30">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || 'User'}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
            {user?.name || 'User'}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 bg-red-600/90 hover:bg-red-700/90 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      <LogIn className="w-4 h-4" />
      <span className="text-sm font-medium">Login with Google</span>
    </button>
  );
}
