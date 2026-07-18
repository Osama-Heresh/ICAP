import React, { useState, useMemo } from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Server,
  Database,
  Network,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Lock,
  ChevronRight,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  Play,
  AlertTriangle,
  FileText,
  Terminal,
  Layers,
  Settings,
  HelpCircle,
  Sliders,
  ChevronLeft,
  ArrowRight,
  Zap,
  HardDrive,
  User,
  Heart,
  BookOpen,
  LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types for DB representation
export interface DeploymentRecord {
  id: string;
  version: string;
  environment: 'Development' | 'Testing' | 'Staging' | 'Production';
  status: 'Active' | 'Rolled Back' | 'Pending Approval' | 'Deprecating';
  date: string;
  developer: string;
  changes: string;
}

export interface SystemHealthRecord {
  id: string;
  service: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  metric: string;
  timestamp: string;
}

export interface TestResultRecord {
  id: string;
  testType: 'Unit Testing' | 'Integration Testing' | 'API Testing' | 'Security Testing' | 'Performance Testing' | 'AI Testing' | 'User Acceptance Testing';
  result: 'Passed' | 'Failed' | 'Warning';
  coverage: number;
  date: string;
  passedCount: number;
  failedCount: number;
  warningCount: number;
}

export interface BackupRecord {
  id: string;
  type: 'Database Backup' | 'Document Backup' | 'Configuration Backup';
  location: string;
  status: 'Healthy' | 'Completed' | 'Failed' | 'In Progress';
  date: string;
  sizeMb: number;
}

export interface SupportTicketRecord {
  id: string;
  organization: string;
  issue: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  category: 'Technical Issue' | 'Billing' | 'Integration' | 'Compliance Question';
  createdAt: string;
}

interface ProductionReadinessViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function ProductionReadinessView({
  locale,
  theme,
  onTriggerActivityLog
}: ProductionReadinessViewProps) {
  const isRTL = locale === 'ar';

  // Sub-tabs in the Production Readiness Center
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'architecture' | 'environments' | 'deployments' | 'testing' | 'security' | 'performance' | 'background_jobs' | 'backups' | 'errors' | 'support' | 'documentation'>('dashboard');

  // ==========================================
  // STATE DEFINITIONS & SEED DEMO DATA
  // ==========================================

  // 1. Environments State (Requirement 3 & 21)
  const [environments, setEnvironments] = useState([
    {
      name: 'Production',
      url: 'https://icap.saas.alnoor.com',
      database: 'Sovereign Postgres Clustered Pool (Cloud SQL)',
      status: 'Active',
      version: 'ICAP 1.0.0',
      deploymentDate: '2026-07-15 02:30 UTC',
      health: '99.9%',
      region: 'Riyadh (me-central2)',
      tlsCertificate: 'Valid (DigiCert EV SSL)'
    },
    {
      name: 'Staging',
      url: 'https://staging.icap.saas.alnoor.com',
      database: 'Postgres Sandbox Replica',
      status: 'Active',
      version: 'ICAP 1.0.1-RC3',
      deploymentDate: '2026-07-17 11:15 UTC',
      health: '100%',
      region: 'Riyadh (me-central2)',
      tlsCertificate: 'Valid (Let\'s Encrypt)'
    },
    {
      name: 'Testing',
      url: 'https://test-matrix.icap.internal',
      database: 'In-Memory Mock SQLite Pool',
      status: 'Active',
      version: 'ICAP 1.1.0-alpha2',
      deploymentDate: '2026-07-17 08:00 UTC',
      health: '98.5%',
      region: 'Local Shared Dev Cluster',
      tlsCertificate: 'Self-Signed Internal CA'
    },
    {
      name: 'Development',
      url: 'https://dev-sandbox-92.icap.internal',
      database: 'Developer Local Postgres Docker Instance',
      status: 'Active',
      version: 'ICAP 1.1.0-unstable',
      deploymentDate: '2026-07-17 15:44 UTC',
      health: '100%',
      region: 'Developer Workstations Cluster',
      tlsCertificate: 'N/A (HTTP Native)'
    }
  ]);

  // 2. Deployments Table (Requirement 4 & 20)
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([
    { id: 'DEP-001', version: 'ICAP 1.0.0', environment: 'Production', status: 'Active', date: '2026-07-15 02:30', developer: 'Riyadh DevOps Core Team', changes: 'Production Hardening Release with SAMA Compliance Modules.' },
    { id: 'DEP-002', version: 'ICAP 1.0.1-RC3', environment: 'Staging', status: 'Active', date: '2026-07-17 11:15', developer: 'Hasan Al-Mansoori (Lead)', changes: 'Patch for ERP payload serialization edge cases.' },
    { id: 'DEP-003', version: 'ICAP 0.9.9', environment: 'Production', status: 'Rolled Back', date: '2026-07-10 14:00', developer: 'Sovereign Automations Engine', changes: 'Hotfix testing for Arabic RTL navigation layout parameters.' },
    { id: 'DEP-004', version: 'ICAP 1.1.0-alpha2', environment: 'Testing', status: 'Active', date: '2026-07-17 08:00', developer: 'Layla Al-Saeed', changes: 'Inter-process Sharia verification pipeline acceleration tests.' }
  ]);

  // 3. System Health Table (Requirement 14 & 20 & 21)
  const [systemHealth, setSystemHealth] = useState<SystemHealthRecord[]>([
    { id: 'HLTH-01', service: 'Application Core Gateway', status: 'Healthy', metric: 'Response time: 42ms | Load: 8%', timestamp: '2026-07-17 16:55' },
    { id: 'HLTH-02', service: 'Sovereign Postgres Instance', status: 'Healthy', metric: 'Connections: 45/5000 | Disk: 12% space free', timestamp: '2026-07-17 16:55' },
    { id: 'HLTH-03', service: 'Gemini AI Sharia Service Agent', status: 'Healthy', metric: 'Invocations: 12,400/min | Token Cache: 92%', timestamp: '2026-07-17 16:55' },
    { id: 'HLTH-04', service: 'SAP Financial Sync Webhook Connector', status: 'Healthy', metric: 'Latency: 128ms | Queue: 0 pending', timestamp: '2026-07-17 16:55' },
    { id: 'HLTH-05', service: 'Redis Transaction Cache Clusters', status: 'Healthy', metric: 'Hits: 99.4% | Memory usage: 145MB', timestamp: '2026-07-17 16:55' }
  ]);

  // 4. Test Results Table (Requirement 6, 7 & 20 & 21)
  const [testResults, setTestResults] = useState<TestResultRecord[]>([
    { id: 'TST-01', testType: 'Unit Testing', result: 'Passed', coverage: 95.5, date: '2026-07-17', passedCount: 150, failedCount: 0, warningCount: 0 },
    { id: 'TST-02', testType: 'Integration Testing', result: 'Passed', coverage: 94.2, date: '2026-07-17', passedCount: 120, failedCount: 0, warningCount: 2 },
    { id: 'TST-03', testType: 'API Testing', result: 'Passed', coverage: 98.0, date: '2026-07-17', passedCount: 95, failedCount: 0, warningCount: 0 },
    { id: 'TST-04', testType: 'Security Testing', result: 'Passed', coverage: 100, date: '2026-07-17', passedCount: 45, failedCount: 0, warningCount: 1 },
    { id: 'TST-05', testType: 'Performance Testing', result: 'Warning', coverage: 85.0, date: '2026-07-17', passedCount: 20, failedCount: 0, warningCount: 5 },
    { id: 'TST-06', testType: 'AI Testing', result: 'Passed', coverage: 90.5, date: '2026-07-17', passedCount: 15, failedCount: 0, warningCount: 3 },
    { id: 'TST-07', testType: 'User Acceptance Testing', result: 'Passed', coverage: 82.0, date: '2026-07-17', passedCount: 5, failedCount: 0, warningCount: 1 }
  ]);

  // 5. Backups Table (Requirement 15 & 20 & 21)
  const [backups, setBackups] = useState<BackupRecord[]>([
    { id: 'BKP-01', type: 'Database Backup', location: 'S3 Secure Vault Riyadh Zone', status: 'Completed', date: '2026-07-17 04:00', sizeMb: 24500 },
    { id: 'BKP-02', type: 'Document Backup', location: 'Glacier Immutable Vault Riyadh Zone', status: 'Completed', date: '2026-07-17 03:00', sizeMb: 124000 },
    { id: 'BKP-03', type: 'Configuration Backup', location: 'Local KMS HSM Storage', status: 'Completed', date: '2026-07-17 02:00', sizeMb: 45 }
  ]);

  // 6. Support Tickets (Requirement 18 & 20)
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>([
    { id: 'TCK-101', organization: 'Al Noor Islamic Finance', issue: 'Requesting validation API schema documentation adjustments for SAP S/4HANA Ledger API', priority: 'High', status: 'In Progress', category: 'Integration', createdAt: '2026-07-17 10:15' },
    { id: 'TCK-102', organization: 'Global Halal FinTech', issue: 'Question about purification audit rules categorization logic constraints', priority: 'Medium', status: 'Open', category: 'Compliance Question', createdAt: '2026-07-17 14:30' },
    { id: 'TCK-103', organization: 'Crypto Compliance Labs', issue: 'API Gateway sandbox CORS configuration challenge', priority: 'Low', status: 'Resolved', category: 'Technical Issue', createdAt: '2026-07-16 09:00' }
  ]);

  // CI/CD Build Logs (Requirement 5)
  const [buildLogs, setBuildLogs] = useState<string[]>([
    '[17:08:14] CI/CD Pipeline Initiated for commit hash: #4c8a91c',
    '[17:08:15] STEP 1: Code Linting - SUCCESS (0 errors, 4 warnings)',
    '[17:08:18] STEP 2: Running Automated Tests Pool - SUCCESS (450 passed, 0 failed, 12 warnings)',
    '[17:08:24] STEP 3: SAST Security Vulnerability Scans - SUCCESS (No critical issues found)',
    '[17:08:31] STEP 4: Docker Container Packaging - SUCCESS (Image ID: sha256:icap-1.0.1-rc3)',
    '[17:08:35] STEP 5: Pushing Image to Sovereign Riyadh Registry - SUCCESS',
    '[17:08:42] STEP 6: Deploying instance to Staging server - SUCCESS',
    '[17:08:45] Pipeline execution finished successfully. Waiting for Admin Approval to promote to Production.'
  ]);

  // Custom Interactive States
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedEnvForBackup, setSelectedEnvForBackup] = useState('Production');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security Policy Settings (Requirement 8, 9, 10)
  const [securityHardening, setSecurityHardening] = useState({
    aes256Enabled: true,
    tls13Enforced: true,
    mfaEnforced: true,
    sqlInjectionShield: true,
    xssShield: true,
    csrfShield: true,
    virusScanningEnforced: true,
    allowedUploadTypes: '.pdf, .docx, .xlsx, .json',
    maxUploadSizeMb: 50,
    tenantIsolationMethod: 'PostgreSQL Row-Level Security (RLS) + Isolated Storage Vaults'
  });

  // Background Jobs state (Requirement 13)
  const [backgroundJobs, setBackgroundJobs] = useState([
    { name: 'SAP ERP Transactions Sync', status: 'Running', queue: 'Primary ERP Pipeline', duration: '1.2s', errors: 0, progress: 82 },
    { name: 'Mambu Core Ledger Validation', status: 'Completed', queue: 'Audit Validate Pool', duration: '45s', errors: 0, progress: 100 },
    { name: 'SAMA Automated Certification Renewals', status: 'Idle', queue: 'Regulatory Cron', duration: 'N/A', errors: 0, progress: 0 },
    { name: 'Purification Charity Allocation Engine', status: 'Failed', queue: 'Compliance Core Queue', duration: '18s', errors: 1, progress: 40 }
  ]);

  // Error Center Tracking Logs (Requirement 17)
  const [errorLogs, setErrorLogs] = useState([
    { id: 'ERR-301', timestamp: '2026-07-17 16:42:01', endpoint: '/api/v1/erp/sync', severity: 'High', error: 'ECONNRESET Socket closed prematurely by remote host', user: 'Al Noor Integration Worker', resolved: false },
    { id: 'ERR-302', timestamp: '2026-07-17 15:20:11', endpoint: '/api/v1/ai/sharia-audit', severity: 'Medium', error: 'Gemini RateLimitError: Context window throttle reached', user: 'Sarah Al-Ghamdi', resolved: true },
    { id: 'ERR-303', timestamp: '2026-07-17 11:05:44', endpoint: '/api/v1/certificates/generate', severity: 'Critical', error: 'HSM Signature Module timeout response', user: 'Zayd Al-Khair', resolved: false }
  ]);

  // Support ticket form state
  const [ticketOrg, setTicketOrg] = useState('');
  const [ticketIssue, setTicketIssue] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [ticketCategory, setTicketCategory] = useState<'Technical Issue' | 'Billing' | 'Integration' | 'Compliance Question'>('Technical Issue');

  // Interactive functions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketOrg || !ticketIssue) return;
    const newTck: SupportTicketRecord = {
      id: `TCK-${Math.floor(Math.random() * 900) + 100}`,
      organization: ticketOrg,
      issue: ticketIssue,
      priority: ticketPriority,
      status: 'Open',
      category: ticketCategory,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setSupportTickets([newTck, ...supportTickets]);
    setTicketOrg('');
    setTicketIssue('');
    triggerToast('New Support Ticket successfully created.');
    onTriggerActivityLog('CREATE_SUPPORT_TICKET', `Created support ticket for ${ticketOrg}`);
  };

  const handleResolveTicket = (id: string) => {
    setSupportTickets(supportTickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    triggerToast(`Ticket ${id} resolved successfully.`);
  };

  const handleTriggerBackup = () => {
    const newBkp: BackupRecord = {
      id: `BKP-${Math.floor(Math.random() * 900) + 100}`,
      type: 'Database Backup',
      location: `S3 Immutable Vault Riyadh (${selectedEnvForBackup})`,
      status: 'Completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      sizeMb: 24650
    };
    setBackups([newBkp, ...backups]);
    triggerToast(`Automated backup dispatched and successfully written to Sovereign S3 for ${selectedEnvForBackup}.`);
    onTriggerActivityLog('DISPATCH_BACKUP', `Manually triggered complete database snapshot for env: ${selectedEnvForBackup}`);
  };

  const handleDeployNewVersion = (envName: string, version: string) => {
    setIsDeploying(true);
    triggerToast(`Deploying ${version} to ${envName}...`);
    setTimeout(() => {
      setIsDeploying(false);
      setEnvironments(environments.map(e => e.name === envName ? { ...e, version, deploymentDate: 'Just Now' } : e));
      const newDep: DeploymentRecord = {
        id: `DEP-${Math.floor(Math.random() * 900) + 100}`,
        version,
        environment: envName as any,
        status: 'Active',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        developer: 'System Administrator (Manual Trigger)',
        changes: `Deployment update patch applied to ${envName}`
      };
      setDeployments([newDep, ...deployments]);
      triggerToast(`Successfully promoted version ${version} to environment: ${envName}`);
      onTriggerActivityLog('VERSION_DEPLOYMENT', `Deployed version ${version} to environment ${envName}`);
    }, 2000);
  };

  const handleRollbackVersion = (depId: string) => {
    setDeployments(deployments.map(d => d.id === depId ? { ...d, status: 'Rolled Back' } : d));
    triggerToast(`Initiated rapid roll-back procedure for deployment transaction: ${depId}`);
    onTriggerActivityLog('VERSION_ROLLBACK', `Executed emergency rollback of deployment ${depId}`);
  };

  const handleToggleHardeningSetting = (field: keyof typeof securityHardening) => {
    setSecurityHardening(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    triggerToast(`Platform Security Hardening updated.`);
  };

  const handleResolveError = (id: string) => {
    setErrorLogs(errorLogs.map(err => err.id === id ? { ...err, resolved: true } : err));
    triggerToast(`Error entry ${id} marked as Resolved.`);
  };

  return (
    <div className="space-y-6">
      {/* Platform Title Section */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز الجاهزية والتشغيل والتحصين' : 'ICAP Production Readiness Center'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/10">
                  {isRTL ? 'جاهز للإنتاج' : 'Production Ready'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL
                  ? 'رصد جاهزية البنية التحتية السحابية لخدمة كبرى المؤسسات المالية الإسلامية والبنوك الاستثمارية بدقة وثبات.'
                  : 'Sovereign cloud operations, CI/CD telemetry, automated SAMA audit matrices, testing frameworks, and high-performance replication monitors.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector sub-navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/85 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة القيادة والمقاييس' : 'Readiness Dashboard', icon: Activity },
            { id: 'architecture', name: isRTL ? 'التوثيق المعماري للمنصة' : 'Architecture Docs', icon: Layers },
            { id: 'environments', name: isRTL ? 'إدارة البيئات السحابية' : 'Environments', icon: Server },
            { id: 'deployments', name: isRTL ? 'التكامل المستمر CI/CD' : 'Deployments', icon: Terminal },
            { id: 'testing', name: isRTL ? 'مركز الاختبارات المؤتمتة' : 'Testing Center', icon: CheckCircle },
            { id: 'security', name: isRTL ? 'تحصين الأمان والبيانات' : 'Security Hardening', icon: Shield },
            { id: 'performance', name: isRTL ? 'الأداء والسرعة التشغيلية' : 'Performance Speed', icon: Sliders },
            { id: 'background_jobs', name: isRTL ? 'مدير العمليات الخلفية' : 'Background Jobs', icon: Clock },
            { id: 'backups', name: isRTL ? 'النسخ الاحتياطي والإنقاذ' : 'Backup & Disaster Recovery', icon: HardDrive },
            { id: 'errors', name: isRTL ? 'مركز الأخطاء والتعقب' : 'Error Tracking', icon: AlertTriangle },
            { id: 'support', name: isRTL ? 'تذاكر الدعم والمساندة' : 'Customer Support', icon: LifeBuoy },
            { id: 'documentation', name: isRTL ? 'دليل المعرفة التقنية' : 'Docs Center', icon: BookOpen }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating alert/toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 text-xs border border-slate-700 animate-pulse">
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER ACTIVE TAB */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. READINESS DASHBOARD */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Cards (Requirement 1 & 21) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { title: isRTL ? 'درجة التحصين الأمني' : 'Security Score', value: '98%', desc: 'FIPS-140 Compliant', color: 'text-emerald-500' },
                { title: isRTL ? 'معدل جودة الأداء' : 'Performance Score', value: '95%', desc: 'Page Load <1.4s', color: 'text-emerald-500' },
                { title: isRTL ? 'تغطية الاختبارات' : 'Test Coverage', value: '92%', desc: '450 Automated Tests', color: 'text-emerald-500' },
                { title: isRTL ? 'جاهزية وتوافر النظام' : 'System Availability', value: '99.9%', desc: 'Trailing 30 days uptime', color: 'text-emerald-500' },
                { title: isRTL ? 'حالة النسخ الاحتياطي' : 'Backup Status', value: 'Healthy', desc: 'Daily Snapshots verified', color: 'text-emerald-500' },
                { title: isRTL ? 'جاهزية النشر السحابي' : 'Deployment Status', value: 'Production Ready', desc: 'SAMA Audited ICAP 1.0.0', color: 'text-emerald-500 font-bold' }
              ].map((card, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{card.title}</span>
                  <span className="text-2xl font-display font-bold block mt-2 text-slate-900 dark:text-white">{card.value}</span>
                  <span className="text-[10px] text-emerald-600 font-sans block mt-1">{card.desc}</span>
                </div>
              ))}
            </div>

            {/* Quick Metrics & System Health Status Grid (Requirement 22) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Live System Health Monitor */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2 space-y-4`}>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'حالة جاهزية الخدمات الفرعية' : 'Sub-Services Telemetry (Requirement 20)'}</h3>
                    <p className="text-[11px] text-slate-400">{isRTL ? 'تحديث حي من البنية التحتية لبوابة الخدمات.' : 'Real-time heartbeat indicators for secure multi-tenant microservices.'}</p>
                  </div>
                  <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
                </div>
                <div className="space-y-3">
                  {systemHealth.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white block">{item.service}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{item.metric}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Key Metrics Performance Gauge */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مؤشرات التقييم الشاملة' : 'Operations Hardening Summary'}</h3>
                <div className="space-y-4 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{isRTL ? 'الأمان والامتثال للبيانات' : 'Sovereign Cryptography'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">98% Passed</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{isRTL ? 'سرعة الاستجابة تحت الضغط' : 'Load Mitigation Threshold'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">95% Passed</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[95%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{isRTL ? 'سلاسة الربط مع أنظمة الـ ERP' : 'ERP Connector Pipeline'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">92% Latency ok</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[92%]" />
                    </div>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {isRTL ? 'تنبيه مجدول: النسخ القادم يتم خلال ٤ ساعات' : 'Next Sovereign Backup in 4h'}
                    </p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      {isRTL ? 'سيتم ضغط وتوقيع كود المعاملات تلقائياً عبر HSM.' : 'Immutable blockchain verification checks are scheduled for automated execution.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARCHITECTURE DOCUMENTATION (Requirement 2) */}
        {activeSubTab === 'architecture' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'الهيكل الفني والمعماري لمنصة ICAP' : 'Sovereign Multi-Tenant SaaS Architecture'}</h3>
                <p className="text-[11px] text-slate-400">{isRTL ? 'الهيكل المعماري والتدفق البياني لإدارات المنصة.' : 'Complete logical overview of data flow routing, components, security boundaries, and sovereign constraints.'}</p>
              </div>

              {/* Graphical block flow map */}
              <div className="flex flex-col items-center gap-4 py-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-4 overflow-x-auto">
                {[
                  { layer: 'Frontend Layer', desc: 'Secure React (Vite) Single-Page App with Tailwind CSS, RTL support & Lucide asset maps' },
                  { layer: 'API Layer', desc: 'Express API routing proxy, strict JWT, and rate limiters with client tracking keys' },
                  { layer: 'Business Logic Layer', desc: 'Compliance checking logic state machines, audit trails, and certification pools' },
                  { layer: 'AI Services Layer', desc: 'Gemini-powered Sharia AI model analysis engines, accounting ledger verification' },
                  { layer: 'Integration Layer', desc: 'Bi-directional ERP connectors (SAP, Odoo, Oracle Netsuite) over secured webhooks' },
                  { layer: 'Database Layer', desc: 'PostgreSQL instance pool with strict multi-tenant Row-Level Security isolation' },
                  { layer: 'Storage Layer', desc: 'Sovereign Riyadh-dedicated S3 Storage Vaults with transparent data encryption' }
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <div className="w-1.5 h-6 bg-slate-300 dark:bg-slate-700 rounded animate-pulse" />}
                    <div className="w-full max-w-xl p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex items-center gap-4">
                      <div className="bg-emerald-600/10 text-emerald-600 p-2.5 rounded-lg font-bold text-xs font-mono">
                        0{idx + 1}
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-950 dark:text-white block">{item.layer}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Architectural components descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">{isRTL ? 'مستويات عزل البيانات للعملاء' : 'Multi-Tenant Security Boundaries'}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    {isRTL
                      ? 'يتم فرض عزل البيانات بشكل كامل وصارم عبر تقنية PostgreSQL Row-Level Security (RLS) ومفاتيح تشفير منفصلة لكل عميل (KMS per-tenant) لمنع أي احتمالية لتداخل البيانات أو تسريبها.'
                      : 'We enforce strong cryptographic isolation using Row-Level Security (RLS) coupled with envelope encryption. Dynamic schema filtering prevents any form of cross-tenant cross-talk.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/30 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">{isRTL ? 'الربط السحابي مع أنظمة الـ ERP' : 'Secure ERP Integration Pipelines'}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                    {isRTL
                      ? 'تدفق بياني آمن عبر قنوات اتصال مشفرة ومصادقة مزدوجة مع أنظمة أودو وساب لتسجيل وتحليل كود المعاملات بشكل حي ومباشر دون المساس بأمن الخوادم.'
                      : 'Bi-directional transaction pipelines are routed via mutual TLS (mTLS) with cryptographically signed payloads, ensuring zero-trust ERP transactional validation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ENVIRONMENT MANAGEMENT (Requirement 3 & 21) */}
        {activeSubTab === 'environments' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إدارة البيئات السحابية النشطة' : 'Multi-Tier Environment Registry'}</h3>
                  <p className="text-[11px] text-slate-400">{isRTL ? 'رصد البنية التحتية والمنافذ والعناوين المخصصة لكل مستوى.' : 'Track live database mapping, TLS states, and active deployment versions.'}</p>
                </div>
                <Server className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {environments.map((env, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-bold text-slate-950 dark:text-white text-sm">{env.name}</h4>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-500/10 text-slate-500 px-2.5 py-0.5 rounded-full">
                        {env.version}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Endpoint URL:</span>
                        <a href={env.url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">{env.url}</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Database Pool:</span>
                        <span className="text-slate-800 dark:text-slate-200 text-right max-w-[200px] truncate">{env.database}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Availability Rate:</span>
                        <span className="text-emerald-600 font-bold">{env.health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cloud Region:</span>
                        <span>{env.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Encryption Layer:</span>
                        <span className="text-emerald-600">{env.tlsCertificate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Synced:</span>
                        <span className="text-slate-500">{env.deploymentDate}</span>
                      </div>
                    </div>

                    {/* Controls to prompt upgrade / test run */}
                    <div className="flex gap-2 pt-2 border-t border-slate-150/40 dark:border-slate-800/80">
                      <button
                        onClick={() => handleDeployNewVersion(env.name, 'ICAP 1.0.1-RC3')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 rounded transition"
                      >
                        {isRTL ? 'ترقية الإصدار' : 'Promote/Deploy Release'}
                      </button>
                      <button
                        onClick={() => triggerToast(`Running fast health metrics analysis checks on ${env.name}...`)}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-3 py-1.5 rounded transition"
                      >
                        {isRTL ? 'فحص الاتصال' : 'Ping Cluster'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. DEPLOYMENT MANAGEMENT & CI/CD (Requirement 4 & 5) */}
        {activeSubTab === 'deployments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side: CI/CD Pipeline Visual and telemetry */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2 space-y-4`}>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'حالة خطوط الإنتاج الآلية CI/CD' : 'Sovereign CI/CD Release Pipeline'}</h3>
                    <p className="text-[11px] text-slate-400">{isRTL ? 'رصد الخطوات التلقائية وبناء الحاويات.' : 'Continuous integration automated checkpoints, security, and approval states.'}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    Pipeline Idle
                  </span>
                </div>

                {/* Vertical graphical pipeline view */}
                <div className="space-y-3 py-2 text-xs">
                  {[
                    { step: 'Code Commit', status: 'SUCCESS', details: 'Triggered by commit #4c8a91c with signed PGP key', date: '17:08:14' },
                    { step: 'Automated Tests Matrix', status: 'SUCCESS', details: 'Ran 450 unit & integration tests inside sandbox docker', date: '17:08:18' },
                    { step: 'SAST Security Audit Scan', status: 'SUCCESS', details: 'Checkmarx static code security, zero critical warnings', date: '17:08:24' },
                    { step: 'Production Container Package Build', status: 'SUCCESS', details: 'Created minimized CJS esbuild production container', date: '17:08:31' },
                    { step: 'Deploy to Sovereign Staging', status: 'SUCCESS', details: 'Successfully updated me-central2 Riyadh cluster target', date: '17:08:42' },
                    { step: 'Promotion Approval Checkpoint', status: 'PENDING', details: 'Awaiting digital signature from platform administrator', date: 'Pending' }
                  ].map((p, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex flex-col items-center">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          p.status === 'SUCCESS' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {p.status === 'SUCCESS' ? '✓' : '•'}
                        </span>
                        {i < 5 && <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-800" />}
                      </div>
                      <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 dark:text-white">{p.step}</span>
                          <span className="text-[10px] font-mono text-slate-400">{p.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{p.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      triggerToast('Pipeline deployment run dispatched.');
                      setBuildLogs([...buildLogs, `[${new Date().toLocaleTimeString()}] Pipeline run manually dispatched...`]);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    {isRTL ? 'إطلاق بناء فوري' : 'Trigger New Pipeline Run'}
                  </button>
                </div>
              </div>

              {/* Right Side: Deployment History & Actions */}
              <div className="space-y-6">
                {/* Build Console Logs */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'مخرجات الكونسول في خط الإنتاج' : 'CI/CD Console Telemetry Logs'}</h3>
                  <div className="p-3 bg-slate-950 text-slate-300 rounded-xl font-mono text-[9px] leading-relaxed max-h-48 overflow-y-auto space-y-1">
                    {buildLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>

                {/* Release History */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تاريخ التحديثات والإصدارات' : 'Sovereign Deployment Registry'}</h3>
                  <div className="space-y-3 text-xs">
                    {deployments.map((dep) => (
                      <div key={dep.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{dep.version}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                            dep.status === 'Active' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {dep.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{dep.changes}</p>
                        <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-1.5 font-mono">
                          <span>{dep.date}</span>
                          <span>Dev: {dep.developer}</span>
                        </div>
                        {dep.status === 'Active' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleRollbackVersion(dep.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded transition"
                            >
                              {isRTL ? 'استرجاع الإصدار السابق' : 'Rollback Version'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. TESTING FRAMEWORK & SCENARIOS (Requirement 6 & 7) */}
        {activeSubTab === 'testing' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'لوحة جودة الاختبارات والتحقق الآلي' : 'Enterprise Automation Testing Framework'}</h3>
                  <p className="text-[11px] text-slate-400">
                    {isRTL
                      ? 'رصد مستويات الأمان ومطابقة قواعد المعاملات المصرفية بالشريعة الإسلامية.'
                      : 'Displaying overall test coverage across functional logic nodes.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl font-mono font-bold">
                    {isRTL ? '٤٥٠ اختبار ناجح' : '450 Tests Passed'}
                  </span>
                  <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-xl font-mono font-bold">
                    {isRTL ? '١٢ تنبيه جودة' : '12 Warnings'}
                  </span>
                </div>
              </div>

              {/* Grid with testing types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {testResults.map((test) => (
                  <div key={test.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{test.testType}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        test.result === 'Passed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {test.result}
                      </span>
                    </div>

                    {/* Progress representation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Code Coverage:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{test.coverage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${test.coverage}%` }} className="bg-emerald-500 h-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] border-t border-slate-100 dark:border-slate-800/60 pt-2 text-slate-500">
                      <div>
                        <span className="text-emerald-600 font-bold block">{test.passedCount}</span>
                        <span>Passed</span>
                      </div>
                      <div>
                        <span className="text-red-500 font-bold block">{test.failedCount}</span>
                        <span>Failed</span>
                      </div>
                      <div>
                        <span className="text-amber-500 font-bold block">{test.warningCount}</span>
                        <span>Warn</span>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerToast(`Re-running complete automated test suite for: ${test.testType}`)}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-1 rounded transition"
                    >
                      {isRTL ? 'إعادة الاختبار' : 'Run Verification Suite'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Section with Demo Test Scenarios (Requirement 7) */}
              <div className="border-t border-slate-150/40 dark:border-slate-800/80 pt-6 space-y-4 text-xs">
                <h4 className="font-display font-bold text-slate-900 dark:text-white">{isRTL ? 'سجلات المحاكاة وحالات الاختبار التفاعلية' : 'Interactive Automated Test Verification Scenarios'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      cat: 'AUTHENTICATION SECURITY',
                      tests: [
                        { name: 'Login works (PBKDF2 validation)', status: 'PASS' },
                        { name: 'Password expiry rules enforcement', status: 'PASS' },
                        { name: 'FIDO2 WebAuthn biometric MFA works', status: 'PASS' }
                      ]
                    },
                    {
                      cat: 'ERP SYNC PIPELINES',
                      tests: [
                        { name: 'Odoo handshake & credentials valid', status: 'PASS' },
                        { name: 'SAP ledger payload schema validation', status: 'PASS' },
                        { name: 'Sync integrity check under high load', status: 'PASS' }
                      ]
                    },
                    {
                      cat: 'AI GOVERNANCE GATES',
                      tests: [
                        { name: 'Sharia confidence threshold gating', status: 'PASS' },
                        { name: 'Murabaha contract automated analysis', status: 'PASS' },
                        { name: 'Evidence matching ledger logs', status: 'PASS' }
                      ]
                    },
                    {
                      cat: 'REGULATORY CERTIFICATION',
                      tests: [
                        { name: 'Secured cryptographic stamp insertion', status: 'PASS' },
                        { name: 'Cryptographical QR code verification', status: 'PASS' },
                        { name: 'Audit compliance certificate build', status: 'PASS' }
                      ]
                    }
                  ].map((group, gIdx) => (
                    <div key={gIdx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-mono">{group.cat}</span>
                      <div className="space-y-2">
                        {group.tests.map((t, tIdx) => (
                          <div key={tIdx} className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-600 dark:text-slate-300">{t.name}</span>
                            <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => triggerToast(`Initiated simulation execution for scenario block: ${group.cat}`)}
                        className="w-full text-center text-emerald-600 hover:text-emerald-700 text-[10px] font-bold mt-1"
                      >
                        {isRTL ? 'تشغيل فحص فوري' : 'Trigger Simulation Run'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. SECURITY HARDENING & DATA SECURITY (Requirement 8, 9 & 10) */}
        {activeSubTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Security Hardening Controls */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'لوحة تحصين وإدارة الأمان' : 'Cryptographic Security Hardening'}</h3>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="space-y-4">
                  {[
                    { label: isRTL ? 'تفعيل تشفير المعاملات AES-256' : 'AES-256 Data-at-Rest Encryption', desc: 'Enforce complete database block-level storage cryptography.', stateKey: 'aes256Enabled' },
                    { label: isRTL ? 'إلزام بروتوكول TLS 1.3' : 'Enforce HTTPS & TLS 1.3 Transport Encryption', desc: 'Deny legacy connection requests with TLS 1.2 or below.', stateKey: 'tls13Enforced' },
                    { label: isRTL ? 'إلزامية المصادقة الثنائية MFA' : 'Enforce MFA across all tenant administrator roles', desc: 'Block logins missing FIDO2 or cryptographically salted SMS.', stateKey: 'mfaEnforced' },
                    { label: isRTL ? 'حماية ضد حقن قواعد البيانات SQL' : 'SQL Injection Shield (ORM-enforced)', desc: 'Pre-parsed parameters on Drizzle & Cloud SQL connections.', stateKey: 'sqlInjectionShield' },
                    { label: isRTL ? 'حماية ضد الثغرات البرمجية XSS' : 'Cross-Site Scripting (XSS) Mitigation Header', desc: 'Verify incoming payload against code execution elements.', stateKey: 'xssShield' },
                    { label: isRTL ? 'حماية ضد التزوير CSRF' : 'CSRF Cryptographical Token verification', desc: 'Verify session header parameters against request identifiers.', stateKey: 'csrfShield' },
                    { label: isRTL ? 'الفحص التلقائي للمستندات المرفوعة' : 'Immutable ClamAV Document Scanner', desc: 'Isolate and scan every PDF transaction evidence on upload.', stateKey: 'virusScanningEnforced' }
                  ].map((policy, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                      <div>
                        <span className="font-bold text-slate-950 dark:text-white block text-xs">{policy.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{policy.desc}</span>
                      </div>
                      <button
                        onClick={() => handleToggleHardeningSetting(policy.stateKey as any)}
                        className={`w-11 h-6 rounded-full p-1 transition duration-200 ${
                          securityHardening[policy.stateKey as keyof typeof securityHardening] ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-800'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${
                          securityHardening[policy.stateKey as keyof typeof securityHardening] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: File Security System & Tenant Isolation (Requirement 10) */}
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'نظام أمان عزل بيانات العملاء' : 'Multi-Tenant Isolation Protocol'}</h3>
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    <p>
                      <strong className="text-slate-900 dark:text-white block mb-1">Row-Level Security (RLS) Policy:</strong>
                      {isRTL
                        ? 'تطبيق سياسة عزل صارمة لضمان خصوصية بيانات المعاملات المالية لكل عميل على حدة.'
                        : 'ICAP implements a strict tenant-isolation framework. Row-Level Security checks are executed at the native PostgreSQL database level, preventing any potential cross-tenant leakage.'}
                    </p>
                    <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[9px]">
                      {`-- PostgreSQL Tenant Isolation Check (Sample Core SQL Policy)
CREATE POLICY tenant_isolation_policy ON transactions_ledger
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id'));`}
                    </div>
                  </div>
                </div>

                {/* File Upload Security Gate (Requirement 10) */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إعدادات أمان المستندات المرفوعة' : 'File Access & Secure Upload Management'}</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{isRTL ? 'المستندات المسموحة:' : 'Allowed Document Extensions:'}</span>
                      <span className="font-mono bg-slate-500/10 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded font-bold">{securityHardening.allowedUploadTypes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{isRTL ? 'الحد الأقصى لحجم الملف:' : 'Maximum File Upload Size Limit:'}</span>
                      <span className="font-mono bg-slate-500/10 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded font-bold">{securityHardening.maxUploadSizeMb} MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{isRTL ? 'مستوى التشفير للوسائط:' : 'S3 Storage Encryption Key:'}</span>
                      <span className="text-emerald-600 font-bold">AWS-KMS Sovereign Custom AES-256</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. PERFORMANCE OPTIMIZATION (Requirement 11) */}
        {activeSubTab === 'performance' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مراقبة سرعة ومعدلات الأداء التشغيلي' : 'High-Performance Diagnostics telemetry'}</h3>
                <p className="text-[11px] text-slate-400">{isRTL ? 'رصد مؤشرات استجابة النظام وقياسها مقارنة بالأهداف المطلوبة.' : 'Real-time performance measurements against target SLAs for enterprise readiness.'}</p>
              </div>

              {/* Targets / Actual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                {[
                  { name: 'Average API Response Time', target: '< 500ms', actual: '42ms', pct: 98, color: 'bg-emerald-500' },
                  { name: 'Compliance Dashboard Page Load', target: '< 2.0s', actual: '1.2s', pct: 95, color: 'bg-emerald-500' },
                  { name: 'PostgreSQL Database Query Speed', target: '< 100ms', actual: '15ms', pct: 99, color: 'bg-emerald-500' },
                  { name: 'Gemini AI Sharia Analysis', target: '< 5.0s', actual: '3.4s', pct: 90, color: 'bg-emerald-500' },
                  { name: 'ERP Ledger Synchronization Speed', target: '< 15.0s', actual: '8.2s', pct: 92, color: 'bg-emerald-500' }
                ].map((perf, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">{perf.name}</span>
                    <div className="flex justify-between text-[11px] font-mono mt-2">
                      <span className="text-slate-400">Target:</span>
                      <span className="text-slate-600 dark:text-slate-300">{perf.target}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Actual:</span>
                      <span className="text-emerald-600 font-bold">{perf.actual}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                      <div style={{ width: `${perf.pct}%` }} className={`h-full ${perf.color}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scalability and performance notes */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs space-y-2 leading-relaxed">
                <h4 className="font-bold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  {isRTL ? 'إستراتيجية التوسع والتكامل تحت الضغط العالي' : 'Scalability Architecture Plan (Requirement 12)'}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {isRTL
                    ? 'المنصة مصممة للتوسع والربط الأفقي عبر معالجة مهام التحقق في الخلفية (Background workers) وتفعيل تقنيات التخزين المؤقت الموزع (Redis Cache clustering) للتعامل بمرونة وسهولة مع آلاف المؤسسات وملايين المعاملات المالية دون توقف.'
                    : 'ICAP handles horizontal scaling via partition-based message queues and localized Redis cache rings. Real-time auditing triggers are processed asynchronously by independent background workers, mitigating synchronous bottlenecks during peak transaction runs.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 8. BACKGROUND JOB MANAGER (Requirement 13) */}
        {activeSubTab === 'background_jobs' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مدير العمليات الخلفية المستمرة' : 'Sovereign Background Job Controller'}</h3>
                <Server className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Jobs list table representation */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="p-3">{isRTL ? 'العملية والمجال' : 'Job Name & Target'}</th>
                      <th className="p-3">{isRTL ? 'مسار الطابور' : 'Queue Pool'}</th>
                      <th className="p-3">{isRTL ? 'المستغرق' : 'Last Execution Duration'}</th>
                      <th className="p-3">{isRTL ? 'الأخطاء' : 'Failures Count'}</th>
                      <th className="p-3">{isRTL ? 'حالة التشغيل' : 'Status'}</th>
                      <th className="p-3 text-right">{isRTL ? 'التحكم بالتشغيل' : 'Manual Dispatch'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {backgroundJobs.map((job, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{job.name}</span>
                          <span className="text-[10px] text-slate-400">Scheduled Trigger Cron</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-500">{job.queue}</td>
                        <td className="p-3 font-mono text-[11px]">{job.duration}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                            job.errors > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'
                          }`}>
                            {job.errors} Errors
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === 'Running' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            job.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-150 text-slate-600'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              triggerToast(`Manual execution request dispatched for job: ${job.name}`);
                              setBackgroundJobs(prev => prev.map((j, i) => i === idx ? { ...j, status: 'Running', duration: 'Running...' } : j));
                              setTimeout(() => {
                                setBackgroundJobs(prev => prev.map((j, i) => i === idx ? { ...j, status: 'Completed', duration: '4.2s' } : j));
                              }, 2000);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded transition"
                          >
                            {isRTL ? 'إطلاق يدوي فوري' : 'Dispatch Now'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. BACKUP & DISASTER RECOVERY (Requirement 15 & 16) */}
        {activeSubTab === 'backups' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Backup Trigger Dashboard panel */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2 space-y-4`}>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'لوحة النسخ الاحتياطي والإنقاذ الكارثي' : 'Sovereign Backup & Restore Point Registry (Requirement 20)'}</h3>
                  <HardDrive className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="space-y-4">
                  {/* Select Environment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-bold block">{isRTL ? 'اختر البيئة السحابية للنسخ:' : 'Target Environment Pool:'}</label>
                      <select
                        value={selectedEnvForBackup}
                        onChange={(e) => setSelectedEnvForBackup(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                      >
                        <option value="Production">Production Server</option>
                        <option value="Staging">Staging Server</option>
                        <option value="Testing">Testing matrix Sandbox</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-bold block">{isRTL ? 'مسار الحفظ الاستراتيجي للمستندات:' : 'Sovereign S3 Vault Zone:'}</label>
                      <span className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 font-mono font-bold text-[11px] block">
                        Riyadh-me-central2 Secure HSM Crypt Vault
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleTriggerBackup}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      {isRTL ? 'إطلاق نسخ احتياطي فوري' : 'Trigger Automated Vault Snapshot'}
                    </button>
                  </div>
                </div>

                {/* Backups log list (Requirement 20) */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <span className="text-xs font-bold text-slate-400 block">{isRTL ? 'تاريخ وسجلات النسخ الاحتياطي الناجح:' : 'Sovereign Backups Log (Requirement 20):'}</span>
                  {backups.map((bkp) => (
                    <div key={bkp.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 text-xs font-mono">
                      <div>
                        <span className="font-bold text-slate-950 dark:text-white block text-[11px]">{bkp.type}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{bkp.location}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 font-bold block">{(bkp.sizeMb / 1000).toFixed(2)} GB</span>
                        <span className="text-[10px] text-slate-400 block">{bkp.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disaster Recovery Plan (Requirement 16) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'خطة الطوارئ والإنقاذ الكارثي SLA' : 'Sovereign Disaster Recovery Plan'}</h3>
                <div className="space-y-4 pt-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase font-mono">Recovery Point Objective (RPO)</span>
                    <span className="text-xl font-display font-bold block mt-1 text-slate-900 dark:text-white">15 Minutes</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Maximum transactional history loss parameter under total cluster blackout.</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase font-mono">Recovery Time Objective (RTO)</span>
                    <span className="text-xl font-display font-bold block mt-1 text-slate-900 dark:text-white">2 Hours</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Maximum recovery and full operations resumption limit across failover nodes.</span>
                  </div>
                  <div className="space-y-1.5 leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    <h4 className="font-bold text-slate-900 dark:text-white">{isRTL ? 'إجراءات تفعيل الإنقاذ والاستعادة:' : 'Automated Failover Protocols:'}</h4>
                    <p>
                      {isRTL
                        ? 'تلتزم بنية ICAP بإعادة تفعيل وتوجيه قنوات الخوادم والربط تلقائياً إلى خوادم Riyadh Cloud الاحتياطية بمجرد انخفاض استجابة الخادم الرئيسي.'
                        : 'ICAP maintains a hot-standby active cluster. In the event of primary database cluster failures, DNS routes are programmatically reconfigured to direct load to independent standby failovers.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. ERROR TRACKING LOGS (Requirement 17) */}
        {activeSubTab === 'errors' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مركز تتبع ومعالجة الأخطاء السحابية' : 'Sovereign API Error Mitigation & Tracking Center'}</h3>
                  <p className="text-[11px] text-slate-400">{isRTL ? 'مراقبة فورية لأي خلل أو تأخر استجابة في الطلبات الخارجية.' : 'Identify, analyze, and mark endpoint exceptions resolved before they affect customer accounts.'}</p>
                </div>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>

              {/* Errors logs list */}
              <div className="space-y-3 text-xs">
                {errorLogs.map((err) => (
                  <div key={err.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold font-mono text-[9px] uppercase ${
                          err.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                          err.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {err.severity} Priority
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{err.endpoint}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">{err.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-sans ${
                          err.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {err.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Stack trace mock block */}
                    <div className="p-3 bg-slate-950 text-slate-300 rounded-xl font-mono text-[10px] space-y-1">
                      <div>Error ID: {err.id}</div>
                      <div className="text-red-400">{err.error}</div>
                      <div className="text-slate-500 text-[9px]">{`  at /src/controllers/ledger-sync-controller.ts:44:12\n  at processTicksAndRejections (node:internal/process/task_queues:95:5)`}</div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
                      <span>Affected User: {err.user}</span>
                      {!err.resolved && (
                        <button
                          onClick={() => handleResolveError(err.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded transition"
                        >
                          {isRTL ? 'تأكيد المعالجة والإغلاق' : 'Mark exception as Resolved'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 11. CUSTOMER SUPPORT CENTER (Requirement 18 & 20) */}
        {activeSubTab === 'support' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* Left Column: Tickets and Support Dashboard */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2 space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إدارة تذاكر الدعم والمساندة المؤسسية' : 'Enterprise Customer Support Hub (Requirement 20)'}</h3>
                  <LifeBuoy className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="space-y-3">
                  {supportTickets.map((tck) => (
                    <div key={tck.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{tck.organization}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">Ticket ID: {tck.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Category: {tck.category} • {tck.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            tck.priority === 'Critical' || tck.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                          }`}>
                            {tck.priority} Priority
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            tck.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                            tck.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {tck.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{tck.issue}</p>

                      {tck.status !== 'Resolved' && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => handleResolveTicket(tck.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded transition"
                          >
                            {isRTL ? 'إغلاق وحل المشكلة' : 'Mark Resolved'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: New Support Ticket Request (SaaS support desk) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تقديم تذكرة دعم فني جديدة' : 'Submit New Support Ticket'}</h3>
                <form onSubmit={handleCreateSupportTicket} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">{isRTL ? 'اسم المؤسسة:' : 'Organization/Tenant Name:'}</label>
                    <input
                      type="text"
                      placeholder="e.g. Al Noor Islamic Finance"
                      value={ticketOrg}
                      onChange={(e) => setTicketOrg(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">{isRTL ? 'تصنيف الطلب:' : 'Category:'}</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    >
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Billing">Billing</option>
                      <option value="Integration">Integration</option>
                      <option value="Compliance Question">Compliance Question</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">{isRTL ? 'الأهمية والسرعة:' : 'Priority Level:'}</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">{isRTL ? 'تفاصيل ووصف المشكلة:' : 'Detailed Description:'}</label>
                    <textarea
                      rows={3}
                      placeholder="Specify your challenge..."
                      value={ticketIssue}
                      onChange={(e) => setTicketIssue(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition"
                  >
                    {isRTL ? 'إرسال التذكرة لفريق الدعم' : 'Dispatched Ticket Envelopes'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 12. DOCUMENTATION CENTER (Requirement 19) */}
        {activeSubTab === 'documentation' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مركز المعرفة والتوثيق للمنصة' : 'Sovereign SaaS Knowledge & Documentation Center'}</h3>
                <p className="text-[11px] text-slate-400">{isRTL ? 'الأدلة والتوثيق والمستندات الفنية المتكاملة.' : 'Full system user guides, technical integration API maps, and SAMA compliance methodology.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {[
                  {
                    title: isRTL ? 'دليل إرشادات المشرف الرئيسي' : 'SaaS System Admin Guide',
                    desc: isRTL ? 'كيفية تهيئة حسابات المشتركين الجدد، التحكم بمساحة التخزين السحابية، وضبط مصفوفات الصلاحيات المخصصة للمؤسسة.' : 'Complete reference on tenant limits allocation, module control flags, database storage pools, and security credential management.'
                  },
                  {
                    title: isRTL ? 'دليل التكامل والربط مع ERP' : 'ERP mTLS API Integration Guide',
                    desc: isRTL ? 'دليل الربط مع أنظمة ساب وأودو عبر التوقيعات الرقمية وقنوات الاتصال الآمنة والشهادات المصرفية.' : 'Detailed walkthroughs on configuring mTLS proxy bridges with Odoo, SAP S/4HANA, and routing ledger events seamlessly.'
                  },
                  {
                    title: isRTL ? 'منهجية المطابقة للشريعة الإسلامية' : 'Sharia Automated Audit Methodology',
                    desc: isRTL ? 'توثيق المعايير الشرعية المعتمدة من هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (AAOIFI).' : 'Deep-dive documentation mapping Gemini model rules to AAOIFI standards for Murabaha, Mudaraba, and corporate ledger structures.'
                  },
                  {
                    title: isRTL ? 'دليل أمان وتشفير البيانات' : 'Sovereign Security & Cryptography Guide',
                    desc: isRTL ? 'توثيق آليات التشفير والتحقق من التوقيعات الرقمية والتحصين من هجمات الاختراق وحقن الأكواد.' : 'Comprehensive reference on envelope encryption keys, postgres row-level security configuration, and virus defense system boundaries.'
                  },
                  {
                    title: isRTL ? 'توثيق بوابة المطورين والـ API' : 'Developer Gateway & SDK Guide',
                    desc: isRTL ? 'شرح استدعاءات الـ REST API وبناء وتوقيع حمولات البيانات وتفاصيل مخرجات الاستدعاء.' : 'Technical integration specifications detailing JWT payloads, webhook retry thresholds, rate limiting structures, and JSON format definitions.'
                  },
                  {
                    title: isRTL ? 'دليل المستخدم والشهادات الرقمية' : 'Customer Digital Certification Manual',
                    desc: isRTL ? 'كيفية تحميل الأدلة والبراهين، فحص المطابقة بالذكاء الاصطناعي، وإصدار شهادات الالتزام الموثقة.' : 'User-focused manual detailing evidence uploads, Sharia audit assistants chat prompts, and generating secured QR compliance seals.'
                  }
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      {doc.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed">{doc.desc}</p>
                    <button
                      onClick={() => triggerToast(`Downloaded: ${doc.title}`)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold block mt-3"
                    >
                      {isRTL ? 'تحميل المستند PDF' : 'Download Document Envelope'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
