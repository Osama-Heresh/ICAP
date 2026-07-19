import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Sliders,
  AlertTriangle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  FileText,
  Mail,
  Smartphone,
  Webhook,
  Zap,
  CheckSquare,
  Users,
  Compass,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Download,
  AlertCircle,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MonitoringCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
  initialSubTab?: 'dashboard' | 'rules' | 'events' | 'alerts' | 'reviews' | 'risk_map' | 'health';
}

// ----------------------------------------------------
// DATABASE EXTENSION INTERFACES (Requirement 17)
// ----------------------------------------------------
interface MonitoringRule {
  id: string;
  name: string;
  category: 'Islamic Finance' | 'Financial Controls' | 'Operational Compliance' | 'Risk Management';
  condition: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  action: string;
  frequency: 'Real-time' | 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
  status: 'Active' | 'Paused';
}

interface ComplianceEvent {
  id: string;
  source: string;
  type: 'Invoice Created' | 'Payment Processed' | 'Contract Uploaded' | 'Vendor Added' | 'Journal Entry Created' | 'Policy Updated';
  data: string;
  timestamp: string;
  status: 'Checked' | 'Flagged' | 'Processing';
}

interface ComplianceAlert {
  id: string;
  title: string;
  category: 'Sharia' | 'Financial' | 'Operational' | 'Risk' | 'Vendor';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  evidence: string;
  createdDate: string;
  status: 'Open' | 'Assigned' | 'Resolved' | 'Escalated' | 'Ignored';
  owner?: string;
}

interface ScheduledReview {
  id: string;
  name: string;
  type: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  agents: string[];
  nextRun: string;
  dataSource: string;
}

interface CorrectiveAction {
  id: string;
  findingId: string;
  action: string;
  owner: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed' | 'Verified';
  evidence?: string;
}

// ----------------------------------------------------
// DEMO DATA SEEDING (Requirement 18)
// ----------------------------------------------------
const SEEDED_MONITORING_RULES: MonitoringRule[] = [
  { id: 'MR-01', name: 'Interest Ledger Activity Scanner', category: 'Islamic Finance', condition: 'AccountCode IN (4500..4599) OR Narration LIKE "%interest%"', severity: 'Critical', action: 'Divert to Purification Account & Alert Board', frequency: 'Real-time', status: 'Active' },
  { id: 'MR-02', name: 'Unapproved Murabaha Sequence Check', category: 'Islamic Finance', condition: 'CustomerInvoiceTime < SupplierDeliveryTime', severity: 'Critical', action: 'Block ERP Transaction & Raise Finding', frequency: 'Real-time', status: 'Active' },
  { id: 'MR-03', name: 'Conventional Fixed Guarantee Detector', category: 'Islamic Finance', condition: 'ContractClause CONTAINS ("principal safety", "guarantee yield")', severity: 'High', action: 'Flag Legal Review & Send Warning', frequency: 'Daily', status: 'Active' },
  { id: 'MR-04', name: 'Dual Authorization Outlay Check', category: 'Financial Controls', condition: 'Amount > 200000 AND SignatureCount < 2', severity: 'High', action: 'Hold SAP Payment Release', frequency: 'Real-time', status: 'Active' },
  { id: 'MR-05', name: 'Duplicate Invoice ID Matcher', category: 'Financial Controls', condition: 'InvoiceHash MATCHES Previous(30_Days)', severity: 'Medium', action: 'Flag Internal Audit Review', frequency: 'Real-time', status: 'Active' },
  { id: 'MR-06', name: 'Non-Takaful Commercial Cover Alert', category: 'Risk Management', condition: 'VendorType = Conventional_Insurance', severity: 'Medium', action: 'Recommend Sharia compliant alternatives', frequency: 'Daily', status: 'Active' },
  { id: 'MR-07', name: 'High-Value Vendor AML Validation', category: 'Risk Management', condition: 'VendorReceiptAmount > 10000 AND InvoiceLink = NULL', severity: 'High', action: 'Apply Level-2 AML compliance freeze', frequency: 'Real-time', status: 'Active' },
  { id: 'MR-08', name: 'Expired Procurement SLA Validator', category: 'Operational Compliance', condition: 'ContractExpirationDate < CurrentDate', severity: 'Low', action: 'Notify Owner for renewal', frequency: 'Weekly', status: 'Active' }
];

const SEEDED_EVENTS: ComplianceEvent[] = [
  { id: 'EV-9921', source: 'Odoo ERP', type: 'Journal Entry Created', data: 'Account: 4509-PENALTY-YIELD, Amount: $4,520, Ref: IN-304', timestamp: '2026-07-17 16:20:12', status: 'Flagged' },
  { id: 'EV-9920', source: 'DocuSign API', type: 'Contract Uploaded', data: 'Musharaka Partnership - Principal safe guarantee terms', timestamp: '2026-07-17 16:15:33', status: 'Flagged' },
  { id: 'EV-9919', source: 'SAP Financials', type: 'Payment Processed', data: 'To: Conventional Mutual Insurance Corp, Amount: $82,000', timestamp: '2026-07-17 15:44:10', status: 'Flagged' },
  { id: 'EV-9918', source: 'Odoo ERP', type: 'Invoice Created', data: 'To: Saudi Trading Co, Amount: $220,000, Signatures: [Procurement]', timestamp: '2026-07-17 15:10:05', status: 'Checked' },
  { id: 'EV-9917', source: 'Supplier Portal', type: 'Vendor Added', data: 'Amanah Takaful Operator, Licensed: Yes, Category: Mutual Insurance', timestamp: '2026-07-17 14:02:11', status: 'Checked' },
  { id: 'EV-9916', source: 'Legal SharePoint', type: 'Policy Updated', data: 'ICAP Credit Terms v2.5 updated default fee guidelines', timestamp: '2026-07-17 11:30:19', status: 'Checked' },
  { id: 'EV-9915', source: 'SAP Financials', type: 'Journal Entry Created', data: 'Credit sale Murabaha, Asset ID: AST-882, Time: 09:12', timestamp: '2026-07-17 09:15:45', status: 'Checked' }
];

const SEEDED_ALERTS: ComplianceAlert[] = [
  { id: 'ALT-101', title: 'Interest Revenue Account Credited', category: 'Sharia', severity: 'Critical', source: 'ERP transaction JE-55421', evidence: 'Odoo credit entry of $4,520 to interest-penalty revenue ledger without charity transfer routing.', createdDate: '2026-07-17 10:12:00', status: 'Open', owner: 'Zain Al-Abedin' },
  { id: 'ALT-102', title: 'Musharaka Capital Guarantee Clause', category: 'Sharia', severity: 'Critical', source: 'Contract CTR-MS-881', evidence: 'Clause 12.4 warrants "100% safety of principal against partner defaults", breaching AAOIFI risk-sharing rules.', createdDate: '2026-07-17 09:30:15', status: 'Open', owner: 'Unassigned' },
  { id: 'ALT-103', title: 'Large Payment Lacks Dual Authorization', category: 'Financial', severity: 'High', source: 'SAP voucher PV-8812', evidence: 'Amount of $520,000 processed under single procurement department head signature.', createdDate: '2026-07-17 08:15:22', status: 'Assigned', owner: 'Sarah Watson' },
  { id: 'ALT-104', title: 'Conventional Insurance Premium Paid', category: 'Risk', severity: 'Medium', source: 'SAP Fleet Payment', evidence: 'Disbursed $82,000 to conventional commercial insurer instead of mutual cooperative Takaful.', createdDate: '2026-07-16 14:20:00', status: 'Open', owner: 'Nasser Al-Subaie' },
  { id: 'ALT-105', title: 'Inverted Murabaha Asset Sequence', category: 'Sharia', severity: 'High', source: 'Odoo Invoice Sequence', evidence: 'Client resale invoice printed 4 hours before supplier physical delivery note was verified in ledger.', createdDate: '2026-07-16 11:10:05', status: 'Resolved', owner: 'Zain Al-Abedin' },
  { id: 'ALT-106', title: 'Unlinked Cash Receipt > $10,000', category: 'Vendor', severity: 'High', source: 'Bank Deposit Feed', evidence: 'Deposit of $25,000 cleared without matching sales reference ID or active tax dossier.', createdDate: '2026-07-15 17:04:19', status: 'Escalated', owner: 'Compliance Lead' },
  { id: 'ALT-107', title: 'Expired Vendor Compliance Certificate', category: 'Operational', severity: 'Low', source: 'Vendor Ledger Profile', evidence: 'Amana Logistics ISO validation expired 14 days ago, needs immediate renewal.', createdDate: '2026-07-14 09:00:00', status: 'Resolved', owner: 'Unassigned' },
  { id: 'ALT-108', title: 'Duplicate Payment Voucher Found', category: 'Financial', severity: 'Medium', source: 'SAP Scan Task', evidence: 'Identical amount $14,200 and description submitted for same supplier twice within 48 hours.', createdDate: '2026-07-13 15:30:22', status: 'Ignored', owner: 'Ahmed Al-Mansoor' }
];

const SEEDED_REVIEWS: ScheduledReview[] = [
  { id: 'SR-01', name: 'Monthly Sharia Transaction Review', type: 'Transaction Scan', frequency: 'Monthly', agents: ['Sharia Compliance AI', 'Audit AI'], nextRun: '2026-08-01', dataSource: 'Odoo + SAP Journal Entries' },
  { id: 'SR-02', name: 'Quarterly Audit Evidence Pack Collection', type: 'Evidence Aggregation', frequency: 'Quarterly', agents: ['Audit AI', 'Legal AI'], nextRun: '2026-09-30', dataSource: 'All System Document Logs' },
  { id: 'SR-03', name: 'Daily High-Value ERP Payment Scan', type: 'Risk Screening', frequency: 'Daily', agents: ['Risk AI', 'Accounting AI'], nextRun: '2026-07-18', dataSource: 'SAP API Gateways' },
  { id: 'SR-04', name: 'Annual Sharia Board Compliance Assessment', type: 'Board Certification Review', frequency: 'Annual', agents: ['Sharia Compliance AI', 'Legal AI', 'Risk AI'], nextRun: '2026-12-15', dataSource: 'Complete Corporate Dossier' }
];

const SEEDED_CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  { id: 'CA-01', findingId: 'ALT-101', action: 'Divert accumulated penalty interest ($4,520) to Charity Purification Ledger.', owner: 'Zain Al-Abedin', deadline: '2026-07-24', priority: 'High', status: 'In Progress' },
  { id: 'CA-02', findingId: 'ALT-102', action: 'Modify Musharaka Clause 12.4 to strip physical principal security guarantees.', owner: 'Legal Team', deadline: '2026-07-28', priority: 'High', status: 'Open' },
  { id: 'CA-03', findingId: 'ALT-103', action: 'Secure retrospective validation for PV-8812 from VP of Finance.', owner: 'Sarah Watson', deadline: '2026-07-20', priority: 'High', status: 'Completed', evidence: 'VP_Approval_Hash_PV8812.pdf' },
  { id: 'CA-04', findingId: 'ALT-104', action: 'Initiate early policy buyout and transfer fleet coverage to cooperative Takaful.', owner: 'Nasser Al-Subaie', deadline: '2026-08-10', priority: 'Medium', status: 'Open' }
];

const SEEDED_RISK_SCORES = [
  { category: 'Financial Risk', score: 92, status: 'Stable' },
  { category: 'Sharia Risk', score: 98, status: 'Optimal' },
  { category: 'Operational Risk', score: 94, status: 'Improving' },
  { category: 'Compliance Risk', score: 95, status: 'Optimal' },
  { category: 'Vendor Risk', score: 91, status: 'Monitoring' }
];

const SEEDED_DEPARTMENTS = [
  { name: 'Finance', score: 92, issues: 4, actions: 2, riskLevel: 'Medium' },
  { name: 'Procurement', score: 95, issues: 2, actions: 1, riskLevel: 'Low' },
  { name: 'Investment', score: 98, issues: 1, actions: 1, riskLevel: 'Optimal' },
  { name: 'HR', score: 100, issues: 0, actions: 0, riskLevel: 'Low' },
  { name: 'Operations', score: 94, issues: 3, actions: 1, riskLevel: 'Medium' },
  { name: 'IT', score: 96, issues: 1, actions: 0, riskLevel: 'Low' }
];

export default function MonitoringCenterView({
  locale,
  theme,
  onTriggerActivityLog,
  initialSubTab
}: MonitoringCenterViewProps) {
  const isRTL = locale === 'ar';

  // Sub Tab states
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'rules' | 'events' | 'alerts' | 'reviews' | 'risk_map' | 'health'>(
    initialSubTab || 'dashboard'
  );

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Interactive Database state layers (Requirement 17 & 18)
  const [rules, setRules] = useState<MonitoringRule[]>(SEEDED_MONITORING_RULES);
  const [events, setEvents] = useState<ComplianceEvent[]>(SEEDED_EVENTS);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(SEEDED_ALERTS);
  const [reviews, setReviews] = useState<ScheduledReview[]>(SEEDED_REVIEWS);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(SEEDED_CORRECTIVE_ACTIONS);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Search & Filter filters
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('All');
  const [alertStatusFilter, setAlertStatusFilter] = useState<string>('All');
  const [ruleSearchTerm, setRuleSearchTerm] = useState<string>('');

  // ----------------------------------------------------
  // EVENT PIPELINE COMPLIANCE SCAN SIMULATOR (Requirement 4)
  // ----------------------------------------------------
  const [selectedEventForPipeline, setSelectedEventForPipeline] = useState<ComplianceEvent | null>(events[0]);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [pipelineLog, setPipelineLog] = useState<string[]>([]);

  const handleRunPipelineSimulation = (evt: ComplianceEvent) => {
    setSelectedEventForPipeline(evt);
    setPipelineStep(1);
    setIsPipelineRunning(true);
    setPipelineLog([`[EVENT ARIVED] Connected via ${evt.source} on ${evt.timestamp}`]);

    const steps = [
      `[PIPELINE STEP 1] Parsed Data Payload successfully: "${evt.data}"`,
      `[PIPELINE STEP 2] Loaded matching rule models for context type: "${evt.type}"`,
      `[PIPELINE STEP 3] Extracted applicable Sharia/SOP Standard guidelines from Knowledge-Base`,
      `[PIPELINE STEP 4] Ran multi-agent compliance validation (Audit AI + Sharia AI)`,
      evt.status === 'Flagged' 
        ? `[PIPELINE CRITICAL RESULT] Compliance issue detected! Formulated risk alert draft with 98.4% certainty.`
        : `[PIPELINE COMPLIANT RESULT] All active rules passed safely. Logged transaction event.`
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setPipelineLog(prev => [...prev, steps[current]]);
        setPipelineStep(prev => prev + 1);
        current++;
      } else {
        clearInterval(interval);
        setIsPipelineRunning(false);
        onTriggerActivityLog('EVENT_PIPELINE_RUN', `Executed continuous compliance scan for Event ID ${evt.id}`);
      }
    }, 600);
  };

  // ----------------------------------------------------
  // VISUAL MONITORING RULE BUILDER (Requirement 5)
  // ----------------------------------------------------
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    category: 'Islamic Finance' as any,
    condition: '',
    severity: 'Medium' as any,
    action: '',
    frequency: 'Real-time' as any
  });
  const [showRuleBuilderModal, setShowRuleBuilderModal] = useState(false);

  const handleCreateCustomRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleForm.name || !newRuleForm.condition || !newRuleForm.action) return;

    const ruleToAdd: MonitoringRule = {
      id: `MR-${Date.now().toString().slice(-2)}`,
      name: newRuleForm.name,
      category: newRuleForm.category,
      condition: newRuleForm.condition,
      severity: newRuleForm.severity,
      action: newRuleForm.action,
      frequency: newRuleForm.frequency,
      status: 'Active'
    };

    setRules([ruleToAdd, ...rules]);
    setShowRuleBuilderModal(false);
    setNewRuleForm({
      name: '',
      category: 'Islamic Finance',
      condition: '',
      severity: 'Medium',
      action: '',
      frequency: 'Real-time'
    });
    onTriggerActivityLog('CREATE_MONITORING_RULE', `Created Custom Monitoring Rule: "${ruleToAdd.name}"`);
  };

  // ----------------------------------------------------
  // ALERT NOTIFICATIONS SYSTEM & WEBHOOK (Requirement 7 & 8)
  // ----------------------------------------------------
  const [activeNotificationChannel, setActiveNotificationChannel] = useState<'app' | 'email' | 'sms' | 'webhook'>('app');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerTestNotification = (alertItem: ComplianceAlert) => {
    let msg = '';
    if (activeNotificationChannel === 'app') {
      msg = `🔔 [IN-APP ALERT] ${alertItem.severity.toUpperCase()} Issue: ${alertItem.title}. Source: ${alertItem.source}`;
    } else if (activeNotificationChannel === 'email') {
      msg = `📧 [EMAIL SENT TO myflyai@gmail.com] Subject: [CRITICAL ICAP ALERT] - ${alertItem.title}`;
    } else if (activeNotificationChannel === 'sms') {
      msg = `📱 [SMS ARCHITECTURE TRIGGERED] SMS dispatch payload: "ICAP Alert: ${alertItem.title} resolved status update"`;
    } else {
      msg = `🔗 [WEBHOOK POST DISPATCHED] Webhook delivered to customer endpoint with status payload 200`;
    }
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
    onTriggerActivityLog('TEST_NOTIFICATION_CHANNEL', `Dispatched alerts through: ${activeNotificationChannel.toUpperCase()} channel.`);
  };

  // ----------------------------------------------------
  // AUTOMATED AUDIT PREPARATION PACKAGE (Requirement 11)
  // ----------------------------------------------------
  const [auditPackGenerated, setAuditPackGenerated] = useState<boolean>(false);
  const [showAuditPackModal, setShowAuditPackModal] = useState<boolean>(false);

  const handleGenerateAuditPack = () => {
    setAuditPackGenerated(true);
    setShowAuditPackModal(true);
    onTriggerActivityLog('GENERATE_AUDIT_PACKAGE', 'Aggregated system evidence and compiled executive Audit Preparation Package.');
  };

  // ----------------------------------------------------
  // ESCALATION RULE ENGINE SIMULATOR (Requirement 16)
  // ----------------------------------------------------
  const [escalationSimResult, setEscalationSimResult] = useState<string | null>(null);

  const triggerEscalationCheck = (alertId: string) => {
    const alertItem = alerts.find(a => a.id === alertId);
    if (!alertItem) return;

    if (alertItem.severity === 'Critical') {
      setEscalationSimResult(`🚨 ALERT ESCALATED! Rule triggered: [Critical issue unresolved after 7 days]. Action: Escalated Alert ${alertId} directly to Sharia Compliance Board & executive officers.`);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Escalated' } : a));
    } else {
      setEscalationSimResult(`ℹ️ Compliance rule is satisfied: Moderate Alert ${alertId} is managed under assigned task limits.`);
    }
    setTimeout(() => setEscalationSimResult(null), 5000);
  };

  // ----------------------------------------------------
  // PREDEFINED RULES FILTER FOR TABS (Requirement 6)
  // ----------------------------------------------------
  const [predefinedTab, setPredefinedTab] = useState<'sharia' | 'financial' | 'operational' | 'risk'>('sharia');

  const filteredRulesByCategory = rules.filter(r => {
    if (predefinedTab === 'sharia') return r.category === 'Islamic Finance';
    if (predefinedTab === 'financial') return r.category === 'Financial Controls';
    if (predefinedTab === 'operational') return r.category === 'Operational Compliance';
    return r.category === 'Risk Management';
  });

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Header */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/10 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز المراقبة والمتابعة المستمرة' : 'Compliance Monitoring Center'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/20 animate-pulse">
                  {isRTL ? 'مباشر' : 'Live Engine'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL 
                  ? 'منصة الرصد المستمر التي تحلل الحركات والوثائق المالية بشكل فوري وترجمتها إلى مؤشرات وقائية استباقية.'
                  : 'Proactive surveillance system evaluating transactions, records, and policies in real-time to mitigate Sharia & Audit risk.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAuditPack}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isRTL ? 'تجهيز حزمة التدقيق الآلي' : 'Automated Audit Prep'}</span>
            </button>
          </div>
        </div>

        {/* Global Tab Navigation (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة المراقبة' : 'Dashboard', icon: Shield },
            { id: 'rules', name: isRTL ? 'قواعد المراقبة النشطة' : 'Active Monitoring Rules', icon: Sliders },
            { id: 'events', name: isRTL ? 'الأحداث المباشرة والتحليل' : 'Real-Time Events', icon: Zap },
            { id: 'alerts', name: isRTL ? 'التنبيهات والإدارة' : 'Alert Management', icon: AlertTriangle },
            { id: 'reviews', name: isRTL ? 'المراجعات المجدولة' : 'Scheduled Reviews', icon: Clock },
            { id: 'risk_map', name: isRTL ? 'خريطة توزيع المخاطر' : 'Risk Heat Map', icon: Compass },
            { id: 'health', name: isRTL ? 'مؤشرات الصحة والأقسام' : 'Compliance Health', icon: CheckSquare }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-950 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Alert Panel */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 max-w-xl text-xs font-mono">
          <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Escalation Notification Area */}
      {escalationSimResult && (
        <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">{isRTL ? 'محاكاة محرك التصعيد التلقائي' : 'Auto Escalation Engine Simulator'}</span>
            <p className="mt-1 font-mono">{escalationSimResult}</p>
          </div>
        </div>
      )}

      {/* 2. TAB CONTENT VIEWPORTS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >

          {/* ====================================================
              SUB-TAB 1: MONITORING DASHBOARD & CHARTS (Req 2 & 13)
              ==================================================== */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Executive Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: isRTL ? 'معدل الامتثال الحالي' : 'Current Compliance Score', val: '96%', desc: isRTL ? 'مؤشر أداء عام ممتاز' : 'Aggregated health index', color: 'text-emerald-600' },
                  { title: isRTL ? 'قواعد المراقبة النشطة' : 'Active Monitoring Rules', val: rules.length.toString(), desc: isRTL ? 'قواعد فحص فورية مدمجة' : 'Running continuously', color: 'text-blue-500' },
                  { title: isRTL ? 'الأحداث المعالجة اليوم' : 'Events Processed Today', val: '250,000', desc: isRTL ? 'تحديثات مباشرة عبر الـ ERP' : 'Real-time integrations', color: 'text-indigo-500' },
                  { title: isRTL ? 'تنبيهات الامتثال المكتشفة' : 'Alerts Generated', val: alerts.length.toString(), desc: isRTL ? 'تنبيهات نشطة تحتاج مراجعة' : 'All severities included', color: 'text-amber-500' },
                  { title: isRTL ? 'مشاكل حرجة للغاية' : 'Critical Issues', val: '2', desc: isRTL ? 'تتطلب معالجة فورية' : 'Sharia / Control breach', color: 'text-rose-600' }
                ].map((st, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{st.title}</span>
                    <span className={`text-2xl font-display font-black block mt-2 ${st.color}`}>{st.val}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{st.desc}</span>
                  </div>
                ))}
              </div>

              {/* Trend Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Compliance Trend */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{isRTL ? 'اتجاه الامتثال والتحسن' : 'Compliance Health Trend'}</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 px-2 relative">
                    {/* SVG Line path represent trend 92% -> 96% */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M 10 120 Q 80 100 160 80 T 320 40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                      />
                      <path
                        d="M 10 120 Q 80 100 160 80 T 320 40 L 320 150 L 10 150 Z"
                        fill="url(#grad-comp)"
                        opacity="0.1"
                      />
                      <defs>
                        <linearGradient id="grad-comp" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {['Jan (92%)', 'Feb (93%)', 'Mar (95%)', 'Apr (96%)'].map((lbl, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-400 z-10">{lbl}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">{isRTL ? 'انخفاض مطرد في المشاكل المتكررة' : 'Continuous 4% compliance improvement recorded since Q1.'}</p>
                </div>

                {/* Chart 2: Alerts Over Time */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{isRTL ? 'حجم التنبيهات والأحداث المعالجة' : 'Daily Alarm Volumes'}</h3>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="h-44 w-full flex items-end justify-between pt-4 pb-2 px-2 relative">
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                      <path
                        d="M 10 50 L 80 110 L 160 30 L 240 90 L 320 60"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                      />
                    </svg>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((lbl, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-400 z-10">{lbl}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">{isRTL ? 'معدل التنبيهات المستقرة يومياً: 24 تنبيه' : 'Baseline volume consistent with peak payment cycles.'}</p>
                </div>

                {/* Chart 3: Issues by Category */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{isRTL ? 'المشاكل حسب التصنيف' : 'Issues By Category'}</h3>
                  <div className="space-y-2.5 pt-2">
                    {[
                      { cat: 'Sharia Non-Compliance', count: 3, percentage: 35, color: 'bg-emerald-500' },
                      { cat: 'Financial Control Missing', count: 2, percentage: 25, color: 'bg-amber-500' },
                      { cat: 'Operational SLA Breach', count: 2, percentage: 25, color: 'bg-blue-500' },
                      { cat: 'Risk & Integrity Checks', count: 1, percentage: 15, color: 'bg-rose-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.cat}</span>
                          <span className="font-mono text-slate-400">{item.count} {isRTL ? 'تنبيهات' : 'alerts'} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department Overview Grid (Requirement 14) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'الأداء والالتزام حسب الأقسام' : 'Departmental Compliance Heat'}</h3>
                    <p className="text-xs text-slate-400">{isRTL ? 'مراقبة فورية لمستويات المخاطر ونقاط القوة لكل قطاع داخلي.' : 'Real-time scoring, action progress, and risk classification across business lanes.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                  {SEEDED_DEPARTMENTS.map((dept, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDept(selectedDept === dept.name ? null : dept.name)}
                      className={`p-4 rounded-xl border transition text-left ${
                        selectedDept === dept.name
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : theme === 'dark' ? 'bg-slate-900/20 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{dept.name}</span>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-xl font-display font-black text-slate-900 dark:text-white">{dept.score}%</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          dept.riskLevel === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                          dept.riskLevel === 'Low' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>{dept.riskLevel}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between text-[10px] text-slate-400">
                        <span>{dept.issues} Issues</span>
                        <span>{dept.actions} Active</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedDept && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-2">
                    <span className="font-bold block text-slate-800 dark:text-slate-200">
                      {isRTL ? `المشاكل الحالية لقسم: ${selectedDept}` : `Active Scans for Department: ${selectedDept}`}
                    </span>
                    <p className="text-slate-400">
                      {selectedDept === 'Finance'
                        ? 'Rule MR-01 Interest Ledger active. Scanning 100% of GL entry streams. Found late payment penalty entries on account code 4509.'
                        : selectedDept === 'Procurement'
                        ? 'Rule MR-04 single authorization check active. Restrict conventional commercial vendor payouts over $20,000.'
                        : 'Continuous background monitoring check completed. No critical flags generated.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              SUB-TAB 2: ACTIVE MONITORING RULES & BUILDER (Req 5 & 6)
              ==================================================== */}
          {activeSubTab === 'rules' && (
            <div className="space-y-6">
              {/* Category selector */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: 'sharia', name: isRTL ? 'المالية الإسلامية' : 'Islamic Finance' },
                    { id: 'financial', name: isRTL ? 'الرقابة المالية' : 'Financial Controls' },
                    { id: 'operational', name: isRTL ? 'الامتثال التشغيلي' : 'Operational Compliance' },
                    { id: 'risk', name: isRTL ? 'إدارة المخاطر' : 'Risk Management' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPredefinedTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        predefinedTab === tab.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={isRTL ? 'البحث في القواعد...' : 'Search active rules...'}
                      value={ruleSearchTerm}
                      onChange={(e) => setRuleSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl text-xs w-full sm:w-60 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowRuleBuilderModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRTL ? 'إنشاء قاعدة مراقبة' : 'Build Rule'}</span>
                  </button>
                </div>
              </div>

              {/* Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRulesByCategory
                  .filter(r => r.name.toLowerCase().includes(ruleSearchTerm.toLowerCase()))
                  .map((rule, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            rule.severity === 'Critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400' :
                            rule.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {rule.severity.toUpperCase()}
                          </span>
                          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-2">{rule.name}</h4>
                        </div>
                        <button
                          onClick={() => {
                            setRules(rules.map(r => r.id === rule.id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r));
                            onTriggerActivityLog('TOGGLE_RULE_STATUS', `Changed status of rule ${rule.id}`);
                          }}
                          className={`text-[10px] px-2 py-1 rounded font-bold ${
                            rule.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {rule.status === 'Active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'متوقف مؤقتاً' : 'Paused')}
                        </button>
                      </div>

                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg space-y-1">
                          <span className="font-bold text-[10px] uppercase text-slate-400 block">{isRTL ? 'الشرط الرياضي' : 'Condition Expression'}</span>
                          <code className="text-[10px] text-indigo-500 font-mono block break-all">{rule.condition}</code>
                        </div>
                        <div className="flex justify-between text-[11px] pt-1">
                          <span>{isRTL ? 'تردد التقييم:' : 'Evaluation Frequency:'} <strong className="text-slate-600 dark:text-slate-200">{rule.frequency}</strong></span>
                          <span>{isRTL ? 'إجراء الاستجابة:' : 'Trigger Action:'} <strong className="text-emerald-600 dark:text-emerald-400">{rule.action}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Rule Builder Modal */}
              {showRuleBuilderModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <form onSubmit={handleCreateCustomRule} className={`w-full max-w-lg p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-2xl space-y-4`}>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-display font-bold text-sm flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        {isRTL ? 'بناء قاعدة امتثال ومراقبة مخصصة' : 'Visual Monitoring Rule Builder'}
                      </h3>
                      <button type="button" onClick={() => setShowRuleBuilderModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'اسم القاعدة' : 'Rule Name'}</label>
                        <input
                          type="text"
                          required
                          value={newRuleForm.name}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                          placeholder="e.g. Excessive Mark-Up Threshold"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'التصنيف' : 'Category'}</label>
                          <select
                            value={newRuleForm.category}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, category: e.target.value as any })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                          >
                            <option value="Islamic Finance">Islamic Finance</option>
                            <option value="Financial Controls">Financial Controls</option>
                            <option value="Operational Compliance">Operational Compliance</option>
                            <option value="Risk Management">Risk Management</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'مستوى الخطورة' : 'Severity'}</label>
                          <select
                            value={newRuleForm.severity}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, severity: e.target.value as any })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                          >
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'معيار المطابقة (SQL-ready Condition)' : 'Condition Expression (SQL-ready)'}</label>
                        <textarea
                          required
                          value={newRuleForm.condition}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, condition: e.target.value })}
                          placeholder="e.g. TransactionAmount > 50000 AND PartnerCountry = 'Sudan'"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg h-20 font-mono text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'الاستجابة والاتخاذ' : 'Action'}</label>
                          <input
                            type="text"
                            required
                            value={newRuleForm.action}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, action: e.target.value })}
                            placeholder="e.g. Notify Board & Hold SAP release"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'التردد' : 'Frequency'}</label>
                          <select
                            value={newRuleForm.frequency}
                            onChange={(e) => setNewRuleForm({ ...newRuleForm, frequency: e.target.value as any })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg"
                          >
                            <option value="Real-time">Real-time</option>
                            <option value="Hourly">Hourly</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => setShowRuleBuilderModal(false)}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition text-slate-500"
                      >
                        {isRTL ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                      >
                        {isRTL ? 'إضافة القاعدة' : 'Add Rule'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              SUB-TAB 3: REAL-TIME EVENTS & ANALYSIS PIPELINE (Req 3 & 4)
              ==================================================== */}
          {activeSubTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Stream list */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'سجل الأحداث والعمليات الفورية' : 'Live Event Monitor'}</h3>
                  <button
                    onClick={() => {
                      const newEventItem: ComplianceEvent = {
                        id: `EV-${Math.floor(1000 + Math.random() * 9000)}`,
                        source: 'Odoo ERP',
                        type: 'Invoice Created',
                        data: `Generated sales invoice with late interest clause applied to invoice ID IN-${Math.floor(100 + Math.random()*900)}`,
                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                        status: 'Flagged'
                      };
                      setEvents([newEventItem, ...events]);
                      onTriggerActivityLog('SIMULATE_LIVE_EVENT', `Triggered external ERP invoice webhook event ${newEventItem.id}`);
                    }}
                    className="flex items-center gap-1 text-[11px] bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'محاكاة حدث ERP خارجي' : 'Simulate ERP Event'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {events.map((evt, idx) => {
                    const activeSelection = selectedEventForPipeline?.id === evt.id;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedEventForPipeline(evt)}
                        className={`p-4 rounded-xl border transition cursor-pointer text-xs ${
                          activeSelection
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : theme === 'dark' ? 'bg-slate-900/20 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{evt.type}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">{evt.source} • {evt.timestamp}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            evt.status === 'Flagged' ? 'bg-rose-100 text-rose-800' :
                            evt.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {evt.status}
                          </span>
                        </div>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 italic text-[11px] font-mono break-all bg-white dark:bg-slate-950 p-2 rounded-md border border-slate-100 dark:border-slate-900">
                          {evt.data}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Automatic Analysis Pipeline Visualization (Requirement 4) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'مسار الفحص والتحليل التلقائي' : 'AI Analysis Pipeline Execution'}</h3>
                
                {selectedEventForPipeline ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-emerald-600/5 rounded-xl border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'الحدث المستهدف حالياً' : 'Target Event Payloads'}</span>
                      <strong className="text-slate-800 dark:text-slate-100 block">{selectedEventForPipeline.type}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Payload ID: {selectedEventForPipeline.id}</span>
                    </div>

                    <button
                      onClick={() => handleRunPipelineSimulation(selectedEventForPipeline)}
                      disabled={isPipelineRunning}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl shadow-sm transition"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isPipelineRunning ? (isRTL ? 'جاري الفحص بالذكاء الاصطناعي...' : 'Evaluating Rules...') : (isRTL ? 'تشغيل الفحص الفوري' : 'Run Real-Time Compliance Analysis')}</span>
                    </button>

                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] space-y-2.5 min-h-[220px] max-h-[300px] overflow-y-auto">
                      <span className="text-[10px] text-slate-500 uppercase block border-b border-slate-800 pb-1">AI Pipeline Trace Log</span>
                      {pipelineLog.map((log, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{log}</span>
                        </div>
                      ))}
                      {pipelineStep > 0 && pipelineStep < 5 && (
                        <div className="flex gap-2 items-center text-emerald-400 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Executing Agent reasoning step {pipelineStep}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-400 italic">
                    {isRTL ? 'اختر حدثاً من القائمة الجانبية لتتبع مسار التحليل التلقائي' : 'Select an active event from the list to preview live continuous compliance tracing.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              SUB-TAB 4: ALERT MANAGEMENT SYSTEM & NOTIFICATIONS (Req 7 & 8)
              ==================================================== */}
          {activeSubTab === 'alerts' && (
            <div className="space-y-6">
              {/* Top controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                <div className="flex flex-wrap gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{isRTL ? 'الخطورة' : 'Severity'}</label>
                    <select
                      value={alertSeverityFilter}
                      onChange={(e) => setAlertSeverityFilter(e.target.value)}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs p-1.5 focus:outline-none"
                    >
                      <option value="All">All Severities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{isRTL ? 'الحالة' : 'Status'}</label>
                    <select
                      value={alertStatusFilter}
                      onChange={(e) => setAlertStatusFilter(e.target.value)}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs p-1.5 focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Ignored">Ignored</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{isRTL ? 'قناة التنبيهات النشطة:' : 'Test Channel:'}</span>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                    {[
                      { id: 'app', icon: Shield, name: 'In-app' },
                      { id: 'email', icon: Mail, name: 'Email' },
                      { id: 'sms', icon: Smartphone, name: 'SMS' },
                      { id: 'webhook', icon: Webhook, name: 'Webhook' }
                    ].map(ch => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setActiveNotificationChannel(ch.id as any)}
                        className={`p-2 transition ${
                          activeNotificationChannel === ch.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-600'
                        }`}
                        title={ch.name}
                      >
                        <ch.icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-4">
                {alerts
                  .filter(alt => alertSeverityFilter === 'All' || alt.severity === alertSeverityFilter)
                  .filter(alt => alertStatusFilter === 'All' || alt.status === alertStatusFilter)
                  .map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border ${
                        alert.status === 'Resolved' ? 'border-slate-200 opacity-70' :
                        alert.severity === 'Critical' ? 'border-rose-500/40 bg-rose-500/5' :
                        alert.severity === 'High' ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-200'
                      } ${theme === 'dark' ? 'bg-slate-900/20' : 'bg-white'} shadow-sm space-y-4`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            alert.severity === 'Critical' ? 'bg-rose-600 animate-pulse' :
                            alert.severity === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}></span>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">{alert.id} • {alert.category.toUpperCase()} CATEGORY</span>
                            <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{alert.title}</h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            alert.status === 'Open' ? 'bg-rose-100 text-rose-800' :
                            alert.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                            alert.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>{alert.status}</span>
                          
                          {alert.owner && (
                            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">Owner: {alert.owner}</span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1.5 text-xs">
                        <div className="flex gap-2">
                          <span className="font-bold text-slate-400 shrink-0">{isRTL ? 'المرجع والمنشأ:' : 'Source:'}</span>
                          <span className="text-slate-600 dark:text-slate-300 font-mono">{alert.source}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-mono text-[11px] bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900/40">
                          {alert.evidence}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        {alert.status !== 'Resolved' && (
                          <>
                            <button
                              onClick={() => {
                                setAlerts(alerts.map(a => a.id === alert.id ? { ...a, status: 'Resolved' } : a));
                                onTriggerActivityLog('RESOLVE_ALERT', `Manually resolved Alert ${alert.id}`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                            >
                              {isRTL ? 'حل التنبيه وإغلاقه' : 'Mark Resolved'}
                            </button>
                            <button
                              onClick={() => triggerEscalationCheck(alert.id)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition"
                            >
                              {isRTL ? 'فحص وإجراء تصعيد' : 'Evaluate Escalation'}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => triggerTestNotification(alert)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition text-slate-500"
                        >
                          {isRTL ? 'إرسال إشعار تجريبي' : 'Dispatch Test Notification'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ====================================================
              SUB-TAB 5: SCHEDULED COMPLIANCE REVIEWS (Req 10)
              ==================================================== */}
          {activeSubTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'المراجعات الدورية والأتمتة' : 'Automated Compliance Scheduler'}</h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'تنظيم أوقات الفحص الشامل المخطط للعمليات والوثائق.' : 'Schedule background agent-based auditing frequencies for business streams.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">{rev.frequency}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {rev.id}</span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug">{rev.name}</h4>
                      <span className="text-[10px] text-slate-400 mt-1 block">Scope: {rev.type}</span>
                    </div>

                    <div className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg text-[10px] text-slate-400">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'المساعدون:' : 'Active Agents:'}</span>
                        <span className="font-bold text-slate-600 dark:text-slate-200">{rev.agents.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'تاريخ الموعد القادم:' : 'Next Run Date:'}</span>
                        <span className="font-bold text-slate-600 dark:text-slate-200 font-mono">{rev.nextRun}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onTriggerActivityLog('TRIGGER_SCHEDULED_REVIEW', `Triggered manual test-run of review schedule: "${rev.name}"`);
                        setToastMessage(`🚀 [BACKGROUND TASK LAUNCHED] Executed continuous auditing on "${rev.dataSource}" successfully.`);
                        setTimeout(() => setToastMessage(null), 3500);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold py-1.5 rounded-lg transition"
                    >
                      {isRTL ? 'تشغيل فوري تجريبي' : 'Force Run Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              SUB-TAB 6: RISK HEAT MAP VISUALIZATION (Req 9)
              ==================================================== */}
          {activeSubTab === 'risk_map' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dimensions map */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2 space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'مخطط تقييم مستوى المخاطر استناداً للنسبة والتأثير' : 'Impact vs Likelihood Risk Matrix'}</h3>
                
                {/* 4x4 Grid representation */}
                <div className="space-y-1">
                  <div className="grid grid-cols-5 text-center text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">
                    <span>Likelihood</span>
                    <span>Low Impact</span>
                    <span>Med Impact</span>
                    <span>High Impact</span>
                    <span>Critical Imp</span>
                  </div>

                  {[
                    { likelihood: 'Frequent', rowCells: ['Med', 'High', 'Critical', 'Critical'] },
                    { likelihood: 'Probable', rowCells: ['Low', 'Med', 'High', 'Critical'] },
                    { likelihood: 'Occasional', rowCells: ['Low', 'Low', 'Med', 'High'] },
                    { likelihood: 'Remote', rowCells: ['Low', 'Low', 'Low', 'Med'] }
                  ].map((row, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-5 gap-2 items-center">
                      <span className="text-[10px] font-mono text-slate-400 font-bold text-left">{row.likelihood}</span>
                      {row.rowCells.map((cell, cIdx) => {
                        let cellBg = 'bg-slate-100';
                        let textCol = 'text-slate-800';
                        if (cell === 'Critical') { cellBg = 'bg-rose-500/10 border border-rose-500/30'; textCol = 'text-rose-600 font-bold'; }
                        else if (cell === 'High') { cellBg = 'bg-amber-500/10 border border-amber-500/20'; textCol = 'text-amber-500 font-bold'; }
                        else if (cell === 'Med') { cellBg = 'bg-blue-500/10 border border-blue-500/20'; textCol = 'text-blue-600 font-bold'; }
                        else { cellBg = 'bg-emerald-500/10 border border-emerald-500/20'; textCol = 'text-emerald-600'; }

                        return (
                          <div
                            key={cIdx}
                            onClick={() => {
                              setToastMessage(`🔍 Matrix Intersection: ${row.likelihood} Likelihood x ${cIdx+1} Impact level selected.`);
                              setTimeout(() => setToastMessage(null), 2500);
                            }}
                            className={`p-4 rounded-xl text-center text-xs cursor-pointer transition hover:scale-[1.02] ${cellBg} ${textCol}`}
                          >
                            {cell}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono italic pt-2">
                  <span>← Safe Operational Zone</span>
                  <span>Board Alert Escalation threshold →</span>
                </div>
              </div>

              {/* Sidebar score board */}
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{isRTL ? 'مؤشرات الأمان والخطورة' : 'Active Category Risk Scores'}</h3>
                  <div className="space-y-3.5">
                    {SEEDED_RISK_SCORES.map((risk, idx) => (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{risk.category}</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">{risk.score}% Optimal</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${risk.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-2xl bg-slate-900 text-white space-y-2`}>
                  <h4 className="font-display font-bold text-xs flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>{isRTL ? 'تغطية الضوابط والمكافحة' : 'Risk Management Note'}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    All continuous monitoring agents actively run on the tenant profile. Zero conventional interest exposure or collateral duplication detected outside flagged ALT alerts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              SUB-TAB 7: COMPLIANCE HEALTH & CORRECTIVE ACTION (Req 12 & 15)
              ==================================================== */}
          {activeSubTab === 'health' && (
            <div className="space-y-6">
              {/* Scoring breakdown cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Governance Compliance', score: 95, color: 'text-emerald-500' },
                  { title: 'Financial Controls', score: 92, color: 'text-indigo-500' },
                  { title: 'Sharia Compliance', score: 98, color: 'text-amber-500' },
                  { title: 'Operational Controls', score: 94, color: 'text-blue-500' },
                  { title: 'Risk Management', score: 91, color: 'text-purple-500' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-center space-y-2`}>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{item.title}</span>
                    <span className={`text-3xl font-display font-black block ${item.color}`}>{item.score}%</span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div className={`h-full ${item.score >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrective Actions Table */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">{isRTL ? 'إجراءات التصحيح والعمل المفتوحة' : 'Compliance Corrective Action Tracker'}</h3>
                    <p className="text-xs text-slate-400">{isRTL ? 'تتبع المسؤوليات ومواعيد معالجة المشاكل المكتشفة.' : 'Track ownership, schedules, and active status for remedial actions.'}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                        <th className="p-3">Action ID</th>
                        <th className="p-3">Target / Finding</th>
                        <th className="p-3">Remedial Assignment</th>
                        <th className="p-3">Owner</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correctiveActions.map((action, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
                          <td className="p-3 font-mono font-bold text-indigo-500">{action.id}</td>
                          <td className="p-3 font-mono text-slate-400">{action.findingId}</td>
                          <td className="p-3 font-semibold">{action.action}</td>
                          <td className="p-3 font-mono text-slate-500">{action.owner}</td>
                          <td className="p-3 font-mono">{action.deadline}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              action.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                            }`}>{action.priority}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              action.status === 'Completed' || action.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                              action.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>{action.status}</span>
                          </td>
                          <td className="p-3 text-right">
                            {action.status !== 'Verified' && (
                              <button
                                onClick={() => {
                                  setCorrectiveActions(correctiveActions.map(act => act.id === action.id ? { ...act, status: 'Verified' } : act));
                                  onTriggerActivityLog('VERIFY_CORRECTIVE_ACTION', `Verified corrective action ${action.id}`);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] px-2.5 py-1 rounded transition"
                              >
                                {isRTL ? 'تحقق وتأكيد' : 'Verify'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Audit Preparation Package Preview Modal (Requirement 11) */}
      {showAuditPackModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                {isRTL ? 'حزمة التدقيق الآلي المعتمدة' : 'Automated Audit Preparation Package'}
              </h3>
              <button onClick={() => setShowAuditPackModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-4 border border-slate-200 dark:border-slate-800 font-mono text-[11px] leading-relaxed">
              <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-display font-bold text-xs uppercase text-slate-800 dark:text-slate-100">ICAP COMPLIANCE EVIDENCE AUDIT DOSSIER</h4>
                <p className="text-[10px] text-slate-400 mt-1">Generated: 2026-07-17 16:30 • Tenant ID: org-icap-demo</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">1. EXECUTIVE SUMMARY</span>
                <p className="text-slate-400 text-[10px]">
                  Aggregated compliance tracing on 250,000 ERP events. General tenant Sharia compliance sits optimally at 98%. Two open Critical alerts identified in interest penalties and contract principal guarantees.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">2. ACTIVE HIGH-RISK AREAS</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 bg-rose-500/5 rounded border border-rose-500/20">
                    <strong>ALT-101 (Critical Sharia)</strong><br />
                    $4,520 Credit penalty yield misallocation. Action pending.
                  </div>
                  <div className="p-2 bg-rose-500/5 rounded border border-rose-500/20">
                    <strong>ALT-102 (Critical Sharia)</strong><br />
                    CTR-MS-881 principal security clauses. Draft pending.
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">3. COMPILED EVIDENCE INDEX</span>
                <ul className="list-disc pl-4 text-slate-400 space-y-1 text-[10px]">
                  <li>Invoice delivery sequence time-stamps (Compliant)</li>
                  <li>VP digital signature validation trace for PV-8812 (Verified corrective check)</li>
                  <li>Odoo Ledger Account balance export code 4509 (In purification review)</li>
                </ul>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">4. RECOMMENDATIONS & EXPECTED OUTCOMES</span>
                <p className="text-slate-400 text-[10px]">
                  Redraft partnership templates to conform to AAOIFI Standard No. 12. Migrate fleet insurance vendors to mutual cooperatives under Takaful standards by 2026-08-10.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  alert('Audit package successfully exported as compliant PDF and synchronized with board portal.');
                  setShowAuditPackModal(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                {isRTL ? 'تنزيل الحزمة بصيغة PDF' : 'Download Complete Dossier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
