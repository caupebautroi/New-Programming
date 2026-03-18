import axiosClient from '../api/axiosClient';

export const login = async (credentials) => {
    return await axiosClient.post('/auth/login', credentials);
};

export const register = async (userData) => {
    // userData: { username, email, password }
    const response = await axiosClient.post('/auth/register', userData);
    return response;
};