import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DocsEngine from './engines/DocsEngine';
import { useTheme } from '../../theme/themeProvider';

interface OfficeAppProps {
  appType: 'word' | 'excel' | 'ppt' | 'access';
  onClose: () => void;
}

const OfficeApp: React.FC<OfficeAppProps> = ({ appType }) => {
  const theme = useTheme();
  
  const getDetails = () => {
    switch (appType) {
      case 'word':
        return { title: 'Univa Docs', color: theme.primary };
      case 'excel':
        return { title: 'Univa Sheets', color: '#22C55E' };
      case 'ppt':
        return { title: 'Univa Slides', color: '#d24726' };
      case 'access':
        return { title: 'Univa Database', color: '#a4373a' };
      default:
        return { title: 'Office', color: '#333' };
    }
  };

  const details = getDetails();

  return (
    <View style={styles.container}>
      <View style={styles.editorContainer}>
        {appType === 'word' ? (
          <DocsEngine />
        ) : (
          <View style={[styles.enginePlaceholder, { backgroundColor: '#111' }]}>
            <Text style={[styles.placeholderText, { color: details.color }]}>
              {details.title.toUpperCase()} ENGINE INITIALIZING
            </Text>
            <Text style={styles.placeholderSub}>Standalone native implementation loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  editorContainer: {
    flex: 1,
  },
  enginePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  placeholderSub: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  }
});

export default OfficeApp;
