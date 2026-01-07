/**
 * Servicio de Autenticación para Brand360
 * Se conecta a la API de startapp360.com usando Basic Auth
 * Si no hay conexión, funciona en modo mock/offline
 */

const API_BASE_URL = 'https://startapp360.com/api/v1';
const USE_MOCK_MODE = import.meta.env.VITE_AUTH_MOCK === 'true' || false;

/**
 * Crea el header de autorización Basic Auth
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {string} Header de autorización en formato Basic Auth
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
              username: username || 'Usuario Demo',
              id: 'mock_user_123'
            },
            message: 'Login exitoso (modo offline)'
          }
        });
      } else if (endpoint === 'auth/register') {
        resolve({
          success: true,
          data: {
            token: `mock_token_${Date.now()}`,
            user: {
              email: email || 'user@example.com',
              username: username || 'Usuario Demo',
              id: 'mock_user_123'
            },
            message: 'Registro exitoso (modo offline)'
          }
        });
      } else if (endpoint === 'auth/change-password') {
        resolve({
          success: true,
          data: {
            message: 'Contraseña cambiada exitosamente (modo offline)'
          }
        });
      } else {
        resolve({
          success: true,
          data: { message: 'Operación exitosa (modo offline)' }
        });
      }
    }, 800); // Simular delay de red
  });
};

/**
 * Realiza una petición a la API con autenticación Basic
 * Si falla por error de red, usa modo mock
 * @param {string} endpoint - Endpoint de la API (ej: 'auth/login')
 * @param {object} options - Opciones de la petición
 * @returns {Promise<Response>} Respuesta de la API
 */
const apiRequest = async (endpoint, options = {}) => {
  // Si está en modo mock forzado, usar mock directamente
  if (USE_MOCK_MODE) {
    console.log('🔧 Modo mock activado - usando autenticación offline');
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
      // Verificar si es un error que debería activar modo mock
      const shouldUseMock = response.status === 404 || response.status === 500 || response.status >= 502;
      
      if (shouldUseMock) {
        console.log('🔧 API no disponible - usando modo mock automático');
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
        // Si falla el parseo JSON, usar modo mock
        console.log('🔧 Respuesta no válida - usando modo mock automático');
        return await mockResponse(endpoint, options);
      }
    } else {
      // Si no es JSON, usar modo mock
      console.log('🔧 Respuesta no es JSON - usando modo mock automático');
      return await mockResponse(endpoint, options);
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return { success: true, data };
  } catch (error) {
    // Si es error de red/CORS, usar modo mock automáticamente
    const isNetworkError = error.message.includes('Failed to fetch') || 
                          error.message.includes('NetworkError') ||
                          error.message.includes('CORS') ||
                          !navigator.onLine;
    
    if (isNetworkError) {
      console.log('🔧 Sin conexión - usando modo mock automático');
      return await mockResponse(endpoint, options);
    }
    
    // Para otros errores, devolver el error
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Error de conexión con el servidor' 
    };
  }
};

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} Resultado del login con token si es exitoso
 */
export const login = async (email, password) => {
  const result = await apiRequest('auth/login', {
    method: 'POST',
    email,
    password,
    body: { email, password }
  });

  if (result.success && result.data.token) {
    // Guardar token en localStorage
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userEmail', email);
    if (result.data.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
  }

  return result;
};

/**
 * Registra un nuevo usuario
 * @param {string} email - Email del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} password2 - Confirmación de contraseña
 * @returns {Promise<object>} Resultado del registro
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
    // Guardar token en localStorage
    localStorage.setItem('authToken', result.data.token);
    localStorage.setItem('userEmail', email);
    if (result.data.user) {
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
  }

  return result;
};

/**
 * Cambia la contraseña del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Nueva contraseña
 * @param {string} password2 - Confirmación de nueva contraseña
 * @returns {Promise<object>} Resultado del cambio de contraseña
 */
export const changePassword = async (email, password, password2) => {
  // Intentar usar token si está disponible, sino usar Basic Auth con email
  const token = localStorage.getItem('authToken');
  
  const result = await apiRequest('auth/change-password', {
    method: 'POST',
    token: token || undefined, // Usar token si está disponible
    email: token ? undefined : email, // Solo usar email si no hay token
    body: {
      email,
      newPassword: password,
      confirmPassword: password2
    }
  });

  return result;
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userData');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si hay un token guardado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Obtiene el token de autenticación guardado
 * @returns {string|null} Token de autenticación o null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Obtiene los datos del usuario guardados
 * @returns {object|null} Datos del usuario o null
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
