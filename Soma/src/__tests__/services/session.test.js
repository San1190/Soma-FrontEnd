import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setItem,
  getItem,
  deleteItem,
  saveUserSession,
  getUserSession,
  clearUserSession,
} from '../../services/session';

// Mock de los módulos
jest.mock('expo-secure-store');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Session Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Por defecto, simulamos mobile
    Platform.OS = 'ios';
  });

  describe('setItem', () => {
    it('debería usar SecureStore en mobile', async () => {
      Platform.OS = 'ios';
      await setItem('testKey', 'testValue');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('debería usar AsyncStorage en web', async () => {
      Platform.OS = 'web';
      await setItem('testKey', 'testValue');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
    });
  });

  describe('getItem', () => {
    it('debería obtener valor con SecureStore en mobile', async () => {
      Platform.OS = 'android';
      SecureStore.getItemAsync.mockResolvedValue('storedValue');
      
      const result = await getItem('testKey');
      
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('testKey');
      expect(result).toBe('storedValue');
    });

    it('debería obtener valor con AsyncStorage en web', async () => {
      Platform.OS = 'web';
      AsyncStorage.getItem.mockResolvedValue('webValue');
      
      const result = await getItem('testKey');
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toBe('webValue');
    });

    it('debería retornar null si no existe', async () => {
      Platform.OS = 'ios';
      SecureStore.getItemAsync.mockResolvedValue(null);
      
      const result = await getItem('nonexistent');
      
      expect(result).toBeNull();
    });
  });

  describe('deleteItem', () => {
    it('debería eliminar con SecureStore en mobile', async () => {
      Platform.OS = 'ios';
      await deleteItem('testKey');
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('testKey');
    });

    it('debería eliminar con AsyncStorage en web', async () => {
      Platform.OS = 'web';
      await deleteItem('testKey');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
    });
  });

  describe('saveUserSession', () => {
    it('debería guardar usuario correctamente', async () => {
      Platform.OS = 'ios';
      const user = { id: 1, email: 'test@test.com' };
      
      await saveUserSession(user);
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user)
      );
    });

    it('debería manejar errores al guardar', async () => {
      Platform.OS = 'ios';
      SecureStore.setItemAsync.mockRejectedValue(new Error('Storage error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await saveUserSession({ id: 1 });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getUserSession', () => {
    it('debería obtener y parsear usuario', async () => {
      Platform.OS = 'ios';
      const user = { id: 1, email: 'test@test.com' };
      SecureStore.getItemAsync.mockResolvedValue(JSON.stringify(user));
      
      const result = await getUserSession();
      
      expect(result).toEqual(user);
    });

    it('debería retornar null si no hay sesión', async () => {
      Platform.OS = 'ios';
      SecureStore.getItemAsync.mockResolvedValue(null);
      
      const result = await getUserSession();
      
      expect(result).toBeNull();
    });

    it('debería manejar errores de parsing', async () => {
      Platform.OS = 'ios';
      SecureStore.getItemAsync.mockResolvedValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await getUserSession();
      
      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('clearUserSession', () => {
    it('debería eliminar la sesión correctamente', async () => {
      Platform.OS = 'ios';
      
      await clearUserSession();
      
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user');
    });

    it('debería manejar errores al eliminar', async () => {
      Platform.OS = 'ios';
      SecureStore.deleteItemAsync.mockRejectedValue(new Error('Delete error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await clearUserSession();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería manejar valores con caracteres especiales', async () => {
      Platform.OS = 'ios';
      const specialValue = '{"data": "test@#$%^&*()"}';
      
      await setItem('special', specialValue);
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('special', specialValue);
    });

    it('debería manejar claves vacías', async () => {
      Platform.OS = 'ios';
      
      await setItem('', 'value');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('', 'value');
    });

    it('debería manejar valores vacíos', async () => {
      Platform.OS = 'ios';
      
      await setItem('key', '');
      
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('key', '');
    });

    it('debería funcionar correctamente en Android', async () => {
      Platform.OS = 'android';
      const user = { id: 1 };
      
      await saveUserSession(user);
      
      expect(SecureStore.setItemAsync).toHaveBeenCalled();
    });
  });
});

