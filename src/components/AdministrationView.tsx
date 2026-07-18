import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  Building2,
  Sliders,
  DollarSign,
  Activity,
  AlertTriangle,
  FileText,
  Cpu,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Lock,
  ChevronRight,
  TrendingUp,
  Server,
  Network,
  Eye,
  CheckCircle,
  Database,
  Globe,
  Mail,
  SlidersHorizontal,
  ChevronLeft,
  Settings,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlatformSetting,
  SubscriptionRecord,
  UsageRecord,
  SecurityPolicyRecord,
  PlatformAuditLog,
  SystemJob,
  User,
  Organization
} from '../types';

interface AdministrationViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function AdministrationView({
  locale,
  theme,
  onTriggerActivityLog
}: AdministrationViewProps) {
  const isRTL = locale === 'ar';

  // 11 Navigation Subtabs
  const [adminTab, setAdminTab] = useState<'dashboard' | 'organizations' | 'users' | 'roles' | 'subscriptions' | 'usage' | 'security' | 'audit' | 'jobs' | 'ai_config' | 'integrations'>('dashboard');

  // ==========================================
  // STATE DEFINITIONS & DEMO DATA
  // ==========================================

  // Organizations Table
  const [orgs, setOrgs] = useState<Organization[]>([
    {
      id: 'ORG-001',
      name: 'Al Noor Islamic Finance Group',
      industry: 'Islamic Retail Banking',
      country: 'Saudi Arabia',
      subscriptionStatus: 'Active',
      businessType: 'Enterprise Commercial',
      employeesCount: '1,200',
      createdAt: '2024-03-12'
    },
    {
      id: 'ORG-002',
      name: 'Global Halal FinTech',
      industry: 'Wealth Management',
      country: 'United Arab Emirates',
      subscriptionStatus: 'Trial',
      businessType: 'Growth Startup',
      employeesCount: '150',
      createdAt: '2025-01-20'
    },
    {
      id: 'ORG-003',
      name: 'Crypto Compliance Labs',
      industry: 'Decentralized Finance',
      country: 'Bahrain',
      subscriptionStatus: 'Suspended',
      businessType: 'DeFi Liquid Staking',
      employeesCount: '45',
      createdAt: '2025-06-02'
    }
  ]);

  // Tenant / Module Control Limits Mapping
  const [tenantLimits, setTenantLimits] = useState<Record<string, {
    storageGb: number;
    apiCallsLimit: number;
    aiAnalysisLimit: number;
    modules: Record<string, boolean>;
  }>>({
    'ORG-001': {
      storageGb: 500,
      apiCallsLimit: 5000000,
      aiAnalysisLimit: 100000,
      modules: { 'Audit Center': true, 'AI Reasoning Center': true, 'Developer Portal': true, 'Monitoring Center': true }
    },
    'ORG-002': {
      storageGb: 100,
      apiCallsLimit: 1000000,
      aiAnalysisLimit: 20000,
      modules: { 'Audit Center': true, 'AI Reasoning Center': true, 'Developer Portal': false, 'Monitoring Center': true }
    },
    'ORG-003': {
      storageGb: 50,
      apiCallsLimit: 200000,
      aiAnalysisLimit: 5000,
      modules: { 'Audit Center': false, 'AI Reasoning Center': false, 'Developer Portal': false, 'Monitoring Center': false }
    }
  });

  // Simulated 500 users representation
  const [users, setUsers] = useState<User[]>(() => {
    const list: User[] = [
      {
        id: 'usr-001',
        organizationId: 'ORG-001',
        name: 'Adil Mansoor, CFA',
        email: 'a.mansoor@alnoorfinance.com',
        role: 'SUPER ADMIN',
        status: 'Active',
        department: 'Treasury & Investment',
        createdAt: '2024-03-12',
        lastLogin: '2026-07-17 14:22'
      },
      {
        id: 'usr-002',
        organizationId: 'ORG-001',
        name: 'Sarah Al-Ghamdi',
        email: 's.ghamdi@alnoorfinance.com',
        role: 'AUDITOR',
        status: 'Active',
        department: 'Internal Sharia Audit',
        createdAt: '2024-04-01',
        lastLogin: '2026-07-17 15:45'
      },
      {
        id: 'usr-003',
        organizationId: 'ORG-002',
        name: 'Tariq Bin Ziyad',
        email: 'tariq@globalhalal.io',
        role: 'ORGANIZATION ADMIN',
        status: 'Active',
        department: 'Operations',
        createdAt: '2025-01-20',
        lastLogin: '2026-07-16 09:12'
      },
      {
        id: 'usr-004',
        organizationId: 'ORG-003',
        name: 'Zayd Al-Khair',
        email: 'zayd@cryptolabs.bh',
        role: 'COMPLIANCE OFFICER',
        status: 'Deactivated',
        department: 'Blockchain Compliance',
        createdAt: '2025-06-02',
        lastLogin: '2026-06-30 18:33'
      }
    ];

    // Seed representation of up to 500 users to fulfill requirement 19
    for (let i = 5; i <= 500; i++) {
      const orgId = i % 3 === 1 ? 'ORG-001' : i % 3 === 2 ? 'ORG-002' : 'ORG-003';
      const orgName = i % 3 === 1 ? 'alnoor' : i % 3 === 2 ? 'halalio' : 'cryptolabs';
      list.push({
        id: `usr-${i}`,
        organizationId: orgId,
        name: `Compliance Professional #${i}`,
        email: `auditor.${i}@${orgName}.com`,
        role: i % 5 === 0 ? 'AUDITOR' : i % 5 === 1 ? 'COMPLIANCE OFFICER' : i % 5 === 2 ? 'SHARIA REVIEWER' : 'EMPLOYEE',
        status: i % 25 === 0 ? 'Pending' : i % 15 === 0 ? 'Deactivated' : 'Active',
        department: i % 2 === 0 ? 'Sharia Governance' : 'SaaS Control Unit',
        createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-15`,
        lastLogin: `2026-07-${String((i % 17) + 1).padStart(2, '0')} 11:00`
      });
    }
    return list;
  });

  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 8;

  // Custom Roles & Permissions builder
  const [customRoles, setCustomRoles] = useState<{
    id: string;
    name: string;
    description: string;
    permissions: Record<string, boolean>;
  }[]>([
    {
      id: 'role-ext-auditor',
      name: 'External Board Auditor',
      description: 'Provides external review capabilities. Has strict read-only access to certificates and audit reports, but cannot add comments or mutate ledger controls.',
      permissions: {
        Dashboard: true,
        Documents: true,
        Compliance: false,
        'AI Engine': false,
        Reports: true,
        Certification: true,
        Audit: true,
        Integrations: false,
        Administration: false
      }
    },
    {
      id: 'role-regulatory-observer',
      name: 'SAMA Regulatory Observer',
      description: 'Institutional reporting role. Dedicated observer channel for real-time compliance activity auditing and risk alert logs reading.',
      permissions: {
        Dashboard: true,
        Documents: true,
        Compliance: false,
        'AI Engine': false,
        Reports: true,
        Certification: true,
        Audit: true,
        Integrations: false,
        Administration: false
      }
    }
  ]);

  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<Record<string, boolean>>({
    Dashboard: true,
    Documents: false,
    Compliance: false,
    'AI Engine': false,
    Reports: false,
    Certification: false,
    Audit: false,
    Integrations: false,
    Administration: false
  });

  // Subscription Plans Database Record
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([
    {
      id: 'SUB-001',
      organizationId: 'ORG-001',
      plan: 'Enterprise',
      status: 'Active',
      limits: {
        users: 100,
        storageGb: 500,
        aiAnalysisLimit: 100000,
        erpConnections: 5,
        reports: 500,
        certificates: 100,
        apiAccess: true
      },
      billingCycle: 'Annual',
      paymentStatus: 'Paid',
      invoiceCount: 4,
      enterpriseContractDetails: 'SAMA Compliant Multi-site Sovereign Cloud Agreement #ALNOOR-SAMA-2026'
    },
    {
      id: 'SUB-002',
      organizationId: 'ORG-002',
      plan: 'Professional',
      status: 'Trial',
      limits: {
        users: 15,
        storageGb: 100,
        aiAnalysisLimit: 20000,
        erpConnections: 2,
        reports: 50,
        certificates: 10,
        apiAccess: true
      },
      billingCycle: 'Monthly',
      paymentStatus: 'Paid',
      invoiceCount: 2
    },
    {
      id: 'SUB-003',
      organizationId: 'ORG-003',
      plan: 'Starter',
      status: 'Suspended',
      limits: {
        users: 5,
        storageGb: 20,
        aiAnalysisLimit: 2000,
        erpConnections: 1,
        reports: 10,
        certificates: 2,
        apiAccess: false
      },
      billingCycle: 'Monthly',
      paymentStatus: 'Unpaid',
      invoiceCount: 1
    }
  ]);

  // Billing and Invoices simulation
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', customer: 'Al Noor Islamic Finance', plan: 'Enterprise', amount: '$45,000', date: '2026-01-15', status: 'Paid', method: 'Enterprise Contract' },
    { id: 'INV-2026-002', customer: 'Global Halal FinTech', plan: 'Professional', amount: '$1,250', date: '2026-07-01', status: 'Paid', method: 'Stripe Credit' },
    { id: 'INV-2026-003', customer: 'Crypto Compliance Labs', plan: 'Starter', amount: '$299', date: '2026-06-01', status: 'Unpaid', method: 'Bank Wire Transfer' }
  ]);

  // Usage Analytics Database Records compared with limits
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([
    { id: 'USG-001', organizationId: 'ORG-001', service: 'AI Requests', quantity: 48500, date: '2026-07' },
    { id: 'USG-002', organizationId: 'ORG-001', service: 'Documents Processed', quantity: 420, date: '2026-07' },
    { id: 'USG-003', organizationId: 'ORG-001', service: 'ERP Transactions', quantity: 1850000, date: '2026-07' },
    { id: 'USG-004', organizationId: 'ORG-001', service: 'API Calls', quantity: 2450000, date: '2026-07' },
    { id: 'USG-005', organizationId: 'ORG-002', service: 'AI Requests', quantity: 12400, date: '2026-07' },
    { id: 'USG-006', organizationId: 'ORG-002', service: 'Documents Processed', quantity: 95, date: '2026-07' }
  ]);

  // Security Policies Record
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicyRecord[]>([
    {
      id: 'POL-001',
      organizationId: 'ORG-001',
      settings: {
        minPasswordLength: 12,
        passwordExpiryDays: 90,
        mfaRequired: true,
        sessionTimeoutMinutes: 15,
        maxFailedLoginAttempts: 5,
        encryptionStatus: 'FIPS 140-2 Compliant'
      }
    },
    {
      id: 'POL-002',
      organizationId: 'ORG-002',
      settings: {
        minPasswordLength: 8,
        passwordExpiryDays: 180,
        mfaRequired: false,
        sessionTimeoutMinutes: 30,
        maxFailedLoginAttempts: 10,
        encryptionStatus: 'AES-256 Enabled'
      }
    }
  ]);

  // Platform Audit Logs (Requirement 12 & 18)
  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>([
    {
      id: 'AUD-901',
      userId: 'usr-001',
      userName: 'Adil Mansoor',
      userEmail: 'a.mansoor@alnoorfinance.com',
      action: 'MFA_AUTHENTICATION_SUCCESS',
      module: 'Security',
      timestamp: '2026-07-17 16:32:10',
      ipAddress: '192.168.12.82',
      details: 'User authenticated successfully using FIDO2 biometric credential.'
    },
    {
      id: 'AUD-902',
      userId: 'usr-002',
      userName: 'Sarah Al-Ghamdi',
      userEmail: 's.ghamdi@alnoorfinance.com',
      action: 'CONTRACT_EVIDENCE_UPLOAD',
      module: 'Documents',
      timestamp: '2026-07-17 15:46:12',
      ipAddress: '10.22.41.109',
      details: 'Uploaded 18 constructive Murabaha physical vehicle possession certificates.'
    },
    {
      id: 'AUD-903',
      userId: 'usr-001',
      userName: 'Adil Mansoor',
      userEmail: 'a.mansoor@alnoorfinance.com',
      action: 'AI_SHARIA_DECISION_OVERRIDE',
      module: 'AI Engine',
      timestamp: '2026-07-17 14:55:04',
      ipAddress: '192.168.12.82',
      details: 'Approved manual bypass for late invoice sequence penalty trigger. Overridden with approval justification.'
    },
    {
      id: 'AUD-904',
      userId: 'usr-003',
      userName: 'Tariq Bin Ziyad',
      userEmail: 'tariq@globalhalal.io',
      action: 'ERP_CONNECTION_MODIFIED',
      module: 'Integrations',
      timestamp: '2026-07-16 11:23:44',
      ipAddress: '172.16.8.4',
      details: 'Modified API credentials for SAP Business One cloud sandbox.'
    }
  ]);

  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('All');

  // System Background Jobs Monitor (Requirement 13 & 18)
  const [systemJobs, setSystemJobs] = useState<SystemJob[]>([
    { id: 'JOB-01', jobName: 'Odoo Financial Transaction Sync', status: 'Completed', startedAt: '16:00:00', completedAt: '16:02:15', progress: 100 },
    { id: 'JOB-02', jobName: 'Mambu Core Ledger Balance Validation', status: 'Running', startedAt: '16:50:00', progress: 68 },
    { id: 'JOB-03', jobName: 'SAMA Automated Certification Engine', status: 'Idle', startedAt: 'Pending' },
    { id: 'JOB-04', jobName: 'Purification Charity Allocation Audit', status: 'Failed', startedAt: '15:15:00', completedAt: '15:18:20', progress: 42 }
  ]);

  // AI Model Configuration, Threshold, Governance (Requirement 14 & 15)
  const [aiAgents, setAiAgents] = useState<Record<string, {
    enabled: boolean;
    confidenceThreshold: number;
    humanReviewRequired: boolean;
    model: string;
    decisionsCount: number;
    overridesCount: number;
    feedbackScore: number;
  }>>({
    'Sharia AI': { enabled: true, confidenceThreshold: 85, humanReviewRequired: true, model: 'gemini-2.5-flash', decisionsCount: 14200, overridesCount: 12, feedbackScore: 99.1 },
    'Audit AI': { enabled: true, confidenceThreshold: 90, humanReviewRequired: true, model: 'gemini-2.5-pro', decisionsCount: 8900, overridesCount: 22, feedbackScore: 98.4 },
    'Accounting AI': { enabled: true, confidenceThreshold: 80, humanReviewRequired: false, model: 'gemini-2.5-flash', decisionsCount: 24500, overridesCount: 5, feedbackScore: 99.5 },
    'Legal AI': { enabled: false, confidenceThreshold: 95, humanReviewRequired: true, model: 'gemini-2.5-pro', decisionsCount: 1200, overridesCount: 45, feedbackScore: 94.2 },
    'Risk AI': { enabled: true, confidenceThreshold: 85, humanReviewRequired: true, model: 'gemini-2.5-pro', decisionsCount: 6800, overridesCount: 8, feedbackScore: 98.8 }
  });

  // Integration Administration Webhooks & ERP connectors (Requirement 16)
  const [integrationConnectors, setIntegrationConnectors] = useState([
    { id: 'CONN-01', name: 'SAP S/4HANA Ledger Bridge', type: 'ERP Connector', status: 'Active', latency: '42ms', syncedTransactions: '1,425,000' },
    { id: 'CONN-02', name: 'Odoo Financial Module API', type: 'ERP Connector', status: 'Active', latency: '128ms', syncedTransactions: '424,500' },
    { id: 'CONN-03', name: 'Mambu Core Webhook Service', type: 'Webhook API', status: 'Active', latency: '85ms', syncedTransactions: '12,900' },
    { id: 'CONN-04', name: 'SAMA Regulatory Registry Portal', type: 'External Authority Gateway', status: 'Pending Verification', latency: 'N/A', syncedTransactions: '0' }
  ]);

  // System Settings Center (Requirement 17)
  const [systemSettings, setSystemSettings] = useState<PlatformSetting[]>([
    { id: 'SET-01', setting: 'Default Tenant Locale', value: 'Arabic/English Dual', category: 'Localization' },
    { id: 'SET-02', setting: 'Enable Automated Daily Audit Reports', value: 'True', category: 'General' },
    { id: 'SET-03', setting: 'Sovereign Cloud Data Registry Residency', value: 'KSA Dedicated Riyadh Cloud', category: 'Storage' },
    { id: 'SET-04', setting: 'Global Platform Alert Webhook', value: 'https://webhook.alnoor.sa/alerts', category: 'Integrations' },
    { id: 'SET-05', setting: 'Primary Notification Routing', value: 'SMS + Corporate Email Integration', category: 'Notifications' },
    { id: 'SET-06', setting: 'SMTP SMTP Corporate Relay Gateway', value: 'smtp.icap-saas-infra.net', category: 'Email' }
  ]);

  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [editingSettingValue, setEditingSettingValue] = useState('');

  // Floating notifications
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // HANDLERS FOR SAAS OPERATIONS
  // ==========================================

  const handleToggleOrgStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setOrgs(orgs.map(o => o.id === id ? { ...o, subscriptionStatus: nextStatus as any } : o));
    triggerToast(`Organization ${id} set to ${nextStatus}.`);
    onTriggerActivityLog('ORG_STATUS_UPDATE', `Set organization ${id} status to ${nextStatus}`);
  };

  const handleUpdateTenantLimit = (orgId: string, field: 'storageGb' | 'apiCallsLimit' | 'aiAnalysisLimit', value: number) => {
    setTenantLimits(prev => ({
      ...prev,
      [orgId]: {
        ...prev[orgId],
        [field]: value
      }
    }));
    triggerToast(`Tenant ${orgId} limits updated successfully.`);
  };

  const handleToggleTenantModule = (orgId: string, moduleName: string) => {
    setTenantLimits(prev => {
      const current = prev[orgId];
      return {
        ...prev,
        [orgId]: {
          ...current,
          modules: {
            ...current.modules,
            [moduleName]: !current.modules[moduleName]
          }
        }
      };
    });
    triggerToast(`Module authorization modified.`);
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u));
    triggerToast(`User status toggled to ${nextStatus}`);
  };

  const handleResetPassword = (userId: string) => {
    triggerToast(`Dispatched secure cryptographically-salted password reset dispatch link for user ID: ${userId}`);
    onTriggerActivityLog('USER_PASSWORD_RESET', `Sent password reset envelope to user ${userId}`);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const newRole = {
      id: `role-custom-${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc,
      permissions: { ...newRolePerms }
    };
    setCustomRoles([...customRoles, newRole]);
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRolePerms({
      Dashboard: true,
      Documents: false,
      Compliance: false,
      'AI Engine': false,
      Reports: false,
      Certification: false,
      Audit: false,
      Integrations: false,
      Administration: false
    });
    triggerToast(`Enterprise Role "${newRoleName}" provisioned.`);
  };

  const handleUpdateSecurityPolicy = (orgId: string, field: string, value: any) => {
    setSecurityPolicies(securityPolicies.map(p => {
      if (p.organizationId === orgId) {
        return {
          ...p,
          settings: {
            ...p.settings,
            [field]: value
          }
        };
      }
      return p;
    }));
    triggerToast('Global cryptographic security parameters updated.');
  };

  const handleToggleAiAgent = (name: string) => {
    setAiAgents(prev => {
      const current = prev[name];
      return {
        ...prev,
        [name]: { ...current, enabled: !current.enabled }
      };
    });
    triggerToast(`${name} automated processing state toggled.`);
  };

  const handleUpdateAiConfidence = (name: string, value: number) => {
    setAiAgents(prev => ({
      ...prev,
      [name]: { ...prev[name], confidenceThreshold: value }
    }));
  };

  const handleTriggerManualBackgroundJob = (jobId: string) => {
    setSystemJobs(systemJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'Running', progress: 10 };
      }
      return job;
    }));
    triggerToast(`Triggered direct remote execution invoke for job: ${jobId}`);
    setTimeout(() => {
      setSystemJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return { ...job, status: 'Completed', progress: 100, completedAt: new Date().toTimeString().split(' ')[0] };
        }
        return job;
      }));
    }, 4000);
  };

  const handleSaveSystemSetting = (id: string) => {
    setSystemSettings(systemSettings.map(s => s.id === id ? { ...s, value: editingSettingValue } : s));
    setEditingSettingId(null);
    triggerToast('Core setting updated.');
  };

  // ==========================================
  // FILTERS AND SEARCH CALCULATIONS
  // ==========================================

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.department?.toLowerCase().includes(userSearch.toLowerCase());
      return matchSearch;
    });
  }, [users, userSearch]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, userPage]);

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
                            log.action.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesModule = auditModuleFilter === 'All' || log.module === auditModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [auditLogs, auditSearch, auditModuleFilter]);

  return (
    <div className="space-y-6">
      {/* Platform Title Section */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'لوحة الإشراف وإدارة العمليات' : 'Administration & SaaS Operations'}
                <span className="text-xs bg-slate-500/10 text-slate-500 px-2.5 py-0.5 rounded-full font-sans border border-slate-500/10">
                  {isRTL ? 'لوحة تحكم المشرف الرئيسي' : 'Platform Administrator Panel'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL
                  ? 'إدارة حسابات المؤسسات المشتركة (Tenants)، تفعيل الوحدات الوظيفية، تعيين الصلاحيات المتقدمة، وإدارة قواعد حوكمة خوارزميات الذكاء الاصطناعي.'
                  : 'SaaS tenant onboarding, advanced module configuration, security policy deployment, custom role definition, and AI confidence model gates.'}
              </p>
            </div>
          </div>
        </div>

        {/* Subtabs Menu */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/85 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'نظرة عامة' : 'Admin Dashboard', icon: Activity },
            { id: 'organizations', name: isRTL ? 'إدارة المشتركين' : 'Organizations', icon: Building2 },
            { id: 'users', name: isRTL ? 'المستخدمين والنشاط' : 'Global Users', icon: Users },
            { id: 'roles', name: isRTL ? 'صلاحيات الأدوار' : 'Roles & Permissions', icon: Lock },
            { id: 'subscriptions', name: isRTL ? 'الاشتراكات والفوترة' : 'Subscriptions', icon: DollarSign },
            { id: 'usage', name: isRTL ? 'مراقبة الاستهلاك' : 'Usage Analytics', icon: SlidersHorizontal },
            { id: 'security', name: isRTL ? 'لوحة الأمان' : 'Security Center', icon: Shield },
            { id: 'audit', name: isRTL ? 'سجل العمليات الشامل' : 'Audit Logs', icon: FileText },
            { id: 'jobs', name: isRTL ? 'العمليات الخلفية' : 'System Jobs', icon: Server },
            { id: 'ai_config', name: isRTL ? 'حوكمة الذكاء الاصطناعي' : 'AI Governance', icon: Cpu },
            { id: 'integrations', name: isRTL ? 'إدارة الموصلات والربط' : 'Integrations', icon: Network }
          ].map(tab => {
            const active = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
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

      {/* Floating toast notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 text-xs border border-slate-700 animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Grid Render Area */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. ADMIN DASHBOARD */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { title: isRTL ? 'إجمالي المؤسسات' : 'Organizations', value: '250', desc: '+12 This Week' },
                { title: isRTL ? 'المستخدمين النشطين' : 'Active Users', value: '15,000', desc: '+3.2% growth' },
                { title: isRTL ? 'الشهادات الرقمية الممنوحة' : 'Certificates Issued', value: '850', desc: 'SAMA Audited' },
                { title: isRTL ? 'استدعاءات الـ API اليوم' : 'API Requests Today', value: '2.5M', desc: 'Avg latency 42ms' },
                { title: isRTL ? 'عمليات الفحص بالذكاء الاصطناعي' : 'AI Analyses Today', value: '50,000', desc: 'Accuracy 99.1%' },
                { title: isRTL ? 'جاهزية خوادم المنصة' : 'System Health', value: '99.9%', desc: 'No active downtime' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{stat.title}</span>
                  <span className="text-2xl font-display font-bold block mt-2 text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] text-emerald-600 font-sans block mt-1">{stat.desc}</span>
                </div>
              ))}
            </div>

            {/* Custom SVG Dashboard Metrics Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Tenant & User Growth */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تطور تسجيل المؤسسات والمستخدمين' : 'SaaS Organization & User Growth Timeline'}</h3>
                    <p className="text-[11px] text-slate-400">{isRTL ? 'مراقبة المنحنى التاريخي لانضمام المشتركين الجدد.' : 'Historical curve representing platform growth over trailing 6 months.'}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                {/* SVG Visual Graph Representation */}
                <div className="h-44 flex items-end justify-between gap-2 pt-4 border-b border-slate-100 dark:border-slate-800">
                  {[45, 62, 85, 120, 190, 250].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full relative bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-32">
                        <div
                          style={{ height: `${(h / 250) * 100}%` }}
                          className="w-full bg-emerald-500/80 hover:bg-emerald-500 transition duration-300"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Month {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Revenue & AI Usage Allocation */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'حجم العمليات وتحليل إيرادات استهلاك الذكاء الاصطناعي' : 'AI Analysis Volume & Revenue Allocation'}</h3>
                    <p className="text-[11px] text-slate-400">{isRTL ? 'توزيع استخدام الذكاء الاصطناعي وحسابات الاستهلاك.' : 'Direct correlation between API invocation pools and commercial accounts billing.'}</p>
                  </div>
                  <Sliders className="w-4 h-4 text-emerald-500" />
                </div>
                {/* Visual Segment Bars representing revenue usage */}
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'Al Noor Islamic Finance', usage: '48,500 analyses', pct: 85, color: 'bg-emerald-500' },
                    { label: 'Global Halal FinTech', usage: '12,400 analyses', pct: 45, color: 'bg-indigo-500' },
                    { label: 'Crypto Compliance Labs', usage: '1,200 analyses', pct: 15, color: 'bg-amber-500' },
                    { label: 'Other Sandbox Environments', usage: '500 analyses', pct: 5, color: 'bg-slate-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="text-slate-400">{item.usage}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${item.pct}%` }} className={`h-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORGANIZATION MANAGEMENT */}
        {adminTab === 'organizations' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إدارة المؤسسات وحسابات المشتركين' : 'Global Tenant & Organization Records'}</h3>
                <Building2 className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Tenants controls */}
              <div className="space-y-4">
                {orgs.map(org => {
                  const limits = tenantLimits[org.id] || { storageGb: 0, apiCallsLimit: 0, aiAnalysisLimit: 0, modules: {} };
                  return (
                    <div key={org.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-950 dark:text-white text-xs">{org.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {org.id}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{org.industry} • {org.country} • Created: {org.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            org.subscriptionStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            org.subscriptionStatus === 'Trial' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {org.subscriptionStatus}
                          </span>
                          <button
                            onClick={() => handleToggleOrgStatus(org.id, org.subscriptionStatus)}
                            className={`px-3 py-1 rounded text-[10px] font-bold border transition ${
                              org.subscriptionStatus === 'Active' ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' : 'bg-emerald-600 text-white border-emerald-700'
                            }`}
                          >
                            {org.subscriptionStatus === 'Active' ? (isRTL ? 'تعليق الاشتراك' : 'Suspend') : (isRTL ? 'تنشيط' : 'Activate')}
                          </button>
                        </div>
                      </div>

                      {/* Limits slider controllers for platform admins */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-400">{isRTL ? 'المساحة السحابية المخصصة:' : 'Cloud Storage Limit:'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{limits.storageGb} GB</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={limits.storageGb}
                            onChange={(e) => handleUpdateTenantLimit(org.id, 'storageGb', parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-400">{isRTL ? 'الحد الأقصى لاستدعاءات الـ API:' : 'API Calls Allocation:'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{(limits.apiCallsLimit / 1000000).toFixed(1)}M</span>
                          </div>
                          <input
                            type="range"
                            min="100000"
                            max="10000000"
                            step="500000"
                            value={limits.apiCallsLimit}
                            onChange={(e) => handleUpdateTenantLimit(org.id, 'apiCallsLimit', parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-400">{isRTL ? 'عمليات فحص الذكاء الاصطناعي مسموحة:' : 'AI Runs Allowed:'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{limits.aiAnalysisLimit.toLocaleString()}</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="200000"
                            step="5000"
                            value={limits.aiAnalysisLimit}
                            onChange={(e) => handleUpdateTenantLimit(org.id, 'aiAnalysisLimit', parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Enabled / Disabled Functional Modules */}
                      <div className="border-t border-slate-150/40 dark:border-slate-800/80 pt-3">
                        <span className="text-[10px] text-slate-400 font-bold block mb-2">{isRTL ? 'إدارة تفعيل وتعطيل الموديلات الوظيفية للمشترك:' : 'Authorized Software Modules for Tenant:'}</span>
                        <div className="flex flex-wrap gap-2">
                          {['Audit Center', 'AI Reasoning Center', 'Developer Portal', 'Monitoring Center'].map(mod => {
                            const isEnabled = !!limits.modules[mod];
                            return (
                              <button
                                key={mod}
                                onClick={() => handleToggleTenantModule(org.id, mod)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition duration-150 flex items-center gap-1 ${
                                  isEnabled
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through dark:bg-slate-800 dark:border-slate-700/60'
                                }`}
                              >
                                {isEnabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-400" />}
                                <span>{mod}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. GLOBAL USER MANAGEMENT */}
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'سجل مستخدمي النظام' : 'Global User Directory'}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {isRTL
                      ? `تم العثور على ${filteredUsers.length} مستخدم نشط من أصل ٥٠٠ مستخدم مسجل عبر المنصة.`
                      : `Displaying ${filteredUsers.length} filtered compliance professionals out of 500 platform wide.`}
                  </p>
                </div>
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder={isRTL ? 'ابحث باسم الموظف أو البريد...' : 'Search users...'}
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                    className="pl-8 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="p-3">{isRTL ? 'الاسم والبريد' : 'User Details'}</th>
                      <th className="p-3">{isRTL ? 'المؤسسة' : 'Tenant ID'}</th>
                      <th className="p-3">{isRTL ? 'الصلاحية والمسؤولية' : 'Platform Role'}</th>
                      <th className="p-3">{isRTL ? 'القسم الإداري' : 'Department'}</th>
                      <th className="p-3">{isRTL ? 'آخر تسجيل دخول' : 'Last Login'}</th>
                      <th className="p-3">{isRTL ? 'حالة الحساب' : 'Status'}</th>
                      <th className="p-3 text-right">{isRTL ? 'إجراءات فحص وتحكم' : 'Operations'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{user.name}</span>
                          <span className="text-[10px] text-slate-400 block">{user.email}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-500">{user.organizationId}</td>
                        <td className="p-3">
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{user.department}</td>
                        <td className="p-3 text-slate-400 font-mono text-[10px]">{user.lastLogin || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            user.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2 py-1 rounded"
                          >
                            {isRTL ? 'إعادة ضبط الرقم السري' : 'Reset PW'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              user.status === 'Active'
                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.status === 'Active' ? (isRTL ? 'تعطيل' : 'Deactivate') : (isRTL ? 'تنشيط' : 'Activate')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalUserPages > 1 && (
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  <span className="text-slate-400">
                    {isRTL
                      ? `عرض الصفحة ${userPage} من أصل ${totalUserPages}`
                      : `Page ${userPage} of ${totalUserPages}`}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={userPage === 1}
                      onClick={() => setUserPage(userPage - 1)}
                      className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={userPage === totalUserPages}
                      onClick={() => setUserPage(userPage + 1)}
                      className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. ROLE & PERMISSION MANAGEMENT */}
        {adminTab === 'roles' && (
          <div className="space-y-6">
            {/* Custom roles table */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'باني ومنظم الصلاحيات المخصصة للمؤسسة' : 'Advanced Permission Builder & Custom Roles'}</h3>
                <Lock className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Custom Roles */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-400 block">{isRTL ? 'الأدوار النشطة ومصفوفة صلاحياتها:' : 'Active Custom Enterprise Roles:'}</span>
                  {customRoles.map((role) => (
                    <div key={role.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">{role.name}</span>
                        <p className="text-[10px] text-slate-400 mt-1">{role.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {Object.entries(role.permissions).map(([permName, isAllowed]) => (
                          <span
                            key={permName}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                              isAllowed
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-red-500/10 text-red-500 line-through opacity-60'
                            }`}
                          >
                            {permName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role Creator Form */}
                <form onSubmit={handleCreateCustomRole} className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900/30 space-y-4">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{isRTL ? 'إنشاء دور وصلاحية مخصصة جديدة:' : 'Create Custom Enterprise Role'}</span>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">{isRTL ? 'اسم الدور الوظيفي الجديد:' : 'Role Name:'}</label>
                    <input
                      type="text"
                      placeholder="e.g. Sharia Board Lead Auditor"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">{isRTL ? 'الوصف والنطاق العملياتي:' : 'Description:'}</label>
                    <textarea
                      placeholder="Describe access privileges..."
                      value={newRoleDesc}
                      onChange={(e) => setNewRoleDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Permissions Selection Grid */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">{isRTL ? 'تخصيص تصاريح الوحدات الوظيفية (Permissions):' : 'Module Permissions:'}</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border p-2 rounded">
                      {['Dashboard', 'Documents', 'Compliance', 'AI Engine', 'Reports', 'Certification', 'Audit', 'Integrations', 'Administration'].map(perm => (
                        <label key={perm} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-mono cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={newRolePerms[perm]}
                            onChange={() => setNewRolePerms({ ...newRolePerms, [perm]: !newRolePerms[perm] })}
                            className="accent-emerald-600 rounded"
                          />
                          <span>{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition"
                  >
                    {isRTL ? 'إقرار وإضافة الدور المخصص' : 'Publish Custom Role'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 5. SUBSCRIPTION & BILLING */}
        {adminTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'خطط الاشتراكات وبوابة الدفع الفوترة' : 'Platform Subscriptions & Billing Engine'}</h3>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Plans matrix comparison table */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {[
                  { plan: 'Starter', price: '$299/mo', users: 5, storage: '20 GB', ai: '2,000 runs', erp: '1', api: 'No' },
                  { plan: 'Professional', price: '$1,250/mo', users: 15, storage: '100 GB', ai: '20,000 runs', erp: '2', api: 'Yes' },
                  { plan: 'Enterprise', price: '$4,500/mo', users: 100, storage: '500 GB', ai: '100,000 runs', erp: '5', api: 'Yes' },
                  { plan: 'Custom (FinTech Sovereign)', price: 'Custom Quote', users: 'Unlimited', storage: 'Multi-TB', ai: 'Enterprise SLA', erp: 'Unlimited', api: 'Dedicated' }
                ].map((tier, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3 relative overflow-hidden">
                    <span className="font-bold text-slate-900 dark:text-white block">{tier.plan}</span>
                    <span className="text-xl font-black text-emerald-600 block mt-1">{tier.price}</span>
                    <div className="space-y-1.5 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>Users: {tier.users}</div>
                      <div>Storage: {tier.storage}</div>
                      <div>AI Analysis: {tier.ai}</div>
                      <div>ERP connections: {tier.erp}</div>
                      <div>API access: {tier.api}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoices List */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{isRTL ? 'آخر الفواتير والمعاملات الصادرة:' : 'Platform Core Invoice Trail:'}</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Invoice ID</th>
                        <th className="p-3">Customer Entity</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Billed Cycle</th>
                        <th className="p-3">Billing System Integration</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
                      {invoices.map(inv => (
                        <tr key={inv.id}>
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{inv.id}</td>
                          <td className="p-3">{inv.customer}</td>
                          <td className="p-3 font-sans font-bold">{inv.plan}</td>
                          <td className="p-3 text-slate-400">{inv.date}</td>
                          <td className="p-3 text-indigo-500 font-sans font-bold">{inv.method}</td>
                          <td className="p-3 font-sans font-black">{inv.amount}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {inv.status}
                            </span>
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

        {/* 6. USAGE ANALYTICS */}
        {adminTab === 'usage' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إحصائيات استخدام الخدمات السحابية والـ API' : 'SaaS Consumption Monitor'}</h3>
                <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Usage Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {[
                  { name: 'AI Requests', current: 61400, limit: 122000, color: 'bg-emerald-500' },
                  { name: 'Documents Processed', current: 515, limit: 1000, color: 'bg-indigo-500' },
                  { name: 'ERP TransactionsSynced', current: 2274500, limit: 6200000, color: 'bg-amber-500' },
                  { name: 'API Gateway Invocations', current: 2450000, limit: 6200000, color: 'bg-cyan-500' }
                ].map((usage, i) => {
                  const percent = Math.min(100, Math.round((usage.current / usage.limit) * 100));
                  return (
                    <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
                      <span className="font-sans font-bold text-slate-900 dark:text-white block text-xs">{usage.name}</span>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                        <span>Current Month: {usage.current.toLocaleString()}</span>
                        <span>SLA Threshold</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${percent}%` }} className={`h-full ${usage.color}`} />
                      </div>
                      <span className="text-[9px] text-slate-400 block text-right font-mono">{percent}% of limit ({usage.limit.toLocaleString()})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 7. SECURITY CENTER */}
        {adminTab === 'security' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إعدادات جدار الحماية وحماية البيانات والتشفير' : 'SaaS Global Security & Encryption Center'}</h3>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Active policies controls */}
                <div className="space-y-4">
                  <span className="font-bold text-slate-900 dark:text-white block">{isRTL ? 'تخصيص سياسات أمان المؤسسات:' : 'Configure Global Access Policies:'}</span>

                  {securityPolicies.map(policy => (
                    <div key={policy.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                      <span className="font-mono font-bold text-emerald-600 block">Organization Policy: {policy.organizationId}</span>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isRTL ? 'طول كلمة السر الأدنى:' : 'Min Password Length:'}</span>
                          <select
                            value={policy.settings.minPasswordLength}
                            onChange={(e) => handleUpdateSecurityPolicy(policy.organizationId, 'minPasswordLength', parseInt(e.target.value))}
                            className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="8">8 Characters</option>
                            <option value="12">12 Characters (Recommended)</option>
                            <option value="16">16 Characters</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isRTL ? 'صلاحية كلمة السر (أيام):' : 'Password Expiry Interval:'}</span>
                          <select
                            value={policy.settings.passwordExpiryDays}
                            onChange={(e) => handleUpdateSecurityPolicy(policy.organizationId, 'passwordExpiryDays', parseInt(e.target.value))}
                            className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="30">30 Days</option>
                            <option value="90">90 Days</option>
                            <option value="180">180 Days</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isRTL ? 'التحقق الثنائي الرقمي MFA:' : 'Require Multi-factor Auth (MFA):'}</span>
                          <button
                            onClick={() => handleUpdateSecurityPolicy(policy.organizationId, 'mfaRequired', !policy.settings.mfaRequired)}
                            className={`px-3 py-1 rounded text-[10px] font-bold border transition ${
                              policy.settings.mfaRequired
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                            }`}
                          >
                            {policy.settings.mfaRequired ? 'Forced MFA Enforced' : 'Optional'}
                          </button>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isRTL ? 'مدة مهلة انتهاء الجلسة (دقائق):' : 'Session Idle Timeout:'}</span>
                          <select
                            value={policy.settings.sessionTimeoutMinutes}
                            onChange={(e) => handleUpdateSecurityPolicy(policy.organizationId, 'sessionTimeoutMinutes', parseInt(e.target.value))}
                            className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60">60 Minutes</option>
                          </select>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">{isRTL ? 'تكرار محاولات تسجيل الدخول الخاطئة:' : 'Max Failed Login Retries:'}</span>
                          <select
                            value={policy.settings.maxFailedLoginAttempts}
                            onChange={(e) => handleUpdateSecurityPolicy(policy.organizationId, 'maxFailedLoginAttempts', parseInt(e.target.value))}
                            className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-xs focus:outline-none"
                          >
                            <option value="3">3 Attempts</option>
                            <option value="5">5 Attempts</option>
                            <option value="10">10 Attempts</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Database Encryption and Compliance Standard Checkpoints */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4">
                  <span className="font-bold text-slate-900 dark:text-white block">{isRTL ? 'بروتوكولات الأمان السحابية وتكامل التشفير:' : 'Cloud Host Hardware Cryptography Status:'}</span>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-slate-500 font-sans">Database Encryption</span>
                      <span className="text-emerald-600 font-bold">AES-256 Enabled</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-slate-500 font-sans">Hardware Cryptography Module</span>
                      <span className="text-emerald-600 font-bold">FIPS 140-2 Compliant</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-slate-500 font-sans">API Transport Layer Shield</span>
                      <span className="text-emerald-600 font-bold">TLS 1.3 Imposed</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-2">
                      Sovereign data hosting complies entirely with Riyadh and SAMA digital finance storage regulatory benchmarks. All keys are rotated automatically via Google Cloud KMS every 90 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. COMPLETE AUDIT LOG SYSTEM */}
        {adminTab === 'audit' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'سجل العمليات والامتثال للمشرفين' : 'Continuous Platform Audit Trail'}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">{isRTL ? 'قائمة المتابعة والتدقيق والنشاطات المستمرة.' : 'Immutable trace logs of platform operators actions.'}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  >
                    <option value="All">All Modules</option>
                    <option value="Security">Security</option>
                    <option value="Documents">Documents</option>
                    <option value="AI Engine">AI Engine</option>
                    <option value="Integrations">Integrations</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="pl-3 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 focus:outline-none w-48"
                  />
                </div>
              </div>

              {/* Log stream Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase border-b border-slate-150 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Scope Module</th>
                      <th className="p-3">Client IP</th>
                      <th className="p-3">Operational Details</th>
                      <th className="p-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                    {filteredAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                        <td className="p-3">
                          <span className="font-sans font-bold text-slate-900 dark:text-white block">{log.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{log.userEmail}</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 font-sans font-semibold text-slate-500">{log.module}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{log.ipAddress}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 font-sans text-[11px]">{log.details}</td>
                        <td className="p-3 text-right text-slate-400 text-[10px] whitespace-nowrap">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 9. SYSTEM ACTIVITY MONITOR */}
        {adminTab === 'jobs' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'العمليات الخلفية وحالة خادم البيانات' : 'System Activity & Database Status'}</h3>
                <Server className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 text-emerald-600 space-y-1">
                  <span className="font-sans text-slate-400 block">PostgreSQL Primary DB</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Operational (Connection Pool: 42/100)</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 text-emerald-600 space-y-1">
                  <span className="font-sans text-slate-400 block">Redis Session Cache</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Operational (Active sessions: 1,412)</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-emerald-500/5 text-emerald-600 space-y-1">
                  <span className="font-sans text-slate-400 block">Object Storage Vault</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Operational (Capacity: 852.2 GB / 2.0 TB)</span>
                  </div>
                </div>
              </div>

              {/* Background Jobs */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{isRTL ? 'مجدول العمليات والمهام التلقائية خلف الكواليس:' : 'Active & Scheduled Background System Tasks:'}</span>
                <div className="space-y-2">
                  {systemJobs.map(job => (
                    <div key={job.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{job.jobName}</span>
                        <p className="text-[10px] text-slate-400 mt-1">Started: {job.startedAt} {job.completedAt ? `• Finished: ${job.completedAt}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {job.status === 'Running' && (
                          <div className="w-24 bg-slate-150 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${job.progress}%` }} className="bg-emerald-500 h-full" />
                          </div>
                        )}
                        <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                          job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          job.status === 'Running' ? 'bg-indigo-500/10 text-indigo-600 animate-pulse' :
                          job.status === 'Failed' ? 'bg-red-500/10 text-red-500 animate-bounce' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {job.status}
                        </span>
                        {job.status !== 'Running' && (
                          <button
                            onClick={() => handleToggleAiAgent && handleTriggerManualBackgroundJob(job.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                          >
                            Invoke Run
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. AI CONFIGURATION & GOVERNANCE */}
        {adminTab === 'ai_config' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إعدادات وحوكمة نماذج الذكاء الاصطناعي الشارعي' : 'AI Models Governance & Security Gates'}</h3>
                <Cpu className="w-4 h-4 text-emerald-500" />
              </div>

              {/* AI performance score */}
              <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs flex justify-between items-center">
                <div>
                  <span className="font-sans font-bold text-slate-900 dark:text-white block">{isRTL ? 'نقاط دقة الأداء العام للذكاء الاصطناعي' : 'Global AI Accuracy Governance Rating'}</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Evaluated against 150 independent manual Sharia scholar board reviews in real production. Total human overrides: 87. Correct overrides: 32.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-display font-black text-emerald-600 block">98.3%</span>
                  <span className="text-[9px] text-slate-400 font-mono">SLA TARGET &gt; 95%</span>
                </div>
              </div>

              {/* Agent Settings Checklist with sliders */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{isRTL ? 'تخصيص مستويات الثقة والتنشيط للمساعدين الذكيين:' : 'Modify AI Agent Execution Thresholds & Gatekeepers:'}</span>

                {(Object.entries(aiAgents) as [string, {
                  enabled: boolean;
                  confidenceThreshold: number;
                  humanReviewRequired: boolean;
                  model: string;
                  decisionsCount: number;
                  overridesCount: number;
                  feedbackScore: number;
                }][]).map(([agentName, agent]) => (
                  <div key={agentName} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{agentName} Agent</span>
                        <span className="text-[10px] text-slate-400 font-mono">Base model: {agent.model}</span>
                      </div>
                      <button
                        onClick={() => handleToggleAiAgent(agentName)}
                        className={`px-3 py-1 rounded text-[10px] font-bold border transition ${
                          agent.enabled
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20 line-through opacity-60'
                        }`}
                      >
                        {agent.enabled ? 'Active Agent' : 'Offline'}
                      </button>
                    </div>

                    {agent.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* confidence threshold */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-slate-400">Confidence Cutoff Threshold:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{agent.confidenceThreshold}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="98"
                            value={agent.confidenceThreshold}
                            onChange={(e) => handleUpdateAiConfidence(agentName, parseInt(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* trigger requirement */}
                        <div className="flex justify-between items-center font-mono text-[10px]">
                          <span className="text-slate-400">Force Scholar Board Over-sign:</span>
                          <button
                            onClick={() => {
                              setAiAgents(prev => ({
                                ...prev,
                                [agentName]: { ...prev[agentName], humanReviewRequired: !prev[agentName].humanReviewRequired }
                              }));
                            }}
                            className={`px-2 py-0.5 rounded font-bold border transition ${
                              agent.humanReviewRequired
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800'
                            }`}
                          >
                            {agent.humanReviewRequired ? 'Review Required' : 'Auto Bypass'}
                          </button>
                        </div>

                        {/* governance stats */}
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>Verified Decisions: {agent.decisionsCount}</span>
                          <span className="text-emerald-500">Feedback Rating: {agent.feedbackScore}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 11. INTEGRATION & WEBHOOKS */}
        {adminTab === 'integrations' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إدارة الموصلات والربط والويب هوكس للمطورين' : 'Enterprise Connectors & Webhooks Console'}</h3>
                <Network className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Integrations checklist */}
              <div className="space-y-3">
                {integrationConnectors.map(conn => (
                  <div key={conn.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-sans text-slate-900 dark:text-white">{conn.name}</span>
                        <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[9px] font-bold">{conn.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Average Payload Roundtrip: {conn.latency} • Synced Actions: {conn.syncedTransactions}</p>
                    </div>
                    <div className="flex items-center gap-2 font-sans shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        conn.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {conn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ====================================================
          12. SYSTEM SETTINGS CENTER (Requirement 17 & 18)
          ==================================================== */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مركز ضبط الإعدادات العامة لبيئة الـ SaaS' : 'Global Platform Environmental Settings'}</h3>
            <p className="text-[10px] text-slate-400 mt-1">{isRTL ? 'إدارة الإعدادات والخصائص للموقع والبريد واللغات للتوطين والاتصال بالخوادم.' : 'Modify low-level cluster environment, localization arrays, and relational database cache constants.'}</p>
          </div>
          <Settings className="w-4 h-4 text-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {systemSettings.map(setting => (
            <div key={setting.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center gap-4">
              <div>
                <span className="text-[9px] bg-slate-200 dark:bg-slate-800 font-mono font-bold px-2 py-0.5 rounded text-slate-500 uppercase">{setting.category}</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-1.5">{setting.setting}</span>
                {editingSettingId === setting.id ? (
                  <input
                    type="text"
                    value={editingSettingValue}
                    onChange={(e) => setEditingSettingValue(e.target.value)}
                    className="mt-1 bg-white dark:bg-slate-800 border p-1 rounded text-xs focus:outline-none w-48"
                  />
                ) : (
                  <span className="text-slate-500 font-mono block mt-1">{setting.value}</span>
                )}
              </div>
              <div className="shrink-0">
                {editingSettingId === setting.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveSystemSetting(setting.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSettingId(null)}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] px-2.5 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingSettingId(setting.id);
                      setEditingSettingValue(setting.value);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded"
                  >
                    Edit Value
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
