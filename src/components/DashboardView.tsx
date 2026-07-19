import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  FileText,
  AlertTriangle,
  Award,
  Cpu,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Server,
  Users,
  Building,
  Terminal,
  Database,
  Lock,
  Link,
  ClipboardList,
  CheckSquare,
  BarChart3,
  HelpCircle,
  FileCheck,
  FolderOpen,
  Calendar,
  ArrowLeftRight,
  TrendingDown,
  Gauge,
  AlertOctagon,
  LineChart,
  Play,
  LayoutGrid,
  Bell,
  Check
} from 'lucide-react';
import { ActivityLog } from '../types';
import { WorkspaceConfig } from '../workspaces';

interface DashboardViewProps {
  stats: {
    score: number;
    standards: number;
    documents: number;
    findings: number;
    certificates: number;
    systems: number;
  };
  activityLogs: ActivityLog[];
  locale: 'en' | 'ar';
  workspaceConfig: WorkspaceConfig;
  onExecuteAction?: (actionId: string, actionName: string) => void;
}

const AR_TRANSLATIONS: Record<string, string> = {
  // Super Admin Widgets
  'Total Active Tenants': 'إجمالي المستأجرين النشطين',
  'System API Request Volume': 'حجم طلبات النظام للروابط',
  'Cluster CPU Util': 'استهلاك معالج مجموعة الخوادم',
  'Global License Revenue': 'عوائد التراخيص العالمية',
  // Org Admin Widgets
  'Enterprise Members': 'أعضاء المؤسسة النشطين',
  'ERP Feeds Screened': 'سجلات الأنظمة المفحوصة',
  'Open Compliance Tasks': 'مهام الامتثال المفتوحة',
  'Current Billing Tier': 'فئة اشتراك الفواتير الحالية',
  // Sharia Reviewer Widgets
  'Assigned Reviews': 'المراجعات المعينة',
  'Evidence Files Checked': 'ملفات الأدلة المدققة',
  'Active Sharia Rulings': 'الأحكام الشرعية المعتمدة',
  'Board Certification Score': 'معدل حوكمة الهيئة الشرعية',
  // Auditor Widgets
  'Active Engagements': 'مهام التدقيق النشطة',
  'Working Papers Filed': 'أوراق العمل المودعة',
  'Remediation Plans': 'خطط المعالجة القائمة',
  'Audit Readiness Index': 'مؤشر جاهزية التدقيق',
  // Compliance Widgets
  'Self-Reviews Run': 'عمليات المراجعة الذاتية المنفذة',
  'Transactions Screened': 'العمليات المالية المفحوصة',
  'Critical Warnings': 'التحذيرات الحرجة المرصودة',
  'Total Documents Indexed': 'المستندات المفهرسة والمؤرشفة',
  // Executive Widgets
  'Overall Score': 'معدل الامتثال الكلي',
  'Purification Yield Hold': 'مبالغ التطهير المالي المعزولة',
  'Active Board Sign-Offs': 'توقيعات الهيئة المعتمدة',
  'Remediation Rate': 'معدل الاستجابة والمعالجة',
  // Partner Widgets
  'Onboarded Customers': 'العملاء المسجلون عبر الشريك',
  'Active Projects': 'مشاريع التكامل النشطة',
  'Monthly Revenue Share': 'حصة الأرباح الشهرية للشركاء',
  'Accrued Commission': 'العمولات المستحقة المتراكمة',
  // Developer Widgets
  'API Calls (24h)': 'استدعاءات الروابط (٢٤ ساعة)',
  'Active API Keys': 'مفاتيح الربط البرمجي النشطة',
  'Connected Apps': 'التطبيقات المرتبطة بالمنصة',
  'API Network Bandwidth': 'زمن استجابة الشبكة',

  // Quick Action Names
  'Register New Tenant': 'تسجيل مؤسسة مستأجرة جديدة',
  'Trigger Global Backup': 'تفعيل النسخ الاحتياطي الشامل',
  'Review Pending Subscriptions': 'مراجعة الاشتراكات المعلقة',
  'API Diagnostics Run': 'تشخيص صحة روابط النظام',
  'Add Workspace Employee': 'إضافة موظف جديد لبيئة العمل',
  'Establish ERP Connector': 'ربط وتكامل نظام إدارة الموارد',
  'Draft Custom Rule': 'صياغة قاعدة امتثال مخصصة',
  'Download Compliance Dossier': 'تحميل ملف الامتثال الشامل',
  'Lodge Digital Fatwa': 'إيداع فتوى أو قرار شرعي رقمي',
  'Evaluate Audit Evidence': 'مراجعة وتقييم أدلة التدقيق',
  'Sign Compliance Seal': 'توقيع ختم المطابقة والاعتماد',
  'Flag Non-Compliant Flow': 'رصد وتجميد معاملة غير متوافقة',
  'Start New Engagement': 'بدء مهمة تدقيق معتمدة',
  'Commit Working Paper': 'إيداع ورقة عمل مخصصة',
  'Log Corrective Plan': 'تسجيل خطة إجراء تصحيحي',
  'Synthesize Auditor Verdict': 'تلخيص نتائج التدقيق الذكية',
  'Execute Screening': 'تشغيل الفحص الفوري للعمليات',
  'Index New Regulation': 'فهرسة لائحة أو معيار تنظيمي',
  'Initiate Self-Review': 'بدء مراجعة مطابقة ذاتية',
  'Run AI Reasoning Audit': 'تشغيل استدلال الذكاء الاصطناعي',
  'Generate Board Report': 'توليد تقرير مجلس الإدارة الإستراتيجي',
  'View Risk Heatmap': 'عرض خريطة المخاطر الحرارية',
  'Examine Yield Purification': 'فحص أرصدة وحسابات التطهير',
  'Verify Active Signatures': 'التحقق من التوقيعات النشطة',
  'Register Referral Lead': 'تسجيل عميل محال جديد',
  'Initiate Partner Project': 'إطلق مشروع تكامل مع شريك',
  'Publish Solutions Listing': 'نشر حلول مخصصة في السوق',
  'Export Earnings Summary': 'تصدير كشف عوائد الأرباح',
  'Provision API Key': 'توليد مفتاح ربط برمجي جديد',
  'Register Sandbox App': 'تسجيل تطبيق في بيئة التطوير',
  'Download SDK Package': 'تحميل حزمة تطوير برمجيات SDK',
  'View API Call Logs': 'عرض سجل استدعاءات الخادم',

  // Desc Translations
  'Provision a new organization isolated database partition.': 'توفير قسم قاعدة بيانات معزول ومنفصل لمستأجر جديد.',
  'Snapshot database across all cloud availability regions.': 'أخذ نسخة احتياطية فورية لقاعدة البيانات عبر جميع المناطق السحابية.',
  'Manually approve enterprise custom-tiered subscription requests.': 'موافقة يدوية على طلبات الاشتراك المخصصة للمؤسسات الكبرى.',
  'Check latency and health across endpoints and gRPC ports.': 'فحص زمن الاستجابة والحالة العامة للروابط ومنافذ الخدمة gRPC.',
  'Create and issue safe authorization credentials.': 'إنشاء وإصدار بيانات اعتماد وصلاحيات آمنة للموظفين.',
  'Sync ledger databases via secure REST APIs.': 'مزامنة دفاتر المحاسبة عبر روابط وقنوات REST الآمنة.',
  'Create logical screening rules for active contracts.': 'إنشاء قواعد مبرمجة لفحص ومراجعة العقود الفعالة.',
  'Export full PDF reporting to corporate stakeholders.': 'تصدير تقرير الامتثال الشامل كملف PDF للمسؤولين.',
  'Publish Sharia Supervisory Board ruling on complex transactions.': 'إصدار ونشر أحكام وقرارات الرقابة الشرعية للعمليات المعقدة.',
  'Perform text analysis on contracts submitted.': 'إجراء تحليل ذكي للنصوص والمصطلحات في العقود المرفوعة.',
  'Electronically sign AAOIFI compatibility certificates.': 'توقيع واعتماد شهادات التوافق الرقمية مع معايير أيوفي.',
  'Identify and quarantine riba-based transaction flows.': 'رصد وحظر العمليات والتدفقات المالية التي تتضمن شبهات ربوية.',
  'Initiate a scheduled regulatory compliance audit cycle.': 'بدء دورة تدقيق دورية مجدولة لمطابقة اللوائح التنظيمية.',
  'Upload spreadsheets and reference documents.': 'تحميل ملفات العمل وجداول البيانات والمستندات المرجعية.',
  'Assign remediation timelines to business departments.': 'تحديد وتعيين فترات زمنية للإجراءات التصحيحية للأقسام.',
  'Use LLM engine to extract summaries for the board.': 'استخدام محرك الذكاء الاصطناعي لاستخلاص ملخصات التدقيق.',
  'Scan real-time cash flow and contracts using compliance rules.': 'فحص فوري للتدفقات النقدية ومطابقة العقود بقواعد المطابقة.',
  'Incorporate new regulatory guidelines into Knowledge Center.': 'إضافة اللوائح التنظيمية الجديدة إلى مركز المعرفة والبحث.',
  'Execute step-by-step verification on specific operations.': 'إجراء خطوات فحص دورية شاملة على عمليات تشغيلية بعينها.',
  'Use semantic analysis to extract logic constraints.': 'استخدام التحليل الدلالي لاستخلاص شروط وضوابط الحوكمة.',
  'Draft summary dossier explaining current Sharia compliance posture.': 'صياغة ملخص متكامل يشرح الحالة العامة للمطابقة والامتثال الشرعي.',
  'Inspect potential liability across various assets.': 'فحص وتحليل المخاطر القانونية والشرعية المحتملة عبر الأصول.',
  'Audit funds marked for charitable donation.': 'تدقيق المبالغ المعزولة والموجهة للجمعيات الخيرية (التطهير المالي).',
  'Review valid digital board approvals.': 'مراجعة وفحص التواقيع الشرعية الرقمية الصادرة والفعالة.',
  'Submit details of new enterprise client for onboarding.': 'إرسال بيانات شركة عميلة جديدة لتجهيز وتفعيل حسابها.',
  'Spawn collaborative compliance workspace with clients.': 'بدء بيئة عمل مشتركة لمتابعة الامتثال مع المؤسسات العميلة.',
  'Upload tailored workflow template to ICAP marketplace.': 'رفع ونشر قوالب عمليات مخصصة في سوق حلول ICAP.',
  'Get verified breakdown of revenue and commission logs.': 'استعراض كشف الأرباح والعمولات المعتمدة والمستحقة بالتفصيل.',
  'Generate standard bearer tokens for ERP ledger hooks.': 'توليد رموز ربط وتفويض آمنة (Bearer Tokens) لدفاتر الموارد.',
  'Create logical container to mock API request loads.': 'إنشاء حاوية مبرمجة لمحاكاة حجم طلبات الروابط البرمجية.',
  'Obtain modern TypeScript integration package.': 'تحميل حزمة التكامل البرمجية المحدثة بلغة TypeScript.',
  'Stream system response codes and transaction latency.': 'متابعة حية لرموز الاستجابة وزمن معالجة المعاملات البرمجية.',
  'Digitally record compliance posture guidelines understanding.': 'تسجيل وتوثيق قراءة وفهم موظف لضوابط الامتثال والسياسات.',
  'Incorporate reference contracts for screening.': 'رفع العقود والوثائق المرجعية للفحص والمطابقة.'
};

export default function DashboardView({
  stats,
  activityLogs,
  locale,
  workspaceConfig,
  onExecuteAction
}: DashboardViewProps) {
  const isRTL = locale === 'ar';
  const [executedAlert, setExecutedAlert] = useState<{ name: string; time: string } | null>(null);

  if (!workspaceConfig) return null;

  const translateText = (text: string): string => {
    if (!isRTL) return text;
    return AR_TRANSLATIONS[text] || text;
  };

  const handleActionClick = (actionId: string, name: string) => {
    if (onExecuteAction) {
      onExecuteAction(actionId, name);
    }
    setExecutedAlert({
      name,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
    setTimeout(() => {
      setExecutedAlert(null);
    }, 4000);
  };

  const t = {
    workspaceSlogan: isRTL ? 'بيئة تشغيل مخصصة بالكامل' : 'Role-authoritative workspace environment',
    overallScore: isRTL ? 'معدل الامتثال العام للبيئة' : 'Workspace Compliance Score',
    trendTitle: isRTL ? `منحنى الأداء للبيئة (${workspaceConfig.workspaceNameAr})` : `Operational Analytics (${workspaceConfig.workspaceNameEn})`,
    trendDesc: isRTL ? 'تتبع فوري لمؤشرات دور الحوكمة النشط' : 'Real-time tracking of workspace key indicators',
    riskTitle: isRTL ? 'توزيع مستويات مخاطر الامتثال' : 'Compliance Risk Alignment',
    recentActivity: isRTL ? 'أحدث نشاطات الحوكمة والدور' : 'Recent Workspace Activity Logs',
    viewAll: isRTL ? 'عرض سجلات التدقيق' : 'View Audit Trail',
    quickActionsTitle: isRTL ? 'الإجراءات والعمليات السريعة' : 'Workspace Quick Actions',
    quickActionsDesc: isRTL ? 'اختصارات عمليات مبرمجة مخصصة لدورك' : 'Authoritative operations tailored to your governance role',
    activeAlerts: isRTL ? 'تنبيهات بيئة العمل النشطة' : 'Workspace Active Alerts',
    sandboxStatus: isRTL ? 'حالة ربط خادم الفحص الآلي' : 'Active Automated Screening Sandbox',
    sandboxDesc: isRTL ? 'خوادم الفحص في الوقت الفعلي تعمل بشكل مستقر وآمن.' : 'Real-time sandbox screening containers are operating optimally.'
  };

  return (
    <div id="dashboard-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded">
              {t.workspaceSlogan}
            </span>
            <h2 className="text-xl md:text-2xl font-display font-bold mt-2">
              {isRTL ? workspaceConfig.workspaceNameAr : workspaceConfig.workspaceNameEn}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {isRTL 
                ? 'مرحباً بك مجدداً. تم تحديث لوحة التحكم وصلاحيات الوصول والروابط والخط الزمني للإجراءات بالكامل طبقاً لتعريفات بيئة عملك المخصصة.'
                : 'Welcome back. Access privileges, sidebars, dashboard analytics widgets, and action scopes are dynamically configured for your corporate profile.'}
            </p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur border border-slate-700/30 p-3.5 rounded-lg flex items-center gap-3 self-start md:self-auto">
            <Gauge className="w-8 h-8 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wide">{isRTL ? 'مؤشر الحوكمة الكلي' : 'Overall Health Index'}</span>
              <span className="text-base font-bold text-white">98.2% {isRTL ? 'ممتاز' : 'Optimal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert Toast */}
      {executedAlert && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 text-white p-1 rounded-full">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isRTL ? 'تم تفعيل إجراء العمل بنجاح!' : 'Operational Action Initiated Successfully!'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isRTL ? `تم تشغيل: ${translateText(executedAlert.name)} في سجل التدقيق` : `Executed command: ${executedAlert.name} inside SaaS audit database`}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-400">{executedAlert.time}</span>
        </div>
      )}

      {/* 1. Dynamic Metric Widgets (Workspaces Specific) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workspaceConfig.widgets.map((widget, index) => {
          const WidgetIcon = widget.icon;
          return (
            <div
              key={index}
              id={`widget-${index}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between min-h-[145px]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {translateText(widget.title)}
                </span>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <WidgetIcon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                  {widget.value}
                </span>
                {widget.change && (
                  <span className={`text-[10px] font-bold block mt-1.5 flex items-center gap-1 ${
                    widget.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : widget.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                  }`}>
                    {widget.trend === 'up' ? '↑' : widget.trend === 'down' ? '↓' : '•'} {widget.change}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-slate-100 dark:bg-slate-800 h-1">
                <div 
                  className={`h-1 transition-all duration-500 ${
                    widget.trend === 'up' ? 'bg-emerald-500' : widget.trend === 'down' ? 'bg-red-500' : 'bg-slate-400'
                  }`} 
                  style={{ width: index === 0 ? '80%' : index === 1 ? '65%' : index === 2 ? '40%' : '90%' }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Trend Card (span 2) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">{t.trendTitle}</h3>
                <p className="text-xs text-slate-400">{t.trendDesc}</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded">
                100% {isRTL ? 'نشط' : 'SYSTEM OK'}
              </span>
            </div>

            {/* SVG Line Graph */}
            <div className="h-56 w-full relative pt-2">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" className="dark:stroke-slate-800" />

                <path
                  d="M 10,170 L 100,150 L 200,120 L 300,130 L 400,60 L 490,40 L 490,200 L 10,200 Z"
                  fill="url(#gradient-emerald)"
                  opacity="0.12"
                />

                <path
                  d="M 10,170 L 100,150 L 200,120 L 300,130 L 400,60 L 490,40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <circle cx="10" cy="170" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="100" cy="150" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="200" cy="120" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="300" cy="130" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="400" cy="60" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="490" cy="40" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

                <defs>
                  <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-2">
                <span>{isRTL ? 'الربع الأول' : 'Q1 Jan'}</span>
                <span>{isRTL ? 'الربع الثاني' : 'Q2 Apr'}</span>
                <span>{isRTL ? 'الربع الثالث' : 'Q3 Jul'}</span>
                <span>{isRTL ? 'الربع الرابع' : 'Q4 Oct'}</span>
                <span>{isRTL ? 'المستهدف الكلي' : 'Target Target'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Quick Actions Bento Box (span 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
              {t.quickActionsTitle}
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              {t.quickActionsDesc}
            </p>

            <div className="space-y-2.5">
              {workspaceConfig.quickActions.map((action, index) => (
                <button
                  key={action.actionId}
                  onClick={() => handleActionClick(action.actionId, action.name)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 hover:border-emerald-200 dark:hover:border-emerald-900/60 transition group flex items-start gap-2.5"
                  style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
                >
                  <div className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 p-1 rounded text-[10px] font-bold font-mono shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center gap-1">
                      {translateText(action.name)}
                    </h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {translateText(action.description)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Alerts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workspace Active Alerts (span 1) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base mb-4">{t.activeAlerts}</h3>
            
            <div className="space-y-3">
              {workspaceConfig.notifications.map((not, idx) => (
                <div key={idx} className="border-b border-slate-50 dark:border-slate-800/60 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      not.type === 'warning' ? 'bg-red-500' : not.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{translateText(not.title)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-4">
                    {translateText(not.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-lg p-3.5 mt-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.sandboxStatus}</h4>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{t.sandboxDesc}</p>
            </div>
          </div>
        </div>

        {/* Recent Audit Trails (span 2) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">{t.recentActivity}</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">{t.viewAll}</span>
          </div>

          <div className="space-y-3.5">
            {activityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-3.5 border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-none last:pb-0">
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-300 shrink-0">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0" style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.userName}</p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">{new Date(log.timestamp).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{log.details}</p>
                  <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mt-1 uppercase">
                    {log.userRole.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
