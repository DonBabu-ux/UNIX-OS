import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import {
  Sparkles,
  X,
  Send,
  Zap,
  Smile,
  BookOpen,
  Globe,
  PenLine,
  ChevronDown,
  LogIn,
} from 'lucide-react';
import { useTheme } from '../theme/themeProvider';
import { aiService, ChatMessage } from '../services/aiService';
import { useUserStore } from '../state/slices/userSlice';

const { width: W, height: H } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const QUICK_PROMPTS = [
  { label: 'Summarize', prompt: 'Summarize this for me: ', icon: 'zap' },
  { label: 'Write Essay', prompt: 'Write an essay about: ', icon: 'book' },
  { label: 'Research', prompt: 'Research this topic: ', icon: 'globe' },
  { label: 'Humanize', prompt: 'Humanize this text: ', icon: 'smile' },
  { label: 'Break Down', prompt: 'Break down this goal into steps: ', icon: 'chevron' },
  { label: 'Improve', prompt: 'Improve this writing: ', icon: 'pen' },
];

const IconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={12} />,
  book: <BookOpen size={12} />,
  globe: <Globe size={12} />,
  smile: <Smile size={12} />,
  chevron: <ChevronDown size={12} />,
  pen: <PenLine size={12} />,
};

export const FloatingAIAssistant: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, username } = useUserStore();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<{ role: string; text: string }[]>([
    { role: 'assistant', text: `Hello! I'm your Univa Co-Pilot powered by Grok. Ask me to write, research, summarize, plan tasks, or anything else. ${!isAuthenticated ? '💡 Sign in to save your chat history.' : ''}` },
  ]);
  const [history, setHistory] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<ScrollView>(null);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await aiService.chat(history, userText);
      const botText = res.content;
      setMessages(prev => [...prev, { role: 'assistant', text: botText }]);

      // Only persist history if authenticated
      if (isAuthenticated) {
        setHistory(prev => [
          ...prev,
          { role: 'user', content: userText },
          { role: 'assistant', content: botText },
        ]);
      }
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[styles.fab, { backgroundColor: theme.primary }]}
        accessibilityLabel="Open AI Assistant"
      >
        <Sparkles size={22} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <View style={styles.backdrop}>
          {/* Dismiss tap area */}
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setOpen(false)} />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kavWrap}>
            <Animated.View
              entering={SlideInRight.springify().damping(18)}
              exiting={SlideOutRight.springify().damping(18)}
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  width: isWeb ? 420 : W,
                  height: isWeb ? H * 0.80 : H * 0.92,
                  borderRadius: isWeb ? 20 : 0,
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: isWeb ? 20 : 0,
                  marginRight: isWeb ? 20 : 0,
                  marginBottom: isWeb ? 20 : 0,
                },
              ]}
            >
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <View style={styles.headerLeft}>
                  <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                    <Sparkles size={16} color="#fff" />
                  </View>
                  <View>
                    <Text style={[styles.title, { color: theme.text }]}>Univa Co-Pilot</Text>
                    {isAuthenticated ? (
                      <Text style={[styles.status, { color: '#10B981' }]}>
                        ● {username} · History saved
                      </Text>
                    ) : (
                      <Text style={[styles.status, { color: theme.textMuted }]}>
                        Guest mode · Sign in to save history
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <X size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Guest prompt banner */}
              {!isAuthenticated && (
                <View style={[styles.guestBanner, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
                  <LogIn size={14} color={theme.primary} />
                  <Text style={[styles.guestText, { color: theme.primary }]}>
                    Sign in to save conversations across sessions
                  </Text>
                </View>
              )}

              {/* Quick Action Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={[styles.chipsRow, { borderBottomColor: theme.border }]}
                contentContainerStyle={styles.chipsContent}>
                {QUICK_PROMPTS.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => sendMessage(q.prompt)}
                    style={[styles.chip, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}
                  >
                    <Text style={{ color: theme.primary }}>{React.cloneElement(IconMap[q.icon] as React.ReactElement, { color: theme.primary })}</Text>
                    <Text style={[styles.chipText, { color: theme.text }]}>{q.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Messages */}
              <ScrollView
                ref={scrollRef}
                style={styles.messages}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((msg, i) => (
                  <View
                    key={i}
                    style={[styles.msgRow, msg.role === 'user' ? styles.userRow : styles.botRow]}
                  >
                    <View style={[
                      styles.bubble,
                      msg.role === 'user'
                        ? [styles.userBubble, { backgroundColor: theme.primary }]
                        : [styles.botBubble, { backgroundColor: theme.surfaceDark, borderColor: theme.border }],
                    ]}>
                      <Text style={[styles.msgText, { color: msg.role === 'user' ? '#fff' : theme.text }]}>
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                ))}

                {loading && (
                  <View style={styles.botRow}>
                    <View style={[styles.bubble, styles.botBubble, { backgroundColor: theme.surfaceDark, borderColor: theme.border, padding: 16 }]}>
                      <ActivityIndicator size="small" color={theme.primary} />
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Input */}
              <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.surfaceDark }]}>
                <TextInput
                  style={[styles.input, { color: theme.text, backgroundColor: theme.surface }]}
                  placeholder="Ask Grok anything..."
                  placeholderTextColor={theme.textMuted}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                  multiline
                />
                <TouchableOpacity
                  onPress={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={[styles.sendBtn, { backgroundColor: input.trim() && !loading ? theme.primary : theme.surfaceLight }]}
                >
                  <Send size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 88,
    right: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    boxShadow: '0px 8px 12px rgba(0,0,0,0.4)',
    zIndex: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 15, 23, 0.4)', // Deep grey-blue overlay
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  kavWrap: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  sheet: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    overflow: 'hidden',
    boxShadow: '-10px 0px 25px rgba(0,0,0,0.2)',
    backgroundColor: '#111827', // Premium dark grey-blue
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
  },
  title: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  status: { fontSize: 10, fontWeight: '700', marginTop: 1, opacity: 0.8 },
  guestBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1,
  },
  guestText: { fontSize: 12, fontWeight: '700', flex: 1 },
  chipsRow: { borderBottomWidth: 1, flexGrow: 0 },
  chipsContent: { padding: 12, gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
  messages: { flex: 1 },
  messagesContent: { padding: 20, gap: 14 },
  msgRow: { flexDirection: 'row', width: '100%' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 18 },
  userBubble: { borderBottomRightRadius: 4, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
  botBubble: { borderBottomLeftRadius: 4, borderWidth: 1 },
  msgText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  footer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 12,
    padding: 16, borderTopWidth: 1,
  },
  input: {
    flex: 1, minHeight: 48, maxHeight: 120,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 14, fontSize: 14, fontWeight: '500',
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
  },
});
