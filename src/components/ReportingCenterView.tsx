import React, { useState } from 'react';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Award,
  ShieldAlert,
  Sliders,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Plus,
  ArrowRight,
  UserCheck,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  FileArchive,
  ChevronRight,
  Compass,
  AlertCircle,
  Copy,
  Printer,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
  Building,
  Check,
  CheckSquare,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportingCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

// ----------------------------------------------------
// DATABASE EXTRACTION TYPES (Requirement 12)
// ----------------------------------------------------
interface Report {
  id: string;
  organizationId: string;
  name: string;
  type: 'Executive' | 'Sharia' | 'Audit Support' | 'ERP Transaction' | 'Risk Assessment' | 'Custom';
  status: 'Generated' | 'Under Review' | 'Reviewed' | 'Approved' | 'Published';
  sections: string[];
  createdBy: string;
  createdAt: string;
  dateRange: string;
  score: number;
  criticalIssues: number;
  majorRisks: number;
  reviewer?: string;
  confidential?: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: 'Executive' | 'Sharia' | 'Audit' | 'Risk' | 'Transactions' | 'Operations';
  sections: string[];
  createdBy: string;
  isPredefined?: boolean;
}

interface ReportVersion {
  id: string;
  reportId: string;
  version: string;
  changes: string;
  date: string;
  author: string;
}

interface ReportExport {
  id: string;
  reportId: string;
  format: 'PDF' | 'Excel' | 'Word' | 'PowerPoint';
  createdAt: string;
  fileSize: string;
  downloadUrl: string;
}

// ----------------------------------------------------
// PREMIUM DEMO DATA SEEDING (Requirement 13)
// ----------------------------------------------------
const SEEDED_REPORTS: Report[] = [
  {
    id: 'REP-2026-001',
    organizationId: 'org-al-noor',
    name: 'Executive Annual Compliance Overview 2026',
    type: 'Executive',
    status: 'Published',
    sections: ['Executive Summary', 'Compliance Score Overview', 'Major Risks', 'Critical Findings', 'Recommendations', 'Improvement Plan'],
    createdBy: 'Director of Compliance',
    createdAt: '2026-07-15 10:30',
    dateRange: 'FY 2026 (Annual Review)',
    score: 96,
    criticalIssues: 2,
    majorRisks: 4,
    reviewer: 'Audit Lead Committee',
    confidential: true
  },
  {
    id: 'REP-2026-002',
    organizationId: 'org-al-noor',
    name: 'Annual Sharia Compliance Assessment Report',
    type: 'Sharia',
    status: 'Approved',
    sections: ['Reviewed Areas', 'Applicable Standards', 'Analysis Results', 'Evidence Index', 'Reviewer Decisions', 'Recommendations'],
    createdBy: 'Sheikh Zain Al-Abedin',
    createdAt: '2026-07-14 14:15',
    dateRange: 'H1 1447 AH / 2026 CE',
    score: 98,
    criticalIssues: 0,
    majorRisks: 1,
    reviewer: 'Sharia Advisory Board',
    confidential: true
  },
  {
    id: 'REP-2026-003',
    organizationId: 'org-al-noor',
    name: 'ERP Transaction Review & Automated Audit Trail Report',
    type: 'ERP Transaction',
    status: 'Under Review',
    sections: ['Transactions Reviewed', 'Rules Applied', 'Exceptions Log', 'Suspicious Transactions', 'Recommendations'],
    createdBy: 'Lead Sharia Auditor AI',
    createdAt: '2026-07-17 09:45',
    dateRange: 'Q2 2026 Transaction Stream',
    score: 94,
    criticalIssues: 1,
    majorRisks: 3,
    reviewer: 'Chief Auditor',
    confidential: false
  },
  {
    id: 'REP-2026-004',
    organizationId: 'org-al-noor',
    name: 'Enterprise Risk & Sharia Exposure Assessment',
    type: 'Risk Assessment',
    status: 'Generated',
    sections: ['Risk Matrix', 'Risk Scores', 'Risk Owners', 'Mitigation Plans'],
    createdBy: 'Risk Management AI',
    createdAt: '2026-07-16 16:30',
    dateRange: 'Current Operational Exposure',
    score: 92,
    criticalIssues: 2,
    majorRisks: 5,
    reviewer: 'Compliance Director',
    confidential: true
  }
];

const SEEDED_TEMPLATES: ReportTemplate[] = [
  { id: 'TMP-001', name: 'Standard Executive Compliance Format', category: 'Executive', sections: ['Executive Summary', 'Compliance Score Overview', 'Major Risks', 'Critical Findings', 'Recommendations'], createdBy: 'ICAP System', isPredefined: true },
  { id: 'TMP-002', name: 'AAOIFI Sharia Governance Review', category: 'Sharia', sections: ['Reviewed Areas', 'Applicable Standards', 'Analysis Results', 'Evidence', 'Findings', 'Reviewer Decisions'], createdBy: 'Sheikh Zain Al-Abedin', isPredefined: true },
  { id: 'TMP-003', name: 'Audit Support Evidence Package', category: 'Audit', sections: ['Audit Scope', 'Testing Performed', 'Controls Reviewed', 'Evidence Log', 'Exceptions List', 'Corrective Actions'], createdBy: 'Lead Auditor', isPredefined: true },
  { id: 'TMP-004', name: 'Transactional Risk & Non-Compliance Monitor', category: 'Transactions', sections: ['Transactions Reviewed', 'Rules Applied', 'Exceptions', 'Suspicious Transactions', 'Recommendations'], createdBy: 'ICAP System', isPredefined: true }
];

const SEEDED_VERSIONS: ReportVersion[] = [
  { id: 'VER-01', reportId: 'REP-2026-001', version: 'v1.0', changes: 'Initial draft compile by compliance engine agents.', date: '2026-07-15 08:00', author: 'SOP compliance agent' },
  { id: 'VER-02', reportId: 'REP-2026-001', version: 'v1.1', changes: 'Manually updated executive summary to reflect positive Q2 correction trends.', date: '2026-07-15 10:30', author: 'Director of Compliance' },
  { id: 'VER-03', reportId: 'REP-2026-002', version: 'v1.0', changes: 'Formulated Sharia advisory decision clauses on transaction purification.', date: '2026-07-14 14:15', author: 'Sheikh Zain Al-Abedin' }
];

const SEEDED_EXPORTS: ReportExport[] = [
  { id: 'EXP-101', reportId: 'REP-2026-001', format: 'PDF', createdAt: '2026-07-15 10:35', fileSize: '2.8 MB', downloadUrl: '#' },
  { id: 'EXP-102', reportId: 'REP-2026-001', format: 'Excel', createdAt: '2026-07-15 10:36', fileSize: '4.5 MB', downloadUrl: '#' },
  { id: 'EXP-103', reportId: 'REP-2026-002', format: 'PDF', createdAt: '2026-07-14 14:20', fileSize: '1.9 MB', downloadUrl: '#' }
];

// ----------------------------------------------------
// COMPLIANCE EVIDENCE TRACE LINKS (Requirement 8)
// ----------------------------------------------------
interface EvidenceTrace {
  findingId: string;
  findingTitle: string;
  transactionId: string;
  erpRecord: string;
  contractRef: string;
  policyRef: string;
  standardRef: string;
  aiReasoning: string;
}

const TRACE_DATABASE: Record<string, EvidenceTrace> = {
  'REP-2026-001': {
    findingId: 'ALT-101',
    findingTitle: 'Interest Revenue Account Credit Detected',
    transactionId: 'TXN-99882',
    erpRecord: 'Odoo Account Code 4509-PENALTY-YIELD (GL-JE-55421)',
    contractRef: 'Murabaha Agreement Section 4.2 (Credit Delay Penalty terms)',
    policyRef: 'ICAP Sharia Lending Directive v2.0',
    standardRef: 'AAOIFI Shari\'ah Standard No. 8 (Murabaha Delay Rules)',
    aiReasoning: 'Critical breach triggered because late penalty fees were directly credited to operational profit instead of being diverted to approved Charity Purification Ledger. Recommended transfer of $4,520.'
  },
  'REP-2026-002': {
    findingId: 'ALT-102',
    findingTitle: 'Principal safe guarantees in Musharaka',
    transactionId: 'TXN-99822',
    erpRecord: 'DocuSign Signed Musharaka Deal - Principal Safe Clause',
    contractRef: 'Musharaka Venture CTR-MS-881 (Clause 12.4)',
    policyRef: 'Corporate Joint Venture Guidelines Section 5.1',
    standardRef: 'AAOIFI Shari\'ah Standard No. 12 (Sharika and Modern Partnerships)',
    aiReasoning: 'Partnership structures must share profit and bear loss on proportional basis. A mutual guarantee of the principal investment nullifies the contract Sharia compatibility. Legal intervention assigned.'
  }
};

export default function ReportingCenterView({
  locale,
  theme,
  onTriggerActivityLog
}: ReportingCenterViewProps) {
  const isRTL = locale === 'ar';

  // Sub tab states (Requirement 1)
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'compliance' | 'audit' | 'sharia' | 'risk' | 'transactions' | 'builder' | 'templates' | 'export'>('dashboard');

  // Interactive core states
  const [reports, setReports] = useState<Report[]>(SEEDED_REPORTS);
  const [templates, setTemplates] = useState<ReportTemplate[]>(SEEDED_TEMPLATES);
  const [exports, setExports] = useState<ReportExport[]>(SEEDED_EXPORTS);
  const [versions, setVersions] = useState<ReportVersion[]>(SEEDED_VERSIONS);

  // Active review modal or selected report for document viewer
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-2026-001');
  const [showApprovalWorkflowModal, setShowApprovalWorkflowModal] = useState<boolean>(false);
  const [showEvidenceTraceModal, setShowEvidenceTraceModal] = useState<boolean>(false);

  // Template Builder form state (Requirement 6)
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<'Executive' | 'Sharia' | 'Audit' | 'Risk' | 'Transactions' | 'Operations'>('Executive');
  const [builderSelectedBlocks, setBuilderSelectedBlocks] = useState<string[]>(['Summary Card', 'Chart', 'Table']);
  const [builderAvailableBlocks] = useState<string[]>(['Summary Card', 'Chart', 'Table', 'Finding List', 'Evidence List', 'Recommendation List', 'Timeline']);

  // Report Generation input state (Requirement 4)
  const [genReportType, setGenReportType] = useState<string>('Executive');
  const [genReportName, setGenReportName] = useState<string>('');
  const [genDateRange, setGenDateRange] = useState<string>('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Success notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  // Helper trigger toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // REPORT GENERATION (Requirement 4)
  // ----------------------------------------------------
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!genReportName) return;

    setIsGenerating(true);
    triggerToast(isRTL ? 'جاري تشغيل محرك ذكاء التقارير وجمع الأدلة...' : 'Executing report intelligence engine and gathering audit proof...');

    setTimeout(() => {
      const newReport: Report = {
        id: `REP-${Date.now().toString().slice(-4)}`,
        organizationId: 'org-al-noor',
        name: genReportName,
        type: genReportType as any,
        status: 'Generated',
        sections: builderSelectedBlocks,
        createdBy: 'Compliance Copilot AI',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        dateRange: genDateRange,
        score: genReportType === 'Sharia' ? 98 : genReportType === 'Executive' ? 96 : 94,
        criticalIssues: genReportType === 'Executive' ? 2 : 1,
        majorRisks: genReportType === 'Risk Assessment' ? 5 : 2,
        confidential: true
      };

      setReports([newReport, ...reports]);
      setSelectedReportId(newReport.id);
      setIsGenerating(false);
      setGenReportName('');
      triggerToast(isRTL ? 'تم إنشاء المسودة وربط الأدلة بنجاح!' : 'Draft compiled and evidence traced successfully!');
      onTriggerActivityLog('GENERATE_COMPLIANCE_REPORT', `Generated ${newReport.type} report: ${newReport.name}`);
    }, 1500);
  };

  // ----------------------------------------------------
  // REPORT APPROVAL WORKFLOW (Requirement 7)
  // ----------------------------------------------------
  const handleUpdateStatus = (id: string, newStatus: Report['status'], reviewerName?: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          reviewer: reviewerName || r.reviewer
        };
      }
      return r;
    }));

    // Add version log
    const newVer: ReportVersion = {
      id: `VER-${Date.now().toString().slice(-2)}`,
      reportId: id,
      version: `v1.${versions.filter(v => v.reportId === id).length + 1}`,
      changes: `Status changed to ${newStatus}${reviewerName ? ` by reviewer ${reviewerName}` : ''}.`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: reviewerName || 'Authorized User'
    };
    setVersions([newVer, ...versions]);

    triggerToast(isRTL ? `تم تحديث حالة التقرير بنجاح إلى: ${newStatus}` : `Report status updated to: ${newStatus}`);
    onTriggerActivityLog('UPDATE_REPORT_STATUS', `Updated Report ID ${id} to status ${newStatus}`);
    setShowApprovalWorkflowModal(false);
  };

  // ----------------------------------------------------
  // TEMPLATE BUILDER (Requirement 6)
  // ----------------------------------------------------
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName) return;

    const template: ReportTemplate = {
      id: `TMP-${Date.now().toString().slice(-3)}`,
      name: newTemplateName,
      category: newTemplateCategory as any,
      sections: builderSelectedBlocks,
      createdBy: 'Chief Compliance Officer'
    };

    setTemplates([template, ...templates]);
    setNewTemplateName('');
    triggerToast(isRTL ? 'تم حفظ قالب التقرير المخصص بنجاح!' : 'Custom report template saved successfully!');
    onTriggerActivityLog('CREATE_REPORT_TEMPLATE', `Saved customized template: "${template.name}"`);
  };

  // ----------------------------------------------------
  // EXPORT GENERATION SYSTEM (Requirement 9)
  // ----------------------------------------------------
  const handleExport = (format: 'PDF' | 'Excel' | 'Word' | 'PowerPoint') => {
    triggerToast(isRTL ? `جاري تجهيز وتحويل التقرير بصيغة ${format}...` : `Preparing & converting document layout into ${format}...`);

    setTimeout(() => {
      const newExport: ReportExport = {
        id: `EXP-${Date.now().toString().slice(-3)}`,
        reportId: selectedReportId,
        format,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        fileSize: format === 'PDF' ? '2.4 MB' : '4.1 MB',
        downloadUrl: '#'
      };

      setExports([newExport, ...exports]);
      triggerToast(isRTL ? `تم تصدير وحفظ التقرير بنجاح!` : `Document exported and archived successfully!`);
      onTriggerActivityLog('EXPORT_REPORT', `Exported Report ${selectedReportId} as ${format}`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/10 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز التقارير والذكاء الرقابي' : 'Reporting & Compliance Intelligence'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/20">
                  {isRTL ? 'تدقيق آلي' : 'Enterprise Reporting'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL 
                  ? 'منصة إصدار التقارير المعتمدة الموثقة بالأدلة الرقابية والشرعية لجهات الإشراف ومجلس الإدارة.'
                  : 'Automated PwC-style reporting system generating rigorous, evidence-linked compliance dossiers for executives and auditors.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGenReportName(isRTL ? 'تقرير تقييم المعاملات والسياسات الفوري' : 'Ad-hoc Operational Compliance Assessment');
                setActiveSubTab('builder');
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRTL ? 'توليد تقرير جديد' : 'Generate New Report'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'اللوحة التنفيذية' : 'Executive Dashboard', icon: Layers },
            { id: 'compliance', name: isRTL ? 'ذكاء الامتثال' : 'Compliance Reports', icon: ShieldAlert },
            { id: 'audit', name: isRTL ? 'دعم التدقيق' : 'Audit Reports', icon: Award },
            { id: 'sharia', name: isRTL ? 'الرقابة الشرعية' : 'Sharia Reports', icon: CheckCircle },
            { id: 'risk', name: isRTL ? 'تقييم المخاطر' : 'Risk Reports', icon: Compass },
            { id: 'transactions', name: isRTL ? 'حركات الـ ERP' : 'Transaction Reports', icon: Sliders },
            { id: 'builder', name: isRTL ? 'صانع التقارير المخصصة' : 'Custom Report Builder', icon: Sliders },
            { id: 'templates', name: isRTL ? 'قوالب التقارير' : 'Report Templates', icon: Copy },
            { id: 'export', name: isRTL ? 'مركز التصدير والأرشيف' : 'Export Center', icon: FileSpreadsheet }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
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

      {/* Toast Alert Panel */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 max-w-xl text-xs font-mono">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Viewport */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >

          {/* LEFT/MAIN DUAL SPAN ELEMENT (DASHBOARDS, TAB CONTENTS) */}
          <div className="xl:col-span-2 space-y-6">

            {/* ====================================================
                1. SUB-PAGE: EXECUTIVE DASHBOARD (Requirement 2)
                ==================================================== */}
            {activeSubTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Executive Score Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: isRTL ? 'النتيجة الإجمالية' : 'Overall Compliance', score: '96%', color: 'border-emerald-500 text-emerald-600', sub: isRTL ? 'مؤشر الامتثال العام' : 'Overall Index' },
                    { title: isRTL ? 'الامتثال الشرعي' : 'Sharia Compliance', score: '98%', color: 'border-cyan-500 text-cyan-600', sub: isRTL ? 'معايير أيوفي (AAOIFI)' : 'AAOIFI Standard' },
                    { title: isRTL ? 'الرقابة المالية' : 'Financial Control', score: '94%', color: 'border-amber-500 text-amber-600', sub: isRTL ? 'حماية الأصول والثنائية' : 'Audit Control' },
                    { title: isRTL ? 'الالتزام التشغيلي' : 'Operational Score', score: '92%', color: 'border-indigo-500 text-indigo-600', sub: isRTL ? 'إجراءات العمل (SOP)' : 'Policy & Procedural' }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{item.title}</span>
                      <span className={`text-2xl font-display font-black block mt-2 ${item.color}`}>{item.score}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">{item.sub}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: isRTL ? 'مخرجات معلقة' : 'Open Findings', val: '14', desc: isRTL ? 'تحتاج اتخاذ إجراء تصحيحي' : 'Under mitigations' },
                    { title: isRTL ? 'مخاطر حرجة' : 'Critical Risks', val: '2', desc: isRTL ? 'تتجاوز الحدود الآمنة' : 'Immediate focus' },
                    { title: isRTL ? 'الشهادات الصادرة' : 'Issued Certificates', val: '5', desc: isRTL ? 'شهادات مطابقة شرعية مفعلة' : 'Verified public assets' }
                  ].map((card, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/10 border-slate-800' : 'bg-slate-50 border-slate-200'} text-xs`}>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">{card.title}</span>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{card.val}</span>
                        <span className="text-[10px] text-slate-400">{card.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical Charts Block */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'منحنى الامتثال ومكافحة المخاطر' : 'SaaS Analytics & Sharia Health Trend'}</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  
                  {/* High Quality visual bar representing compliance metrics */}
                  <div className="space-y-4 pt-2">
                    {[
                      { area: isRTL ? 'الخزينة والمعاملات الاستثمارية' : 'Treasury & Investment Liquidity', score: 98, trend: '↑ Improving', count: 1 },
                      { area: isRTL ? 'عقود الشراكة والمضاربة' : 'Mudaraba & Venture Agreements', score: 96, trend: '↑ Improving', count: 2 },
                      { area: isRTL ? 'سلسلة توريد المرابحة والسلع' : 'Murabaha Supply Chain Deliveries', score: 94, trend: '→ Stable', count: 4 },
                      { area: isRTL ? 'الرقابة وإجراءات الدفع الثنائي' : 'SAP Outlay & Multi-Sig Controls', score: 92, trend: '↓ Alert', count: 7 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>{item.area}</span>
                          <span className="font-mono text-[11px] text-slate-400">{item.score}% ({item.trend})</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.score}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>{isRTL ? `المشاكل المعلقة: ${item.count}` : `Open Issues: ${item.count}`}</span>
                          <span>{isRTL ? 'الالتزام: ممتاز' : 'Status: Optimal'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Preparation Assistant Prompt Module (Requirement 11) */}
                <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-800 p-6 rounded-2xl text-white space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        {isRTL ? 'مساعد التجهيز الآلي للتدقيق الخارجي' : 'Automated Audit Support Assistant'}
                      </h4>
                      <p className="text-xs text-emerald-300">
                        {isRTL 
                          ? 'توليد حزمة الإثبات المتكاملة للمدققين الخارجيين مع ربط كامل الحركات المصرفية بالأدلة والقرارات.'
                          : 'Assemble certified transaction logs, AAOIFI guidelines, and compliance records into an exportable package.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => {
                        triggerToast(isRTL ? 'جاري تحضير حزمة الإثباتات...' : 'Aggregating files and compliance signatures...');
                        onTriggerActivityLog('AUDIT_PREP_PACKAGE', 'Assembled Audit Package v2.1 containing 120 verified contracts.');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                    >
                      {isRTL ? 'تصدير حزمة الإثباتات (Audit Prep Dossier)' : 'Generate Certified Support Pack'}
                    </button>
                    <button
                      onClick={() => {
                        triggerToast(isRTL ? 'تم تنزيل الفهرس الرقمي للأدلة' : 'Downloaded Digital Evidence Index');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2 rounded-xl transition border border-slate-700"
                    >
                      {isRTL ? 'فهرس الأدلة الرقمية' : 'View Evidence Index'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                2. SUB-PAGE: COMPLIANCE INTELLIGENCE ANALYTICS (Req 3)
                ==================================================== */}
            {activeSubTab === 'compliance' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تحليل ذكاء الالتزام الشامل' : 'Compliance Intelligence Insights'}</h3>
                  <p className="text-xs text-slate-400">
                    {isRTL 
                      ? 'رصد متكامل وتتبع ذكي لكل محور من محاور عمل المنشأة مع تحليل خطوط الدفاع الخمسة.'
                      : 'Granular view of the five compliance dimensions with linked tracking of operational actions.'}
                  </p>

                  <div className="space-y-4 pt-3">
                    {[
                      { name: 'Sharia Governance', score: 98, status: 'Optimal', trend: 'Improving', issues: 1, action: 'Purification process update' },
                      { name: 'Financial Control Integrity', score: 94, status: 'Stable', trend: 'Stable', issues: 3, action: 'Apply second approval gate' },
                      { name: 'Operational SOP Compliance', score: 92, status: 'Under Review', trend: 'Action Required', issues: 5, action: 'Revise supplier checklist template' },
                      { name: 'Risk Management Framework', score: 95, status: 'Optimal', trend: 'Improving', issues: 2, action: 'Update high exposure rules' },
                      { name: 'Vendor Integrity Certification', score: 91, status: 'Stable', trend: 'Stable', issues: 3, action: 'Request Takaful transition' }
                    ].map((area, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{area.name}</h4>
                            <span className="text-[10px] text-slate-400">{isRTL ? 'الإجراء التصحيحي:' : 'Active Plan:'} <strong className="text-emerald-600 font-mono">{area.action}</strong></span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{area.score}%</span>
                            <span className="block text-[9px] text-slate-400">{area.trend}</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: `${area.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                3. SUB-PAGE: AUDIT SUPPORT REPORTS (Req 5 - REPORT 3)
                ==================================================== */}
            {activeSubTab === 'audit' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تقرير دعم التدقيق وإثباتات الرقابة الداخلية' : 'Audit Support & Control Testing'}</h3>
                      <p className="text-xs text-slate-400">{isRTL ? 'جمع فوري لأعمال التدقيق المنجزة واختبارات الضوابط والوثائق الثبوتية.' : 'Comprehensive controls review, performed testing cycles, and exceptions database.'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-3 border border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{isRTL ? 'نطاق التدقيق الحالي (Audit Scope)' : 'Audit Scope & Assessment Coverage'}</span>
                    <p className="text-slate-400">
                      This report documents compliance controls governing ERP outbound transactions, corporate legal partner rosters, and double-entry General Ledger validations against standard regulatory guidelines.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-white dark:bg-slate-950 p-3 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">{isRTL ? 'الاختبارات المنجزة' : 'Testing Performed'}</span>
                        <span className="font-bold block text-emerald-600 mt-1">12,500 Auto-Scans</span>
                      </div>
                      <div className="bg-white dark:bg-slate-950 p-3 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">{isRTL ? 'الضوابط المفحوصة' : 'Controls Reviewed'}</span>
                        <span className="font-bold block text-emerald-600 mt-1">45 Corporate SOPs</span>
                      </div>
                    </div>
                  </div>

                  {/* Exception table list */}
                  <div className="space-y-3">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{isRTL ? 'الحالات المستثناة والإجراءات التصحيحية' : 'Identified Exceptions & Corrective Action Status'}</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-500">
                        <thead className="text-[10px] uppercase text-slate-400 bg-slate-50 dark:bg-slate-900">
                          <tr>
                            <th className="p-2.5">ID</th>
                            <th className="p-2.5">Control Target</th>
                            <th className="p-2.5">Exception Found</th>
                            <th className="p-2.5">Corrective Plan</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {[
                            { id: 'EX-01', control: 'Dual Authorization', desc: 'Outlay of $520k had single signatory approval', plan: 'Retrospective VP validation required', status: 'In Progress' },
                            { id: 'EX-02', control: 'Vendor Validation', desc: 'Amana Logistics ISO certificate outdated', plan: 'Assigned renewal request workflow', status: 'Completed' },
                            { id: 'EX-03', control: 'Capital Protection', desc: 'Contract CTR-MS-881 guaranteed principal', plan: 'Stipulating risk sharing amend note', status: 'Open' }
                          ].map((ex, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                              <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{ex.id}</td>
                              <td className="p-2.5">{ex.control}</td>
                              <td className="p-2.5 text-rose-600">{ex.desc}</td>
                              <td className="p-2.5">{ex.plan}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                  ex.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  ex.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                                }`}>{ex.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                4. SUB-PAGE: SHARIA COMPLIANCE REPORTS (Req 5 - REPORT 2)
                ==================================================== */}
            {activeSubTab === 'sharia' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تقرير المطابقة والتدقيق الشرعي المعتمد' : 'Certified Sharia Compliance Review'}</h3>
                      <p className="text-xs text-slate-400">{isRTL ? 'فحص كامل للأعمال الاستثمارية والمالية طبقاً لمعايير هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (أيوفي).' : 'Compliance reporting mapped to AAOIFI Shari\'ah and governance frameworks.'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{isRTL ? 'المجالات الخاضعة للفحص الشرعي' : 'Reviewed Sharia Areas'}</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400">
                        <li>Treasury liquidity financing instruments</li>
                        <li>Musharaka partnership guarantee structures</li>
                        <li>Murabaha commodity holding sequences</li>
                        <li>Operational purification transfers</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{isRTL ? 'معايير أيوفي المطبقة' : 'Applicable AAOIFI Standards'}</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
                        <li>AAOIFI Standard No. 8 (Murabaha Delay Rules)</li>
                        <li>AAOIFI Standard No. 12 (Musharaka Rules)</li>
                        <li>AAOIFI Standard No. 21 (Financial Paper purification)</li>
                        <li>ICAP Corporate Sharia Guideline v1.5</li>
                      </ul>
                    </div>
                  </div>

                  {/* Real-world reviewer decision table */}
                  <div className="space-y-2">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{isRTL ? 'قرارات وتوصيات مستشاري الهيئة الشرعية' : 'Board Decisions & Asset Purification Audit'}</span>
                    <div className="p-4 bg-emerald-500/10 rounded-xl text-xs space-y-2">
                      <span className="font-bold block text-emerald-600">Decision on late payment fees (REP-2026-002)</span>
                      <p className="text-slate-400 leading-relaxed">
                        The board has reviewed the $4,520 credit in ledger 4509. Under AAOIFI rules, direct accrual of penalty fees into corporate profits is prohibited. The system has automatically queued an immediate asset routing transfer to route these funds to the approved Charity Purification Account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                5. SUB-PAGE: RISK ASSESSMENT REPORTS (Req 5 - REPORT 5)
                ==================================================== */}
            {activeSubTab === 'risk' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مصفوفة وتصنيف المخاطر التشغيلية والشرعية' : 'Operational & Sharia Risk Assessment'}</h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'تقييم مستويات الاحتمالية والأثر لمختلف التهديدات وحالة خطط المعالجة والحد منها.' : 'Risk scoring, assignment, matrix coordinates and mitigation statuses.'}</p>

                  {/* Visual 4x4 Risk Matrix Diagram (Requirement 9) */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">{isRTL ? 'مصفوفة توزيع المخاطر (Likelihood vs Impact)' : 'Likelihood vs Impact Matrix Map'}</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className="bg-rose-100 dark:bg-rose-950/40 text-rose-800 p-4 rounded-lg flex flex-col justify-between h-20">
                        <span>CRITICAL</span>
                        <span className="font-mono text-xs">2 Assets</span>
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-950/20 text-amber-800 p-4 rounded-lg flex flex-col justify-between h-20">
                        <span>HIGH</span>
                        <span className="font-mono text-xs">4 Assets</span>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-950/20 text-blue-800 p-4 rounded-lg flex flex-col justify-between h-20">
                        <span>MEDIUM</span>
                        <span className="font-mono text-xs">6 Assets</span>
                      </div>
                      <div className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 p-4 rounded-lg flex flex-col justify-between h-20">
                        <span>LOW</span>
                        <span className="font-mono text-xs">15 Assets</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{isRTL ? 'خطط الحد من المخاطر والملاك المسؤولين' : 'Active Mitigation Responsibility Matrix'}</span>
                    <div className="space-y-2">
                      {[
                        { risk: 'Unpurified Late Payment Penalty Accrual', score: 'Critical (8.5)', owner: 'Sheikh Zain Al-Abedin', mitigation: 'Automated transfer routing to Charity Account' },
                        { risk: 'Dual Signature Check Waiver', score: 'High (7.2)', owner: 'Finance VP Watson', mitigation: 'Manual double authentication rule release block' },
                        { risk: 'Supplier Contract SLA Overrun', score: 'Medium (4.5)', owner: 'Procurement Team', mitigation: 'Active tracking trigger notification renewal' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg flex justify-between items-center">
                          <div>
                            <span className="font-bold block text-slate-800 dark:text-slate-100">{item.risk}</span>
                            <span className="text-[10px] text-slate-400">{isRTL ? 'خطة الحد:' : 'Mitigation:'} {item.mitigation}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono font-bold block mb-1">{item.score}</span>
                            <span className="text-[10px] text-slate-400 block">{item.owner}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                6. SUB-PAGE: TRANSACTION EXCEPTION REPORTS (Req 5 - REPORT 4)
                ==================================================== */}
            {activeSubTab === 'transactions' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تقرير فحص ومطابقة حركات الـ ERP الفورية' : 'ERP Transaction Auditing Log'}</h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'سجل تفصيلي بكافة المعاملات المالية المفلترة والمحللة بواسطة قواعد الامتثال الذكية.' : 'Comprehensive audit analysis of transactions with suspicious flag matching.'}</p>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold block text-slate-700 dark:text-slate-300">{isRTL ? 'منهجية الفحص والمطابقة الآلية' : 'Real-Time Rule-Based Scan Pattern'}</span>
                    <p className="text-slate-400">
                      Every payment voucher, commodity sale agreement and supplier purchase record from SAP and Odoo flows through our multi-agent testing suite. Non-compliant elements are immediately diverted for Sharia purifications.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{isRTL ? 'الحركات المشبوهة أو المستثناة حديثاً' : 'Diverted Suspicious Exceptions'}</span>
                    <div className="space-y-2 text-xs">
                      {[
                        { id: 'TXN-99882', desc: 'Credit of $4,520 to interest-penalty revenue ledger', rule: 'MR-01 (Interest Accrual Rule)', status: 'Sharia Purification Hold' },
                        { id: 'TXN-99822', desc: 'Musharaka venture contract principal safety security clause', rule: 'MR-03 (Conventional fixed guarantee detector)', status: 'Legal Redraft Assigned' },
                        { id: 'TXN-99810', desc: 'Disbursement of $82,000 to conventional commercial insurer', rule: 'MR-06 (Non-Takaful Commercial Cover)', status: 'Referred to Cooperative Takaful' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-800 dark:text-slate-200">{item.id}</span>
                            <span className="text-amber-600 font-mono text-[10px]">{item.status}</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{item.desc}</p>
                          <div className="pt-1 text-[10px] text-slate-400">
                            <span>{isRTL ? 'القاعدة المفعلة:' : 'Rule Violated:'} <code className="text-indigo-500 font-mono">{item.rule}</code></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                7. SUB-PAGE: CUSTOM REPORT TEMPLATE BUILDER (Req 6)
                ==================================================== */}
            {activeSubTab === 'builder' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'محرك بناء وصياغة التقارير التنفيذية' : 'Custom Report Template Builder'}</h3>
                    <p className="text-xs text-slate-400">{isRTL ? 'صمم قوالب التقارير المخصصة لشركتك من خلال اختيار كتل المحتوى والجداول والمؤشرات.' : 'Drag, customize, and save custom executive templates with corporate branding.'}</p>
                  </div>

                  <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'اسم القالب المخصص' : 'Custom Template Name'}</label>
                        <input
                          type="text"
                          required
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          placeholder="e.g. Q3 AAOIFI Compliance Dossier"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'فئة التقرير' : 'Template Category'}</label>
                        <select
                          value={newTemplateCategory}
                          onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                        >
                          <option value="Executive">Executive Compliance</option>
                          <option value="Sharia">Sharia Compliance</option>
                          <option value="Audit">Audit Support</option>
                          <option value="Risk">Risk Assessment</option>
                          <option value="Transactions">ERP Transactions</option>
                        </select>
                      </div>
                    </div>

                    {/* Interactive drag-and-drop / selector blocks */}
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-400">{isRTL ? 'المقاطع البرمجية والهياكل النشطة بالقالب (Active Blocks)' : 'Select & Order Layout Blocks'}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {builderAvailableBlocks.map((block, i) => {
                          const active = builderSelectedBlocks.includes(block);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                if (active) {
                                  setBuilderSelectedBlocks(builderSelectedBlocks.filter(b => b !== block));
                                } else {
                                  setBuilderSelectedBlocks([...builderSelectedBlocks, block]);
                                }
                              }}
                              className={`p-3 rounded-xl border text-center font-bold transition flex flex-col justify-between items-center h-16 ${
                                active
                                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600'
                                  : 'bg-slate-50 border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-400'
                              }`}
                            >
                              <span className="text-[10px]">{block}</span>
                              <span className="text-[9px] font-mono text-slate-400">{active ? '✓ Active' : '+ Click to Add'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-3">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
                      >
                        {isRTL ? 'حفظ قالب التقرير الجديد' : 'Save Report Template'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Instant Generator Form (Requirement 4) */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'محرك التوليد الآلي الفوري' : 'Compile Ad-hoc Document Engine'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'نوع التقرير' : 'Document Category'}</label>
                      <select
                        value={genReportType}
                        onChange={(e) => setGenReportType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-lg"
                      >
                        <option value="Executive">Executive Overview</option>
                        <option value="Sharia">Sharia AAOIFI Review</option>
                        <option value="Audit Support">Audit Support Pack</option>
                        <option value="Risk Assessment">Risk Exposure Assessment</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-400 mb-1">{isRTL ? 'عنوان التقرير المستهدف' : 'Document Target Name'}</label>
                      <input
                        type="text"
                        value={genReportName}
                        onChange={(e) => setGenReportName(e.target.value)}
                        placeholder="e.g. Q3 Multi-Agent Compliance Dossier"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2">
                    <span className="text-slate-400">{isRTL ? 'التردد والربط متاح للتصدير الفوري' : 'Automated evidence checking enabled.'}</span>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={handleGenerateReport}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{isRTL ? 'جاري التحضير...' : 'Compiling...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'توليد ومطابقة الأدلة' : 'Compile & Gather Evidence'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ====================================================
                8. SUB-PAGE: PREDEFINED TEMPLATES (Requirement 6)
                ==================================================== */}
            {activeSubTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold">{tpl.category.toUpperCase()}</span>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mt-2">{tpl.name}</h4>
                      </div>
                      {tpl.isPredefined && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Predefined</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'المكونات المضمّنة بالتقرير:' : 'Included Report Block structures:'}</span>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {tpl.sections.map((sec, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded text-slate-400">{sec}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          setGenReportType(tpl.category);
                          setGenReportName(tpl.name.replace('Format', 'Draft').replace('Package', 'Draft'));
                          setActiveSubTab('builder');
                          triggerToast(isRTL ? 'تم تحميل القالب بنجاح لصفحة التوليد!' : 'Loaded template configuration to generator!');
                        }}
                        className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5 hover:underline"
                      >
                        {isRTL ? 'استخدام هذا القالب' : 'Instantiate Template'}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ====================================================
                9. SUB-PAGE: EXPORTS ARCHIVE & HISTORY (Req 11)
                ==================================================== */}
            {activeSubTab === 'export' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'سجل التنزيلات والنسخ المؤرشفة' : 'Export Archives & Document Control'}</h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'تنزيل ومشاركة كافة التقارير الرسمية المصدرة مسبقاً لمراجعي الحسابات والشركاء.' : 'Traceable list of compiled report output formats with secure storage access.'}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500">
                      <thead className="text-[10px] uppercase text-slate-400 bg-slate-50 dark:bg-slate-900">
                        <tr>
                          <th className="p-3">Export ID</th>
                          <th className="p-3">Report Context</th>
                          <th className="p-3">Format</th>
                          <th className="p-3">File Size</th>
                          <th className="p-3">Generated Date</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {exports.map((exp, idx) => {
                          const associatedReport = reports.find(r => r.id === exp.reportId);
                          return (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                              <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{exp.id}</td>
                              <td className="p-3 max-w-xs truncate">{associatedReport?.name || 'Custom Executive Report'}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold font-mono text-[9px]">{exp.format}</span>
                              </td>
                              <td className="p-3 font-mono text-[11px]">{exp.fileSize}</td>
                              <td className="p-3">{exp.createdAt}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => triggerToast(isRTL ? 'بدء تنزيل الملف...' : 'Starting document download secure handshake...')}
                                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>{isRTL ? 'تنزيل' : 'Download'}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: CONSULTATIVE LIVE PREVIEW & WORKFLOWS (Req 10) */}
          <div className="space-y-6">

            {/* Document Controls */}
            <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{isRTL ? 'عناصر التقرير النشط' : 'Active Document Navigator'}</span>
              <div className="space-y-2">
                <select
                  value={selectedReportId}
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold"
                >
                  {reports.map(rep => (
                    <option key={rep.id} value={rep.id}>{rep.name}</option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setShowApprovalWorkflowModal(true)}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-xl transition shadow"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'الاعتماد والموافقة' : 'Approval Workflow'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (TRACE_DATABASE[selectedReport.id]) {
                        setShowEvidenceTraceModal(true);
                      } else {
                        triggerToast(isRTL ? 'لا توجد أدلة مرتبطة في هذه المسودة المؤقتة.' : 'No active trace records for this draft report.');
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold p-2.5 rounded-xl transition border border-slate-200 dark:border-slate-700"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'تتبع الأدلة' : 'Evidence Trace'}</span>
                  </button>
                </div>
              </div>

              {/* Version History Archive (Requirement 11) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'تاريخ التحديث والنسخ (Versions)' : 'Version History Log'}</span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {versions
                    .filter(v => v.reportId === selectedReport.id)
                    .map((ver, i) => (
                      <div key={i} className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-[10px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                          <span>{ver.version}</span>
                          <span className="text-slate-400">{ver.date}</span>
                        </div>
                        <p className="text-slate-400 leading-normal">{ver.changes}</p>
                        <span className="text-emerald-600 font-mono block">By: {ver.author}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* ====================================================
                10. DELOITTE/PwC PREMIUM CONSULTING DOCUMENT VIEW
                ==================================================== */}
            <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'
            }`} style={{ minHeight: '620px' }}>
              
              {/* Consulting Header Layout (PwC/Deloitte quality) */}
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-black text-emerald-600 block">ICAP AUDIT DOSSIER</span>
                    <span className="text-[8px] text-slate-400 block font-mono">{selectedReport.id} | SECURITY CLASSIFIED</span>
                  </div>
                  {/* Styled Professional Consulting Logo representation */}
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></div>
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-sm"></div>
                    <span className="text-[9px] font-display font-black tracking-tighter text-slate-500">ICAP ADVISORY</span>
                  </div>
                </div>

                {/* Cover Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase tracking-wider font-mono">
                      {selectedReport.status}
                    </span>
                    {selectedReport.confidential && (
                      <span className="text-[9px] text-rose-600 font-bold uppercase">Strictly Private & Confidential</span>
                    )}
                  </div>
                  <h2 className="text-lg font-display font-black leading-snug tracking-tight">
                    {selectedReport.name}
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Prepared for: <strong className="text-slate-700 dark:text-slate-200">Al Noor Islamic Finance Group</strong>
                  </p>
                </div>

                {/* Sub Sections mapped interactively */}
                <div className="space-y-4 pt-2">
                  {selectedReport.sections.slice(0, 3).map((sect, sIdx) => (
                    <div key={sIdx} className="space-y-1 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-1 h-3 bg-emerald-600 rounded"></span>
                        {sect}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-relaxed pl-3">
                        {sect === 'Executive Summary' 
                          ? 'This period exhibits key compliance milestones. Total audit scope expanded by 4% with a final compliance coefficient of 96% on general ledgers.'
                          : sect === 'Reviewed Areas'
                          ? 'Mudaraba agreements, Murabaha credit holdings, late fee penalties ledger audit checks completed.'
                          : sect === 'Compliance Score Overview'
                          ? 'Aggregated score of 96% with optimum level rating across Islamic Finance, operational limits and general security parameters.'
                          : 'Testing performed continuously against active compliance models in real-time sequence. Full digital signatures validated.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consulting Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[8px] text-slate-400">
                <div className="space-y-0.5">
                  <span>Prepared by: {selectedReport.createdBy}</span>
                  <span className="block">Date compiled: {selectedReport.createdAt}</span>
                </div>
                <div className="text-right">
                  <span>Approved by: {selectedReport.reviewer || 'Under review'}</span>
                  <span className="block">Page 1 of 12</span>
                </div>
              </div>

              {/* Quick Export Panel (Requirement 9) */}
              <div className="absolute bottom-16 left-0 right-0 bg-slate-900/90 backdrop-blur p-4 mx-4 rounded-2xl flex items-center justify-between text-xs text-white z-10 border border-slate-700">
                <span>{isRTL ? 'تصدير كـ:' : 'Export to format:'}</span>
                <div className="flex gap-1">
                  {(['PDF', 'Excel', 'Word'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 px-2.5 py-1.5 rounded font-bold font-mono text-[10px] transition"
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* ====================================================
          MODAL 1: REPORT APPROVAL WORKFLOW (Requirement 7)
          ==================================================== */}
      {showApprovalWorkflowModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'} shadow-2xl space-y-4 text-xs`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                {isRTL ? 'مسار التدقيق والاعتماد' : 'Report Approval & Sign-Off Workflow'}
              </h3>
              <button onClick={() => setShowApprovalWorkflowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                <span className="font-bold text-[10px] uppercase text-slate-400 block">{isRTL ? 'التقرير المختار' : 'Target Document'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReport.name}</span>
                <span className="block text-[10px] text-slate-400">{isRTL ? 'الحالة الحالية:' : 'Current Status:'} {selectedReport.status}</span>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-400 block">{isRTL ? 'تحديث الحالة والاعتماد للمدققين' : 'Transition Report State'}</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'Reviewed', 'Sheikh Zain Al-Abedin')}
                    className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold transition text-center text-slate-700 dark:text-slate-300"
                  >
                    {isRTL ? 'وضع تحت المراجعة (Reviewed)' : 'Mark as Reviewed'}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'Approved', 'Sharia Board Committee')}
                    className="p-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 rounded-xl font-bold transition text-center"
                  >
                    {isRTL ? 'اعتماد ونشر (Approve)' : 'Approve & Release'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowApprovalWorkflowModal(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 font-bold px-4 py-2 rounded-xl transition"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: EVIDENCE LINK TRACING VIEWER (Requirement 8)
          ==================================================== */}
      {showEvidenceTraceModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'} shadow-2xl space-y-4 text-xs`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                {isRTL ? 'تتبع الأدلة والربط القانوني والشرعي' : 'Traceable Evidence Link & Compliance Verification'}
              </h3>
              <button onClick={() => setShowEvidenceTraceModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {TRACE_DATABASE[selectedReport.id] ? (
              <div className="space-y-3 font-sans">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'التنبيه المكتشف' : 'Identified Finding'}</span>
                  <span className="font-bold text-rose-600">{TRACE_DATABASE[selectedReport.id].findingTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'رقم المعاملة' : 'Transaction ID'}</span>
                    <span className="font-mono font-bold">{TRACE_DATABASE[selectedReport.id].transactionId}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'سجل الـ ERP المعني' : 'ERP Trace Record'}</span>
                    <span className="font-mono text-indigo-500 break-all">{TRACE_DATABASE[selectedReport.id].erpRecord}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'مرجع السياسة وبند العقد' : 'Contract & Policy Reference'}</span>
                  <span className="text-slate-600 dark:text-slate-200">{TRACE_DATABASE[selectedReport.id].contractRef}</span>
                  <span className="block text-[9px] text-slate-400">{TRACE_DATABASE[selectedReport.id].policyRef}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'المعيار الشرعي المطبق (أيوفي)' : 'AAOIFI Sharia Standard Reference'}</span>
                  <span className="text-emerald-600 font-mono font-bold">{TRACE_DATABASE[selectedReport.id].standardRef}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'مخرجات ذكاء الـ AI التفسيرية' : 'AI Reasoning & Logic Output'}</span>
                  <p className="text-slate-400 leading-relaxed font-serif text-[11px] italic">
                    "{TRACE_DATABASE[selectedReport.id].aiReasoning}"
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">{isRTL ? 'لا توجد أدلة ثبوتية مفصلة في قاعدة البيانات لهذه المسودة حالياً.' : 'No active proof log for this draft report item.'}</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowEvidenceTraceModal(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 font-bold px-4 py-2 rounded-xl transition"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
