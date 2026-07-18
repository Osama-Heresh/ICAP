import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Filter,
  Users,
  Terminal,
  FileText,
  Sliders,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Database,
  BarChart2,
  RotateCcw,
  Plus,
  Compass,
  AlertCircle,
  Scale,
  DollarSign,
  Briefcase,
  Layers,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  Info,
  ExternalLink,
  Lock,
  Workflow
} from 'lucide-react';

interface AiComplianceEngineViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

// Database Interfaces
interface AiAgent {
  id: string;
  name: string;
  type: 'sharia' | 'accounting' | 'audit' | 'legal' | 'risk';
  description: string;
  status: 'Active' | 'Optimizing' | 'Idle';
  accuracy: number;
  tasksCompleted: number;
  icon: any;
}

interface AnalysisJob {
  id: string;
  organizationId: string;
  name: string;
  type: string;
  dataSource: string;
  status: 'Completed' | 'Running' | 'Failed' | 'Pending';
  startedAt: string;
  completedAt?: string;
  score: number;
  agentIds: string[];
}

interface Finding {
  id: string;
  organizationId: string;
  title: string;
  category: 'Sharia Compliance' | 'Financial Compliance' | 'SOP Compliance' | 'Policy Compliance' | 'Risk Management';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  applicableStandard: string;
  confidence: number;
  status: 'New' | 'Under Review' | 'Approved' | 'Rejected' | 'Resolved';
  recommendation: string;
  aiExplanation: {
    detected: string;
    why: string;
    evidence: string;
    standard: string;
    nextSteps: string;
  };
  evidenceId: string;
  timestamp: string;
}

interface EvidenceItem {
  id: string;
  findingId: string;
  sourceType: 'Invoice' | 'Purchase Order' | 'Contract' | 'SOP Document' | 'Journal Entry' | 'ERP Record' | 'Zakat Ledger';
  sourceId: string;
  description: string;
  date: string;
}

interface ReviewTask {
  id: string;
  findingId: string;
  assignedUser: string;
  status: 'Pending Decision' | 'Approved' | 'Rejected' | 'Resolved';
  comments: {
    id: string;
    user: string;
    comment: string;
    timestamp: string;
  }[];
}

interface ComplianceScore {
  id: string;
  organizationId: string;
  category: string;
  score: number;
  date: string;
}

export default function AiComplianceEngineView({
  locale,
  theme,
  onTriggerActivityLog
}: AiComplianceEngineViewProps) {
  const isRTL = locale === 'ar';

  // Sub Tab State
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'analysis' | 'agents' | 'findings' | 'risk' | 'evidence' | 'queue' | 'settings' | 'db_schema'>('dashboard');

  // ====================================================
  // DATABASE STATE (Requirement 13 & 14)
  // ====================================================
  
  // 14. Demo Data - AI Agents
  const [aiAgents, setAiAgents] = useState<AiAgent[]>([
    {
      id: 'agent-sharia',
      name: isRTL ? 'مستشار الشريعة الذكي' : 'Sharia Compliance AI',
      type: 'sharia',
      description: isRTL 
        ? 'تحليل الهياكل والمنتجات المالية والتحقق التلقائي من خلوها من شبهة الربا والغرر والضرر طبقاً لمعايير AAOIFI.' 
        : 'Analyzes financial structures, products, and complex contracts to detect interest (riba), ambiguity (gharar), and direct compliance violations under AAOIFI.',
      status: 'Active',
      accuracy: 99.4,
      tasksCompleted: 489,
      icon: Scale
    },
    {
      id: 'agent-accounting',
      name: isRTL ? 'المدقق المحاسبي الذكي' : 'Accounting AI',
      type: 'accounting',
      description: isRTL 
        ? 'تدقيق قيود اليومية ومطابقة الحسابات وكشف الانحرافات والنسب المالية وعقود التمويل التراكمية.' 
        : 'Reviews journal entries, analyzes sub-ledgers, checks transaction consistency, calculates Zakat ratios, and flags non-compliant interest expenses.',
      status: 'Active',
      accuracy: 98.1,
      tasksCompleted: 812,
      icon: DollarSign
    },
    {
      id: 'agent-audit',
      name: isRTL ? 'مدقق الإجراءات والرقابة' : 'Audit AI',
      type: 'audit',
      description: isRTL 
        ? 'التحقق التلقائي من الامتثال لخطوات العمل (SOP) والحصول على الموافقات الثنائية وتدقيق الصلاحيات.' 
        : 'Evaluates internal operational controls, checks purchase and lease workflows against SOP steps, flags missing authorization signatures.',
      status: 'Active',
      accuracy: 97.5,
      tasksCompleted: 654,
      icon: CheckCircle2
    },
    {
      id: 'agent-legal',
      name: isRTL ? 'محلل العقود القانونية' : 'Legal AI',
      type: 'legal',
      description: isRTL 
        ? 'مراجعة البنود والاتفاقيات، وكشف الشروط التعسفية والربوية وتطابقها مع سياسات حوكمة الشركاء.' 
        : 'Scans contract clauses for late payment penalty compound loops, ownership transfer sequence in Murabaha, and guarantees in Mudaraba contracts.',
      status: 'Active',
      accuracy: 96.8,
      tasksCompleted: 341,
      icon: FileText
    },
    {
      id: 'agent-risk',
      name: isRTL ? 'محلل المخاطر الكلية' : 'Risk AI',
      type: 'risk',
      description: isRTL 
        ? 'قياس المخاطر المالية والتشغيلية ودرجات الامتثال الشرعي ومخاطر تقلبات الأصول والسيولة.' 
        : 'Assesses operational, market, and compliance risk parameters based on active corporate transactions and impure income ratios.',
      status: 'Active',
      accuracy: 95.9,
      tasksCompleted: 290,
      icon: AlertTriangle
    }
  ]);

  // 14. Demo Data - Analysis Jobs
  const [analysisJobs, setAnalysisJobs] = useState<AnalysisJob[]>([
    {
      id: 'job-1',
      organizationId: 'org-icap-demo',
      name: isRTL ? 'مراجعة الامتثال السنوية الشاملة' : 'Annual Comprehensive Compliance Review',
      type: 'Full Compliance Review',
      dataSource: 'ERP Data & Uploaded Contracts',
      status: 'Completed',
      startedAt: '2026-07-10 09:00:00',
      completedAt: '2026-07-10 10:45:00',
      score: 95,
      agentIds: ['agent-sharia', 'agent-accounting', 'agent-audit', 'agent-legal', 'agent-risk']
    },
    {
      id: 'job-2',
      organizationId: 'org-icap-demo',
      name: isRTL ? 'تدقيق الحركات المالية بالـ ERP' : 'ERP Transaction Integrity Scan',
      type: 'ERP Transaction Review',
      dataSource: 'Odoo & SAP Active Ingestion Feed',
      status: 'Completed',
      startedAt: '2026-07-15 14:00:00',
      completedAt: '2026-07-15 14:15:30',
      score: 93,
      agentIds: ['agent-accounting', 'agent-risk']
    },
    {
      id: 'job-3',
      organizationId: 'org-icap-demo',
      name: isRTL ? 'مراجعة عقود الاستثمار والتمويل' : 'Sharia Investment Review',
      type: 'Sharia Compliance Review',
      dataSource: 'Legal Sharepoint PDF Contracts',
      status: 'Completed',
      startedAt: '2026-07-16 11:30:00',
      completedAt: '2026-07-16 11:55:00',
      score: 98,
      agentIds: ['agent-sharia', 'agent-legal']
    }
  ]);

  // 14. Demo Data - exactly 20 realistic findings (Requirement 14)
  const [findings, setFindings] = useState<Finding[]>([
    {
      id: 'FND-001',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'شبهة فائدة تأخيرية ربوية في قيد اليومية' : 'Compound Late Penalty Clause on ERP Invoice',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'تم اكتشاف قيد مالي يسجل إيرادات "رسوم حظر وتأخير" بنسبة مركبة قدرها 2.5٪ على الفواتير المتأخرة، وهو مخالف صراحة لمعيار أيوفي الشرعي رقم 8.'
        : 'ERP invoice logs reveal active calculation of a 2.5% compounded monthly late fee applied to client outstanding balances. Compounded interest (Riba) is prohibited under AAOIFI Sharia Standard No. 8.',
      applicableStandard: 'AAOIFI Sharia Standard No. 8 (Late Penalties & Receivables)',
      confidence: 98.4,
      status: 'New',
      recommendation: isRTL
        ? 'تحويل مبالغ رسوم التأخير بالكامل إلى حساب التطهير الخيري، وتحديث نموذج الفواتير الافتراضي في الـ ERP لمنع فرض فوائد تراكمية.'
        : 'Immediately divert collected late fees to the Purification Account (Charity Ledger). Update Odoo/SAP billing templates to exclude interest-based compounding multipliers.',
      aiExplanation: {
        detected: 'Automated scan identified account code "4509-INTEREST-PENALTY" receiving credit entry matching exact calculation of 2.5% penalty.',
        why: 'Conventional late penalty clauses that accumulate compound interest are Sharia-non-compliant because debt cannot generate incremental contractual yields.',
        evidence: 'Journal Entry: JE-55421 | Odoo Account: 4509-INTEREST-INC',
        standard: 'AAOIFI Standard No. 8 Section 4/1 states any stipulate penalty in credit sales is void and must not serve as corporate income.',
        nextSteps: 'Divert $4,520 to charity funds; deploy compliant "remedy charge" clause allowing actual cost recovery or immediate escalation.'
      },
      evidenceId: 'EVI-101',
      timestamp: '2026-07-17 10:12:00'
    },
    {
      id: 'FND-002',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'غياب خطوة المراجعة الثنائية لإذن الصرف في SOP' : 'Missing Dual-Authorization Control Workflow',
      category: 'SOP Compliance',
      severity: 'High',
      description: isRTL 
        ? 'تم اعتماد أمر شراء معدات بقيمة تزيد عن 500,000 دولار بتوقيع منفرد من مدير المشتريات، مما يخالف لائحة الصلاحيات الثنائية المعيارية للشركة.'
        : 'Purchase Order PO-8891 exceeding the corporate single-sign-off limit ($200,000) was approved without secondary VP validation. This violates Standard SOP Procurement Controls.',
      applicableStandard: 'Internal Audit Manual SOP-PROC-04',
      confidence: 96.0,
      status: 'Under Review',
      recommendation: isRTL
        ? 'تجميد الصرف مؤقتاً لحين الحصول على مصادقة المدير المالي أو نائب رئيس مجلس الإدارة عبر نظام الأذونات.'
        : 'Obtain required retroactive approval from VP of Finance. Block subsequent payments in SAP pending secondary credential authorization.',
      aiExplanation: {
        detected: 'Single digital signature log linked to PO-8891 with a grand total of $520,000.',
        why: 'Internal controls demand two-person sign-off on transactions over $200k to mitigate credit risk and embezzlement.',
        evidence: 'Purchase Order: PO-8891 | Approved by: admin_p_odoo',
        standard: 'COSO Internal Control Framework & SOP Procurement Policy v4.',
        nextSteps: 'Route approval task directly to Executive Board queue; append dual token key to ledger.'
      },
      evidenceId: 'EVI-102',
      timestamp: '2026-07-17 09:30:15'
    },
    {
      id: 'FND-003',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'إبرام عقد تأمين تجاري تقليدي لأسطول النقل' : 'Conventional Commercial Fleet Insurance Contract',
      category: 'Policy Compliance',
      severity: 'Medium',
      description: isRTL 
        ? 'تم رصد فاتورة دفع قسط تأمين لشركة تأمين تجارية تقليدية بدلاً من استخدام بديل التكافل الإسلامي المتوافق، مخالفاً لسياسة الشركة لحوكمة المعاملات.'
        : 'The logistics department signed a conventional commercial insurance policy for fleet vehicles instead of an approved mutual Takaful policy, directly violating company corporate governance.',
      applicableStandard: 'AAOIFI Sharia Standard No. 26 (Islamic Insurance / Takaful)',
      confidence: 91.2,
      status: 'New',
      recommendation: isRTL
        ? 'إلغاء بوليصة التأمين التجاري واستبدالها بوثيقة تكافل إسلامي متوافقة معتمدة من هيئة الرقابة الشرعية.'
        : 'Review early termination options of the conventional policy and migrate fleet coverage to an accredited Islamic Takaful operator.',
      aiExplanation: {
        detected: 'AP invoice voucher matching commercial insurer payment schema.',
        why: 'Conventional insurance operates with premium-uncertainty (gharar) and interest elements, whereas Takaful operates on cooperative donation (Tabarru).',
        evidence: 'AP Invoice: AP-INS-2026-90 | Vendor: General Commercial Insurance Ltd',
        standard: 'AAOIFI Standard No. 26 forbids interest-based commercial insurance risk-transfer models when cooperative alternatives exist.',
        nextSteps: 'Instruct procurement officer to initiate transition; map compliant Islamic mutual alternative.'
      },
      evidenceId: 'EVI-103',
      timestamp: '2026-07-17 08:15:00'
    },
    {
      id: 'FND-004',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'دمج عقدين في معاملة تمويل إيجار واحدة' : 'Lack of Risk Separation in Lease-to-Own (Ijara)',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'تتضمن وثيقة تأجير أصل بند تمليك تلقائي فوري دون فصل عقد الإجارة عن عقد البيع، مما يدخل المعاملة في دائرة "بيعتين في بيعة" المنهي عنها.'
        : 'Lease contract structure features automated instant transfer of asset ownership embedded in the initial rental contract. AAOIFI requires a strict division between renting and transfer of deed.',
      applicableStandard: 'AAOIFI Sharia Standard No. 9 (Ijara & Lease-to-Own)',
      confidence: 94.5,
      status: 'New',
      recommendation: isRTL
        ? 'تعديل ملحق العقد لفصل الإجارة التشغيلية عن الوعد بالبيع التمليكي وصياغتها كعقدين مستقلين تفصل بينهما فترة زمنية وعملية استلام.'
        : 'Re-structure contract by drafting an initial Lease Agreement (Ijara) alongside a separate unilateral Promise to Sell (Wa’ad) instead of a unified single-action lease-to-own contract.',
      aiExplanation: {
        detected: 'Contract clause "Paragraph 4.2: Rental payments shall act as instant transfer of title deed at commencement without additional sale deed..."',
        why: 'Islamic jurisprudence prohibits binding two contradictory contracts (lease and sale) concurrently on the same subject asset without intermediate liability.',
        evidence: 'Contract: CTR-IJ-902 | Section: 4.2 Lease-to-Own Transfer',
        standard: 'AAOIFI Standard No. 9 Section 5/1 mandates that ownership transfer must be executed via a separate contract (gift or sale) after lease term completion.',
        nextSteps: 'Redraft contract utilizing ICAP Standard Ijara Template. Re-upload for automatic approval scan.'
      },
      evidenceId: 'EVI-104',
      timestamp: '2026-07-16 15:40:00'
    },
    {
      id: 'FND-005',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'إدراج بند غرامات تأخير لصالح إيرادات الشركة' : 'Profit-Generating Penalty Clause in Murabaha',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'ينص البند الثامن من اتفاقية مرابحة العملاء على توجيه غرامات التأخير مباشرة لحساب الأرباح والخسائر للشركة بدلاً من توجيهها للخيرات.'
        : 'Murabaha agreement clause explicitly states that any late fees collected will be added directly to corporate operational revenue, transforming delayed liabilities into profit.',
      applicableStandard: 'AAOIFI Sharia Standard No. 8 (Late Penalties Rule)',
      confidence: 97.9,
      status: 'New',
      recommendation: isRTL
        ? 'إعادة صياغة العقد لينص صراحة على أن غرامات التأخير تذهب للأعمال الخيرية ولا تدخل في حساب أرباح الشركة.'
        : 'Amend Section 8 to stipulate that any late penalties collected are distributed directly to charities approved by the Sharia Board under management supervision.',
      aiExplanation: {
        detected: 'Contract Clause: "Delayed fees shall be recognized as direct administrative profit of the Financier."',
        why: 'Charging penalty on credit sales that benefits the creditor represents riba. To serve as a deterrent, penalties must be donated to charity.',
        evidence: 'Contract: CTR-MB-402 | Page: 3 Clause: 8',
        standard: 'AAOIFI Standard No. 8 Section 5 indicates late payment penalty must be distributed to charity, not recognized as income.',
        nextSteps: 'Edit the master clause template; verify that subsequent Murabaha contracts match the charity divert clause.'
      },
      evidenceId: 'EVI-105',
      timestamp: '2026-07-16 11:22:10'
    },
    {
      id: 'FND-006',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'عدم ثبوت حيازة أصل المرابحة قبل إعادة بيعه' : 'Murabaha Inverted Sequencing - Reselling Before Title',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'أظهر تحليل توقيت الحركات قيام النظام بإنشاء فاتورة بيع المرابحة للعميل قبل صدور فاتورة شراء الأصل من المورد بـ ٣ ساعات.'
        : 'Time-series analysis detects that the Murabaha sale invoice to the customer was generated 3 hours prior to the actual asset purchase invoice from the supplier.',
      applicableStandard: 'AAOIFI Sharia Standard No. 8 (Murabaha Inverted Sequencing)',
      confidence: 95.8,
      status: 'New',
      recommendation: isRTL
        ? 'تحديث آلية العمل الإلكترونية بالـ ERP لمنع إصدار فواتير بيع المرابحة برمجياً إلا بعد تأكيد قيد المخازن باستلام الأصل وحيازته فعلياً.'
        : 'Enforce strict workflow blocks in ERP preventing the system from issuing customer invoices before supplier delivery notes are logged as physically owned.',
      aiExplanation: {
        detected: 'Out of sequence invoices: Customer Invoice O-INV-501 (10:15 AM) versus Supplier Invoice AP-SUPP-902 (01:15 PM) on same asset.',
        why: 'In Islamic finance, a trader cannot sell an asset they do not yet own or hold in constructive possession (Qabd).',
        evidence: 'Odoo Invoice Logs: O-INV-501 & AP-SUPP-902',
        standard: 'AAOIFI Standard No. 8 Section 3/2 mandates that the institution must acquire actual/constructive possession before selling to purchase-orderer.',
        nextSteps: 'Re-sequence ERP transaction steps; flag workflow template for strict manual release controls.'
      },
      evidenceId: 'EVI-106',
      timestamp: '2026-07-15 16:30:11'
    },
    {
      id: 'FND-007',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'شبهة استثمار فوائض السيولة في سندات تقليدية' : 'Surplus Liquid Fund Investment in Conventional Bonds',
      category: 'Financial Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'تم تحويل مبلغ ٢ مليون دولار لحساب سندات تجارية تقليدية بفائدة ثنائية ثابتة ومضمونة الأصل، مما يخرق ضوابط السيولة المتوافقة شرعياً.'
        : 'Treasury department transfer logs record a $2M deposit into Conventional Commercial Paper yielding a guaranteed 5.2% fixed interest rate.',
      applicableStandard: 'AAOIFI Sharia Standard No. 21 (Financial Paper Investments)',
      confidence: 99.1,
      status: 'Approved',
      recommendation: isRTL
        ? 'تسييل الاستثمار فوراً وتحويل الفوائد المستحقة للتطهير، ونقل السيولة لصكوك إسلامية أو ودائع مرابحة قصيرة الأجل.'
        : 'Liquidate conventional bonds immediately. Divert accrued interest to purification. Re-invest liquidity in Sharia-compliant sovereign Sukuk.',
      aiExplanation: {
        detected: 'Outbound wire TX-99402 to Bank of Conventional Yields under account category "Guaranteed Deposits".',
        why: 'Conventional bonds utilize interest contracts (Riba) and guarantee principal with fixed incremental profits.',
        evidence: 'Journal Entry: JE-77301 | Bank Ledger Wire: TX-99402',
        standard: 'AAOIFI Standard No. 21 prohibits owning or investing in conventional interest-based commercial paper or bonds.',
        nextSteps: 'Issue liquidation order. Forward compliant investment guidelines to Treasury.'
      },
      evidenceId: 'EVI-107',
      timestamp: '2026-07-15 11:10:00'
    },
    {
      id: 'FND-008',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'حساب الزكاة على أساس بنود غير متوافقة' : 'Incorrect Zakat Asset Classification',
      category: 'Financial Compliance',
      severity: 'High',
      description: isRTL 
        ? 'تضمن وعاء الزكاة السنوي خصم ديون طويلة الأجل غير زكوية، مما قلل وعاء احتساب الزكاة المستحقة على الشركة بأقل من القيمة الصحيحة.'
        : 'Financial ledger analysis indicates incorrect deduction of long-term non-trade liabilities from the corporate Zakat base calculation, lowering the required payment threshold.',
      applicableStandard: 'AAOIFI Sharia Standard No. 35 (Zakat Accounting Rules)',
      confidence: 92.4,
      status: 'New',
      recommendation: isRTL
        ? 'إعادة احتساب وعاء الزكاة وفق القوائم المالية المدققة وتوجيه الفروق المالية لصندوق الزكاة المعتمد.'
        : 'Re-run Zakat base computation using the net assets method, omitting non-allowable deductions. Record supplemental Zakat liability.',
      aiExplanation: {
        detected: 'Zakat report omitted asset block code 1204-EQUIPMENT-LEASE while calculating net liquid assets.',
        why: 'Under AAOIFI rules, leased assets of fixed nature are not subject to Zakat, but cash reserves derived from them are.',
        evidence: 'Zakat Ledger Page: 4 | Sub-Account: 3410-ZAK-LIAB',
        standard: 'AAOIFI Standard No. 35 detailing precise inclusions and exclusions for the Net Assets method.',
        nextSteps: 'Instruct accounting department to post correction voucher adjusting Zakat due.'
      },
      evidenceId: 'EVI-108',
      timestamp: '2026-07-14 14:22:00'
    },
    {
      id: 'FND-009',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'تعديل غرامة التأخير في عقد دون موافقة الهيئة' : 'Unapproved Penalty Clause Modification',
      category: 'Policy Compliance',
      severity: 'Medium',
      description: isRTL 
        ? 'تم تعديل نسبة غرامات التأخير في عقود تمويل السيارات بقسم الأفراد دون الرجوع لهيئة الرقابة الشرعية للمصادقة على الآلية المعدلة.'
        : 'Retail finance contracts modified the late payment penalty multiplier without sending the update to the Sharia Supervisory Board for approval.',
      applicableStandard: 'Internal Corporate Governance Policy GOV-SH-09',
      confidence: 89.5,
      status: 'Under Review',
      recommendation: isRTL
        ? 'إيقاف العمل بالصيغة المحدثة فوراً وإعادة العقود للصيغة المعتمدة شرعياً لحين الحصول على مصادقة خطية من الهيئة.'
        : 'Suspend the modified retail finance template. Revert to the approved wording until explicit Sharia Board resolution is granted.',
      aiExplanation: {
        detected: 'Contract hash mismatch on template model "CAR-FIN-V2" compared to master Sharia-Approved PDF hash.',
        why: 'All modifications to operational contracts affecting credit terms or penalty ratios require explicit Sharia Board clearance.',
        evidence: 'Contract template hash comparison: expected SHA-256 x88df but found x109d',
        standard: 'Governance Standard for Islamic Financial Institutions (GSIFI) No. 1.',
        nextSteps: 'Lock document edit access; assign board review ticket.'
      },
      evidenceId: 'EVI-109',
      timestamp: '2026-07-14 10:45:30'
    },
    {
      id: 'FND-010',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'إقرار ضمان رأس المال في عقد مشاركة' : 'Capital Guarantee Clause in Musharaka Joint Venture',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'تم رصد بند في اتفاقية المشاركة يضمن رد الشريك لكامل رأس مال الشركة للطرف الآخر في حال الخسارة، وهو مفسد لعقد المشاركة شرعاً.'
        : 'Musharaka partnership agreement contains a clause guaranteeing the return of one partner’s principal capital in full under any operational loss scenarios.',
      applicableStandard: 'AAOIFI Sharia Standard No. 12 (Sharika / Partnerships)',
      confidence: 97.2,
      status: 'New',
      recommendation: isRTL
        ? 'حذف بند ضمان الشريك لشركائه، والنص على توزيع الخسائر حسب نسبة المساهمة في رأس المال حصراً.'
        : 'Amend Section 5 of the Musharaka agreement to enforce that losses are distributed strictly in proportion to capital contributions.',
      aiExplanation: {
        detected: 'Clause 5.3: "Partner A warrants that Partner B shall receive no less than 100% of their invested capital back in the event of liquidation..."',
        why: 'Partnership structures must share in both profit (according to agreement) and loss (according to capital contribution). Capital guarantees transform partnership into a loan, rendering it Riba-based.',
        evidence: 'Agreement Contract: CTR-MS-881 | Section: 5.3 Capital Protection',
        standard: 'AAOIFI Standard No. 12 Section 4/1/3 forbids capital guarantees in joint venture models.',
        nextSteps: 'Redraft contract without capital guarantees; re-route to compliance director.'
      },
      evidenceId: 'EVI-110',
      timestamp: '2026-07-13 16:55:00'
    },
    {
      id: 'FND-011',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'تجاوز حدود استحقاق ائتماني دون مراجعة المخاطر' : 'Credit Limit Override Without Committee Review',
      category: 'Risk Management',
      severity: 'High',
      description: isRTL 
        ? 'تم رفع حد الائتمان لعميل بمقدار ٣٠٠ ألف دولار بشكل فوري بقرار فردي دون تقديم دراسة كفاية المخاطر المطلوبة ائتمانياً.'
        : 'A customer credit limit override was processed manually by a sales executive, raising exposure by $300,000 without the mandatory Credit Risk Committee audit.',
      applicableStandard: 'Credit Risk Policy Section RISK-CR-12',
      confidence: 94.0,
      status: 'New',
      recommendation: isRTL
        ? 'تجميد المعاملات الآجلة للعميل وتوجيه طلب رفع الحد للجنة المخاطر لإعداد دراسة ملاءة ائتمانية متكاملة.'
        : 'Place credit hold on the customer account. Route the credit limit extension request to the Credit Committee for retrospective evaluation.',
      aiExplanation: {
        detected: 'ERP log change "credit_limit" from 200000.00 to 500000.00 on partner_id 8812 without attached risk memo.',
        why: 'Exceeding risk limit thresholds without formal analysis introduces critical insolvency risk to the corporate book.',
        evidence: 'ERP Audit Trail: CUST-LIMIT-LOG-9412',
        standard: 'Basel III Credit Risk Management framework & internal Policy compliance guidelines.',
        nextSteps: 'Flag sales executive; prompt system for mandatory approval upload before checkout.'
      },
      evidenceId: 'EVI-111',
      timestamp: '2026-07-13 13:12:00'
    },
    {
      id: 'FND-012',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'غياب بوليصة الشحن الأصلية في مستندات الاستيراد' : 'Missing Bill of Lading in Murabaha Import Record',
      category: 'SOP Compliance',
      severity: 'Medium',
      description: isRTL 
        ? 'خلت ملفات معاملة تمويل استيراد حديد من إرفاق بوليصة الشحن الأصلية المؤكدة لحيازة المورد للأصل قبل نقله للعميل.'
        : 'Murabaha import transaction file does not contain a valid original Bill of Lading. This is required to prove the supplier had possession prior to corporate sale.',
      applicableStandard: 'SOP-MUR-LOG-02 (Murabaha Logistics Auditing)',
      confidence: 88.7,
      status: 'New',
      recommendation: isRTL
        ? 'مطالبة منسق العمليات بتوفير بوليصة الشحن الأصلية الموثقة وتاريخ استلام المورد للبضاعة وإرفاقها بملف المعاملة.'
        : 'Request the transaction coordinator to upload the verified original Bill of Lading with clear date stamps matching supplier asset handover.',
      aiExplanation: {
        detected: 'Missing mandatory attachment field "bill_of_lading_pdf" in transaction folder TR-MUR-990.',
        why: 'Possession must be established via independent documentary proof (shipping bill) to validate compliant trade sequencing.',
        evidence: 'Transaction Folder: TR-MUR-990 | Missing Document: Bill of Lading',
        standard: 'AAOIFI Standard No. 8 & corporate Murabaha standard operation procedures.',
        nextSteps: 'Email warning to logistics lead; add blocking task in transaction queue.'
      },
      evidenceId: 'EVI-112',
      timestamp: '2026-07-12 11:30:00'
    },
    {
      id: 'FND-013',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'تسجيل إيرادات تطهير كأرباح تشغيلية' : 'Purification Revenue Incorrectly Classified as Operating Profit',
      category: 'Financial Compliance',
      severity: 'High',
      description: isRTL 
        ? 'تم تسجيل أرباح غير متوافقة شرعياً ناتجة عن أسهم مختلطة بقيمة ١٢٥ ألف دولار في حساب الأرباح التشغيلية بدلاً من عزلها للتطهير.'
        : 'Dividend purification revenue worth $125,000 from a mixed investment was credited to operational profit instead of being diverted to the Charity Purification liability account.',
      applicableStandard: 'AAOIFI Sharia Standard No. 21 (Mixed Company purification rules)',
      confidence: 96.5,
      status: 'Under Review',
      recommendation: isRTL
        ? 'إجراء قيد محاسبي عكسي لإخراج الأرباح غير المتوافقة وعزلها في حساب التطهير الشرعي الخيري.'
        : 'Create adjustment journal entry to debit operational revenues and credit the designated charity purification ledger.',
      aiExplanation: {
        detected: 'Credit entry on 4102-OPERATING-REV with reference label "Dividend mixed-company Al-Falah investment".',
        why: 'Dividends from companies with partial non-compliant income must be purified and distributed to charity under AAOIFI.',
        evidence: 'Journal Entry: JE-88910 | Subledger: Investments',
        standard: 'AAOIFI Standard No. 21 Section 5/4 outlining mixed share purification equations.',
        nextSteps: 'Re-classify $125k to charity payout ledger. Restrict account code access.'
      },
      evidenceId: 'EVI-113',
      timestamp: '2026-07-12 09:15:00'
    },
    {
      id: 'FND-014',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'إيداع نقدي غير مفسر في حساب المعاملات البنكية' : 'Unexplained Large Cash Deposit',
      category: 'Risk Management',
      severity: 'High',
      description: isRTL 
        ? 'تم رصد إيداع نقدي بقيمة ٤٥٠ ألف دولار في حساب الشركة الجاري دون إرفاق فواتير بيع أو مستندات تسليم تبرر مصدر الأموال.'
        : 'Treasury logs show an un-vouched $450,000 cash deposit into the corporate operating account without accompanying invoices or customer contracts.',
      applicableStandard: 'Anti-Money Laundering (AML) Compliance Policy AML-01',
      confidence: 93.1,
      status: 'New',
      recommendation: isRTL
        ? 'تجميد المبلغ وتكليف وحدة تدقيق غسيل الأموال بالتواصل مع البنك لإيداع مستندات المصدر القانونية.'
        : 'Freeze the associated balance temporarily. Request the sales team to submit validated customer sales contracts and invoices within 48 hours.',
      aiExplanation: {
        detected: 'Cash receipt CR-9941 with zero linked source sales invoices or partner IDs.',
        why: 'Large unvouched cash movements pose critical AML and Sharia source-of-fund legitimacy risks.',
        evidence: 'Bank Statement Receipt: CR-9941 | Amount: $450,000',
        standard: 'FATF Recommendations on AML/KYC & corporate compliance policy guidelines.',
        nextSteps: 'Escalate to AML Chief Officer; trigger KYC verification review.'
      },
      evidenceId: 'EVI-114',
      timestamp: '2026-07-11 15:20:00'
    },
    {
      id: 'FND-015',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'استخدام عقود عينة بدلاً من عقود مخصصة معتمدة' : 'Use of Unapproved Boilerplate Contracts',
      category: 'Policy Compliance',
      severity: 'Medium',
      description: isRTL 
        ? 'استعمل قطاع الاستثمار نموذج عقد وكالة عام مستمد من الإنترنت لم يتم تدقيقه شرعياً أو اعتماده من مستشاري المنصة.'
        : 'Investment division utilized a boilerplate internet-sourced Wakala template to execute a partner deal instead of the Sharia-approved legal template.',
      applicableStandard: 'Legal Policy Section LEG-TMP-01',
      confidence: 85.0,
      status: 'New',
      recommendation: isRTL
        ? 'تحديث العقد بالملحق المعتمد وتوقيعه من الأطراف، وإغلاق صلاحية استخدام نماذج العقود غير المعتمدة.'
        : 'Re-execute deal using the compliant Wakala Master Template. Inform the representative of standardized template mandates.',
      aiExplanation: {
        detected: 'Contract metadata metadata shows author "Generic_Word_Doc" with multiple conventional indemnity terms.',
        why: 'Unvetted agreements may contain hidden interest penalties, inappropriate warranties, or risk structures violating Islamic finance principles.',
        evidence: 'Contract: CTR-WK-202 | Author: FreeLegalDocs.com',
        standard: 'AAOIFI Standard No. 23 (Wakala/Agency) governance constraints.',
        nextSteps: 'Replace contract with ICAP certified Wakala structure; log retroactive signoff.'
      },
      evidenceId: 'EVI-115',
      timestamp: '2026-07-11 11:15:00'
    },
    {
      id: 'FND-016',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'صرف مخصصات مالية لمشروع دون تدقيق المنجزات' : 'Disbursement Prior to Milestones - SOP Violation',
      category: 'SOP Compliance',
      severity: 'Medium',
      description: isRTL 
        ? 'تم صرف الدفعة الثانية من تمويل استصناع لمقاول بقيمة ٢٥٠ ألف دولار دون إرفاق تقرير المسح الفني المعتمد المؤكد لنسبة الإنجاز.'
        : 'The system processed a second Istisna progress payment ($250k) to a contractor without the required physical site audit report or civil engineer completion logs.',
      applicableStandard: 'SOP-ISTISNA-PAY-03',
      confidence: 89.2,
      status: 'New',
      recommendation: isRTL
        ? 'إيفاد مساح فني فوراً لتأكيد نسبة إنجاز العمل ومطابقتها للدفعات المصروفة وتوثيق التقرير بالملف المحاسبي.'
        : 'Deploy physical inspection auditor immediately to verify current progress percentage. Suspend subsequent Istisna milestones.',
      aiExplanation: {
        detected: 'Wire payment voucher PAY-IST-440 dated 2026-07-09 without matching engineer report attachment.',
        why: 'Istisna contract disbursements must map to verifiable physical work progress to prevent paying for non-existent assets.',
        evidence: 'AP Payment Voucher: PAY-IST-440 | Project: Al-Noor Complex Phase 2',
        standard: 'AAOIFI Sharia Standard No. 11 (Istisna & Parallel Istisna) contract specifications.',
        nextSteps: 'Trigger immediate operational warning for Project manager; pause subsequent wires.'
      },
      evidenceId: 'EVI-116',
      timestamp: '2026-07-10 14:15:00'
    },
    {
      id: 'FND-017',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'إبرام عقد وكالة باستثمار متضمن اشتراط ضمان الربح' : 'Guaranteed Profit Clause in Wakala Agreement',
      category: 'Sharia Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'تتضمن اتفاقية استثمار بنداً يضمن للموكل الحصول على نسبة ربح ثابتة ومؤكدة قدرها ٧٪ سنوياً، مما يحول المعاملة لقرض بفائدة.'
        : 'Wakala investment agreement guarantees the principal investor a fixed 7% annual yield. Under Islamic standards, capital and profit rates cannot be guaranteed by the agent.',
      applicableStandard: 'AAOIFI Sharia Standard No. 23 (Wakala/Agency)',
      confidence: 96.9,
      status: 'New',
      recommendation: isRTL
        ? 'استبدال بند ضمان الربح ببند نسبة ربح متوقعة (Expected Profit Rate)، مع النص على تقاسم الأرباح حسب الأداء الفعلي.'
        : 'Replace guaranteed yield terminology with "Expected/Target Profit Rate", outlining actual variable profit distribution mechanism.',
      aiExplanation: {
        detected: 'Wakala Section 6.1: "The Agent guarantees a minimum fixed return of 7% per annum to the Principal..."',
        why: 'An investment agent (Wakeel) is a trustee and cannot guarantee performance, principal, or fixed profits unless negligence is proven.',
        evidence: 'Investment Contract: CTR-WK-304 | Page: 4 Section: 6.1',
        standard: 'AAOIFI Standard No. 23 Section 3/1/5 forbids agents from guaranteeing capital or profit rates.',
        nextSteps: 'Redraft contract; obtain certified digital signature on revised compliant expected-yield model.'
      },
      evidenceId: 'EVI-117',
      timestamp: '2026-07-10 10:45:00'
    },
    {
      id: 'FND-018',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'استخدام مستودعات تخزين غير مؤمنة ائتمانياً' : 'Unsecured Collateral Warehouse - Risk Violation',
      category: 'Risk Management',
      severity: 'High',
      description: isRTL 
        ? 'تم تخزين بضائع تمويل مرابحة قيمتها ١.٢ مليون دولار في مستودع غير خاضع للرقابة الائتمانية أو التأمين التكافلي الشامل.'
        : 'Cargo worth $1.2M serving as underlying collateral for corporate financing was stored in an unmonitored third-party warehouse with poor security ratings.',
      applicableStandard: 'Operational Risk Standard OP-SEC-99',
      confidence: 92.1,
      status: 'New',
      recommendation: isRTL
        ? 'نقل بضائع التمويل فوراً لمخازن معتمدة ومؤمنة تكافلياً لمنع تلف الأصل وتجنب بطلان عقود التمويل.'
        : 'Relocate assets to a vetted logistics facility. Ensure immediate Takaful coverage is deployed protecting underlying collateral values.',
      aiExplanation: {
        detected: 'Warehouse registration ID "WH-GEN-90" has expired safety certification code.',
        why: 'Inability to safeguard underlying real collateral exposes the corporate book to write-off losses.',
        evidence: 'ERP Inventory Ledger: INV-RAW-904 | Warehouse: WH-GEN-90',
        standard: 'COSO Enterprise Risk Management standards & internal collateral safety policies.',
        nextSteps: 'Post immediate warehouse transfer order. Force field check on safety rating.'
      },
      evidenceId: 'EVI-118',
      timestamp: '2026-07-09 16:30:00'
    },
    {
      id: 'FND-019',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'تعديل سياسة سداد العملاء المتعثرين دون توثيق شرعي' : 'Default Restructuring Without Sharia-Compliant Amortization',
      category: 'Policy Compliance',
      severity: 'Critical',
      description: isRTL 
        ? 'قام قطاع التحصيل بإعادة جدولة أقساط عميل متعثر متضمنة زيادة إضافية في الفائدة مقابل تمديد الفترة، وهو من صميم ربا الجاهلية.'
        : 'Collection department restructured an outstanding default debt by adding an incremental surcharge for extending the maturity date, mimicking classical Riba al-Jahiliyyah.',
      applicableStandard: 'AAOIFI Sharia Standard No. 8 (Receivables Default Restructuring)',
      confidence: 98.2,
      status: 'Approved',
      recommendation: isRTL
        ? 'إلغاء المعاملة المعدلة، وتطبيق جدولة أقساط دون أي زيادة ربوية، أو منح العميل النظرة والميسرة بجدولة تبرع.'
        : 'Cancel the restructured schedule immediately. Implement a compliant rescheduling without charging additional fees or interest.',
      aiExplanation: {
        detected: 'New payment plan added contract fee labeled "Restructuring Delay Charge" amounting to $1,250 on existing customer debit.',
        why: 'Adding any monetary mark-up on an outstanding debt in exchange for a time extension is the definitive definition of Riba.',
        evidence: 'ERP Customer Balance Change: O-CUST-8812 | Restructure Plan: RSP-901',
        standard: 'AAOIFI Standard No. 8 Section 5/3 explicitly prohibits compounding or adding fees to reschedule delinquent debts.',
        nextSteps: 'Wipe out the $1,250 fee from customer account ledger. Remind collections officer of policy.'
      },
      evidenceId: 'EVI-119',
      timestamp: '2026-07-09 11:22:00'
    },
    {
      id: 'FND-020',
      organizationId: 'org-icap-demo',
      title: isRTL ? 'دمج أصل مرهون مسبقاً في تمويل صكوك مالي جديد' : 'Double-Pledging Collateral in Sukuk Issuance',
      category: 'Risk Management',
      severity: 'High',
      description: isRTL 
        ? 'تم رصد إدخال عقار مرهون مسبقاً كضمان لعملية صكوك تمويلية جديدة دون فك الرهن الأول، وهو خطر ائتماني وقانوني جسيم.'
        : 'Property Asset AST-904, currently pledged under mortgage, was listed as underlying lease-back collateral for a new Sukuk tranche, violating multi-collateral guidelines.',
      applicableStandard: 'AAOIFI Sharia Standard No. 39 (Sukuk Collateral Management)',
      confidence: 94.8,
      status: 'New',
      recommendation: isRTL
        ? 'استبعاد الأصل المرهون فوراً واستبداله بأصل غير مثقل بأي حقوق للغير لحماية حملة الصكوك.'
        : 'Replace AST-904 in the Sukuk pool with an unencumbered corporate property of equal valuation. Log replacement deed.',
      aiExplanation: {
        detected: 'Asset ID AST-904 matched active mortgage registry in system database while checking Sukuk pool.',
        why: 'Double-pledging collateral invalidates security trust agreements and exposes Sukuk investors to asset dispute litigation.',
        evidence: 'Sukuk Asset Pool List: SUK-PR-2026 | Asset: AST-904',
        standard: 'AAOIFI Standard No. 39 Section 6/2 regarding unencumbered assets serving underlying Sukuk issues.',
        nextSteps: 'Initiate asset replacement script in the Sukuk management interface.'
      },
      evidenceId: 'EVI-120',
      timestamp: '2026-07-08 15:40:00'
    }
  ]);

  // 13. DB Structure: Evidence Items (Requirement 13 & 9)
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([
    { id: 'EVI-101', findingId: 'FND-001', sourceType: 'Journal Entry', sourceId: 'JE-55421', description: 'Odoo Credit entry recording penalty rate of 2.5% applied to outstanding receivables invoice.', date: '2026-07-17' },
    { id: 'EVI-102', findingId: 'FND-002', sourceType: 'Purchase Order', sourceId: 'PO-8891', description: 'Odoo Purchase order totaling $520,000 signed by single procurement manager.', date: '2026-07-17' },
    { id: 'EVI-103', findingId: 'FND-003', sourceType: 'Invoice', sourceId: 'AP-INS-2026-90', description: 'AP voucher paid to General Commercial Insurance Ltd for fleet coverage.', date: '2026-07-17' },
    { id: 'EVI-104', findingId: 'FND-004', sourceType: 'Contract', sourceId: 'CTR-IJ-902', description: 'Ijara Agreement draft featuring direct transfer of asset on rental close without separate contract.', date: '2026-07-16' },
    { id: 'EVI-105', findingId: 'FND-005', sourceType: 'Contract', sourceId: 'CTR-MB-402', description: 'Murabaha contract detailing penalty payout structure directly into corporate bank cash assets.', date: '2026-07-16' },
    { id: 'EVI-106', findingId: 'FND-006', sourceType: 'ERP Record', sourceId: 'O-INV-501', description: 'Timestamp comparison between Supplier Purchase Invoice and Customer Sale Invoice.', date: '2026-07-15' },
    { id: 'EVI-107', findingId: 'FND-007', sourceType: 'Journal Entry', sourceId: 'JE-77301', description: 'Outbound wire matching fixed deposit investment account wire transaction logs.', date: '2026-07-15' },
    { id: 'EVI-108', findingId: 'FND-008', sourceType: 'Zakat Ledger', sourceId: '3410-ZAK-LIAB', description: 'Zakat liability calculation sheet omitting long term leased commercial properties.', date: '2026-07-14' },
    { id: 'EVI-109', findingId: 'FND-009', sourceType: 'Contract', sourceId: 'CAR-FIN-V2', description: 'Retail vehicle financing clause terms indicating compound penalty on delinquent accounts.', date: '2026-07-14' },
    { id: 'EVI-110', findingId: 'FND-010', sourceType: 'Contract', sourceId: 'CTR-MS-881', description: 'Musharaka venture contract Clause 5.3 outlining partner principal restitution guarantees.', date: '2026-07-13' }
  ]);

  // 13. DB Structure: Review Tasks (Requirement 13 & 11)
  const [reviewTasks, setReviewTasks] = useState<ReviewTask[]>([
    {
      id: 'TSK-101',
      findingId: 'FND-001',
      assignedUser: 'Ahmed Al-Mansoor (Compliance Officer)',
      status: 'Pending Decision',
      comments: [
        { id: 'c1', user: 'AI Assistant', comment: 'Critical Late interest penalty loop identified in Odoo JE-55421. Needs purification.', timestamp: '2026-07-17 10:12:00' }
      ]
    },
    {
      id: 'TSK-102',
      findingId: 'FND-002',
      assignedUser: 'Sarah Watson (Auditor)',
      status: 'Pending Decision',
      comments: [
        { id: 'c2', user: 'AI Assistant', comment: 'Audit trail shows missing VP purchase approval for PO-8891.', timestamp: '2026-07-17 09:30:15' }
      ]
    },
    {
      id: 'TSK-103',
      findingId: 'FND-003',
      assignedUser: 'Sheikh Khalid (Sharia Reviewer)',
      status: 'Pending Decision',
      comments: [
        { id: 'c3', user: 'AI Assistant', comment: 'Conventional Fleet insurance policy lacks Takaful cooperative structuring.', timestamp: '2026-07-17 08:15:00' }
      ]
    }
  ]);

  // 13. DB Structure: Compliance Scores (Requirement 13 & 6)
  const [complianceScores, setComplianceScores] = useState<ComplianceScore[]>([
    { id: 'sc-1', organizationId: 'org-icap-demo', category: 'Sharia Compliance', score: 98, date: '2026-07-17' },
    { id: 'sc-2', organizationId: 'org-icap-demo', category: 'Financial Compliance', score: 94, date: '2026-07-17' },
    { id: 'sc-3', organizationId: 'org-icap-demo', category: 'SOP Compliance', score: 91, date: '2026-07-17' },
    { id: 'sc-4', organizationId: 'org-icap-demo', category: 'Policy Compliance', score: 96, date: '2026-07-17' },
    { id: 'sc-5', organizationId: 'org-icap-demo', category: 'Risk Management', score: 93, date: '2026-07-17' }
  ]);

  // ====================================================
  // 5. ANALYSIS CENTER WORKFLOW STATES
  // ====================================================
  const [newAnalysisName, setNewAnalysisName] = useState('');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('Sharia Compliance Review');
  const [selectedDataSource, setSelectedDataSource] = useState('ERP Data');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['agent-sharia', 'agent-accounting']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);

  // ====================================================
  // INTERACTIVE WORKFLOW HANDLERS
  // ====================================================

  // Start Simulation Workflow
  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnalysisName) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisLogs([]);

    const steps = [
      { text: isRTL ? 'تهيأة معلمات الفحص والامتثال...' : 'Initializing compliance audit parameters...', pct: 10 },
      { text: isRTL ? 'سحب ومعالجة المستندات والحركات من خادم الـ ERP...' : 'Extracting ledger rows & documents from ERP gateway...', pct: 30 },
      { text: isRTL ? 'استدعاء وتفعيل وكلاء الذكاء الاصطناعي المختارين...' : 'Activating designated multi-agent AI framework...', pct: 50 },
      { text: isRTL ? 'مراجعة المعايير المرجعية (أيوفي ولائحة السياسات الداخلية)...' : 'Querying knowledge center (AAOIFI standards & local policies)...', pct: 70 },
      { text: isRTL ? 'تدقيق الحركات الحية وحساب نسب المخاطر الكلية والامتثال...' : 'Executing time-series checks and scoring risk vectors...', pct: 85 },
      { text: isRTL ? 'توليد التقارير وتصدير النتائج لطابور المراجعة البشرية...' : 'Compiling explainable reports & pushing to human review queue...', pct: 100 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAnalysisProgress(step.pct);
        setAnalysisLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);

        if (step.pct === 100) {
          setIsAnalyzing(false);
          
          // Add to jobs database
          const newJob: AnalysisJob = {
            id: `job-${Date.now()}`,
            organizationId: 'org-icap-demo',
            name: newAnalysisName,
            type: selectedAnalysisType,
            dataSource: selectedDataSource,
            status: 'Completed',
            startedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
            completedAt: new Date().toISOString().replace('T', ' ').split('.')[0],
            score: Math.floor(Math.random() * 10 + 90),
            agentIds: selectedAgents
          };
          setAnalysisJobs(prev => [newJob, ...prev]);

          // Trigger activity log
          onTriggerActivityLog('AI_ANALYSIS_JOB', `Triggered AI analysis job "${newAnalysisName}" via Multi-Agent framework.`);
          alert(isRTL ? 'اكتمل التحليل المحاكي بنجاح! تم رصد فحص وتحديث قائمة النتائج.' : 'AI Compliance Analysis completed successfully! Results updated.');
          setNewAnalysisName('');
        }
      }, (idx + 1) * 800);
    });
  };

  // Human Queue Handlers
  const handleReviewAction = (findingId: string, action: 'Approved' | 'Rejected' | 'Resolved' | 'Under Review', commentText: string) => {
    // 1. Update finding status
    setFindings(prev => prev.map(f => {
      if (f.id === findingId) {
        return { ...f, status: action };
      }
      return f;
    }));

    // 2. Update review task
    setReviewTasks(prev => prev.map(t => {
      if (t.findingId === findingId) {
        const taskStatus: ReviewTask['status'] = action === 'Under Review' ? 'Pending Decision' : action;
        return {
          ...t,
          status: taskStatus,
          comments: [
            ...t.comments,
            {
              id: `c-${Date.now()}`,
              user: 'Sheikh Khalid (Lead Reviewer)',
              comment: commentText || `Finding marked as ${action} following human review.`,
              timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
            }
          ]
        };
      }
      return t;
    }));

    onTriggerActivityLog('AI_FINDING_REVIEW', `Human reviewer marked ${findingId} as ${action}.`);
    alert(isRTL ? `تم تحديث السجل رقم ${findingId} وحفظ الإجراء بنجاح.` : `Finding ${findingId} successfully updated to status: ${action}.`);
  };

  // Active Finding for Detail Slider / Explain Panel
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(findings[0]);
  const [reviewCommentInput, setReviewCommentInput] = useState('');

  // Filtering for findings page
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Sharia Compliance' | 'Financial Compliance' | 'SOP Compliance' | 'Policy Compliance' | 'Risk Management'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Under Review' | 'Approved' | 'Rejected' | 'Resolved'>('All');

  const filteredFindings = findings.filter(f => {
    const sevMatch = severityFilter === 'All' || f.severity === severityFilter;
    const catMatch = categoryFilter === 'All' || f.category === categoryFilter;
    const statMatch = statusFilter === 'All' || f.status === statusFilter;
    return sevMatch && catMatch && statMatch;
  });

  return (
    <div className="space-y-6" id="ai-compliance-module" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Module Title Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden shadow">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
          <Cpu className="w-96 h-96 -mr-12 -mt-12 text-emerald-400" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              {isRTL ? 'منظومة الاستقصاء الشرعي الذكي' : 'ACCREDITED SHARIA INTELLIGENCE'}
            </span>
            <span className="text-xs text-yellow-400 font-mono">
              ● AAOIFI ACCREDITED INTERPRETER v2.4
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold">
            {isRTL ? 'محرك الامتثال والتدقيق بالذكاء الاصطناعي (ICAP AI)' : 'ICAP AI Compliance & Audit Engine'}
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {isRTL 
              ? 'المنظومة الاستقصائية الأكثر ذكاءً لتحليل العقود، وقيود اليومية، والإجراءات التشغيلية. تشغيل وكلاء مخصصين لفحص المخاطر والالتزام الشرعي مع مطابقتها التلقائية لمعايير هيئة المحاسبة والمراجعة الإسلامية.' 
              : 'Our state-of-the-art Sharia & Regulatory multi-agent network designed to analyze corporate accounts, purchase sequences, lease deeds, and internal compliance controls with robust explainability models.'}
          </p>
        </div>

        {/* Local Engine Tab Nav */}
        <div className="flex flex-wrap gap-1 bg-slate-800/60 p-1 rounded-lg mt-6 w-fit text-xs border border-slate-700">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة القيادة الذكية' : 'AI Dashboard', icon: BarChart2 },
            { id: 'analysis', name: isRTL ? 'مركز التحليل والتشغيل' : 'Analysis Center', icon: Workflow },
            { id: 'agents', name: isRTL ? 'وكلاء الذكاء الاصطناعي' : 'Compliance Agents', icon: Users },
            { id: 'findings', name: isRTL ? 'إدارة الملاحظات والنتائج' : 'Findings Board', icon: Bookmark },
            { id: 'risk', name: isRTL ? 'مصفوفة المخاطر الكلية' : 'Risk Matrix', icon: AlertTriangle },
            { id: 'evidence', name: isRTL ? 'مستكشف الأدلة الموثقة' : 'Evidence Explorer', icon: Database },
            { id: 'queue', name: isRTL ? 'طابور المراجعة البشرية' : 'Human Review Queue', icon: Scale },
            { id: 'settings', name: isRTL ? 'إعدادات الذكاء الاصطناعي' : 'AI Settings', icon: Sliders },
            { id: 'db_schema', name: isRTL ? 'هيكل قواعد البيانات (DB Schema)' : 'DB Schema Explorer', icon: Terminal }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (tab.id === 'findings') {
                  setSelectedFinding(findings[0]);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                activeSubTab === tab.id 
                  ? 'bg-emerald-500 text-slate-950 shadow' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================
          1. AI DASHBOARD
          ==================================================== */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Executive Analytics Bento Grid (Requirement 2 & 6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            
            {/* Compliance Score Gauge */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {isRTL ? 'معدل الامتثال العام' : 'Overall Compliance Score'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-emerald-600 font-mono">95%</span>
                <span className="text-xs text-slate-400">/ 100%</span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[95%]"></div>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-700 font-bold">
                  <span>{isRTL ? 'مستوى: ممتاز' : 'Level: Excellent'}</span>
                  <span>+0.8% MoM</span>
                </div>
              </div>
            </div>

            {/* AI Analyses Completed */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {isRTL ? 'عمليات فحص الذكاء الاصطناعي' : 'AI Analyses Completed'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 font-mono">240</span>
                <span className="text-xs text-slate-400">{isRTL ? 'جولة كاملة' : 'full audits'}</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isRTL ? 'تغطية يومية مستمرة لمصادر البيانات' : 'Continuous ERP & file ingestion sweeps'}
              </span>
            </div>

            {/* Findings Generated */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {isRTL ? 'إجمالي الملاحظات والمسائل' : 'Findings Generated'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-yellow-600 font-mono">36</span>
                <span className="text-xs text-slate-400">{isRTL ? 'ملاحظات شرعية/مالية' : 'flags raised'}</span>
              </div>
              <span className="text-[10px] text-amber-700 font-medium">
                {isRTL ? 'مصححة: ٢٢ | قيد النظر: ١٤' : 'Resolved: 22 | Active queue: 14'}
              </span>
            </div>

            {/* Pending Human Reviews */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {isRTL ? 'مراجعات يدوية معلقة' : 'Pending Human Reviews'}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-red-600 font-mono">8</span>
                <span className="text-xs text-slate-400">{isRTL ? 'مهام بالانتظار' : 'tasks in queue'}</span>
              </div>
              <span className="text-[10px] text-red-600 font-bold animate-pulse">
                ⚠️ {isRTL ? 'تتطلب قراراً شرعياً فورياً' : 'Requires immediate board ruling'}
              </span>
            </div>

            {/* Overall Risk Level */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                {isRTL ? 'مستوى المخاطر الكلي' : 'Overall Risk Level'}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Shield className="w-6 h-6 shrink-0" />
                <span className="text-xl font-bold uppercase">{isRTL ? 'منخفض' : 'Low Risk'}</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {isRTL ? 'ضمن الحدود الآمنة للسياسة العامة' : 'Under regulatory compliance limits'}
              </span>
            </div>

          </div>

          {/* Visual Responsive Custom Charts (Requirement 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Compliance Score Trend (Custom visual SVG render) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{isRTL ? 'منحنى أداء الامتثال الشرعي (الربع الأخير)' : 'Compliance Score Trend (Last 6 Months)'}</span>
                </h3>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">Excellent (+2.1%)</span>
              </div>
              
              <div className="h-48 flex items-end justify-between pt-6 px-4 relative">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 pb-6">
                  <div className="border-b w-full"></div>
                  <div className="border-b w-full"></div>
                  <div className="border-b w-full"></div>
                  <div className="border-b w-full"></div>
                </div>

                {/* SVG Line / Bar Representation of Trend */}
                {[
                  { m: isRTL ? 'يناير' : 'Jan', val: 92 },
                  { m: isRTL ? 'فبراير' : 'Feb', val: 91 },
                  { m: isRTL ? 'مارس' : 'Mar', val: 93 },
                  { m: isRTL ? 'أبريل' : 'Apr', val: 95 },
                  { m: isRTL ? 'مايو' : 'May', val: 94 },
                  { m: isRTL ? 'يونيو' : 'Jun', val: 95 }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 z-10 w-full group">
                    <div className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition duration-150">
                      {item.val}%
                    </div>
                    {/* Gauge bar */}
                    <div 
                      style={{ height: `${item.val * 1.2}px` }} 
                      className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t group-hover:brightness-110 transition duration-300 shadow-sm relative"
                    >
                      {/* Interactive hover tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                        Score: {item.val}%
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{item.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Category Compliance Score Breakdown (Requirement 6) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{isRTL ? 'توزيع درجات الامتثال حسب الأبعاد' : 'Compliance Scoring Engine (Category Split)'}</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs pt-1">
                {[
                  { cat: isRTL ? 'الامتثال الشرعي لمعايير AAOIFI' : 'Sharia Compliance (AAOIFI)', score: 98, color: 'bg-emerald-500' },
                  { cat: isRTL ? 'حوكمة السياسات الداخلية واللوائح' : 'Policy Compliance', score: 96, color: 'bg-teal-500' },
                  { cat: isRTL ? 'سلامة ومطابقة الحركات المالية' : 'Financial Compliance', score: 94, color: 'bg-blue-500' },
                  { cat: isRTL ? 'إجراءات ومناهج المخاطر الكلية' : 'Risk Management Integrity', score: 93, color: 'bg-purple-500' },
                  { cat: isRTL ? 'توافق سلاسل الموافقات وخطوات SOP' : 'SOP Process Validation', score: 91, color: 'bg-yellow-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{item.cat}</span>
                      <span className="font-mono">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: `${item.score}%` }}></div>
                    </div>
                    {/* Score Levels Evaluator (Requirement 6) */}
                    <div className="text-[9px] text-slate-400 text-right">
                      {item.score >= 90 ? (
                        <span className="text-emerald-600 font-bold">{isRTL ? 'مستوى ممتاز' : 'Level: Excellent'}</span>
                      ) : (
                        <span className="text-teal-600 font-bold">{isRTL ? 'مستوى جيد جداً' : 'Level: Good'}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Risk Heat Map and Confidence Distribution Grid (Requirement 2 & 10) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Risk Heatmap (Requirement 2) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 col-span-2">
              <div className="border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  {isRTL ? 'مصفوفة التوزيع الحراري للمخاطر الشرعية' : 'Sharia Compliance Risk Heat Map'}
                </h3>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                {/* Matrix layout */}
                {/* Header columns */}
                <div className="text-slate-400 py-1 font-mono">Impact</div>
                <div className="text-slate-400 py-1">Low</div>
                <div className="text-slate-400 py-1">Medium</div>
                <div className="text-slate-400 py-1">High</div>
                <div className="text-slate-400 py-1">Critical</div>

                {/* Row 1: High */}
                <div className="text-slate-400 py-3 font-mono">High Prob</div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded">SOP Override (FND-016)</div>
                <div className="bg-orange-100 text-orange-800 p-3 rounded">Incorrect Zakat (FND-008)</div>
                <div className="bg-red-100 text-red-800 p-3 rounded font-bold">Murabaha Sequencing (FND-006)</div>
                <div className="bg-red-200 text-red-950 p-3 rounded font-bold border-2 border-red-500">Late Penalty Riba (FND-001)</div>

                {/* Row 2: Med */}
                <div className="text-slate-400 py-3 font-mono">Med Prob</div>
                <div className="bg-green-100 text-green-800 p-3 rounded">Fleet Insurance (FND-003)</div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded">Modified Clauses (FND-009)</div>
                <div className="bg-orange-100 text-orange-800 p-3 rounded">Musharaka capital guar. (FND-010)</div>
                <div className="bg-red-100 text-red-800 p-3 rounded">Wakala Guarantee (FND-017)</div>

                {/* Row 3: Low */}
                <div className="text-slate-400 py-3 font-mono">Low Prob</div>
                <div className="bg-green-100 text-green-800 p-3 rounded">BoL shipping (FND-012)</div>
                <div className="bg-green-100 text-green-800 p-3 rounded">General Document (FND-015)</div>
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded">Mixed share div. (FND-013)</div>
                <div className="bg-orange-100 text-orange-800 p-3 rounded">Double pledged assets (FND-020)</div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 font-mono">
                <span>← Impact Vector Increase</span>
                <span>Probability Spectrum →</span>
              </div>
            </div>

            {/* AI Confidence Score Distribution Chart (Requirement 10) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  {isRTL ? 'نسبة ثقة محرك الذكاء الاصطناعي' : 'AI Confidence Distribution'}
                </h3>
              </div>

              <div className="space-y-4 pt-1">
                {[
                  { level: isRTL ? 'ثقة عالية جداً (90 - 100٪)' : 'High Confidence (90-100%)', count: 18, pct: 90, color: 'bg-emerald-500', desc: isRTL ? 'تم الإقرار دون حاجة لمراجعة مكثفة' : 'Validated against structured AAOIFI standards.' },
                  { level: isRTL ? 'ثقة متوسطة (70 - 89٪)' : 'Medium Confidence (70-89%)', count: 2, pct: 10, color: 'bg-amber-500', desc: isRTL ? 'يوصى بمطابقتها مع السياسات الداخلية' : 'Slight ambiguity detected; review recommended.' },
                  { level: isRTL ? 'تتطلب مراجعة بشرية (أقل من 70٪)' : 'Human Review Required (<70%)', count: 0, pct: 0, color: 'bg-red-500', desc: isRTL ? 'تم التوجيه لطابور الرقابة الشرعية الفورية' : 'Critical anomaly triggered automated escalation.' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{item.level}</span>
                      <span className="font-mono text-slate-500">{item.count} items ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ====================================================
          2. ANALYSIS CENTER
          ==================================================== */}
      {activeSubTab === 'analysis' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Run Analysis Creation Form (Requirement 5) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 col-span-1">
              <div className="border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  {isRTL ? 'طلب فحص ومراجعة ذكي جديد' : 'New AI Compliance Run'}
                </h3>
              </div>

              <form onSubmit={handleStartAnalysis} className="space-y-4 text-xs">
                
                {/* Analysis Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">{isRTL ? 'اسم عملية المراجعة:' : 'Analysis Name:'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'مثال: مراجعة تمويل المرابحة الربع سنوي' : 'e.g. Q3 Murabaha Financing Audit'}
                    value={newAnalysisName}
                    onChange={(e) => setNewAnalysisName(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Analysis Type */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">{isRTL ? 'نوع الفحص والتدقيق:' : 'Analysis Type:'}</label>
                  <select
                    value={selectedAnalysisType}
                    onChange={(e) => setSelectedAnalysisType(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded focus:outline-none"
                  >
                    <option value="Sharia Compliance Review">Sharia Compliance Review</option>
                    <option value="Financial Review">Financial Review</option>
                    <option value="ERP Transaction Review">ERP Transaction Review</option>
                    <option value="Contract Review">Contract Review</option>
                    <option value="SOP Review">SOP Review</option>
                    <option value="Policy Review">Policy Review</option>
                    <option value="Full Compliance Review">Full Compliance Review</option>
                  </select>
                </div>

                {/* Data Source */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">{isRTL ? 'مصدر البيانات المغذي:' : 'Data Source:'}</label>
                  <select
                    value={selectedDataSource}
                    onChange={(e) => setSelectedDataSource(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded focus:outline-none"
                  >
                    <option value="ERP Data">ERP Ingestion Stream (Odoo / SAP)</option>
                    <option value="Uploaded Documents">Uploaded Documents (PDF/Docx Contracts)</option>
                    <option value="Manual Upload">Manual File Attachment Upload</option>
                    <option value="Selected Transactions">Selected Transactions</option>
                  </select>
                </div>

                {/* Active Agents Checklist */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">{isRTL ? 'تفعيل وكلاء الامتثال (الذكاء الاصطناعي):' : 'Activate AI Agents (Multi-Agent framework):'}</label>
                  <div className="space-y-1.5">
                    {aiAgents.map((agent) => {
                      const isActive = selectedAgents.includes(agent.id);
                      return (
                        <label key={agent.id} className="flex items-center gap-2 border rounded p-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-[11px]">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => {
                              if (isActive) {
                                setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                              } else {
                                setSelectedAgents([...selectedAgents, agent.id]);
                              }
                            }}
                          />
                          <span className="font-bold text-slate-700">{agent.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition"
                >
                  {isAnalyzing ? (isRTL ? 'جاري التحليل والمطابقة...' : 'AI Reasoning Active...') : (isRTL ? 'تشغيل التحليل الفوري' : 'Start Audit Engine')}
                </button>
              </form>
            </div>

            {/* Run Progress & Output Logs Terminal (Requirement 4 & 5) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 col-span-2">
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>{isRTL ? 'كونسول بث عمليات المراجعة والتدقيق المباشر' : 'Live Multi-Agent Processing Terminal'}</span>
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnalyzing ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                  {isAnalyzing ? (isRTL ? 'جاري التشغيل' : 'RUNNING') : (isRTL ? 'خامل' : 'IDLE')}
                </span>
              </div>

              {/* Progress bar */}
              {isAnalyzing && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>{isRTL ? 'معدل تقدم الفحص والتدقيق المالي' : 'Job progress:'}</span>
                    <span className="font-mono">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Logs area */}
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-slate-300 min-h-[220px] max-h-[300px] overflow-y-auto space-y-1 border border-slate-800">
                <span className="text-slate-500 block">/* Multi-Agent Compliance Pipeline Log stream: */</span>
                {analysisLogs.length === 0 && (
                  <span className="text-slate-600 block italic">Terminal ready. Configure parameters and run analysis to stream agent reasoning processes.</span>
                )}
                {analysisLogs.map((log, index) => (
                  <div key={index} className="text-slate-200">
                    {log}
                  </div>
                ))}
              </div>

              {/* Completed Jobs History */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  {isRTL ? 'تاريخ العمليات المنفذة بنجاح' : 'Successful Historical Audits'}
                </span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {analysisJobs.map((job) => (
                    <div key={job.id} className="border p-3 rounded-lg text-xs flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{job.name}</span>
                        <div className="flex gap-2 text-[10px] text-slate-400">
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>Source: {job.dataSource}</span>
                          <span>•</span>
                          <span>{job.completedAt || job.startedAt}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                          Compliance Score: {job.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ====================================================
          3. COMPLIANCE AGENTS
          ==================================================== */}
      {activeSubTab === 'agents' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Accuracy: {agent.accuracy}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-slate-900 text-sm">{agent.name}</h3>
                    <span className="text-[10px] text-emerald-600 font-mono uppercase font-bold tracking-wider">
                      Agent Role: {agent.type.toUpperCase()}_AI
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed min-h-[64px]">
                    {agent.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 border-t pt-3 text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="block uppercase font-bold">Jobs Audited</span>
                      <strong className="text-slate-700 text-xs font-bold block">{agent.tasksCompleted}</strong>
                    </div>
                    <div>
                      <span className="block uppercase font-bold">Status</span>
                      <strong className="text-emerald-600 text-xs font-bold block">● {agent.status}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ====================================================
          4. FINDINGS MANAGEMENT
          ==================================================== */}
      {activeSubTab === 'findings' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Filtering Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between text-xs">
            
            <div className="flex flex-wrap gap-3 items-center">
              
              {/* Category Filter */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="bg-slate-50 border p-1.5 rounded focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Sharia Compliance">Sharia Compliance</option>
                  <option value="Financial Compliance">Financial Compliance</option>
                  <option value="SOP Compliance">SOP Compliance</option>
                  <option value="Policy Compliance">Policy Compliance</option>
                  <option value="Risk Management">Risk Management</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Severity</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="bg-slate-50 border p-1.5 rounded focus:outline-none"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border p-1.5 rounded focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

            </div>

            <span className="text-[11px] text-slate-400 font-bold">
              Found {filteredFindings.length} of {findings.length} simulated findings
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Finding list */}
            <div className="xl:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredFindings.length === 0 ? (
                <div className="p-8 bg-white text-center border rounded-xl text-slate-400 text-xs">
                  No findings matching criteria.
                </div>
              ) : (
                filteredFindings.map((finding) => (
                  <div
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className={`border rounded-xl p-4 cursor-pointer transition flex flex-col justify-between ${
                      selectedFinding?.id === finding.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] font-bold opacity-60">
                          {finding.id}
                        </span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                          finding.severity === 'Critical' 
                            ? 'bg-red-100 text-red-800' 
                            : finding.severity === 'High' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {finding.severity}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs leading-snug line-clamp-2">
                        {finding.title}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/10 text-[9px] font-mono">
                      <span className="opacity-80">{finding.category}</span>
                      <span className={`font-bold uppercase ${
                        finding.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {finding.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Column: In-depth explainability slider (Requirement 12 & 7) */}
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[450px]">
              {selectedFinding ? (
                <div className="space-y-6 text-xs">
                  
                  {/* Detailed Panel Header */}
                  <div className="border-b pb-4 space-y-2">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400">
                        <span>{selectedFinding.id}</span>
                        <span>•</span>
                        <span>{selectedFinding.category}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        selectedFinding.severity === 'Critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedFinding.severity} Severity
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-base">
                      {selectedFinding.title}
                    </h3>

                    <div className="flex gap-4 font-mono text-[10px] text-slate-500">
                      <span>Confidence Score: <strong className="text-emerald-600 font-bold">{selectedFinding.confidence}%</strong></span>
                      <span>•</span>
                      <span>Logged: {selectedFinding.timestamp}</span>
                    </div>
                  </div>

                  {/* Explainability Grid: WHAT, WHY, EVIDENCE, STANDARD, NEXT STEPS (Requirement 12) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 rounded-xl border">
                    
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">
                        What was detected?
                      </span>
                      <p className="text-slate-800 font-bold text-[11px]">
                        {selectedFinding.aiExplanation.detected}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">
                        Why was it flagged?
                      </span>
                      <p className="text-slate-800 font-bold text-[11px]">
                        {selectedFinding.aiExplanation.why}
                      </p>
                    </div>

                    <div className="space-y-1 border-t pt-2 md:border-t-0 md:pt-0">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">
                        Supporting Evidence
                      </span>
                      <p className="text-slate-800 font-mono font-bold text-[11px] text-indigo-700">
                        {selectedFinding.aiExplanation.evidence}
                      </p>
                    </div>

                    <div className="space-y-1 border-t pt-2 md:border-t-0 md:pt-0">
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">
                        Applicable Standard
                      </span>
                      <p className="text-slate-800 font-bold text-[11px] text-emerald-700">
                        {selectedFinding.applicableStandard}
                      </p>
                    </div>

                  </div>

                  {/* Full Description & Recommendation */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <strong className="text-slate-700 font-bold block">Finding Description:</strong>
                      <p className="text-slate-600 leading-relaxed font-sans">{selectedFinding.description}</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg space-y-1">
                      <strong className="text-emerald-800 font-bold block">AI System Recommendation:</strong>
                      <p className="text-emerald-700 font-sans">{selectedFinding.recommendation}</p>
                    </div>
                  </div>

                  {/* Interactive Queue Decider Box (Requirement 11) */}
                  <div className="border-t pt-4 space-y-3">
                    <strong className="text-slate-700 font-bold block">
                      {isRTL ? 'إجراء وتدقيق المراجعة البشرية (Human-in-the-Loop):' : 'Accredited Board Review Decisions (Human Audit Queue)'}
                    </strong>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <button
                        onClick={() => handleReviewAction(selectedFinding.id, 'Approved', 'Approved by compliance supervisor.')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Approve Finding</span>
                      </button>

                      <button
                        onClick={() => handleReviewAction(selectedFinding.id, 'Rejected', 'Rejected after manual contract review.')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Dismiss / Reject</span>
                      </button>

                      <button
                        onClick={() => {
                          const code = prompt('Please specify further evidence requirements or comments:');
                          if (code) {
                            handleReviewAction(selectedFinding.id, 'Under Review', code);
                          }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Request Evidence</span>
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  Select a compliance finding to view detailed explainability graphs.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ====================================================
          5. RISK ASSESSMENT
          ==================================================== */}
      {activeSubTab === 'risk' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Risk Category Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-800">
                {isRTL ? 'أبعاد وجوانب المخاطر الكلية للامتثال المؤسسي' : 'Enterprise Compliance Risk Vector Breakdown'}
              </h3>

              <div className="space-y-4 text-xs pt-1">
                {[
                  { name: 'Financial Risk (Cash & Liquidity)', level: 'Low Risk', desc: 'No heavy exposure in non-liquid commercial funds.', val: 12 },
                  { name: 'Operational & Workflow Risk', level: 'Medium Risk', desc: 'Slight delays in secondary authorizations on PO steps.', val: 45 },
                  { name: 'Sharia Non-Compliance Risk', level: 'Critical/Action Needed', desc: 'Late penalty clauses require immediate charity purification.', val: 82 },
                  { name: 'SOP Process Deviation Risk', level: 'Low Risk', desc: 'High percentage matching of system-wide shipping files.', val: 20 }
                ].map((item, idx) => (
                  <div key={idx} className="border p-3.5 rounded-xl bg-slate-50 space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800">{item.name}</span>
                      <span className={`px-2 py-0.5 text-[9px] rounded-full ${
                        item.val > 70 
                          ? 'bg-red-100 text-red-800 font-bold' 
                          : item.val > 30 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{item.desc}</p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.val > 70 ? 'bg-red-500' : item.val > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Sharia Purification Pool */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>{isRTL ? 'ميزان وعاء التطهير الخيري للسيولة والربا' : 'Sharia Purification Fund Allocation'}
                  </span>
                </h3>
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-mono font-bold">PURIFICATION IN PROGRESS</span>
              </div>

              <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-xl text-center space-y-1 shadow-sm">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block tracking-widest">
                  Total Liquid Capital Set for Purification
                </span>
                <span className="text-3xl font-bold font-mono text-yellow-400">$129,520.00</span>
                <span className="text-[10px] text-slate-300 block">Diverted from Mixed Shares & Compounded Invoices</span>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Pending Payout Distributions
                </span>
                {[
                  { target: 'Al Noor Humanitarian Waqf Relief', amount: 80000, source: 'Mixed stock dividend purification' },
                  { target: 'Islamic Charity Development Fund', amount: 45000, source: 'Delinquent late penalty fees Odoo' },
                  { target: 'Purification Overages Holding', amount: 4520, source: 'FND-001 Penalty Divert' }
                ].map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center border p-2.5 rounded bg-slate-50 font-sans text-[11px]">
                    <div>
                      <strong className="text-slate-800 block">{p.target}</strong>
                      <span className="text-[10px] text-slate-400">{p.source}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700">${p.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ====================================================
          6. EVIDENCE EXPLORER
          ==================================================== */}
      {activeSubTab === 'evidence' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Interactive Evidence Timeline tree (Requirement 9) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-800">
              {isRTL ? 'مستندات وأدلة حركات التدقيق المرقمنة' : 'Audit Trail Evidence Logs'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRTL 
                ? 'شجرة الأدلة التي توثق الحركات المالية وعقود المشتريات المترابطة بالملاحظات الشرعية لتدقيق الهيئات المعتمدة.' 
                : 'Direct linkages between system findings and real-world ERP journal entries, contracts, bills of lading, and purchase workflows.'}
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {evidenceItems.map((evi) => {
                const associatedFinding = findings.find(f => f.id === evi.findingId);
                return (
                  <div key={evi.id} className="border p-4 rounded-xl bg-slate-50 hover:bg-slate-100/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 md:max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-800 font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                          {evi.sourceType}
                        </span>
                        <strong className="text-slate-800 text-xs font-mono">{evi.sourceId}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Date: {evi.date}</span>
                      </div>
                      <p className="text-slate-500 font-sans">{evi.description}</p>
                    </div>

                    <div className="bg-white p-3 border rounded-lg text-right md:min-w-[200px]">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Related Finding</span>
                      {associatedFinding ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block text-[11px] truncate">{associatedFinding.title}</span>
                          <span className="font-mono text-[9px] text-slate-400 block font-bold">{associatedFinding.id}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          7. HUMAN REVIEW QUEUE
          ==================================================== */}
      {activeSubTab === 'queue' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-800">
              {isRTL ? 'طابور المراجعة وإبداء الرأي الشرعي المباشر' : 'Accredited Board Decision & Comment Log'}
            </h3>

            <div className="space-y-4 pt-1 text-xs">
              {reviewTasks.map((task) => {
                const finding = findings.find(f => f.id === task.findingId);
                if (!finding) return null;
                
                return (
                  <div key={task.id} className="border p-4 rounded-xl bg-slate-50 space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <span className="font-mono text-[9px] font-bold text-slate-400 block">{task.id}</span>
                        <strong className="text-slate-800 text-xs font-bold block">{finding.title}</strong>
                        <span className="text-[10px] text-slate-400">Assigned Reviewer: {task.assignedUser}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'Pending Decision' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    {/* Comment feed */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Decision & Audit Comments</span>
                      {task.comments.map((comm) => (
                        <div key={comm.id} className="bg-white p-3 border rounded-lg space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>{comm.user}</span>
                            <span className="font-mono text-slate-400">{comm.timestamp}</span>
                          </div>
                          <p className="text-slate-600 font-sans">{comm.comment}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add custom comment and decide */}
                    {task.status === 'Pending Decision' && (
                      <div className="space-y-3 pt-2">
                        <textarea
                          placeholder={isRTL ? 'إضافة رأي شرعي أو ملحوظة للجنة...' : 'Enter Sharia ruling notes or comment for board review...'}
                          rows={2}
                          id={`comment-text-${task.id}`}
                          className="w-full bg-white border p-2.5 rounded text-xs focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              const el = document.getElementById(`comment-text-${task.id}`) as HTMLTextAreaElement;
                              handleReviewAction(finding.id, 'Approved', el?.value || '');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-[11px]"
                          >
                            Approve & Close
                          </button>
                          <button
                            onClick={() => {
                              const el = document.getElementById(`comment-text-${task.id}`) as HTMLTextAreaElement;
                              handleReviewAction(finding.id, 'Rejected', el?.value || '');
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-3 rounded text-[11px]"
                          >
                            Reject & Flags
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          8. AI SETTINGS
          ==================================================== */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-800">
              {isRTL ? 'إعدادات وحدود دقة التدقيق بالذكاء الاصطناعي' : 'AI Reasoning Accuracies & Threshold Settings'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Selected Sharia Compliance Standard:</label>
                  <select className="w-full bg-slate-50 border p-2 rounded focus:outline-none font-bold">
                    <option value="AAOIFI">AAOIFI Comprehensive Islamic Standards v2024</option>
                    <option value="DFM">Dubai Financial Market (DFM) Sharia Rules</option>
                    <option value="BNM">Bank Negara Malaysia (SAC BNM) Guidelines</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Minimum AI Confidence Level for Automated Signoff:</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="50" max="100" defaultValue="90" className="w-full" />
                    <strong className="font-mono text-slate-900">90%</strong>
                  </div>
                  <span className="text-[10px] text-slate-400">Findings with confidence below this threshold force mandatory Human Review Escalation.</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Zakat Calculation Framework basis:</label>
                  <select className="w-full bg-slate-50 border p-2 rounded focus:outline-none">
                    <option value="net-assets">Net Liquid Assets Method (AAOIFI Standard 35)</option>
                    <option value="net-growth">Net Growth Capital Method</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Purification Payout Automation Status:</label>
                  <select className="w-full bg-slate-50 border p-2 rounded focus:outline-none">
                    <option value="manual">Manual Release post-Board Resolution</option>
                    <option value="semi-auto">Semi-Automated Inward/Outward Account Divert</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ====================================================
          9. DATABASE EXTENSIONS / SCHEMAS
          ==================================================== */}
      {activeSubTab === 'db_schema' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-display font-bold text-sm text-slate-800">
                {isRTL ? 'نموذج محاكاة تخزين قواعد البيانات الممتدة' : 'Extended Data Model Inspector'}
              </h3>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-xs">
              
              {/* Collection: aiAgents */}
              <div className="border rounded-xl p-4 space-y-2 bg-slate-50">
                <strong className="text-indigo-700 block font-mono">Collection: aiAgents</strong>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-[10px] text-slate-400">
                        <th className="py-1">name</th>
                        <th className="py-1">type</th>
                        <th className="py-1">description</th>
                        <th className="py-1">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAgents.map((a) => (
                        <tr key={a.id} className="border-b text-[11px] font-mono text-slate-700">
                          <td className="py-1.5">{a.name}</td>
                          <td className="py-1.5">{a.type}</td>
                          <td className="py-1.5 max-w-[150px] truncate">{a.description}</td>
                          <td className="py-1.5 text-emerald-600">{a.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Collection: analysisJobs */}
              <div className="border rounded-xl p-4 space-y-2 bg-slate-50">
                <strong className="text-indigo-700 block font-mono">Collection: analysisJobs</strong>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-[10px] text-slate-400">
                        <th className="py-1">organizationId</th>
                        <th className="py-1">type</th>
                        <th className="py-1">dataSource</th>
                        <th className="py-1">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisJobs.map((j) => (
                        <tr key={j.id} className="border-b text-[11px] font-mono text-slate-700">
                          <td className="py-1.5">{j.organizationId}</td>
                          <td className="py-1.5">{j.type}</td>
                          <td className="py-1.5">{j.dataSource}</td>
                          <td className="py-1.5 text-emerald-600">{j.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Collection: findings */}
              <div className="border rounded-xl p-4 space-y-2 bg-slate-50">
                <strong className="text-indigo-700 block font-mono">Collection: findings</strong>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-[10px] text-slate-400">
                        <th className="py-1">organizationId</th>
                        <th className="py-1">title</th>
                        <th className="py-1">category</th>
                        <th className="py-1">confidence</th>
                        <th className="py-1">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {findings.slice(0, 5).map((f) => (
                        <tr key={f.id} className="border-b text-[11px] font-mono text-slate-700">
                          <td className="py-1.5">{f.organizationId}</td>
                          <td className="py-1.5 max-w-[120px] truncate">{f.title}</td>
                          <td className="py-1.5">{f.category}</td>
                          <td className="py-1.5">{f.confidence}%</td>
                          <td className="py-1.5 text-amber-600">{f.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Collection: evidenceItems */}
              <div className="border rounded-xl p-4 space-y-2 bg-slate-50">
                <strong className="text-indigo-700 block font-mono">Collection: evidenceItems</strong>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-[10px] text-slate-400">
                        <th className="py-1">findingId</th>
                        <th className="py-1">sourceType</th>
                        <th className="py-1">sourceId</th>
                        <th className="py-1">description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evidenceItems.map((e) => (
                        <tr key={e.id} className="border-b text-[11px] font-mono text-slate-700">
                          <td className="py-1.5">{e.findingId}</td>
                          <td className="py-1.5">{e.sourceType}</td>
                          <td className="py-1.5">{e.sourceId}</td>
                          <td className="py-1.5 max-w-[150px] truncate">{e.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
