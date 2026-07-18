import React, { useState, useMemo } from 'react';
import {
  Key,
  Terminal,
  Code,
  Webhook,
  ShoppingBag,
  BarChart2,
  Plus,
  Trash,
  RotateCw,
  Eye,
  EyeOff,
  Check,
  Copy,
  FileCode,
  ExternalLink,
  Layers,
  Globe,
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  UploadCloud,
  ChevronRight,
  RefreshCw,
  AppWindow,
  Briefcase,
  HelpCircle
} from 'lucide-react';

import { DeveloperApplication, DeveloperApiKey, ApiLogRecord, WebhookSubscription, MarketplaceConnector, ConnectorSubmission } from '../types';
import {
  API_ENDPOINTS,
  MOCK_DEVELOPER_APPLICATIONS,
  MOCK_API_KEYS,
  MOCK_API_LOGS,
  MOCK_WEBHOOKS,
  INITIAL_MARKETPLACE_CONNECTORS,
  MOCK_SUBMISSIONS,
  SDK_INSTALL_DOCS,
  SDK_AUTH_DOCS,
  SDK_METHODS_DOCS,
  ApiEndpoint
} from './devPortalData';

interface DeveloperPortalViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog?: (action: string, details: string) => void;
}

type DevSubPage = 'dashboard' | 'apps' | 'keys' | 'docs' | 'sdk' | 'webhooks' | 'marketplace' | 'analytics';

export default function DeveloperPortalView({
  locale,
  theme,
  onTriggerActivityLog
}: DeveloperPortalViewProps) {
  const isRTL = locale === 'ar';

  // Core Developer Portal States
  const [activeSubPage, setActiveSubPage] = useState<DevSubPage>('dashboard');
  const [applications, setApplications] = useState<DeveloperApplication[]>(MOCK_DEVELOPER_APPLICATIONS);
  const [apiKeys, setApiKeys] = useState<DeveloperApiKey[]>(MOCK_API_KEYS);
  const [apiLogs, setApiLogs] = useState<ApiLogRecord[]>(MOCK_API_LOGS);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(MOCK_WEBHOOKS);
  const [marketplaceConnectors, setMarketplaceConnectors] = useState<MarketplaceConnector[]>(INITIAL_MARKETPLACE_CONNECTORS);
  const [submissions, setSubmissions] = useState<ConnectorSubmission[]>(MOCK_SUBMISSIONS);

  // New Application form state
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newDevName, setNewDevName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newAppType, setNewAppType] = useState<'ERP Connector' | 'Integration' | 'Reporting Tool' | 'Custom Application'>('ERP Connector');
  const [newCreatedCredentials, setNewCreatedCredentials] = useState<{ id: string; clientId: string; secret: string } | null>(null);

  // New API Key state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyAppId, setNewKeyAppId] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read:customers']);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [createdApiKeyString, setCreatedApiKeyString] = useState<string | null>(null);

  // New Webhook State
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState<any>('compliance.finding.created');
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [simulatedWebhookLogs, setSimulatedWebhookLogs] = useState<{ id: string; url: string; event: string; status: number; timestamp: string; payload: string }[]>([]);

  // Interactive Sandbox Client State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[5]); // Default GET /invoices
  const [sandboxApiKey, setSandboxApiKey] = useState('icap_live_0x9a8b7c6d5e4f3g2h1i0j_99a8b7');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxCustomParams, setSandboxCustomParams] = useState<Record<string, string>>({});

  // Submission Form State
  const [submitConnectorName, setSubmitConnectorName] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [submitErp, setSubmitErp] = useState('Odoo v17 / SAP S4HANA');
  const [submitDoc, setSubmitDoc] = useState('');
  const [submitVersion, setSubmitVersion] = useState('1.0.0');
  const [submitTesting, setSubmitTesting] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Analytics states
  const [analyticsFilterApp, setAnalyticsFilterApp] = useState<string>('all');

  // Copy success animation states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Helper translations
  const t = (en: string, ar: string) => (isRTL ? ar : en);

  // Stats calculation
  const totalRequests = useMemo(() => {
    return apiLogs.length * 1230 + 45600; // base scale
  }, [apiLogs]);

  const activeAppCount = useMemo(() => {
    return applications.filter(a => a.status === 'Approved').length;
  }, [applications]);

  const activeKeysCount = useMemo(() => {
    return apiKeys.filter(k => k.status === 'Active').length;
  }, [apiKeys]);

  // Handlers
  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newDevName || !newContactEmail) return;

    const id = 'app-' + Math.random().toString(36).substr(2, 9);
    const clientId = 'cli_0x' + Math.random().toString(16).substr(2, 10);
    const clientSecret = 'sec_' + Math.random().toString(36).substr(2, 32);

    const newApp: DeveloperApplication = {
      id,
      organizationId: 'org-al-noor',
      name: newAppName,
      description: newAppDesc || 'No description provided.',
      developerName: newDevName,
      company: newCompany || 'Independent Developer',
      website: newWebsite || 'https://icap.io',
      contactEmail: newContactEmail,
      applicationType: newAppType,
      clientId,
      clientSecret,
      status: 'Approved',
      createdAt: new Date().toISOString()
    };

    setApplications([newApp, ...applications]);
    setNewCreatedCredentials({ id, clientId, secret: clientSecret });
    if (onTriggerActivityLog) {
      onTriggerActivityLog('CREATE_DEVELOPER_APP', `Created developer application: "${newAppName}" (${newAppType})`);
    }

    // Reset form fields
    setNewAppName('');
    setNewAppDesc('');
    setNewDevName('');
    setNewCompany('');
    setNewWebsite('');
    setNewContactEmail('');
  };

  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || !newKeyAppId) return;

    const randomHex = Math.random().toString(16).substr(2, 20);
    const generatedKey = `icap_live_0x${randomHex}_${Math.random().toString(36).substr(2, 6)}`;

    const newKeyRecord: DeveloperApiKey = {
      id: 'key-' + Date.now(),
      applicationId: newKeyAppId,
      keyName: newKeyName,
      apiKey: generatedKey,
      permissions: newKeyPermissions,
      createdAt: new Date().toISOString(),
      lastUsed: 'Never used',
      status: 'Active'
    };

    setApiKeys([newKeyRecord, ...apiKeys]);
    setCreatedApiKeyString(generatedKey);
    setNewKeyName('');
    setNewKeyPermissions(['read:customers']);

    if (onTriggerActivityLog) {
      onTriggerActivityLog('GENERATE_API_KEY', `Generated new API key credential: "${newKeyName}"`);
    }
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(k => k.id === keyId ? { ...k, status: 'Revoked' as const } : k));
    if (onTriggerActivityLog) {
      onTriggerActivityLog('REVOKE_API_KEY', `Revoked API key: ${keyId}`);
    }
  };

  const handleRotateKey = (keyId: string) => {
    const key = apiKeys.find(k => k.id === keyId);
    if (!key) return;

    const randomHex = Math.random().toString(16).substr(2, 20);
    const rotatedKey = `icap_live_0x${randomHex}_${Math.random().toString(36).substr(2, 6)}`;

    setApiKeys(apiKeys.map(k => k.id === keyId ? {
      ...k,
      apiKey: rotatedKey,
      createdAt: new Date().toISOString()
    } : k));

    if (onTriggerActivityLog) {
      onTriggerActivityLog('ROTATE_API_KEY', `Rotated credentials for: "${key.keyName}"`);
    }
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    const randomSecret = 'whsec_' + Math.random().toString(36).substr(2, 12);
    const newWh: WebhookSubscription = {
      id: 'wh-' + Date.now(),
      organizationId: 'org-al-noor',
      url: webhookUrl,
      event: webhookEvent,
      secret: randomSecret,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    setWebhooks([newWh, ...webhooks]);
    setWebhookUrl('');
    setShowWebhookModal(false);

    if (onTriggerActivityLog) {
      onTriggerActivityLog('CREATE_WEBHOOK', `Subscribed webhook URL: "${webhookUrl}"`);
    }
  };

  const handleToggleWebhookStatus = (whId: string) => {
    setWebhooks(webhooks.map(w => w.id === whId ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w));
  };

  const handleDeleteWebhook = (whId: string) => {
    setWebhooks(webhooks.filter(w => w.id !== whId));
  };

  // Simulates sending a test webhook payload to external endpoint
  const handleTestWebhookDispatch = (wh: WebhookSubscription) => {
    const mockPayloads = {
      'document.uploaded': { event: 'document.uploaded', documentId: 'doc-124', name: 'murabaha_agreement.pdf', status: 'In_Review', timestamp: new Date().toISOString() },
      'compliance.finding.created': { event: 'compliance.finding.created', severity: 'high', title: 'Suspicious Compounding Penalty', standardId: 'AAOIFI-8', timestamp: new Date().toISOString() },
      'sync.completed': { event: 'sync.completed', totalProcessedRecords: 1425, duration: '4.2s', status: 'Success', timestamp: new Date().toISOString() },
      'certificate.issued': { event: 'certificate.issued', certId: 'CERT-2026-X8', organizationName: 'Al Noor', validUntil: '2027-07-17', timestamp: new Date().toISOString() },
      'risk.alert.generated': { event: 'risk.alert.generated', level: 'Critical', details: 'Riba penalty detection without immediate charity offset', timestamp: new Date().toISOString() }
    };

    const payload = JSON.stringify(mockPayloads[wh.event], null, 2);
    
    // Simulate API delivery delay
    setTimeout(() => {
      const responseCode = 200; // Success mock
      setSimulatedWebhookLogs(prev => [
        {
          id: 'wlog-' + Date.now(),
          url: wh.url,
          event: wh.event,
          status: responseCode,
          timestamp: new Date().toLocaleTimeString(),
          payload
        },
        ...prev
      ]);
    }, 400);
  };

  // Execute interactive API sandbox call
  const handleExecuteSandbox = () => {
    setSandboxLoading(true);
    setSandboxResponse(null);

    // Simulate network delay
    setTimeout(() => {
      setSandboxLoading(false);
      // Validate api key existence or revoke
      const keyObj = apiKeys.find(k => k.apiKey === sandboxApiKey);
      if (!keyObj) {
        setSandboxResponse(JSON.stringify({ error: "Unauthorized", message: "Invalid API key provided. Check keys panel." }, null, 2));
        return;
      }
      if (keyObj.status === 'Revoked') {
        setSandboxResponse(JSON.stringify({ error: "Unauthorized", message: "This API key has been explicitly revoked." }, null, 2));
        return;
      }

      // Check scope permission matching endpoint
      const requiredScope = selectedEndpoint.category === 'Compliance' ? 'read:compliance' :
                           selectedEndpoint.category === 'Financial' ? 'read:financials' :
                           selectedEndpoint.category === 'Document' ? 'write:documents' : 'read:customers';

      if (!keyObj.permissions.includes(requiredScope)) {
        setSandboxResponse(JSON.stringify({ 
          error: "Forbidden", 
          message: `Insufficient permissions. This API key requires the '${requiredScope}' scope to request this endpoint.` 
        }, null, 2));
        return;
      }

      // Successful response map
      setSandboxResponse(selectedEndpoint.exampleResponse);

      // Create a mock API Log entry
      const newLog: ApiLogRecord = {
        id: 'l-' + Date.now(),
        applicationId: keyObj.applicationId,
        endpoint: selectedEndpoint.path,
        method: selectedEndpoint.method,
        timestamp: new Date().toISOString(),
        status: 200,
        responseTime: Math.floor(Math.random() * 150) + 40
      };
      setApiLogs(prev => [newLog, ...prev]);

    }, 800);
  };

  // Marketplace interaction
  const handleToggleInstallConnector = (connId: string) => {
    setMarketplaceConnectors(marketplaceConnectors.map(c => {
      if (c.id === connId) {
        const newStatus = c.status === 'Installed' ? 'Available' : 'Installed';
        if (onTriggerActivityLog) {
          onTriggerActivityLog(
            newStatus === 'Installed' ? 'INSTALL_CONNECTOR' : 'REMOVE_CONNECTOR',
            `${newStatus === 'Installed' ? 'Installed' : 'Removed'} marketplace connector: "${c.name}"`
          );
        }
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // Partner submission form
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitConnectorName || !submitDesc) return;

    const newSub: ConnectorSubmission = {
      id: 'sub-' + Date.now(),
      name: submitConnectorName,
      description: submitDesc,
      erpSupported: submitErp,
      documentation: submitDoc || 'Pending upload',
      version: submitVersion,
      testingInfo: submitTesting || 'N/A',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    };

    setSubmissions([newSub, ...submissions]);
    setSubmitConnectorName('');
    setSubmitDesc('');
    setSubmitDoc('');
    setSubmitTesting('');
    setShowSubmitModal(false);

    if (onTriggerActivityLog) {
      onTriggerActivityLog('SUBMIT_CONNECTOR', `Submitted custom ERP connector for vetting: "${submitConnectorName}"`);
    }
  };

  // Filter logs for analytics charts
  const filteredLogs = useMemo(() => {
    if (analyticsFilterApp === 'all') return apiLogs;
    return apiLogs.filter(l => l.applicationId === analyticsFilterApp);
  }, [apiLogs, analyticsFilterApp]);

  // Analytics aggregate stats
  const aggregateStats = useMemo(() => {
    const total = filteredLogs.length;
    const errors = filteredLogs.filter(l => l.status >= 400).length;
    const success = total - errors;
    const avgResponse = total > 0 ? Math.round(filteredLogs.reduce((acc, l) => acc + l.responseTime, 0) / total) : 0;

    const endpointCounts: Record<string, number> = {};
    filteredLogs.forEach(l => {
      endpointCounts[l.endpoint] = (endpointCounts[l.endpoint] || 0) + 1;
    });

    const popularEndpoint = Object.entries(endpointCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { total, success, errors, avgResponse, popularEndpoint };
  }, [filteredLogs]);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-2xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                {t('Developer Platform', 'منصة المطورين')}
              </span>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-blue-500/30">
                {t('API Version v1.0', 'نسخة الـ API v1.0')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
              {t('Developer Portal & API Gateway', 'بوابة المطورين وبوابة الربط الإلكتروني')}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
              {t(
                'Build custom ERP adapters, automate sharia audits, query compliance logs, and integrate third-party ledger checkers via our standardized REST API and SDKs.',
                'ابنِ موصلات مخصصة للأنظمة المالية، وأتمت التدقيق الشرعي، واستعلم عن سجلات الامتثال، واربط الأنظمة الخارجية عبر واجهة برمجة التطبيقات القياسية وحزم التطوير.'
              )}
            </p>
          </div>
          <button 
            onClick={() => setActiveSubPage('docs')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition shadow-md shadow-emerald-950/20 flex items-center gap-2 shrink-0"
          >
            <Terminal className="w-4 h-4" />
            <span>{t('Explore API Docs', 'استكشف توثيق الـ API')}</span>
          </button>
        </div>

        {/* INNER NAVIGATION TABS */}
        <div className="flex overflow-x-auto border-t border-slate-800/80 mt-6 pt-4 gap-1 no-scrollbar">
          {[
            { id: 'dashboard', label: t('Dashboard', 'لوحة القيادة'), icon: BarChart2 },
            { id: 'apps', label: t('Applications', 'إدارة التطبيقات'), icon: AppWindow },
            { id: 'keys', label: t('API Credentials', 'مفاتيح الربط'), icon: Key },
            { id: 'docs', label: t('Interactive APIs', 'التجربة الحية'), icon: Code },
            { id: 'sdk', label: t('SDKs & Packages', 'حزم التطوير SDK'), icon: FileCode },
            { id: 'webhooks', label: t('Webhooks', 'الخطافات الذكية'), icon: Webhook },
            { id: 'marketplace', label: t('Marketplace', 'سوق الموصلات'), icon: ShoppingBag },
            { id: 'analytics', label: t('API Analytics', 'التحليلات والمراقبة'), icon: Layers }
          ].map((tab) => {
            const active = activeSubPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubPage(tab.id as DevSubPage)}
                className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg transition shrink-0 ${
                  active 
                    ? 'bg-slate-800 text-emerald-400 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* SUB-PAGE 1: DEVELOPER DASHBOARD */}
      {/* ========================================== */}
      {activeSubPage === 'dashboard' && (
        <div className="space-y-6">
          {/* STATS TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">{t('Active Applications', 'التطبيقات النشطة')}</span>
              <div className="flex justify-between items-end mt-2">
                <span className="text-2xl font-bold text-slate-900">{activeAppCount}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  {t('100% Approved', 'معتمد بالكامل')}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">{t('API Requests Today', 'طلبات الـ API اليوم')}</span>
              <div className="flex justify-between items-end mt-2">
                <span className="text-2xl font-bold text-slate-900">{totalRequests.toLocaleString()}</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                  +14.5% {t('vs yesterday', 'مقارنة بالأمس')}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">{t('Connected Developers', 'المطورون المرتبطون')}</span>
              <div className="flex justify-between items-end mt-2">
                <span className="text-2xl font-bold text-slate-900">24</span>
                <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100">
                  {t('7 Enterprises', '٧ شركات كبرى')}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">{t('Active API Keys', 'مفاتيح الربط النشطة')}</span>
              <div className="flex justify-between items-end mt-2">
                <span className="text-2xl font-bold text-slate-900">{activeKeysCount}</span>
                <span className="text-slate-400 text-[10px] font-medium">
                  {apiKeys.length - activeKeysCount} {t('revoked', 'ملغاة')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick API Gateway Walkthrough */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="font-display font-bold text-slate-900 text-sm">{t('API Gateway Architecture', 'بنية بوابة واجهة برمجة التطبيقات')}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {t(
                  'All inbound external traffic is filtered through the secure ICAP API Gateway before accessing internal ledger indices or compliance scores.',
                  'تتم تصفية جميع الزيارات الخارجية الواردة من خلال بوابة واجهة برمجة تطبيقات ICAP الآمنة قبل الوصول إلى مؤشرات حسابات الأستاذ العامة أو نتائج الامتثال.'
                )}
              </p>

              {/* FLOW DIAGRAM */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600">
                <div className="bg-slate-900 text-slate-200 border border-slate-800 p-2.5 rounded-lg w-full md:w-36 text-center shadow-sm">
                  🌐 {t('External Server', 'الخادم الخارجي')}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                <div className="bg-slate-800 text-emerald-400 border border-slate-700 p-2.5 rounded-lg w-full md:w-36 text-center shadow-sm relative">
                  🔒 {t('API Gateway', 'بوابة الـ API')}
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">Proxy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                <div className="bg-slate-100 text-slate-800 border border-slate-200 p-2.5 rounded-lg w-full md:w-36 text-center">
                  🔑 {t('OAuth & API Key', 'المصادقة والمفاتيح')}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                <div className="bg-emerald-600 text-white p-2.5 rounded-lg w-full md:w-36 text-center shadow">
                  🛡️ {t('ICAP Engine', 'محرك ICAP')}
                </div>
              </div>

              {/* Gateway Pipeline Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { name: t('Rate Limit', 'حد الطلبات'), status: '1,000 req/min', color: 'bg-emerald-500' },
                  { name: t('Response Avg', 'متوسط الاستجابة'), status: '114 ms', color: 'bg-emerald-500' },
                  { name: t('Global Uptime', 'جهوزية الخادم'), status: '99.98%', color: 'bg-emerald-500' },
                  { name: t('Error Rate', 'معدل الأخطاء'), status: '0.04%', color: 'bg-emerald-500' }
                ].map((pip) => (
                  <div key={pip.name} className="border border-slate-150 rounded-lg p-3 text-center bg-slate-50/50">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">{pip.name}</span>
                    <span className="text-xs font-bold text-slate-700 block mt-1">{pip.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>{t('Developer Quick Start', 'البدء السريع للمطورين')}</span>
              </h3>
              
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] flex items-center justify-center border border-emerald-100">1</span>
                  <div>
                    <strong className="text-slate-800 block">{t('Register Application', 'سجل تطبيقاً')}</strong>
                    <span className="text-slate-500 text-[10px]">{t('Generate a Client ID & Secret credentials.', 'أنشئ معرّف العميل والمفتاح السري.')}</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] flex items-center justify-center border border-emerald-100">2</span>
                  <div>
                    <strong className="text-slate-800 block">{t('Issue API Key', 'أصدر مفتاح ربط')}</strong>
                    <span className="text-slate-500 text-[10px]">{t('Configure strict permissions (e.g., read:financials).', 'اضبط الصلاحيات الصارمة للمفتاح.')}</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] flex items-center justify-center border border-emerald-100">3</span>
                  <div>
                    <strong className="text-slate-800 block">{t('Test Connection', 'اختبر الربط حياً')}</strong>
                    <span className="text-slate-500 text-[10px]">{t('Run requests directly from our built-in Sandbox client.', 'أرسل طلبات تجريبية مباشرة من المختبر.')}</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => setActiveSubPage('docs')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold py-2 rounded-lg transition text-center"
                >
                  {t('Launch Interactive Console', 'إطلاق لوحة التجربة التفاعلية')}
                </button>
              </div>
            </div>
          </div>

          {/* RECENT DEV LOGS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-sm">{t('Recent API Gateway Logs', 'سجلات طلبات واجهة برمجة التطبيقات')}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{t('Live transactional traffic intercepted by Gateway servers.', 'عمليات المرور الحية الملتقطة بواسطة خوادم البوابة.')}</p>
              </div>
              <button 
                onClick={() => {
                  const demoLog: ApiLogRecord = {
                    id: 'l-' + Date.now(),
                    applicationId: 'app-odoo',
                    endpoint: '/api/v1/compliance-score',
                    method: 'GET',
                    timestamp: new Date().toISOString(),
                    status: 200,
                    responseTime: Math.floor(Math.random() * 80) + 20
                  };
                  setApiLogs([demoLog, ...apiLogs]);
                }}
                className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{t('Simulate Request', 'محاكاة طلب جديد')}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                    <th className="py-2.5 px-3">{t('Method / Endpoint', 'الطريقة / المسار')}</th>
                    <th className="py-2.5 px-3">{t('App Source', 'التطبيق المصدر')}</th>
                    <th className="py-2.5 px-3">{t('Timestamp', 'الوقت والتلبيس')}</th>
                    <th className="py-2.5 px-3 text-center">{t('Status', 'الحالة')}</th>
                    <th className="py-2.5 px-3 text-right">{t('Latency', 'وقت الاستجابة')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiLogs.map((log) => {
                    const matchedApp = applications.find(a => a.id === log.applicationId)?.name || log.applicationId;
                    const isError = log.status >= 400;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-2.5 px-3 font-mono text-[11px] font-bold">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] mr-2 font-sans uppercase ${
                            log.method === 'POST' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {log.method}
                          </span>
                          <span className="text-slate-800">{log.endpoint}</span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-600">{matchedApp}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[10px] font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isError 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {log.status} {isError && ` - ${log.errorMessage}`}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500 font-bold">{log.responseTime} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 2: APPLICATIONS (MANAGE APPS) */}
      {/* ========================================== */}
      {activeSubPage === 'apps' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t('Application Profiles', 'تطبيقات الربط الإلكتروني')}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('Register external clients to authorize third-party services and securely generate Client IDs & Secrets.', 'سجل عملاء خارجيين للسماح بالخدمات الخارجية وإنشاء معرّفات العملاء والأسرار بأمان.')}
                </p>
              </div>
              <button
                onClick={() => {
                  setNewCreatedCredentials(null);
                  setShowNewAppModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Register New Application', 'تسجيل تطبيق جديد')}</span>
              </button>
            </div>

            {/* APPLICATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {applications.map((app) => (
                <div key={app.id} className="border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white relative">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded border uppercase">
                        {app.applicationType}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {app.status}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-slate-900 text-sm mt-3">{app.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed min-h-[48px]">{app.description}</p>

                    <div className="border-t border-slate-100 my-4 pt-3.5 space-y-2.5 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>{t('Client ID:', 'معرّف العميل:')}</span>
                        <code className="text-[10px] text-slate-800 font-bold bg-slate-100 px-1.5 py-0.2 rounded font-mono select-all">{app.clientId}</code>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{t('Developer:', 'المطور المسؤول:')}</span>
                        <span className="font-semibold text-slate-800">{app.developerName}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{t('Company:', 'الشركة:')}</span>
                        <span className="font-semibold text-slate-800">{app.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2 pt-2 border-t border-slate-50">
                    <button 
                      onClick={() => triggerCopy(app.clientId, app.id)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold py-1.5 rounded border border-slate-150 transition flex items-center justify-center gap-1"
                    >
                      {copiedId === app.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === app.id ? t('Copied ID', 'تم نسخ المعرف') : t('Copy Client ID', 'نسخ معرّف العميل')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 3: API KEYS (MANAGE TOKENS) */}
      {/* ========================================== */}
      {activeSubPage === 'keys' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t('API Key Management', 'إدارة مفاتيح واجهة برمجة التطبيقات')}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('Generate and configure granular scoped authorization keys for ERP systems, microservices, and workflows.', 'أنشئ واضبط مفاتيح الربط ذات الصلاحيات المفصلة للأنظمة المالية والخدمات الصغيرة وتدفقات العمل.')}
                </p>
              </div>
              <button
                onClick={() => {
                  setCreatedApiKeyString(null);
                  if (applications.length > 0) {
                    setNewKeyAppId(applications[0].id);
                  }
                  setShowNewKeyModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Generate API Key', 'إنشاء مفتاح ربط')}</span>
              </button>
            </div>

            {/* KEY RECORDS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50/50">
                    <th className="py-3 px-4">{t('Key Details', 'تفاصيل المفتاح')}</th>
                    <th className="py-3 px-4">{t('Application Scope', 'التطبيق المرتبط')}</th>
                    <th className="py-3 px-4">{t('Scopes / Permissions', 'الصلاحيات / النطاقات')}</th>
                    <th className="py-3 px-4">{t('Status', 'الحالة')}</th>
                    <th className="py-3 px-4 text-right">{t('Actions', 'الإجراءات')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiKeys.map((key) => {
                    const matchedApp = applications.find(a => a.id === key.applicationId);
                    const isRevoked = key.status === 'Revoked';
                    return (
                      <tr key={key.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 space-y-1">
                          <span className="font-bold text-slate-800 block">{key.keyName}</span>
                          <div className="flex items-center gap-2">
                            <code className="text-[10px] font-mono bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded select-all font-bold">
                              {key.apiKey}
                            </code>
                            <button 
                              onClick={() => triggerCopy(key.apiKey, key.id)}
                              className="text-slate-400 hover:text-slate-700"
                              title={t('Copy API Key', 'نسخ المفتاح')}
                            >
                              {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-400 block font-semibold">
                            {t('Created: ', 'تاريخ الإنشاء: ')}{new Date(key.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {matchedApp ? matchedApp.name : key.applicationId}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {key.permissions.map((perm) => (
                              <span key={perm} className="bg-slate-100 text-slate-800 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-slate-200">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isRevoked 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {key.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {!isRevoked && (
                            <>
                              <button 
                                onClick={() => handleRotateKey(key.id)}
                                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded transition inline-flex items-center gap-1"
                                title={t('Regenerate token string', 'تدوير الرمز السري')}
                              >
                                <RotateCw className="w-3 h-3" />
                                <span>{t('Rotate', 'تدوير')}</span>
                              </button>
                              <button 
                                onClick={() => handleRevokeKey(key.id)}
                                className="bg-red-50 hover:bg-red-100 border border-red-250 text-red-700 text-[10px] font-bold px-2 py-1 rounded transition inline-flex items-center gap-1"
                                title={t('Permanently deactivate key', 'إلغاء تنشيط المفتاح')}
                              >
                                <Trash className="w-3 h-3" />
                                <span>{t('Revoke', 'إلغاء')}</span>
                              </button>
                            </>
                          )}
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

      {/* ========================================== */}
      {/* SUB-PAGE 4: INTERACTIVE APIS (EXPLORER) */}
      {/* ========================================== */}
      {activeSubPage === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API NAV & SPECS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm">{t('REST API Specifications', 'مواصفات الـ REST API')}</h3>
            <p className="text-[11px] text-slate-400">{t('Select an endpoint path to investigate parameters, authentication requirements, and test responses live.', 'اختر مساراً لمعاينة المعاملات، ومتطلبات المصادقة، والردود المباشرة.')}</p>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {['Organization', 'Customer', 'Vendor', 'Financial', 'Compliance', 'Document'].map((cat) => (
                <div key={cat} className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block pt-2">{cat}</span>
                  {API_ENDPOINTS.filter(e => e.category === cat).map((endpoint) => {
                    const active = selectedEndpoint.id === endpoint.id;
                    return (
                      <button
                        key={endpoint.id}
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setSandboxResponse(null);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                          active 
                            ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-3 border-emerald-500' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <span className="truncate font-mono text-[11px] text-slate-700">{endpoint.path}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* INTERACTIVE PLAYGROUND / SANDBOX */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-5">
            <div className="border-b pb-3.5 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">{selectedEndpoint.category} APIs</span>
                <h3 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    selectedEndpoint.method === 'POST' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-slate-800 text-sm">/api/v1{selectedEndpoint.path}</span>
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 border text-slate-600 px-2 py-1 rounded font-bold">
                🔒 {t('Bearer Authorization', 'مصادقة Bearer')}
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{selectedEndpoint.description}</p>

            {/* PARAMS CONTROL */}
            {selectedEndpoint.parameters.length > 0 && (
              <div className="space-y-2.5">
                <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">{t('Request Parameters:', 'معاملات الطلب:')}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEndpoint.parameters.map((p) => (
                    <div key={p.name} className="border border-slate-150 rounded-lg p-2.5 bg-slate-50/50 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-800">{p.name}</span>
                        {p.required && <span className="text-red-500 ml-1">*</span>}
                        <span className="text-[10px] text-slate-400 block">{p.description}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{p.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUTHORIZATION FIELD FOR TESTING */}
            <div className="space-y-2.5">
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">{t('Gateway Security Handshake:', 'التصريح الأمني مع بوابة العبور:')}</span>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400 uppercase">Key</span>
                  <input
                    type="text"
                    value={sandboxApiKey}
                    onChange={(e) => setSandboxApiKey(e.target.value)}
                    placeholder={t('Enter API Key (e.g., icap_live...)', 'أدخل مفتاح الـ API')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-12 pr-4 text-xs font-mono font-bold text-slate-700 focus:outline-emerald-500"
                  />
                </div>
                <button
                  onClick={handleExecuteSandbox}
                  disabled={sandboxLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shrink-0 flex items-center gap-1.5"
                >
                  {sandboxLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{sandboxLoading ? t('Calling...', 'جاري الطلب...') : t('Try Request', 'تجربة الطلب')}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">{t('Testing queries read securely from our simulation database.', 'عمليات المحاكاة تقرأ وتكتب بأمان من قاعدة البيانات الافتراضية.')}</p>
            </div>

            {/* LIVE RESPONSE WINDOW */}
            <div className="space-y-3">
              <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">{t('Response Output Console:', 'شاشة مخرجات الرد:')}</span>
              <div className="bg-slate-900 text-slate-100 font-mono p-4 rounded-xl min-h-[140px] max-h-[300px] overflow-y-auto text-xs relative select-all leading-relaxed shadow-inner border border-slate-850">
                {sandboxResponse ? (
                  <pre><code>{sandboxResponse}</code></pre>
                ) : (
                  <div className="text-slate-500 italic h-24 flex items-center justify-center">
                    {sandboxLoading ? t('Retrieving Gateway metadata handshakes...', 'جاري مصافحة بروتوكولات بوابة العبور...') : t('No query executed yet. Configure key and click "Try Request".', 'لم يتم تنفيذ أي طلب بعد. اضغط على زر تجربة الطلب للاختبار.')}
                  </div>
                )}
                {sandboxResponse && (
                  <button 
                    onClick={() => triggerCopy(sandboxResponse, 'sandbox-res')}
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded"
                  >
                    {copiedId === 'sandbox-res' ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 5: SDK PACKAGES & DOCS */}
      {/* ========================================== */}
      {activeSubPage === 'sdk' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">{t('ICAP SDK & Libraries', 'حزم التطوير والبرمجة ICAP SDK')}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('Make integrations simple by leveraging our official, certified client libraries in multiple programming languages.', 'سهل الربط من خلال الاعتماد على حزم برمجية موثقة ومعتمدة بلغات تطوير متعددة.')}
              </p>
            </div>

            {/* SDK DOWNLOAD CHANNELS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { lang: 'JavaScript', version: 'v1.4.2', icon: '🟨', desc: 'NodeJS, React, Express', cmd: SDK_INSTALL_DOCS.javascript, auth: SDK_AUTH_DOCS.javascript, use: SDK_METHODS_DOCS.javascript },
                { lang: 'Python', version: 'v1.1.0', icon: '🟦', desc: 'Python 3.8+ Django, FastAPI', cmd: SDK_INSTALL_DOCS.python, auth: SDK_AUTH_DOCS.python, use: SDK_METHODS_DOCS.python },
                { lang: 'PHP', version: 'v1.0.5', icon: '🟪', desc: 'PHP 8.0+ Laravel, Composer', cmd: SDK_INSTALL_DOCS.php, auth: SDK_AUTH_DOCS.php, use: SDK_METHODS_DOCS.php },
                { lang: 'Java', version: 'v1.0.0', icon: '🟥', desc: 'Java 11+ Maven, Gradle Spring', cmd: SDK_INSTALL_DOCS.java, auth: SDK_AUTH_DOCS.java, use: SDK_METHODS_DOCS.java }
              ].map((sdk) => (
                <div key={sdk.lang} className="border border-slate-200 rounded-xl p-4.5 bg-slate-50/30 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl">{sdk.icon}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{sdk.version}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{sdk.lang} SDK</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{sdk.desc}</p>
                  </div>
                  <button 
                    onClick={() => {
                      alert(`${sdk.lang} SDK package configuration code downloaded!`);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-2 rounded-lg mt-4 transition flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{t('Download Package', 'تحميل الحزمة البرمجية')}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* DETAILED SDK DOCUMENTATION WALKTHROUGH */}
            <div className="border-t pt-5 space-y-5">
              <h4 className="font-display font-bold text-slate-900 text-sm">{t('Official SDK Documentation', 'التوثيق الرسمي لحزم المطورين')}</h4>

              <div className="space-y-4">
                {/* Section 1: Installation */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">1. {t('Installation', 'التثبيت والتهيئة')}</span>
                  <div className="bg-slate-900 text-slate-300 font-mono p-4 rounded-xl text-xs select-all relative">
                    <pre><code>{SDK_INSTALL_DOCS.javascript}</code></pre>
                  </div>
                </div>

                {/* Section 2: Auth */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">2. {t('Secure Authentication', 'تأمين الاتصال بالمفتاح')}</span>
                  <div className="bg-slate-900 text-slate-300 font-mono p-4 rounded-xl text-xs select-all relative">
                    <pre><code>{SDK_AUTH_DOCS.javascript}</code></pre>
                  </div>
                </div>

                {/* Section 3: Usage examples */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">3. {t('Method Invocation Examples', 'أمثلة استدعاء الدوال')}</span>
                  <div className="bg-slate-900 text-slate-300 font-mono p-4 rounded-xl text-xs select-all relative max-h-80 overflow-y-auto">
                    <pre><code>{SDK_METHODS_DOCS.javascript}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 6: WEBHOOK CLIENT SYSTEM */}
      {/* ========================================== */}
      {activeSubPage === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t('Webhook Management', 'إدارة الخطافات الذكية (Webhooks)')}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('Allow ICAP to automatically dispatch secure, signed payloads to your server endpoints on state transitions.', 'اسمح لـ ICAP بإرسال بيانات فورية موقعة ومؤمنة إلى خوادمك عند حدوث تغييرات في حالة المعاملات.')}
                </p>
              </div>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Register Webhook URL', 'إضافة خطاف ويب جديد')}</span>
              </button>
            </div>

            {/* WEBHOOK REGISTERED LIST */}
            <div className="space-y-3.5">
              {webhooks.map((wh) => (
                <div key={wh.id} className="border border-slate-200 rounded-xl p-4.5 shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">
                        {wh.event}
                      </span>
                      <span className={`inline-block w-2 h-2 rounded-full ${wh.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-[10px] text-slate-400 font-bold">Secret: {wh.secret}</span>
                    </div>
                    <span className="font-mono text-slate-800 text-xs block truncate mt-1">{wh.url}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleTestWebhookDispatch(wh)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded transition"
                    >
                      {t('Simulate Trigger', 'محاكاة الإرسال')}
                    </button>
                    <button 
                      onClick={() => handleToggleWebhookStatus(wh.id)}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded border transition ${
                        wh.status === 'Active' 
                          ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      }`}
                    >
                      {wh.status === 'Active' ? t('Pause', 'إيقاف') : t('Activate', 'تنشيط')}
                    </button>
                    <button 
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50 transition"
                      title={t('Delete webhook subscription', 'حذف خطاف الويب')}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE WEBHOOK DISPATCH SIMULATOR LOG */}
            {simulatedWebhookLogs.length > 0 && (
              <div className="border-t mt-6 pt-5 space-y-4">
                <h4 className="font-display font-bold text-slate-900 text-sm">{t('Simulated Webhook Deliveries Log', 'سجل تسليم خطافات الويب المحاكاة')}</h4>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {simulatedWebhookLogs.map((log) => (
                    <div key={log.id} className="border border-slate-200 rounded-xl p-4 bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 relative">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                        <span className="font-bold">POST {log.url}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded uppercase">STATUS {log.status} OK</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <pre className="text-xs text-slate-300 max-h-40 overflow-y-auto">{log.payload}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 7: CONNECTOR MARKETPLACE */}
      {/* ========================================== */}
      {activeSubPage === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">{t('Connector Marketplace', 'سوق الموصلات والتكاملات')}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('Browse, install, and configure certified third-party ERP adapters directly connected to ICAP compliance engines.', 'تصفح، ثبّت، واضبط موصلات الأنظمة المالية المعتمدة والمرتبطة بمحرك تدقيق الامتثال ICAP.')}
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Submit Custom Adapter', 'تقديم موصل مخصص للتقييم')}</span>
              </button>
            </div>

            {/* MARKETPLACE ITEMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {marketplaceConnectors.map((conn) => {
                const installed = conn.status === 'Installed';
                return (
                  <div key={conn.id} className="border border-slate-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{conn.logo}</span>
                          <div>
                            <h4 className="font-display font-bold text-slate-900 text-sm">{conn.name}</h4>
                            <span className="text-[10px] text-slate-400 block">{t('by ', 'بواسطة ')}{conn.provider} • v{conn.version}</span>
                          </div>
                        </div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          installed 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {installed ? t('Installed', 'مثبّت') : t('Available', 'متاح للاستخدام')}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed min-h-[44px]">{conn.description}</p>

                      <div className="border-t border-slate-100 my-4 pt-3 text-[11px] space-y-1.5 text-slate-500">
                        <div className="flex justify-between">
                          <span>{t('Supported ERP Models:', 'أنظمة تخطيط الموارد المدعومة:')}</span>
                          <span className="font-semibold text-slate-700">{conn.supportedERP}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Developer Rating:', 'تقييم المطورين:')}</span>
                          <span className="font-semibold text-amber-500">★ {conn.rating} / 5</span>
                        </div>
                        {conn.price && (
                          <div className="flex justify-between">
                            <span>{t('Pricing structure:', 'هيكلية الأسعار:')}</span>
                            <span className="font-bold text-emerald-600">{conn.price}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2 pt-2 border-t border-slate-50">
                      <button 
                        onClick={() => handleToggleInstallConnector(conn.id)}
                        className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition ${
                          installed 
                            ? 'bg-red-50 text-red-600 border-red-150 hover:bg-red-100' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {installed ? t('Remove Connector', 'إزالة الموصل') : t('Install & Sync ERP', 'تثبيت وربط النظام')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PARTNER CONNECTOR SUBMISSIONS WORKFLOW */}
            {submissions.length > 0 && (
              <div className="border-t mt-8 pt-6 space-y-4">
                <h4 className="font-display font-bold text-slate-900 text-sm">{t('Custom Partner Connector Pipeline', 'خط سير اعتماد موصلات الشركاء المخصصة')}</h4>
                <div className="grid grid-cols-1 gap-4">
                  {submissions.map((sub) => {
                    const steps = ['Submitted', 'Technical Review', 'Security Review', 'Approved', 'Published'];
                    const currentStepIndex = steps.indexOf(sub.status);
                    return (
                      <div key={sub.id} className="border border-slate-150 rounded-xl p-5 bg-slate-50/50 space-y-3.5">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{sub.name}</h5>
                            <span className="text-[10px] text-slate-400 block">v{sub.version} • {sub.erpSupported}</span>
                          </div>
                          <span className="bg-slate-200/80 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {sub.status}
                          </span>
                        </div>

                        {/* STEP TRACKER PROGRESS BAR */}
                        <div className="grid grid-cols-5 gap-1.5 text-center text-[9px] font-bold text-slate-400">
                          {steps.map((st, sidx) => {
                            const done = sidx <= currentStepIndex;
                            return (
                              <div key={st} className="space-y-1">
                                <div className={`h-1.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                <span className={done ? 'text-emerald-700 font-bold' : ''}>{st}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUB-PAGE 8: API USAGE ANALYTICS */}
      {/* ========================================== */}
      {activeSubPage === 'analytics' && (
        <div className="space-y-6">
          {/* FILTER TOOLBAR */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs font-bold text-slate-700">{t('API Performance Monitoring', 'مراقبة أداء واجهات برمجة التطبيقات')}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{t('Filter application source:', 'تصفية حسب التطبيق:')}</span>
              <select
                value={analyticsFilterApp}
                onChange={(e) => setAnalyticsFilterApp(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold py-1.5 px-3 focus:outline-emerald-500 text-slate-700"
              >
                <option value="all">{t('All Applications', 'جميع التطبيقات')}</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AGGREGATED METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t('Response Success Rate', 'معدل نجاح الاستجابة'), value: aggregateStats.total > 0 ? `${Math.round((aggregateStats.success / aggregateStats.total) * 100)}%` : '100%', desc: t('HTTP 2xx & 3xx codes', 'الأكواد التشغيلية السليمة') },
              { label: t('Avg Gateway Latency', 'متوسط وقت المعالجة'), value: aggregateStats.total > 0 ? `${aggregateStats.avgResponse} ms` : '114 ms', desc: t('Security verification lag', 'زمن التحقق الأمني وبوابات العبور') },
              { label: t('Most Called Resource', 'المسار الأكثر استخداماً'), value: aggregateStats.popularEndpoint, desc: t('Heaviest request frequency', 'الطلب الأكثر تكراراً') },
              { label: t('Active Security Faults', 'الأخطاء الأمنية النشطة'), value: `${aggregateStats.errors}`, desc: t('HTTP 4xx / 5xx gateway drops', 'عمليات الحظر والخطأ الشرعي') }
            ].map((agg) => (
              <div key={agg.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">{agg.label}</span>
                <span className="text-lg font-bold text-slate-900 block mt-2 truncate">{agg.value}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{agg.desc}</span>
              </div>
            ))}
          </div>

          {/* SIMULATED PERFORMANCE VISUALIZATIONS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-sm">{t('Uptime & Latency Distribution', 'توزيع زمن الاستجابة والجهوزية')}</h3>
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="text-center space-y-2">
                <span className="text-4xl">🟢</span>
                <h4 className="font-bold text-slate-800 text-xs">{t('All Core API Node Clusters', 'مجموعات خوادم واجهات التطبيقات')}</h4>
                <p className="text-[10px] text-emerald-600 font-bold uppercase">{t('Healthy & Online', 'تعمل بشكل سليم ومتصلة')}</p>
              </div>

              <div className="h-20 w-[1px] bg-slate-200 hidden md:block" />

              {/* BAR CHART SIMULATION */}
              <div className="space-y-2 w-full max-w-sm">
                <span className="text-[10px] text-slate-400 font-bold block">{t('Gateway Hourly API Requests:', 'الطلبات في الساعة:')}</span>
                <div className="flex items-end justify-between h-24 gap-1.5 pt-4">
                  {[24, 45, 55, 30, 40, 75, 95, 60, 45, 80, 110, 85].map((val, idx) => (
                    <div key={idx} className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition rounded-t" style={{ height: `${val}%` }} title={`${val * 100} req`} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: REGISTER NEW APPLICATION */}
      {/* ========================================== */}
      {showNewAppModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowNewAppModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-slate-900 text-base">{t('Register Client Application', 'تسجيل تطبيق برمجيات خارجي')}</h3>
            <p className="text-xs text-slate-400">{t('Configure corporate credentials. Client credentials allow third-party tools to fetch data seamlessly.', 'اضبط أوراق اعتماد المؤسسة. تتيح أوراق اعتماد العميل للأدوات الخارجية جلب البيانات بسلاسة.')}</p>

            {newCreatedCredentials ? (
              <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <span className="text-emerald-700 font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('Application Registered Successfully!', 'تم تسجيل التطبيق بنجاح!')}
                </span>
                <p className="text-[11px] text-slate-500">{t('Copy these credentials now. They will not be displayed again for security purposes.', 'انسخ أوراق الاعتماد الآن. لن تظهر مرة أخرى لأسباب أمنية.')}</p>

                <div className="space-y-3 pt-2 font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans font-bold uppercase">{t('Client ID', 'معرف العميل (Client ID)')}</span>
                    <div className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded mt-1">
                      <code className="text-slate-800 break-all text-[11px] font-bold">{newCreatedCredentials.clientId}</code>
                      <button 
                        onClick={() => triggerCopy(newCreatedCredentials.clientId, 'new-client-id')}
                        className="text-slate-400 hover:text-slate-700 ml-2"
                      >
                        {copiedId === 'new-client-id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans font-bold uppercase">{t('Client Secret', 'السر البرمجي للعميل (Client Secret)')}</span>
                    <div className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded mt-1">
                      <code className="text-slate-800 break-all text-[11px] font-bold">{newCreatedCredentials.secret}</code>
                      <button 
                        onClick={() => triggerCopy(newCreatedCredentials.secret, 'new-client-secret')}
                        className="text-slate-400 hover:text-slate-700 ml-2"
                      >
                        {copiedId === 'new-client-secret' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowNewAppModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg mt-3 transition"
                >
                  {t('Done', 'إتمام')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Application Name *', 'اسم التطبيق *')}</label>
                    <input
                      type="text"
                      required
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="e.g., Odoo Connector"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Developer Name *', 'اسم المطور المسؤول *')}</label>
                    <input
                      type="text"
                      required
                      value={newDevName}
                      onChange={(e) => setNewDevName(e.target.value)}
                      placeholder="e.g., Amir Sharia-Tech"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Description', 'الوصف والتفاصيل')}</label>
                  <textarea
                    value={newAppDesc}
                    onChange={(e) => setNewAppDesc(e.target.value)}
                    placeholder="Enter short details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500 h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Company Name', 'الشركة')}</label>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="e.g., Sharia Solutions"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Contact Email *', 'البريد الإلكتروني للاتصال *')}</label>
                    <input
                      type="email"
                      required
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      placeholder="e.g., devs@sharia.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Website URL', 'الموقع الإلكتروني')}</label>
                    <input
                      type="url"
                      value={newWebsite}
                      onChange={(e) => setNewWebsite(e.target.value)}
                      placeholder="e.g., https://icap.io"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">{t('Application Type', 'نوع التطبيق')}</label>
                    <select
                      value={newAppType}
                      onChange={(e) => setNewAppType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                    >
                      <option value="ERP Connector">ERP Connector</option>
                      <option value="Integration">Integration</option>
                      <option value="Reporting Tool">Reporting Tool</option>
                      <option value="Custom Application">Custom Application</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg mt-4 transition shadow-md"
                >
                  {t('Register & Generate Secret', 'تسجيل وإنشاء الأسرار البرمجية')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: GENERATE API KEY */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowNewKeyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-slate-900 text-base">{t('Generate API Key Token', 'إصدار مفتاح ربط واجهة برمجة التطبيقات')}</h3>
            <p className="text-xs text-slate-400">{t('Generate a live API token for system authentication and choose granular scopes.', 'أصدر رمز وصول حي للمصادقة البرمجية واختر النطاقات المناسبة.')}</p>

            {createdApiKeyString ? (
              <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <span className="text-emerald-700 font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('API Key Generated Successfully!', 'تم إنشاء مفتاح الـ API بنجاح!')}
                </span>
                <p className="text-[11px] text-slate-500">{t('Please copy this key and store it somewhere secure. It cannot be shown again.', 'يرجى نسخ هذا المفتاح وحفظه بشكل آمن. لن يتم عرضه مرة أخرى.')}</p>

                <div className="flex justify-between items-center bg-white border border-slate-200 p-2.5 rounded font-mono mt-1">
                  <code className="text-slate-800 break-all text-[11px] font-bold">{createdApiKeyString}</code>
                  <button 
                    onClick={() => triggerCopy(createdApiKeyString, 'new-raw-key')}
                    className="text-slate-400 hover:text-slate-700 ml-2"
                  >
                    {copiedId === 'new-raw-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => setShowNewKeyModal(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg mt-2 transition"
                >
                  {t('Done', 'إتمام')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateApiKey} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Key Name *', 'اسم المفتاح التوضيحي *')}</label>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., ERP Connector Production Key"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Link to Client Application', 'الربط مع تطبيق العميل')}</label>
                  <select
                    value={newKeyAppId}
                    onChange={(e) => setNewKeyAppId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>{app.name}</option>
                    ))}
                  </select>
                </div>

                {/* Scope Selection checkboxes */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">{t('Permissions & Scopes:', 'الصلاحيات والنطاقات الممنوحة:')}</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[
                      { val: 'read:customers', label: t('Read Customers', 'قراءة العملاء') },
                      { val: 'read:financials', label: t('Read Invoices/Payments', 'قراءة الفواتير والمدفوعات') },
                      { val: 'write:documents', label: t('Write Documents', 'رفع وحفظ المستندات') },
                      { val: 'read:compliance', label: t('Read Compliance Reports', 'قراءة تقارير الامتثال') }
                    ].map((sc) => {
                      const checked = newKeyPermissions.includes(sc.val);
                      return (
                        <label key={sc.val} className="border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setNewKeyPermissions(newKeyPermissions.filter(p => p !== sc.val));
                              } else {
                                setNewKeyPermissions([...newKeyPermissions, sc.val]);
                              }
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-bold text-slate-700 block">{sc.label}</span>
                            <code className="text-[8px] text-slate-400 block font-mono">{sc.val}</code>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg mt-3 transition shadow-md"
                >
                  {t('Generate API Key String', 'إصدار المفتاح الآمن')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: REGISTER WEBHOOK */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowWebhookModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-slate-900 text-base">{t('Register Webhook Subscription', 'إضافة خطاف ويب جديد')}</h3>
            <p className="text-xs text-slate-400">{t('ICAP will post secure event JSON payloads to this URL when state transitions fire.', 'سيرسل نظام ICAP بيانات الأحداث الحية إلى هذا الرابط فور حدوث التحديثات.')}</p>

            <form onSubmit={handleCreateWebhook} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('Destination URL *', 'رابط الوجهة المستلم *')}</label>
                <input
                  type="url"
                  required
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="e.g., https://my-server.com/icap-events"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('Event Type', 'الحدث المشغل')}</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                >
                  <option value="compliance.finding.created">Document Compliance Finding Created</option>
                  <option value="sync.completed">ERP Synchronization Run Completed</option>
                  <option value="document.uploaded">Document Uploaded</option>
                  <option value="certificate.issued">Digital Compliance Certificate Issued</option>
                  <option value="risk.alert.generated">Critical Sharia Risk Alert Generated</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg mt-3 transition shadow-md"
              >
                {t('Subscribe Webhook', 'حفظ والاشتراك في خطاف الويب')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT CUSTOM CONNECTOR ADAPTER */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-slate-900 text-base">{t('Submit Connector for ICAP Certification', 'تقديم موصل مالي لاعتماد ICAP')}</h3>
            <p className="text-xs text-slate-400">{t('Submit your custom client connector adapter for Technical & Security verification pipeline reviews.', 'قدم موصلك المالي لمراجعة الأمن والتحقق البرمجي تمهيداً لنشره في السوق.')}</p>

            <form onSubmit={handlePartnerSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Connector Name *', 'اسم الموصل *')}</label>
                  <input
                    type="text"
                    required
                    value={submitConnectorName}
                    onChange={(e) => setSubmitConnectorName(e.target.value)}
                    placeholder="e.g., Dynamics 365 Sharia Sync"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('ERP Model Supported *', 'الأنظمة المالية المدعومة *')}</label>
                  <input
                    type="text"
                    required
                    value={submitErp}
                    onChange={(e) => setSubmitErp(e.target.value)}
                    placeholder="e.g., Microsoft Dynamics 365"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('Description *', 'الوصف البرمجي والتشغيلي *')}</label>
                <textarea
                  required
                  value={submitDesc}
                  onChange={(e) => setSubmitDesc(e.target.value)}
                  placeholder="Explain integration limits, data mapping structures, and certification warrants..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500 h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Documentation URL', 'توثيق الموصل البرمجي')}</label>
                  <input
                    type="url"
                    value={submitDoc}
                    onChange={(e) => setSubmitDoc(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">{t('Connector Version *', 'رقم إصدار الموصل *')}</label>
                  <input
                    type="text"
                    required
                    value={submitVersion}
                    onChange={(e) => setSubmitVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">{t('Testing Information / Environment Warrants', 'تفاصيل بيئة الاختبار والتحقق')}</label>
                <textarea
                  value={submitTesting}
                  onChange={(e) => setSubmitTesting(e.target.value)}
                  placeholder="Describe automated suite results, sandbox tests run..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-emerald-500 h-16 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg mt-3 transition shadow-md"
              >
                {t('Submit to Audit Queue', 'إرسال إلى طابور التدقيق والاعتماد')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
