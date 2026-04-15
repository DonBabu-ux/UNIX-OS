import * as React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';

const WordApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [content, setContent] = React.useState('');

  return (
    <View style={styles.container}>
      {/* Ribbon Bar */}
      <View style={styles.ribbon}>
         <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>← File</Text>
         </TouchableOpacity>
         <View style={styles.ribbonTabs}>
            <Text style={[styles.tab, styles.activeTab]}>Home</Text>
            <Text style={styles.tab}>Insert</Text>
            <Text style={styles.tab}>Layout</Text>
         </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
         <TouchableOpacity style={styles.toolIcon}><Text style={styles.toolText}>B</Text></TouchableOpacity>
         <TouchableOpacity style={styles.toolIcon}><Text style={styles.toolText}>I</Text></TouchableOpacity>
         <TouchableOpacity style={styles.toolIcon}><Text style={styles.toolText}>U</Text></TouchableOpacity>
         <View style={styles.divider} />
         <Text style={styles.fontInfo}>Calibri (Body) ▼</Text>
         <Text style={styles.fontInfo}>11 ▼</Text>
      </View>

      {/* Document Area */}
      <ScrollView style={styles.documentArea} contentContainerStyle={styles.scrollContent}>
         <View style={styles.page}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Start writing your document..."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              autoFocus
            />
         </View>
      </ScrollView>

      {/* Status Bar */}
      <View style={styles.detailsBar}>
         <Text style={styles.detailsText}>Page 1 of 1 | {content.split(/\s+/).filter(x => x).length} words</Text>
         <Text style={styles.detailsText}>100% [—|—]</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f1',
  },
  ribbon: {
    height: 48,
    backgroundColor: '#2b579a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ribbonTabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
  },
  activeTab: {
    opacity: 1,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  toolbar: {
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#edebe9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 15,
  },
  toolIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolText: {
    fontWeight: 'bold',
    color: '#323130',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#edebe9',
  },
  fontInfo: {
    fontSize: 12,
    color: '#323130',
    backgroundColor: '#f3f2f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  documentArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  page: {
    width: Platform.OS === 'web' ? 800 : '95%',
    minHeight: 1100,
    backgroundColor: '#fff',
    padding: 60,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)' as any,
  },
  input: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    textAlignVertical: 'top',
  },
  detailsBar: {
    height: 24,
    backgroundColor: '#2b579a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  detailsText: {
    color: '#fff',
    fontSize: 11,
  },
});

export default WordApp;
