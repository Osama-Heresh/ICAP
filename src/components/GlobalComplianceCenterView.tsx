import React, { useState, useMemo } from 'react';
import {
  Globe,
  Shield,
  FileText,
  BookOpen,
  Sliders,
  Database,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Info,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  GitBranch,
  Bell,
  Clock,
  Languages,
  DollarSign,
  FileSpreadsheet,
  Activity,
  Award,
  Upload,
  Check,
  Eye,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ========================================================
// DB ENTITY SCHEMAS & INTERFACES (Requirement 16)
// ========================================================
export interface Jurisdiction {
  id: string;
  country: string;
  region: string;
  regulators: string[];
  frameworks: string[];
  language: string;
  currency: string;
  reportingRequirements: string[];
  complianceScore: number;
  openFindingsCount: number;
  approvedByBoard: boolean;
}

export interface Standard {
  id: string;
  name: string;
  version: string;
  effectiveDate: string;
  category: 'AAOIFI' | 'IFSB' | 'National' | 'Customer Custom' | 'Internal Policies';
  country: string;
  sectionsCount: number;
  requirements: string[];
}

export interface FrameworkVersion {
  id: string;
  frameworkId: string;
  frameworkName: string;
  version: string;
  changes: string[];
  date: string;
  updatedBy: string;
}

export interface RegulatoryUpdate {
  id: string;
  source: string;
  change: string;
  impact: string;
  status: 'Pending Review' | 'Rules Updated' | 'Dismissed';
  date: string;
  affectedRules: string[];
}

export interface TranslationItem {
  id: string;
  language: 'Arabic' | 'English' | 'Malay' | 'Indonesian' | 'French' | 'Turkish';
  key: string;
  translatedText: string;
  category: 'Interface' | 'Report' | 'Certificate' | 'AI Response';
}

interface GlobalComplianceCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function GlobalComplianceCenterView({
  locale,
  theme,
  onTriggerActivityLog
}: GlobalComplianceCenterViewProps) {
  const isRTL = locale === 'ar';

  // State managers
  const [activeTab, setActiveTab] = useState<'jurisdictions' | 'standards' | 'frameworks' | 'countries' | 'localization' | 'updates' | 'comparison' | 'custom_framework' | 'db_extensions'>('jurisdictions');
  
  const [selectedCountry, setSelectedCountry] = useState<string>('Saudi Arabia');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ========================================================
  // DEMO DATA (Requirement 17)
  // ========================================================

  // 1. Jurisdictions (Saudi Arabia, UAE, Malaysia, Jordan, etc.)
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([
    {
      id: 'JUR-SA',
      country: 'Saudi Arabia',
      region: 'GCC / Middle East',
      regulators: ['Saudi Central Bank (SAMA)', 'Capital Market Authority (CMA)', 'Ministry of Finance'],
      frameworks: ['SAMA Sharia Governance Framework', 'AAOIFI Sharia Standards', 'IFSB Banking Risk Management'],
      language: 'Arabic / English',
      currency: 'SAR (Saudi Riyal)',
      reportingRequirements: ['Quarterly Sharia Audit Report', 'Annual Internal Sharia Governance Review', 'Product Portfolio Certification'],
      complianceScore: 98,
      openFindingsCount: 1,
      approvedByBoard: true
    },
    {
      id: 'JUR-AE',
      country: 'UAE',
      region: 'GCC / Middle East',
      regulators: ['Central Bank of the UAE (CBUAE)', 'Dubai Financial Services Authority (DFSA)', 'ADGM Financial Services Regulatory Authority'],
      frameworks: ['CBUAE Sharia Decision-Making Guidance', 'AAOIFI Accounting Standards', 'DFSA Islamic Finance Regulations'],
      language: 'Arabic / English',
      currency: 'AED (UAE Dirham)',
      reportingRequirements: ['Semi-Annual Sharia Board Minutes', 'Independent Third-Party Compliance Report', 'Wakala/Mudaraba Ratio Audits'],
      complianceScore: 96,
      openFindingsCount: 2,
      approvedByBoard: true
    },
    {
      id: 'JUR-MY',
      country: 'Malaysia',
      region: 'Southeast Asia',
      regulators: ['Bank Negara Malaysia (BNM)', 'Securities Commission Malaysia (SC)', 'Islamic Financial Services Board (IFSB)'],
      frameworks: ['BNM Shariah Governance Policy Document', 'IFSB Capital Adequacy Framework', 'SC Guidelines on Shariah Investment Funds'],
      language: 'Malay / English',
      currency: 'MYR (Malaysian Ringgit)',
      reportingRequirements: ['Annual Shariah Advisory Committee Report', 'Weekly Liquidity Ratios Filing', 'Continuous Takaful Solvency Return'],
      complianceScore: 95,
      openFindingsCount: 0,
      approvedByBoard: true
    },
    {
      id: 'JUR-JO',
      country: 'Jordan',
      region: 'Levant / Middle East',
      regulators: ['Central Bank of Jordan (CBJ)', 'Jordan Securities Commission (JSC)'],
      frameworks: ['CBJ Islamic Banking Guidelines', 'AAOIFI Standards Map', 'Local Sharia Auditing Standards'],
      language: 'Arabic',
      currency: 'JOD (Jordanian Dinar)',
      reportingRequirements: ['Annual Sharia Compliance Verification', 'Quarterly Murabaha Margin Review'],
      complianceScore: 92,
      openFindingsCount: 4,
      approvedByBoard: false
    }
  ]);

  // 2. Global Standards Repository (Requirement 3, 4, 5)
  const [standards, setStandards] = useState<Standard[]>([
    {
      id: 'STD-AAOIFI-01',
      name: 'AAOIFI Sharia Standard 8 (Murabaha to the Purchase Orderer)',
      version: '2026.1',
      effectiveDate: '2026-01-01',
      category: 'AAOIFI',
      country: 'Global / Multi-Jurisdictional',
      sectionsCount: 12,
      requirements: [
        'The financial institution must take possession (constructive or physical) of the asset before selling it to the client.',
        'Late payment compound interest is strictly prohibited; penalty fees must go to charitable accounts.',
        'The cost price and explicit markup margin must be separately stated to the purchase orderer.'
      ]
    },
    {
      id: 'STD-AAOIFI-02',
      name: 'AAOIFI Sharia Standard 12 (Sharika / Mudarabah Partnership)',
      version: '2025.3',
      effectiveDate: '2025-06-15',
      category: 'AAOIFI',
      country: 'Global',
      sectionsCount: 15,
      requirements: [
        'Profit distribution ratios must be determined upfront as a percentage of actual profit, not capital.',
        'Losses must be borne in proportion to the capital contribution unless caused by negligence.'
      ]
    },
    {
      id: 'STD-IFSB-15',
      name: 'IFSB-15: Capital Adequacy for Islamic Banking Windows',
      version: 'v4.0',
      effectiveDate: '2026-03-10',
      category: 'IFSB',
      country: 'Global',
      sectionsCount: 8,
      requirements: [
        'Designation of alpha factor for risk-sharing investment accounts to protect depositors.',
        'Explicit risk weight ratios applied to Murabaha and Ijarah real estate collateral pools.'
      ]
    },
    {
      id: 'STD-NAT-SAMA-01',
      name: 'SAMA Sharia Governance Standard Article 4',
      version: 'v2.1',
      effectiveDate: '2025-11-01',
      category: 'National',
      country: 'Saudi Arabia',
      sectionsCount: 6,
      requirements: [
        'Mandatory external Sharia review every two fiscal years by a licensed audit firm.',
        'Internal Sharia review department must report directly to the Board Audit Committee.'
      ]
    },
    {
      id: 'STD-CUST-CUSTOM',
      name: 'Al-Bilad Corporate Internal Sharia Charter',
      version: 'v2026.a',
      effectiveDate: '2026-02-14',
      category: 'Customer Custom',
      country: 'Internal',
      sectionsCount: 4,
      requirements: [
        'Total interest-bearing leverage of any counterparty must not exceed 25% (stricter than AAOIFI 33%).',
        'All corporate charity purifications must be dispatched before quarterly board alignments.'
      ]
    }
  ]);

  // 3. Framework Versions (Requirement 8 & 16)
  const [frameworkVersions, setFrameworkVersions] = useState<FrameworkVersion[]>([
    {
      id: 'VER-01',
      frameworkId: 'STD-AAOIFI-01',
      frameworkName: 'AAOIFI Murabaha Guidance',
      version: '2026.1',
      changes: [
        'Clarified rules on constructive possession of digitized real-estate tokens.',
        'Prohibited automatic re-scheduling markup hikes on late payments.'
      ],
      date: '2026-01-01',
      updatedBy: 'Sovereign AAOIFI Board Coordinator'
    },
    {
      id: 'VER-02',
      frameworkId: 'STD-IFSB-15',
      frameworkName: 'IFSB Capital Adequacy Framework',
      version: 'v4.0',
      changes: [
        'Updated risk weighting coefficients for cooperative real-estate mortgage structures.',
        'Clarified capital ratios under dual-currency digital liquidity operations.'
      ],
      date: '2026-03-10',
      updatedBy: 'IFSB Regulatory Technical Committee'
    }
  ]);

  // 4. Regulatory Updates Feed (Requirement 9 & 16 & 17)
  const [regulatoryUpdates, setRegulatoryUpdates] = useState<RegulatoryUpdate[]>([
    {
      id: 'UPD-101',
      source: 'Saudi Central Bank (SAMA)',
      change: 'Amended Rules for Consumer Murabaha Finance Contracts',
      impact: 'Limits absolute administrative fees to a maximum of 1% or SAR 5,000, whichever is lower.',
      status: 'Pending Review',
      date: '2026-07-10',
      affectedRules: ['SAMA-ADM-FEE-CAP', 'BANK-MURABAHA-ADMIN']
    },
    {
      id: 'UPD-102',
      source: 'Central Bank of the UAE (CBUAE)',
      change: 'Updated Unified Shari’ah Supervisory Board Charter',
      impact: 'Requires independent board members to certify high-value transactions above AED 50M.',
      status: 'Rules Updated',
      date: '2026-07-05',
      affectedRules: ['CBUAE-BOARD-THRESHOLD', 'BOARD-IND-CERT']
    },
    {
      id: 'UPD-103',
      source: 'Bank Negara Malaysia (BNM)',
      change: 'Licensing Guidelines on digital Sukuk Issuance',
      impact: 'Prescribes smart contract code audits prior to asset allocation to verify tangible asset backing.',
      status: 'Pending Review',
      date: '2026-07-01',
      affectedRules: ['MY-SUKUK-SMART-CODE', 'TANGIBLE-ASSET-AUDIT']
    },
    {
      id: 'UPD-104',
      source: 'AAOIFI Secretariat General',
      change: 'Clarification on Carbon Offset Sukuk Verification (Eco-Sukuk)',
      impact: 'Rulings for tracking underlying carbon offset certificates under real agency contracts.',
      status: 'Rules Updated',
      date: '2026-06-25',
      affectedRules: ['AAOIFI-ECO-SUKUK-RECOGNITION']
    },
    {
      id: 'UPD-105',
      source: 'Securities Commission Malaysia (SC)',
      change: 'Updated Shariah Screening Methodology for Equity Portfolios',
      impact: 'Lowered the threshold of allowable non-permissible interest income from 5% to 4.5% for high-tech indexes.',
      status: 'Pending Review',
      date: '2026-06-20',
      affectedRules: ['MY-SCREENING-NON-PERMISSIBLE', 'FUNDS-PURIFICATION-CALC']
    }
  ]);

  // 5. Database Schema Extensions inspector data (Requirement 16)
  const dbExtensionsList = [
    {
      tableName: 'jurisdictions',
      description: 'Stores state profiles, applicable regulators, local currencies, and composite compliance scores.',
      fields: [
        { name: 'country', type: 'varchar(100)', nullable: 'NO', key: 'PRIMARY' },
        { name: 'region', type: 'varchar(100)', nullable: 'YES', key: '' },
        { name: 'regulators', type: 'text (JSON array)', nullable: 'YES', key: '' },
        { name: 'frameworks', type: 'text (JSON array)', nullable: 'YES', key: '' },
        { name: 'compliance_score', type: 'integer', nullable: 'NO', key: '' }
      ],
      sampleRows: [
        { country: 'Saudi Arabia', region: 'GCC', regulators: '["SAMA", "CMA"]', frameworks: '["SAMA Governance"]', compliance_score: 98 },
        { country: 'UAE', region: 'GCC', regulators: '["CBUAE", "DFSA"]', frameworks: '["AAOIFI", "CBUAE Guidance"]', compliance_score: 96 }
      ]
    },
    {
      tableName: 'standards',
      description: 'Maintains AAOIFI, IFSB, and proprietary customer standards.',
      fields: [
        { name: 'id', type: 'varchar(50)', nullable: 'NO', key: 'PRIMARY' },
        { name: 'name', type: 'text', nullable: 'NO', key: '' },
        { name: 'version', type: 'varchar(20)', nullable: 'NO', key: '' },
        { name: 'country', type: 'varchar(100)', nullable: 'YES', key: '' },
        { name: 'requirements', type: 'text (JSON)', nullable: 'YES', key: '' }
      ],
      sampleRows: [
        { id: 'STD-AAOIFI-01', name: 'AAOIFI Murabaha', version: '2026.1', country: 'Global', requirements: '["Possession before sale", "No compound penalty"]' }
      ]
    },
    {
      tableName: 'framework_versions',
      description: 'Maintains audit-ready version history of legal frameworks with delta summaries.',
      fields: [
        { name: 'framework_id', type: 'varchar(50)', nullable: 'NO', key: 'FOREIGN KEY' },
        { name: 'version', type: 'varchar(20)', nullable: 'NO', key: '' },
        { name: 'changes', type: 'text (JSON)', nullable: 'YES', key: '' },
        { name: 'date', type: 'date', nullable: 'NO', key: '' }
      ],
      sampleRows: [
        { framework_id: 'STD-AAOIFI-01', version: '2026.1', changes: '["Tokenized possession update"]', date: '2026-01-01' }
      ]
    },
    {
      tableName: 'regulatory_updates',
      description: 'Holds detected legislative alerts sourced via SAMA, CBUAE, or AAOIFI feeds.',
      fields: [
        { name: 'id', type: 'varchar(50)', nullable: 'NO', key: 'PRIMARY' },
        { name: 'source', type: 'varchar(100)', nullable: 'NO', key: '' },
        { name: 'change_summary', type: 'text', nullable: 'NO', key: '' },
        { name: 'impact_assessment', type: 'text', nullable: 'YES', key: '' },
        { name: 'status', type: 'varchar(30)', nullable: 'NO', key: '' }
      ],
      sampleRows: [
        { id: 'UPD-101', source: 'SAMA', change_summary: 'Consumer Fee limits', impact_assessment: 'Admin fees must drop to 1%', status: 'Pending Review' }
      ]
    }
  ];

  // Translations Database representing multi-language localization dictionary (Requirement 12 & 16)
  const [translations, setTranslations] = useState<TranslationItem[]>([
    { id: 'TR-1', language: 'Arabic', key: 'COMPLIANCE_PASSED', translatedText: 'تم اجتياز التدقيق والامتثال', category: 'Interface' },
    { id: 'TR-2', language: 'Arabic', key: 'ASSET_OWNERSHIP_RULE', translatedText: 'اشتراط ملكية السلعة قبل البيع', category: 'Report' },
    { id: 'TR-3', language: 'Malay', key: 'COMPLIANCE_PASSED', translatedText: 'Pematuhan Diluluskan', category: 'Interface' },
    { id: 'TR-4', language: 'Turkish', key: 'CERTIFICATE_TITLE', translatedText: 'Katılım Finans Uyum Sertifikası', category: 'Certificate' },
    { id: 'TR-5', language: 'Indonesian', key: 'COMPLIANCE_SCORE', translatedText: 'Skor Kepatuhan Syariah', category: 'Report' },
    { id: 'TR-6', language: 'French', key: 'GOVERNANCE_AUDIT', translatedText: 'Audit de Gouvernance Islamique', category: 'Report' }
  ]);

  // ========================================================
  // INTERACTIVE LOCALIZATION SETTINGS (Requirement 12 & 13)
  // ========================================================
  const [selectedLanguage, setSelectedLanguage] = useState<'Arabic' | 'English' | 'Malay' | 'Indonesian' | 'French' | 'Turkish'>('English');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('SAR');
  const [selectedDateFormat, setSelectedDateFormat] = useState<string>('YYYY-MM-DD');
  const [selectedLegalTerminology, setSelectedLegalTerminology] = useState<'AAOIFI' | 'SAMA' | 'BNM' | 'CBUAE'>('AAOIFI');

  // ========================================================
  // INTERACTIVE REGULATORY UPDATE WORKFLOW (Requirement 9)
  // ========================================================
  const handleUpdateStatus = (updateId: string, nextStatus: 'Rules Updated' | 'Dismissed') => {
    setRegulatoryUpdates(prev => prev.map(u => {
      if (u.id === updateId) {
        onTriggerActivityLog('PROCESS_REGULATORY_UPDATE', `Actioned update ${u.id} into status: ${nextStatus}. Affected rules notified.`);
        triggerToast(`Regulatory Update successfully updated to: ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // ========================================================
  // FRAMEWORK COMPARISON ENGINE STATE & RESULTS (Requirement 10)
  // ========================================================
  const [comparisonCountryA, setComparisonCountryA] = useState<string>('Saudi Arabia');
  const [comparisonCountryB, setComparisonCountryB] = useState<string>('UAE');

  const comparisonResult = useMemo(() => {
    if (comparisonCountryA === comparisonCountryB) {
      return {
        similar: ['All regulatory mandates match (Same jurisdiction comparison)'],
        differences: [],
        additional: [],
        impact: 'Identical profiles.'
      };
    }

    // Interactive comparative metrics generator based on pairs
    if (
      (comparisonCountryA === 'Saudi Arabia' && comparisonCountryB === 'UAE') ||
      (comparisonCountryA === 'UAE' && comparisonCountryB === 'Saudi Arabia')
    ) {
      return {
        similar: [
          'AAOIFI Sharia principles mapped for basic wholesale commercial contracts.',
          'Mandatory internal Sharia review committee directly aligned with the Board.'
        ],
        differences: [
          'Saudi SAMA strictly mandates an external Sharia audit every two fiscal years; UAE CBUAE permits a risk-based three-year rolling internal cycle.',
          'UAE CBUAE requires direct validation and minute-filings of all high-value corporate treasury transactions exceeding AED 50M.'
        ],
        additional: [
          'SAMA dictates consumer administrative markup limits capped at SAR 5,000 flat.',
          'CBUAE mandates explicit separate liquidity buffers for Islamic corporate windows.'
        ],
        impact: 'High alignment on primary commercial law, but requires unique dual-reporting streams. Use Saudi Report template and UAE Treasury logs parallelly.'
      };
    }

    if (
      (comparisonCountryA === 'Saudi Arabia' && comparisonCountryB === 'Malaysia') ||
      (comparisonCountryA === 'Malaysia' && comparisonCountryB === 'Saudi Arabia')
    ) {
      return {
        similar: [
          'Basic asset-backing and cost-plus (Murabaha) margin structures are monitored.',
          'Strict segregation of participant vs shareholder funds.'
        ],
        differences: [
          'Malaysia BNM operates a legislative, court-enforced Shariah governance court ruling model; Saudi relies on SAMA central board arbitration.',
          'Malaysia SC includes dynamic 4.5% non-permissible tech stock screening tolerances; SAMA references standard AAOIFI 5% margin screening.'
        ],
        additional: [
          'Malaysia mandates certified Shariah officers within operations teams.',
          'Saudi SAMA mandates double audit layers (Internal & external parallel verification).'
        ],
        impact: 'Structural governance models differ heavily (Central Board-enforced legislative vs Centralized Bank-supervised model). Significant impact on corporate legal structure.'
      };
    }

    // Default comparative output
    return {
      similar: ['Cooperative risk sharing principles', 'Prohibition of compound interest-bearing models'],
      differences: ['Reporting timelines', 'Sovereign dispute escalation pathways'],
      additional: ['Regional disclosure caps', 'Filing language settings'],
      impact: 'Moderate differences in secondary operational parameters. Highly compatible core rulesets.'
    };
  }, [comparisonCountryA, comparisonCountryB]);

  // ========================================================
  // REGULATORY INTELLIGENCE AI INTERACTIVE CHAT (Requirement 11)
  // ========================================================
  const [aiInputMessage, setAiInputMessage] = useState<string>('Explain the impact of the latest SAMA administrative fee cap updates on my retail portfolio.');
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: 'user' | 'agent', text: string, date: string }>>([
    {
      sender: 'agent',
      text: 'Salam! I am the Global Regulatory Intelligence AI of ICAP. I monitor AAOIFI, IFSB, and sovereign central bank frameworks daily. Ask me to summarize changes, explain compliance impacts, or review a specific clause.',
      date: '17:12:00'
    }
  ]);
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);

  const handleSendAiMessage = () => {
    if (!aiInputMessage.trim()) return;
    const userMsg = aiInputMessage;
    setAiChatLogs(prev => [...prev, { sender: 'user', text: userMsg, date: new Date().toLocaleTimeString() }]);
    setAiInputMessage('');
    setAiIsAnalyzing(true);

    onTriggerActivityLog('CONSULT_REGULATORY_INTEL_AI', `Queried Regulatory AI: "${userMsg}"`);

    // Simulate smart analysis payload response
    setTimeout(() => {
      setAiIsAnalyzing(false);
      let aiResponseText = '';

      if (userMsg.toLowerCase().includes('sama') || userMsg.toLowerCase().includes('administrative') || userMsg.toLowerCase().includes('fee')) {
        aiResponseText = `Based on SAMA Amendment (Ref: UPD-101), consumer Murabaha contract administrative fees are now capped at 1% of transaction volume or SAR 5,000 max. 
Impact on your system:
1. Affected Rule: SAMA-ADM-FEE-CAP will trigger findings on any automated contracts exceeding SAR 5,000.
2. Recommended Action: Update your ERP integration (Mambu/SAP) pricing rules to hard-cap administrative ledger items at SAR 5,000.`;
      } else if (userMsg.toLowerCase().includes('aaoifi') || userMsg.toLowerCase().includes('murabaha')) {
        aiResponseText = `AAOIFI Standard 8 states that constructive or physical possession (Qabd) of the asset must precede the sale to the purchaser.
Impact:
1. Trigger AI checks on document sequences (Contract of Purchase vs. Bill of Lading vs. Murabaha Sale Contract).
2. Ensure timestamps maintain a minimum 1-second physical gap in the blockchain or core database.`;
      } else if (userMsg.toLowerCase().includes('malaysia') || userMsg.toLowerCase().includes('bnm')) {
        aiResponseText = `Under BNM Shariah Governance Framework, non-compliant income must be completely purged from the core accounts and transferred to a certified charity account within 30 days of discovery. Failure to do so results in statutory administrative warnings.`;
      } else {
        aiResponseText = `I have processed your query. Under multi-country guidelines, your operations in GCC and ASEAN regions match 92% of core AAOIFI standard frameworks. To guarantee 100% compliance, verify the localized screening parameters for non-permissible cash investments and ensure all late-fee penalties are designated for charity purification.`;
      }

      setAiChatLogs(prev => [...prev, { sender: 'agent', text: aiResponseText, date: new Date().toLocaleTimeString() }]);
    }, 1500);
  };

  // ========================================================
  // CUSTOMER STANDARDS UPLOAD & RULES CONVERSION (Requirement 7)
  // ========================================================
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadProgressStep, setUploadProgressStep] = useState<'idle' | 'uploading' | 'extracted' | 'converted'>('idle');
  const [extractedStandardData, setExtractedStandardData] = useState<any | null>(null);

  const handleSimulateDocumentUpload = (fileName: string) => {
    setUploadedFileName(fileName);
    setUploadProgressStep('uploading');
    onTriggerActivityLog('UPLOAD_CUSTOM_SHARIA_CHARTER', `User uploaded custom document: ${fileName}`);

    setTimeout(() => {
      setUploadProgressStep('extracted');
      setExtractedStandardData({
        title: fileName.replace('.pdf', '').replace('.txt', '') + ' Verified Policy',
        detectedRules: [
          'No transaction allowed with companies whose liquid investments exceed 30% of total assets.',
          'All Mudarabah investments must require monthly audited accounting logs.',
          'Late payment fees are fixed at SAR 250 flat with no compounding multipliers.'
        ]
      });
      triggerToast('AI Document analysis completed successfully!');
    }, 2000);
  };

  const handleApproveAndActivateRules = () => {
    if (!extractedStandardData) return;
    
    // Add custom standard dynamically
    const newStd: Standard = {
      id: 'STD-CUSTOM-' + Math.floor(Math.random() * 1000),
      name: extractedStandardData.title,
      version: '1.0 (AI Extracted)',
      effectiveDate: new Date().toISOString().split('T')[0],
      category: 'Customer Custom',
      country: 'Internal',
      sectionsCount: extractedStandardData.detectedRules.length,
      requirements: extractedStandardData.detectedRules
    };

    setStandards([newStd, ...standards]);
    setUploadProgressStep('converted');
    onTriggerActivityLog('ACTIVATE_AI_EXTRACTED_RULES', `Approved and converted uploaded policy into active standards engine rules.`);
    triggerToast('Active compliance rules generated from custom policy document!');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP NAV / BANNER WITH COMMAND CENTER STYLE */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
              <Globe className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز الامتثال العالمي للتشريعات' : 'ICAP Global Compliance Center'}
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-sans border border-emerald-500/15">
                  {isRTL ? 'متعدد الولاية القضائية' : 'Multi-Jurisdiction Hub'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL
                  ? 'إدارة المعايير العالمية (AAOIFI, IFSB)، الأطر الوطنية، وسياسات العملاء وتوطين الأنظمة لكل بلد تشغيلي.'
                  : 'Orchestrate global Sharia regulations (AAOIFI, IFSB), national guidelines (SAMA, CBUAE, BNM), and local corporate policies dynamically.'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Compliance Menu Navigation (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150/40 dark:border-slate-800/80 pt-4">
          {[
            { id: 'jurisdictions', name: isRTL ? 'إدارة السلطات القضائية' : 'Jurisdictions Command', icon: Globe },
            { id: 'standards', name: isRTL ? 'مكتبة المعايير العالمية' : 'Standards Library', icon: BookOpen },
            { id: 'frameworks', name: isRTL ? 'أطر العمل والذكاء الاصطناعي' : 'Framework Mappings', icon: Sliders },
            { id: 'comparison', name: isRTL ? 'أداة مقارنة التشريعات' : 'Framework Comparison', icon: GitBranch },
            { id: 'custom_framework', name: isRTL ? 'رفع سياسة مخصصة' : 'Customer Custom upload', icon: Upload },
            { id: 'updates', name: isRTL ? 'محرك التحديثات الفورية' : 'Regulatory Updates Feed', icon: Bell },
            { id: 'localization', name: isRTL ? 'التوطين واللغات' : 'Localization Settings', icon: Languages },
            { id: 'db_extensions', name: isRTL ? 'مفتش قاعدة البيانات' : 'Database Schema', icon: Database }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm'
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

      {/* ========================================================
          PAGE 1: JURISDICTION MANAGEMENT (Requirement 2 & 15 & 18)
          ======================================================== */}
      {activeTab === 'jurisdictions' && (
        <div className="space-y-6">
          
          {/* Stylized World Map Component representing global authority */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              {isRTL ? 'خريطة مراكز التمويل الإسلامي النشطة' : 'Interactive Sharia Finance Hubs & Compliance Scores'}
            </h3>
            
            {/* Clickable Map hubs wrapper */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jurisdictions.map((jur) => {
                const isSelected = selectedCountry === jur.country;
                return (
                  <button
                    key={jur.id}
                    onClick={() => setSelectedCountry(jur.country)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border-slate-150 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">{jur.region}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{jur.country}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${jur.complianceScore >= 95 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-500'}`}>
                        {jur.complianceScore}% Score
                      </span>
                    </div>

                    <div className="mt-4 w-full bg-slate-200/50 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${jur.complianceScore >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${jur.complianceScore}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Country Board Approval Profile & SAMA/CBUAE Specific Checklists */}
          {selectedCountry && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Jurisdiction Regulatory Metadata */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-amber-500" />
                      <span>{selectedCountry} {isRTL ? 'الملف التنظيمي والقضائي' : 'Regulatory Profile'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{isRTL ? 'الهيئات والمحددات الإقليمية المشتركة.' : 'Central banking regulators and sovereign compliance specifications.'}</p>
                  </div>
                  {jurisdictions.find(j => j.country === selectedCountry)?.approvedByBoard ? (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Board Approved
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      Pending Approvals
                    </span>
                  )}
                </div>

                {jurisdictions.filter(j => j.country === selectedCountry).map((jur) => (
                  <div key={jur.id} className="space-y-4 text-xs pt-2">
                    
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl space-y-2 border border-slate-150/40 dark:border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{isRTL ? 'الهيئات واللجان الرقابية الوطنية:' : 'Regulatory Bodies:'}</span>
                      <div className="flex flex-col gap-1.5">
                        {jur.regulators.map((reg, ri) => (
                          <div key={ri} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{reg}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{isRTL ? 'العملة الرسمية واللغة:' : 'Sovereign Currency & Languages:'}</span>
                      <div className="flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-mono font-bold text-amber-500">{jur.currency}</span>
                        <span className="text-slate-500 text-[11px]">{jur.language}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{isRTL ? 'متطلبات التقارير الدورية:' : 'Reporting Requirements:'}</span>
                      <div className="space-y-1.5">
                        {jur.reportingRequirements.map((rep, ri) => (
                          <div key={ri} className="p-2 bg-slate-50/30 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 rounded-xl text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{rep}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Jurisdiction Specific Audit Score Breakdown Card (Requirement 14 & 15) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Score breakdown metrics for country */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {selectedCountry} {isRTL ? 'تفصيل درجات الامتثال القضائي' : 'Compliance Score Breakdown Metrics'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRTL ? 'المحاذاة التنظيمية' : 'Regulatory Alignment'}</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">97%</span>
                        <span className="text-xs text-emerald-500 font-bold">Passed</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">AAOIFI standards mapped & checked</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRTL ? 'الامتثال للشرعية' : 'Sharia Compliance'}</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-bold font-display text-emerald-500">99%</span>
                        <span className="text-xs text-emerald-500 font-bold">Excellent</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">0 active late compounding penalties</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{isRTL ? 'إعداد التقارير والتدقيق' : 'Reporting & Audit'}</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">92%</span>
                        <span className="text-xs text-amber-500 font-bold">1 Alert</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Quarterly board minutes pending review</p>
                    </div>
                  </div>
                </div>

                {/* International Reporting Section (Requirement 14) */}
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        {isRTL ? 'مولد التقارير القضائية الفورية' : 'On-Demand International Compliance Reporting'}
                      </h4>
                      <p className="text-[11px] text-slate-400">{isRTL ? 'تحميل تقرير كامل معد للطباعة يتوافق مع قوانين البلد المختار.' : 'Generate a localized, regulator-ready sovereign review report containing verified digital evidence.'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        onTriggerActivityLog('GENERATE_REGIONAL_REPORT', `Generated unified Sharia Compliance Audit Report for ${selectedCountry}.`);
                        triggerToast(`Successfully generated official ${selectedCountry} Sharia Governance PDF report.`);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'تصدير التقرير الفوري' : `Export ${selectedCountry} Report`}</span>
                    </button>
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{isRTL ? 'محتويات وهيكل التقرير المستخرج:' : 'Included Framework Evidence Mapping:'}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Sovereign Regulator Code validation: <strong>PASSED</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Contract and transaction trace trails: <strong>1,245 Checked</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Board minute verification & disclosures</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Purification account balances & certified payouts</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          PAGE 2: STANDARDS LIBRARY (Requirement 3 & 4)
          ======================================================== */}
      {activeTab === 'standards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isRTL ? 'أمين مستندات المعايير العالمية والخاصة' : 'Global Standards Library & Repository'}
              </h3>
              <p className="text-xs text-slate-400">{isRTL ? 'قائمة مرجعية لجميع لوائح AAOIFI و IFSB والسياسات الداخلية للعميل.' : 'Unified repository displaying active versions, section requirements, and regional application.'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Standards list */}
            <div className="lg:col-span-2 space-y-4">
              {standards.map((std) => (
                <div 
                  key={std.id} 
                  className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-sm`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        std.category === 'AAOIFI' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        std.category === 'IFSB' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        std.category === 'National' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      }`}>
                        {std.category}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{std.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                      Version {std.version}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-b border-slate-100 dark:border-slate-800/60 pb-1">
                      <span>Effective Date: <strong>{std.effectiveDate}</strong></span>
                      <span>Jurisdiction: <strong>{std.country}</strong></span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{isRTL ? 'المحددات والمتطلبات البرمجية الأساسية:' : 'Core Requirements Extracted:'}</span>
                      {std.requirements.map((req, ri) => (
                        <div key={ri} className="flex gap-2 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/60 dark:border-slate-800/40 text-[11px]">
                          <span className="text-amber-500 shrink-0 font-bold">#{ri+1}</span>
                          <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Version control timelines sidebar (Requirement 8) */}
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                  {isRTL ? 'إدارة إصدارات الأطر التشريعية' : 'Standards Version Control & Timelines'}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isRTL ? 'متابعة تغيرات القواعد والفقرات عبر السنوات وإجراء التحقق التلقائي للنسخ القديمة.' : 'Track legislative changes, previous versions, delta summaries, and executive authorizer details.'}
                </p>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {frameworkVersions.map((v) => (
                    <div key={v.id} className="relative pl-6 space-y-1 text-xs">
                      <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full border-2 border-amber-500 bg-white dark:bg-slate-950 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      </div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white text-[11px]">{v.frameworkName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">v{v.version}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">{v.date} · {v.updatedBy}</p>
                      
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 mt-1">
                        <span className="font-bold block text-slate-400 uppercase text-[8px] mb-0.5">Deltas:</span>
                        {v.changes.map((c, ci) => (
                          <div key={ci} className="truncate">• {c}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 3: AAOIFI & IFSB DETAILED MAPPING (Requirement 4 & 5)
          ======================================================== */}
      {activeTab === 'frameworks' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500" />
                <span>{isRTL ? 'ربط المعايير بالقواعد البرمجية والوكلاء' : 'AAOIFI & IFSB Framework Active Mappings'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isRTL
                  ? 'ترجمة متطلبات AAOIFI النصية إلى قواعد تحقق برمجية، وتوجيه وكلاء الذكاء الاصطناعي لفحص السجلات التلقائية.'
                  : 'Witness the pipeline of mapping textual requirements into automated algorithmic rule layers executed by specialized neural agents.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4 text-xs">
              
              {/* Box 1: AAOIFI Standard */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-bold text-amber-500 uppercase">Step 1: Sharia Standard</span>
                <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/80 font-bold">
                  AAOIFI Sharia Standard 8 (Murabaha Article 2)
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Requires complete constructive possession of goods by the financier prior to executing Murabaha sales.
                </p>
              </div>

              {/* Arrow Column */}
              <div className="flex items-center justify-center p-2 lg:p-0">
                <div className="bg-amber-500/10 text-amber-600 p-2 rounded-full hidden lg:block">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs font-mono font-bold lg:hidden">↓ Mapped to Rule ↓</span>
              </div>

              {/* Box 2: Automated Compliance Rule */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-bold text-blue-500 uppercase">Step 2: Compliance Rule</span>
                <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/80 font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400">
                  RULE_MUR_OWNERSHIP_SEQUENCE
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Algorithmic trigger: Verify Bill of Lading timestamp is &lt; Customer Sale Invoice timestamp.
                </p>
              </div>

              {/* Arrow Column */}
              <div className="flex items-center justify-center p-2 lg:p-0">
                <div className="bg-amber-500/10 text-amber-600 p-2 rounded-full hidden lg:block">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <span className="text-slate-400 text-xs font-mono font-bold lg:hidden">↓ Triggered on AI Agent ↓</span>
              </div>

              {/* Box 3: Sharia AI Agent */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[9px] font-bold text-purple-500 uppercase">Step 3: Neural AI Agent</span>
                <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/80 font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Islamic Banking AI</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Deeply parses contracts, OCR bills, and ledger balances to establish bulletproof documentary compliance.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 4: JURISDICTION COMPARISON TOOL (Requirement 10)
          ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isRTL ? 'أداة مقارنة التشريعات الثنائية' : 'Cross-Border Framework Comparison Tool'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isRTL ? 'اختر بلدين لعرض أوجه التشابه والاختلاف ونسب التسامح المالي.' : 'Compare compliance profiles, regulatory alignments, and additional rulesets across sovereign jurisdictions.'}
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">{isRTL ? 'البلد الأساسي (A):' : 'Primary Jurisdiction (A):'}</label>
                <select
                  value={comparisonCountryA}
                  onChange={(e) => setComparisonCountryA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                >
                  {jurisdictions.map((j) => (
                    <option key={j.id} value={j.country}>{j.country}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">{isRTL ? 'بلد المقارنة (B):' : 'Comparison Jurisdiction (B):'}</label>
                <select
                  value={comparisonCountryB}
                  onChange={(e) => setComparisonCountryB(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                >
                  {jurisdictions.map((j) => (
                    <option key={j.id} value={j.country}>{j.country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 text-xs">
              
              {/* Similarities Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase tracking-wider">{isRTL ? 'المتطلبات المشتركة والمطابقة:' : 'Identical Requirements & Alignments:'}</span>
                <div className="space-y-2">
                  {comparisonResult.similar.map((sim, idx) => (
                    <div key={idx} className="flex gap-2 p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-100">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{sim}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differences Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">{isRTL ? 'أوجه الاختلاف والتباين:' : 'Identical Differences & Divergences:'}</span>
                <div className="space-y-2">
                  {comparisonResult.differences.map((dif, idx) => (
                    <div key={idx} className="flex gap-2 p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-100">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-400 text-[11px]">{dif}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact / Recommendations */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-3">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">{isRTL ? 'تحليل الأثر والتوصيات للشركات:' : 'Sovereign Impact & Action Guidance:'}</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-amber-500/10">
                  {comparisonResult.impact}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-150 dark:border-slate-800">
                  💡 Tip: Ensure your legal department checks currency-specific conversions if operating active credit portfolios in both regions simultaneously.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 5: CUSTOMER CUSTOM FRAMEWORK UPLOAD (Requirement 7)
          ======================================================== */}
      {activeTab === 'custom_framework' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Upload and status wizard */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>{isRTL ? 'رفع متطلبات الشريعة المخصصة' : 'Upload Proprietary Sharia Policies & Fatwas'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRTL ? 'قم برفع ميثاقك الداخلي أو الفتاوى الخاصة بمنتجاتك، وسيقوم الذكاء الاصطناعي باستخراج القواعد وصياغتها تلقائياً.' : 'Drag-and-drop your custom corporate Sharia manual, internal procedures, or board fatwas to generate active rules.'}
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition bg-slate-50/20 text-center space-y-3">
                <div className="bg-amber-500/10 p-3 rounded-full text-amber-500 w-12 h-12 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Drag and drop standard PDF, DOCX or TXT files here'}
                  </p>
                  <p className="text-[10px] text-slate-400">Supported formats: PDF, DOCX, TXT up to 15MB</p>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <button 
                    onClick={() => handleSimulateDocumentUpload('Al_Ghamdi_Corporate_Sharia_Policy_v2.pdf')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Select Demo Policy Document
                  </button>
                  <button 
                    onClick={() => handleSimulateDocumentUpload('Late_Payment_Fees_Fatwa_2026.pdf')}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Select Demo Board Fatwa
                  </button>
                </div>
              </div>

              {/* Step Process Display */}
              {uploadProgressStep !== 'idle' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-xs space-y-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Rule Extraction Pipeline Process</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>1. Upload Standard</span>
                    </div>
                    <div className={`flex items-center gap-2 font-bold ${uploadProgressStep === 'uploading' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {uploadProgressStep === 'uploading' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                      <span>2. AI Extraction</span>
                    </div>
                    <div className={`flex items-center gap-2 font-bold ${
                      uploadProgressStep === 'idle' || uploadProgressStep === 'uploading' ? 'text-slate-400' :
                      uploadProgressStep === 'extracted' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      <Info className="w-4 h-4" />
                      <span>3. Human Rule Preview</span>
                    </div>
                  </div>

                  {/* Rule extraction results */}
                  {extractedStandardData && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex justify-between items-center bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{extractedStandardData.title}</span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold">Ready to map</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Generated Sharia Ruleset:</span>
                        {extractedStandardData.detectedRules.map((rule: string, ri: number) => (
                          <div key={ri} className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 flex items-start gap-2 text-[11px]">
                            <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-mono text-[9px] mt-0.5">RULE_EXT_0{ri+1}</span>
                            <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{rule}</span>
                          </div>
                        ))}
                      </div>

                      {uploadProgressStep !== 'converted' ? (
                        <button 
                          onClick={handleApproveAndActivateRules}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition"
                        >
                          Approve and Deploy Rules to Active Engine
                        </button>
                      ) : (
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-center border border-emerald-500/20">
                          ✓ Rules successfully deployed & activated in Standards Library.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Right: Explainer */}
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  {isRTL ? 'آلية الترجمة والتحقق التلقائية' : 'Corporate Policy Mapping Guidance'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isRTL 
                    ? 'بعد رفع الملف، يقوم محرك لغة الآلة باستخراج القوانين، وتدبيسها بأرقام فقهية مناسبة، لتبدأ الفحوص التلقائية فوراً.'
                    : 'ICAP Sharia Parser processes raw compliance parameters and translates them into structured programmatic constraints, keeping audit logs robust.'}
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <strong>Best practices for uploads:</strong>
                  <p>• Include clear section headers</p>
                  <p>• State explicit margin percentages and purification protocols</p>
                  <p>• Sign documents with Sharia Board signatures if possible</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 6: AUTOMATIC REGULATORY COMPLIANCE MONITORING ENGINE (Requirement 9 & 17)
          ======================================================== */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Interactive list of pending/applied updates */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isRTL ? 'إشعارات محرك التحديثات الفورية' : 'Regulatory Intelligence Updates Stream'}
                  </h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'رصد آلي ومستمر للتغيرات القانونية الصادرة من البنوك المركزية.' : 'Continuous monitoring feed of regulatory amendments with immediate impact triage.'}</p>
                </div>
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {regulatoryUpdates.filter(u => u.status === 'Pending Review').length} Action Items
                </span>
              </div>

              <div className="space-y-4">
                {regulatoryUpdates.map((upd) => (
                  <div 
                    key={upd.id} 
                    className={`p-5 rounded-2xl border ${
                      upd.status === 'Pending Review' 
                        ? 'border-amber-500/30 bg-amber-500/[0.02]' 
                        : 'border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900/30'
                    } space-y-3 transition`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">{upd.date} · Source: {upd.source}</span>
                        <h4 className="font-bold text-slate-950 dark:text-white text-xs mt-0.5">{upd.change}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        upd.status === 'Pending Review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {upd.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Sovereign System Impact Assessment:</strong>
                      <p className="mt-1 leading-relaxed text-[11px]">{upd.impact}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      <span>Affected Rules: <strong>{upd.affectedRules.join(', ')}</strong></span>
                      
                      {upd.status === 'Pending Review' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(upd.id, 'Rules Updated')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Deploy Affected Rules
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(upd.id, 'Dismissed')}
                            className="bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right: Regulatory Intelligence AI Chat interactive widget (Requirement 11) */}
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-xl">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Regulatory Intelligence AI
                    </h4>
                    <p className="text-[10px] text-slate-400">Ask the Sharia Governance legal assistant</p>
                  </div>
                </div>

                {/* Chat window log */}
                <div className="h-64 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 space-y-3 scrollbar-none">
                  {aiChatLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                        log.sender === 'user' 
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ml-auto border border-amber-500/10' 
                          : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 mr-auto border border-slate-100'
                      }`}
                    >
                      <p>{log.text}</p>
                      <span className="text-[8px] text-slate-400 block mt-1 text-right">{log.date}</span>
                    </div>
                  ))}
                  
                  {aiIsAnalyzing && (
                    <div className="bg-white dark:bg-slate-850 text-slate-400 p-2.5 rounded-xl border border-slate-100 mr-auto text-[11px] flex items-center gap-2 max-w-[85%]">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                      <span>Regulatory AI is evaluating changes...</span>
                    </div>
                  )}
                </div>

                {/* Input box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInputMessage}
                    onChange={(e) => setAiInputMessage(e.target.value)}
                    placeholder="Ask Sharia agent..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendAiMessage();
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <button 
                    onClick={handleSendAiMessage}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-xl transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] text-slate-400 block w-full">Quick suggestions:</span>
                  {[
                    'Explain SAMA updates',
                    'AAOIFI possession rules',
                    'Malaysia non-permissible purging'
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiInputMessage(s)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded-lg transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 7: LOCALIZATION & REGIONAL FORMATTING (Requirement 12 & 13)
          ======================================================== */}
      {activeTab === 'localization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Config form */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-amber-500" />
                  <span>{isRTL ? 'إعدادات اللغة والخصائص الإقليمية' : 'Sovereign Localization & Cultural Formatting'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isRTL ? 'إعداد العملات الافتراضية، صيغ التواريخ ومصطلحات الأحكام المتناسبة مع كل بيئة مصرفية.' : 'Configure default display languages, regional currency mappings, audit report dates, and legal wordings.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">Selected Operational Language:</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value as any);
                      onTriggerActivityLog('CHANGE_LOCALIZATION_LANG', `Changed interface primary localization to: ${e.target.value}`);
                      triggerToast(`Successfully localized workspace dictionary to: ${e.target.value}`);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['English', 'Arabic', 'Malay', 'Indonesian', 'French', 'Turkish'].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">Primary Accountancy Currency:</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => {
                      setSelectedCurrency(e.target.value);
                      triggerToast(`Preferred operational currency updated: ${e.target.value}`);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['SAR (Saudi Riyal)', 'AED (UAE Dirham)', 'MYR (Malaysian Ringgit)', 'JOD (Jordanian Dinar)', 'USD (United States Dollar)'].map((c) => (
                      <option key={c} value={c.split(' ')[0]}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">Audit Date Format:</label>
                  <select
                    value={selectedDateFormat}
                    onChange={(e) => setSelectedDateFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['YYYY-MM-DD (ISO standard)', 'DD/MM/YYYY (UK standard)', 'MM-DD-YYYY'].map((d) => (
                      <option key={d} value={d.split(' ')[0]}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 block font-bold">Preferred Legal / Sharia Terminology Set:</label>
                  <select
                    value={selectedLegalTerminology}
                    onChange={(e) => setSelectedLegalTerminology(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['AAOIFI Standard Verbiage', 'Saudi SAMA Consumer Framework terms', 'Malaysia BNM Shariah wording'].map((t) => (
                      <option key={t} value={t.split(' ')[1] as any}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sample output representation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Real-time localized interface preview:</span>
                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-[11px]">
                  <span>{isRTL ? 'تدقيق عقد مرابحة نشط:' : 'Active audit balance ledger:'}</span>
                  <span className="font-mono font-bold text-emerald-500">
                    {selectedCurrency} 1,245,000.00
                  </span>
                </div>
              </div>

            </div>

            {/* Translation Dictionary Database (Requirement 12 & 16) */}
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-500" />
                  {isRTL ? 'قاموس اللغات النشط بقاعدة البيانات' : 'Active Translations DB Dictionary'}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isRTL ? 'السجلات المترجمة داخل قاعدة البيانات لإخراج تقارير مطبوعة بلغات المفتشين الدولية.' : 'Sovereign translations mapping database keys to localized outputs for international reporting.'}
                </p>

                <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-1">
                  {translations.map((tr) => (
                    <div key={tr.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1 rounded font-mono font-bold">
                          {tr.language}
                        </span>
                        <p className="font-mono text-[9px] text-slate-400 block mt-0.5">{tr.key}</p>
                      </div>
                      <span className="font-bold text-[10px] text-slate-800 dark:text-slate-200 text-right">{tr.translatedText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 8: DATABASE SCHEMAS & EXTENSIONS (Requirement 16)
          ======================================================== */}
      {activeTab === 'db_extensions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isRTL ? 'إضافات قاعدة بيانات الامتثال العالمي' : 'Sovereign Database Extensions Schema'}
              </h3>
              <p className="text-xs text-slate-400">{isRTL ? 'عرض تفصيلي لهيكل الجداول المدخلة للامتثال والترجمات وإصدارات القواعد.' : 'Inspect database schema structures, primary indices, and recent transaction records in real-time.'}</p>
            </div>
          </div>

          <div className="space-y-6">
            {dbExtensionsList.map((tbl, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}
              >
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-mono font-bold text-xs text-amber-500">{tbl.tableName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tbl.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                    Engine: InnoDB
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  {/* Table Fields */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Fields Specification:</span>
                    <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-850 text-slate-400">
                            <th className="p-2">Field</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Null</th>
                            <th className="p-2">Index</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tbl.fields.map((f, fi) => (
                            <tr key={fi} className="border-t border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400">
                              <td className="p-2 font-mono font-bold text-slate-700 dark:text-slate-300">{f.name}</td>
                              <td className="p-2 font-mono">{f.type}</td>
                              <td className="p-2 font-mono">{f.nullable}</td>
                              <td className="p-2 font-mono text-amber-600 font-bold">{f.key || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sample Records */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Row Sample:</span>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800">
                      <pre className="font-mono text-[11px] text-slate-600 dark:text-slate-300 overflow-x-auto">
                        {JSON.stringify(tbl.sampleRows, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification Popup Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border bg-slate-900 border-slate-800 text-white flex items-center gap-2 max-w-sm text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
