import {
  Shield,
  BookOpen,
  Sliders,
  Database,
  Cpu,
  FileText,
  Award,
  Activity,
  Settings,
  Users,
  LogOut,
  Globe,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Building,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal,
  Scale,
  ClipboardList,
  Zap,
  ShoppingBag,
  Menu,
  X,
  Lock,
  History,
  HeartPulse,
  Network,
  Link,
  CheckSquare,
  BarChart3,
  HelpCircle,
  FileCheck,
  FolderOpen,
  Calendar,
  ArrowLeftRight,
  TrendingUp,
  Gauge,
  AlertOctagon,
  LineChart,
  Play,
  LayoutGrid,
  Key,
  CreditCard,
  MessageSquare,
  Briefcase,
  RefreshCw,
  Download,
  Mail
} from 'lucide-react';
import { UserRole } from './types';

export interface MenuItem {
  name: string;
  icon: any;
  id: string;
}

export interface QuickAction {
  name: string;
  actionId: string;
  description: string;
}

export interface MetricWidget {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  icon: any;
}

export interface WorkspaceConfig {
  role: UserRole;
  workspaceNameEn: string;
  workspaceNameAr: string;
  menus: MenuItem[];
  searchPlaceholderEn: string;
  searchPlaceholderAr: string;
  searchScope: string[];
  quickActions: QuickAction[];
  widgets: MetricWidget[];
  notifications: { title: string; desc: string; type: 'info' | 'warning' | 'success' }[];
}

export const WORKSPACES: Record<UserRole, WorkspaceConfig> = {
  'SUPER ADMIN': {
    role: 'SUPER ADMIN',
    workspaceNameEn: 'Platform Administration Workspace',
    workspaceNameAr: 'بوابة الإشراف العام والتحكم',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'admin-dashboard' },
      { name: 'Customer Lifecycle', icon: RefreshCw, id: 'admin-clsd' },
      { name: 'Organizations', icon: Building, id: 'admin-orgs' },
      { name: 'Users', icon: Users, id: 'admin-users' },
      { name: 'Roles', icon: Award, id: 'admin-roles' },
      { name: 'Subscriptions', icon: CreditCard, id: 'admin-subs' },
      { name: 'Marketplace', icon: ShoppingBag, id: 'admin-market' },
      { name: 'API Management', icon: Database, id: 'admin-api' },
      { name: 'Developer Portal', icon: Terminal, id: 'admin-dev' },
      { name: 'Security', icon: Lock, id: 'admin-security' },
      { name: 'Audit Logs', icon: History, id: 'admin-logs' },
      { name: 'Monitoring', icon: Activity, id: 'admin-monitoring' },
      { name: 'System Health', icon: HeartPulse, id: 'admin-health' },
      { name: 'ICAP Readiness', icon: Zap, id: 'admin-readiness' },
      { name: 'Settings', icon: Settings, id: 'admin-settings' }
    ],
    searchPlaceholderEn: 'Search tenants, logs, system configurations...',
    searchPlaceholderAr: 'البحث في المستأجرين، السجلات، وتفضيلات النظام...',
    searchScope: ['organizations', 'activity-logs', 'global-standards', 'subscriptions'],
    quickActions: [
      { name: 'Register New Tenant', actionId: 'register-tenant', description: 'Provision a new organization isolated database partition.' },
      { name: 'Trigger Global Backup', actionId: 'trigger-backup', description: 'Snapshot database across all cloud availability regions.' },
      { name: 'Review Pending Subscriptions', actionId: 'review-subs', description: 'Manually approve enterprise custom-tiered subscription requests.' },
      { name: 'API Diagnostics Run', actionId: 'api-run', description: 'Check latency and health across endpoints and gRPC ports.' }
    ],
    widgets: [
      { title: 'Total Active Tenants', value: '412', change: '+18 this month', trend: 'up', icon: Building },
      { title: 'System API Request Volume', value: '2.4M', change: 'Avg latency: 24ms', trend: 'neutral', icon: Database },
      { title: 'Cluster CPU Util', value: '34.2%', change: 'Healthy', trend: 'down', icon: Cpu },
      { title: 'Global License Revenue', value: '$1.8M', change: '+12% Q/Q', trend: 'up', icon: BarChart3 }
    ],
    notifications: [
      { title: 'Critical API Overload Prevented', desc: 'SaaS rate-limiter blocked sudden traffic burst on Tenant-Noor', type: 'warning' },
      { title: 'Cluster Upgrade Succeeded', desc: 'V3.2.1 successfully deployed across all region instances', type: 'success' },
      { title: 'New Organization Verified', desc: 'Dar Al-Rayan completed Sharia-board registration checks', type: 'info' }
    ]
  },
  'ORGANIZATION ADMIN': {
    role: 'ORGANIZATION ADMIN',
    workspaceNameEn: 'Organization Workspace',
    workspaceNameAr: 'بوابة إدارة حوكمة المؤسسة',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'org-dashboard' },
      { name: 'Customer Lifecycle', icon: RefreshCw, id: 'org-clsd' },
      { name: 'My Organization', icon: Building, id: 'org-my-org' },
      { name: 'Departments', icon: Network, id: 'org-depts' },
      { name: 'Users', icon: Users, id: 'org-users' },
      { name: 'ERP Connections', icon: Link, id: 'org-erp' },
      { name: 'Compliance Reviews', icon: CheckSquare, id: 'org-reviews' },
      { name: 'Reports', icon: BarChart3, id: 'org-reports' },
      { name: 'Certificates', icon: Award, id: 'org-certificates' },
      { name: 'Documents', icon: FileText, id: 'org-docs' },
      { name: 'Billing', icon: CreditCard, id: 'org-billing' },
      { name: 'Support', icon: HelpCircle, id: 'org-support' },
      { name: 'Settings', icon: Settings, id: 'org-settings' }
    ],
    searchPlaceholderEn: 'Search internal departments, local users, ERP records...',
    searchPlaceholderAr: 'البحث في الأقسام، الموظفين، سجلات الأنظمة المرتبطة...',
    searchScope: ['users', 'policies', 'sops', 'certificates'],
    quickActions: [
      { name: 'Add Workspace Employee', actionId: 'invite-user', description: 'Create and issue safe authorization credentials.' },
      { name: 'Establish ERP Connector', actionId: 'connect-erp', description: 'Sync ledger databases via secure REST APIs.' },
      { name: 'Draft Custom Rule', actionId: 'create-rule', description: 'Create logical screening rules for active contracts.' },
      { name: 'Download Compliance Dossier', actionId: 'get-dossier', description: 'Export full PDF reporting to corporate stakeholders.' }
    ],
    widgets: [
      { title: 'Enterprise Members', value: '382', change: '8 departments', trend: 'neutral', icon: Users },
      { title: 'ERP Feeds Screened', value: '184,300', change: '100% synchronized', trend: 'up', icon: Link },
      { title: 'Open Compliance Tasks', value: '4', change: 'Due in 5 days', trend: 'down', icon: CheckSquare },
      { title: 'Current Billing Tier', value: 'Enterprise Plus', change: 'Next renewal: Nov 2026', trend: 'neutral', icon: Shield }
    ],
    notifications: [
      { title: 'ERP Data Sync Completed', desc: '14,520 journal ledger items screened for interest flags', type: 'success' },
      { title: 'New Employee Registered', desc: 'Ahmed Al-Mansoori added under Corporate Operations', type: 'info' },
      { title: 'Certificate Renewal Reminder', desc: 'Al-Noor retail sharia compliance seal expires in 15 days', type: 'warning' }
    ]
  },
  'SHARIA REVIEWER': {
    role: 'SHARIA REVIEWER',
    workspaceNameEn: 'Sharia Review Workspace',
    workspaceNameAr: 'بوابة التدقيق والمستندات الشرعية',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'sharia-dashboard' },
      { name: 'Assigned Reviews', icon: ClipboardList, id: 'sharia-reviews' },
      { name: 'Evidence', icon: FolderOpen, id: 'sharia-evidence' },
      { name: 'Findings', icon: AlertTriangle, id: 'sharia-findings' },
      { name: 'Standards', icon: BookOpen, id: 'sharia-standards' },
      { name: 'Fatwas', icon: Scale, id: 'sharia-fatwas' },
      { name: 'Approvals', icon: FileCheck, id: 'sharia-approvals' },
      { name: 'Certificates', icon: Award, id: 'sharia-certs' },
      { name: 'Reports', icon: FileText, id: 'sharia-reports' },
      { name: 'Notifications', icon: Bell, id: 'sharia-notifs' }
    ],
    searchPlaceholderEn: 'Search AAOIFI standards, active fatwas, review assignments...',
    searchPlaceholderAr: 'البحث في معايير أيوفي، الفتاوى الصادرة، ملفات المراجعة...',
    searchScope: ['standards', 'fatwas', 'documents', 'findings'],
    quickActions: [
      { name: 'Lodge Digital Fatwa', actionId: 'lodge-fatwa', description: 'Publish Sharia Supervisory Board ruling on complex transactions.' },
      { name: 'Evaluate Audit Evidence', actionId: 'check-evidence', description: 'Perform text analysis on contracts submitted.' },
      { name: 'Sign Compliance Seal', actionId: 'issue-cert', description: 'Electronically sign AAOIFI compatibility certificates.' },
      { name: 'Flag Non-Compliant Flow', actionId: 'flag-interest', description: 'Identify and quarantine riba-based transaction flows.' }
    ],
    widgets: [
      { title: 'Assigned Reviews', value: '18', change: '4 pending review', trend: 'up', icon: ClipboardList },
      { title: 'Evidence Files Checked', value: '142', change: '8 uploaded today', trend: 'neutral', icon: FolderOpen },
      { title: 'Active Sharia Rulings', value: '84', change: 'All signed electronically', trend: 'neutral', icon: Scale },
      { title: 'Board Certification Score', value: '100%', change: 'Perfect alignment', trend: 'up', icon: Award }
    ],
    notifications: [
      { title: 'New Review Assigned', desc: 'AAOIFI assessment required for Murabaha home contract draft', type: 'info' },
      { title: 'Fatwa Draft Saved', desc: 'Ruling on treasury liquidity structures is ready for co-signatures', type: 'success' },
      { title: 'Quarantine Flag Issued', desc: 'Delayed delivery charges under contract #831 flagged for board review', type: 'warning' }
    ]
  },
  'AUDITOR': {
    role: 'AUDITOR',
    workspaceNameEn: 'Audit Workspace',
    workspaceNameAr: 'بوابة التدقيق والرقابة الذكية',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'audit-dashboard' },
      { name: 'Audit Engagements', icon: ClipboardList, id: 'audit-engagements' },
      { name: 'Working Papers', icon: FileText, id: 'audit-papers' },
      { name: 'Evidence', icon: FolderOpen, id: 'audit-evidence' },
      { name: 'Findings', icon: AlertTriangle, id: 'audit-findings' },
      { name: 'Corrective Actions', icon: CheckSquare, id: 'audit-actions' },
      { name: 'Reports', icon: BarChart3, id: 'audit-reports' },
      { name: 'Calendar', icon: Calendar, id: 'audit-calendar' }
    ],
    searchPlaceholderEn: 'Search audit engagements, working papers, corrective actions...',
    searchPlaceholderAr: 'البحث في مهام التدقيق، أوراق العمل، والإجراءات التصحيحية...',
    searchScope: ['documents', 'findings', 'standards'],
    quickActions: [
      { name: 'Start New Engagement', actionId: 'new-engagement', description: 'Initiate a scheduled regulatory compliance audit cycle.' },
      { name: 'Commit Working Paper', actionId: 'add-paper', description: 'Upload spreadsheets and reference documents.' },
      { name: 'Log Corrective Plan', actionId: 'add-action', description: 'Assign remediation timelines to business departments.' },
      { name: 'Synthesize Auditor Verdict', actionId: 'audit-verdict', description: 'Use LLM engine to extract summaries for the board.' }
    ],
    widgets: [
      { title: 'Active Engagements', value: '6', change: '2 ongoing', trend: 'up', icon: ClipboardList },
      { title: 'Working Papers Filed', value: '54', change: '100% structured', trend: 'neutral', icon: FileText },
      { title: 'Remediation Plans', value: '12', change: '8 fully completed', trend: 'down', icon: CheckSquare },
      { title: 'Audit Readiness Index', value: '98.4%', change: 'Excellent posture', trend: 'up', icon: Award }
    ],
    notifications: [
      { title: 'Engagements Initialed', desc: 'Official audit notice dispatched to Asset Management dept', type: 'info' },
      { title: 'Corrective Plan Overdue', desc: 'Interest calculation fix for retail loans has passed the 30-day window', type: 'warning' },
      { title: 'Working Paper Signed Off', desc: 'Liquidity ratios assessment approved by Senior Auditor Johnathan', type: 'success' }
    ]
  },
  'COMPLIANCE OFFICER': {
    role: 'COMPLIANCE OFFICER',
    workspaceNameEn: 'Compliance Workspace',
    workspaceNameAr: 'مركز متابعة الامتثال التشغيلي',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'comp-dashboard' },
      { name: 'Compliance Reviews', icon: CheckSquare, id: 'comp-reviews' },
      { name: 'Documents', icon: FileText, id: 'comp-docs' },
      { name: 'Transactions', icon: ArrowLeftRight, id: 'comp-transactions' },
      { name: 'Monitoring', icon: Activity, id: 'comp-monitoring' },
      { name: 'Findings', icon: AlertTriangle, id: 'comp-findings' },
      { name: 'Reports', icon: BarChart3, id: 'comp-reports' },
      { name: 'Certificates', icon: Award, id: 'comp-certs' }
    ],
    searchPlaceholderEn: 'Search transaction logs, compliance reviews, custom operating procedures...',
    searchPlaceholderAr: 'البحث في العمليات، تقارير المطابقة والمطابقة التشغيلية...',
    searchScope: ['documents', 'policies', 'sops', 'findings'],
    quickActions: [
      { name: 'Execute Screening', actionId: 'screen-tx', description: 'Scan real-time cash flow and contracts using compliance rules.' },
      { name: 'Index New Regulation', actionId: 'upload-doc', description: 'Incorporate new regulatory guidelines into Knowledge Center.' },
      { name: 'Initiate Self-Review', actionId: 'new-review', description: 'Execute step-by-step verification on specific operations.' },
      { name: 'Run AI Reasoning Audit', actionId: 'ai-reason', description: 'Use semantic analysis to extract logic constraints.' }
    ],
    widgets: [
      { title: 'Self-Reviews Run', value: '42', change: '2 in progress', trend: 'up', icon: CheckSquare },
      { title: 'Transactions Screened', value: '1,490', change: 'Last 24 hours', trend: 'up', icon: ArrowLeftRight },
      { title: 'Critical Warnings', value: '3', change: 'Quarantined successfully', trend: 'down', icon: AlertTriangle },
      { title: 'Total Documents Indexed', value: '24', change: 'Fully vectorized', trend: 'neutral', icon: FileText }
    ],
    notifications: [
      { title: 'Compliance Rule Violation', desc: 'Transaction ID #92348 contained unapproved late fee clause', type: 'warning' },
      { title: 'Sharia Seal Issued', desc: 'AAOIFI Certification signed off for Retail Murabaha product', type: 'success' },
      { title: 'New Guideline Vectorized', desc: 'AAOIFI Standard No. 49 successfully mapped into semantic engine', type: 'info' }
    ]
  },
  'EXECUTIVE USER': {
    role: 'EXECUTIVE USER',
    workspaceNameEn: 'Executive Workspace',
    workspaceNameAr: 'لوحة القيادة والمؤشرات التنفيذية',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'exec-dashboard' },
      { name: 'Customer Lifecycle', icon: RefreshCw, id: 'exec-clsd' },
      { name: 'Executive Reports', icon: FileText, id: 'exec-reports' },
      { name: 'KPIs', icon: TrendingUp, id: 'exec-kpis' },
      { name: 'Compliance Score', icon: Gauge, id: 'exec-score' },
      { name: 'Risk Overview', icon: AlertOctagon, id: 'exec-risk' },
      { name: 'Certificates', icon: Award, id: 'exec-certs' },
      { name: 'Trends', icon: LineChart, id: 'exec-trends' }
    ],
    searchPlaceholderEn: 'Search high-level executive reports, core KPIs, risk matrices...',
    searchPlaceholderAr: 'البحث في التقارير التنفيذية، مؤشرات الأداء، سجل المخاطر...',
    searchScope: ['certificates', 'activity-logs'],
    quickActions: [
      { name: 'Generate Board Report', actionId: 'board-report', description: 'Draft summary dossier explaining current Sharia compliance posture.' },
      { name: 'View Risk Heatmap', actionId: 'risk-heatmap', description: 'Inspect potential liability across various assets.' },
      { name: 'Examine Yield Purification', actionId: 'purify-check', description: 'Audit funds marked for charitable donation.' },
      { name: 'Verify Active Signatures', actionId: 'sig-check', description: 'Review valid digital board approvals.' }
    ],
    widgets: [
      { title: 'Overall Score', value: '95%', change: '+1.4% vs last month', trend: 'up', icon: Gauge },
      { title: 'Purification Yield Hold', value: '$124.5K', change: 'Awaiting charity allocation', trend: 'neutral', icon: BarChart3 },
      { title: 'Active Board Sign-Offs', value: '14', change: '100% digital trace', trend: 'up', icon: Award },
      { title: 'Remediation Rate', value: '94%', change: 'Highly responsive', trend: 'up', icon: TrendingUp }
    ],
    notifications: [
      { title: 'Monthly Posture Index Ready', desc: 'Governance board dossier for July 2026 is fully compiled', type: 'success' },
      { title: 'Risk Reduction Logged', desc: 'Liquidity risk category decreased by 5.4% following ERP rule updates', type: 'info' },
      { title: 'Purification Threshold Exceeded', desc: 'Incidental interest earnings of $14k placed in isolation escrow', type: 'warning' }
    ]
  },
  'PARTNER': {
    role: 'PARTNER',
    workspaceNameEn: 'Partner Workspace',
    workspaceNameAr: 'بوابة الشركاء الاستراتيجيين',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'partner-dashboard' },
      { name: 'Customers', icon: Users, id: 'partner-customers' },
      { name: 'Projects', icon: LayoutGrid, id: 'partner-projects' },
      { name: 'Revenue', icon: BarChart3, id: 'partner-revenue' },
      { name: 'Commissions', icon: Award, id: 'partner-commissions' },
      { name: 'Marketplace', icon: ShoppingBag, id: 'partner-market' }
    ],
    searchPlaceholderEn: 'Search customers, projects, active integration accounts...',
    searchPlaceholderAr: 'البحث في الحسابات، مشاريع التكامل والربط الجارية...',
    searchScope: ['organizations'],
    quickActions: [
      { name: 'Register Referral Lead', actionId: 'add-customer', description: 'Submit details of new enterprise client for onboarding.' },
      { name: 'Initiate Partner Project', actionId: 'new-project', description: 'Spawn collaborative compliance workspace with clients.' },
      { name: 'Publish Solutions Listing', actionId: 'list-marketplace', description: 'Upload tailored workflow template to ICAP marketplace.' },
      { name: 'Export Earnings Summary', actionId: 'export-earnings', description: 'Get verified breakdown of revenue and commission logs.' }
    ],
    widgets: [
      { title: 'Onboarded Customers', value: '24', change: '+3 this quarter', trend: 'up', icon: Users },
      { title: 'Active Projects', value: '8', change: 'All phases on schedule', trend: 'neutral', icon: LayoutGrid },
      { title: 'Monthly Revenue Share', value: '$45,200', change: '+8% vs last month', trend: 'up', icon: BarChart3 },
      { title: 'Accrued Commission', value: '$8,400', change: 'Next payout: August 1st', trend: 'neutral', icon: Award }
    ],
    notifications: [
      { title: 'Client Successfully Onboarded', desc: 'Rayan Banking Group completed payment and tenant deployment', type: 'success' },
      { title: 'Listing Approved', desc: 'Your AAOIFI screening plugin is now live on ICAP Marketplace', type: 'success' },
      { title: 'Project Milestone Reached', desc: 'Al-Baraka retail integration successfully completed Phase 2 testing', type: 'info' }
    ]
  },
  'DEVELOPER': {
    role: 'DEVELOPER',
    workspaceNameEn: 'Developer Workspace',
    workspaceNameAr: 'بوابة التطوير والربط البرمجي',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'dev-dashboard' },
      { name: 'Developer Portal', icon: Terminal, id: 'dev-portal' },
      { name: 'SDK', icon: Play, id: 'dev-sdk' },
      { name: 'API Keys', icon: Key, id: 'dev-keys' },
      { name: 'Applications', icon: LayoutGrid, id: 'dev-apps' },
      { name: 'Marketplace', icon: ShoppingBag, id: 'dev-market' },
      { name: 'Analytics', icon: LineChart, id: 'dev-analytics' },
      { name: 'Documentation', icon: BookOpen, id: 'dev-docs' }
    ],
    searchPlaceholderEn: 'Search API keys, developer guides, SDK endpoints, applications...',
    searchPlaceholderAr: 'البحث في مفاتيح الربط البرمجي، التوثيق، وحزم برمجيات SDK...',
    searchScope: ['activity-logs'],
    quickActions: [
      { name: 'Provision API Key', actionId: 'generate-key', description: 'Generate standard bearer tokens for ERP ledger hooks.' },
      { name: 'Register Sandbox App', actionId: 'create-app', description: 'Create logical container to mock API request loads.' },
      { name: 'Download SDK Package', actionId: 'download-sdk', description: 'Obtain modern TypeScript integration package.' },
      { name: 'View API Call Logs', actionId: 'api-logs', description: 'Stream system response codes and transaction latency.' }
    ],
    widgets: [
      { title: 'API Calls (24h)', value: '34,800', change: 'Avg success: 99.98%', trend: 'neutral', icon: Terminal },
      { title: 'Active API Keys', value: '4', change: 'Last rotated: 2 days ago', trend: 'neutral', icon: Key },
      { title: 'Connected Apps', value: '3', change: 'Sandbox & Prod envs', trend: 'up', icon: LayoutGrid },
      { title: 'API Network Bandwidth', value: '124 ms', change: 'Optimal latency posture', trend: 'down', icon: Activity }
    ],
    notifications: [
      { title: 'API Key Created', desc: 'Key dev_noor_live_9a8 created by developer@icap-demo.com', type: 'success' },
      { title: 'OAuth Flow Handshake', desc: 'ERP production client completed standard auth token exchange', type: 'success' },
      { title: 'Sandbox Rate Warning', desc: 'Rate-limit warning: sandbox app exceeded 50 requests/sec limit', type: 'warning' }
    ]
  },
  'EMPLOYEE': {
    role: 'EMPLOYEE',
    workspaceNameEn: 'Employee Workspace',
    workspaceNameAr: 'بوابة الموظف للامتثال',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'emp-dashboard' },
      { name: 'Documents', icon: FileText, id: 'emp-docs' },
      { name: 'Settings', icon: Settings, id: 'emp-settings' }
    ],
    searchPlaceholderEn: 'Search guidelines, employee policy manuals...',
    searchPlaceholderAr: 'البحث في لوائح وسياسات العمل...',
    searchScope: ['documents', 'policies'],
    quickActions: [
      { name: 'Acknowledge Guidelines', actionId: 'ack-guide', description: 'Digitally record compliance posture guidelines understanding.' },
      { name: 'Submit Evidence Document', actionId: 'upload-doc', description: 'Incorporate reference contracts for screening.' }
    ],
    widgets: [
      { title: 'Policy Acknowledgements', value: '12 / 12', change: '100% compliant', trend: 'up', icon: CheckSquare },
      { title: 'Documents Submitted', value: '4', change: 'All approved', trend: 'neutral', icon: FileText }
    ],
    notifications: [
      { title: 'Annual Policy Ready', desc: 'Please review and acknowledge standard ethical guidelines document', type: 'info' }
    ]
  },
  'CUSTOMER SUCCESS MANAGER': {
    role: 'CUSTOMER SUCCESS MANAGER',
    workspaceNameEn: 'Customer Success Workspace',
    workspaceNameAr: 'بوابة إدارة علاقات ونجاح العملاء',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'csm-dashboard' },
      { name: 'Customers', icon: Users, id: 'csm-customers' },
      { name: 'Renewals', icon: RefreshCw, id: 'csm-renewals' },
      { name: 'Health Checks', icon: HeartPulse, id: 'csm-health' },
      { name: 'Satisfaction', icon: Award, id: 'csm-nps' },
      { name: 'Cross-selling', icon: ShoppingBag, id: 'csm-cross' },
      { name: 'Settings', icon: Settings, id: 'csm-settings' }
    ],
    searchPlaceholderEn: 'Search customers, satisfaction records, renewal logs...',
    searchPlaceholderAr: 'البحث في قائمة العملاء، سجلات تجديد العقود ومستويات الرضا...',
    searchScope: ['organizations', 'activity-logs'],
    quickActions: [
      { name: 'Record Health Check', actionId: 'add-health-check', description: 'Log a new relationship health check and satisfaction score.' },
      { name: 'Generate Success Plan', actionId: 'create-plan', description: 'Compile Sharia continuous monitoring compliance strategy.' },
      { name: 'Log Customer Escalation', actionId: 'log-escalation', description: 'Register high-priority compliance or delivery alert.' },
      { name: 'Review Cross-sell Ideas', actionId: 'recommendations', description: 'Generate AI cross-selling recommendations based on AAOIFI gaps.' }
    ],
    widgets: [
      { title: 'Portfolio Health', value: 'Excellent', change: '85% Good or above', trend: 'up', icon: HeartPulse },
      { title: 'Average NPS Score', value: '9.2 / 10', change: '100% feedback rate', trend: 'up', icon: Award },
      { title: 'Upcoming Renewals', value: '4 accounts', change: 'Next 30 days', trend: 'neutral', icon: RefreshCw },
      { title: 'Upsell Leads Identified', value: '12 deals', change: 'Value: $240K', trend: 'up', icon: ShoppingBag }
    ],
    notifications: [
      { title: 'Subscription Expiring soon', desc: 'Al Rajhi Bank compliance advisory contract expires in 30 days', type: 'warning' },
      { title: 'Health Check Completed', desc: 'ADIB recorded Excellent health posture for Q2 screening audits', type: 'success' }
    ]
  },
  'CUSTOMER USER': {
    role: 'CUSTOMER USER',
    workspaceNameEn: 'Client Compliance Portal',
    workspaceNameAr: 'بوابة العميل للامتثال والتقارير',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'cust-dashboard' },
      { name: 'Their Company', icon: Building, id: 'cust-company' },
      { name: 'Their Projects', icon: LayoutGrid, id: 'cust-projects' },
      { name: 'Their Tasks', icon: CheckSquare, id: 'cust-tasks' },
      { name: 'Their Reports', icon: FileText, id: 'cust-reports' },
      { name: 'Their Certificates', icon: Award, id: 'cust-certs' },
      { name: 'Messages', icon: Mail, id: 'cust-msg' },
      { name: 'Downloads', icon: Download, id: 'cust-download' }
    ],
    searchPlaceholderEn: 'Search your active projects, certified documents, or open tasks...',
    searchPlaceholderAr: 'البحث في مشاريعكم النشطة، وثائقكم المعتمدة، أو المهام المفتوحة...',
    searchScope: ['documents', 'certificates'],
    quickActions: [
      { name: 'Submit Support Ticket', actionId: 'ticket-submit', description: 'Open a help ticket to our Sharia review or delivery team.' },
      { name: 'Upload Signed SLA', actionId: 'upload-signature', description: 'Securely submit final approved SOW document.' },
      { name: 'Book Sharia Consultation', actionId: 'consultation-book', description: 'Reserve live video meeting with our assigned Sharia board scholars.' },
      { name: 'Download Certificate Seal', actionId: 'get-seal', description: 'Obtain digital high-res AAOIFI compliance seal.' }
    ],
    widgets: [
      { title: 'Compliance Status', value: '96% Compliant', change: 'Fully Certified', trend: 'up', icon: Shield },
      { title: 'Active Projects', value: '2 Running', change: 'On schedule', trend: 'neutral', icon: LayoutGrid },
      { title: 'Awaiting Your Input', value: '3 Tasks', change: 'Requires document uploads', trend: 'warning' as any, icon: CheckSquare },
      { title: 'Active Certificates', value: '4 Issued', change: 'All seals up to date', trend: 'success' as any, icon: Award }
    ],
    notifications: [
      { title: 'Review Report Available', desc: 'Q2 Sharia screening audit result has been generated', type: 'info' },
      { title: 'Evidence Document Requested', desc: 'Please upload the secondary Murabaha transaction log for review', type: 'warning' }
    ]
  },
  'SALES EXECUTIVE': {
    role: 'SALES EXECUTIVE',
    workspaceNameEn: 'Sales CRM Workspace',
    workspaceNameAr: 'بوابة المبيعات وإدارة الفرص',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'sales-dashboard' },
      { name: 'Lead Management', icon: Briefcase, id: 'sales-leads' },
      { name: 'Customers', icon: Users, id: 'sales-customers' },
      { name: 'Activities', icon: History, id: 'sales-activities' },
      { name: 'Proposals', icon: FileText, id: 'sales-proposals' },
      { name: 'Contracts', icon: FileCheck, id: 'sales-contracts' },
      { name: 'Meetings', icon: Calendar, id: 'sales-meetings' },
      { name: 'Calendar', icon: Calendar, id: 'sales-cal' },
      { name: 'Settings', icon: Settings, id: 'sales-settings' }
    ],
    searchPlaceholderEn: 'Search sales leads, active proposals, pipelines...',
    searchPlaceholderAr: 'البحث في العملاء المحتملين، العروض النشطة، والفرص البيعية...',
    searchScope: ['organizations'],
    quickActions: [
      { name: 'Log New Sales Lead', actionId: 'new-lead', description: 'Enter prospect details and interest level.' },
      { name: 'Create Proposal Version', actionId: 'new-proposal', description: 'Draft technical or commercial compliance proposal.' },
      { name: 'Schedule Client Demo', actionId: 'schedule-demo', description: 'Set date for custom automated audit suite showcase.' },
      { name: 'Log Activity Report', actionId: 'log-call', description: 'Record a phone call, WhatsApp conversation, or email outcome.' }
    ],
    widgets: [
      { title: 'My CRM Lead Count', value: '150 Leads', change: '+24 this week', trend: 'up', icon: Briefcase },
      { title: 'Pipeline Net Worth', value: '$1.4M', change: 'Avg win rate: 32%', trend: 'up', icon: BarChart3 },
      { title: 'Active Opportunities', value: '40 open', change: 'Requires follow-up', trend: 'neutral', icon: Users },
      { title: 'Closed-Won This Month', value: '$180K', change: '100% target met', trend: 'up', icon: Award }
    ],
    notifications: [
      { title: 'New Web Lead Assigned', desc: 'Boubyan Bank submitted a request for Crypto screening demo', type: 'info' },
      { title: 'Proposal Approved Internally', desc: 'Meezan Bank commercial offer has been approved by VP of operations', type: 'success' }
    ]
  },
  'PROJECT MANAGER': {
    role: 'PROJECT MANAGER',
    workspaceNameEn: 'Project Delivery Workspace',
    workspaceNameAr: 'بوابة تسليم المشاريع والتشغيل',
    menus: [
      { name: 'Dashboard', icon: Shield, id: 'pm-dashboard' },
      { name: 'Projects', icon: LayoutGrid, id: 'pm-projects' },
      { name: 'Tasks', icon: CheckSquare, id: 'pm-tasks' },
      { name: 'Milestones', icon: Award, id: 'pm-milestones' },
      { name: 'Resources', icon: Users, id: 'pm-resources' },
      { name: 'Deliverables', icon: FileCheck, id: 'pm-deliverables' },
      { name: 'Customer Communication', icon: MessageSquare, id: 'pm-chat' },
      { name: 'Project Reports', icon: FileText, id: 'pm-reports' },
      { name: 'Settings', icon: Settings, id: 'pm-settings' }
    ],
    searchPlaceholderEn: 'Search delivery projects, resource capacity, milestones...',
    searchPlaceholderAr: 'البحث في المشاريع، جدول الموارد، والمهام المعلقة...',
    searchScope: ['documents'],
    quickActions: [
      { name: 'Initiate Customer Project', actionId: 'launch-project', description: 'Instantiate project delivery tasks from signed contract SOW.' },
      { name: 'Assign Delivery Resource', actionId: 'assign-resource', description: 'Allocate consultants, auditors or scholars to tasks.' },
      { name: 'Conduct Project Health Check', actionId: 'project-audit', description: 'Evaluate current status and risk rating parameters.' },
      { name: 'Trigger Closure Audit', actionId: 'close-validation', description: 'Initiate automatic checks for project deliverables.' }
    ],
    widgets: [
      { title: 'My Active Projects', value: '20 Active', change: 'All status monitored', trend: 'neutral', icon: LayoutGrid },
      { title: 'Project Deliverables', value: '300 Tasks', change: '124 completed', trend: 'up', icon: CheckSquare },
      { title: 'Milestones Achieved', value: '38 Completed', change: '4 on critical path', trend: 'up', icon: Award },
      { title: 'Resource Util Rate', value: '82.4%', change: 'Highly optimal', trend: 'up', icon: Users }
    ],
    notifications: [
      { title: 'Task Blocked Alert', desc: 'Task #102 for Al Rajhi Bank is blocked waiting customer documentation', type: 'warning' },
      { title: 'Contract SOW Signed Off', desc: 'Automatic project generation sequence initiated for KFH Corp', type: 'success' }
    ]
  }
};
