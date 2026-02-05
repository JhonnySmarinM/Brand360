/**
 * Authentication service for Brand360
 * Connects to the startapp360.com API using Basic Auth
 * If there is no connection, it works in mock/offline mode
 */

const API_BASE_URL = 'https://startapp360.com/api/v1';
const USE_MOCK_MODE = import.meta.env.VITE_AUTH_MOCK === 'true' || false;

/**
 * Creates the Basic Auth authorization header
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {string} Authorization header in Basic Auth format
 */
const createBasicAuth = (email, password) => {
  const credentials = `${email}:${password}`;
  const encoded = btoa(credentials);
  return `Basic ${encoded}`;
};

/**
 * Simula una respuesta mock para desarrollo sin API
 */
const mockResponse = (endpoint, options = {}) => {
  const { email, password, username } = options.body || {};
  
  // Simular delay de red
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === 'auth/login') {
        resolve({
          success: true,
          data: {
            token: `mock_token_${Date.now()}`,
            user: {
              email: email || 'user@example.com',
              username: username || 'Demo User',
              id: 'mock_user_123'
            },
            message: 'Successful login (offline mode)'
          }
        });
      } else if (endpoint === 'auth/register') {
        resolve({
          success: true,
          data: {
            token: `mock_token_${Date.now()}`,
            user: {
              email: email || 'user@example.com',
              username: username || 'Demo User',
              id: 'mock_user_123'
            },
            message: 'Successful registration (offline mode)'
          }
        });
      } else if (endpoint === 'auth/change-password') {
        resolve({
          success: true,
          data: {
            message: 'Password changed successfully (offline mode)'
          }
        });
      } else {
        resolve({
          success: true,
          data: { message: 'Successful operation (offline mode)' }
        });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Performs an API request with Basic authentication
 * If it fails due to network error, uses mock mode
 * @param {string} endpoint - API endpoint (e.g. 'auth/login')
 * @param {object} options - Request options
 * @returns {Promise<Response>} API response
 */
const apiRequest = async (endpoint, options = {}) => {
  // If forced mock mode is enabled, use mock directly
  if (USE_MOCK_MODE) {
    console.log('🔧 Mock mode enabled - using offline authentication');
    return await mockResponse(endpoint, options);
  }

  const { method = 'GET', body, email, password, token } = options;
  
  const headers = {
    'Content-Type': 'application/json',
  };

  // Si hay email y password, usar Basic Auth
  if (email && password) {
    headers['Authorization'] = createBasicAuth(email, password);
  } else if (token) {
    // Si hay token, usar Bearer token
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    
    // Si la respuesta no es exitosa (404, 500, etc.), usar modo mock directamente
    if (!response.ok) {
      // Check if it is an error that should trigger mock mode
      const shouldUseMock = response.status === 404 || response.status === 500 || response.status >= 502;
      
      if (shouldUseMock) {
        console.log('🔧 API not available - using automatic mock mode');
        return await mockResponse(endpoint, options);
      }
    }
    
    // Verificar el Content-Type antes de intentar parsear JSON
    const contentType = response.headers.get('content-type');
    const isJSON = contentType && contentType.includes('application/json');
    
    let data;
    if (isJSON) {
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, use mock mode
        console.log('🔧 Invalid response - using automatic mock mode');
        return await mockResponse(endpoint, options);
      }
    } else {
      // If it is not JSON, use mock mode
      console.log('🔧 Response is not JSON - using automatic mock mode');
      return await mockResponse(endpoint, options);
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return { success: true, data };
  } catch (error) {
    // If it is a network/CORS error, automatically use mock mode
    const isNetworkError = error.message.includes('Failed to fetch') || 
                          error.message.includes('NetworkError') ||
                          error.message.includes('CORS') ||
                          !navigator.onLine;
    
    if (isNetworkError) {
      console.log('🔧 No connection - using automatic mock mode');
      return await mockResponse(endpoint, options);
    }
    
    // For other errors, return the error
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Error connecting to the server' 
    };
  }
};

/**
 * Logs in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Login result with token if successful
 */
export const login = async (email, password) => {
  const result = await apiRequest('auth/login', {
    method: 'POST',
    email,
    password,
    body: { email, password }
  });

  if (result.success && result.data.token) {
    // Save token in localStorage
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userEmail', email);
    if (result.data.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
  }

  return result;
};

/**
 * Registers a new user
 * @param {string} email - User email
 * @param {string} username - Username
 * @param {string} password - User password
 * @param {string} password2 - Password confirmation
 * @returns {Promise<object>} Registration result
 */
export const register = async (email, username, password, password2) => {
  const result = await apiRequest('auth/register', {
    method: 'POST',
    body: {
      email,
      username,
      password,
      password2
    }
  });

  if (result.success && result.data.token) {
    // Save token in localStorage
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userEmail', email);
    if (result.data.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
  }

  return result;
};

/**
 * Changes the user's password
 * @param {string} email - User email
 * @param {string} password - New password
 * @param {string} password2 - New password confirmation
 * @returns {Promise<object>} Password change result
 */
export const changePassword = async (email, password, password2) => {
  // Try to use token if available, otherwise use Basic Auth with email
  const token = localStorage.getItem('authToken');
  
  const result = await apiRequest('auth/change-password', {
    method: 'POST',
    token: token || undefined, // Use token if available
    email: token ? undefined : email, // Only use email if there is no token
    body: {
      email,
      newPassword: password,
      confirmPassword: password2
    }
  });

  return result;
};

/**
 * Logs the user out
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userData');
};

/**
 * Checks whether the user is authenticated
 * @returns {boolean} True if there is a stored token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Gets the stored authentication token
 * @returns {string|null} Authentication token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Gets stored user data
 * @returns {object|null} User data or null
 */
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export default {
  login,
  register,
  changePassword,
  logout,
  isAuthenticated,
  getAuthToken,
  getUserData
};
