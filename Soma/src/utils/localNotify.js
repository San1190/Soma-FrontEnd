import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function scheduleLocal(title, body, data = {}, seconds = 1) {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: { seconds }
    });
  } catch {}
}
