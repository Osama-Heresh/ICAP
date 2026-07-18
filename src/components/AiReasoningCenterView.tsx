import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Shield,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Sliders,
  Sparkles,
  Database,
  ArrowRight,
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
  Workflow,
  Terminal,
  Activity,
  Plus,
  Compass,
  AlertCircle,
  TrendingUp,
  Clock,
  RotateCcw,
  Send,
  User,
  Zap,
  HelpCircle,
  CheckSquare,
  FileSpreadsheet,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiReasoningCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

// ----------------------------------------------------
// DB EXTENSION INTERFACES (Requirement 16)
// ----------------------------------------------------

interface KnowledgeRetrievalLog {
  id: string;
  query: string;
  documentsRetrieved: { title: string; section: string; relevance: number }[];
  relevanceScores: number; // Overall relevance score
  timestamp: string;
}

interface StandardMapping {
  id: string;
  organizationId: string;
  activity: string;
  standard: string;
  section: string;
  rule: string;
  category: string;
  findingId?: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  source: 'AAOIFI' | 'Customer Policy' | 'SOP' | 'Internal Control' | 'Audit';
  condition: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  action: string;
  enabled: boolean;
}

interface AiReasoningLog {
  id: string;
  analysisId: string;
  title: string;
  input: { type: string; details: string; amount?: number; id: string };
  knowledgeUsed: { source: string; section: string; text: string }[];
  appliedRules: string[];
  reasoning: string[];
  result: 'Compliance issue detected' | 'Compliant' | 'Warning flagged';
  confidenceScore: number;
  timestamp: string;
}

interface Recommendation {
  id: string;
  findingId: string;
  findingTitle: string;
  action: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Deferred';
  deadline: string;
  expectedOutcome: string;
}

interface AiFeedback {
  id: string;
  aiResultId: string;
  aiResult: string;
  humanDecision: 'Approve' | 'Reject' | 'Modify';
  comments: string;
  reviewer: string;
  timestamp: string;
}

// ----------------------------------------------------
// DEMO DATA (Requirement 17)
// ----------------------------------------------------

const DEMO_KNOWLEDGE_DOCUMENTS = [
  {
    id: 'KDOC-001',
    title: 'AAOIFI Sharia Standard No. 8',
    section: 'Section 4/1: Late Payment Penalties',
    content: 'Any stipulated penalty in a credit sale transaction that yields direct commercial income to the creditor is forbidden (riba). Deterrent penalties are allowed only if 100% of collected penalties are transferred to a designated charity purification account overseen by the Sharia Board.',
    category: 'Sharia Core',
    standard: 'AAOIFI No. 8'
  },
  {
    id: 'KDOC-002',
    title: 'AAOIFI Sharia Standard No. 9',
    section: 'Section 5/1: Ijara & Title Transfer',
    content: 'Ijara (Lease-to-own) contracts must not bind the rental action and ownership transfer concurrently. The transfer of the asset deed must be executed either via a unilateral Promise to Sell (Wa’ad) or a separate Gift contract (Hiba) executed after the lease term concludes.',
    category: 'Sharia Core',
    standard: 'AAOIFI No. 9'
  },
  {
    id: 'KDOC-003',
    title: 'ICAP Corporate Investment Policy v3.2',
    section: 'Clause 6.1: Cash Reserves & Yields',
    content: 'All surplus corporate liquid assets must be held in Islamic banking deposits (Mudaraba / Wakala / Murabaha). No funds may be invested in conventional interest-bearing assets, municipal bonds, or capital-guaranteed joint ventures.',
    category: 'Company Policy',
    standard: 'Corp-INV-06'
  },
  {
    id: 'KDOC-004',
    title: 'SOP Procurement Controls - SOP-PROC-04',
    section: 'Paragraph 4.2: Capital Outlays Authorization',
    content: 'Capital purchases exceeding $200,000 require joint authorization: the signature of the initiating department head and retrospective/concomitant digital validation from the VP of Finance.',
    category: 'Internal SOP',
    standard: 'SOP-PROC-04'
  },
  {
    id: 'KDOC-005',
    title: 'AAOIFI Sharia Standard No. 12',
    section: 'Section 4/1/3: Capital Guarantees in Partnerships',
    content: 'In Musharaka or Mudaraba, a partner cannot guarantee the safety of another partner’s principal capital against business risk. Capital safety guarantees nullify the partnership structure, transforming it into an interest-bearing debt.',
    category: 'Sharia Core',
    standard: 'AAOIFI No. 12'
  },
  {
    id: 'KDOC-006',
    title: 'AAOIFI Sharia Standard No. 35',
    section: 'Zakat Calculation base exclusions',
    content: 'For the calculation of corporate Zakat liability using the Net Assets method, long-term operational fixed assets (such as machinery or real property used in production) must be deducted. Liquid cash balances, inventories, and active short-term receivables must be fully included.',
    category: 'Zakat Core',
    standard: 'AAOIFI No. 35'
  },
  {
    id: 'KDOC-007',
    title: 'AAOIFI Sharia Standard No. 21',
    section: 'Mixed-Share Purification Ratios',
    content: 'Holding shares of mixed (partially non-compliant) companies is permitted if non-compliant revenues represent less than 5% of total income. Any dividends derived from such mixed investments must be purified mathematically using the purification ratio and distributed to charities.',
    category: 'Sharia Core',
    standard: 'AAOIFI No. 21'
  },
  {
    id: 'KDOC-008',
    title: 'Anti-Money Laundering Framework (AML-01)',
    section: 'Suspicious Activity & Cash Deposits',
    content: 'Any cash or check receipt exceeding $10,000 without a linked verified sales ledger transaction, system invoice, or validated buyer tax profile must trigger a Level-2 compliance freeze for AML audit.',
    category: 'SOP Regulation',
    standard: 'AML-01'
  }
];

const INITIAL_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'RULE-001',
    name: 'Compound Penalty Check',
    description: 'Detects if compound monthly late fees or conventional penalty interest accounts are credited.',
    source: 'AAOIFI',
    condition: 'Account = INTEREST_PENALTY OR Clause contains "compound late fee"',
    severity: 'Critical',
    action: 'Divert to Purification Ledger & Flag Finding',
    enabled: true
  },
  {
    id: 'RULE-002',
    name: 'Dual Authorization Limit',
    description: 'Triggers when a purchase transaction exceeds $200,000 with a single initiator signature.',
    source: 'SOP',
    condition: 'Amount > 200000 AND SignatureCount < 2',
    severity: 'High',
    action: 'Freeze SAP payment voucher & assign Board Task',
    enabled: true
  },
  {
    id: 'RULE-003',
    name: 'Takaful Insurance Validation',
    description: 'Flags transactions to conventional commercial insurance entities rather than mutual cooperative Takaful.',
    source: 'Customer Policy',
    condition: 'VendorType = Commercial_Insurance',
    severity: 'Medium',
    action: 'Prompt procurement for Sharia-compliant alternative',
    enabled: true
  },
  {
    id: 'RULE-004',
    name: 'Murabaha Delivery Sequence',
    description: 'Checks if sales invoices are generated before supplier physical delivery notes are logged.',
    source: 'AAOIFI',
    condition: 'CustomerInvoiceTime < SupplierDeliveryTime',
    severity: 'Critical',
    action: 'Block ERP transaction release & flag sequence violation',
    enabled: true
  },
  {
    id: 'RULE-005',
    name: 'Musharaka Capital Protection Check',
    description: 'Analyzes contract language for clauses guaranteeing return of joint venture principal.',
    source: 'AAOIFI',
    condition: 'Contract contains "guarantees return of principal" OR "warrants 100% safety"',
    severity: 'Critical',
    action: 'Redraft contract template & alert Compliance Officer',
    enabled: true
  },
  {
    id: 'RULE-006',
    name: 'Cash Deposit Verification (AML)',
    description: 'Detects bank deposits over $10,000 lacking verifiable invoice or partner references.',
    source: 'Internal Control',
    condition: 'DepositAmount > 10000 AND InvoiceLink = NULL',
    severity: 'High',
    action: 'Apply Level-2 AML freeze pending manual source validation',
    enabled: true
  }
];

const INITIAL_STANDARD_MAPPINGS: StandardMapping[] = [
  { id: 'MAP-001', organizationId: 'org-icap-demo', activity: 'Murabaha Financing Sales', standard: 'AAOIFI Standard No. 8', section: 'Section 5/3', rule: 'Compound Penalty Check', category: 'Sharia Compliance', findingId: 'FND-001' },
  { id: 'MAP-002', organizationId: 'org-icap-demo', activity: 'Equipment Purchases', standard: 'Corporate SOP-PROC-04', section: 'Paragraph 4.2', rule: 'Dual Authorization Limit', category: 'SOP Compliance', findingId: 'FND-002' },
  { id: 'MAP-003', organizationId: 'org-icap-demo', activity: 'Logistics Fleet Coverage', standard: 'AAOIFI Standard No. 26', section: 'Takaful Rules', rule: 'Takaful Insurance Validation', category: 'Policy Compliance', findingId: 'FND-003' },
  { id: 'MAP-004', organizationId: 'org-icap-demo', activity: 'Asset Reselling Agreements', standard: 'AAOIFI Standard No. 8', section: 'Section 3/2 (Possession)', rule: 'Murabaha Delivery Sequence', category: 'Sharia Compliance', findingId: 'FND-006' },
  { id: 'MAP-005', organizationId: 'org-icap-demo', activity: 'Joint Venture Structuring', standard: 'AAOIFI Standard No. 12', section: 'Capital Protection Limits', rule: 'Musharaka Capital Protection Check', category: 'Sharia Compliance', findingId: 'FND-010' },
  { id: 'MAP-006', organizationId: 'org-icap-demo', activity: 'Liquidity Cash Receipts', standard: 'AML Framework AML-01', section: 'Suspicious Receipts', rule: 'Cash Deposit Verification (AML)', category: 'Risk Management', findingId: 'FND-014' }
];

const INITIAL_AI_REASONING_LOGS: AiReasoningLog[] = [
  {
    id: 'LOG-001',
    analysisId: 'job-1',
    title: 'ERP Murabaha Penalty Scan',
    input: { id: 'JE-55421', type: 'Journal Entry', details: 'Credit interest penalty account', amount: 4520 },
    knowledgeUsed: [
      { source: 'AAOIFI Standard No. 8', section: 'Section 4/1', text: 'Any penalty that yields direct commercial income is forbidden.' }
    ],
    appliedRules: ['Compound Penalty Check'],
    reasoning: [
      'Identified credit entry to Odoo account code 4509-INTEREST-PENALTY.',
      'Compared rate of 2.5% penalty monthly multiplier with Sharia Standard limit.',
      'Flagged as direct corporate yield rather than charity divert structure.',
      'Calculated purification amount to isolate: $4,520.'
    ],
    result: 'Compliance issue detected',
    confidenceScore: 98.4,
    timestamp: '2026-07-17 10:12:00'
  },
  {
    id: 'LOG-002',
    analysisId: 'job-1',
    title: 'Purchase Order Approval Scan',
    input: { id: 'PO-8891', type: 'Purchase Order', details: 'Equipment Purchase Order validation', amount: 520000 },
    knowledgeUsed: [
      { source: 'SOP Procurement Controls', section: 'Paragraph 4.2', text: 'Purchases exceeding $200k require VP of Finance signature.' }
    ],
    appliedRules: ['Dual Authorization Limit'],
    reasoning: [
      'Parsed signature block on PDF document.',
      'Found only single signature from procurement department head.',
      'Matched purchase value ($520,000) against limit threshold ($200,000).',
      'Detected missing second validator authorization hash.'
    ],
    result: 'Compliance issue detected',
    confidenceScore: 96.0,
    timestamp: '2026-07-17 09:30:15'
  },
  {
    id: 'LOG-003',
    analysisId: 'job-2',
    title: 'Wakala Yield Structuring Review',
    input: { id: 'CTR-WK-304', type: 'Contract', details: 'Joint Venture Wakala Agreement' },
    knowledgeUsed: [
      { source: 'AAOIFI Standard No. 23', section: 'Section 3/1/5', text: 'Agents cannot guarantee minimum yields or safe capital.' }
    ],
    appliedRules: ['Musharaka Capital Protection Check'],
    reasoning: [
      'Scanned contract text for guaranteed principal clauses.',
      'Detected literal sentence: "Agent guarantees minimum return of 7% per annum."',
      'Evaluated compliance: Wakala requires profit rate expectation rather than absolute guarantee.'
    ],
    result: 'Compliance issue detected',
    confidenceScore: 96.9,
    timestamp: '2026-07-10 10:45:00'
  }
];

const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'REC-001',
    findingId: 'FND-001',
    findingTitle: 'Compound Late Penalty Clause on ERP Invoice',
    action: 'Divert accumulated late charges ($4,520) to Charity Purification Ledger immediately and update master billing templates.',
    owner: 'Zain Al-Abedin (Head of Accounting)',
    priority: 'High',
    status: 'Pending',
    deadline: '2026-07-24',
    expectedOutcome: '100% Sharia audit pass and elimination of illicit yields from interest.'
  },
  {
    id: 'REC-002',
    findingId: 'FND-002',
    findingTitle: 'Missing Dual-Authorization Control Workflow',
    action: 'Route retroactive approval task to VP of Finance via system tokens and configure hard stop limits on ERP checkouts.',
    owner: 'Sarah Watson (Audit Manager)',
    priority: 'High',
    status: 'In Progress',
    deadline: '2026-07-20',
    expectedOutcome: 'Systematic dual approval constraint enforcement.'
  },
  {
    id: 'REC-003',
    findingId: 'FND-003',
    findingTitle: 'Conventional Commercial Fleet Insurance Contract',
    action: 'Initiate early policy buyout and transfer active fleet policies to Islamic Takaful cooperative operator.',
    owner: 'Nasser Al-Subaie (Procurement Analyst)',
    priority: 'Medium',
    status: 'Pending',
    deadline: '2026-08-10',
    expectedOutcome: 'Transition from commercial risk transfer to cooperative Takaful model.'
  }
];

const INITIAL_FEEDBACK_LOGS: AiFeedback[] = [
  {
    id: 'FDB-001',
    aiResultId: 'LOG-001',
    aiResult: 'Flagged compound interest penalty as Critical non-compliant yield.',
    humanDecision: 'Approve',
    comments: 'Perfect identification. The Odoo account was misclassified during migration.',
    reviewer: 'Dr. Tariq Al-Suwaidan (Sharia Advisor)',
    timestamp: '2026-07-17 11:30:00'
  },
  {
    id: 'FDB-002',
    aiResultId: 'LOG-002',
    aiResult: 'Flagged single-signed PO-8891 as SOP Control Failure.',
    humanDecision: 'Modify',
    comments: 'Adjusted status of finding. While missing dual sign-off is a failure, this was an emergency medical parts batch. Priority reduced to Medium.',
    reviewer: 'Ahmed Al-Mansoor (Compliance Officer)',
    timestamp: '2026-07-17 12:45:00'
  }
];

// Conversational Copilot Data - exactly 10 high-fidelity predefined questions/answers (Requirement 17)
const COPILOT_CONVERSATIONS = [
  {
    id: 1,
    question: "Why was transaction JE-55421 flagged?",
    answer: "Transaction JE-55421 was flagged by Accounting AI because it records a credit entry to Odoo revenue account `4509-INTEREST-PENALTY` from an active customer invoice. Under **AAOIFI Sharia Standard No. 8**, any late payment penalty in a credit sale transaction that goes into corporate earnings is prohibited (Riba). The system detected a compound late fee calculation of 2.5% applied directly to corporate yields."
  },
  {
    id: 2,
    question: "Which standard applies to the Murabaha delay clause?",
    answer: "The applicable standard is **AAOIFI Sharia Standard No. 8 (Late Penalties & Receivables)**. It stipulates that an institution cannot pocket delayed payment penalties as business income. To maintain Sharia compliance, the penalty clause must dictate that 100% of collected late fees must be donated to an independent charity purification fund under Sharia Board supervision."
  },
  {
    id: 3,
    question: "What evidence supports the missing VP approval finding?",
    answer: "The evidence consists of **Purchase Order: PO-8891** with an amount of **$520,000**. Our system audit parsed the PDF and identified only a single digital signature belonging to `admin_p_odoo` (Procurement Manager). According to company **SOP-PROC-04**, capital outlays exceeding $200,000 require concurrent digital signatures from both the initiating department and the VP of Finance."
  },
  {
    id: 4,
    question: "What should we do regarding conventional insurance?",
    answer: "For finding **FND-003**, the recommended action is to initiate a phased exit or early cancellation of the conventional commercial fleet insurance policy. According to **AAOIFI Standard No. 26**, conventional commercial insurance operates on premium-uncertainty (gharar) and interest-based reserves. We must migrate our fleet coverage to an approved mutual **Islamic Takaful** provider."
  },
  {
    id: 5,
    question: "Show me transactions with possible Sharia concerns.",
    answer: "Active concerns include:\n1. **FND-001**: Compound interest penalty yield detected on transaction `JE-55421` ($4,520 credit).\n2. **FND-004**: Direct lease-to-own instant transfer of title without a separate Promise to Sell (Wa’ad) on contract `CTR-IJ-902`.\n3. **FND-010**: Capital guarantee clause in Musharaka partnership agreement `CTR-MS-881`.\n4. **FND-017**: Guaranteed 7% fixed return clause inside Wakala Investment contract `CTR-WK-304`."
  },
  {
    id: 6,
    question: "How does the platform prevent riba al-jahiliyyah?",
    answer: "The platform blocks riba al-jahiliyyah (compounding debt penalties upon delay) by analyzing ERP debt restructure tables and collections workflows. It ensures that whenever a default debtor seeks a maturity extension, the collection system does not charge any rescheduling fee or raise the credit pricing. Any such mark-up is automatically flagged by our Sharia agent."
  },
  {
    id: 7,
    question: "What are the rules for Istisna progress payments?",
    answer: "Under **AAOIFI Sharia Standard No. 11 (Istisna)**, progress payments to a contractor or manufacturer must correspond directly to actual physical progress. Our **Audit AI** monitors construction/engineering files to verify that physical milestone certificates are uploaded before finance disburses funds, preventing payouts on unbuilt assets (SOP-ISTISNA-PAY-03)."
  },
  {
    id: 8,
    question: "Is there any double-pledging risk in current transactions?",
    answer: "Yes, **Risk AI** flagged **FND-020** because Property Asset `AST-904` (currently pledged under an active mortgage lien) was listed as underlying lease-back collateral for a new corporate Sukuk issuance. Double-pledging violates multi-collateral guidelines under **AAOIFI Standard No. 39** and introduces critical legal exposures."
  },
  {
    id: 9,
    question: "How does the AI verify asset possession in Murabaha?",
    answer: "The **Sharia AI** runs time-series sequencing checks on invoice timestamps. It verifies that the institution purchased and possessed the asset (demonstrated by a supplier invoice and receipt log) *before* executing the resale contract with the client. If the client resale invoice is dated earlier, it flags an 'Inverted Sequence' violation under **AAOIFI Standard No. 8**."
  },
  {
    id: 10,
    question: "Can you summarize the Zakat calculation rules for this year?",
    answer: "Under **AAOIFI Sharia Standard No. 35 (Zakat)**, corporate Zakat is computed using the Net Assets method. Long-term operational fixed assets (such as manufacturing equipment or warehouses) are excluded from the Zakat base, whereas cash, trade receivables, and raw materials must be fully included. AI flagged **FND-008** because fixed leased equipment was incorrectly deducted twice."
  }
];

export default function AiReasoningCenterView({
  locale,
  theme,
  onTriggerActivityLog
}: AiReasoningCenterViewProps) {
  const isRTL = locale === 'ar';

  // Sub tab states
  const [activeSubTab, setActiveSubTab] = useState<'rag' | 'mapping' | 'rules' | 'logs' | 'recommendations' | 'copilot'>('rag');

  // Interactive Databases (Requirements 13 & 16)
  const [retrievalLogs, setRetrievalLogs] = useState<KnowledgeRetrievalLog[]>([
    {
      id: 'RTL-001',
      query: 'Late payment penalty compound interest AAOIFI',
      documentsRetrieved: [
        { title: 'AAOIFI Standard No. 8', section: 'Section 4/1', relevance: 98 },
        { title: 'AML Framework (AML-01)', section: 'Suspicious Receipts', relevance: 35 }
      ],
      relevanceScores: 98,
      timestamp: '2026-07-17 10:12:00'
    },
    {
      id: 'RTL-002',
      query: 'Purchase limit without CFO secondary signature',
      documentsRetrieved: [
        { title: 'SOP Procurement Controls', section: 'Paragraph 4.2', relevance: 96 },
        { title: 'ICAP Corporate Investment Policy', section: 'Clause 6.1', relevance: 48 }
      ],
      relevanceScores: 96,
      timestamp: '2026-07-17 09:30:15'
    }
  ]);

  const [standardMappings, setStandardMappings] = useState<StandardMapping[]>(INITIAL_STANDARD_MAPPINGS);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(INITIAL_COMPLIANCE_RULES);
  const [aiReasoningLogs, setAiReasoningLogs] = useState<AiReasoningLog[]>(INITIAL_AI_REASONING_LOGS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [feedbackLogs, setFeedbackLogs] = useState<AiFeedback[]>(INITIAL_FEEDBACK_LOGS);

  // ----------------------------------------------------
  // INTERACTIVE STATES & LOGIC
  // ----------------------------------------------------

  // RAG Search Tool states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic' | 'category' | 'standard'>('semantic');
  const [ragSearchResults, setRagSearchResults] = useState<typeof DEMO_KNOWLEDGE_DOCUMENTS>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [interactiveRagQuery, setInteractiveRagQuery] = useState('');
  const [interactiveRagResult, setInteractiveRagResult] = useState<{
    answer: string;
    steps: string[];
    sources: { title: string; section: string; relevance: number }[];
  } | null>(null);

  // Dry-run Sandbox Playground (Requirement 8)
  const [selectedTxType, setSelectedTxType] = useState<'invoice' | 'purchase' | 'investment' | 'musharaka'>('invoice');
  const [sandboxAmount, setSandboxAmount] = useState(250000);
  const [sandboxContractClause, setSandboxContractClause] = useState('Compound monthly late fee applies after 30 days');
  const [isSandboxExecuting, setIsSandboxExecuting] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Copilot Chat states (Requirement 13 & 14)
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([
    { sender: 'ai', text: isRTL ? 'مرحباً! أنا مساعد الامتثال الشرعي الذكي. يمكنك اختصار الوقت بطرح أحد الأسئلة المقترحة أو كتابة سؤالك مباشرة.' : 'Welcome! I am your Islamic Compliance AI Copilot. You can ask me any compliance questions, or select one of the suggested questions below.', timestamp: '16:24:00' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  // New Rule State
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    source: 'AAOIFI' as const,
    condition: '',
    severity: 'Medium' as const,
    action: ''
  });
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // Security Access logs (Requirement 18 - Audit Logs)
  const [securityLogs, setSecurityLogs] = useState([
    { id: 'SEC-1', user: 'myflyai@gmail.com', role: 'Super Admin', resource: 'AI Reasoning Logs', action: 'READ', timestamp: '2026-07-17 16:10:00', status: 'GRANTED' },
    { id: 'SEC-2', user: 'auditor.watson@icap.com', role: 'External Auditor', resource: 'Compliance Rules Engine', action: 'READ', timestamp: '2026-07-17 15:45:00', status: 'GRANTED' },
    { id: 'SEC-3', user: 'guest.user@external.com', role: 'Viewer', resource: 'Sharia Knowledge Documents', action: 'READ', timestamp: '2026-07-17 14:30:00', status: 'DENIED - INSUFFICIENT_ROLE' }
  ]);

  // Automated templates state (Requirement 15)
  const [templates, setTemplates] = useState([
    { id: 'TMPL-1', name: isRTL ? 'مراجعة الشريعة السنوية' : 'Annual Sharia Review', description: 'Complete AAOIFI-aligned audit covering lease, partnership, and murabaha operations.', agents: ['Sharia Compliance AI', 'Legal AI'], rules: 3, source: 'ERP + Legal SharePoint', status: 'Ready' },
    { id: 'TMPL-2', name: isRTL ? 'دعم التدقيق المالي' : 'Financial Audit Support', description: 'Financial sub-ledger transactions, impure income ratio calculations, and purification checks.', agents: ['Accounting AI', 'Risk AI'], rules: 2, source: 'SAP / Odoo GL Feed', status: 'Active' },
    { id: 'TMPL-3', name: isRTL ? 'مراجعة حركات الـ ERP' : 'ERP Transaction Review', description: 'Daily real-time scan of customer invoicing, payments, and credit parameters.', agents: ['Accounting AI', 'Audit AI'], rules: 2, source: 'ERP Webhook', status: 'Active' },
    { id: 'TMPL-4', name: isRTL ? 'مراجعة عقود الاستثمار' : 'Investment Review', description: 'Wakala agreements, Musharaka templates, and sovereign Sukuk pools alignment.', agents: ['Sharia Compliance AI', 'Legal AI', 'Risk AI'], rules: 3, source: 'Legal Shares', status: 'Ready' },
    { id: 'TMPL-5', name: isRTL ? 'مراجعة العقود والاتفاقيات' : 'Contract Review', description: 'Natural Language Processing analysis of client agreements for late interest clauses.', agents: ['Legal AI'], rules: 2, source: 'PDF / Word uploads', status: 'Ready' },
    { id: 'TMPL-6', name: isRTL ? 'مراجعة امتثال الموردين' : 'Vendor Compliance Review', description: 'Audits supplier on-boarding, ownership chains, and shipping possession sequences.', agents: ['Audit AI', 'Sharia Compliance AI'], rules: 1, source: 'Trade Portals', status: 'Ready' }
  ]);

  // ----------------------------------------------------
  // ACTION GENERATOR ENGINE (Requirement 11)
  // ----------------------------------------------------
  const [selectedPlanTemplate, setSelectedPlanTemplate] = useState<'late_penalty' | 'missing_approval' | 'conventional_ins'>('late_penalty');
  const [generatedActionPlan, setGeneratedActionPlan] = useState<any>(null);

  const handleGenerateActionPlan = (type: 'late_penalty' | 'missing_approval' | 'conventional_ins') => {
    setSelectedPlanTemplate(type);
    let plan: any = {};
    if (type === 'late_penalty') {
      plan = {
        title: 'Interest-Based Penalty Corrective Plan',
        targetFinding: 'FND-001: Compound Late Penalty',
        immediate: [
          { task: 'Post adjusting journal entry debiting operational revenue account 4509-INTEREST-PENALTY.', duration: '24 Hours', owner: 'Accounting Team' },
          { task: 'Transfer $4,520 to charity purification ledger and register with board.', duration: '48 Hours', owner: 'Treasury Officer' }
        ],
        shortTerm: [
          { task: 'Modify the automated billing template inside Odoo database to strip interest compounding equations.', duration: '5 Days', owner: 'IT Administrator' },
          { task: 'Submit amended legal wording of default deterrents for Sharia Board clearance.', duration: '7 Days', owner: 'Compliance Lead' }
        ],
        longTerm: [
          { task: 'Implement daily transaction scanners checking for keyword "interest penalty" on incoming GL records.', duration: '30 Days', owner: 'AI Engineering' }
        ]
      };
    } else if (type === 'missing_approval') {
      plan = {
        title: 'Authorization Control Failure Mitigation',
        targetFinding: 'FND-002: Single-Signature Outlay',
        immediate: [
          { task: 'Request immediate retroactive digital sign-off on PO-8891 from the VP of Finance.', duration: '24 Hours', owner: 'SOP Auditor' },
          { task: 'Temporary hold on disbursements matching PO-8891 in SAP.', duration: '12 Hours', owner: 'AP Lead' }
        ],
        shortTerm: [
          { task: 'Update Odoo checkout logic to trigger hard-blocking rules on PO approval for any single single-role checkout above $200,000.', duration: '3 Days', owner: 'ERP Consultant' }
        ],
        longTerm: [
          { task: 'Conduct audit review training workshops for procurement and department heads on dual authorization mandates.', duration: '60 Days', owner: 'Internal Audit Committee' }
        ]
      };
    } else {
      plan = {
        title: 'Conventional Insurance Phased Exit Plan',
        targetFinding: 'FND-003: Commercial Fleet Insurance',
        immediate: [
          { task: 'Calculate early termination penalty of the conventional policy.', duration: '3 Days', owner: 'Procurement' }
        ],
        shortTerm: [
          { task: 'Issue Request for Proposals (RFP) to Islamic Takaful operators for vehicle fleet insurance matching identical coverages.', duration: '14 Days', owner: 'Logistics Manager' },
          { task: 'Review Takaful mutual pooling contracts for AAOIFI Standard No. 26 requirements.', duration: '20 Days', owner: 'Sharia Legal' }
        ],
        longTerm: [
          { task: 'Enforce master company mandate that restricts conventional risk-transfer operators from bidding in annual procurement cycles.', duration: '90 Days', owner: 'Executive Committee' }
        ]
      };
    }
    setGeneratedActionPlan(plan);
    onTriggerActivityLog('GENERATE_ACTION_PLAN', `Generated Compliance Action Plan for: "${plan.title}"`);
  };

  // Run knowledge search
  const triggerKnowledgeSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      let filtered = DEMO_KNOWLEDGE_DOCUMENTS;
      if (searchMode === 'keyword') {
        filtered = DEMO_KNOWLEDGE_DOCUMENTS.filter(doc =>
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.content.toLowerCase().includes(query.toLowerCase())
        );
      } else if (searchMode === 'standard') {
        filtered = DEMO_KNOWLEDGE_DOCUMENTS.filter(doc =>
          doc.standard.toLowerCase().includes(query.toLowerCase()) ||
          doc.title.toLowerCase().includes(query.toLowerCase())
        );
      } else if (searchMode === 'category') {
        filtered = DEMO_KNOWLEDGE_DOCUMENTS.filter(doc =>
          doc.category.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        // Mock semantic matching - assigning scores dynamically based on keyword overlaps
        filtered = DEMO_KNOWLEDGE_DOCUMENTS.map(doc => {
          let score = 30; // base score
          const terms = query.toLowerCase().split(' ');
          terms.forEach(term => {
            if (doc.title.toLowerCase().includes(term)) score += 20;
            if (doc.content.toLowerCase().includes(term)) score += 15;
            if (doc.section.toLowerCase().includes(term)) score += 10;
          });
          return { ...doc, score: Math.min(score, 99) };
        }).sort((a, b) => (b.score || 0) - (a.score || 0));
      }
      setRagSearchResults(filtered);
      setIsSearching(false);
      onTriggerActivityLog('KNOWLEDGE_SEARCH', `Executed ${searchMode} search for query: "${query}"`);
    }, 600);
  };

  // Run Interactive RAG Simulation
  const handleInteractiveRag = () => {
    if (!interactiveRagQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      // Find matches
      const query = interactiveRagQuery.toLowerCase();
      let matchedDoc = DEMO_KNOWLEDGE_DOCUMENTS[0]; // fallback
      let highestOverlap = 0;
      
      DEMO_KNOWLEDGE_DOCUMENTS.forEach(doc => {
        let overlap = 0;
        interactiveRagQuery.toLowerCase().split(' ').forEach(w => {
          if (doc.title.toLowerCase().includes(w) || doc.content.toLowerCase().includes(w)) {
            overlap++;
          }
        });
        if (overlap > highestOverlap) {
          highestOverlap = overlap;
          matchedDoc = doc;
        }
      });

      const relevance = highestOverlap > 0 ? Math.min(85 + highestOverlap * 4, 99) : 65;

      const responseText = matchedDoc.id === 'KDOC-001'
        ? "AI Agent has confirmed that compound penalty charges on Odoo invoices represent a severe breach. According to AAOIFI Standard No. 8, late payment fees are only permitted if fully directed into the charity purification ledger."
        : matchedDoc.id === 'KDOC-002'
        ? "The RAG system retrieved AAOIFI No. 9 which states that lease rentals must remain independent from ownership transfers. Ensure you use a separate unilateral Promise (Wa'ad) contract instead of automatic deed assignment."
        : `Using context from ${matchedDoc.title}: ${matchedDoc.content}`;

      setInteractiveRagResult({
        answer: responseText,
        steps: [
          `1. Normalized query to token sequences: ["${interactiveRagQuery.split(' ').slice(0, 3).join('", "')}"]`,
          `2. Searched Vector Store & identified top candidate document: ${matchedDoc.title}`,
          `3. Extracted relevant section: "${matchedDoc.section}" with relevance score of ${relevance}%`,
          `4. Injected chunk context into LLM system prompt template`,
          `5. Synthesized verified answer with rigorous source references`
        ],
        sources: [
          { title: matchedDoc.title, section: matchedDoc.section, relevance }
        ]
      });

      // Save to logs
      const newRetLog: KnowledgeRetrievalLog = {
        id: `RTL-${Date.now()}`,
        query: interactiveRagQuery,
        documentsRetrieved: [
          { title: matchedDoc.title, section: matchedDoc.section, relevance }
        ],
        relevanceScores: relevance,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setRetrievalLogs([newRetLog, ...retrievalLogs]);
      setIsSearching(false);
      onTriggerActivityLog('RAG_RETRIEVAL', `Processed active RAG query: "${interactiveRagQuery}"`);
    }, 800);
  };

  // Dynamic Rule Execution Simulator (Requirement 8)
  const handleExecuteSandboxRule = () => {
    setIsSandboxExecuting(true);
    setTimeout(() => {
      let isViolation = false;
      let title = '';
      let desc = '';
      let appliedRule = '';
      let stdRef = '';
      let recommendation = '';
      let confidence = 95;

      if (selectedTxType === 'invoice') {
        if (sandboxContractClause.toLowerCase().includes('compound') || sandboxContractClause.toLowerCase().includes('interest') || sandboxContractClause.toLowerCase().includes('penalty')) {
          isViolation = true;
          title = 'Compounding Interest Penalty Violation';
          desc = 'The contract clause specifies compounding penalty values for payment delays which breaches direct riba bans.';
          appliedRule = 'Compound Penalty Check';
          stdRef = 'AAOIFI Standard No. 8';
          recommendation = 'Amend late deterrent terminology. Force 100% of delay fees into the purification charity account.';
        }
      } else if (selectedTxType === 'purchase') {
        if (sandboxAmount > 200000) {
          isViolation = true;
          title = 'Single Signature SOP Violation';
          desc = `Purchase order size of $${sandboxAmount.toLocaleString()} exceeds the $200,000 threshold. Validated audit signatures detected: 1. Required: 2.`;
          appliedRule = 'Dual Authorization Limit';
          stdRef = 'SOP Procurement Controls (SOP-PROC-04)';
          recommendation = 'Suspend the SAP payment release. Route secondary approval request to VP of Finance.';
        }
      } else if (selectedTxType === 'investment') {
        isViolation = true;
        title = 'Impure Liquidity Investment';
        desc = 'Liquidity accounts transferred funds into a guaranteed 5.2% yield bond which generates illicit riba proceeds.';
        appliedRule = 'Takaful Insurance Validation';
        stdRef = 'ICAP Corporate Investment Policy (Clause 6.1)';
        recommendation = 'Liquidate the conventional paper immediately. Transfer profits to purification charity.';
      } else if (selectedTxType === 'musharaka') {
        if (sandboxContractClause.toLowerCase().includes('guarantees') || sandboxContractClause.toLowerCase().includes('restitution')) {
          isViolation = true;
          title = 'Capital Guarantee in Musharaka';
          desc = 'Contract terms attempt to warrant 100% safety of principal assets which contradicts Sharia risk-sharing principles.';
          appliedRule = 'Musharaka Capital Protection Check';
          stdRef = 'AAOIFI Standard No. 12';
          recommendation = 'Strip out the guarantee terms. Re-author Musharaka contract as variable risk-sharing.';
        }
      }

      setSandboxResult({
        compliant: !isViolation,
        finding: isViolation ? {
          title,
          desc,
          appliedRule,
          stdRef,
          recommendation,
          confidence
        } : null,
        steps: [
          'Step 1: Parse input transaction attributes & clauses',
          `Step 2: Scanned ${complianceRules.length} compiled active rules`,
          isViolation ? `Step 3: Triggered rule mismatch on: [${appliedRule}]` : 'Step 3: All active rule conditions passed safely',
          isViolation ? `Step 4: Retrieved standard reference: ${stdRef}` : 'Step 4: No non-compliance structures generated',
          isViolation ? 'Step 5: Formulated action recommendations' : 'Step 5: Finalized transaction status'
        ]
      });

      // If violation, append a temporary reasoning log to store transparency
      if (isViolation) {
        const newReasoningLog: AiReasoningLog = {
          id: `LOG-${Date.now()}`,
          analysisId: 'job-custom',
          title: `Sandbox Run: ${title}`,
          input: { id: `TX-SAND-${Date.now().toString().slice(-4)}`, type: 'Sandbox Transaction', details: sandboxContractClause, amount: sandboxAmount },
          knowledgeUsed: [{ source: stdRef, section: 'Active section check', text: desc }],
          appliedRules: [appliedRule],
          reasoning: [
            'Parsed mock playground telemetry',
            `Executed compiled system rule matching condition`,
            `Derived compliance violation with score ${confidence}%`
          ],
          result: 'Compliance issue detected',
          confidenceScore: confidence,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        setAiReasoningLogs(prev => [newReasoningLog, ...prev]);
      }

      setIsSandboxExecuting(false);
      onTriggerActivityLog('SANDBOX_RUN', `Executed Dry-run sandbox check for type: "${selectedTxType}"`);
    }, 900);
  };

  // Add rule handler
  const handleAddNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.description || !newRule.action) return;

    const added: ComplianceRule = {
      id: `RULE-${Date.now().toString().slice(-3)}`,
      name: newRule.name,
      description: newRule.description,
      source: newRule.source,
      condition: newRule.condition || 'Manual Evaluation',
      severity: newRule.severity,
      action: newRule.action,
      enabled: true
    };

    setComplianceRules([...complianceRules, added]);
    setShowAddRuleModal(false);
    setNewRule({
      name: '',
      description: '',
      source: 'AAOIFI',
      condition: '',
      severity: 'Medium',
      action: ''
    });

    onTriggerActivityLog('ADD_COMPLIANCE_RULE', `Configured new rule: "${added.name}"`);
  };

  // Feedback Learning Handlers (Requirement 12)
  const handleFeedbackSubmit = (logId: string, decision: 'Approve' | 'Reject' | 'Modify', text: string) => {
    const originalLog = aiReasoningLogs.find(l => l.id === logId);
    if (!originalLog) return;

    const newFeedback: AiFeedback = {
      id: `FDB-${Date.now()}`,
      aiResultId: logId,
      aiResult: originalLog.title + ' - ' + originalLog.result,
      humanDecision: decision,
      comments: text || 'Reviewed and validated.',
      reviewer: 'myflyai@gmail.com (Super Admin)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setFeedbackLogs([newFeedback, ...feedbackLogs]);
    onTriggerActivityLog('SUBMIT_AI_FEEDBACK', `Submitted human feedback [${decision}] for decision LOG ID: ${logId}`);
  };

  // Recommendations Action Handlers (Requirement 10)
  const handleUpdateRecStatus = (recId: string, newStatus: Recommendation['status']) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId) {
        return { ...rec, status: newStatus };
      }
      return rec;
    }));
    onTriggerActivityLog('UPDATE_REC_STATUS', `Updated recommendation: "${recId}" status to ${newStatus}`);
  };

  // Chat Copilot Handlers (Requirement 13 & 14)
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsCopilotTyping(true);

    setTimeout(() => {
      // Find matches from pre-configured conversations or fallback
      let matchedAnswer = isRTL
        ? 'عذراً، لم أعثر على تفاصيل دقيقة لهذا الاستفسار في دليل الامتثال الشرعي الخاص بالمنصة. يرجى توجيه السؤال بما يتعلق بفواتير المعاملات أو نسب الفائدة أو معايير أيوفي.'
        : 'I could not find an exact match for this question in our current compliance database. Please ask about Murabaha sequence, late penalties, Zakat rules, or specific transaction logs.';

      const lowercaseText = text.toLowerCase();
      const match = COPILOT_CONVERSATIONS.find(conv => {
        const keywords = conv.question.toLowerCase().replace('?', '').split(' ');
        // Check if multiple key terms are included
        const matchesCount = keywords.filter(w => lowercaseText.includes(w) && w.length > 3).length;
        return matchesCount >= 2 || lowercaseText.includes(conv.question.toLowerCase().replace('?', ''));
      });

      if (match) {
        matchedAnswer = match.answer;
      } else {
        // Special reactive logic
        if (lowercaseText.includes('audit') || lowercaseText.includes('approval')) {
          matchedAnswer = "Audit checks require secondary VP validation for any purchase exceeding $200k (SOP-PROC-04). For investment transactions, dual sign-off safeguards prevent credit risk anomalies.";
        } else if (lowercaseText.includes('interest') || lowercaseText.includes('riba') || lowercaseText.includes('penalty')) {
          matchedAnswer = "Compounded late payment fees are forbidden. AAOIFI Standard No. 8 states late penalty charges must be transferred 100% to a charity purification ledger and cannot enter operational revenue.";
        } else if (lowercaseText.includes('takaful') || lowercaseText.includes('insurance')) {
          matchedAnswer = "Conventional commercial insurance is non-compliant because of premium uncertainty. All corporate fleet or asset insurance contracts must migrate to mutual Islamic Takaful cooperatives under AAOIFI No. 26.";
        }
      }

      const aiMsg = {
        sender: 'ai' as const,
        text: matchedAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsCopilotTyping(false);
      onTriggerActivityLog('COPILOT_CHAT', `Asked AI Copilot: "${text.substring(0, 40)}..."`);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Cpu className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز الاستدلال والمنطق الذكي' : 'AI Reasoning Center'}
                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/20">
                  RAG Core v2.0
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL 
                  ? 'محرك ذكاء متطور يضمن موثوقية قرارات المساعدين الرقميين ويوفر مرجعية كاملة للتنبؤات الشرعية والمالية.' 
                  : 'Advanced reasoning layer ensuring Digital Agent reliability. Trace every output to source standards, rules, and raw evidence.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Tenant ID: org-icap-demo</span>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {[
            { id: 'rag', name: isRTL ? 'استرجاع المعرفة (RAG)' : 'Knowledge Retrieval', icon: BookOpen },
            { id: 'mapping', name: isRTL ? 'خريطة المعايير الشرعية' : 'Standard Mapping', icon: Scale },
            { id: 'rules', name: isRTL ? 'محرك قواعد الامتثال' : 'Compliance Rules Engine', icon: Sliders },
            { id: 'logs', name: isRTL ? 'سجلات الاستدلال والمنطق' : 'AI Reasoning Logs', icon: Terminal },
            { id: 'recommendations', name: isRTL ? 'التوصيات وخطط العمل' : 'Recommendation Engine', icon: CheckSquare },
            { id: 'copilot', name: isRTL ? 'المساعد التفاعلي والتعلم' : 'Compliance Copilot', icon: MessageSquare }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
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

      {/* 2. TAB CONTENT VIEWPORTS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >

          {/* ====================================================
              SUB-TAB 1: RAG & KNOWLEDGE SEARCH (Req 2, 3 & 4)
              ==================================================== */}
          {activeSubTab === 'rag' && (
            <div className="space-y-6">
              {/* Intelligent Search Header */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-500" />
                  {isRTL ? 'محرك البحث المعرفي الذكي والـ RAG' : 'Intelligent RAG & Knowledge Search'}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  <div className="lg:col-span-2 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isRTL ? 'مثال: معايير أيوفي لغرامات التأخير...' : 'Search AAOIFI, corporate policy chunks, and SOPs...'}
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500"
                    />
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div>
                    <select
                      value={searchMode}
                      onChange={(e: any) => setSearchMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500"
                    >
                      <option value="semantic">{isRTL ? 'بحث دلالي (Semantic)' : 'Semantic Search'}</option>
                      <option value="keyword">{isRTL ? 'بحث بالكلمات المفتاحية' : 'Keyword Match'}</option>
                      <option value="standard">{isRTL ? 'حسب المعيار الشرعي' : 'Standard Reference'}</option>
                      <option value="category">{isRTL ? 'تصنيف الوثيقة' : 'Category Category'}</option>
                    </select>
                  </div>

                  <button
                    onClick={() => triggerKnowledgeSearch(searchQuery)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isRTL ? 'بحث في قاعدة المعرفة' : 'Query Knowledge Base'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Displaying Search Results with Relevance Scores (Requirement 4) */}
                {ragSearchResults.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">{isRTL ? 'الوثائق المسترجعة ذات الصلة:' : 'Retrieved Relevant Segments:'}</span>
                      <button onClick={() => setRagSearchResults([])} className="text-[10px] text-slate-400 hover:text-slate-200">{isRTL ? 'مسح النتائج' : 'Clear results'}</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ragSearchResults.map((doc, idx) => {
                        const score = doc.score || (98 - idx * 6);
                        return (
                          <div key={doc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-2 relative overflow-hidden">
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                score >= 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {score}% {isRTL ? 'تطابق' : 'Match'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{doc.title}</span>
                            </div>
                            <p className="text-[10px] text-amber-600 font-mono">{doc.section}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{doc.content}"</p>
                            
                            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-dashed border-slate-200 dark:border-slate-800">
                              <span>Source Category: {doc.category}</span>
                              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                                <Check className="w-3 h-3" /> Verified Standard
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* RAG Workflow Playground (Requirement 2 & 3) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-amber-500" />
                      {isRTL ? 'محاكاة استعلام RAG المباشر' : 'Interactive RAG Pipeline Simulator'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isRTL 
                        ? 'اكتب سؤالك لتتبع كيف يسترد النظام السياق ويقوم بتقديم المستندات للهيئة الذكية قبل التنبؤ بالنتيجة.' 
                        : 'Type a custom question to visualize the dynamic retrieval pipeline, context extraction, and prompt synthesis stages.'}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          {isRTL ? 'السؤال المراد تحليله:' : 'Audit Question / Scenario:'}
                        </label>
                        <textarea
                          rows={3}
                          value={interactiveRagQuery}
                          onChange={(e) => setInteractiveRagQuery(e.target.value)}
                          placeholder={isRTL ? 'مثال: هل يمكن للموكل اشتراط عائد ثابت في عقد وكالة؟' : 'e.g., Can an investment agent guarantee a fixed 7% yield under Wakala?'}
                          className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        {[
                          "Wakala fixed guaranteed returns",
                          "Late payment penalty AAOIFI Standard No. 8",
                          "Purchase order over $200k SOP workflow"
                        ].map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInteractiveRagQuery(s)}
                            className="bg-slate-100 dark:bg-slate-800/40 hover:bg-emerald-500/10 hover:text-emerald-500 p-2 rounded-lg text-[10px] text-slate-400 font-mono truncate max-w-[150px]"
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleInteractiveRag}
                        disabled={!interactiveRagQuery}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{isRTL ? 'تغذية المساعد الذكي بالـ RAG' : 'Execute RAG Extraction'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vertical Step flowchart + Response display */}
                <div className="lg:col-span-7">
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm min-h-[380px] flex flex-col justify-between`}>
                    {!interactiveRagResult ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
                        <Activity className="w-10 h-10 text-slate-400 animate-pulse" />
                        <h5 className="text-xs font-bold text-slate-600 dark:text-slate-300">{isRTL ? 'بانتظار تشغيل المحاكاة' : 'Awaiting RAG Simulation'}</h5>
                        <p className="text-[11px] text-slate-500 max-w-sm">
                          {isRTL 
                            ? 'أدخل سيناريو أو اضغط على أحد الأسئلة المقترحة على اليسار لتتبع خريطة استخلاص المعرفة خطوة بخطوة.' 
                            : 'Select a query or write a prompt on the left to see the step-by-step contextual mapping pipeline.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <CheckSquare className="w-4 h-4" />
                            RAG Pipeline Executed Successfully
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Completed in 240ms</span>
                        </div>

                        {/* Pipeline Timeline Visualization */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Retrieval Process Trail:</span>
                          <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/20 ml-1">
                            {interactiveRagResult.steps.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Extracted Sources */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Extracted Knowledge Reference:</span>
                          {interactiveRagResult.sources.map((src, i) => (
                            <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{src.title}</p>
                                <p className="text-[10px] text-slate-400">{src.section}</p>
                              </div>
                              <span className="text-xs bg-emerald-500/10 text-emerald-500 font-mono px-2 py-0.5 rounded-full font-bold">
                                {src.relevance}% Relevance
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Synthesized Response */}
                        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-1 font-sans">
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase">
                            <Sparkles className="w-3.5 h-3.5" /> Synthesized Agent Response:
                          </div>
                          <p className="text-xs leading-relaxed">{interactiveRagResult.answer}</p>
                        </div>
                      </div>
                    )}

                    {/* Historical RAG Logs (Requirement 16 Database Table) */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                        Recent Logs [knowledgeRetrievalLogs Table]:
                      </span>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                        {retrievalLogs.map(log => (
                          <div key={log.id} className="flex items-center justify-between text-[10px] font-mono p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded transition">
                            <span className="text-slate-500 font-bold truncate max-w-xs">"{log.query}"</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-emerald-500 font-bold">{log.relevanceScores}% Score</span>
                              <span className="text-slate-400">{log.timestamp.slice(11, 19)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ====================================================
              SUB-TAB 2: STANDARD MAPPING & REFERENCE DATABASE (Req 5 & 6)
              ==================================================== */}
          {activeSubTab === 'mapping' && (
            <div className="space-y-6">
              {/* 5. Standard Mapping Engine Visualization */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-emerald-500" />
                      {isRTL ? 'محرك الربط التلقائي للمعايير' : 'Standard Mapping Engine'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL 
                        ? 'ربط مباشر وتلقائي بين الأنشطة التشغيلية ومتطلبات الامتثال، والمعايير الشرعية، والنتائج المستخرجة.'
                        : 'Tracks alignment of business transactions to regulatory and AAOIFI standards.'}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                    [standardMappings Table]
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-2">{isRTL ? 'النشاط التشغيلي' : 'Business Activity'}</th>
                        <th className="py-3 px-2">{isRTL ? 'متطلب الامتثال' : 'Compliance Requirement'}</th>
                        <th className="py-3 px-2">{isRTL ? 'المرجع الشرعي المعتمد' : 'Standard Reference'}</th>
                        <th className="py-3 px-2">{isRTL ? 'تصنيف القاعدة' : 'Category'}</th>
                        <th className="py-3 px-2">{isRTL ? 'رقم النتيجة المرتبطة' : 'Linked Finding'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                      {standardMappings.map((map) => (
                        <tr key={map.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition">
                          <td className="py-3 px-2 font-bold text-slate-800 dark:text-slate-200">{map.activity}</td>
                          <td className="py-3 px-2 font-mono text-[11px] text-amber-500">{map.rule}</td>
                          <td className="py-3 px-2 text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{map.standard}</span>
                            <span className="block text-[10px] text-slate-400">{map.section}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {map.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-mono text-[11px] text-red-500 font-bold">
                            {map.findingId || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Standard Reference Database browser */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-amber-500" />
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                    {isRTL ? 'المستودع المرجعي لمعايير AAOIFI والضوابط' : 'Standard Reference Database Browser'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEMO_KNOWLEDGE_DOCUMENTS.filter(doc => doc.category.includes('Core')).map((doc) => (
                    <div key={doc.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                            {doc.standard}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">{doc.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{doc.title}</h4>
                        <p className="text-[10px] text-amber-500 font-mono">{doc.section}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 italic">
                          "{doc.content}"
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-3 flex justify-between text-[10px] text-slate-400">
                        <span>Jurisdiction: AAOIFI Bahrain</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Immutable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* ====================================================
              SUB-TAB 3: COMPLIANCE RULE ENGINE & AI RULE EXECUTION (Req 7 & 8)
              ==================================================== */}
          {activeSubTab === 'rules' && (
            <div className="space-y-6">
              {/* Rules Configuration list */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-500" />
                      {isRTL ? 'قواعد الامتثال النشطة ومحرك المطابقة' : 'Active Compliance Rules Engine'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL 
                        ? 'تكوين وضبط القواعد التلقائية التي يستعين بها المدقق الذكي لفحص العمليات في Odoo/SAP.'
                        : 'Configure active boolean checking conditions linked to AI agents [complianceRules table].'}
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddRuleModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-2 shrink-0 self-start"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRTL ? 'إضافة قاعدة فحص جديدة' : 'Add Compliance Rule'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceRules.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-3 relative">
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          rule.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                          rule.severity === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {rule.severity}
                        </span>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={() => {
                              setComplianceRules(complianceRules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
                              onTriggerActivityLog('TOGGLE_RULE', `Toggled rule: "${rule.name}" to ${!rule.enabled ? 'Enabled' : 'Disabled'}`);
                            }}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{rule.source} SOURCE</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                          {rule.name}
                          <span className="text-[9px] text-slate-400 font-mono">({rule.id})</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rule.description}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 space-y-1 text-[11px] font-mono">
                        <div className="text-[10px] text-slate-500 font-bold">Rule Condition:</div>
                        <div className="text-amber-400">{rule.condition}</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">Rule Action:</div>
                        <div className="text-emerald-400">{rule.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. AI Rule Execution sandbox */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-emerald-500" />
                      {isRTL ? 'حقل محاكاة معالجة المعاملات (ERP Sandbox)' : 'Interactive ERP Transaction Simulator Sandbox'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL 
                        ? 'تغذية النظام بمعاملة عشوائية لمتابعة سلسلة التقييم: فرز البيانات -> تطبيق القواعد -> إخراج النتيجة والمقترحات.'
                        : 'Submit a mock transaction to test the rule pipeline: Input -> Rule Evaluation -> AI Reasoning -> Finding.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Controls card */}
                  <div className="lg:col-span-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sandbox Controls</span>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Transaction Type:</label>
                        <select
                          value={selectedTxType}
                          onChange={(e: any) => setSelectedTxType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                        >
                          <option value="invoice">ERP Customer Invoice</option>
                          <option value="purchase">Purchase Order</option>
                          <option value="investment">Treasury Bond Yields</option>
                          <option value="musharaka">Musharaka Partnership Draft</option>
                        </select>
                      </div>

                      {selectedTxType === 'purchase' && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Purchase Amount ($):</label>
                          <input
                            type="number"
                            value={sandboxAmount}
                            onChange={(e) => setSandboxAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      )}

                      {(selectedTxType === 'invoice' || selectedTxType === 'musharaka') && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1">Contract Clause Draft Text:</label>
                          <textarea
                            rows={3}
                            value={sandboxContractClause}
                            onChange={(e) => setSandboxContractClause(e.target.value)}
                            className="w-full p-3 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-mono"
                          />
                        </div>
                      )}

                      <button
                        onClick={handleExecuteSandboxRule}
                        disabled={isSandboxExecuting}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSandboxExecuting ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-yellow-300" />
                            <span>{isRTL ? 'تشغيل القواعد وتقييم المعاملة' : 'Dry Run AI Evaluation'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sandbox Outputs card */}
                  <div className="lg:col-span-7 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Sandbox Pipeline Output</span>
                      <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">READY</span>
                    </div>

                    {!sandboxResult ? (
                      <div className="flex flex-col items-center justify-center h-[220px] text-center text-slate-500 space-y-2">
                        <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                        <span>Awaiting input. Select parameters and click 'Dry Run AI Evaluation'.</span>
                      </div>
                    ) : (
                      <div className="space-y-4 font-mono text-xs">
                        {/* Process steps logs */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold block mb-1">Execution Steps:</span>
                          {sandboxResult.steps.map((st: string, idx: number) => (
                            <div key={idx} className="flex gap-2 text-slate-400 text-[11px]">
                              <span className="text-emerald-500 font-bold">&gt;</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>

                        {/* Finding display */}
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <span className="text-[9px] text-slate-500 font-bold block">Status Output:</span>
                          {sandboxResult.compliant ? (
                            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                              ✔ Transaction Compliant. No compliance rules triggered.
                            </div>
                          ) : (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 space-y-2">
                              <div className="font-bold flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                ⚠️ Non-Compliance Detected: {sandboxResult.finding.title}
                              </div>
                              <p className="text-[11px] text-slate-300">{sandboxResult.finding.desc}</p>
                              <div className="text-[10px] bg-slate-950 p-2 rounded text-amber-500 border border-slate-800">
                                <span className="font-bold text-slate-400">Standard:</span> {sandboxResult.finding.stdRef}
                                <span className="block font-bold text-slate-400 mt-1">Rule triggered:</span> {sandboxResult.finding.appliedRule}
                                <span className="block font-bold text-slate-400 mt-1">Recommendation:</span> {sandboxResult.finding.recommendation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ====================================================
              SUB-TAB 4: AI REASONING LOG (Req 9)
              ==================================================== */}
          {activeSubTab === 'logs' && (
            <div className="space-y-6">
              {/* Reasoning transparency log browser */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      {isRTL ? 'مكعب الشفافية: سجلات الاستدلال الكاملة' : 'AI Reasoning Log View'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL 
                        ? 'تتبع تفصيلي لكل قرار اتخذه المساعد الرقمي بما يضمن خلو النتائج من الانحياز.'
                        : 'Review step-by-step reasoning logic logs for each transaction checkout [aiReasoningLogs Table].'}
                    </p>
                  </div>
                  <span className="text-xs text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded font-bold font-mono">
                    Explainable AI
                  </span>
                </div>

                <div className="space-y-4">
                  {aiReasoningLogs.map((log) => (
                    <div key={log.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
                      {/* Top metadata row */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded font-bold">
                            {log.id}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{log.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                            {log.confidenceScore}%
                          </span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-400">{log.timestamp}</span>
                        </div>
                      </div>

                      {/* Input vs Applied Standard RAG connection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Input Payload Data</span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.input.type}: {log.input.id}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{log.input.details}"</p>
                          {log.input.amount && (
                            <p className="text-xs text-emerald-500 font-mono mt-1 font-bold">Amount: ${log.input.amount.toLocaleString()}</p>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Retrieved Knowledge Context</span>
                          {log.knowledgeUsed.map((k, i) => (
                            <div key={i} className="text-xs">
                              <p className="font-bold text-slate-800 dark:text-slate-200">{k.source} - {k.section}</p>
                              <p className="text-slate-500 dark:text-slate-400 italic text-[11px]">"{k.text}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Execution Steps Flowchart */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reasoning Evaluation Tree Steps:</span>
                        <div className="space-y-2">
                          {log.reasoning.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0 font-mono">
                                {idx + 1}
                              </div>
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Result Action Output */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">Generated Result:</span>
                          <span className="text-red-500 font-bold">{log.result}</span>
                        </div>

                        {/* Interaction: Provide Feedback button */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{isRTL ? 'هل النتيجة دقيقة؟' : 'Is this decision accurate?'}</span>
                          <button
                            onClick={() => handleFeedbackSubmit(log.id, 'Approve', 'Approved direct reasoning logic')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white transition cursor-pointer"
                            title="Approve AI Result"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedbackSubmit(log.id, 'Reject', 'Incorrectly evaluated parameter.')}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition cursor-pointer"
                            title="Reject AI Result"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* ====================================================
              SUB-TAB 5: AUTOMATED RECOMMENDATION ENGINE & ACTION PLANS (Req 10 & 11)
              ==================================================== */}
          {activeSubTab === 'recommendations' && (
            <div className="space-y-6">
              {/* 10. Automated Recommendations */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      {isRTL ? 'محرك التوصيات والتدابير التصحيحية' : 'Automated Recommendation Engine'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL 
                        ? 'إجراءات تصحيحية تلقائية ناتجة عن معالجة الثغرات والامتثال.'
                        : 'Active system corrective recommendations queue [recommendations Table].'}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    [recommendations Table]
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{rec.id}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            rec.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {rec.priority} Priority
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block">{rec.findingTitle}</span>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                            {rec.action}
                          </h4>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-850 space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Owner Assigned:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.owner}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Expected Outcome:</span>
                            <span className="text-slate-500 dark:text-slate-400 italic">"{rec.expectedOutcome}"</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Target Deadline:</span>
                            <span className="font-mono text-red-500 font-bold">{rec.deadline}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Status: <b className="text-emerald-500">{rec.status}</b></span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleUpdateRecStatus(rec.id, 'In Progress')}
                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Work
                          </button>
                          <button
                            onClick={() => handleUpdateRecStatus(rec.id, 'Completed')}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Solve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. AI Action Plan Generator wizard */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                    {isRTL ? 'مولد خطط العمل وتعديل السياسات ذهنياً' : 'AI Action Plan & Improvement Generator'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 space-y-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Select Gap Template</span>
                    <p className="text-xs text-slate-400">Choose an active compliance concern to generate a staged 3-tier action plan.</p>
                    
                    <div className="space-y-2">
                      {[
                        { id: 'late_penalty', name: 'Interest Penalty Fix', target: 'FND-001' },
                        { id: 'missing_approval', name: 'Dual Approval Policy Update', target: 'FND-002' },
                        { id: 'conventional_ins', name: 'Conventional Fleet Exit', target: 'FND-003' }
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleGenerateActionPlan(p.id as any)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition duration-150 cursor-pointer ${
                            selectedPlanTemplate === p.id
                              ? 'bg-emerald-600/10 text-emerald-500 border-emerald-500/40 font-bold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{p.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-bold">Target: {p.target}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleGenerateActionPlan(selectedPlanTemplate)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition mt-2 cursor-pointer"
                    >
                      Regenerate Action Plan
                    </button>
                  </div>

                  <div className="lg:col-span-8 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                    {generatedActionPlan ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <h4 className="text-xs font-bold text-slate-950 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            {generatedActionPlan.title}
                          </h4>
                          <span className="text-[10px] text-amber-500 font-mono">{generatedActionPlan.targetFinding}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* 1. Immediate */}
                          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 space-y-2">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">1. Immediate Actions</span>
                            {generatedActionPlan.immediate.map((item: any, i: number) => (
                              <div key={i} className="text-[11px] space-y-0.5">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">• {item.task}</p>
                                <p className="text-[9px] text-slate-400 font-mono pl-2">Timeline: {item.duration} | {item.owner}</p>
                              </div>
                            ))}
                          </div>

                          {/* 2. Short-term */}
                          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 space-y-2">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">2. Short-Term Actions</span>
                            {generatedActionPlan.shortTerm.map((item: any, i: number) => (
                              <div key={i} className="text-[11px] space-y-0.5">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">• {item.task}</p>
                                <p className="text-[9px] text-slate-400 font-mono pl-2">Timeline: {item.duration} | {item.owner}</p>
                              </div>
                            ))}
                          </div>

                          {/* 3. Long-term */}
                          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">3. Long-Term Strategy</span>
                            {generatedActionPlan.longTerm.map((item: any, i: number) => (
                              <div key={i} className="text-[11px] space-y-0.5">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">• {item.task}</p>
                                <p className="text-[9px] text-slate-400 font-mono pl-2">Timeline: {item.duration} | {item.owner}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                        <TrendingUp className="w-8 h-8 text-slate-400 animate-bounce" />
                        <span>Select a gap template on the left and trigger action plan generation.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ====================================================
              SUB-TAB 6: COMPLIANCE COPILOT & FEEDBACK LEARNING (Req 12, 13 & 14)
              ==================================================== */}
          {activeSubTab === 'copilot' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 13 & 14. Conversational Copilot Chat Interface */}
                <div className="lg:col-span-7">
                  <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between min-h-[500px]`}>
                    
                    <div className="space-y-4">
                      {/* Chat Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                            <Shield className="w-4 h-4 text-yellow-300" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">ICAP Copilot Assistant</h4>
                            <p className="text-[10px] text-slate-400">{isRTL ? 'متصل ومؤمن بالكامل بالمعرفة الشرعية' : 'Fully authenticated over compliance standards'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">RAG ENABLED</span>
                      </div>

                      {/* Chat Output Area */}
                      <div className="space-y-3 h-[280px] overflow-y-auto pr-1 text-xs">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-2xl max-w-[85%] space-y-1 ${
                              msg.sender === 'user'
                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/80 rounded-tl-none'
                            }`}>
                              <p className="whitespace-pre-line leading-relaxed text-[11.5px]">{msg.text}</p>
                              <span className="text-[8px] opacity-70 block text-right font-mono">{msg.timestamp}</span>
                            </div>
                          </div>
                        ))}
                        {isCopilotTyping && (
                          <div className="flex justify-start">
                            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200/40 dark:border-slate-800/80 rounded-tl-none flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chat Input Bar */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                          placeholder={isRTL ? 'اسأل المساعد الشرعي الذكي...' : 'Ask ICAP Copilot about findings or AAOIFI rule structures...'}
                          className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleSendMessage(chatInput)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 17. 10 Predefined Suggestion list */}
                <div className="lg:col-span-5 space-y-4">
                  <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      {isRTL ? 'الأسئلة المقترحة للامتثال الشرعي (معايير أيوفي)' : 'Suggested Sharia Compliance Prompts (AAOIFI)'}
                    </h5>

                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {COPILOT_CONVERSATIONS.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => handleSendMessage(conv.question)}
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-emerald-500/5 text-left text-[11px] text-slate-600 dark:text-slate-300 font-mono transition block truncate"
                          title={conv.question}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">{conv.id}.</span>
                            <span className="truncate">{conv.question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* 12. Feedback Learning Logs (Approved, Modified, Rejected) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                      {isRTL ? 'نظام تحسين وتغذية نموذج التعلم المعزز' : 'AI Feedback Learning System'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                    [aiFeedback Table]
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2 px-2">Decision Log ID</th>
                        <th className="py-2 px-2">Original AI Prediction</th>
                        <th className="py-2 px-2">Human Action</th>
                        <th className="py-2 px-2">Reviewer Feedback & Comments</th>
                        <th className="py-2 px-2">Reviewer</th>
                        <th className="py-2 px-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                      {feedbackLogs.map(feed => (
                        <tr key={feed.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition">
                          <td className="py-3 px-2 font-bold text-slate-500">{feed.aiResultId}</td>
                          <td className="py-3 px-2 text-slate-800 dark:text-slate-200 max-w-xs truncate">{feed.aiResult}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                              feed.humanDecision === 'Approve' ? 'bg-emerald-500/10 text-emerald-500' :
                              feed.humanDecision === 'Modify' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {feed.humanDecision}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-500 dark:text-slate-400 max-w-sm">"{feed.comments}"</td>
                          <td className="py-3 px-2 text-slate-400">{feed.reviewer}</td>
                          <td className="py-3 px-2 text-slate-400">{feed.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 15. Automated Review Templates Browser */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                    {isRTL ? 'قوالب التدقيق والتقييم الآلي المعتمدة' : 'AI Automated Review Templates'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map(tmpl => (
                    <div key={tmpl.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition space-y-3">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{tmpl.name}</h5>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold font-mono">
                          {tmpl.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">"{tmpl.description}"</p>
                      
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] space-y-1 font-mono text-slate-400">
                        <div className="flex justify-between">
                          <span>Agents Utilized:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">{tmpl.agents.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compiled Rules Checked:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">{tmpl.rules} Rules</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Primary Ingestion:</span>
                          <span className="text-slate-700 dark:text-slate-300 font-bold">{tmpl.source}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onTriggerActivityLog('LAUNCH_TEMPLATE', `Booted automated review template: "${tmpl.name}"`);
                          alert(`Successfully launched automated pipeline: ${tmpl.name}. Checks are queueing securely in the background.`);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-[10px] py-1.5 rounded-lg transition mt-2 cursor-pointer"
                      >
                        Launch Review Pipeline
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 18. Security Access controls logs (Requirement 18) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    Security Access Logs (Organization Data Isolation & Audit Trail)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-500">ISO-27001 ALIGNED</span>
                </div>
                
                <div className="space-y-2">
                  {securityLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center p-2.5 rounded bg-slate-950 border border-slate-900 text-[10.5px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${log.status === 'GRANTED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-slate-300 font-bold">{log.user}</span>
                        <span className="text-slate-500">({log.role})</span>
                        <span className="text-slate-400">accessed</span>
                        <span className="text-amber-500 font-bold">{log.resource}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{log.action}</span>
                        <span className="text-slate-500">|</span>
                        <span className={`${log.status === 'GRANTED' ? 'text-emerald-500' : 'text-red-500'} font-bold`}>{log.status}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
