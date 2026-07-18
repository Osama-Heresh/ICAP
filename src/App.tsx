import React, { useState, useEffect } from 'react';
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
  ShoppingBag
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

export default function App() {
  // Global SaaS States (Initialized from localStorage if present, fallback to demo data)
  const [currentUser, setCurrentUser] = useState<{ email: string; role: UserRole; name: string; jobTitle: string } | null>(() => {
    const stored = localStorage.getItem('icap_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [currentOrg, setCurrentOrg] = useState<Organization>(() => {
    const stored = localStorage.getItem('icap_org');
    return stored ? JSON.parse(stored) : DEMO_ORGANIZATION;
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

  // Database simulated tables in states
  const [standards, setStandards] = useState<Standard[]>(() => {
    const stored = localStorage.getItem('icap_standards');
    return stored ? JSON.parse(stored) : DEMO_STANDARDS;
  });

  const [policies, setPolicies] = useState<Policy[]>(() => {
    const stored = localStorage.getItem('icap_policies');
    return stored ? JSON.parse(stored) : DEMO_POLICIES;
  });

  const [sops, setSops] = useState<SOP[]>(() => {
    const stored = localStorage.getItem('icap_sops');
    return stored ? JSON.parse(stored) : DEMO_SOPS;
  });

  const [customRules, setCustomRules] = useState<CustomRule[]>(() => {
    const stored = localStorage.getItem('icap_custom_rules');
    return stored ? JSON.parse(stored) : DEMO_CUSTOM_RULES;
  });

  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => {
    const stored = localStorage.getItem('icap_documents');
    return stored ? JSON.parse(stored) : DEMO_DOCUMENTS;
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const stored = localStorage.getItem('icap_users_list');
    return stored ? JSON.parse(stored) : DEMO_USERS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const stored = localStorage.getItem('icap_activity_logs');
    return stored ? JSON.parse(stored) : DEMO_ACTIVITY_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('icap_notifications');
    return stored ? JSON.parse(stored) : DEMO_NOTIFICATIONS;
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

  const handleLogin = (user: { email: string; role: UserRole; name: string; jobTitle: string }) => {
    setCurrentUser(user);
    localStorage.setItem('icap_user', JSON.stringify(user));

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

  // Render Login page if not authenticated
  if (!currentUser) {
    return <AuthView onLogin={handleLogin} locale={locale} />;
  }

  // Sidebar navigation configuration
  const navItems = [
    { name: 'Dashboard', icon: Shield, id: 'nav-dashboard' },
    { name: 'Global Compliance Center', icon: Globe, id: 'nav-global-compliance' },
    { name: 'Industry Marketplace', icon: ShoppingBag, id: 'nav-industry-marketplace' },
    { name: 'Marketplace', icon: ShoppingBag, id: 'nav-marketplace' },
    { name: 'Enterprise Portal', icon: Globe, id: 'nav-enterprise-portal' },
    { name: 'Organization', icon: Building, id: 'nav-organization' },
    { name: 'Compliance Configuration', icon: Sliders, id: 'nav-compliance-config' },
    { name: 'Knowledge Center', icon: BookOpen, id: 'nav-knowledge-center' },
    { name: 'Integrations', icon: Database, id: 'nav-integrations' },
    { name: 'AI Compliance Engine', icon: Cpu, id: 'nav-ai-engine' },
    { name: 'AI Reasoning Center', icon: Scale, id: 'nav-ai-reasoning' },
    { name: 'Reporting Center', icon: FileText, id: 'nav-reporting-center' },
    { name: 'Certification', icon: Award, id: 'nav-certification' },
    { name: 'Audit Center', icon: ClipboardList, id: 'nav-audit-center' },
    { name: 'Monitoring Center', icon: Activity, id: 'nav-monitoring-center' },
    { name: 'Administration', icon: Users, id: 'nav-administration' },
    { name: 'Developer Portal', icon: Terminal, id: 'nav-developer-portal' },
    { name: 'Production Readiness', icon: Zap, id: 'nav-production-readiness' },
    { name: 'Settings', icon: Settings, id: 'nav-settings' }
  ];

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
    'Settings': isRTL ? 'الإعدادات' : 'Settings'
  };

  return (
    <div
      id="icap-workspace"
      className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'} relative`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* 1. LEFT SIDEBAR NAVIGATION (Renders on Right if RTL) */}
      <aside
        id="sidebar-nav"
        className={`w-64 border-slate-200 shrink-0 flex flex-col justify-between p-5 z-20 ${
          theme === 'dark' ? 'bg-slate-900/90 border-r border-slate-800' : 'bg-slate-900 text-white border-r'
        } ${isRTL ? 'border-l border-r-0' : ''}`}
      >
        <div className="space-y-6">
          {/* Brand/Slogan Area */}
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

          {/* Nav menu links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  id={item.id}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full text-xs font-bold py-2.5 px-3 rounded-lg flex items-center gap-3 transition ${
                    active
                      ? 'bg-emerald-600 text-white shadow shadow-emerald-800/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  } ${isRTL ? 'justify-start' : ''}`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{translatedNavNames[item.name]}</span>
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
            onClick={handleLogout}
            className="w-full text-xs font-bold text-slate-400 hover:text-white py-1.5 rounded flex items-center gap-2 hover:bg-slate-800/30"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>{isRTL ? 'تسجيل الخروج' : 'Logout secure'}</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navigation */}
        <header
          id="workspace-header"
          className={`h-16 px-6 border-b flex items-center justify-between z-10 shrink-0 ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-150'
          }`}
        >
          {/* Left panel info */}
          <div className="flex items-center gap-3 relative">
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
                {notifications.some((n) => n.status === 'Unread') && (
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
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
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
              activityLogs={activityLogs}
              locale={locale}
            />
          )}

          {activeTab === 'Compliance Configuration' && (
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

          {activeTab === 'Knowledge Center' && (
            <KnowledgeCenterView
              documents={documents}
              categories={DEMO_KNOWLEDGE_CATEGORIES}
              knowledgeNodes={DEMO_KNOWLEDGE_NODES}
              locale={locale}
              onAddDocument={handleAddDocument}
              onUpdateDocStatus={handleUpdateDocStatus}
            />
          )}

          {activeTab === 'Developer Portal' && (
            <DeveloperPortalView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'AI Compliance Engine' && (
            <AiComplianceEngineView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'AI Reasoning Center' && (
            <AiReasoningCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Monitoring Center' && (
            <MonitoringCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Reporting Center' && (
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

          {activeTab === 'Global Compliance Center' && (
            <GlobalComplianceCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Certification' && (
            <CertificationCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Audit Center' && (
            <AuditCenterView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Administration' && (
            <AdministrationView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {activeTab === 'Production Readiness' && (
            <ProductionReadinessView
              locale={locale}
              theme={theme}
              onTriggerActivityLog={triggerActivityLog}
            />
          )}

          {(activeTab === 'Organization' ||
            activeTab === 'Integrations' ||
            activeTab === 'Settings') && (
            <OtherViews
              viewName={activeTab as any}
              users={usersList}
              activityLogs={activityLogs}
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
