import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  BookOpen,
  Layers,
  FileText,
  Terminal,
  Activity,
  Award,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Code,
  Network,
  Download,
  Plus,
  Trash2,
  GitBranch,
  ShieldAlert,
  Server,
  Workflow
} from 'lucide-react';
import { WORKSPACES } from '../workspaces';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for IKR entities
interface KnowledgeAsset {
  id: string;
  category: 'module' | 'form' | 'api' | 'workflow' | 'standard';
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  metadata: {
    roles?: UserRole[];
    fields?: { name: string; type: string; required: boolean; descEn: string; descAr: string }[];
    endpoint?: string;
    method?: string;
    stepsEn?: string[];
    stepsAr?: string[];
    relatedAssets?: string[]; // IDs of related assets
  };
}

interface CustomArticle {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  author: string;
  date: string;
}

interface IKRViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog?: (action: string, details: string) => void;
}

// Pre-seeded static schemas representing parts of the application that are not in workspaces.ts (Forms, Workflows, APIs, etc.)
const FORM_ASSETS: KnowledgeAsset[] = [
  {
    id: 'form-register-tenant',
    category: 'form',
    nameEn: 'Register New Tenant Form',
    nameAr: 'نموذج تسجيل مستأجر جديد',
    descriptionEn: 'Form utilized by Super Admins to provision a new isolated tenant database partition and workspace.',
    descriptionAr: 'النموذج المستخدم من قبل المسؤول العام لإعداد وتخصيص بيئة عمل ومستأجر معزول جديد.',
    metadata: {
      roles: ['SUPER ADMIN'],
      fields: [
        { name: 'organizationName', type: 'string', required: true, descEn: 'Name of the company/bank', descAr: 'اسم الشركة أو البنك المعتمد' },
        { name: 'industry', type: 'string', required: true, descEn: 'SaaS industry sector group', descAr: 'قطاع أعمال المؤسسة' },
        { name: 'licenseTier', type: 'select', required: true, descEn: 'Subscription tier classification', descAr: 'باقة الاشتراك المتاحة' },
        { name: 'primaryAdminEmail', type: 'email', required: true, descEn: 'Primary workspace administrator email', descAr: 'البريد الإلكتروني لمدير المنصة الرئيسي' }
      ],
      relatedAssets: ['admin-dashboard', 'admin-orgs']
    }
  },
  {
    id: 'form-lodge-fatwa',
    category: 'form',
    nameEn: 'Lodge Digital Fatwa Form',
    nameAr: 'نموذج إصدار الفتوى والقرار الشرعي',
    descriptionEn: 'Form used by Sharia Reviewers to draft and register verified Supervisory Board rulings.',
    descriptionAr: 'النموذج المستخدم من قبل المدقق الشرعي لصياغة وتسجيل الفتاوى المعتمدة من الهيئة الشرعية.',
    metadata: {
      roles: ['SHARIA REVIEWER'],
      fields: [
        { name: 'rulingTitle', type: 'string', required: true, descEn: 'Official Sharia ruling subject heading', descAr: 'عنوان الفتوى أو القرار الشرعي الرئيسي' },
        { name: 'aaoifiStandardRef', type: 'string', required: true, descEn: 'AAOIFI Standard mapping reference', descAr: 'رقم مرجع معيار أيوفي (AAOIFI)' },
        { name: 'detailedVerdict', type: 'textarea', required: true, descEn: 'Full text detailing Islamic jurisprudence assessment', descAr: 'النص التفصيلي والأدلة الشرعية للقرار' },
        { name: 'signatoriesCount', type: 'number', required: true, descEn: 'Number of required Sharia board co-signatures', descAr: 'عدد التوقيعات المطلوبة من أعضاء الهيئة' }
      ],
      relatedAssets: ['sharia-fatwas', 'sharia-standards']
    }
  },
  {
    id: 'form-record-health',
    category: 'form',
    nameEn: 'Record Relationship Health Check Form',
    nameAr: 'نموذج تسجيل مؤشر صحة علاقة العميل',
    descriptionEn: 'Form utilized by Customer Success Managers to track compliance engagement and customer sentiment scores.',
    descriptionAr: 'النموذج المستخدم من قبل مدراء نجاح العملاء لتسجيل مستويات الرضا والالتزام بالتدقيق الدوري.',
    metadata: {
      roles: ['CUSTOMER SUCCESS MANAGER'],
      fields: [
        { name: 'clientId', type: 'select', required: true, descEn: 'Target client organization', descAr: 'المؤسسة أو العميل المستهدف' },
        { name: 'satisfactionScore', type: 'number', required: true, descEn: 'Net Promoter Score rating (1-10)', descAr: 'تقييم رضا العميل ومؤشر NPS من 10' },
        { name: 'shariaEngagementStatus', type: 'select', required: true, descEn: 'Level of collaboration on active reviews', descAr: 'مستوى التفاعل مع المراجعات الشرعية القائمة' },
        { name: 'escalationAlertLevel', type: 'select', required: true, descEn: 'Potential compliance failure risk indicators', descAr: 'مستوى التنبيه لخطورة أي تراجع في الامتثال' }
      ],
      relatedAssets: ['csm-health', 'csm-nps']
    }
  },
  {
    id: 'form-submit-evidence',
    category: 'form',
    nameEn: 'Submit Evidence Document Form',
    nameAr: 'نموذج تقديم وثائق وإثباتات الامتثال',
    descriptionEn: 'Form utilized by regular Employees and Clients to upload files, reference contracts, and financial ledgers.',
    descriptionAr: 'النموذج المستخدم من قبل الموظفين والعملاء لرفع ملفات المعاملات والعقود لمطابقتها وفحصها.',
    metadata: {
      roles: ['EMPLOYEE', 'CUSTOMER USER', 'PROJECT MANAGER'],
      fields: [
        { name: 'documentTitle', type: 'string', required: true, descEn: 'Name of file being uploaded', descAr: 'اسم المستند أو الملف المرفوع' },
        { name: 'associatedDepartment', type: 'select', required: true, descEn: 'Originating division/business line', descAr: 'القسم أو الإدارة المصدرة للمستند' },
        { name: 'documentCategory', type: 'select', required: true, descEn: 'Framework categorization of document', descAr: 'تصنيف الوثيقة حسب الإطار الشرعي' },
        { name: 'effectiveDate', type: 'date', required: true, descEn: 'SLA or contract effective date', descAr: 'تاريخ سريان العقد أو الاتفاقية' }
      ],
      relatedAssets: ['sharia-evidence', 'audit-evidence', 'org-docs']
    }
  }
];

const API_ASSETS: KnowledgeAsset[] = [
  {
    id: 'api-tx-screen',
    category: 'api',
    nameEn: 'Real-time ERP Transaction Screening API',
    nameAr: 'واجهة فحص وتدقيق المعاملات اللحظي (ERP)',
    descriptionEn: 'SaaS endpoint used to stream financial ledger transactions for immediate compliance screening.',
    descriptionAr: 'نقطة ربط برمجية مخصصة لاستقبال حركات القيود المالية وفحصها بشكل لحظي ضد شبهات الفوائد والربا.',
    metadata: {
      endpoint: '/api/v1/compliance/screen-transaction',
      method: 'POST',
      roles: ['DEVELOPER', 'COMPLIANCE OFFICER'],
      fields: [
        { name: 'transactionId', type: 'string', required: true, descEn: 'Unique ERP transaction trace reference ID', descAr: 'المعرف الفريد للحركة المالية في نظام ERP' },
        { name: 'amount', type: 'number', required: true, descEn: 'Transaction financial amount in native currency', descAr: 'المبلغ المالي الكلي بالعملة المحلية' },
        { name: 'ledgerCode', type: 'string', required: true, descEn: 'Corporate charter chart of accounts ledger code', descAr: 'رمز الحساب المالي في دليل الحسابات المؤسسي' },
        { name: 'termsText', type: 'string', required: true, descEn: 'Raw contractual terms or agreement clause text', descAr: 'النص الخام لبنود العقد أو شروط الاتفاقية' }
      ],
      relatedAssets: ['comp-transactions', 'dev-keys']
    }
  },
  {
    id: 'api-ai-audit',
    category: 'api',
    nameEn: 'AI Reasoning Sharia Audit API',
    nameAr: 'واجهة التدقيق والتحليل الذكي المدعومة بالذكاء الاصطناعي',
    descriptionEn: 'Vector semantic analysis endpoint powered by the Gemini engine to extract unapproved markup clauses.',
    descriptionAr: 'نقطة ربط برمجية تستخدم محرك Gemini للتحليل الدلالي للكشف عن غرامات التأخير غير المتوافقة.',
    metadata: {
      endpoint: '/api/v1/ai/sharia-reasoning',
      method: 'POST',
      roles: ['DEVELOPER', 'SHARIA REVIEWER', 'AUDITOR'],
      fields: [
        { name: 'documentId', type: 'string', required: true, descEn: 'Referenced vectorized document catalog identifier', descAr: 'معرف الوثيقة المرفوعة في قاعدة البيانات المتجهية' },
        { name: 'strictnessLevel', type: 'select', required: false, descEn: 'Level of compliance strictness filter (Standard / Strict)', descAr: 'مستوى تشدد مطابقة المعايير (قياسي / صارم)' }
      ],
      relatedAssets: ['dev-portal', 'comp-monitoring']
    }
  }
];

const WORKFLOW_ASSETS: KnowledgeAsset[] = [
  {
    id: 'wf-purification',
    category: 'workflow',
    nameEn: 'Interest (Riba) Isolation & Yield Purification Workflow',
    nameAr: 'مسار عزل الفوائد وتطهير العوائد والسيولة',
    descriptionEn: 'Automated operational cycle that detects interest, quarantines funds, and triggers charity purification ledger posts.',
    descriptionAr: 'الدورة التشغيلية الآلية للكشف عن العوائد الربوية العارضة وعزلها وترحيلها لحسابات الصرف الخيري.',
    metadata: {
      stepsEn: [
        'ERP Integration feeds real-time transaction records',
        'Compliance Rule engine detects late fee / incidental interest triggers',
        'Funds are automatically quarantined in a non-interest-bearing escrow account',
        'Board Review triggers and Sharia Reviewer reviews the transaction evidence',
        'Charity Purification ledger entry is logged and authorized for donation payout'
      ],
      stepsAr: [
        'تزامن نظام ERP يغذي العمليات المالية في الوقت الفعلي',
        'محرك قواعد الامتثال يرصد شبهات غرامات التأخير أو الفوائد العارضة',
        'عزل المبالغ تلقائياً في حساب أمانات مستقل لا يدر فوائد',
        'إرسال إشعار فوري للهيئة الشرعية لدراسة الأدلة وتأكيد نوع المعاملة',
        'إصدار قيد التطهير المعتمد وتحويل المبلغ المالي لحساب الصرف الخيري المعتمد'
      ],
      relatedAssets: ['comp-transactions', 'exec-risk', 'sharia-reviews']
    }
  },
  {
    id: 'wf-fatwa-lifecycle',
    category: 'workflow',
    nameEn: 'Digital Board Fatwa Drafting & Vectorization Workflow',
    nameAr: 'مسار صياغة وتوقيع الفتاوى الشرعية وتضمينها بالذاكرة المتجهية',
    descriptionEn: 'Complete lifecycle of a digital Sharia ruling from creation to automated indexing for AI semantic search.',
    descriptionAr: 'دورة الحياة المتكاملة لإصدار القرارات الشرعية ورقمنتها لتغذية محرك البحث الدلالي بالذكاء الاصطناعي.',
    metadata: {
      stepsEn: [
        'Sharia Reviewer drafts a digital fatwa based on AAOIFI standard reference',
        'Notification is dispatched to Board members requesting digital signatures',
        'Board consensus reached and electronic compliance seal is generated',
        'Fatwa is published and integrated into the global compliance policy index',
        'AI Pipeline vectorizes the ruling text, making it searchable by ERP Screening models'
      ],
      stepsAr: [
        'المدقق الشرعي يصيغ مسودة القرار الشرعي ويربطها بمعايير أيوفي المعتمدة',
        'إرسال إشعارات فورية لأعضاء الهيئة لطلب المراجعة والتوقيع الإلكتروني',
        'اكتمال النصاب وتوليد الختم الرقمي لشهادة المطابقة والامتثال',
        'نشر الفتوى وتعميمها في لوائح وسياسات المؤسسة المحدثة',
        'محرك الذكاء الاصطناعي ينشئ تمثيلاً متجهياً للقرار لدعم نماذج الفحص اللحظي'
      ],
      relatedAssets: ['sharia-fatwas', 'sharia-approvals', 'dev-docs']
    }
  }
];

const STANDARD_ASSETS: KnowledgeAsset[] = [
  {
    id: 'std-aaoifi-21',
    category: 'standard',
    nameEn: 'AAOIFI Sharia Standard No. 21 (Financial Paper)',
    nameAr: 'معيار الشريعة رقم (21) الصادر عن أيوفي (الأوراق المالية)',
    descriptionEn: 'Global standard dictating corporate equity structures, purification, and trade rules for financial paper.',
    descriptionAr: 'المعيار العالمي الحاكم لتداول الأسهم والمطابقة ومستويات التطهير المالي وصيغ التحقق.',
    metadata: {
      relatedAssets: ['sharia-standards', 'exec-score']
    }
  },
  {
    id: 'std-aaoifi-49',
    category: 'standard',
    nameEn: 'AAOIFI Sharia Standard No. 49 (Promissory Notes)',
    nameAr: 'معيار الشريعة رقم (49) الصادر عن أيوفي (عقود الاستصناع والوعود)',
    descriptionEn: 'Standard governing Islamic financing contracts, profit rates, late fees, and performance parameters.',
    descriptionAr: 'المعيار الحاكم لصيغ التمويل وعقود الاستصناع والبيع الآجل واشتراطات غرامات التأخير التنفيذية.',
    metadata: {
      relatedAssets: ['sharia-standards', 'org-reviews']
    }
  }
];

export default function IKRView({
  locale,
  theme,
  onTriggerActivityLog
}: IKRViewProps) {
  const isRTL = locale === 'ar';

  // State Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'modules' | 'forms' | 'workflows' | 'apis' | 'standards' | 'articles'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Custom annotation articles state (loaded from local storage if exists)
  const [customArticles, setCustomArticles] = useState<CustomArticle[]>(() => {
    try {
      const saved = localStorage.getItem('ikr_custom_articles');
      return saved ? JSON.parse(saved) : [
        {
          id: 'art-1',
          titleEn: 'Best Practices for ERP Ledger Code Classifications',
          titleAr: 'أفضل الممارسات لتصنيف دليل الحسابات المالية في أنظمة ERP',
          contentEn: 'To prevent false compliance triggers, ensure interest accounts are clearly segregated from operational yield ledger codes.',
          contentAr: 'لتجنب الإنذارات الخاطئة للامتثال، يوصى بعزل وتسمية حسابات الفوائد العارضة بوضوح عن القيود التشغيلية النشطة.',
          author: 'Sheikh Ibrahim Al-Mansoori',
          date: '2026-07-18'
        }
      ];
    } catch {
      return [];
    }
  });

  // New Custom Article Form State
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newContentEn, setNewContentEn] = useState('');
  const [newContentAr, setNewContentAr] = useState('');
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  // Discovery / Live Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [lastScanTimestamp, setLastScanTimestamp] = useState<string>(() => {
    return localStorage.getItem('ikr_last_scan_date') || 'Never Scanned';
  });

  // Auto-scan on mount if first time
  useEffect(() => {
    if (lastScanTimestamp === 'Never Scanned') {
      triggerDiscoveryScan();
    }
  }, []);

  // Sync articles to local storage
  useEffect(() => {
    localStorage.setItem('ikr_custom_articles', JSON.stringify(customArticles));
  }, [customArticles]);

  // Discover and build the Knowledge Base dynamically by scanning WORKSPACES config!
  const dynamicallyScannedModules = useMemo(() => {
    const modules: KnowledgeAsset[] = [];
    
    // Loop through defined workspaces in workspaces.ts and map their menus as module assets
    Object.keys(WORKSPACES).forEach((roleKey) => {
      const workspace = WORKSPACES[roleKey as UserRole];
      if (workspace && workspace.menus) {
        workspace.menus.forEach((menu) => {
          // Check if module is already added
          const existing = modules.find((m) => m.id === menu.id);
          if (existing) {
            // Append role to existing module asset
            if (existing.metadata.roles && !existing.metadata.roles.includes(workspace.role)) {
              existing.metadata.roles.push(workspace.role);
            }
          } else {
            // Create a new module asset
            modules.push({
              id: menu.id,
              category: 'module',
              nameEn: `${menu.name} Page`,
              nameAr: `صفحة ${isRTL ? getArabicMenuName(menu.name) : menu.name}`,
              descriptionEn: `Core functional view mapped within the ${workspace.workspaceNameEn}.`,
              descriptionAr: `واجهة وظيفية أساسية مدمجة ضمن ${workspace.workspaceNameAr}.`,
              metadata: {
                roles: [workspace.role],
                relatedAssets: []
              }
            });
          }
        });
      }
    });

    return modules;
  }, [isRTL]);

  // Combine dynamic workspace modules with pre-seeded structural schemas
  const allAssets = useMemo(() => {
    return [
      ...dynamicallyScannedModules,
      ...FORM_ASSETS,
      ...API_ASSETS,
      ...WORKFLOW_ASSETS,
      ...STANDARD_ASSETS
    ];
  }, [dynamicallyScannedModules]);

  // Dynamic filter lists
  const availableRoles = useMemo(() => {
    const rolesSet = new Set<string>();
    allAssets.forEach((a) => {
      if (a.metadata.roles) {
        a.metadata.roles.forEach((r) => rolesSet.add(r));
      }
    });
    return Array.from(rolesSet);
  }, [allAssets]);

  // Search and Filter logic
  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchesSearch = 
        asset.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.nameAr.includes(searchQuery) ||
        asset.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.descriptionAr.includes(searchQuery) ||
        asset.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = 
        roleFilter === 'ALL' || 
        (asset.metadata.roles && asset.metadata.roles.includes(roleFilter as UserRole));

      const matchesCategory = 
        activeTab === 'dashboard' || 
        activeTab === 'articles' || 
        (activeTab === 'modules' && asset.category === 'module') ||
        (activeTab === 'forms' && asset.category === 'form') ||
        (activeTab === 'workflows' && asset.category === 'workflow') ||
        (activeTab === 'apis' && asset.category === 'api') ||
        (activeTab === 'standards' && asset.category === 'standard');

      return matchesSearch && matchesRole && matchesCategory;
    });
  }, [allAssets, searchQuery, roleFilter, activeTab]);

  // Dynamic discovery scanning simulation
  const triggerDiscoveryScan = () => {
    setIsScanning(true);
    setScanProgress(5);
    setScanLogs([`[INFO] ${isRTL ? 'بدء فحص بيئة وبنية النظام الموحدة لإيكاب...' : 'Initializing dynamic ICAP unified platform architecture scan...'}`]);

    const steps = [
      { progress: 20, log: isRTL ? 'تحليل هيكلية الأدوار والمسؤوليات (12 دور تشغيلي)...' : 'Parsing User Role schemas and matrices (12 active roles loaded)...' },
      { progress: 40, log: isRTL ? 'مسح مسارات التنقل والقوائم المخصصة للمستأجرين...' : 'Analyzing custom sidebar layouts and workspace permission scopes...' },
      { progress: 60, log: isRTL ? 'فحص حقول النماذج ومعايير التحقق والتحصيل...' : 'Discovering interactive form fields, REST endpoints, and schema validators...' },
      { progress: 80, log: isRTL ? 'تخطيط الترابط والربط بين معايير أيوفي وأدوات التدقيق...' : 'Mapping consensus pipelines between AAOIFI standards and compliance workflows...' },
      { progress: 95, log: isRTL ? 'فهرسة الكيانات المعرفية وتوليد سجل الإصدار الموحد...' : 'Indexing catalog objects and assembling platform-wide relational graph...' },
      { progress: 100, log: isRTL ? 'اكتمل مسح مستودع المعرفة! تم توليد 148 سجلاً هيكلياً بنجاح.' : 'Discovery scan finalized! 148 structured repository nodes updated and locked.' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanProgress(step.progress);
        setScanLogs((prev) => [...prev, `[INFO] ${step.log}`]);
        if (step.progress === 100) {
          setIsScanning(false);
          const nowStr = new Date().toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
          setLastScanTimestamp(nowStr);
          localStorage.setItem('ikr_last_scan_date', nowStr);
          if (onTriggerActivityLog) {
            onTriggerActivityLog(
              'IKR Architecture Auto-Scan',
              `Scanned ${allAssets.length} platform nodes, generated detailed compliance schemas and relationship matrices.`
            );
          }
        }
      }, (idx + 1) * 600);
    });
  };

  // Add custom manual annotation article
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleEn || !newTitleAr || !newContentEn || !newContentAr) return;

    const newArt: CustomArticle = {
      id: `art-${Date.now()}`,
      titleEn: newTitleEn,
      titleAr: newTitleAr,
      contentEn: newContentEn,
      contentAr: newContentAr,
      author: 'Compliance Officer (Self)',
      date: new Date().toISOString().split('T')[0]
    };

    setCustomArticles((prev) => [newArt, ...prev]);
    setNewTitleEn('');
    setNewTitleAr('');
    setNewContentEn('');
    setNewContentAr('');
    setIsAddingArticle(false);

    if (onTriggerActivityLog) {
      onTriggerActivityLog('Add IKR Article', `Logged new custom platform knowledge article: ${newTitleEn}`);
    }
  };

  const handleDeleteArticle = (id: string) => {
    setCustomArticles((prev) => prev.filter((a) => a.id !== id));
    if (onTriggerActivityLog) {
      onTriggerActivityLog('Delete IKR Article', `Removed platform knowledge article ID: ${id}`);
    }
  };

  // Generate complete system JSON schema for exporting
  const handleExportSchema = () => {
    const fullSchema = {
      platformName: 'Islamic Compliance AI Platform (ICAP)',
      exporter: 'IKR Automated Engine v2.1',
      scannedAt: lastScanTimestamp,
      assetStats: {
        totalScannedAssets: allAssets.length,
        modulesCount: dynamicallyScannedModules.length,
        formsCount: FORM_ASSETS.length,
        apisCount: API_ASSETS.length,
        workflowsCount: WORKFLOW_ASSETS.length,
        standardsCount: STANDARD_ASSETS.length
      },
      rolesMatrix: WORKSPACES,
      assets: allAssets,
      customArticles: customArticles
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullSchema, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `icap_ikr_platform_schema_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="ikr-suite-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Title & Banner area */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5 animate-pulse" />
              <span>{isRTL ? 'مركز التحكم والتوثيق الموحد' : 'SINGLE SOURCE OF TRUTH'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Database className="w-8 h-8 text-yellow-400" />
              <span>{isRTL ? 'مستودع المعرفة الإسلامي الذكي (IKR)' : 'ICAP Knowledge Repository (IKR)'}</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl">
              {isRTL 
                ? 'النظام التشغيلي والتوثيقي المركزي لمطابقة وحصر وهيكلة كافة صفحات، نماذج، عمليات، وواجهات ربط المنصة ومطابقتها دلالياً مع معايير الشريعة الإسلامية.'
                : 'The central system catalog that automatically documents, organizes, maps, and maintains structural knowledge of all pages, forms, workflows, API layers, and standards across the ICAP ecosystem.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={triggerDiscoveryScan}
              disabled={isScanning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isRTL ? 'إعادة فحص بنية المنصة' : 'Re-scan Platform Layout'}</span>
            </button>

            <button
              onClick={handleExportSchema}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>{isRTL ? 'تصدير وثيقة الهيكل JSON' : 'Export System JSON'}</span>
            </button>
          </div>
        </div>

        {/* Scan progress panel */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-slate-800 space-y-4"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin" />
                  {isRTL ? 'يجري الفحص والتحليل الهيكلي...' : 'Analyzing platform models...'}
                </span>
                <span className="font-mono font-semibold text-slate-300">{scanProgress}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>

              {/* Console logs */}
              <div className="bg-slate-950 rounded-lg p-3 max-h-32 overflow-y-auto font-mono text-[11px] text-emerald-300 space-y-1 scrollbar-thin">
                {scanLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-mono">
          <span>{isRTL ? `آخر فحص: ${lastScanTimestamp}` : `Last automated scan: ${lastScanTimestamp}`}</span>
          <span>•</span>
          <span className="text-yellow-400 font-semibold">{isRTL ? `قواعد ومكونات مفهرسة: ${allAssets.length}` : `Cataloged elements: ${allAssets.length}`}</span>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-3.5 shadow-sm`}>
          <div className="bg-blue-500/10 text-blue-500 p-2.5 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{isRTL ? 'صفحات ومكونات' : 'MODULES & PAGES'}</span>
            <span className="text-xl font-bold">{dynamicallyScannedModules.length}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-3.5 shadow-sm`}>
          <div className="bg-emerald-500/10 text-emerald-500 p-2.5 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{isRTL ? 'حقول النماذج' : 'FORMS & FIELDS'}</span>
            <span className="text-xl font-bold">{FORM_ASSETS.length}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-3.5 shadow-sm`}>
          <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{isRTL ? 'قنوات الربط البرمجي' : 'APIs & ENDPOINTS'}</span>
            <span className="text-xl font-bold">{API_ASSETS.length}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-3.5 shadow-sm`}>
          <div className="bg-purple-500/10 text-purple-500 p-2.5 rounded-lg">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{isRTL ? 'دورات العمل الآلية' : 'WORKFLOW LOOPS'}</span>
            <span className="text-xl font-bold">{WORKFLOW_ASSETS.length}</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-3.5 shadow-sm`}>
          <div className="bg-rose-500/10 text-rose-500 p-2.5 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{isRTL ? 'معايير فقهية مدمجة' : 'SHARIA CODES'}</span>
            <span className="text-xl font-bold">{STANDARD_ASSETS.length}</span>
          </div>
        </div>
      </div>

      {/* Main Suite Explorer and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-sm`}>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'محرك البحث الدلالي للوثائق والمكونات' : 'EXPLORER SEARCH & FILTER'}</h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'البحث عن صفحة، حقل، معيار...' : 'Search layout schema elements...'}
                className="w-full text-xs pl-9 pr-4 py-2 border rounded-lg bg-slate-550/10 focus:ring-1 focus:ring-emerald-500 border-slate-200 dark:border-slate-800 outline-none"
              />
            </div>

            {/* Role Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">{isRTL ? 'تصفية حسب صلاحية الدور' : 'Filter by Role Scope'}</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full text-xs p-2 border rounded-lg bg-slate-550/10 border-slate-200 dark:border-slate-800 outline-none"
              >
                <option value="ALL">{isRTL ? 'كل أدوار وصلاحيات المنصة' : 'All Roles & Capabilities'}</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats Summary info */}
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-sm text-xs`}>
            <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">{isRTL ? 'إحصائيات ترابط البنية' : 'ARCHITECTURE INTEGRITY'}</h4>
            <div className="flex justify-between">
              <span className="text-slate-400">{isRTL ? 'تغطية معايير أيوفي' : 'AAOIFI Standard Coverage'}</span>
              <span className="font-mono font-bold text-emerald-500">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isRTL ? 'نماذج التحقق المؤتمتة' : 'Automated Checklists'}</span>
              <span className="font-mono font-bold text-blue-500">28 / 28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{isRTL ? 'حماية عزل الفوائد' : 'Isolation Safeguards'}</span>
              <span className="font-mono font-bold text-amber-500">Active</span>
            </div>
          </div>
        </div>

        {/* Central Repository Explorer content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Navigation Tabs */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'لوحة المخططات والمسح' : 'Discovery Dashboard'}
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'modules'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'المنتجات والصفحات' : 'Modules & Pages'}
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'forms'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'حقول النماذج' : 'Forms & Fields'}
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'workflows'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'دورات العمل والمسارات' : 'Workflows & Loops'}
            </button>
            <button
              onClick={() => setActiveTab('apis')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'apis'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'واجهات وباقات الربط' : 'APIs & SDKs'}
            </button>
            <button
              onClick={() => setActiveTab('standards')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'standards'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'أحكام أيوفي والسياسات' : 'Standards & Policy'}
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
                activeTab === 'articles'
                  ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRTL ? 'ملاحظات وإرشادات وتدقيقات' : 'Custom Articles'}
            </button>
          </div>

          {/* Sub Views */}
          <div className="space-y-4">
            
            {/* Dashboard Sub Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Intro Card */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-sm font-bold uppercase text-slate-400">{isRTL ? 'مخطط العلاقات والربط المعماري الموحد' : 'INTEGRAL ARCHITECTURE GRAPH MAP'}</h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isRTL 
                      ? 'يوضح المخطط أدناه الهيكلية الشمولية لكيفية عزل وتأمين المعاملات والربط بين لوائح ومعايير أيوفي، والتحقق المالي اللحظي والرقابة الشاملة.'
                      : 'This operational topology traces how data enters through ERP integration, triggers screening rules against AAOIFI benchmarks, and routes quarantine decisions directly to legal and advisory dashboards.'}
                  </p>

                  {/* Flow chart graphic */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    
                    <div className="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 w-full">
                      <div className="text-[10px] font-mono text-blue-400 font-bold">1. DATA STREAM</div>
                      <div className="font-bold text-xs text-slate-200">ERP & Ledger APIs</div>
                      <p className="text-[9px] text-slate-500">Real-time journal ingestion</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />

                    <div className="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 w-full">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">2. REASONING FILTER</div>
                      <div className="font-bold text-xs text-slate-200">IKR Compliance Rules</div>
                      <p className="text-[9px] text-slate-500">Gemini AAOIFI Screening</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />

                    <div className="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 w-full relative">
                      <div className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">QUARANTINE</div>
                      <div className="text-[10px] font-mono text-amber-400 font-bold">3. AUDIT GATEWAY</div>
                      <div className="font-bold text-xs text-slate-200">Isolation & Escrow</div>
                      <p className="text-[9px] text-slate-500">Yield purification holds</p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />

                    <div className="flex-1 p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 w-full">
                      <div className="text-[10px] font-mono text-purple-400 font-bold">4. CERTIFICATION</div>
                      <div className="font-bold text-xs text-slate-200">Islamic Compliance Seals</div>
                      <p className="text-[9px] text-slate-500">Consconsensus signoff</p>
                    </div>

                  </div>
                </div>

                {/* Scanned Entities Preview List */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase text-slate-400">{isRTL ? 'عناصر وهياكل تم اكتشافها مؤخراً' : 'LATEST DISCOVERED SCHEMAS'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allAssets.slice(0, 4).map((asset) => (
                      <div 
                        key={asset.id} 
                        onClick={() => {
                          if (asset.category === 'module') setActiveTab('modules');
                          else if (asset.category === 'form') setActiveTab('forms');
                          else if (asset.category === 'api') setActiveTab('apis');
                          else if (asset.category === 'workflow') setActiveTab('workflows');
                          else if (asset.category === 'standard') setActiveTab('standards');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 ${
                          theme === 'dark' ? 'bg-slate-900/40 hover:bg-slate-900 border-slate-800' : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            asset.category === 'module' ? 'bg-blue-500/10 text-blue-400' :
                            asset.category === 'form' ? 'bg-emerald-500/10 text-emerald-400' :
                            asset.category === 'api' ? 'bg-amber-500/10 text-amber-400' :
                            asset.category === 'workflow' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {asset.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">#{asset.id}</span>
                        </div>
                        <h4 className="font-bold text-xs mt-2">{isRTL ? asset.nameAr : asset.nameEn}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{isRTL ? asset.descriptionAr : asset.descriptionEn}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* List View for entities (Modules, Forms, APIs, Workflows, Standards) */}
            {activeTab !== 'dashboard' && activeTab !== 'articles' && (
              <div className="space-y-4">
                {filteredAssets.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <span>{isRTL ? 'لم يتم العثور على أي نتائج تطابق البحث' : 'No matching platform schemas found.'}</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAssets.map((asset) => (
                      <div 
                        key={asset.id} 
                        className={`p-5 rounded-xl border ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        } space-y-4 shadow-sm`}
                      >
                        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                asset.category === 'module' ? 'bg-blue-500/10 text-blue-400' :
                                asset.category === 'form' ? 'bg-emerald-500/10 text-emerald-400' :
                                asset.category === 'api' ? 'bg-amber-500/10 text-amber-400' :
                                asset.category === 'workflow' ? 'bg-purple-500/10 text-purple-400' :
                                'bg-rose-500/10 text-rose-400'
                              }`}>
                                {asset.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {asset.id}</span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-100">{isRTL ? asset.nameAr : asset.nameEn}</h3>
                          </div>
                          
                          {/* Role access pill */}
                          {asset.metadata.roles && (
                            <div className="flex flex-wrap gap-1.5">
                              {asset.metadata.roles.map((r, i) => (
                                <span key={i} className="bg-slate-800 text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded">
                                  {r.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">{isRTL ? asset.descriptionAr : asset.descriptionEn}</p>

                        {/* Extra metadata blocks based on category */}
                        {/* 1. Forms and API fields */}
                        {asset.metadata.fields && (
                          <div className="space-y-2 pt-2">
                            <h4 className="font-bold text-[10px] uppercase text-slate-500">{isRTL ? 'هيكل المدخلات والبيانات المطلوبة' : 'FIELDS SCHEMA DETAILS'}</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[11px] font-mono">
                                <thead>
                                  <tr className="border-b border-slate-800 text-slate-500">
                                    <th className="pb-1.5">{isRTL ? 'اسم الحقل' : 'FieldName'}</th>
                                    <th className="pb-1.5">{isRTL ? 'النوع' : 'Type'}</th>
                                    <th className="pb-1.5">{isRTL ? 'إلزامي' : 'Required'}</th>
                                    <th className="pb-1.5">{isRTL ? 'الوصف الوظيفي والتحقق' : 'Jurisprudence Validation Rules'}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {asset.metadata.fields.map((field, fIdx) => (
                                    <tr key={fIdx} className="border-b border-slate-800/40 text-slate-300">
                                      <td className="py-2 font-bold text-slate-100">{field.name}</td>
                                      <td className="py-2 text-blue-400">{field.type}</td>
                                      <td className="py-2">
                                        <span className={`px-1 rounded text-[9px] ${field.required ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                                          {field.required ? 'YES' : 'OPTIONAL'}
                                        </span>
                                      </td>
                                      <td className="py-2 text-slate-400">{isRTL ? field.descAr : field.descEn}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* 2. Workflows progress timeline */}
                        {asset.metadata.stepsEn && (
                          <div className="space-y-3 pt-2">
                            <h4 className="font-bold text-[10px] uppercase text-slate-500">{isRTL ? 'خطوات دورة العمل الشرعية الموحدة' : 'AUTOMATED COMPLIANCE STEPS'}</h4>
                            <div className="relative border-l border-emerald-500/40 pl-4 space-y-3">
                              {(isRTL ? asset.metadata.stepsAr : asset.metadata.stepsEn)?.map((step, sIdx) => (
                                <div key={sIdx} className="relative">
                                  <div className="absolute -left-[21px] top-1 bg-emerald-500 w-2.5 h-2.5 rounded-full border border-slate-900"></div>
                                  <span className="text-[11px] text-slate-300 block">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. API endpoints */}
                        {asset.metadata.endpoint && (
                          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded">
                                {asset.metadata.method}
                              </span>
                              <span className="text-slate-100 font-bold">{asset.metadata.endpoint}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase">{isRTL ? 'نقطة ربط نشطة' : 'Ingress Endpoint'}</span>
                          </div>
                        )}

                        {/* Relations trace */}
                        {asset.metadata.relatedAssets && asset.metadata.relatedAssets.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-800/40">
                            <span className="font-bold uppercase text-slate-500">{isRTL ? 'ارتباط وثيق بـ:' : 'Related Assets:'}</span>
                            {asset.metadata.relatedAssets.map((relId) => (
                              <span key={relId} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                #{relId}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Custom Articles & Knowledge annotations */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                
                {/* Form to add new manual annotation */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-500" />
                      <span>{isRTL ? 'إضافة وثيقة إرشادية وتدقيق مخصصة' : 'Log Custom Guidance Note / Annotation'}</span>
                    </h3>
                    <button
                      onClick={() => setIsAddingArticle(!isAddingArticle)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition"
                    >
                      {isAddingArticle ? (isRTL ? 'إلغاء' : 'Cancel') : (isRTL ? 'إنشاء مسودة' : 'Draft New')}
                    </button>
                  </div>

                  {isAddingArticle && (
                    <form onSubmit={handleAddArticle} className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Title (English)</label>
                          <input
                            type="text"
                            required
                            value={newTitleEn}
                            onChange={(e) => setNewTitleEn(e.target.value)}
                            placeholder="e.g., Purification account structures"
                            className="w-full text-xs p-2 border rounded-lg bg-slate-550/10 border-slate-200 dark:border-slate-800 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">العنوان (بالعربية)</label>
                          <input
                            type="text"
                            required
                            value={newTitleAr}
                            onChange={(e) => setNewTitleAr(e.target.value)}
                            placeholder="مثال: هيكلة حسابات التطهير المالي"
                            className="w-full text-xs p-2 border rounded-lg bg-slate-550/10 border-slate-200 dark:border-slate-800 outline-none text-right"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">Content (English)</label>
                          <textarea
                            required
                            rows={3}
                            value={newContentEn}
                            onChange={(e) => setNewContentEn(e.target.value)}
                            placeholder="Provide detailed compliance guidelines..."
                            className="w-full text-xs p-2 border rounded-lg bg-slate-550/10 border-slate-200 dark:border-slate-800 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase">المحتوى والإرشادات الشرعية (بالعربية)</label>
                          <textarea
                            required
                            rows={3}
                            value={newContentAr}
                            onChange={(e) => setNewContentAr(e.target.value)}
                            placeholder="تفاصيل الشروط الفقهية الواجب مراعاتها..."
                            className="w-full text-xs p-2 border rounded-lg bg-slate-550/10 border-slate-200 dark:border-slate-800 outline-none text-right"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition"
                      >
                        {isRTL ? 'حفظ وتثبيت بمستودع المعرفة' : 'Publish & Document Annotation'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                  {customArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-sm`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-200">{isRTL ? article.titleAr : article.titleEn}</h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {isRTL ? `المصدر: ${article.author} • ${article.date}` : `Source: ${article.author} • ${article.date}`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{isRTL ? article.contentAr : article.contentEn}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// Helper to resolve Arabic titles dynamically for workspaces menus
function getArabicMenuName(engName: string): string {
  const mapping: Record<string, string> = {
    'Dashboard': 'لوحة القيادة',
    'Customer Lifecycle': 'إدارة دورة حياة العملاء',
    'Organizations': 'المؤسسات والشركات',
    'Users': 'المستخدمين والصلاحيات',
    'Roles': 'الأدوار والوظائف',
    'Subscriptions': 'الاشتراكات والباقات',
    'Marketplace': 'سوق التطبيقات والحلول',
    'API Management': 'إدارة واجهات الربط (API)',
    'Developer Portal': 'بوابة المطورين والربط',
    'Security': 'أمن وحماية البيانات',
    'Audit Logs': 'سجلات الأحداث والتدقيق',
    'Monitoring': 'الرقابة والامتثال اللحظي',
    'System Health': 'صحة النظام والأداء',
    'ICAP Readiness': 'مؤشر الجاهزية الإسلامية',
    'Settings': 'إعدادات المنصة',
    'My Organization': 'بيانات مؤسستنا',
    'Departments': 'الأقسام والهيكل الإداري',
    'ERP Connections': 'قنوات ربط الموارد (ERP)',
    'Compliance Reviews': 'مراجعات الامتثال الفعالة',
    'Reports': 'التقارير والإحصائيات',
    'Certificates': 'الشهادات الشرعية والاعتماد',
    'Documents': 'المستندات والوثائق',
    'Billing': 'الفواتير والاشتراكات',
    'Support': 'الدعم والمساعدة',
    'Assigned Reviews': 'مراجعات الامتثال المعينة',
    'Evidence': 'أدلة ووثائق الإثبات',
    'Findings': 'النتائج والملاحظات',
    'Standards': 'المعايير واللوائح الشرعية',
    'Fatwas': 'الفتاوى والقرارات الشرعية',
    'Approvals': 'الموافقات والاعتمادات',
    'Notifications': 'مركز التنبيهات والأحداث',
    'Audit Engagements': 'مهام التدقيق القائمة',
    'Working Papers': 'أوراق العمل والتدقيق',
    'Corrective Actions': 'الإجراءات التصحيحية المعتمدة',
    'Calendar': 'جدول مواعيد التدقيق',
    'Transactions': 'فحص وتدقيق المعاملات',
    'Executive Reports': 'تقارير الإدارة العليا',
    'KPIs': 'مؤشرات الأداء الكبرى',
    'Compliance Score': 'مؤشر الامتثال العام',
    'Risk Overview': 'خريطة مخاطر الامتثال',
    'Trends': 'تحليل الاتجاهات والمخاطر',
    'Customers': 'قائمة العملاء الجدد',
    'Projects': 'مشاريع الشراكة الحالية',
    'Revenue': 'الأرباح والعوائد المشتركة',
    'Commissions': 'عمولات الشركاء المستحقة',
    'SDK': 'حزم تطوير البرمجيات SDK',
    'API Keys': 'مفاتيح الربط البرمجي API',
    'Applications': 'تطبيقات المطورين المفتوحة',
    'Analytics': 'تحليلات المطور الكلية',
    'Documentation': 'التوثيق البرمجي والتعليمات'
  };
  return mapping[engName] || engName;
}
