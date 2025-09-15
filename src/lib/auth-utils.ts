import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function validateAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return {
      isAuthenticated: false,
      error: 'Authentication required'
    };
  }

  if (session.user.email !== 'hvinprimary@gmail.com') {
    return {
      isAuthenticated: false,
      error: 'Unauthorized access. Only hvinprimary@gmail.com is allowed.'
    };
  }

  return {
    isAuthenticated: true,
    user: session.user
  };
}

export async function validateReadOnlyAuth() {
  const session = await getServerSession(authOptions);
  
  // Allow read access for everyone, but only write access for authorized user
  if (session?.user?.email === 'hvinprimary@gmail.com') {
    return {
      isAuthenticated: true,
      user: session.user,
      canWrite: true
    };
  }

  return {
    isAuthenticated: false,
    user: null,
    canWrite: false
  };
}
