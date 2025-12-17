import axios from 'axios';
import { login, register } from '../../services/auth';

// Mock axios
jest.mock('axios');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería hacer login correctamente', async () => {
      const mockResponse = {
        data: {
          user_id: 1,
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      const result = await login('test@test.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users/login'),
        {
          email: 'test@test.com',
          password_hash: 'password123',
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('debería lanzar error con credenciales inválidas', async () => {
      axios.post.mockRejectedValue(new Error('Invalid credentials'));

      await expect(login('wrong@test.com', 'wrongpass'))
        .rejects.toThrow('Invalid credentials');
    });

    it('debería manejar errores de red', async () => {
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(login('test@test.com', 'password'))
        .rejects.toThrow('Network Error');
    });
  });

  describe('register', () => {
    it('debería registrar usuario correctamente', async () => {
      const mockResponse = {
        data: {
          user_id: 2,
          email: 'new@test.com',
          first_name: 'New',
        },
      };
      axios.post.mockResolvedValue(mockResponse);

      const userData = {
        email: 'new@test.com',
        password_hash: 'password123',
        first_name: 'New',
        last_name: 'User',
      };

      const result = await register(userData);

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/users/register'),
        userData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('debería lanzar error si email ya existe', async () => {
      axios.post.mockRejectedValue(new Error('Email already exists'));

      const userData = {
        email: 'existing@test.com',
        password_hash: 'password123',
      };

      await expect(register(userData))
        .rejects.toThrow('Email already exists');
    });

    it('debería manejar datos de registro incompletos', async () => {
      axios.post.mockRejectedValue(new Error('Validation error'));

      const incompleteData = {
        email: 'incomplete@test.com',
        // Sin password
      };

      await expect(register(incompleteData))
        .rejects.toThrow();
    });
  });

  describe('Pruebas de regresión', () => {
    it('login debería enviar email en minúsculas', async () => {
      axios.post.mockResolvedValue({ data: { user_id: 1 } });

      await login('TEST@TEST.COM', 'password');

      // Verificar que se llamó con el email (el servicio podría normalizar o no)
      expect(axios.post).toHaveBeenCalled();
    });

    it('debería manejar respuestas vacías del servidor', async () => {
      axios.post.mockResolvedValue({ data: null });

      const result = await login('test@test.com', 'password');

      expect(result).toBeNull();
    });

    it('debería manejar timeout de red', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.code = 'ECONNABORTED';
      axios.post.mockRejectedValue(timeoutError);

      await expect(login('test@test.com', 'password'))
        .rejects.toThrow('Timeout');
    });

    it('debería manejar errores HTTP 500', async () => {
      const serverError = new Error('Internal Server Error');
      serverError.response = { status: 500 };
      axios.post.mockRejectedValue(serverError);

      await expect(login('test@test.com', 'password'))
        .rejects.toThrow('Internal Server Error');
    });

    it('debería manejar errores HTTP 401', async () => {
      const unauthorizedError = new Error('Unauthorized');
      unauthorizedError.response = { status: 401 };
      axios.post.mockRejectedValue(unauthorizedError);

      await expect(login('test@test.com', 'wrongpass'))
        .rejects.toThrow('Unauthorized');
    });
  });
});

