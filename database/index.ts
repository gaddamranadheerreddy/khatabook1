import { Platform } from 'react-native';

export * from Platform.OS === 'web'
  ? './web/service'
  : './native/service';
