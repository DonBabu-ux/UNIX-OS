import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform, Dimensions, TextInput } from 'react-native';
import { 
    Shield, Cloud, Zap, Cpu, Activity, Lock, AlertTriangle, CheckCircle, 
    Settings, Terminal, Database, HardDrive, Share2, Eye, RefreshCw, 
    Key, Globe, Layers, List, BarChart2, Briefcase, Power, Trash2, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../theme/themeProvider';

const { width: W, height: H } = Dimensions.get('window');

// ─── Shared UI Components ──────────────────────────────────────────────────
const ModuleHeader: React.FC<{ title: string; Icon: any; color: string }> = ({ title, Icon, color }) => (
    <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: color + '15' }]}>
            <Icon size={20} color={color} />
        </View>
        <Text style={[styles.moduleTitle, {color: '#fff'}]}>{title}</Text>
    </View>
);

const SettingItem: React.FC<{ label: string; desc: string; value: boolean; onToggle: (v: boolean) => void }> = ({ label, desc, value, onToggle }) => (
    <View style={styles.settingRow}>
        <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Text style={styles.settingDesc}>{desc}</Text>
        </View>
        <Switch 
            value={value} 
            onValueChange={onToggle} 
            trackColor={{ false: '#334155', true: '#0078D4' }}
            thumbColor={'#fff'}
        />
    </View>
);

// ─── 1. Kernel Layer ───────────────────────────────────────────────────────
export const KernelModule: React.FC = () => {
    const theme = useTheme();
    return (
        <View style={styles.section}>
            <ModuleHeader title="KERNEL CORE MANAGEMENT" Icon={Cpu} color={theme.accent} />
            <View style={styles.grid}>
                <View style={styles.statusBox}>
                    <Text style={styles.statLabel}>KERNEL STATUS</Text>
                    <Text style={[styles.statValue, {color: theme.success}]}>ACTIVE / STABLE</Text>
                </View>
                <View style={styles.statusBox}>
                    <Text style={styles.statLabel}>SYSCALL LOAD</Text>
                    <Text style={styles.statValue}>1,244 ops/sec</Text>
                </View>
            </View>
            <View style={styles.terminal}>
                <Text style={styles.termLine}>[KERNEL] IRQ Handler: 0x4a2 restored</Text>
                <Text style={styles.termLine}>[KERNEL] Microcode patch v1.4.2 applied</Text>
                <Text style={styles.termLine}>[KERNEL] Interrupt Controller: Optimal</Text>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionBtn}><Text style={styles.btnText}>SOFT REBOOT</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.error + '22'}]}>
                    <Text style={[styles.btnText, {color: theme.error}]}>HARD RESET</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─── 2. Security Optimo ─────────────────────────────────────────────────────
export const SecurityCenter: React.FC = () => {
    const theme = useTheme();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <ModuleHeader title="SECURITY OPTIMO SHIELD" Icon={Shield} color={theme.success} />
                <SettingItem label="Behavioral Analysis" desc="AI-driven threat detection" value={true} onToggle={() => {}}/>
                <SettingItem label="Intrusion Prevention" desc="IPS/IDS Active at Kernel Layer" value={true} onToggle={() => {}}/>
                <SettingItem label="Ransomware Shield" desc="Protects high-value file partitions" value={true} onToggle={() => {}}/>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionSub}>ACCESS CONTROL & RBAC</Text>
                <TouchableOpacity style={styles.navRow}>
                    <Lock size={14} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.navText}>Admin Policy Editor</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navRow}>
                    <Key size={14} color="rgba(255,255,255,0.5)" />
                    <Text style={styles.navText}>MFA / Biometric Registry</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// ─── 3. Network & Cloud ─────────────────────────────────────────────────────
export const CloudNetwork: React.FC = () => {
    const theme = useTheme();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <ModuleHeader title="CLOUD RADIUS ENGINE" Icon={Cloud} color={theme.primary} />
                <View style={styles.latencyChart}>
                    <Text style={styles.statLabel}>SAT-RELAY LATENCY</Text>
                    <View style={styles.miniChart}>
                        {[40, 60, 45, 80, 50, 40].map((h, i) => (
                            <View key={i} style={[styles.chartBar, { height: h, backgroundColor: theme.primary }]} />
                        ))}
                    </View>
                </View>
                <SettingItem label="Edge Node Relay" desc="AI Dynamic Packet Routing" value={true} onToggle={() => {}}/>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionSub}>FIREWALL & PORT CONFIG</Text>
                <View style={styles.tagGrid}>
                    <View style={styles.tag}><Text style={styles.tagText}>PORT 80: ALLOW</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>PORT 443: ALLOW</Text></View>
                    <View style={[styles.tag, {borderColor: theme.error}]}><Text style={[styles.tagText, {color: theme.error}]}>PORT 22: BLOCK</Text></View>
                </View>
            </View>
        </ScrollView>
    );
};

// ─── 4. Resource Manager ────────────────────────────────────────────────────
export const ResourceManager: React.FC = () => {
    const theme = useTheme();
    return (
        <View style={styles.section}>
            <ModuleHeader title="KERNEL RESOURCE PULSE" Icon={Activity} color={theme.warning} />
            <View style={styles.processList}>
                <View style={styles.procHeader}>
                    <Text style={styles.procTitle}>PROCESS_NAME</Text>
                    <Text style={styles.procTitle}>CPU_%</Text>
                </View>
                <View style={styles.procItem}>
                    <Text style={styles.procLabel}>UnivaRuntime.sys</Text>
                    <Text style={styles.procValue}>4.2%</Text>
                    <TouchableOpacity style={styles.killBtn}><Text style={styles.killText}>KILL</Text></TouchableOpacity>
                </View>
                <View style={styles.procItem}>
                    <Text style={styles.procLabel}>GrokModel_V4.sat</Text>
                    <Text style={styles.procValue}>85.1%</Text>
                    <TouchableOpacity style={styles.killBtn}><Text style={styles.killText}>KILL</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// ─── 5. AI Control Plane (NEW) ─────────────────────────────────────────────
export const AIModule: React.FC = () => {
    const theme = useTheme();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <ModuleHeader title="AI PIPELINE ROUTER" Icon={Zap} color={theme.warning} />
                <View style={[styles.statusBox, {borderColor: theme.primary + '44'}]}>
                    <Text style={[styles.statValue, {color: theme.primary}]}>PRIMARY: GROK-4-PIPELINE</Text>
                    <Text style={styles.settingDesc}>Load Balancer: Optimal (12ms)</Text>
                </View>
                <SettingItem label="Prompt Firewall" desc="Protects against injection attacks" value={true} onToggle={() => {}}/>
                <SettingItem label="Memory Cache" desc="Predictive model caching active" value={true} onToggle={() => {}}/>
            </View>
        </ScrollView>
    );
};

// ─── 6. Governance & Storage (NEW) ──────────────────────────────────────────
export const GovernanceModule: React.FC = () => {
    const theme = useTheme();
    return (
        <View style={styles.section}>
            <ModuleHeader title="DATA GOVERNANCE" Icon={Database} color={theme.accent} />
            <TouchableOpacity style={styles.navRow}>
                <Lock size={14} color={theme.accent} />
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={styles.navText}>SECURE FILE VAULT</Text>
                    <Text style={styles.settingDesc}>AES-256 Encrypted Storage</Text>
                </View>
                <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navRow}>
                <Trash2 size={14} color={theme.error} />
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={[styles.navText, {color: theme.error}]}>IRRECOVERABLE SHREDDER</Text>
                    <Text style={styles.settingDesc}>DoD 5220.22-M Standard Wipe</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

// ─── 7. Audit & Event Logs (NEW) ────────────────────────────────────────────
export const AuditModule: React.FC = () => {
    return (
        <View style={styles.section}>
            <ModuleHeader title="COMPLIANCE AUDIT LOGS" Icon={List} color="#fff" />
            <ScrollView style={styles.terminal}>
                <Text style={styles.termLine}>[20:14:02] ADMIN: PID_802 Kill signal sent</Text>
                <Text style={styles.termLine}>[20:12:44] SECURITY: IRQ_0x44 Reclaimed</Text>
                <Text style={[styles.termLine, {color: '#FCD34D'}]}>{"[20:10:01] WARNING: Cloud Lag > 40ms"}</Text>
                <Text style={styles.termLine}>[20:08:12] SYSTEM: Kernel State: STABLE</Text>
            </ScrollView>
        </View>
    );
};

// ─── 8. Recovery & Emergency (NEW) ─────────────────────────────────────────
export const RecoveryModule: React.FC = () => {
    const theme = useTheme();
    return (
        <View style={styles.section}>
            <ModuleHeader title="RECOVERY ENGINE" Icon={RefreshCw} color={theme.primary} />
            <Text style={styles.sectionSub}>SYSTEM RESTORE POINTS</Text>
            <View style={styles.sequenceRow}>
                <View style={styles.seqItem}>
                    <Text style={styles.seqText}>Stable Build 11.04.26</Text>
                    <TouchableOpacity style={styles.killBtn}><Text style={styles.killText}>ROLLBACK</Text></TouchableOpacity>
                </View>
                <View style={[styles.seqItem, {opacity: 0.5}]}>
                    <Text style={styles.seqText}>Archive Build 04.02.26</Text>
                    <TouchableOpacity style={styles.killBtn} disabled><Text style={[styles.killText, {color: 'rgba(255,255,255,0.3)'}]}>ARCHIVED</Text></TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: theme.success + '22', marginTop: 10}]}>
                <Text style={[styles.actionBtnText, {color: theme.success}]}>INITIATE AUTO-HEAL SCAN</Text>
            </TouchableOpacity>
        </View>
    );
};

// ─── 9. System Boot & Launch Engine (NEW) ──────────────────────────────────
export const BootEngineModule: React.FC = () => {
    const theme = useTheme();
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <ModuleHeader title="BOOT PRIORITY MANAGER" Icon={Terminal} color={theme.primary} />
                <View style={styles.sequenceRow}>
                    <View style={styles.seqItem}>
                        <Text style={styles.seqText}>1st: KERNEL_INIT_CORE</Text>
                        <Lock size={12} color="rgba(255,255,255,0.3)" />
                    </View>
                    <View style={styles.seqItem}>
                        <Text style={styles.seqText}>2nd: UEFI_SECURE_TRUST</Text>
                        <RefreshCw size={12} color={theme.success} />
                    </View>
                    <View style={styles.seqItem}>
                        <Text style={styles.seqText}>3rd: SAT_RELAY_SYNC</Text>
                        <TouchableOpacity><Text style={styles.killText}>CHANGE</Text></TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionSub}>STARTUP SERVICE SCHEDULER</Text>
                <SettingItem label="Safe Boot Mode" desc="Load minimal drivers only" value={false} onToggle={() => {}}/>
                <SettingItem label="Fast Boot Optimization" desc="AI-predicted pre-warming" value={true} onToggle={() => {}}/>
                
                <View style={styles.routingInfo}>
                    <Text style={styles.logHeader}>BOOT DELAY CONFIG (ms)</Text>
                    <View style={styles.routeRow}>
                        <Text style={styles.routeText}>POST DELAY</Text>
                        <TextInput style={styles.miniInput} defaultValue="200" keyboardType="numeric" />
                    </View>
                    <View style={styles.routeRow}>
                        <Text style={styles.routeText}>SERVICE WAIT</Text>
                        <TextInput style={styles.miniInput} defaultValue="1200" keyboardType="numeric" />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    section: { marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    sectionSub: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, marginBottom: 16 },
    moduleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    moduleIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    moduleTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    settingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
    settingLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
    settingDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },
    grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    statusBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 4 },
    statValue: { fontSize: 14, fontWeight: '900', color: '#fff' },
    terminal: { backgroundColor: '#000', padding: 12, borderRadius: 8, height: 100, marginBottom: 16 },
    termLine: { color: '#00FF41', fontSize: 10, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Menlo', marginBottom: 4 },
    buttonRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, height: 40, borderRadius: 8, borderHorizontalWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
    btnText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    navRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    navText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
    latencyChart: { marginBottom: 16 },
    miniChart: { flexDirection: 'row', gap: 4, alignItems: 'flex-end', height: 80, marginTop: 10 },
    chartBar: { width: 40, borderRadius: 4, opacity: 0.6 },
    tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    tagText: { color: '#fff', fontSize: 9, fontWeight: '800' },
    processList: { gap: 10 },
    procHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    procTitle: { fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: '900' },
    procItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    procLabel: { flex: 2, color: '#fff', fontSize: 12, fontWeight: '600' },
    procValue: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '800' },
    killBtn: { backgroundColor: '#FF4D4D22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    killText: { color: '#FF4D4D', fontSize: 9, fontWeight: '900' },
    miniInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, width: 60, textAlign: 'right' }
});
