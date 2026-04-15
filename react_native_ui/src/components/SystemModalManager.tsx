import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Platform, Dimensions, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp } from 'react-native-reanimated';
import { 
    Cpu, Shield, Cloud, Activity, Zap, Lock, Terminal, Database, 
    Share2, AlertTriangle, RefreshCw, List, Trash2, X, Sparkles, CheckCircle, Info 
} from 'lucide-react';
import { useResponsive } from '../state/ResponsiveManager';
import { useSystemStore, SystemModal } from '../state/slices/systemSlice';
import { useTheme } from '../theme/themeProvider';
import { 
    KernelModule, SecurityCenter, CloudNetwork, ResourceManager,
    AIModule, GovernanceModule, AuditModule, RecoveryModule, BootEngineModule
} from './modals/AdminControls';

const { width: W, height: H } = Dimensions.get('window');

const SystemModalManager: React.FC = () => {
    const theme = useTheme();
    const { modalStack, closeModal, setAdminAuth } = useSystemStore();
    const activeModal = modalStack[modalStack.length - 1];
    
    const { isMobile, isTablet } = useResponsive();
    const [adminInput, setAdminInput] = React.useState('');
    const [error, setError] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('KERNEL');

    if (!activeModal) return null;

    const handleConfirm = () => {
        if (activeModal.type === 'ADMIN_AUTH') {
            if (adminInput === '1234' || adminInput.toLowerCase() === 'admin') {
                setAdminAuth(true);
                closeModal();
                setAdminInput('');
            } else {
                setError(true);
            }
        } else {
            activeModal.onConfirm?.();
            closeModal();
        }
    };

    const renderContent = () => {
        switch (activeModal.type) {
            case 'INFO':
                return (
                    <View style={styles.centerContent}>
                        <Info size={40} color={theme.primary} />
                        <Text style={[styles.message, {color: theme.text}]}>{activeModal.message}</Text>
                    </View>
                );
            case 'CONFIRM':
                return (
                    <View style={styles.centerContent}>
                        <AlertTriangle size={40} color={theme.warning} />
                        <Text style={[styles.message, {color: theme.text}]}>{activeModal.message}</Text>
                    </View>
                );
            case 'ADMIN_AUTH':
                return (
                    <View style={styles.authContent}>
                        <Lock size={32} color={theme.accent} />
                        <Text style={[styles.title, {color: theme.text}]}>ADMINISTRATOR ACCESS</Text>
                        <Text style={styles.subtitle}>Authentication required for system changes</Text>
                        <TextInput 
                            style={[styles.input, {backgroundColor: theme.surfaceDark, color: theme.text, borderColor: error ? theme.error : theme.border}]}
                            placeholder="Enter Admin PIN (Default: 1234)"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            secureTextEntry
                            value={adminInput}
                            onChangeText={txt => { setAdminInput(txt); setError(false); }}
                            autoFocus
                        />
                        {error && <Text style={{color: theme.error, fontSize: 10, marginTop: 4}}>AUTHENTICATION FAILED</Text>}
                    </View>
                );
            case 'ADMIN_CONTROL':
                return (
                    <View style={[styles.workspace, isMobile && styles.mobileWorkspace]}>
                        {/* Sidebar Navigation - Adaptive */}
                        <View style={[
                            isMobile ? styles.topNav : styles.sidebar, 
                            { borderRightColor: theme.border, borderBottomColor: theme.border }
                        ]}>
                            <ScrollView 
                                horizontal={isMobile} 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={isMobile ? styles.topNavContent : undefined}
                            >
                                <TouchableOpacity onPress={() => setActiveTab('KERNEL')} style={[styles.navItem, activeTab === 'KERNEL' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Cpu size={isMobile ? 14 : 18} color={activeTab === 'KERNEL' ? theme.accent : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'KERNEL' && {color: '#fff'}]}>KERNEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('SECURITY')} style={[styles.navItem, activeTab === 'SECURITY' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Shield size={isMobile ? 14 : 18} color={activeTab === 'SECURITY' ? theme.success : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'SECURITY' && {color: '#fff'}]}>SECURITY</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('BOOT')} style={[styles.navItem, activeTab === 'BOOT' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Zap size={isMobile ? 14 : 18} color={activeTab === 'BOOT' ? theme.warning : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'BOOT' && {color: '#fff'}]}>BOOT</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('NETWORK')} style={[styles.navItem, activeTab === 'NETWORK' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Cloud size={isMobile ? 14 : 18} color={activeTab === 'NETWORK' ? theme.primary : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'NETWORK' && {color: '#fff'}]}>CLOUD</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('TASKS')} style={[styles.navItem, activeTab === 'TASKS' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Activity size={isMobile ? 14 : 18} color={activeTab === 'TASKS' ? theme.warning : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'TASKS' && {color: '#fff'}]}>TASKS</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('GOVERNANCE')} style={[styles.navItem, activeTab === 'GOVERNANCE' && styles.navActive, isMobile && styles.mobileNavItem]}>
                                    <Database size={isMobile ? 14 : 18} color={activeTab === 'GOVERNANCE' ? theme.accent : 'rgba(255,255,255,0.4)'} />
                                    <Text style={[styles.navItemText, activeTab === 'GOVERNANCE' && {color: '#fff'}]}>DATA</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setActiveTab('DANGER')} style={[styles.navItem, activeTab === 'DANGER' && { backgroundColor: theme.error + '15' }, isMobile && styles.mobileNavItem]}>
                                    <AlertTriangle size={isMobile ? 14 : 18} color={theme.error} />
                                    <Text style={[styles.navItemText, {color: theme.error}]}>DANGER</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        {/* Main Interaction Area */}
                        <ScrollView style={styles.mainArea}>
                            {activeTab === 'KERNEL' && <KernelModule />}
                            {activeTab === 'SECURITY' && <SecurityCenter />}
                            {activeTab === 'BOOT' && <BootEngineModule />}
                            {activeTab === 'NETWORK' && <CloudNetwork />}
                            {activeTab === 'TASKS' && <ResourceManager />}
                            {activeTab === 'AI' && <AIModule />}
                            {activeTab === 'GOVERNANCE' && <GovernanceModule />}
                            {activeTab === 'AUDIT' && <AuditModule />}
                            {activeTab === 'RECOVERY' && <RecoveryModule />}
                            {activeTab === 'DANGER' && (
                                <View style={styles.dangerCenter}>
                                    <AlertTriangle size={48} color={theme.error} />
                                    <Text style={[styles.dangerTitle, {color: '#fff'}]}>CRITICAL LAYER</Text>
                                    <Text style={styles.dangerDesc}>Actions directly affect the OS kernel and local storage.</Text>
                                    <TouchableOpacity style={[styles.destroyBtn, {backgroundColor: theme.error}]}>
                                        <Text style={styles.destroyText}>WIPE ALL DATA</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                );
            case 'ERROR':
                return (
                    <View style={styles.centerContent}>
                        <X size={40} color={theme.error} />
                        <Text style={[styles.message, {color: theme.text}]}>{activeModal.message}</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <Modal transparent visible animationType="none">
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop}>
                <TouchableOpacity activeOpacity={1} onPress={() => closeModal()} style={StyleSheet.absoluteFill} />
                
                <Animated.View 
                    entering={SlideInUp.springify().damping(15)} 
                    style={[styles.modalSheet, { 
                        backgroundColor: theme.background, 
                        borderColor: theme.border,
                        width: Platform.OS === 'web' ? (isMobile ? W * 0.95 : 480) : (isMobile ? W * 0.94 : W * 0.8),
                        maxHeight: isMobile ? H * 0.9 : H * 0.8
                    }]}
                >
                    {/* Header */}
                    <View style={[styles.header, {borderBottomColor: theme.border}]}>
                        <Text style={[styles.headerText, {color: theme.text}]}>{activeModal.title || 'SYSTEM ALERT'}</Text>
                        <TouchableOpacity onPress={() => closeModal()}>
                            <X size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {renderContent()}
                    </View>

                    {/* Actions */}
                    {activeModal.type === 'ADMIN_CONTROL' && (
                        <View style={[styles.sysStatusBar, { borderTopColor: theme.border, backgroundColor: theme.surfaceDark }]}>
                            <View style={styles.statusGroup}>
                                <Activity size={12} color={theme.success} />
                                <Text style={[styles.statusItem, {color: theme.success}]}>SYSTEM: OPTIMAL</Text>
                            </View>
                            <View style={styles.statusGroup}>
                                <Database size={12} color={theme.primary} />
                                <Text style={[styles.statusItem, {color: theme.primary}]}>CLOUD: SYNCED</Text>
                            </View>
                            <View style={styles.statusGroup}>
                                <Terminal size={12} color={theme.accent} />
                                <Text style={[styles.statusItem, {color: theme.accent}]}>KERNEL v1.4.2</Text>
                            </View>
                        </View>
                    )}
                    {activeModal.type !== 'ADMIN_CONTROL' && (
                        <View style={[styles.footer, {borderTopColor: theme.border}]}>
                            <TouchableOpacity onPress={() => closeModal()} style={[styles.btn, {backgroundColor: theme.surfaceDark}]}>
                                <Text style={[styles.btnText, {color: theme.text}]}>{activeModal.cancelLabel || 'CANCEL'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm} style={[styles.btn, {backgroundColor: theme.primary}]}>
                                <Text style={styles.btnText}>{activeModal.confirmLabel || 'CONFIRM'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
    modalSheet: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', elevation: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
    headerText: { fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
    content: { padding: 24 },
    centerContent: { alignItems: 'center', gap: 16 },
    message: { textAlign: 'center', fontSize: 15, fontWeight: '500', lineHeight: 22 },
    footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1 },
    btn: { flex: 1, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    btnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
    authContent: { alignItems: 'center', gap: 12 },
    title: { fontSize: 18, fontWeight: '900', textAlign: 'center' },
    subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 10 },
    input: { width: '100%', height: 50, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, fontSize: 14, marginTop: 10 },
    scrollContent: { maxHeight: H * 0.6 },
    sysStatusBar: { flexDirection: 'row', padding: 12, paddingHorizontal: 20, gap: 20, borderTopWidth: 1 },
    statusGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusItem: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    scrollTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
    workspace: { flexDirection: 'row', height: H * 0.8, minHeight: 600 },
    mobileWorkspace: { flexDirection: 'column' },
    sidebar: { width: 120, padding: 8, borderRightWidth: 1, gap: 2 },
    topNav: { height: 60, borderBottomWidth: 1 },
    topNavContent: { paddingHorizontal: 12, gap: 12, alignItems: 'center' },
    navItem: { flexDirection: 'column', alignItems: 'center', paddingVertical: 10, borderRadius: 10, gap: 4, minWidth: 60 },
    mobileNavItem: { paddingVertical: 8, height: 48, justifyContent: 'center' },
    navActive: { backgroundColor: 'rgba(255,255,255,0.05)' },
    navItemText: { fontSize: 8, fontWeight: '800', textAlign: 'center', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 },
    mainArea: { flex: 1, padding: 20, backgroundColor: 'rgba(0,0,0,0.1)' },
    dangerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
    dangerTitle: { fontSize: 18, fontWeight: '900', textAlign: 'center' },
    dangerDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 16, maxWidth: 260 },
    destroyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 },
    destroyText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});

export default SystemModalManager;
