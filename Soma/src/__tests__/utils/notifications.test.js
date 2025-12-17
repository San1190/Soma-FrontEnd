import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../../utils/notifications';

// Los mocks ya están configurados en jest.setup.js

describe('Notifications Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
  });

  describe('registerForPushNotificationsAsync', () => {
    it('debería retornar null en web', async () => {
      Platform.OS = 'web';
      
      const result = await registerForPushNotificationsAsync();
      
      expect(result).toBeNull();
    });

    it('debería obtener token cuando permisos están concedidos', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'test-token-123' });
      
      const result = await registerForPushNotificationsAsync();
      
      expect(result).toBe('test-token-123');
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
    });

    it('debería solicitar permisos si no están concedidos', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'new-token' });
      
      const result = await registerForPushNotificationsAsync();
      
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(result).toBe('new-token');
    });

    it('debería configurar canal de notificaciones en Android', async () => {
      Platform.OS = 'android';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'android-token' });
      Notifications.setNotificationChannelAsync = jest.fn();
      
      await registerForPushNotificationsAsync();
      
      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        'default',
        expect.objectContaining({
          name: 'default',
        })
      );
    });

    it('debería manejar rechazo de permisos', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' });
      Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' });
      
      // Mock alert
      global.alert = jest.fn();
      
      const result = await registerForPushNotificationsAsync();
      
      expect(global.alert).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('Pruebas de regresión', () => {
    it('debería manejar errores de la API de notificaciones', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockRejectedValue(new Error('API Error'));
      
      await expect(registerForPushNotificationsAsync()).rejects.toThrow('API Error');
    });

    it('no debería llamar a requestPermissions si ya están concedidos', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'token' });
      
      await registerForPushNotificationsAsync();
      
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('debería funcionar correctamente después de múltiples llamadas', async () => {
      Platform.OS = 'ios';
      Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'token-1' });
      
      const result1 = await registerForPushNotificationsAsync();
      
      Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'token-2' });
      const result2 = await registerForPushNotificationsAsync();
      
      expect(result1).toBe('token-1');
      expect(result2).toBe('token-2');
      expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(2);
    });
  });
});

