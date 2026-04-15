export const DarkTheme = {
  background: '#0B0F17',
  surface: 'rgba(18, 26, 42, 0.7)',
  surfaceLight: 'rgba(255, 255, 255, 0.05)',
  surfaceDark: 'rgba(0, 0, 0, 0.4)',
  text: '#FFFFFF',
  textSecondary: '#8E9AAB',
  textMuted: '#64748B',
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.2)',
  primary: '#0078D4', // Windows 11 blue
  accent: '#60CDFF',
  success: '#107C10',
  error: '#FF4343',
  warning: '#FFB900',
  glassEffect: {
    backgroundColor: 'rgba(18, 26, 42, 0.6)',
    backdropFilter: 'blur(30px) saturate(150%)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }
};

export const LightTheme = {
  background: '#F3F3F3',
  surface: 'rgba(255, 255, 255, 0.7)',
  surfaceLight: 'rgba(255, 255, 255, 0.9)',
  surfaceDark: 'rgba(0, 0, 0, 0.05)',
  text: '#000000',
  textSecondary: '#616161',
  textMuted: '#9E9E9E',
  border: 'rgba(0, 0, 0, 0.1)',
  borderLight: 'rgba(0, 0, 0, 0.05)',
  primary: '#0067B8',
  accent: '#005FB8',
  success: '#107C10',
  error: '#C42B1C',
  warning: '#9D5D00',
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(30px) saturate(150%)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  }
};

export type ThemeType = typeof DarkTheme;
