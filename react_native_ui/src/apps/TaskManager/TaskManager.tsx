import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';
import {
  Plus,
  X,
  Sparkles,
  Zap,
  BookOpen,
  Search,
  Globe,
  Smile,
  PenLine,
  ChevronDown,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Clock,
  Flag,
  Send,
  User,
  LogIn,
} from 'lucide-react';
import { useTheme } from '../../theme/themeProvider';
import { aiService, ChatMessage } from '../../services/aiService';
import { useUserStore } from '../../state/slices/userSlice';
import { useResponsive } from '../../state/ResponsiveManager';

const { width: W } = Dimensions.get('window');

type Priority = 'high' | 'medium' | 'low';
type Status = 'pending' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  createdAt: string;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#FF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const CATEGORIES = ['All', 'Work', 'Personal', 'Research', 'Writing', 'Finance'];

// ─── Auth Modal ─────────────────────────────────────────────────────────────────
const AuthModal: React.FC<{ visible: boolean; onClose: () => void; onLogin: (name: string) => void }> = ({
  visible, onClose, onLogin,
}) => {
  const theme = useTheme();
  const [name, setName] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={authStyles.overlay}>
        <Animated.View entering={SlideInDown} style={[authStyles.sheet, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
          <View style={authStyles.handle} />

          <View style={authStyles.header}>
            <Sparkles size={24} color={theme.primary} />
            <Text style={[authStyles.title, { color: theme.text }]}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            <Text style={[authStyles.subtitle, { color: theme.textSecondary }]}>
              Sign in to save your AI chat history and tasks across devices.
            </Text>
          </View>

          <View style={authStyles.form}>
            <TextInput
              style={[authStyles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder={isSignUp ? 'Your name' : 'Username'}
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[authStyles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
            />
            <TouchableOpacity
              style={[authStyles.btn, { backgroundColor: theme.primary }]}
              onPress={() => { onLogin(name || 'User'); onClose(); }}
            >
              <Text style={authStyles.btnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={[authStyles.toggle, { color: theme.textSecondary }]}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={[authStyles.guestBtn, { color: theme.textMuted }]}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── AI Panel ────────────────────────────────────────────────────────────────────
const AIPanelModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  initialTask?: Task;
  initialAction?: string;
  isAuthenticated: boolean;
  onRequestAuth: () => void;
}> = ({ visible, onClose, initialTask, initialAction, isAuthenticated, onRequestAuth }) => {
  const theme = useTheme();
  const [messages, setMessages] = React.useState<{ role: string; text: string }[]>([]);
  const [history, setHistory] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<ScrollView>(null);

  const AI_ACTIONS = [
    { label: 'Deep Analyze', icon: <Sparkles size={13} color="#8B5CF6" />, fn: () => handleAction('multiTaskAnalyze') },
    { label: 'Summarize Task', icon: <Zap size={13} color={theme.primary} />, fn: () => handleAction('summarize') },
    { label: 'Break Down', icon: <ChevronDown size={13} color="#F59E0B" />, fn: () => handleAction('breakDown') },
    { label: 'Improve Text', icon: <PenLine size={13} color="#3B82F6" />, fn: () => handleAction('improve') },
    { label: 'Write Essay', icon: <BookOpen size={13} color="#8B5CF6" />, fn: () => handleAction('writeEssay') },
    { label: 'Research', icon: <Globe size={13} color="#06B6D4" />, fn: () => handleAction('research') },
    { label: 'Humanize', icon: <Smile size={13} color="#EC4899" />, fn: () => handleAction('humanize') },
  ];

  React.useEffect(() => {
    if (visible && initialTask) {
      if (initialAction) {
        handleAction(initialAction as any);
      } else if (messages.length === 0) {
        setMessages([{
          role: 'assistant',
          text: `I'm ready to help with **"${initialTask.title}"**. Pick an action below or ask me anything!`,
        }]);
      }
    }
  }, [visible, initialTask, initialAction]);

  const handleAction = async (action: keyof typeof aiService) => {
    const taskText = initialTask ? `${initialTask.title}. ${initialTask.description}` : input;
    if (!taskText.trim()) return;

    const userLabel = {
      summarize: 'Summarize this task',
      breakDown: 'Break down this task into steps',
      improve: 'Improve this text',
      writeEssay: 'Write an essay about this topic',
      research: 'Research this topic',
      humanize: 'Humanize this text',
    }[action] || 'Process this';

    setMessages(prev => [...prev, { role: 'user', text: userLabel }]);
    setIsLoading(true);

    try {
      const fn = (aiService as any)[action] as (t: string) => Promise<any>;
      const res = await fn(taskText);
      const botMsg = { role: 'assistant', text: res.content };
      setMessages(prev => [...prev, botMsg]);
      if (isAuthenticated) setHistory(prev => [
        ...prev,
        { role: 'user', content: userLabel },
        { role: 'assistant', content: res.content }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await aiService.chat(history, userText);
      setMessages(prev => [...prev, { role: 'assistant', text: res.content }]);
      if (isAuthenticated) {
        setHistory(prev => [
          ...prev,
          { role: 'user', content: userText },
          { role: 'assistant', content: res.content }
        ]);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={aiPanelStyles.overlay}>
          <Animated.View entering={SlideInDown} style={[aiPanelStyles.sheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
            {/* Header */}
            <View style={[aiPanelStyles.header, { borderBottomColor: theme.border }]}>
              <View style={aiPanelStyles.headerLeft}>
                <View style={[aiPanelStyles.avatar, { backgroundColor: theme.primary }]}>
                  <Sparkles size={16} color="#fff" />
                </View>
                <View>
                  <Text style={[aiPanelStyles.headerTitle, { color: theme.text }]}>Univa Co-Pilot</Text>
                  {!isAuthenticated && (
                    <TouchableOpacity onPress={onRequestAuth} style={aiPanelStyles.signInRow}>
                      <LogIn size={10} color={theme.primary} />
                      <Text style={[aiPanelStyles.signInHint, { color: theme.primary }]}>
                        Sign in to save history
                      </Text>
                    </TouchableOpacity>
                  )}
                  {isAuthenticated && (
                    <Text style={[aiPanelStyles.signInHint, { color: theme.success || '#10B981' }]}>
                      ● History saving on
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={aiPanelStyles.actionsRow}
              contentContainerStyle={aiPanelStyles.actionsContent}>
              {AI_ACTIONS.map((a, i) => (
                <TouchableOpacity key={i} onPress={a.fn}
                  style={[aiPanelStyles.actionChip, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
                  {a.icon}
                  <Text style={[aiPanelStyles.actionChipText, { color: theme.text }]}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Chat */}
            <ScrollView ref={scrollRef} style={aiPanelStyles.chat} contentContainerStyle={aiPanelStyles.chatContent}
              showsVerticalScrollIndicator={false}>
              {messages.map((msg, i) => (
                <View key={i} style={[aiPanelStyles.msgRow, msg.role === 'user' ? aiPanelStyles.userRow : aiPanelStyles.botRow]}>
                  <View style={[
                    aiPanelStyles.bubble,
                    msg.role === 'user'
                      ? [aiPanelStyles.userBubble, { backgroundColor: theme.primary }]
                      : [aiPanelStyles.botBubble, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]
                  ]}>
                    <Text style={[aiPanelStyles.msgText, { color: msg.role === 'user' ? '#fff' : theme.text }]}>
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}
              {isLoading && (
                <View style={aiPanelStyles.botRow}>
                  <View style={[aiPanelStyles.bubble, aiPanelStyles.botBubble, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
                    <ActivityIndicator size="small" color={theme.primary} />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={[aiPanelStyles.footer, { borderTopColor: theme.border, backgroundColor: theme.surfaceDark }]}>
              <TextInput
                style={[aiPanelStyles.input, { color: theme.text, backgroundColor: theme.surface }]}
                placeholder="Ask anything or type your text..."
                placeholderTextColor={theme.textMuted}
                value={input}
                onChangeText={setInput}
                multiline
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!input.trim() || isLoading}
                style={[aiPanelStyles.sendBtn, { backgroundColor: input.trim() ? theme.primary : theme.surfaceLight }]}
              >
                <Send size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Add Task Modal ───────────────────────────────────────────────────────────────
const AddTaskModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}> = ({ visible, onClose, onAdd }) => {
  const theme = useTheme();
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('medium');
  const [category, setCategory] = React.useState('Work');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now().toString(),
      title: title.trim(),
      description: desc.trim(),
      priority,
      status: 'pending',
      category,
      createdAt: new Date().toLocaleDateString(),
    });
    setTitle(''); setDesc(''); setPriority('medium'); setCategory('Work');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={addTaskStyles.overlay}>
          <Animated.View entering={SlideInDown} style={[addTaskStyles.sheet, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
            <View style={addTaskStyles.handle} />
            <Text style={[addTaskStyles.title, { color: theme.text }]}>New Task</Text>

            <TextInput style={[addTaskStyles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Task title" placeholderTextColor={theme.textMuted} value={title} onChangeText={setTitle} />
            <TextInput style={[addTaskStyles.textarea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Description (optional)" placeholderTextColor={theme.textMuted}
              value={desc} onChangeText={setDesc} multiline numberOfLines={3} />

            <Text style={[addTaskStyles.label, { color: theme.textSecondary }]}>Priority</Text>
            <View style={addTaskStyles.row}>
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <TouchableOpacity key={p} onPress={() => setPriority(p)}
                  style={[addTaskStyles.chip, priority === p && { backgroundColor: PRIORITY_COLORS[p] + '30', borderColor: PRIORITY_COLORS[p] },
                    priority !== p && { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Flag size={12} color={PRIORITY_COLORS[p]} />
                  <Text style={[addTaskStyles.chipText, { color: priority === p ? PRIORITY_COLORS[p] : theme.textSecondary }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[addTaskStyles.label, { color: theme.textSecondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={addTaskStyles.row}>
                {CATEGORIES.slice(1).map(c => (
                  <TouchableOpacity key={c} onPress={() => setCategory(c)}
                    style={[addTaskStyles.chip, category === c && { backgroundColor: theme.primary + '20', borderColor: theme.primary },
                      category !== c && { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[addTaskStyles.chipText, { color: category === c ? theme.primary : theme.textSecondary }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={addTaskStyles.actions}>
              <TouchableOpacity onPress={onClose} style={[addTaskStyles.cancelBtn, { borderColor: theme.border }]}>
                <Text style={[addTaskStyles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={[addTaskStyles.addBtn, { backgroundColor: theme.primary }]}>
                <Text style={addTaskStyles.addText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Main TaskManager ─────────────────────────────────────────────────────────────
const TaskManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { isAuthenticated, username, setLogin } = useUserStore();

  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', title: 'Deep Work: Quarter Report', description: 'Analyze Q1 performance data and write executive summary.', priority: 'high', status: 'pending', category: 'Work', createdAt: 'Apr 14' },
    { id: '2', title: 'Plan Team Offsite', description: 'Coordinate logistics for the April team retreat.', priority: 'medium', status: 'pending', category: 'Work', createdAt: 'Apr 13' },
    { id: '3', title: 'Research AI Ethics Paper', description: 'Gather sources on bias in large language models.', priority: 'medium', status: 'pending', category: 'Research', createdAt: 'Apr 12' },
    { id: '4', title: 'Submit Expense Report', description: 'Upload receipts to accounting portal.', priority: 'low', status: 'done', category: 'Finance', createdAt: 'Apr 10' },
  ]);

  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [showAdd, setShowAdd] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);
  const [aiTask, setAiTask] = React.useState<Task | undefined>();
  const [aiAction, setAiAction] = React.useState<string | undefined>();
  const [showAI, setShowAI] = React.useState(false);

  const filtered = tasks.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const pending = filtered.filter(t => t.status === 'pending');
  const done = filtered.filter(t => t.status === 'done');

  const toggleTask = (id: string) => setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t)
  );
  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));
  const openAI = (task?: Task, action?: string) => { 
    setAiTask(task); 
    setAiAction(action);
    setShowAI(true); 
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ── Header ── */}
      <Animated.View entering={FadeIn} style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            {isAuthenticated ? `Hello, ${username} 👋` : 'Task Manager'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {pendingCount} tasks remaining
          </Text>
        </View>
        <View style={styles.headerActions}>
          {/* AI Quick Access Button */}
          <TouchableOpacity
            onPress={() => openAI()}
            style={[styles.aiCircleBtn, { backgroundColor: theme.primary }]}
          >
            <Sparkles size={18} color="#fff" />
          </TouchableOpacity>

          {/* Auth / User */}
          <TouchableOpacity
            onPress={() => !isAuthenticated ? setShowAuth(true) : null}
            style={[styles.userBtn, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}
          >
            <User size={16} color={isAuthenticated ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Search ── */}
      <View style={[styles.searchBar, { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
        <Search size={16} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={theme.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ── Stats row ── */}
      <Animated.View entering={FadeInUp.delay(100)} style={[styles.statsRow, isMobile && styles.mobileStatsRow]}>
        <View style={[styles.statCard, { backgroundColor: '#FF444415', borderColor: '#FF444430' }]}>
          <Text style={[styles.statNum, { color: '#FF4444' }]}>{tasks.filter(t => t.priority === 'high' && t.status === 'pending').length}</Text>
          <Text style={[styles.statLabel, { color: '#FF4444' }]}>HIGH</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
          <Text style={[styles.statNum, { color: theme.primary }]}>{pendingCount}</Text>
          <Text style={[styles.statLabel, { color: theme.primary }]}>ACTIVE</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#10B98115', borderColor: '#10B98125' }]}>
          <Text style={[styles.statNum, { color: '#10B981' }]}>{doneCount}</Text>
          <Text style={[styles.statLabel, { color: '#10B981' }]}>DONE</Text>
        </View>
      </Animated.View>

      {/* ── Category Filter ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)}
            style={[styles.catChip, activeCategory === cat
              ? { backgroundColor: theme.primary, borderColor: theme.primary }
              : { backgroundColor: theme.surfaceDark, borderColor: theme.border }]}>
            <Text style={[styles.catText, { color: activeCategory === cat ? '#fff' : theme.textSecondary }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Task List ── */}
      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskListContent}>

        {pending.length > 0 && (
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>IN PROGRESS</Text>
        )}
        {pending.map((task, idx) => (
          <Animated.View key={task.id} entering={FadeInUp.delay(idx * 60)}>
            <TaskCard
              task={task}
              theme={theme}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onAI={(action) => openAI(task, action)}
            />
          </Animated.View>
        ))}

        {done.length > 0 && (
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 24 }]}>COMPLETED</Text>
        )}
        {done.map((task, idx) => (
          <Animated.View key={task.id} entering={FadeInUp.delay(idx * 60)}>
            <TaskCard
              task={task}
              theme={theme}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
              onAI={(action) => openAI(task, action)}
            />
          </Animated.View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Sparkles size={40} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No tasks yet. Add one!</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Add Task FAB ── */}
      <TouchableOpacity onPress={() => setShowAdd(true)}
        style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* ── Mobile Bottom Nav ── */}
      {Platform.OS !== 'web' && Dimensions.get('window').width < 600 && (
        <View style={[styles.bottomNav, { backgroundColor: theme.surfaceDark, borderTopColor: theme.border }]}>
          <TouchableOpacity style={styles.navItem}><Clock size={20} color={theme.primary} /><Text style={[styles.navText, { color: theme.primary }]}>Tasks</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => openAI()}><Sparkles size={20} color={theme.textSecondary} /><Text style={[styles.navText, { color: theme.textSecondary }]}>AI Chat</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => !isAuthenticated ? setShowAuth(true) : null}><User size={20} color={theme.textSecondary} /><Text style={[styles.navText, { color: theme.textSecondary }]}>Profile</Text></TouchableOpacity>
        </View>
      )}

      {/* ── Modals ── */}
      <AddTaskModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={t => setTasks(prev => [t, ...prev])}
      />
      <AIPanelModal
        visible={showAI}
        onClose={() => setShowAI(false)}
        initialTask={aiTask}
        initialAction={aiAction}
        isAuthenticated={isAuthenticated}
        onRequestAuth={() => { setShowAI(false); setShowAuth(true); }}
      />
      <AuthModal
        visible={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={(name) => setLogin(name)}
      />
    </View>
  );
};

// ─── TaskCard ─────────────────────────────────────────────────────────────────────
const TaskCard: React.FC<{
  task: Task;
  theme: any;
  onToggle: () => void;
  onDelete: () => void;
  onAI: (action?: any) => void;
}> = ({ task, theme, onToggle, onDelete, onAI }) => {
  const isDone = task.status === 'done';
  const pColor = PRIORITY_COLORS[task.priority];
  const screenWidth = Dimensions.get('window').width;
  const isCompact = screenWidth < 500;

  return (
    <View style={[cardStyles.card, { backgroundColor: theme.surfaceDark, borderColor: theme.border },
      isDone && { opacity: 0.55 }]}>
      <View style={[cardStyles.priorityBar, { backgroundColor: pColor }]} />

      <View style={cardStyles.content}>
        <View style={cardStyles.topRow}>
          <TouchableOpacity onPress={onToggle} style={cardStyles.checkbox}>
            {isDone
              ? <CheckCircle2 size={22} color="#10B981" />
              : <Circle size={22} color={theme.border} />}
          </TouchableOpacity>
          <View style={cardStyles.taskBody}>
            <Text style={[cardStyles.title, { color: theme.text }, isDone && cardStyles.strikethrough]}
              numberOfLines={1}>{task.title}</Text>
            {task.description ? (
              <Text style={[cardStyles.desc, { color: theme.textSecondary }]} numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}
            <View style={cardStyles.meta}>
              <View style={[cardStyles.catBadge, { backgroundColor: pColor + '15', borderColor: pColor + '40' }]}>
                <Text style={[cardStyles.catText, { color: pColor }]}>{task.priority.toUpperCase()}</Text>
              </View>
              <Text style={[cardStyles.catBadge, cardStyles.catText, { color: theme.textMuted, backgroundColor: 'transparent', borderWidth: 0 }]}>
                {task.category}
              </Text>
              <Clock size={11} color={theme.textMuted} />
              <Text style={[cardStyles.catText, { color: theme.textMuted }]}>{task.createdAt}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={onDelete} style={cardStyles.cardDeleteBtn}>
            <Trash2 size={14} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 🧠 SMART AI ACTIONS — Unified Row */}
        <View style={cardStyles.aiActionGrid}>
          <TouchableOpacity onPress={() => onAI('summarize')} style={[cardStyles.aiPill, { borderColor: '#10B98130' }]}>
            <Zap size={10} color="#10B981" />
            <Text style={[cardStyles.aiPillText, { color: '#10B981' }]}>AI Summary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => onAI('multiTaskAnalyze')} style={[cardStyles.aiPill, { borderColor: '#8B5CF630', backgroundColor: '#8B5CF608' }]}>
            <Sparkles size={10} color="#8B5CF6" />
            <Text style={[cardStyles.aiPillText, { color: '#8B5CF6' }]}>Analyze</Text>
          </TouchableOpacity>

          {!isCompact && (
             <>
                <TouchableOpacity onPress={() => onAI('improve')} style={[cardStyles.aiPill, { borderColor: '#3B82F630' }]}>
                  <PenLine size={10} color="#3B82F6" />
                  <Text style={[cardStyles.aiPillText, { color: '#3B82F6' }]}>Improve</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onAI('breakDown')} style={[cardStyles.aiPill, { borderColor: '#F59E0B30' }]}>
                  <ChevronDown size={10} color="#F59E0B" />
                  <Text style={[cardStyles.aiPillText, { color: '#F59E0B' }]}>Break Down</Text>
                </TouchableOpacity>
             </>
          )}
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  subtitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiCircleBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)', elevation: 6,
  },
  userBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginTop: 16,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  statsRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 16,
  },
  mobileStatsRow: {
    paddingHorizontal: 12,
  },
  statCard: {
    flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  categoryScroll: { marginTop: 16, flexGrow: 0 },
  categoryContent: { paddingHorizontal: 20, gap: 8 },
  catChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  catText: { fontSize: 12, fontWeight: '700' },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginLeft: 20, marginBottom: 10 },
  taskList: { flex: 1 },
  taskListContent: { paddingTop: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: '500' },
  fab: {
    position: 'absolute', bottom: 90, right: 24,
    width: 54, height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, boxShadow: '0px 4px 8px rgba(0,0,0,0.3)', zIndex: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    paddingBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 14, borderWidth: 1, flexDirection: 'row', overflow: 'hidden',
  },
  priorityBar: { width: 4 },
  content: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  checkbox: { marginTop: 2 },
  taskBody: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.6 },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  catBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1,
  },
  catText: { fontSize: 10, fontWeight: '700' },
  aiActionGrid: { 
    flexDirection: 'row', 
    gap: 6, 
    marginTop: 14, 
    flexWrap: 'wrap', 
    alignItems: 'center' 
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  aiPillText: { 
    fontSize: 9, 
    fontWeight: '800', 
    textTransform: 'uppercase' 
  },
  cardDeleteBtn: { 
    padding: 8,
    marginTop: -4,
    marginRight: -4,
  },
});

const aiPanelStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    height: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  signInRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  signInHint: { fontSize: 10, fontWeight: '600' },
  actionsRow: { borderBottomWidth: 1, flexGrow: 0 },
  actionsContent: { padding: 12, gap: 8 },
  actionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1,
  },
  actionChipText: { fontSize: 11, fontWeight: '700' },
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  msgRow: { flexDirection: 'row', width: '100%' },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16 },
  userBubble: { borderBottomRightRadius: 4 },
  botBubble: { borderBottomLeftRadius: 4, borderWidth: 1 },
  msgText: { fontSize: 14, lineHeight: 20 },
  footer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 16, borderTopWidth: 1,
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 100, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, fontSize: 14,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
});

const addTaskStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1,
    borderLeftWidth: 1, borderRightWidth: 1, padding: 24,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#444', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, marginBottom: 12,
  },
  textarea: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, marginBottom: 16, minHeight: 80, textAlignVertical: 'top',
  },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1,
  },
  chipText: { fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '700' },
  addBtn: {
    flex: 1, padding: 14, borderRadius: 10, alignItems: 'center',
  },
  addText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});

const authStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
  sheet: {
    width: '100%', maxWidth: 400, borderRadius: 24, padding: 28, borderWidth: 1,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#444', alignSelf: 'center', marginBottom: 24 },
  header: { alignItems: 'center', marginBottom: 28, gap: 10 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  form: { gap: 12 },
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14,
  },
  btn: {
    padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 4,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  toggle: { textAlign: 'center', fontSize: 13, paddingVertical: 4 },
  guestBtn: { textAlign: 'center', fontSize: 12, paddingVertical: 8, textDecorationLine: 'underline' },
});

export default TaskManager;
