import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { 
  FileText, 
  Save, 
  Share2, 
  Bold, 
  Italic, 
  List, 
  Type,
  ChevronDown,
  Clock,
  Zap,
  Smile
} from 'lucide-react';
import { useTheme } from '../../../theme/themeProvider';
import { aiService } from '../../../services/aiService';

const DocsEngine: React.FC = () => {
  const theme = useTheme();
  const [content, setContent] = React.useState('Start writing your next masterpiece...');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleAiAction = async (action: 'summarize' | 'humanize') => {
    setIsProcessing(true);
    try {
      const response = action === 'summarize' 
        ? await aiService.summarize(content)
        : await aiService.humanize(content);
      
      if (response.status === 'success') {
        setContent(response.content);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fluent Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: theme.surfaceDark }]}>
        <View style={styles.toolbarGroup}>
           <FileText size={16} color={theme.primary} />
           <Text style={[styles.docTitle, { color: theme.text }]}>New Document</Text>
           <ChevronDown size={14} color={theme.textMuted} />
        </View>

        <View style={styles.toolbarActions}>
           <TouchableOpacity style={styles.iconBtn}><Save size={18} color={theme.text} /></TouchableOpacity>
           <TouchableOpacity style={styles.iconBtn}><Share2 size={18} color={theme.text} /></TouchableOpacity>
           <View style={[styles.divider, { backgroundColor: theme.border }]} />
           <TouchableOpacity 
             onPress={() => handleAiAction('summarize')}
             style={[styles.aiBtn, { backgroundColor: theme.primary }]}
             disabled={isProcessing}
           >
              <Zap size={14} color="#fff" />
              <Text style={styles.aiBtnText}>{isProcessing ? 'Thinking...' : 'Summarize'}</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={() => handleAiAction('humanize')}
             style={[styles.aiBtn, { backgroundColor: '#8B5CF6', marginLeft: 8 }]}
             disabled={isProcessing}
           >
              <Smile size={14} color="#fff" />
              <Text style={styles.aiBtnText}>Humanize</Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* Editor Ribbon */}
      <View style={[styles.ribbon, { backgroundColor: theme.surfaceLight, borderBottomColor: theme.border }]}>
         <View style={styles.ribbonTabs}>
            <Text style={[styles.ribbonTab, styles.activeTab, { color: theme.text }]}>Home</Text>
            <Text style={[styles.ribbonTab, { color: theme.textSecondary }]}>Insert</Text>
            <Text style={[styles.ribbonTab, { color: theme.textSecondary }]}>Layout</Text>
            <Text style={[styles.ribbonTab, { color: theme.textSecondary }]}>Review</Text>
         </View>
         <View style={styles.formatting}>
            <TouchableOpacity style={styles.formatBtn}><Bold size={16} color={theme.text} /></TouchableOpacity>
            <TouchableOpacity style={styles.formatBtn}><Italic size={16} color={theme.text} /></TouchableOpacity>
            <TouchableOpacity style={styles.formatBtn}><List size={16} color={theme.text} /></TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <TouchableOpacity style={styles.formatBtn}><Type size={16} color={theme.text} /></TouchableOpacity>
         </View>
      </View>

      {/* Canvas */}
      <ScrollView contentContainerStyle={styles.canvas}>
         <View style={[styles.page, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.editorContent, { color: theme.text }]}>
               {content}
            </Text>
         </View>
      </ScrollView>

      {/* Status Bar */}
      <View style={[styles.statusBar, { backgroundColor: theme.surfaceDark, borderTopColor: theme.border }]}>
         <Text style={[styles.statusText, { color: theme.textSecondary }]}>Words: {content.split(' ').length}</Text>
         <View style={styles.statusRight}>
            <Clock size={12} color={theme.textSecondary} />
            <Text style={[styles.statusText, { color: theme.textSecondary, marginLeft: 4 }]}>Saved to Cloud</Text>
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  toolbar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  toolbarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginHorizontal: 2,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  aiBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  ribbon: {
    height: 80,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  ribbonTabs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  ribbonTab: {
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0078D4',
  },
  formatting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  formatBtn: {
    padding: 4,
  },
  canvas: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#080808',
  },
  page: {
    width: '100%',
    maxWidth: 800,
    minHeight: 1000,
    padding: 60,
    borderRadius: 4,
    borderWidth: 1,
  },
  editorContent: {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'serif',
  },
  statusBar: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default DocsEngine;
