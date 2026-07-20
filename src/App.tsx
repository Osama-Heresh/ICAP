import React, { useState, useEffect, useMemo } from 'react';
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
  X
} from 'lucide-react';

import {
  DEMO_ORGANIZATION,
  DEMO_USERS,
  DEMO_STANDARDS,
  DEMO_POLICIES,
  DEMO_SOPS,
  DEMO_CUSTOM_RULES,
  DEMO_DOCUMENTS,
  DEMO_ACTIVITY_LOGS,
  DEMO_NOTIFICATIONS,
  DEMO_KNOWLEDGE_CATEGORIES,
  DEMO_KNOWLEDGE_NODES
} from './data';

import {
  Organization,
  User,
  UserRole,
  Standard,
  Policy,
  SOP,
  CustomRule,
  KnowledgeDocument,
  ActivityLog,
  Notification
} from './types';

import { WORKSPACES } from './workspaces';

// Modular Sub Views
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import ComplianceConfigView from './components/ComplianceConfigView';
import KnowledgeCenterView from './components/KnowledgeCenterView';
import OtherViews from './components/OtherViews';
import DeveloperPortalView from './components/DeveloperPortalView';
import AiComplianceEngineView from './components/AiComplianceEngineView';
import AiReasoningCenterView from './components/AiReasoningCenterView';
import MonitoringCenterView from './components/MonitoringCenterView';
import ReportingCenterView from './components/ReportingCenterView';
import CertificationCenterView from './components/CertificationCenterView';
import AuditCenterView from './components/AuditCenterView';
import AdministrationView from './components/AdministrationView';
import ProductionReadinessView from './components/ProductionReadinessView';
import IndustryMarketplaceView from './components/IndustryMarketplaceView';
import GlobalComplianceCenterView from './components/GlobalComplianceCenterView';
import MarketplaceView from './components/MarketplaceView';
import EnterprisePortalView from './components/EnterprisePortalView';
import CustomerLifecycleView from './components/CustomerLifecycleView';
import IKRView from './components/IKRView';

export default function App() {
  // Helper for safe localStorage parsing (Requirement: prevent blank screens due to malformed storage)
  const getStoredItem = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;
      return JSON.parse(stored) as T;
    } catch (e) {
      console.warn(`Error parsing localStorage key "${key}":`, e);
      return fallback;
    }
  };

  // Global SaaS States (Initialized from localStorage if present, fallback to demo data)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: UserRole; name: string; jobTitle: string } | null>(() => {
    return getStoredItem<{ email: string; role: UserRole; name: string; jobTitle: string } | null>('icap_user', null);
  });

  const [currentOrg, setCurrentOrg] = useState<Organization>(() => {
    return getStoredItem<Organization>('icap_org', DEMO_ORGANIZATION);
  });

  const [locale, setLocale] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('icap_locale') as 'en' | 'ar') || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('icap_theme') as 'light' | 'dark') || 'light';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('icap_active_tab') || 'Dashboard';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database simulated tables in states
  const [standards, setStandards] = useState<Standard[]>(() => {
    return getStoredItem<Standard[]>('icap_standards', DEMO_STANDARDS);
  });

  const [policies, setPolicies] = useState<Policy[]>(() => {
    return getStoredItem<Policy[]>('icap_policies', DEMO_POLICIES);
  });

  const [sops, setSops] = useState<SOP[]>(() => {
    return getStoredItem<SOP[]>('icap_sops', DEMO_SOPS);
  });

  const [customRules, setCustomRules] = useState<CustomRule[]>(() => {
    return getStoredItem<CustomRule[]>('icap_custom_rules', DEMO_CUSTOM_RULES);
  });

  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => {
    return getStoredItem<KnowledgeDocument[]>('icap_documents', DEMO_DOCUMENTS);
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    return getStoredItem<User[]>('icap_users_list', DEMO_USERS);
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    return getStoredItem<ActivityLog[]>('icap_activity_logs', DEMO_ACTIVITY_LOGS);
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return getStoredItem<Notification[]>('icap_notifications', DEMO_NOTIFICATIONS);
  });

  // Dropdown states
  const [showOrgSelect, setShowOrgSelect] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Synchronize localStorage with states
  useEffect(() => {
    localStorage.setItem('icap_standards', JSON.stringify(standards));
  }, [standards]);

  useEffect(() => {
    localStorage.setItem('icap_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('icap_sops', JSON.stringify(sops));
  }, [sops]);

  useEffect(() => {
    localStorage.setItem('icap_custom_rules', JSON.stringify(customRules));
  }, [customRules]);

  useEffect(() => {
    localStorage.setItem('icap_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('icap_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('icap_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('icap_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('icap_locale', locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem('icap_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('icap_active_tab', activeTab);
  }, [activeTab]);

  // Synchronize activeTab and enforce authorization route-level
  useEffect(() => {
    if (currentUser) {
      const config = WORKSPACES[currentUser.role];
      if (config) {
        const allowedTabs = [
          ...config.menus.map((m) => m.name),
          'Knowledge Repository'
        ];
        if (!allowedTabs.includes(activeTab)) {
          setActiveTab('Dashboard');
        }
      }
    }
  }, [currentUser, activeTab]);

  // Scroll to top on activeTab or currentUser change to prevent "blank screen" scroll issues
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, [activeTab, currentUser]);

  const handleLogin = (user: { email: string; role: UserRole; name: string; jobTitle: string }) => {
    setCurrentUser(user);
    localStorage.setItem('icap_user', JSON.stringify(user));
    setActiveTab('Dashboard');

    // Audit login trail
    const newLog: ActivityLog = {
      id: `log-login-${Date.now()}`,
      organizationId: currentOrg.id,
      userId: user.email,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      timestamp: new Date().toISOString(),
      details: `${user.name} logged in securely to SaaS tenant ${currentOrg.name}`
    };

    // Load workspace specific notifications
    const config = WORKSPACES[user.role];
    const wsNotifs = config?.notifications.map((n, idx) => ({
      id: `not-ws-${Date.now()}-${idx}`,
      organizationId: currentOrg.id,
      title: n.title,
      message: n.desc,
      status: 'Unread' as const,
      createdAt: new Date(Date.now() - idx * 3600000).toISOString()
    })) || [];

    setNotifications([...wsNotifs, ...DEMO_NOTIFICATIONS]);
    setActivityLogs([newLog, ...activityLogs]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('icap_user');
  };

  // State manipulation handlers
  const handleAddStandard = (std: Standard) => {
    setStandards([std, ...standards]);
    triggerActivityLog('CREATE_STANDARD', `Created compliance standard: "${std.name}"`);
  };

  const handleAddPolicy = (pol: Policy) => {
    setPolicies([pol, ...policies]);
    triggerActivityLog('CREATE_POLICY', `Drafted internal policy guidelines: "${pol.name}"`);
  };

  const handleAddSOP = (newSop: SOP) => {
    setSops([newSop, ...sops]);
    triggerActivityLog('CREATE_SOP', `Structured custom operating procedure: "${newSop.name}"`);
  };

  const handleAddRule = (rule: CustomRule) => {
    setCustomRules([rule, ...customRules]);
    triggerActivityLog('CREATE_RULE', `Configured custom compliance check rule: "${rule.name}"`);
  };

  const handleAddDocument = (doc: KnowledgeDocument) => {
    setDocuments([doc, ...documents]);
    triggerActivityLog('UPLOAD_DOCUMENT', `Uploaded new reference document: "${doc.name}"`);
  };

  const handleUpdateDocStatus = (docId: string, status: any, procStatus: any) => {
    setDocuments((prevDocs) =>
      prevDocs.map((d) => (d.id === docId ? { ...d, status, processingStatus: procStatus } : d))
    );
  };

  const handleAddUser = (user: User) => {
    setUsersList([user, ...usersList]);
    triggerActivityLog('INVITE_USER', `Invited new compliance officer: "${user.name}"`);
  };

  const triggerActivityLog = (action: string, details: string) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      organizationId: currentOrg.id,
      userId: currentUser.email,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs([newLog, ...activityLogs]);

    const newNot: Notification = {
      id: `not-${Date.now()}`,
      organizationId: currentOrg.id,
      title: action.replace('_', ' '),
      message: details,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    setNotifications([newNot, ...notifications]);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, status: 'Read' })));
  };

  const isRTL = locale === 'ar';

  // Load workspace-specific config based on role
  const workspaceConfig = currentUser ? WORKSPACES[currentUser.role] : undefined;
  const navItems = workspaceConfig ? [
    ...workspaceConfig.menus,
    { name: 'Knowledge Repository', icon: Database, id: 'ikr-database' }
  ] : [];

  // --- ROLE-BASED ACCESS CONTROL (RBAC) FOR LOGS AND NOTIFICATIONS ---
  const filteredActivityLogs = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER ADMIN' || currentUser.role === 'ORGANIZATION ADMIN' || currentUser.role === 'EXECUTIVE USER') {
      return activityLogs;
    }
    if (currentUser.role === 'CUSTOMER USER') {
      // Customer only sees logs they triggered or logs mentioning their company
      return activityLogs.filter(
        log =>
          log && (
          log.userId === currentUser.email ||
          (log.details || '').toLowerCase().includes('al rajhi') ||
          (log.details || '').toLowerCase().includes('customer') ||
          (log.details || '').toLowerCase().includes('portal') ||
          (log.details || '').toLowerCase().includes('sheikh ahmed')
          )
      );
    }
    if (currentUser.role === 'PROJECT MANAGER') {
      // PM sees project, SOP, task, and timesheet logs, plus their own logs
      return activityLogs.filter(
        log =>
          log && (
          log.userId === currentUser.email ||
          (log.userName || '').toLowerCase().includes('hani') ||
          (log.details || '').toLowerCase().includes('project') ||
          (log.details || '').toLowerCase().includes('task') ||
          (log.details || '').toLowerCase().includes('sop') ||
          (log.details || '').toLowerCase().includes('timesheet')
          )
      );
    }
    if (currentUser.role === 'SALES EXECUTIVE') {
      // Sales executive sees lead, proposal, contract, and sales logs, plus their own
      return activityLogs.filter(
        log =>
          log && (
          log.userId === currentUser.email ||
          (log.userName || '').toLowerCase().includes('layla') ||
          (log.details || '').toLowerCase().includes('lead') ||
          (log.details || '').toLowerCase().includes('proposal') ||
          (log.details || '').toLowerCase().includes('contract') ||
          (log.details || '').toLowerCase().includes('activity')
          )
      );
    }
    if (currentUser.role === 'CUSTOMER SUCCESS MANAGER') {
      // CSM sees customer success, health, renewal, and CSM logs, plus their own
      return activityLogs.filter(
        log =>
          log && (
          log.userId === currentUser.email ||
          (log.userName || '').toLowerCase().includes('sari') ||
          (log.details || '').toLowerCase().includes('success') ||
          (log.details || '').toLowerCase().includes('health') ||
          (log.details || '').toLowerCase().includes('nps') ||
          (log.details || '').toLowerCase().includes('renewal')
          )
      );
    }
    // Default role filter
    return activityLogs.filter(log => log && (log.userId === currentUser.email || log.userRole === currentUser.role));
  }, [activityLogs, currentUser]);

  const filteredNotifications = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER ADMIN' || currentUser.role === 'ORGANIZATION ADMIN' || currentUser.role === 'EXECUTIVE USER') {
      return notifications;
    }
    if (currentUser.role === 'CUSTOMER USER') {
      return notifications.filter(
        n =>
          n && (
          (n.message || '').toLowerCase().includes('al rajhi') ||
          (n.message || '').toLowerCase().includes('customer') ||
          (n.message || '').toLowerCase().includes('portal') ||
          (n.message || '').toLowerCase().includes('sheikh ahmed') ||
          (n.title || '').toLowerCase().includes('portal') ||
          (n.title || '').toLowerCase().includes('customer')
          )
      );
    }
    if (currentUser.role === 'PROJECT MANAGER') {
      return notifications.filter(
        n =>
          n && (
          (n.message || '').toLowerCase().includes('project') ||
          (n.message || '').toLowerCase().includes('task') ||
          (n.message || '').toLowerCase().includes('sop') ||
          (n.message || '').toLowerCase().includes('timesheet') ||
          (n.message || '').toLowerCase().includes('hani') ||
          (n.title || '').toLowerCase().includes('project') ||
          (n.title || '').toLowerCase().includes('task')
          )
      );
    }
    if (currentUser.role === 'SALES EXECUTIVE') {
      return notifications.filter(
        n =>
          n && (
          (n.message || '').toLowerCase().includes('lead') ||
          (n.message || '').toLowerCase().includes('proposal') ||
          (n.message || '').toLowerCase().includes('contract') ||
          (n.message || '').toLowerCase().includes('layla') ||
          (n.title || '').toLowerCase().includes('lead') ||
          (n.title || '').toLowerCase().includes('proposal') ||
          (n.title || '').toLowerCase().includes('contract')
          )
      );
    }
    if (currentUser.role === 'CUSTOMER SUCCESS MANAGER') {
      return notifications.filter(
        n =>
          n && (
          (n.message || '').toLowerCase().includes('success') ||
          (n.message || '').toLowerCase().includes('health') ||
          (n.message || '').toLowerCase().includes('nps') ||
          (n.message || '').toLowerCase().includes('renewal') ||
          (n.message || '').toLowerCase().includes('sari') ||
          (n.title || '').toLowerCase().includes('success') ||
          (n.title || '').toLowerCase().includes('health')
          )
      );
    }
    return notifications;
  }, [notifications, currentUser]);

  // Render Login page if not authenticated
  if (!currentUser) {
    return <AuthView onLogin={handleLogin} locale={locale} />;
  }

  const translatedNavNames: Record<string, string> = {
    'Dashboard': isRTL ? 'لوحة القيادة' : 'Dashboard',
    'Global Compliance Center': isRTL ? 'مركز الامتثال العالمي للتشريعات' : 'Global Compliance Center',
    'Industry Marketplace': isRTL ? 'سوق الحلول القطاعية' : 'Industry Marketplace',
    'Marketplace': isRTL ? 'سوق المنظومة الرقمية الشامل' : 'Marketplace',
    'Enterprise Portal': isRTL ? 'بوابة الخدمات المؤسسية العالمية' : 'Enterprise Portal',
    'Organization': isRTL ? 'المؤسسة' : 'Organization',
    'Compliance Configuration': isRTL ? 'تهيئة الامتثال' : 'Compliance Configuration',
    'Knowledge Center': isRTL ? 'مركز المعرفة' : 'Knowledge Center',
    'Integrations': isRTL ? 'التكامل والربط' : 'Integrations',
    'AI Compliance Engine': isRTL ? 'محرك الامتثال الذكي' : 'AI Compliance Engine',
    'AI Reasoning Center': isRTL ? 'مركز الاستدلال والمنطق' : 'AI Reasoning Center',
    'Reporting Center': isRTL ? 'مركز التقارير والذكاء الرقابي' : 'Reporting Center',
    'Certification': isRTL ? 'الشهادات الرقمية' : 'Certification',
    'Audit Center': isRTL ? 'مركز التدقيق الذكي' : 'Audit Center',
    'Monitoring Center': isRTL ? 'مركز المراقبة والمتابعة المستمرة' : 'Monitoring Center',
    'Administration': isRTL ? 'المستخدمون والإدارة' : 'Administration',
    'Developer Portal': isRTL ? 'بوابة المطورين' : 'Developer Portal',
    'Production Readiness': isRTL ? 'جاهزية التشغيل والتحصين' : 'Production Readiness',
    'Settings': isRTL ? 'الإعدادات' : 'Settings',
    'Knowledge Repository': isRTL ? 'مستودع المعرفة الإسلامي الذكي (IKR)' : 'Knowledge Repository (IKR)',

    // Super Admin custom menus
    'Organizations': isRTL ? 'المؤسسات المسجلة' : 'Organizations',
    'Users': isRTL ? 'الموظفون والصلاحيات' : 'Users',
    'Roles': isRTL ? 'أدوار المستخدمين' : 'Roles',
    'Subscriptions': isRTL ? 'الاشتراكات الفعالة' : 'Subscriptions',
    'Security': isRTL ? 'الأمن والحماية' : 'Security',
    'Audit Logs': isRTL ? 'سجلات التدقيق الأمني' : 'Audit Logs',
    'Monitoring': isRTL ? 'متابعة أداء النظام' : 'Monitoring',
    'System Health': isRTL ? 'صحة النظام والخوادم' : 'System Health',
    'ICAP Readiness': isRTL ? 'جاهزية ICAP للتشغيل' : 'ICAP Readiness',

    // Org Admin custom menus
    'My Organization': isRTL ? 'بيانات مؤسستي' : 'My Organization',
    'Departments': isRTL ? 'الأقسام الداخلية' : 'Departments',
    'ERP Connections': isRTL ? 'قنوات ربط الموارد (ERP)' : 'ERP Connections',
    'Compliance Reviews': isRTL ? 'مراجعات الامتثال الفعالة' : 'Compliance Reviews',
    'Reports': isRTL ? 'التقارير والإحصائيات' : 'Reports',
    'Certificates': isRTL ? 'الشهادات الشرعية' : 'Certificates',
    'Documents': isRTL ? 'المستندات والوثائق' : 'Documents',
    'Billing': isRTL ? 'الفواتير والاشتراكات' : 'Billing',
    'Support': isRTL ? 'الدعم والمساعدة' : 'Support',

    // Sharia Reviewer custom menus
    'Assigned Reviews': isRTL ? 'مراجعات الامتثال المعينة' : 'Assigned Reviews',
    'Evidence': isRTL ? 'أدلة ووثائق الإثبات' : 'Evidence',
    'Findings': isRTL ? 'النتائج والملاحظات' : 'Findings',
    'Standards': isRTL ? 'المعايير واللوائح' : 'Standards',
    'Fatwas': isRTL ? 'الفتاوى والقرارات الشرعية' : 'Fatwas',
    'Approvals': isRTL ? 'الموافقات الرقمية' : 'Approvals',
    'Notifications': isRTL ? 'مركز التنبيهات والأحداث' : 'Notifications',

    // Auditor custom menus
    'Audit Engagements': isRTL ? 'مهام التدقيق القائمة' : 'Audit Engagements',
    'Working Papers': isRTL ? 'أوراق العمل والتدقيق' : 'Working Papers',
    'Corrective Actions': isRTL ? 'الإجراءات التصحيحية' : 'Corrective Actions',
    'Calendar': isRTL ? 'جدول مواعيد التدقيق' : 'Calendar',

    // Compliance Officer custom menus
    'Transactions': isRTL ? 'فحص وتدقيق المعاملات' : 'Transactions',

    // Executive custom menus
    'Executive Reports': isRTL ? 'تقارير الإدارة العليا' : 'Executive Reports',
    'KPIs': isRTL ? 'مؤشرات الأداء الكبرى' : 'KPIs',
    'Compliance Score': isRTL ? 'مؤشر الامتثال العام' : 'Compliance Score',
    'Risk Overview': isRTL ? 'خريطة مخاطر الامتثال' : 'Risk Overview',
    'Trends': isRTL ? 'تحليل الاتجاهات والمخاطر' : 'Trends',

    // Partner custom menus
    'Customers': isRTL ? 'قائمة العملاء الجدد' : 'Customers',
    'Projects': isRTL ? 'مشاريع الشراكة الحالية' : 'Projects',
    'Revenue': isRTL ? 'الأرباح والعوائد المشتركة' : 'Revenue',
    'Commissions': isRTL ? 'عمولات الشركاء المستحقة' : 'Commissions',

    // Customer Lifecycle Suite custom menus
    'Customer Lifecycle': isRTL ? 'إدارة دورة حياة العملاء' : 'Customer Lifecycle',
    'Lead Management': isRTL ? 'إدارة العملاء المحتملين' : 'Lead Management',
    'Activities': isRTL ? 'سجل التفاعلات والأنشطة' : 'Activities',
    'Proposals': isRTL ? 'العروض الفنية والمالية' : 'Proposals',
    'Contracts': isRTL ? 'إدارة العقود والاتفاقيات' : 'Contracts',
    'Meetings': isRTL ? 'الاجتماعات المجدولة' : 'Meetings',
    'Tasks': isRTL ? 'مهام الامتثال والتحقق' : 'Tasks',
    'Milestones': isRTL ? 'المحطات الرئيسية للتشغيل' : 'Milestones',
    'Resources': isRTL ? 'تخصيص وكفاءة الموارد' : 'Resources',
    'Deliverables': isRTL ? 'مخرجات ومستندات التسليم' : 'Deliverables',
    'Customer Communication': isRTL ? 'قنوات المراسلة مع العميل' : 'Customer Communication',
    'Project Reports': isRTL ? 'تقارير تقدم المشروع' : 'Project Reports',
    'Renewals': isRTL ? 'تجديد عقود الامتثال' : 'Renewals',
    'Health Checks': isRTL ? 'متابعة مؤشرات صحة العلاقة' : 'Health Checks',
    'Satisfaction': isRTL ? 'مستويات رضا العملاء' : 'Satisfaction',
    'Cross-selling': isRTL ? 'فرص البيع والترقيات البديلة' : 'Cross-selling',
    'Their Company': isRTL ? 'ملف شركتنا المعتمد' : 'Their Company',
    'Their Projects': isRTL ? 'مشاريع الامتثال الخاصة بنا' : 'Their Projects',
    'Their Tasks': isRTL ? 'المهام المعلقة بانتظارنا' : 'Their Tasks',
    'Their Reports': isRTL ? 'التقارير المعتمدة لنا' : 'Their Reports',
    'Their Certificates': isRTL ? 'شهادات الامتثال الصادرة لنا' : 'Their Certificates',
    'Messages': isRTL ? 'صندوق المراسلات والرسائل' : 'Messages',
    'Downloads': isRTL ? 'مركز التحميلات والملفات المعتمدة' : 'Downloads',

    // Developer custom menus
    'SDK': isRTL ? 'حزم تطوير البرمجيات SDK' : 'SDK',
    'API Keys': isRTL ? 'مفاتيح الربط البرمجي API' : 'API Keys',
    'Applications': isRTL ? 'تطبيقات المطورين المفتوحة' : 'Applications',
    'Analytics': isRTL ? 'تحليلات المطور الكلية' : 'Analytics',
    'Documentation': isRTL ? 'التوثيق البرمجي والتعليمات' : 'Documentation'
  };

  const renderSidebar = (isMobile: boolean = false) => {
    return (
      <aside
        id={isMobile ? "mobile-sidebar-nav" : "sidebar-nav"}
        className={`w-64 border-slate-200 flex flex-col justify-between p-5 h-full ${
          theme === 'dark' ? 'bg-slate-900 border-r border-slate-800' : 'bg-slate-900 text-white border-r'
        } ${isRTL ? 'border-l border-r-0' : ''}`}
      >
        <div className="space-y-6">
          {/* Brand/Slogan Area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2.5 rounded-lg shadow shadow-emerald-800/30">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                  ICAP
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">{isRTL ? 'منصة الامتثال الإسلامي' : 'Islamic Compliance AI'}</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav menu links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navItems.map((item) => {
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  id={isMobile ? `${item.id}-mobile` : item.id}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (isMobile) {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full text-xs font-bold py-2.5 px-3 rounded-lg flex items-center gap-3 transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow shadow-emerald-800/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  } ${isRTL ? 'justify-start' : ''}`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{translatedNavNames[item.name] || item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-slate-800/60 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name.substring(0, 1)}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">{currentUser.name}</span>
              <span className="text-[9px] text-slate-400 block truncate uppercase font-mono">{currentUser.role.replace('_', ' ')}</span>
            </div>
          </div>
          <button
            onClick={() => {
              handleLogout();
              if (isMobile) {
                setMobileMenuOpen(false);
              }
            }}
            className="w-full text-xs font-bold text-slate-400 hover:text-white py-1.5 rounded flex items-center gap-2 hover:bg-slate-800/30"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>{isRTL ? 'تسجيل الخروج' : 'Logout secure'}</span>
          </button>
        </div>
      </aside>
    );
  };

  return (
    <div
      id="icap-workspace"
      className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'} relative`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Mobile Sidebar overlay/backdrop */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 z-50 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex flex-col w-64 bg-slate-900 text-white z-50 h-full shadow-2xl">
            {renderSidebar(true)}
          </div>
        </div>
      )}

      {/* Desktop Sidebar (persistent on md and up) */}
      <div className="hidden md:flex md:w-64 md:shrink-0">
        {renderSidebar(false)}
      </div>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div id="main-scroll-container" className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navigation */}
        <header
          id="workspace-header"
          className={`h-16 px-6 border-b flex items-center justify-between z-10 shrink-0 ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-150'
          }`}
        >
          {/* Left panel info */}
          <div className="flex items-center gap-3 relative">
            {/* Mobile Hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-lg transition ${
                theme === 'dark' 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isRTL ? 'القائمة' : 'Toggle Menu'}
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowOrgSelect(!showOrgSelect)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-lg transition"
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>{currentOrg.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Simulated Org Selector dropdown */}
            {showOrgSelect && (
              <div className="absolute top-11 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 w-60 text-xs text-slate-700 z-50">
                <button
                  onClick={() => {
                    setCurrentOrg(DEMO_ORGANIZATION);
                    setShowOrgSelect(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 font-semibold"
                >
                  🏢 Al Noor Islamic Finance Group
                </button>
                <button
                  onClick={() => {
                    const customOrg: Organization = {
                      id: 'org-custom',
                      name: 'Dar Al-Rayan Retail Group',
                      industry: 'Islamic Retail & Wealth',
                      country: 'United Arab Emirates',
                      createdAt: new Date().toISOString(),
                      subscriptionStatus: 'Trial'
                    };
                    setCurrentOrg(customOrg);
                    setShowOrgSelect(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 font-semibold"
                >
                  🏢 Dar Al-Rayan Retail Group
                </button>
              </div>
            )}

            {/* Workspace-specific Search Scope bar */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 w-64 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder={isRTL ? workspaceConfig?.searchPlaceholderAr : workspaceConfig?.searchPlaceholderEn}
                className="bg-transparent border-none text-[10px] focus:outline-none w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <span className="text-[8px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded tracking-wide uppercase whitespace-nowrap">
                {workspaceConfig?.searchScope?.join(' | ') || 'GLOBAL'}
              </span>
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="flex items-center gap-3">
            {/* Language Quick switch */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="p-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg transition relative"
              title={isRTL ? 'تبديل اللغة' : 'Switch Language'}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Theme switcher */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg transition"
              title={isRTL ? 'المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) handleMarkNotificationsRead();
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 rounded-lg transition relative"
              >
                <Bell className="w-4 h-4" />
                {filteredNotifications.some((n) => n.status === 'Unread') && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {/* Dynamic Notification lists */}
              {showNotifications && (
                <div className="absolute top-11 right-0 bg-white border border-slate-200 rounded-xl shadow-xl w-80 text-xs text-slate-700 z-50 p-4 space-y-3.5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-slate-800">{isRTL ? 'الإشعارات والمخاطر' : 'SaaS Alerts & Notices'}</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-red-600 hover:underline">{isRTL ? 'مسح الكل' : 'Clear'}</button>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((n) => (
                        <div key={n.id} className="border-b last:border-0 pb-2">
                          <span className="font-bold text-slate-800 block">{n.title}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-slate-400 italic">{isRTL ? 'لا توجد إشعارات حالياً.' : 'No active notifications.'}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile trigger */}
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 hidden md:inline">{currentUser.name}</span>
              <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-100 hidden md:inline uppercase">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner page container */}
        <main id="workspace-body" className="p-6 max-w-7xl mx-auto w-full flex-1">
          {/* Workspace Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6 flex-wrap">
            <span>{isRTL ? 'الرئيسية' : 'Portal'}</span>
            <span>/</span>
            <span>
              {isRTL ? workspaceConfig?.workspaceNameAr : workspaceConfig?.workspaceNameEn}
            </span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {translatedNavNames[activeTab] || activeTab}
            </span>
          </div>

          {/* Customer Lifecycle Suite Rendering Block */}
          {currentUser && (
            activeTab === 'Customer Lifecycle' ||
            activeTab === 'Lead Management' ||
            activeTab === 'Activities' ||
            activeTab === 'Proposals' ||
            activeTab === 'Contracts' ||
            activeTab === 'Meetings' ||
            activeTab === 'Tasks' ||
            activeTab === 'Milestones' ||
            activeTab === 'Resources' ||
            activeTab === 'Deliverables' ||
            activeTab === 'Customer Communication' ||
            activeTab === 'Project Reports' ||
            activeTab === 'Renewals' ||
            activeTab === 'Health Checks' ||
            activeTab === 'Satisfaction' ||
            activeTab === 'Cross-selling' ||
            activeTab === 'Their Company' ||
            activeTab === 'Their Projects' ||
            activeTab === 'Their Tasks' ||
            activeTab === 'Their Reports' ||
            activeTab === 'Their Certificates' ||
            activeTab === 'Messages' ||
            activeTab === 'Downloads' ||
            (activeTab === 'Customers' && (currentUser.role === 'SALES EXECUTIVE' || currentUser.role === 'CUSTOMER SUCCESS MANAGER')) ||
            (activeTab === 'Projects' && currentUser.role === 'PROJECT MANAGER') ||
            (activeTab === 'Calendar' && currentUser.role === 'SALES EXECUTIVE')
          ) && (
            <CustomerLifecycleView
              user={currentUser}
              locale={locale}
              theme={theme}
              activeTab={activeTab}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Dashboard' && (
            <DashboardView
              stats={{
                score: 95,
                standards: standards.length,
                documents: documents.length,
                findings: 12,
                certificates: 3,
                systems: 2
              }}
              activityLogs={filteredActivityLogs}
              locale={locale}
              workspaceConfig={workspaceConfig}
              onExecuteAction={(actionId, actionName) => {
                triggerActivityLog('OPERATIONAL_ACTION', `Executed ${actionName} shortcut (${actionId}) in current workspace`);
              }}
            />
          )}

          {(activeTab === 'Standards' || activeTab === 'Compliance Configuration' || activeTab === 'Compliance Reviews') && (
            <ComplianceConfigView
              standards={standards}
              policies={policies}
              sops={sops}
              customRules={customRules}
              users={usersList}
              locale={locale}
              onAddStandard={handleAddStandard}
              onAddPolicy={handleAddPolicy}
              onAddSOP={handleAddSOP}
              onAddRule={handleAddRule}
            />
          )}

          {(activeTab === 'Knowledge Center' || activeTab === 'Evidence' || activeTab === 'Documents') && (
            <KnowledgeCenterView
              documents={documents}
              categories={DEMO_KNOWLEDGE_CATEGORIES}
              knowledgeNodes={DEMO_KNOWLEDGE_NODES}
              locale={locale}
              onAddDocument={handleAddDocument}
              onUpdateDocStatus={handleUpdateDocStatus}
            />
          )}

          {(activeTab === 'Developer Portal' || activeTab === 'Documentation' || activeTab === 'SDK' || activeTab === 'API Keys' || activeTab === 'Applications' || activeTab === 'Analytics' || activeTab === 'API Management') && (
            <DeveloperPortalView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'AI Compliance Engine' || activeTab === 'Transactions') && (
            <AiComplianceEngineView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'AI Reasoning Center' || activeTab === 'Fatwas' || activeTab === 'Security') && (
            <AiReasoningCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Monitoring Center' || activeTab === 'Monitoring' || activeTab === 'Risk Overview') && (
            <MonitoringCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
              initialSubTab={activeTab === 'Risk Overview' ? 'risk_map' : 'dashboard'}
            />
          )}

          {(activeTab === 'Reporting Center' || activeTab === 'Reports' || activeTab === 'Executive Reports' || activeTab === 'KPIs' || activeTab === 'Trends') && (
            <ReportingCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Industry Marketplace' && (
            <IndustryMarketplaceView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Marketplace' && (
            <MarketplaceView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Enterprise Portal' && (
            <EnterprisePortalView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Global Compliance Center' || activeTab === 'Compliance Score') && (
            <GlobalComplianceCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Certification' || activeTab === 'Certificates' || activeTab === 'Approvals') && (
            <CertificationCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Audit Center' || activeTab === 'Assigned Reviews' || activeTab === 'Audit Engagements' || activeTab === 'Working Papers' || activeTab === 'Corrective Actions' || activeTab === 'Findings') && (
            <AuditCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
              initialSubTab={
                activeTab === 'Findings' ? 'findings' :
                activeTab === 'Assigned Reviews' ? 'engagements' :
                activeTab === 'Audit Engagements' ? 'engagements' :
                activeTab === 'Working Papers' ? 'papers' :
                activeTab === 'Corrective Actions' ? 'actions' :
                'dashboard'
              }
            />
          )}

          {(activeTab === 'Administration' || activeTab === 'Organizations' || activeTab === 'Users' || activeTab === 'Roles' || activeTab === 'Subscriptions' || activeTab === 'Departments' || activeTab === 'Customers') && (
            <AdministrationView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Production Readiness' || activeTab === 'System Health' || activeTab === 'ICAP Readiness') && (
            <ProductionReadinessView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Knowledge Repository' && (
            <IKRView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Organization' ||
            activeTab === 'My Organization' ||
            activeTab === 'Integrations' ||
            activeTab === 'ERP Connections' ||
            activeTab === 'Projects' ||
            activeTab === 'Revenue' ||
            activeTab === 'Commissions' ||
            activeTab === 'Audit Logs' ||
            activeTab === 'Calendar' ||
            activeTab === 'Settings' ||
            activeTab === 'Billing' ||
            activeTab === 'Support' ||
            activeTab === 'Notifications') && (
            <OtherViews
              viewName={
                (activeTab === 'My Organization' ? 'Organization' :
                 activeTab === 'Billing' ? 'Settings' :
                 activeTab === 'Support' ? 'Settings' :
                 activeTab === 'ERP Connections' ? 'Integrations' :
                 activeTab === 'Projects' ? 'Integrations' :
                 activeTab === 'Revenue' ? 'Integrations' :
                 activeTab === 'Commissions' ? 'Integrations' :
                 activeTab === 'Audit Logs' ? 'Integrations' :
                 activeTab === 'Calendar' ? 'Integrations' :
                 activeTab === 'Notifications' ? 'Settings' :
                 activeTab) as any
              }
              users={usersList}
              activityLogs={filteredActivityLogs}
              organization={currentOrg}
              locale={locale}
              theme={theme}
              onUpdateLocale={setLocale}
              onUpdateTheme={setTheme}
              onAddUser={handleAddUser}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}
        </main>
      </div>
    </div>
  );
}
