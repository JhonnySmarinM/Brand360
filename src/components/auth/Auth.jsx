import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots } from 'react-loader-spinner';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login, register, changePassword } from '../../services/authService';

const Auth = () => {
    // Estados de formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    
    // Estados para validación
    const passwordMessage = '8-character password\nInclude letters and numbers\nSpecial characters/*-+';
    const [emailError, setEmailError] = useState('Please enter a valid email');
    const [emailValid, setEmailValid] = useState(false);
    const [passwordError, setPasswordError] = useState(passwordMessage);
    const [passwordValid, setPasswordValid] = useState(false);
    const [password2Error, setPassword2Error] = useState(passwordMessage);
    const [password2Valid, setPassword2Valid] = useState(false);
    const [usernameError, setUsernameError] = useState('Username must be at least 3 characters');
    const [usernameValid, setUsernameValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Funciones de validación
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Please enter a valid email');
            setEmailValid(false);
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email');
            setEmailValid(false);
            return false;
        }
        setEmailError('Email válido');
        setEmailValid(true);
        return true;
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError(passwordMessage);
            setPasswordValid(false);
            return false;
        }
        if (password.length < 8) {
            setPasswordError(passwordMessage);
            setPasswordValid(false);
            return false;
        }
        setPasswordError('Password válido');
        setPasswordValid(true);
        return true;
    };

    const validatePassword2 = (password, password2) => {
        if (!password2) {
            setPassword2Error(passwordMessage);
            setPassword2Valid(false);
            return false;
        }
        if (password2 !== password) {
            setPassword2Error('Passwords do not match');
            setPassword2Valid(false);
            return false;
        }
        if (password2.length < 8) {
            setPassword2Error(passwordMessage);
            setPassword2Valid(false);
            return false;
        }
        setPassword2Error('Password válido');
        setPassword2Valid(true);
        return true;
    };

    const validateUsername = (username) => {
        if (!username) {
            setUsernameError('Username must be at least 3 characters');
            setUsernameValid(false);
            return false;
        }
        if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters');
            setUsernameValid(false);
            return false;
        }
        setUsernameError('Username válido');
        setUsernameValid(true);
        return true;
    };

    // Handlers para validación en tiempo real
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
        if (password2) {
            validatePassword2(value, password2);
        }
    };

    const handlePassword2Change = (e) => {
        const value = e.target.value;
        setPassword2(value);
        validatePassword2(password, value);
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        validateUsername(value);
    };

    // Handlers de formularios
    const handleLogin = async () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        
        if (!isEmailValid || !isPasswordValid || !email || !password) {
            toast.error('Por favor completa todos los campos correctamente');
            return;
        }

        setIsLoading(true);
        try {
            const result = await login(email, password);
            
            if (result.success) {
                toast.success('¡Inicio de sesión exitoso! 🎉');
                // Opcional: redirigir o actualizar estado de la app
                // window.location.href = '/dashboard';
            } else {
                toast.error(result.error || 'Error en el inicio de sesión 😞');
            }
        } catch (error) {
            toast.error('Error en el inicio de sesión 😞');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isPassword2Valid = validatePassword2(password, password2);
        const isUsernameValid = validateUsername(username);
        
        if (!isEmailValid || !isPasswordValid || !isPassword2Valid || !isUsernameValid || 
            !email || !password || !password2 || !username) {
            toast.error('Por favor completa todos los campos correctamente');
            return;
        }

        setIsLoading(true);
        try {
            const result = await register(email, username, password, password2);
            
            if (result.success) {
                toast.success('¡Registro exitoso! 🎉');
                setIsRegistering(false);
                clearForm();
                // Opcional: redirigir o actualizar estado de la app
                // window.location.href = '/dashboard';
            } else {
                toast.error(result.error || 'Error en el registro ❌');
            }
        } catch (error) {
            toast.error('Error en el registro ❌');
            console.error('Register error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isPassword2Valid = validatePassword2(password, password2);
        
        if (!isEmailValid || !isPasswordValid || !isPassword2Valid || 
            !email || !password || !password2) {
            toast.error('Por favor completa todos los campos correctamente');
            return;
        }

        setIsLoading(true);
        try {
            const result = await changePassword(email, password, password2);
            
            if (result.success) {
                toast.success('¡Contraseña cambiada exitosamente! 🎉');
                setIsChangingPassword(false);
                setIsRegistering(false);
                clearForm();
            } else {
                toast.error(result.error || 'Error al cambiar contraseña ❌');
            }
        } catch (error) {
            toast.error('Error al cambiar contraseña ❌');
            console.error('Change password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setPassword2('');
        setUsername('');
        setEmailError('Please enter a valid email');
        setEmailValid(false);
        setPasswordError(passwordMessage);
        setPasswordValid(false);
        setPassword2Error(passwordMessage);
        setPassword2Valid(false);
        setUsernameError('Username must be at least 3 characters');
        setUsernameValid(false);
    };

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
        setIsChangingPassword(false);
        clearForm();
    };

    const toggleChangePassword = () => {
        setIsChangingPassword(true);
        setIsRegistering(false);
        clearForm();
    };

    const toogleLogin = () => {
        setIsRegistering(false);
        setIsChangingPassword(false);
        clearForm();
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={2000} />
            <AuthBox>
                {!isRegistering && !isChangingPassword ? (
                    <>
                        <Title>Iniciar Sesión</Title>
                        <InputWrapper>
                            <Input 
                                type="email" 
                                placeholder="email@example.com" 
                                value={email} 
                                onChange={handleEmailChange}
                            />
                            <ValidationMessage $isValid={emailValid}>{emailError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="Password" 
                                value={password} 
                                onChange={handlePasswordChange}
                            />
                            <Icon onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Icon>
                            <ValidationMessage $isValid={passwordValid}>{passwordError}</ValidationMessage>
                        </InputWrapper>
                        <Button 
                            onClick={handleLogin} 
                            disabled={isLoading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {isLoading ? <ThreeDots color="#fff" height={20} width={50} /> : 'Iniciar Sesión'}
                        </Button>
                        <Text>
                            <LinkText onClick={toggleRegister}>Registrarse</LinkText> | <LinkText onClick={toggleChangePassword}>Cambiar Contraseña</LinkText>
                        </Text>
                    </>
                ) : isRegistering ? (
                    <>
                        <Title>Registrarse</Title>
                        <InputWrapper>
                            <Input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={handleEmailChange}
                            />
                            <ValidationMessage $isValid={emailValid}>{emailError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type="text" 
                                placeholder="Username" 
                                value={username} 
                                onChange={handleUsernameChange}
                            />
                            <ValidationMessage $isValid={usernameValid}>{usernameError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="Password" 
                                value={password} 
                                onChange={handlePasswordChange}
                            />
                            <Icon onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Icon>
                            <ValidationMessage $isValid={passwordValid}>{passwordError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type={showPassword2 ? 'text' : 'password'} 
                                placeholder="Confirm Password" 
                                value={password2} 
                                onChange={handlePassword2Change}
                            />
                            <Icon onClick={toggleShowPassword2}>
                                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                            </Icon>
                            <ValidationMessage $isValid={password2Valid}>{password2Error}</ValidationMessage>
                        </InputWrapper>
                        <Button
                            onClick={handleRegister}
                            disabled={isLoading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {isLoading ? <ThreeDots color="#fff" height={20} width={50} /> : 'Registrarse'}
                        </Button>
                        <Text>
                            <LinkText onClick={toogleLogin}>Volver al Login</LinkText>
                        </Text>
                    </>
                ) : (
                    <>
                        <Title>Cambiar Contraseña</Title>
                        <InputWrapper>
                            <Input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={handleEmailChange}
                            />
                            <ValidationMessage $isValid={emailValid}>{emailError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="New Password" 
                                value={password} 
                                onChange={handlePasswordChange}
                            />
                            <Icon onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Icon>
                            <ValidationMessage $isValid={passwordValid}>{passwordError}</ValidationMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Input 
                                type={showPassword2 ? 'text' : 'password'} 
                                placeholder="Confirm New Password" 
                                value={password2} 
                                onChange={handlePassword2Change}
                            />
                            <Icon onClick={toggleShowPassword2}>
                                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                            </Icon>
                            <ValidationMessage $isValid={password2Valid}>{password2Error}</ValidationMessage>
                        </InputWrapper>
                        <Button
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {isLoading ? <ThreeDots color="#fff" height={20} width={50} /> : 'Cambiar Contraseña'}
                        </Button>
                        <Text>
                            <LinkText onClick={toogleLogin}>Volver al Login</LinkText>
                        </Text>
                    </>
                )}
            </AuthBox>
        </Container>
    );
};

export default Auth;

// ============================================
// ESTILOS STYLED-COMPONENTS
// ============================================

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
`;

const AuthBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 28rem;
  text-align: center;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #333;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #2176ff;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(33, 118, 255, 0.1);
  }
  
  &::placeholder {
    color: #6c757d;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #2176ff;
  color: white;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #1a5bb8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(33, 118, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Text = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 1rem;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const LinkText = styled.span`
  color: #2176ff;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #1a5bb8;
    text-decoration: underline;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`;

const Icon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2176ff;
  }
`;

const ValidationMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isValid' && prop !== '$isValid',
})`
  color: ${props => props.$isValid ? '#28a745' : '#dc3545'};
  font-size: 0.875rem;
  margin-top: 4px;
  text-align: left;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 1.2rem;
  white-space: pre-line;
`;
