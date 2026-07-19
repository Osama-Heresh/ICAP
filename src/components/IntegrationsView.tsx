import React, { useState, useEffect } from 'react';
import AdvancedErpSimulator from './AdvancedErpSimulator';
import {
  Database,
  Cpu,
  RefreshCw,
  Play,
  Check,
  X,
  AlertTriangle,
  Activity,
  Code,
  FileText,
  Key,
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  Shield,
  Workflow,
  Network,
  Zap,
  TrendingUp,
  BarChart2,
  PieChart,
  Sliders,
  HelpCircle,
  Clock,
  ArrowRight,
  Terminal,
  CheckCircle,
  ChevronRight,
  Upload,
  Globe,
  Settings,
  Eye
} from 'lucide-react';
import {
  Integration,
  ErpConnector,
  SyncJob,
  SyncLog,
  DataMapping,
  ErpCustomer,
  ErpVendor,
  ErpInvoice,
  ErpPayment,
  ErpJournalEntry,
  ErpAccount,
  ErpAsset,
  ErpEmployee,
  ErpContract
} from '../types';
import {
  DEMO_ERP_CONNECTORS,
  DEMO_INTEGRATIONS,
  DEMO_SYNC_LOGS,
  DEMO_DATA_MAPPINGS,
  DEMO_ERP_ERRORS,
  ErpErrorRecord,
  CANONICAL_CUSTOMERS,
  CANONICAL_VENDORS,
  CANONICAL_INVOICES,
  CANONICAL_PAYMENTS,
  CANONICAL_JOURNAL_ENTRIES,
  CANONICAL_ACCOUNTS,
  CANONICAL_ASSETS,
  CANONICAL_EMPLOYEES,
  CANONICAL_CONTRACTS
} from '../data';

interface IntegrationsViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function IntegrationsView({
  locale,
  theme,
  onTriggerActivityLog
}: IntegrationsViewProps) {
  const isRTL = locale === 'ar';

  // Sub tab navigation inside Integrations
  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'connected' | 'marketplace' | 'mapping' | 'jobs' | 'api' | 'sdk' | 'simulator'
  >('simulator');

  // Helper for safe localStorage parsing
  const getStoredItem = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved) as T;
    } catch (e) {
      console.warn(`Error parsing Integrations localStorage key "${key}":`, e);
      return fallback;
    }
  };

  // Integrations state (Local persistence mirror)
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    return getStoredItem<Integration[]>('icap_integrations_list', DEMO_INTEGRATIONS);
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    return getStoredItem<SyncLog[]>('icap_sync_logs_list', DEMO_SYNC_LOGS);
  });

  const [mappings, setMappings] = useState<DataMapping[]>(() => {
    return getStoredItem<DataMapping[]>('icap_data_mappings_list', DEMO_DATA_MAPPINGS);
  });

  const [errors, setErrors] = useState<ErpErrorRecord[]>(() => {
    return getStoredItem<ErpErrorRecord[]>('icap_erp_errors_list', DEMO_ERP_ERRORS);
  });

  // State synchronization
  useEffect(() => {
    localStorage.setItem('icap_integrations_list', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('icap_sync_logs_list', JSON.stringify(syncLogs));
  }, [syncLogs]);

  useEffect(() => {
    localStorage.setItem('icap_data_mappings_list', JSON.stringify(mappings));
  }, [mappings]);

  useEffect(() => {
    localStorage.setItem('icap_erp_errors_list', JSON.stringify(errors));
  }, [errors]);

  // Connection Setup Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    erpSystem: 'odoo',
    name: '',
    apiUrl: '',
    apiKey: '',
    username: '',
    password: '',
    dbName: '',
    environment: 'Sandbox' as 'Sandbox' | 'Production' | 'Staging',
    selectedModules: ['Accounting', 'Customers', 'Invoices', 'Payments', 'Journal Entries'] as string[],
    syncType: 'Automatic' as 'Automatic' | 'Manual',
    frequency: 'Daily' as 'Hourly' | 'Daily' | 'Weekly'
  });

  // Wizard Connection Test Simulator
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latency: number; modules: string[] } | null>(null);

  // Synchronization Job progress states
  const [activeSyncJob, setActiveSyncJob] = useState<{
    integrationId: string;
    systemName: string;
    status: 'Connecting' | 'Fetching' | 'Transforming' | 'Validating' | 'Completed' | 'Failed';
    progress: number;
    currentModule: string;
    recordsImported: number;
  } | null>(null);

  // Mapping state
  const [mappingErpFilter, setMappingErpFilter] = useState<string>('odoo');
  const [newMapSource, setNewMapSource] = useState('');
  const [newMapTarget, setNewMapTarget] = useState('customer.name');
  const [newMapTransform, setNewMapTransform] = useState('');

  // Canonical Viewer state
  const [canonicalTab, setCanonicalTab] = useState<
    'customer' | 'vendor' | 'invoice' | 'payment' | 'journal' | 'account' | 'asset' | 'employee' | 'contract'
  >('customer');

  // Error resolve modal / state
  const [resolvingErrorId, setResolvingErrorId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  // API credentials management states
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; status: 'Active' | 'Revoked'; created: string }[]>([
    { id: 'key-1', name: 'Al-Noor Odoo Adapter Key', key: 'icap_live_a8df3902fcd48924a87b320df', status: 'Active', created: '2026-02-10' },
    { id: 'key-2', name: 'External Sandbox Auditor Token', key: 'icap_test_9041cd8d482937afcb820feee', status: 'Active', created: '2026-06-15' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // Webhook states
  const [webhooks, setWebhooks] = useState<{ id: string; url: string; events: string[]; status: 'Active' | 'Inactive' }[]>([
    { id: 'wh-1', url: 'https://odoo.alnoor-finance.com/webhooks/icap-sync', events: ['Journal Entry Fired', 'Invoice Created'], status: 'Active' }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['Journal Entry Fired']);

  // Translation bundle
  const t = {
    title: isRTL ? 'إطار تكامل الأنظمة والمؤسسات الموحد' : 'Universal ERP Integration Framework',
    desc: isRTL 
      ? 'اربط أنظمة المحاسبة والمخازن المختلفة (Odoo, SAP, Oracle, ERPNext) وحوّل بياناتها إلى نموذج بيانات موحد للفحص الشرعي التلقائي.'
      : 'Connect heterogeneous ERP systems and map multi-ledger transactions directly into ICAP canonical compliance formats.',
    dashboard: isRTL ? 'لوحة قيادة التكامل' : 'Integration Dashboard',
    simulator: isRTL ? 'مكتبة الموصلات والمحاكاة' : 'Connector Library & Simulator',
    connected: isRTL ? 'الأنظمة المتصلة' : 'Connected Systems',
    marketplace: isRTL ? 'سوق الموصلات' : 'Connector Marketplace',
    mapping: isRTL ? 'تخطيط ومطابقة البيانات' : 'Data Mapping',
    jobs: isRTL ? 'عمليات المزامنة الجارية' : 'Synchronization Jobs',
    api: isRTL ? 'إدارة الـ API والـ Webhooks' : 'API Management',
    sdk: isRTL ? 'حقيبة المطورين SDK' : 'Developer SDK',
    addConnection: isRTL ? 'ربط نظام ERP جديد' : 'Connect New ERP System',
    noIntegrations: isRTL ? 'لا توجد أنظمة متصلة حالياً.' : 'No ERP connectors active.',
    syncNow: isRTL ? 'مزامنة الآن' : 'Sync Now',
    testConn: isRTL ? 'فحص الاتصال' : 'Test Connection',
    activeJobs: isRTL ? 'العمليات النشطة' : 'Active sync jobs',
    canonicalViewer: isRTL ? 'مستعرض البيانات الموحدة (Canonical View)' : 'Canonical Unified Data Model'
  };

  // Helper stats
  const totalConnected = integrations.filter(i => i.status === 'Connected').length;
  const totalSuccessfulSyncs = syncLogs.filter(l => l.status === 'Success').length + 241; // demo multiplier
  const totalFailedJobs = errors.filter(e => e.status === 'Open').length;
  const totalRecordsImported = '2.56 Million';

  // Wizard triggers
  const handleNextStep = () => setWizardStep(prev => Math.min(prev + 1, 5));
  const handlePrevStep = () => setWizardStep(prev => Math.max(prev - 1, 1));

  // Run Test Connection Simulation
  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult({
        success: wizardData.apiUrl.trim() !== '' && !wizardData.apiUrl.includes('error'),
        latency: Math.floor(Math.random() * 240) + 60,
        modules: wizardData.selectedModules
      });
    }, 1500);
  };

  // Create Connection
  const handleCreateConnection = () => {
    const typeMap: Record<string, any> = {
      odoo: 'odoo',
      sap: 'sap',
      oracle: 'oracle',
      dynamics: 'dynamics',
      erpnext: 'erpnext',
      netsuite: 'netsuite',
      custom: 'custom'
    };

    const newInt: Integration = {
      id: `int-${Date.now()}`,
      organizationId: 'org-al-noor',
      type: typeMap[wizardData.erpSystem] || 'custom',
      name: wizardData.name || `${wizardData.erpSystem.toUpperCase()} Integration`,
      status: 'Connected',
      credentials: {
        apiUrl: wizardData.apiUrl,
        apiKey: wizardData.apiKey,
        username: wizardData.username,
        password: wizardData.password,
        dbName: wizardData.dbName,
        environment: wizardData.environment
      },
      createdAt: new Date().toISOString()
    };

    setIntegrations([...integrations, newInt]);
    setShowWizard(false);
    setWizardStep(1);
    setTestResult(null);

    // Create default mapping entries for new integration
    const standardMaps: DataMapping[] = [
      { id: `map-new-${Date.now()}-1`, organizationId: 'org-al-noor', erpType: wizardData.erpSystem, sourceField: 'partner_name', targetField: 'customer.name' },
      { id: `map-new-${Date.now()}-2`, organizationId: 'org-al-noor', erpType: wizardData.erpSystem, sourceField: 'total_amount', targetField: 'invoice.amount' }
    ];
    setMappings([...mappings, ...standardMaps]);

    onTriggerActivityLog('CONNECT_ERP', `Connected new ERP: "${newInt.name}" (${newInt.type.toUpperCase()})`);
  };

  // Run Real-time Sync Simulator
  const handleRunSync = (integration: Integration) => {
    setActiveSyncJob({
      integrationId: integration.id,
      systemName: integration.name,
      status: 'Connecting',
      progress: 5,
      currentModule: 'Authentication Handshake',
      recordsImported: 0
    });
    setActiveSubTab('jobs');

    const steps: { status: typeof activeSyncJob.status; progress: number; currentModule: string; recordDelta: number }[] = [
      { status: 'Connecting', progress: 15, currentModule: 'Verifying Security Tokens & Environment TLS', recordDelta: 0 },
      { status: 'Fetching', progress: 35, currentModule: 'Extracting Customers, Vendors & Account Ledger segments', recordDelta: 4500 },
      { status: 'Fetching', progress: 55, currentModule: 'Downloading Invoices, Payments, & Physical Asset serial logs', recordDelta: 12000 },
      { status: 'Transforming', progress: 75, currentModule: 'Translating ERP schemas into Canonical Sharia-compliant model', recordDelta: 0 },
      { status: 'Validating', progress: 90, currentModule: 'Executing Purge Checks & AAOIFI Standard No. 8 constraints', recordDelta: 0 },
      { status: 'Completed', progress: 100, currentModule: 'Synchronized successfully. Local vector store index rebuilt.', recordDelta: 2450 }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex >= steps.length) {
        clearInterval(interval);
        // Add sync log record
        const newLog: SyncLog = {
          id: `log-sync-${Date.now()}`,
          syncJobId: `job-gen-${Date.now()}`,
          records: steps.reduce((sum, s) => sum + s.recordDelta, 0),
          errors: Math.random() > 0.8 ? 1 : 0,
          duration: '6.4s',
          systemName: integration.name,
          date: new Date().toISOString().replace('T', ' ').split('.')[0],
          status: 'Success',
          details: `Manual sync completed. Extracted and transformed ${steps.reduce((sum, s) => sum + s.recordDelta, 0)} records into canonical state.`
        };

        setSyncLogs(prev => [newLog, ...prev]);
        setActiveSyncJob(null);
        onTriggerActivityLog('SYNC_ERP', `Completed data sync with ERP: "${integration.name}"`);

        if (newLog.errors > 0) {
          const newErr: ErpErrorRecord = {
            id: `err-${Date.now()}`,
            errorType: 'Missing Account Code',
            record: 'Invoice ID INV-99042',
            reason: 'Invoice was imported without a conforming double-entry ledger category.',
            solution: 'Define mapping parameter inside data mapping panel.',
            status: 'Open',
            systemName: integration.name
          };
          setErrors(prev => [newErr, ...prev]);
        }
        return;
      }

      const activeStep = steps[currentStepIndex];
      setActiveSyncJob(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: activeStep.status,
          progress: activeStep.progress,
          currentModule: activeStep.currentModule,
          recordsImported: prev.recordsImported + activeStep.recordDelta
        };
      });

      currentStepIndex++;
    }, 1100);
  };

  // Add customized mapping field
  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapSource) return;

    const newMap: DataMapping = {
      id: `map-${Date.now()}`,
      organizationId: 'org-al-noor',
      erpType: mappingErpFilter,
      sourceField: newMapSource,
      targetField: newMapTarget,
      customTransformation: newMapTransform || undefined
    };

    setMappings([...mappings, newMap]);
    setNewMapSource('');
    setNewMapTransform('');
    onTriggerActivityLog('MAPPING_CREATE', `Mapped field "${newMapSource}" to Canonical Target "${newMapTarget}"`);
  };

  // Delete mapping
  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  // Resolve errors
  const handleResolveError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingErrorId || !resolutionText) return;

    setErrors(errors.map(err => {
      if (err.id === resolvingErrorId) {
        return { ...err, status: 'Resolved' as const, solution: resolutionText };
      }
      return err;
    }));

    setResolvingErrorId(null);
    setResolutionText('');
    onTriggerActivityLog('RESOLVE_ERP_ERROR', `Resolved ERP sync error with code description.`);
  };

  // Generate API keys
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `icap_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status: 'Active' as const,
      created: new Date().toISOString().split('T')[0]
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    onTriggerActivityLog('API_KEY_CREATE', `Created API credentials for: "${newKey.name}"`);
  };

  // Toggle API key status
  const handleToggleKey = (id: string) => {
    setApiKeys(apiKeys.map(k => {
      if (k.id === id) {
        return { ...k, status: k.status === 'Active' ? 'Revoked' : 'Active' };
      }
      return k;
    }));
  };

  // Create Webhook
  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl) return;

    const newWh = {
      id: `wh-${Date.now()}`,
      url: newWebhookUrl,
      events: newWebhookEvents,
      status: 'Active' as const
    };

    setWebhooks([...webhooks, newWh]);
    setNewWebhookUrl('');
    onTriggerActivityLog('WEBHOOK_CREATE', `Configured incoming webhook receiver at: "${newWh.url}"`);
  };

  // Disable integration
  const handleToggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => {
      if (int.id === id) {
        const nextStatus = int.status === 'Connected' ? 'Disconnected' : 'Connected';
        onTriggerActivityLog('TOGGLE_ERP', `${nextStatus === 'Connected' ? 'Enabled' : 'Disabled'} connection "${int.name}"`);
        return { ...int, status: nextStatus };
      }
      return int;
    }));
  };

  return (
    <div id="erp-integration-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Tab Header and Sub Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-600" />
            {t.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
        </div>
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          {(['dashboard', 'simulator', 'connected', 'marketplace', 'mapping', 'jobs', 'api', 'sdk'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`text-xs font-bold px-3 py-2 rounded-md transition ${
                activeSubTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t[tab as keyof typeof t] || tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. INTEGRATION DASHBOARD */}
      {/* ==================================================== */}
      {activeSubTab === 'dashboard' && (
        <div id="erp-dashboard-tab" className="space-y-6 animate-fade-in">
          {/* Main KPI Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'الأنظمة المتصلة' : 'Connected Systems'}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-bold text-slate-900">{totalConnected}</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'عمليات المزامنة الناجحة' : 'Successful Syncs'}</span>
              <span className="text-2xl font-display font-bold text-emerald-600">{totalSuccessfulSyncs}</span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'الأخطاء والطلبات المفتوحة' : 'Failed Sync Jobs'}</span>
              <span className={`text-2xl font-display font-bold ${totalFailedJobs > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                {totalFailedJobs}
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'سجلات تم فحصها واستيرادها' : 'Records Imported'}</span>
              <span className="text-2xl font-display font-bold text-slate-900">{totalRecordsImported}</span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'آخر مزامنة عامة' : 'Last Synchronization'}</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Interactive Native SVG Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Data Volume & Records Synced Over Time */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{isRTL ? 'معدل استيراد السجلات الشهري (بالآلاف)' : 'Monthly Data Volume Synced (in Thousands)'}</h4>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">Unified Ledger Volume</span>
              </div>
              <div className="relative pt-2">
                <svg className="w-full h-44" viewBox="0 0 500 160">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* SVG Area Under Path */}
                  <path
                    d="M 40 140 L 40 110 L 120 90 L 200 120 L 280 50 L 360 40 L 440 25 L 480 20 L 480 140 Z"
                    fill="url(#grad-volume)"
                    opacity="0.15"
                  />
                  {/* SVG Line */}
                  <path
                    d="M 40 110 Q 120 80, 200 120 T 360 40 T 480 20"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  <circle cx="40" cy="110" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="120" cy="90" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="200" cy="120" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="280" cy="50" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="360" cy="40" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="440" cy="25" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="480" cy="20" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

                  {/* X Axis Labels */}
                  <text x="40" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Jan</text>
                  <text x="120" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Feb</text>
                  <text x="200" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Mar</text>
                  <text x="280" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Apr</text>
                  <text x="360" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">May</text>
                  <text x="440" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Jun</text>
                  <text x="480" y="155" fill="#94a3b8" fontSize="9" textAnchor="middle">Jul</text>

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="grad-volume" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Chart 2: Sync Status & ERP distribution */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{isRTL ? 'توزيع حجم البيانات حسب موصلات الـ ERP' : 'Data Footprint Distribution by ERP Source'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Custom SVG Pie Chart */}
                <div className="flex justify-center sm:col-span-1">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                    {/* Odoo segment (65%) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="16" strokeDasharray="163 251" strokeDashoffset="0" />
                    {/* ERPNext segment (25%) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="63 251" strokeDashoffset="-163" />
                    {/* Others segment (10%) */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeDasharray="25 251" strokeDashoffset="-226" />
                  </svg>
                </div>
                {/* Legend list */}
                <div className="space-y-2 text-xs sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500" />Odoo (Al Noor)</span>
                    <span className="font-bold text-slate-800">1.82M (65%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" />ERPNext (Dar Al-Rayan)</span>
                    <span className="font-bold text-slate-800">640k (25%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-300" />Spreadsheets / XML</span>
                    <span className="font-bold text-slate-800">100k (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canonical Data Model Inspection Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3 border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{t.canonicalViewer}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{isRTL ? 'استعرض حقول وهياكل البيانات الحاكمة التي تصب فيها موصلات الـ ERP تلقائياً.' : 'Preview structural objects ingested by active pipelines mapped to standard canonical schemas.'}</p>
              </div>

              {/* Canonical schema navigation tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-lg">
                {[
                  { key: 'customer', label: isRTL ? 'العملاء' : 'Customer' },
                  { key: 'vendor', label: isRTL ? 'الموردين' : 'Vendor' },
                  { key: 'invoice', label: isRTL ? 'الفواتير' : 'Invoice' },
                  { key: 'payment', label: isRTL ? 'الدفعات' : 'Payment' },
                  { key: 'journal', label: isRTL ? 'القيود اليومية' : 'Journal Entry' },
                  { key: 'account', label: isRTL ? 'الحسابات' : 'Account' },
                  { key: 'asset', label: isRTL ? 'الأصول' : 'Asset' },
                  { key: 'employee', label: isRTL ? 'الموظفين' : 'Employee' },
                  { key: 'contract', label: isRTL ? 'العقود' : 'Contract' }
                ].map((ct) => (
                  <button
                    key={ct.key}
                    onClick={() => setCanonicalTab(ct.key as any)}
                    className={`text-[10px] font-bold px-2 py-1.5 rounded transition ${
                      canonicalTab === ct.key ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Unified Canonical database layout */}
            <div className="overflow-x-auto">
              {canonicalTab === 'customer' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">External ID</th>
                      <th className="p-3">{isRTL ? 'الاسم' : 'Name'}</th>
                      <th className="p-3">{isRTL ? 'البريد الإلكتروني' : 'Email'}</th>
                      <th className="p-3">{isRTL ? 'الدولة' : 'Country'}</th>
                      <th className="p-3">{isRTL ? 'النوع' : 'Type'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_CUSTOMERS.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{c.id}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{c.externalId}</td>
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 text-slate-600">{c.email}</td>
                        <td className="p-3">{c.country}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">{c.type}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'vendor' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">External ID</th>
                      <th className="p-3">{isRTL ? 'الاسم' : 'Name'}</th>
                      <th className="p-3">{isRTL ? 'التصنيف' : 'Category'}</th>
                      <th className="p-3">{isRTL ? 'الدولة' : 'Country'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_VENDORS.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{v.id}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{v.externalId}</td>
                        <td className="p-3 font-bold text-slate-900">{v.name}</td>
                        <td className="p-3 text-slate-600">{v.category}</td>
                        <td className="p-3">{v.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'invoice' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'رقم الفاتورة' : 'Invoice Number'}</th>
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">{isRTL ? 'المبلغ' : 'Amount'}</th>
                      <th className="p-3">{isRTL ? 'تاريخ الاستحقاق' : 'Date'}</th>
                      <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_INVOICES.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{inv.id}</td>
                        <td className="p-3 font-mono text-[10px] font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{inv.customerId}</td>
                        <td className="p-3 font-bold text-slate-800">{inv.amount.toLocaleString()} {inv.currency}</td>
                        <td className="p-3">{inv.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'payment' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">External ID</th>
                      <th className="p-3">{isRTL ? 'المبلغ' : 'Amount'}</th>
                      <th className="p-3">{isRTL ? 'تاريخ الدفع' : 'Payment Date'}</th>
                      <th className="p-3">{isRTL ? 'وسيلة الدفع' : 'Payment Method'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_PAYMENTS.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{p.id}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400">{p.externalId}</td>
                        <td className="p-3 font-bold text-emerald-600">{p.amount.toLocaleString()} {p.currency}</td>
                        <td className="p-3">{p.paymentDate}</td>
                        <td className="p-3 text-slate-600 font-semibold">{p.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'journal' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'الحساب المالي' : 'Account'}</th>
                      <th className="p-3">{isRTL ? 'مدين' : 'Debit'}</th>
                      <th className="p-3">{isRTL ? 'دائن' : 'Credit'}</th>
                      <th className="p-3">{isRTL ? 'التاريخ' : 'Date'}</th>
                      <th className="p-3">{isRTL ? 'البيان والتفاصيل' : 'Description'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_JOURNAL_ENTRIES.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{j.id}</td>
                        <td className="p-3 font-bold text-slate-900">{j.account}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">{j.debit > 0 ? `+${j.debit.toLocaleString()}` : '-'}</td>
                        <td className="p-3 font-mono font-bold text-red-500">{j.credit > 0 ? `+${j.credit.toLocaleString()}` : '-'}</td>
                        <td className="p-3 text-slate-500">{j.date}</td>
                        <td className="p-3 text-slate-700 font-medium">{j.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'account' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'رمز الحساب' : 'Account Code'}</th>
                      <th className="p-3">{isRTL ? 'اسم الحساب' : 'Account Name'}</th>
                      <th className="p-3">{isRTL ? 'الفئة الرئيسية' : 'Category'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_ACCOUNTS.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{a.id}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{a.accountCode}</td>
                        <td className="p-3 font-bold text-slate-700">{a.accountName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.category === 'Asset' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                          }`}>{a.category}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'asset' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'اسم الأصل المالي' : 'Asset Name'}</th>
                      <th className="p-3">{isRTL ? 'القيمة الشرائية' : 'Purchase Value'}</th>
                      <th className="p-3">{isRTL ? 'تاريخ التملك والضمان' : 'Acquisition Date'}</th>
                      <th className="p-3">{isRTL ? 'معدل الاستهلاك' : 'Depreciation'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_ASSETS.map((ast) => (
                      <tr key={ast.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{ast.id}</td>
                        <td className="p-3 font-bold text-slate-900">{ast.name}</td>
                        <td className="p-3 font-bold text-slate-800">{ast.value.toLocaleString()} USD</td>
                        <td className="p-3">{ast.purchaseDate}</td>
                        <td className="p-3 font-mono">{ast.depreciation}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'employee' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'الاسم' : 'Name'}</th>
                      <th className="p-3">{isRTL ? 'القسم والفرع' : 'Department'}</th>
                      <th className="p-3">{isRTL ? 'المسمى الوظيفي' : 'Position'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_EMPLOYEES.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{e.id}</td>
                        <td className="p-3 font-bold text-slate-900">{e.name}</td>
                        <td className="p-3 text-slate-600">{e.department}</td>
                        <td className="p-3 font-medium text-slate-800">{e.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {canonicalTab === 'contract' && (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                    <tr>
                      <th className="p-3">Canonical ID</th>
                      <th className="p-3">{isRTL ? 'عنوان العقد' : 'Title'}</th>
                      <th className="p-3">{isRTL ? 'الطرف الثاني (المورد)' : 'Vendor / Second Party'}</th>
                      <th className="p-3">{isRTL ? 'تاريخ البدء' : 'Start Date'}</th>
                      <th className="p-3">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</th>
                      <th className="p-3">{isRTL ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {CANONICAL_CONTRACTS.map((con) => (
                      <tr key={con.id} className="hover:bg-slate-50/40">
                        <td className="p-3 font-mono text-[10px] text-emerald-700 font-bold">{con.id}</td>
                        <td className="p-3 font-bold text-slate-900">{con.title}</td>
                        <td className="p-3 text-slate-700">{con.vendor}</td>
                        <td className="p-3">{con.startDate}</td>
                        <td className="p-3">{con.endDate}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">{con.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. CONNECTED SYSTEMS PAGE */}
      {/* ==================================================== */}
      {activeSubTab === 'connected' && (
        <div id="erp-connected-tab" className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'إدارة قنوات وموصلات الـ ERP الحالية' : 'Active ERP Connections Directory'}</h3>
            <button
              onClick={() => {
                setWizardStep(1);
                setShowWizard(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              {t.addConnection}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-150">
                <tr>
                  <th className="p-4">{isRTL ? 'اسم النظام' : 'System Name'}</th>
                  <th className="p-4">{isRTL ? 'نوع الموصل' : 'Type'}</th>
                  <th className="p-4">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="p-4">{isRTL ? 'البيئة الافتراضية' : 'Environment'}</th>
                  <th className="p-4">{isRTL ? 'العنوان' : 'Endpoint URL'}</th>
                  <th className="p-4">{isRTL ? 'تاريخ الربط' : 'Connected Date'}</th>
                  <th className="p-4 text-center">{isRTL ? 'الإجراءات والحركات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {integrations.length > 0 ? (
                  integrations.map((int) => {
                    const connInfo = DEMO_ERP_CONNECTORS.find(c => c.id === int.type);
                    return (
                      <tr key={int.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{connInfo?.logo || '⚙️'}</span>
                            <div>
                              <span className="font-bold text-slate-900 block">{int.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block uppercase">{int.type} Adapter</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {connInfo?.type || 'API'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                            int.status === 'Connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${int.status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            {int.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-mono text-[10px] font-bold ${int.credentials.environment === 'Production' ? 'text-red-600' : 'text-slate-500'}`}>
                            {int.credentials.environment}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-slate-500 truncate max-w-[180px]">{int.credentials.apiUrl}</td>
                        <td className="p-4 text-slate-500">{new Date(int.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => handleRunSync(int)}
                              disabled={int.status !== 'Connected'}
                              className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 font-bold px-2 py-1.5 rounded border border-slate-200 transition flex items-center gap-1"
                              title={t.syncNow}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{isRTL ? 'مزامنة' : 'Sync'}</span>
                            </button>
                            <button
                              onClick={() => handleToggleIntegration(int.id)}
                              className={`text-xs font-bold px-2.5 py-1.5 rounded transition border ${
                                int.status === 'Connected' 
                                  ? 'border-red-100 bg-red-50 text-red-600 hover:bg-red-100' 
                                  : 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              {int.status === 'Connected' ? (isRTL ? 'تعطيل' : 'Disable') : (isRTL ? 'تفعيل' : 'Enable')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-400 italic">
                      {t.noIntegrations}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CONNECTOR MARKETPLACE */}
      {/* ==================================================== */}
      {activeSubTab === 'marketplace' && (
        <div id="erp-marketplace-tab" className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'دليل موصلات أنظمة الـ ERP المعتمدة لـ ICAP' : 'Certified Connector Store'}</h3>
            <p className="text-xs text-slate-400 mt-1">{isRTL ? 'اختر نظامك المحاسبي وقم بربطه فوراً لتشغيل محرك الفحص الآلي.' : 'Instantly boot ready-made adapters and sync real financial records securely.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {DEMO_ERP_CONNECTORS.map((connector) => {
              const alreadyConnected = integrations.some(i => i.type === connector.id);
              return (
                <div key={connector.id} className="bg-white border border-slate-200 hover:shadow-md transition p-5 rounded-xl flex flex-col justify-between min-h-[220px]">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-start">
                      <span className="text-4xl">{connector.logo}</span>
                      <span className="text-[9px] font-mono font-bold bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded">
                        {connector.version}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {connector.name}
                        {alreadyConnected && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Connector Type: {connector.type}</p>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{connector.description}</p>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">{isRTL ? 'الوحدات المدعومة:' : 'Supported Modules:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {connector.supportedModules.map((mod) => (
                          <span key={mod} className="bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-600 px-1.5 py-0.5 rounded">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-50 mt-4">
                    {alreadyConnected ? (
                      <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {isRTL ? 'مفعل ومتصل' : 'Active Channel'}</span>
                        <button
                          onClick={() => setActiveSubTab('connected')}
                          className="text-[10px] text-slate-500 hover:underline flex items-center gap-0.5"
                        >
                          {isRTL ? 'إدارة' : 'Manage'} <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setWizardData({ ...wizardData, erpSystem: connector.id, name: `${connector.name.replace(' Adapter', '').replace(' Connector', '')} Production` });
                          setWizardStep(1);
                          setShowWizard(true);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition text-center"
                      >
                        {isRTL ? 'إعداد وربط القناة' : 'Configure Integration'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. DATA MAPPING SYSTEM */}
      {/* ==================================================== */}
      {activeSubTab === 'mapping' && (
        <div id="erp-mapping-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Mapping Table / Rules list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'قواعد مطابقة حقول البيانات (Data Field Mapping Layout)' : 'Canonical Schema Mapping Templates'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'تخضع حقول الـ ERP لترجمة معيارية لتصب في حقول الفحص الشرعي الحاكمة لـ ICAP.' : 'Establish target conversion properties so incoming records resolve correctly.'}</p>
              </div>

              {/* ERP filter */}
              <div>
                <select
                  value={mappingErpFilter}
                  onChange={(e) => setMappingErpFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="odoo">Odoo Maps</option>
                  <option value="sap">SAP Maps</option>
                  <option value="dynamics">Dynamics Maps</option>
                  <option value="erpnext">ERPNext Maps</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                  <tr>
                    <th className="p-3.5">ERP Source Field</th>
                    <th className="p-3.5">Mapping Direction</th>
                    <th className="p-3.5">ICAP Canonical Field</th>
                    <th className="p-3.5">Custom Transformation Code</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mappings
                    .filter((m) => m.erpType === mappingErpFilter)
                    .map((map) => (
                      <tr key={map.id} className="hover:bg-slate-50/40">
                        <td className="p-3.5 font-mono text-[11px] text-slate-700 font-bold">{map.sourceField}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded text-[9px]">
                            MAPS TO <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-emerald-800 font-bold">{map.targetField}</td>
                        <td className="p-3.5 font-mono text-[10px] text-slate-500">{map.customTransformation || '-'}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleDeleteMapping(map.id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add custom mapping card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">{isRTL ? 'إضافة علاقة مطابقة جديدة' : 'Define Custom Field Map'}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{isRTL ? 'اربط البنود الخاصة بنظام المحاسبة بقاعدة البيانات الموحدة مباشرة.' : 'Convert local database table keys directly into ICAP canonical entities.'}</p>

            <form onSubmit={handleAddMapping} className="space-y-3 pt-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">ERP Source Database Column:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. x_sharia_purified_penalty_rate"
                  value={newMapSource}
                  onChange={(e) => setNewMapSource(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">ICAP Target Canonical Property:</label>
                <select
                  value={newMapTarget}
                  onChange={(e) => setNewMapTarget(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none"
                >
                  <option value="customer.name">customer.name (String)</option>
                  <option value="customer.email">customer.email (String)</option>
                  <option value="invoice.amount">invoice.amount (Decimal)</option>
                  <option value="invoice.date">invoice.date (Date)</option>
                  <option value="journal_entry.description">journal_entry.description (String)</option>
                  <option value="account.accountCode">account.accountCode (String)</option>
                  <option value="asset.value">asset.value (Decimal)</option>
                  <option value="contract.vendor">contract.vendor (String)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">Custom String transformation (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. TitleCase() or Prefix('LATE_PENALTY:')"
                  value={newMapTransform}
                  onChange={(e) => setNewMapTransform(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition mt-4"
              >
                {isRTL ? 'حفظ وتثبيت المطابقة' : 'Publish Mapping Rule'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. SYNCHRONIZATION JOBS */}
      {/* ==================================================== */}
      {activeSubTab === 'jobs' && (
        <div id="erp-jobs-tab" className="space-y-6 animate-fade-in">
          {/* Active Job progress bar */}
          {activeSyncJob && (
            <div className="bg-white border-2 border-emerald-500 rounded-xl p-6 shadow space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {isRTL ? 'جاري تشغيل عملية مزامنة البيانات وتطهيرها' : 'Execution Pipeline Active'}
                  </span>
                  <span className="text-slate-400 block mt-0.5">System: {activeSyncJob.systemName}</span>
                </div>
                <span className="text-emerald-700 font-bold text-sm">{activeSyncJob.progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${activeSyncJob.progress}%` }}
                />
              </div>

              {/* Granular Sync Steps mapping details */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 text-xs">
                {[
                  { id: 'Connecting', step: 1, label: isRTL ? 'الاتصال والمصادقة' : 'Secure handshake', active: activeSyncJob.progress >= 15 },
                  { id: 'Fetching', step: 2, label: isRTL ? 'استيراد البيانات' : 'Extracting Raw', active: activeSyncJob.progress >= 35 },
                  { id: 'Transforming', step: 3, label: isRTL ? 'التحويل المعياري' : 'Transform Canonical', active: activeSyncJob.progress >= 75 },
                  { id: 'Validating', step: 4, label: isRTL ? 'فحص الامتثال الشرعي' : 'Validate Sharia', active: activeSyncJob.progress >= 90 },
                  { id: 'Completed', step: 5, label: isRTL ? 'اكتمال المزامنة' : 'Rebuild Index', active: activeSyncJob.progress === 100 }
                ].map((s) => (
                  <div key={s.id} className={`border rounded-lg p-3 text-center ${s.active ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 text-slate-400'}`}>
                    <span className="text-[10px] block font-bold text-slate-400">Step {s.step}</span>
                    <span className="font-bold text-slate-800 block mt-1">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t pt-3 mt-4">
                <span>Current Module: <strong className="text-slate-600">{activeSyncJob.currentModule}</strong></span>
                <span>Records Processed: <strong className="text-emerald-600">{activeSyncJob.recordsImported.toLocaleString()}</strong></span>
              </div>
            </div>
          )}

          {/* Sync Jobs Logs list */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'سجلات حركات المزامنة السابقة (Sync Job Ledger)' : 'Historical Synchronization Ledger'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-150">
                  <tr>
                    <th className="p-3.5">Sync Job ID</th>
                    <th className="p-3.5">ERP Channel</th>
                    <th className="p-3.5">Sync Date</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">Records Imported</th>
                    <th className="p-3.5">Failed Records</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {syncLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/40">
                      <td className="p-3.5 font-mono text-[10px] text-emerald-700 font-bold">{log.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{log.systemName}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{log.date}</td>
                      <td className="p-3.5 font-mono text-[11px]">{log.duration}</td>
                      <td className="p-3.5 font-mono font-bold">{log.records.toLocaleString()}</td>
                      <td className="p-3.5 font-mono text-red-500 font-bold">{log.errors}</td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : log.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>{log.status}</span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-sm truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sync Errors Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'لوحة معالجة أخطاء توافق المزامنة (Schema Error Resolver)' : 'Schema & Transactional Error Management'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'يفحص النظام الحركات والقيود الشاذة التي تخرج عن النطاق الشامل لنسب الفائدة أو الترميز الصحيح.' : 'Strict validation catches entries violating AAOIFI constraints or missing structural ledger tags.'}</p>
            </div>

            <div className="space-y-3.5">
              {errors.map((err) => (
                <div key={err.id} className={`border rounded-xl p-4.5 ${err.status === 'Resolved' ? 'bg-slate-50/50 border-slate-200' : 'border-red-150 bg-red-50/10'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${err.status === 'Resolved' ? 'bg-slate-400' : 'bg-red-500 animate-pulse'}`} />
                        <span className="font-bold text-slate-800 text-xs">{err.errorType}</span>
                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono">{err.systemName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 block">Record: {err.record}</span>
                    </div>

                    <div>
                      {err.status === 'Resolved' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> {isRTL ? 'تم الحل والتسوية' : 'Resolved'}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setResolvingErrorId(err.id);
                            setResolutionText(`Map field or adjust ledger segment to compliant Account Code.`);
                          }}
                          className="bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          {isRTL ? 'إجراء تسوية وحل الخطأ' : 'Resolve & Re-Map'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Error Cause:</span>
                      <p className="mt-0.5 leading-relaxed">{err.reason}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">Recommended Action:</span>
                      <p className="mt-0.5 leading-relaxed">{err.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. API & WEBHOOK MANAGEMENT */}
      {/* ==================================================== */}
      {activeSubTab === 'api' && (
        <div id="erp-api-tab" className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Key Generation Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'رموز الأمان ومفاتيح الربط (API Keys)' : 'Integrator Access Tokens'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'أنتج مفاتيح أمان معماة لتمكين الأنظمة الخارجية من دفع البيانات المباشرة لـ ICAP.' : 'Issue secure bearer tokens for push connections from external middleware.'}</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {apiKeys.map((k) => (
                <div key={k.id} className="bg-slate-50 border p-3 rounded-xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{k.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Created: {k.created}</span>
                    <div className="flex items-center gap-1.5 mt-2 bg-white px-2 py-1.5 rounded border border-slate-150 w-fit">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[10px] tracking-wider text-slate-600">{k.key}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleKey(k.id)}
                    className={`text-[10px] font-bold px-2 py-1.5 rounded transition ${
                      k.status === 'Active' 
                        ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    {k.status === 'Active' ? (isRTL ? 'إلغاء المفتاح' : 'Revoke') : (isRTL ? 'تفعيل' : 'Activate')}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateApiKey} className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                required
                placeholder={isRTL ? 'اسم الرمز (مثال: SAP Gateway)' : 'Name of adapter channel...'}
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 bg-slate-50 border p-2 text-xs rounded focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {isRTL ? 'توليد الرمز' : 'Generate'}
              </button>
            </form>
          </div>

          {/* Incoming Webhook setup */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'مستقبلات الأحداث الحية (Incoming Webhooks)' : 'Incoming Webhooks Config'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'قم بتهيئة قنوات استماع فورية لتلقي الأحداث المالية فور حدوثها في Odoo أو ERPNext.' : 'Fire instant audits as transactions are processed inside corporate source ledgers.'}</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              {webhooks.map((w) => (
                <div key={w.id} className="bg-slate-50 border p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px]">POST webhook</span>
                    <span className="text-[10px] text-emerald-600 font-bold">ACTIVE RECEIVER</span>
                  </div>
                  <span className="font-mono text-[10.5px] text-slate-700 block break-all">{w.url}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {w.events.map((ev) => (
                      <span key={ev} className="bg-white border border-slate-200 text-[9px] font-bold text-slate-500 px-2 py-0.5 rounded">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateWebhook} className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Receiver Endpoint URL:</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.icap.alnoor.com/v1/webhooks/odoo-listener"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Trigger Events:</label>
                <div className="flex gap-4">
                  {['Journal Entry Fired', 'Invoice Created', 'Payment Success'].map((e) => {
                    const checked = newWebhookEvents.includes(e);
                    return (
                      <label key={e} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setNewWebhookEvents(newWebhookEvents.filter(x => x !== e));
                            } else {
                              setNewWebhookEvents([...newWebhookEvents, e]);
                            }
                          }}
                        />
                        <span>{e}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded transition"
              >
                {isRTL ? 'إضافة مستقبل حدث' : 'Register Webhook Endpoint'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. DEVELOPER SDK PLAYGROUND */}
      {/* ==================================================== */}
      {activeSubTab === 'sdk' && (
        <div id="erp-sdk-tab" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{isRTL ? 'حقيبة وبوابة المطورين لـ ICAP' : 'Universal ERPConnector Interface SDK'}</h3>
            <p className="text-xs text-slate-400 mt-1">{isRTL ? 'تصدير النموذج المعياري الموحد والـ SDK لبرمجة موصلات ERP مخصصة متوافقة.' : 'Leverage strict Type definitions and API contracts to write custom ERP adapters complying with ICAP Canonical structures.'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Interface Code Sandbox */}
            <div className="space-y-3.5">
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">ERPConnector TypeScript SDK Interface:</span>
              <div className="bg-slate-900 text-slate-100 font-mono p-4 rounded-xl max-h-96 overflow-y-auto select-all relative text-[11px] leading-relaxed">
                <button 
                  className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                  onClick={() => {
                    navigator.clipboard.writeText(SDK_INTERFACE_CODE);
                    alert('SDK Interface copied to clipboard!');
                  }}
                >
                  Copy SDK
                </button>
                <pre><code>{SDK_INTERFACE_CODE}</code></pre>
              </div>
            </div>

            {/* Simulated Adapter Implementation Example */}
            <div className="space-y-3.5">
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Odoo Custom Class Implementation Example:</span>
              <div className="bg-slate-950 text-slate-200 font-mono p-4 rounded-xl max-h-96 overflow-y-auto text-[11px] leading-relaxed">
                <pre><code>{ODOO_ADAPTER_CODE}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'simulator' && (
        <AdvancedErpSimulator
          locale={locale}
          theme={theme}
          onTriggerActivityLog={onTriggerActivityLog}
        />
      )}

      {/* ==================================================== */}
      {/* 8. ERROR RESOLUTION MODAL OVERLAY */}
      {/* ==================================================== */}
      {resolvingErrorId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {isRTL ? 'إجراء تسوية وحل لخطأ المزامنة' : 'Resolve Mapping Exception'}
              </span>
              <button onClick={() => setResolvingErrorId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveError} className="space-y-3.5 text-xs">
              <p className="text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'يرجى تسجيل تسوية أو إدخال كود الحساب الشرعي الصحيح لحفظ السجل ضمن النظام الموحد للتوافق.' 
                  : 'Manually override the mapping translation error by providing a compliant ledger reference below.'}
              </p>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-500">ledger Resolution Code or Custom Mapping Rule:</label>
                <textarea
                  required
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingErrorId(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg"
                >
                  {isRTL ? 'تثبيت الحل والمزامنة' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 9. CONNECTION SETUP WIZARD OVERLAY */}
      {/* ==================================================== */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
            {/* Wizard Header */}
            <div className="p-5 border-b flex justify-between items-center shrink-0">
              <div>
                <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Step {wizardStep} of 5</span>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  {wizardStep === 1 && (isRTL ? 'اختر نظام الـ ERP' : 'Select ERP Platform')}
                  {wizardStep === 2 && (isRTL ? 'تكوين بيانات الاتصال والمصادقة' : 'Setup Authentication Credentials')}
                  {wizardStep === 3 && (isRTL ? 'فحص الاتصال المباشر والسرعة' : 'Verify live Endpoint connection')}
                  {wizardStep === 4 && (isRTL ? 'اختر وحدات البيانات للتدقيق' : 'Select Sync Modules')}
                  {wizardStep === 5 && (isRTL ? 'جدولة وضبط التكرار' : 'Scheduling & Frequency controls')}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Wizard Body (Scrollable if content overflows) */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* STEP 1: SELECT ERP */}
              {wizardStep === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {[
                    { id: 'odoo', name: 'Odoo ERP', logo: '🟣', desc: 'Direct XML-RPC / JSON' },
                    { id: 'sap', name: 'SAP S/4HANA', logo: '🔵', desc: 'Enterprise RFC & NetWeaver' },
                    { id: 'oracle', name: 'Oracle Cloud', logo: '🔴', desc: 'Financials DB Adapter' },
                    { id: 'dynamics', name: 'MS Dynamics 365', logo: '🟢', desc: 'OData OData interface' },
                    { id: 'erpnext', name: 'ERPNext Sharia', logo: '🔵', desc: 'Islamic Webhooks Sync' },
                    { id: 'custom', name: 'Custom Flat-File', logo: '⚙️', desc: 'Excel / CSV / XML Upload' }
                  ].map((sys) => {
                    const selected = wizardData.erpSystem === sys.id;
                    return (
                      <div
                        key={sys.id}
                        onClick={() => setWizardData({ ...wizardData, erpSystem: sys.id })}
                        className={`border rounded-xl p-4 cursor-pointer transition flex flex-col justify-between min-h-[120px] ${
                          selected ? 'border-emerald-600 bg-emerald-50/25 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-3xl">{sys.logo}</span>
                          {selected && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                        </div>
                        <div className="pt-3">
                          <span className="font-bold text-slate-800 block text-xs">{sys.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{sys.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STEP 2: CREDENTIALS */}
              {wizardStep === 2 && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500">Connection Name / Label:</label>
                    <input
                      type="text"
                      required
                      placeholder="Al Noor main Odoo"
                      value={wizardData.name}
                      onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                      className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500">API Gateway URL Endpoint:</label>
                    <input
                      type="url"
                      required
                      placeholder="https://odoo.alnoor-finance.com:8069"
                      value={wizardData.apiUrl}
                      onChange={(e) => setWizardData({ ...wizardData, apiUrl: e.target.value })}
                      className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none font-mono"
                    />
                  </div>

                  {wizardData.erpSystem !== 'erpnext' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-500">API Username / ID:</label>
                        <input
                          type="text"
                          value={wizardData.username}
                          onChange={(e) => setWizardData({ ...wizardData, username: e.target.value })}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-500">API Key / Token / Secret:</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••"
                          value={wizardData.apiKey}
                          onChange={(e) => setWizardData({ ...wizardData, apiKey: e.target.value })}
                          className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {wizardData.erpSystem === 'odoo' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-500">Database Name:</label>
                      <input
                        type="text"
                        placeholder="alnoor_production_db"
                        value={wizardData.dbName}
                        onChange={(e) => setWizardData({ ...wizardData, dbName: e.target.value })}
                        className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500">Environment Target:</label>
                    <div className="flex gap-2">
                      {['Sandbox', 'Staging', 'Production'].map((env) => (
                        <button
                          key={env}
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, environment: env as any })}
                          className={`flex-1 font-bold py-2 px-3 rounded-lg border transition ${
                            wizardData.environment === env 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {env}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONNECTION TEST */}
              {wizardStep === 3 && (
                <div className="space-y-6 max-w-md mx-auto text-center">
                  <p className="text-slate-500 leading-relaxed">
                    {isRTL 
                      ? 'يرجى تفعيل فحص الاتصال للتحقق من أمان الرابط وترخيص الـ API والمستقبلات المتاحة.' 
                      : 'Test the live API endpoint integration to calculate baseline ping speeds and accessible ledger tables.'}
                  </p>

                  <div className="flex justify-center py-4">
                    <button
                      type="button"
                      disabled={testingConnection}
                      onClick={handleTestConnection}
                      className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-3 px-6 rounded-xl transition flex items-center gap-2"
                    >
                      {testingConnection ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-yellow-400" />}
                      {isRTL ? 'بدء فحص الاتصال المباشر' : 'Execute Diagnostic Test'}
                    </button>
                  </div>

                  {testResult && (
                    <div className={`border p-4.5 rounded-2xl text-left space-y-3 shadow-xs ${
                      testResult.success ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">Connection Status:</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${testResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {testResult.success ? 'SUCCESSFUL (HTTP 200 OK)' : 'CONNECTION REJECTED'}
                        </span>
                      </div>

                      {testResult.success ? (
                        <div className="space-y-1 text-slate-600">
                          <span>Endpoint Latency: <strong className="text-slate-950">{testResult.latency} ms</strong></span>
                          <span className="block mt-1">Available modules discovered: <strong className="text-emerald-700 font-mono">{testResult.modules.join(', ')}</strong></span>
                        </div>
                      ) : (
                        <p className="text-red-700 leading-relaxed">
                          Diagnostics: API Endpoint URL cannot be null. Verify your URL protocol structure and make sure host port is accessible.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: SELECT MODULES */}
              {wizardStep === 4 && (
                <div className="space-y-4 max-w-md mx-auto">
                  <p className="text-slate-500 leading-relaxed">
                    {isRTL 
                      ? 'حدد الجداول المالية ومصادر البيانات التي ترغب في ربطها لمطابقة حقولها تلقائياً مع نموذجنا الموحد.' 
                      : 'Choose specific ledger models and databases to import into the compliance purification engine.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'Accounting', name: isRTL ? 'المحاسبة والقيود' : 'Accounting & Ledgers' },
                      { id: 'Customers', name: isRTL ? 'العملاء والجهات' : 'Customers' },
                      { id: 'Vendors', name: isRTL ? 'الموردين والمستودع' : 'Vendors' },
                      { id: 'Invoices', name: isRTL ? 'الفواتير والمطالبات' : 'Invoices & Receivables' },
                      { id: 'Payments', name: isRTL ? 'الحوالات والتحصيل' : 'Payments' },
                      { id: 'Journal Entries', name: isRTL ? 'القيود واليومية' : 'Journal Entries' },
                      { id: 'Assets', name: isRTL ? 'الأصول والضمان' : 'Physical Assets' },
                      { id: 'Employees', name: isRTL ? 'شؤون الموظفين' : 'Employees' }
                    ].map((mod) => {
                      const active = wizardData.selectedModules.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setWizardData({ ...wizardData, selectedModules: wizardData.selectedModules.filter(x => x !== mod.id) });
                            } else {
                              setWizardData({ ...wizardData, selectedModules: [...wizardData.selectedModules, mod.id] });
                            }
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border font-bold text-left transition ${
                            active 
                              ? 'border-emerald-600 bg-emerald-50/20 text-emerald-900' 
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{mod.name}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            active ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {active && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: SYNC SETTINGS */}
              {wizardStep === 5 && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-500 block">Synchronization Type:</label>
                    <div className="flex gap-3">
                      <label className="flex-1 border p-4 rounded-xl flex items-center justify-between cursor-pointer font-bold bg-slate-50 hover:bg-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="syncType"
                            checked={wizardData.syncType === 'Automatic'}
                            onChange={() => setWizardData({ ...wizardData, syncType: 'Automatic' })}
                          />
                          <span>Automatic Continuous Sync</span>
                        </div>
                      </label>

                      <label className="flex-1 border p-4 rounded-xl flex items-center justify-between cursor-pointer font-bold bg-slate-50 hover:bg-slate-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="syncType"
                            checked={wizardData.syncType === 'Manual'}
                            onChange={() => setWizardData({ ...wizardData, syncType: 'Manual' })}
                          />
                          <span>Manual Ingestion Trigger</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {wizardData.syncType === 'Automatic' && (
                    <div className="space-y-2">
                      <label className="font-bold text-slate-500 block">Sync Frequency Scheduler:</label>
                      <div className="flex gap-2">
                        {['Hourly', 'Daily', 'Weekly'].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setWizardData({ ...wizardData, frequency: freq as any })}
                            className={`flex-1 font-bold py-2.5 px-3 rounded-lg border transition ${
                              wizardData.frequency === freq 
                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {freq === 'Hourly' ? (isRTL ? 'كل ساعة' : 'Hourly') : freq === 'Daily' ? (isRTL ? 'يومياً' : 'Daily') : (isRTL ? 'أسبوعياً' : 'Weekly')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wizard Footer Controls */}
            <div className="p-5 border-t bg-slate-50/50 flex justify-between items-center shrink-0">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={handlePrevStep}
                className="bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold px-4 py-2 rounded-lg border text-xs"
              >
                {isRTL ? 'السابق' : 'Previous'}
              </button>

              <div className="flex gap-2">
                {wizardStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-xs"
                  >
                    {isRTL ? 'التالي' : 'Next'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateConnection}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-lg text-xs"
                  >
                    {isRTL ? 'تثبيت وربط النظام' : 'Save & Initialize Sync'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SDK_INTERFACE_CODE = `// Unified ICAP Compliance Adapter Contract
export interface ERPConnector {
  // Secure session handshakes
  authenticate(): Promise<boolean>;
  testConnection(): Promise<{ success: boolean, ms: number }>;

  // Ingestion procedures mirroring ICAP Canonical Models
  fetchCustomers(): Promise<ErpCustomer[]>;
  fetchVendors(): Promise<ErpVendor[]>;
  fetchInvoices(): Promise<ErpInvoice[]>;
  fetchPayments(): Promise<ErpPayment[]>;
  fetchJournalEntries(): Promise<ErpJournalEntry[]>;
  fetchAccounts(): Promise<ErpAccount[]>;
  fetchAssets(): Promise<ErpAsset[]>;
  fetchEmployees(): Promise<ErpEmployee[]>;
  fetchContracts(): Promise<ErpContract[]>;

  // Continuous scheduler sync
  syncData(modules: string[]): Promise<SyncResult>;
}`;

const ODOO_ADAPTER_CODE = `// Implements our strict Canonical Model constraints
import { ERPConnector, ErpCustomer } from '@icap/sdk';
import axios from 'axios';

export class OdooConnector implements ERPConnector {
  constructor(private config: any) {}

  async authenticate() {
    const response = await axios.post(
      this.config.apiUrl + '/web/session/authenticate', 
      { 
        db: this.config.dbName, 
        login: this.config.username, 
        password: this.config.password 
      }
    );
    return response.status === 200;
  }

  async fetchCustomers(): Promise<ErpCustomer[]> {
    const raw = await this.callOdooRpc(
      'res.partner', 
      'search_read', 
      [['customer_rank', '>', 0]]
    );
    
    // Map partner fields directly into canonical customer objects
    return raw.map(p => ({
      id: \`c-\${p.id}\`,
      externalId: p.ref || '',
      name: p.name,
      email: p.email,
      phone: p.phone || ''
    }));
  }
}`;
