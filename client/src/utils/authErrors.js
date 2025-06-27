import { toast } from 'react-toastify';
import { logout } from './logout';

export const forbiddenError = (setUser, setLoggedin) => {
  // Show error toast for forbidden access
  toast.error('Access Forbidden! You do not have permission to access this resource.', {
    position: "top-right",
    autoClose: 10000, // 10 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fca5a5'
    }
  });
  
  // Logout user
  logout(setUser, setLoggedin);
  
  return {
    success: false,
    message: 'Access Forbidden',
    statusCode: 403
  };
}

export const unauthorizedError = (setUser, setLoggedin) => {
  // Show error toast for unauthorized access
  toast.error('Unauthorized Access! Please login to continue.', {
    position: "top-right",
    autoClose: 10000, // 10 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fca5a5'
    }
  });
  
  // Logout user
  logout(setUser, setLoggedin);
  
  return {
    success: false,
    message: 'Unauthorized Access',
    statusCode: 401
  };
};

export const notFoundError = (message) => {
  // Show error toast for not found resources
  toast.error(message || 'Resource Not Found!', {
    position: "top-right",
    autoClose: 10000, // 10 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fca5a5'
    }
  });
  
  return {
    success: false,
    message: message || 'Resource Not Found',
    statusCode: 404
  };
}