import React, { useState, useMemo } from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Server,
  Database,
  Layers,
  Award,
  BookOpen,
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  Download,
  Info,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Briefcase,
  Globe,
  Leaf,
  Coins,
  DollarSign,
  Heart,
  Scale,
  ShoppingBag,
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ========================================================
// DB ENTITIES / TYPES (Requirement 17)
// ========================================================
export interface IndustryPackage {
  id: string;
  industry: string;
  description: string;
  rulesCount: number;
  rules: string[];
  agents: string[];
  reports: string[];
  certificationType: string;
  isInstalled: boolean;
  standardsSupported: string[];
}

export interface IndustryAgent {
  id: string;
  name: string;
  industry: string;
  knowledgeBase: string[];
  rules: string[];
  status: 'Active' | 'Idle' | 'Analyzing';
}

export interface IndustryCertification {
  id: string;
  type: string;
  requirements: string[];
  validity: string;
  status: 'Certified' | 'Not Certified' | 'Pending Review';
  issueDate?: string;
  expiryDate?: string;
}

export interface Partner {
  id: string;
  company: string;
  category: 'Sharia Advisor' | 'Audit Firm' | 'Consultant' | 'ERP Vendor' | 'FinTech Provider';
  country: string;
  services: string[];
  certifications: string[];
  contact: string;
  rating: number;
}

interface IndustryMarketplaceViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function IndustryMarketplaceView({
  locale,
  theme,
  onTriggerActivityLog
}: IndustryMarketplaceViewProps) {
  const isRTL = locale === 'ar';

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sub-navigation inside Marketplace View
  const [activeMarketSubTab, setActiveMarketSubTab] = useState<'packages' | 'installed' | 'knowledge' | 'partners' | 'db_extensions'>('packages');

  // Interactive search & filter states
  const [packageSearch, setPackageSearch] = useState('');
  const [partnerFilterCategory, setPartnerFilterCategory] = useState<string>('All');
  const [partnerFilterCountry, setPartnerFilterCountry] = useState<string>('All');

  // ========================================================
  // 1. DEMO DATA FOR REQUISITE ENTITIES (Requirement 18 & 20)
  // ========================================================

  // Industry Packages state
  const [packages, setPackages] = useState<IndustryPackage[]>([
    {
      id: 'PKG-BANK',
      industry: 'Islamic Banking',
      description: isRTL 
        ? 'نظام شامل للامتثال للمعاملات والمنتجات المصرفية الإسلامية (مرابحة، مضاربة، مشاركة، إجارة، تورق).' 
        : 'Comprehensive compliance package for Islamic retail, corporate, and investment banking products (Murabaha, Mudarabah, Wakala).',
      rulesCount: 34,
      rules: ['Contractual Sequence Validation', 'Cost-Plus Profit Accuracy', 'Risk-Sharing Pool Separation', 'Trade Finance Document Matching'],
      agents: ['Islamic Banking AI'],
      reports: ['Sharia Audit Review', 'Profit Distribution Assessment', 'Customer Agreement Compliance Audit'],
      certificationType: 'Islamic Banking Certified',
      isInstalled: true, // Demo data installed state
      standardsSupported: ['AAOIFI Sharia Standards 1-54', 'IFSB Capital Adequacy Framework', 'Local SAMA Banking Guidelines']
    },
    {
      id: 'PKG-TAKAFUL',
      industry: 'Takaful Insurance',
      description: isRTL 
        ? 'إدارة وحوكمة وثائق التأمين التكافلي وإدارة المخاطر المشتركة وصناديق المشتركين وفصل الرسوم.' 
        : 'Sovereign governance of cooperative risk pooling, operator mudarabah/wakala fee validation, and fund separations.',
      rulesCount: 22,
      rules: ['Operator/Participant Fund Segregation', 'Wakala Fee Caps Verification', 'Surplus Distribution Compliance', 'Claim Pool Soundness Checks'],
      agents: ['Takaful AI'],
      reports: ['Takaful Compliance Report', 'Fund Review Report', 'Operator Fee Allocations Log'],
      certificationType: 'Takaful Certified',
      isInstalled: false,
      standardsSupported: ['AAOIFI Standard on Takaful', 'IFSB Governance of Takaful', 'IAIS Islamic Core Principles']
    },
    {
      id: 'PKG-INVEST',
      industry: 'Investment Funds',
      description: isRTL 
        ? 'غربلة وتقييم المحافظ الاستثمارية وصناديق الأسهم والعقارات والتحقق من نسب التطهير.' 
        : 'Automated portfolio screening, purification ratio calculators, and activities testing for real estate and equities.',
      rulesCount: 18,
      rules: ['Debt-to-Asset Ratio <33%', 'Liquid-to-Total Asset Ratio >10%', 'Interest Income Screening <5%', 'Non-Permissible Activity Flags'],
      agents: ['Investment AI'],
      reports: ['Investment Screening Report', 'Purification Dividend Allocation Digest'],
      certificationType: 'Islamic Investment Fund Certified',
      isInstalled: false,
      standardsSupported: ['AAOIFI Investment Standards', 'Dow Jones Islamic Index Rules', 'FTSE Shariah Screening Methodology']
    },
    {
      id: 'PKG-SUKUK',
      industry: 'Sukuk Markets',
      description: isRTL 
        ? 'مراجعة وتدقيق هياكل الصكوك السيادية والشركات والتحقق من ملكية الأصول وتدفقاتها النقدية.' 
        : 'Asset ownership chain validation, purchase undertaking analysis, and periodic distribution checks for Sukuk issuances.',
      rulesCount: 28,
      rules: ['Asset Ownership Conveyance Validation', 'Underlying Rental Cash Flow Matching', 'Purchase Undertaking Compliance', 'Debt vs Tangibility Ratio Check'],
      agents: ['Sukuk AI'],
      reports: ['Sukuk Compliance Assessment', 'Asset Pool Audit Ledger', 'Investor Rights Protection Review'],
      certificationType: 'Sukuk Certified',
      isInstalled: false,
      standardsSupported: ['AAOIFI Standard 17 (Sukuk)', 'Securities Commission Malaysia Guidelines', 'International Islamic Financial Market (IIFM) Protocols']
    },
    {
      id: 'PKG-FINTECH',
      industry: 'Islamic FinTech',
      description: isRTL 
        ? 'تحليل منصات الإقراض الرقمي والدفع الإلكتروني، المحافظ الرقمية، التمويل الجماعي، والشراء الآجل.' 
        : 'Governance matrix for digital financing, BNPL structures, fee transparent micro-lending, and crowdfunding portals.',
      rulesCount: 19,
      rules: ['BNPL Late Payment Fee Restructuring', 'Transparency of Peer-to-Peer Crowdfunding Fees', 'Collateral Valuation Integrity', 'Dynamic Murabaha Pricing Validations'],
      agents: ['FinTech AI'],
      reports: ['Digital Lending Sharia Audit', 'Platform Fee Structure Analysis'],
      certificationType: 'FinTech Compliance Certified',
      isInstalled: true, // Demo data installed state
      standardsSupported: ['AAOIFI Crowdfunding Framework', 'Regulator Sandbox Sharia Mandates']
    },
    {
      id: 'PKG-CRYPTO',
      industry: 'Crypto Assets',
      description: isRTL 
        ? 'تحديد مشروعية الأصول الرقمية، الرموز المشفرة (Tokens)، العقود الذكية، وبروتوكولات DeFi.' 
        : 'Token economics evaluation, utility analysis, revenue mechanism testing, and smart contract Sharia audit pipelines.',
      rulesCount: 15,
      rules: ['Riba/Gharar Free Smart Contract Logics', 'Token Backed Utility Authenticity', 'DeFi Liquidity Pools Verification', 'Staking Rewards Purities'],
      agents: ['Crypto AI'],
      reports: ['Crypto Sharia Screening Report', 'Smart Contract Sharia Integrity Map'],
      certificationType: 'Crypto Compliance Certified',
      isInstalled: true, // Demo data installed state
      standardsSupported: ['Sovereign Digital Asset Sharia Guidelines', 'World Islamic FinTech Forum Protocols']
    },
    {
      id: 'PKG-HALAL',
      industry: 'Halal Supply Chain',
      description: isRTL 
        ? 'تتبع سلسلة التوريد والخدمات اللوجستية للمنتجات الغذائية والدوائية ومستحضرات التجميل.' 
        : 'End-to-end traceability of raw materials, logistics sanitization verification, and supplier certificate audits.',
      rulesCount: 26,
      rules: ['Raw Ingredient Halal Cert Authenticity', 'Cross-Contamination Logistical Isolation', 'Sanitation Chain Telemetry Match', 'Supplier Factory Ethical Standard Reviews'],
      agents: ['Halal Supply Chain AI'],
      reports: ['Halal Traceability & Verification Report', 'Supplier Audit Summary Log'],
      certificationType: 'Halal Supply Chain Certified',
      isInstalled: false,
      standardsSupported: ['GSO 2055-1 Halal Standards', 'SMIIC General Guidelines on Halal Food', 'JAKIM Halal Certification Requirements']
    },
    {
      id: 'PKG-ESG',
      industry: 'ESG & Ethical Finance',
      description: isRTL 
        ? 'غربلة الاستثمارات وفق معايير الأثر البيئي، المسؤولية الاجتماعية، الحوكمة الرشيدة، والتمويل الأخلاقي.' 
        : 'Integration of ESG scoring frameworks with traditional Sharia-compliant screening filters for unified ethical capital placement.',
      rulesCount: 20,
      rules: ['Carbon Intensity Threshold Checks', 'Board Diversity & Governance Audits', 'Human Rights & Fair Labor Filter', 'Eco-Sukuk Allocation Validations'],
      agents: ['Ethical Finance AI'],
      reports: ['ESG Compliance & Ethical Rating Scorecard', 'Carbon Offset Allocation Digest'],
      certificationType: 'Ethical Finance Certified',
      isInstalled: false,
      standardsSupported: ['UN Principles for Responsible Investment (PRI)', 'AAOIFI Standard on CSR', 'GRI Standards Core Framework']
    },
    {
      id: 'PKG-VC',
      industry: 'Venture Capital',
      description: isRTL 
        ? 'تحليل استثمارات الشركات الناشئة، الاتفاقيات التمويلية، ومراجعة الأنشطة المالية والتجارية.' 
        : 'Due diligence on startup portfolios, SAFE/convertible note Sharia alignments, and non-compliant activity triggers.',
      rulesCount: 17,
      rules: ['Startup Leverage & Interest-bearing Debt Limit <30%', 'Sovereign Business Activity Screening', 'Convertible Note Fee structures', 'Option Pool Governance Compliance'],
      agents: ['VC Due Diligence AI'],
      reports: ['VC Sharia Due Diligence Report', 'Portfolio Compliancy Matrix'],
      certificationType: 'Venture Capital Sharia Certified',
      isInstalled: false,
      standardsSupported: ['Venture Capital Association Ethical Code', 'AAOIFI Standards for Corporate Shares']
    }
  ]);

  // Industry Specialized AI Agents (Requirement 12 & 17)
  const [industryAgents, setIndustryAgents] = useState<IndustryAgent[]>([
    { id: 'AG-BANK', name: 'Islamic Banking AI', industry: 'Islamic Banking', knowledgeBase: ['Murabaha fatwas', 'Mudarabah contracts standard template', 'AAOIFI Standards 1-12'], rules: ['Cost-plus profit matching', 'Sequence of ownership check'], status: 'Idle' },
    { id: 'AG-TAKAFUL', name: 'Takaful AI', industry: 'Takaful Insurance', knowledgeBase: ['Cooperative risk pooling mechanics', 'Wakala/Mudarib models standard rules', 'Surplus distribution policies'], rules: ['Fund separation checks', 'Fee capping audits'], status: 'Idle' },
    { id: 'AG-INVEST', name: 'Investment AI', industry: 'Investment Funds', knowledgeBase: ['Dow Jones Screening guidelines', 'Purification dividend calculation frameworks', 'Non-compliant revenue thresholds'], rules: ['Debt ratio <33% check', 'Liquid asset ratio check'], status: 'Idle' },
    { id: 'AG-SUKUK', name: 'Sukuk AI', industry: 'Sukuk Markets', knowledgeBase: ['Sukuk Ijarah ownership templates', 'IIFM master agreements', 'Tangible asset ratios'], rules: ['Tangibility ratio check', 'Cash flow rental flow verification'], status: 'Idle' },
    { id: 'AG-VC', name: 'VC Due Diligence AI', industry: 'Venture Capital', knowledgeBase: ['SAFE note alignments', 'Pre-revenue startup screening matrices', 'Islamic venture frameworks'], rules: ['Permissible activity screening', 'Debt/Liquidity checks'], status: 'Idle' },
    { id: 'AG-FINTECH', name: 'FinTech AI', industry: 'Islamic FinTech', knowledgeBase: ['Digital wallets rules', 'BNPL Late fee structures', 'P2P crowdfunding protocols'], rules: ['BNPL late fee cap checker', 'Wallet transactional escrow checks'], status: 'Idle' },
    { id: 'AG-CRYPTO', name: 'Crypto AI', industry: 'Crypto Assets', knowledgeBase: ['NFT utility fatwas', 'Staking protocols sharia status', 'Riba-free tokenomics models'], rules: ['Smart contract logic review', 'Gharar/Riba detection filters'], status: 'Idle' },
    { id: 'AG-HALAL', name: 'Halal Supply Chain AI', industry: 'Halal Supply Chain', knowledgeBase: ['SMIIC standards', 'JAKIM raw material catalogs', 'Logistics sanitization rules'], rules: ['Contamination detection alerts', 'Certificates metadata parser'], status: 'Idle' }
  ]);

  // Industry Certifications (Requirement 15 & 17 & 18)
  const [industryCertifications, setIndustryCertifications] = useState<IndustryCertification[]>([
    { id: 'CERT-BANK', type: 'Islamic Banking Certified', requirements: ['AAOIFI Retail Banking Compliance', 'Independent Sharia Board Audit', 'Daily Transactional Sample Check'], validity: '1 Year (Annual Renewal)', status: 'Certified', issueDate: '2026-01-10', expiryDate: '2027-01-10' },
    { id: 'CERT-CRYPTO', type: 'Crypto Screening Certified', requirements: ['Token Economics Audit', 'Smart Contract Auditing Protocol', 'Purification Mechanics Implementation'], validity: '6 Months (Rolling Audit)', status: 'Certified', issueDate: '2026-05-15', expiryDate: '2026-11-15' },
    { id: 'CERT-TAKAFUL', type: 'Takaful Certified', requirements: ['Cooperative Fund Separation', 'Wakala Fee Disclosures Audit', 'Sovereign Capital Pool Sufficiency'], validity: '1 Year', status: 'Not Certified' },
    { id: 'CERT-SUKUK', type: 'Sukuk Certified', requirements: ['Asset Registry Verification', 'Tangibility Ratio Validation', 'Investor Rights Clause Audit'], validity: 'Per Issuance Lifetime', status: 'Not Certified' },
    { id: 'CERT-HALAL', type: 'Halal Supply Chain Certified', requirements: ['GSO 2055-1 Logistical Compliance', 'Immutable Supplier Traceability Log', 'Batch Lab Testing verification'], validity: '1 Year', status: 'Not Certified' },
    { id: 'CERT-ETHICAL', type: 'Ethical Finance Certified', requirements: ['UN PRI Integration Scorecard', 'Eco-Sukuk Allocation verification', 'Governance Integrity Audit'], validity: '1 Year', status: 'Not Certified' }
  ]);

  // Partners (Requirement 16 & 17 & 18)
  const [partners, setPartners] = useState<Partner[]>([
    { id: 'PRT-01', company: 'Al Noor Sharia Advisory Ltd', category: 'Sharia Advisor', country: 'Saudi Arabia', services: ['Fatwa issuance', 'Sharia board composition', 'Product structure designs', 'Annual Sharia report signing'], certifications: ['AAOIFI Certified Sharia Advisor', 'SAMA Authorized Auditor'], contact: 'contact@alnoorsharia.sa', rating: 4.9 },
    { id: 'PRT-02', company: 'Global Islamic Compliance Auditors', category: 'Audit Firm', country: 'United Arab Emirates', services: ['External Sharia Audits', 'Compliance Framework Assessments', 'Operational Takaful audits'], certifications: ['AAOIFI Institutional Member', 'ADGM Registered Firm'], contact: 'advisory@globalislamicaudit.ae', rating: 4.8 },
    { id: 'PRT-03', company: 'Fintech Sharia Advisory LLP', category: 'Consultant', country: 'Malaysia', services: ['Crypto asset screening guidelines', 'Smart contract Sharia verification', 'Tokenomics audits'], certifications: ['SC Malaysia Registered Sharia Advisor'], contact: 'hello@fintechsharia.my', rating: 4.7 },
    { id: 'PRT-04', company: 'Sovereign Ledger ERP Integrations', category: 'ERP Vendor', country: 'Saudi Arabia', services: ['SAP S/4HANA Ledger custom mappings', 'Mambu Core banking Webhooks', 'Odoo accounting pipeline scripts'], certifications: ['Microsoft Gold Partner', 'SAP Certified Integration specialist'], contact: 'integrations@sovereignledger.sa', rating: 4.9 },
    { id: 'PRT-05', company: 'Ethical Block FinTech Labs', category: 'FinTech Provider', country: 'Bahrain', services: ['Islamic smart contract templates', 'Charity Purification escrow smart contracts'], certifications: ['CBB Sandbox Graduate'], contact: 'dev@ethicalblock.io', rating: 4.6 }
  ]);

  // Industry Knowledge Library items (Requirement 13)
  const [knowledgeLibrary, setKnowledgeLibrary] = useState([
    { id: 'KB-1', industry: 'Islamic Banking', title: 'AAOIFI Standard on Murabaha Transactions', type: 'Standard', summary: 'Explicit instructions on the timing of possession, risk transfer, and cost-plus disclosure regulations.' },
    { id: 'KB-2', industry: 'Islamic Banking', title: 'Sample Wakala Bil Istithmar Master Contract', type: 'Contract Template', summary: 'Standardized agency agreement template detailing proxy investor fee structures and target yield bounds.' },
    { id: 'KB-3', industry: 'Takaful Insurance', title: 'Fatwa on Cooperative Surplus Allocation Framework', type: 'Previous Decisions', summary: 'Ruling authorizing the rolling allocation of surplus funds back to non-claiming participants with strict reserves separation.' },
    { id: 'KB-4', industry: 'Investment Funds', title: 'Dow Jones Islamic Index Screening Parameters Guide', type: 'Policy Guidelines', summary: 'Financial ratio limits on debt-to-assets, liquid assets-to-cash, and non-compliant interest allocations.' },
    { id: 'KB-5', industry: 'Crypto Assets', title: 'Sharia Compliance Analysis of Utility Token Rewards', type: 'Guidelines', summary: 'Guideline on evaluating reward mechanics, governance rights, and collateral backing validation.' },
    { id: 'KB-6', industry: 'Halal Supply Chain', title: 'JAKIM Guidelines on Cold-Chain Logistics Cross-Contamination', type: 'Standard', summary: 'Rules enforcing distinct physical assets, wash registries, and telemetry log tracking for halal certified transport.' }
  ]);

  // ========================================================
  // 2. ACTIVE INSTALLED MODULE SANDBOX SIMULATOR STATES & ACTIONS
  // ========================================================
  const [selectedDashboardModule, setSelectedDashboardModule] = useState<string>('Islamic Banking');
  
  // Interactive analysis run states
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  // Simulated payloads to analyze
  const [sandboxContractText, setSandboxContractText] = useState(
    `MASTER MURABAHA SALE AGREEMENT
THIS AGREEMENT is entered into on this 17th day of July 2026.
BETWEEN: Al Noor Islamic Finance Corp (the "Seller")
AND: Al-Ghamdi Retail Trading Group (the "Buyer").
WHEREAS:
1. The Buyer desires to purchase certain commodities consisting of 4,000 Metric Tons of Industrial Steel.
2. The Seller agrees to purchase said commodities from third-party vendor and sell them to the Buyer on a Cost-Plus Cost Basis.
COST DETAILS:
- Cost Price of Commodities: $1,200,000 USD.
- Murabaha Profit Margin (Markup): 5.5% flat rate per annum.
- Total Deferred Sale Price: $1,266,000 USD.
PAYMENT CLAUSES:
- Late payment interest charge: 12% compound per annum on any delayed amounts to be added directly to the Seller's general income stream.`
  );

  const [sandboxCryptoTokenName, setSandboxCryptoTokenName] = useState('NoorChain Utility Token (NCT)');
  const [sandboxCryptoTotalSupply, setSandboxCryptoTotalSupply] = useState('100,000,000');
  const [sandboxCryptoMechanism, setSandboxCryptoMechanism] = useState('Dynamic staking rewards generated by transaction fee redistribution with no leverage pools.');

  const [sandboxTakafulClause, setSandboxTakafulClause] = useState('Operator fee: Wakala Fee of 15% of initial contributions, with Mudarabah profit sharing of 25% on investment pool income. Surplus distributed entirely to active participants after 10% reserves retention.');

  const [sandboxFundHoldingsText, setSandboxFundHoldingsText] = useState(`Noor Tech Stocks (Debt Ratio: 14% | Non-Compliant Revenue: 2.1%)
Makkah Real Estate REIT (Debt Ratio: 28% | Non-Compliant Revenue: 0.0%)
Global Luxury Retailer (Debt Ratio: 42% | Non-Compliant Revenue: 6.5%)
Dynamic Logistics Sukuk (Debt Ratio: 5% | Non-Compliant Revenue: 0.0%)`);

  // Interactive package installation trigger
  const handleToggleInstallPackage = (packageId: string) => {
    setPackages(prev => prev.map(p => {
      if (p.id === packageId) {
        const nextState = !p.isInstalled;
        onTriggerActivityLog(
          nextState ? 'INSTALL_COMPLIANCE_PACKAGE' : 'UNINSTALL_COMPLIANCE_PACKAGE',
          `${nextState ? 'Installed' : 'Uninstalled'} ${p.industry} compliance package.`
        );
        // Automatically activate/certify relevant certification if installed
        setIndustryCertifications(certs => certs.map(c => {
          if (c.type === p.certificationType) {
            return {
              ...c,
              status: nextState ? 'Certified' : 'Not Certified',
              issueDate: nextState ? '2026-07-17' : undefined,
              expiryDate: nextState ? '2027-07-17' : undefined
            };
          }
          return c;
        }));
        return { ...p, isInstalled: nextState };
      }
      return p;
    }));
  };

  // Run specialized AI agent analysis (Murabaha, Crypto, ESG, Takaful, Fund Screening)
  const handleRunIndustryAgentAnalysis = (industryName: string) => {
    setIsSimulatingAI(true);
    setSimulationResult(null);

    // Simulate specialized agent execution output
    setTimeout(() => {
      setIsSimulatingAI(false);
      let findings: any[] = [];
      let score = 100;
      let certEligible = true;

      if (industryName === 'Islamic Banking') {
        // Evaluate Murabaha late payment compound interest rule!
        const hasCompoundLateFees = sandboxContractText.toLowerCase().includes('interest') || sandboxContractText.toLowerCase().includes('compound');
        if (hasCompoundLateFees) {
          score = 65;
          certEligible = false;
          findings = [
            {
              id: 'FIND-BANK-01',
              severity: 'Critical',
              rule: 'Compound Late Payment Penalty Riba Violation',
              finding: 'The contract includes an interest penalty clause of 12% compounded per annum, directed back to the Seller\'s general revenue stream.',
              evidence: 'Clause: "Late payment interest charge: 12% compound per annum on any delayed amounts to be added directly to the Seller\'s general income..."',
              remediation: 'Replace with a fixed-amount penalty for late payments, with the explicit condition that all late fees must be fully purified by donating them to certified charities (Charity Allocation model), and cannot be kept as bank income.'
            },
            {
              id: 'FIND-BANK-02',
              severity: 'Passed',
              rule: 'Asset Possession Sequence',
              finding: 'Sequence of transactions confirms Al Noor Corp purchases and takes legal risk of commodities prior to selling to Buyer.',
              evidence: 'Verification: "Seller agrees to purchase said commodities from third-party vendor and sell them..."',
              remediation: 'Ensure execution logs (SAP ERP confirmations) show timestamp difference.'
            }
          ];
        } else {
          score = 98;
          findings = [
            {
              id: 'FIND-BANK-01',
              severity: 'Passed',
              rule: 'Late payment cleansing',
              finding: 'Contract correctly structure late payment penalties to go directly to designated purifying charitable funds.',
              evidence: 'No compound interest penalty detected.',
              remediation: 'N/A'
            }
          ];
        }
      } else if (industryName === 'Crypto Assets') {
        const containsStaking = sandboxCryptoMechanism.toLowerCase().includes('staking') || sandboxCryptoMechanism.toLowerCase().includes('rewards');
        findings = [
          {
            id: 'FIND-CRYP-01',
            severity: 'Passed',
            rule: 'No Leverage/Interest-bearing Lending Protocols detected',
            finding: 'Token model utilizes fee redistribution mechanics without relying on interest-based lending pools.',
            evidence: `Description: "${sandboxCryptoMechanism}"`,
            remediation: 'N/A'
          },
          {
            id: 'FIND-CRYP-02',
            severity: 'Medium',
            rule: 'Gharar Risk in Price Oracles',
            finding: 'Staking pool redistribution relies on off-chain price oracle metrics which may introduce minor uncertainty (Gharar).',
            evidence: 'Mechanism requires external pool state checks.',
            remediation: 'Implement decentralized redundant oracles with verified cryptographic proofs.'
          }
        ];
        score = 88;
      } else if (industryName === 'Takaful Insurance') {
        findings = [
          {
            id: 'FIND-TAK-01',
            severity: 'Passed',
            rule: 'Operator & Participant Fund Segregation',
            finding: 'Strict ledger separation is maintained between the operator administration funds and participant risk pools.',
            evidence: 'Clause: "Surplus distributed entirely to active participants after 10% reserves retention."',
            remediation: 'N/A'
          },
          {
            id: 'FIND-TAK-02',
            severity: 'Passed',
            rule: 'Wakala Fee Transparent Disclosures',
            finding: 'Operator fee is structured as a clear Wakala Fee of 15% plus 25% incentive fee, which is aligned with AAOIFI standards.',
            evidence: 'Clause: "Wakala Fee of 15% of initial contributions, with Mudarabah profit sharing..."',
            remediation: 'Ensure the fee breakdown is displayed clearly to policyholders on signup portal.'
          }
        ];
        score = 96;
      } else if (industryName === 'Investment Funds') {
        // Parse the mock investment holdings lines
        const lines = sandboxFundHoldingsText.split('\n');
        findings = lines.map((line, idx) => {
          if (!line.trim()) return null;
          // Look for percentages
          const debtMatch = line.match(/Debt Ratio:\s*(\d+)%/i);
          const nonCompliantMatch = line.match(/Non-Compliant Revenue:\s*([\d.]+)%/i);
          
          const debt = debtMatch ? parseInt(debtMatch[1], 10) : 0;
          const nonComp = nonCompliantMatch ? parseFloat(nonCompliantMatch[1]) : 0;

          let isCompliant = true;
          let message = 'Compliant Holding.';
          let severity: 'Passed' | 'Critical' = 'Passed';

          if (debt > 33) {
            isCompliant = false;
            severity = 'Critical';
            message = `Debt-to-Asset ratio is ${debt}%, which exceeds the standard Sharia cap of 33%.`;
            score = Math.max(40, score - 20);
            certEligible = false;
          }
          if (nonComp > 5.0) {
            isCompliant = false;
            severity = 'Critical';
            message = `Non-compliant revenue is ${nonComp}%, which exceeds the standard 5% Sharia tolerance cap.`;
            score = Math.max(40, score - 20);
            certEligible = false;
          }

          return {
            id: `FIND-FUND-0${idx + 1}`,
            severity,
            rule: `Screening: ${line.split('(')[0].trim()}`,
            finding: message,
            evidence: `Debt: ${debt}% (Limit: <33%) | Non-Compliant Rev: ${nonComp}% (Limit: <5%)`,
            remediation: isCompliant ? 'N/A' : 'Liquidate holding immediately or quarantine asset until ratios drop below thresholds. Mark any dividends received during this period for mandatory charity purification.'
          };
        }).filter(Boolean);
      } else {
        // Fallback generic analysis
        findings = [
          {
            id: 'FIND-GEN-01',
            severity: 'Passed',
            rule: 'General Ethical Alignment Check',
            finding: 'The structured inputs comply with Sharia transparent profit-and-loss sharing principles.',
            evidence: 'N/A',
            remediation: 'N/A'
          }
        ];
        score = 95;
      }

      setSimulationResult({
        industry: industryName,
        score,
        certEligible,
        timestamp: new Date().toLocaleTimeString(),
        findings
      });

      onTriggerActivityLog('RUN_SPECIALIZED_AI_AUDIT', `Executed smart Sharia analysis on sandbox parameters for ${industryName}. Score: ${score}%`);
    }, 1500);
  };

  // Helper lists
  const installedPackagesList = useMemo(() => {
    return packages.filter(p => p.isInstalled);
  }, [packages]);

  const uninstalledPackagesList = useMemo(() => {
    return packages.filter(p => !p.isInstalled);
  }, [packages]);

  const filteredPartnersList = useMemo(() => {
    return partners.filter(p => {
      const matchCat = partnerFilterCategory === 'All' || p.category === partnerFilterCategory;
      const matchCountry = partnerFilterCountry === 'All' || p.country === partnerFilterCountry;
      return matchCat && matchCountry;
    });
  }, [partners, partnerFilterCategory, partnerFilterCountry]);

  return (
    <div className="space-y-6">
      {/* Title Header with Modern AppExchange Styling */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'سوق حلول الامتثال القطاعي' : 'ICAP Industry Compliance Marketplace'}
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-sans border border-amber-500/15">
                  {isRTL ? 'الحلول المعتمدة' : 'Enterprise Verified'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL
                  ? 'قم بتنشيط وتخصيص محركات ووكلاء الذكاء الاصطناعي لامتثال المصارف الإسلامية، التكافل، الصكوك، الأصول المشفرة، السلاسل الحلال، والمعايير الأخلاقية.'
                  : 'Deploy modular, pre-configured compliance rules, tailored AI audit agents, and legal frameworks for diverse financial & ethical sectors.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150/40 dark:border-slate-800/80 pt-4">
          {[
            { id: 'packages', name: isRTL ? 'حزم الامتثال المتاحة' : 'Available Packages', icon: Layers },
            { id: 'installed', name: isRTL ? 'الأدوات النشطة ولوحة التحكم' : 'Installed Dashboards & AI Sandbox', icon: CheckCircle },
            { id: 'knowledge', name: isRTL ? 'مكتبة المعايير القطاعية' : 'Sector Knowledge Library', icon: BookOpen },
            { id: 'partners', name: isRTL ? 'سوق المكاتب الاستشارية والشركاء' : 'Partner Ecosystem', icon: Users },
            { id: 'db_extensions', name: isRTL ? 'مفتش قاعدة البيانات' : 'Database Extensions', icon: Database }
          ].map(tab => {
            const active = activeMarketSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMarketSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 ${
                  active
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
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

      {/* SUB-TABS VIEWS */}
      <div>

        {/* ========================================================
            SUB-TAB 1: AVAILABLE COMPLIANCE PACKAGES
            ======================================================== */}
        {activeMarketSubTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isRTL ? 'استكشف الحزم والحلول المصممة خصيصاً لقطاعك' : 'Enterprise Industry Marketplace Catalog'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRTL ? 'قم بتثبيت الحزم الفرعية المناسبة لإثراء نظام الامتثال التلقائي لديك بمقاييس وأدوات مخصصة.' : 'Instantly activate dedicated regulations, specialized Sharia AI agents, and custom export workflows.'}
                </p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={isRTL ? 'بحث عن حزمة معينة...' : 'Search packages...'}
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-64 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Grid of Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages
                .filter(p => p.industry.toLowerCase().includes(packageSearch.toLowerCase()) || p.description.toLowerCase().includes(packageSearch.toLowerCase()))
                .map((pkg) => {
                  // Icon picking strategy based on industry name
                  let pkgIcon = Briefcase;
                  if (pkg.industry === 'Islamic Banking') pkgIcon = DollarSign;
                  if (pkg.industry === 'Takaful Insurance') pkgIcon = Shield;
                  if (pkg.industry === 'Investment Funds') pkgIcon = TrendingUp;
                  if (pkg.industry === 'Sukuk Markets') pkgIcon = Scale;
                  if (pkg.industry === 'Crypto Assets') pkgIcon = Coins;
                  if (pkg.industry === 'Halal Supply Chain') pkgIcon = ShoppingBag;
                  if (pkg.industry === 'ESG & Ethical Finance') pkgIcon = Leaf;
                  if (pkg.industry === 'Venture Capital') pkgIcon = Users;

                  const IconComp = pkgIcon;

                  return (
                    <div 
                      key={pkg.id} 
                      className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4 transition hover:shadow-md relative overflow-hidden`}
                    >
                      {pkg.isInstalled && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl font-mono">
                          INSTALLED
                        </div>
                      )}

                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl ${pkg.isInstalled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-500'}`}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-950 dark:text-white text-sm">{pkg.industry}</h4>
                            <span className="text-[10px] text-slate-400 block font-mono">{pkg.certificationType}</span>
                          </div>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">{isRTL ? 'الوكلاء النشطون:' : 'AI Agents Needed:'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{pkg.agents.join(', ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{isRTL ? 'عدد القواعد الفرعية:' : 'Core Rules Count:'}</span>
                            <span className="font-mono font-bold text-amber-500">{pkg.rulesCount} verified rules</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{isRTL ? 'المعايير المرجعية:' : 'Standards Standards:'}</span>
                            <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-[150px]">{pkg.standardsSupported[0]}</span>
                          </div>
                        </div>

                        {/* Expand rules library detail */}
                        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/60">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">{isRTL ? 'عينة من مكتبة القواعد:' : 'Included Rules Library Sample:'}</span>
                          <div className="flex flex-wrap gap-1">
                            {pkg.rules.map((rule, ri) => (
                              <span key={ri} className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/80 text-[10px] px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300">
                                {rule}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleToggleInstallPackage(pkg.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            pkg.isInstalled
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                          }`}
                        >
                          {pkg.isInstalled ? (
                            <>
                              <span>{isRTL ? 'إزالة التثبيت' : 'Deactivate Package'}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isRTL ? 'تثبيت وتنشيط الحزمة' : 'Install & Activate Package'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TAB 2: INSTALLED MODULES & INDUSTRY DASHBOARDS
            ======================================================== */}
        {activeMarketSubTab === 'installed' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Side Selector of installed modules */}
              <div className="w-full lg:w-1/4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isRTL ? 'اختر الحزمة لتشغيل المحاكي' : 'Select Installed Module'}
                </h3>
                <div className="space-y-1">
                  {installedPackagesList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedDashboardModule(p.industry);
                        setSimulationResult(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        selectedDashboardModule === p.industry
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 border-slate-150 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span>{p.industry}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                  {installedPackagesList.length === 0 && (
                    <p className="text-xs text-slate-400 p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      {isRTL ? 'لا توجد حزم مثبتة حالياً. الرجاء تثبيت بعض الحزم أولاً.' : 'No modules installed. Please install a package from the catalog tab first.'}
                    </p>
                  )}
                </div>

                {/* Info Card on running sandbox */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/20 text-xs text-slate-500 space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {isRTL ? 'محاكي الذكاء الاصطناعي التفاعلي' : 'AI Agent Sandbox Sandbox'}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {isRTL 
                      ? 'يوفر هذا القسم لوحة تحكم حية ومحاكاة مخصصة لقواعد التدقيق والذكاء الاصطناعي لكل قطاع مالي إسلامي.'
                      : 'Simulate instant verification of contracts, wallets, or portfolios using specialized machine-learning compliance models.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Active Interactive Dashboard & Sandbox */}
              <div className="flex-1">
                {installedPackagesList.length > 0 && selectedDashboardModule && (
                  <div className="space-y-6">

                    {/* DYNAMIC INDUSTRIAL COMPLIANCE DASHBOARD OVERVIEW (Requirement 14) */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Activity className="w-4.5 h-4.5 text-amber-500" />
                            <span>{selectedDashboardModule} {isRTL ? 'لوحة تحكم الامتثال والتدقيق' : 'Compliance Dashboard'}</span>
                          </h3>
                          <p className="text-[11px] text-slate-400">{isRTL ? 'رصد مؤشرات الأداء والالتزام بالأحكام والتدقيق المستمر.' : 'Continuous monitoring statistics, audits checklist, and live certificates.'}</p>
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                          {isRTL ? 'محرك نشط ومحمي' : 'Core Engine Active'}
                        </span>
                      </div>

                      {/* Stats cards for the dashboard */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'المنتجات والملفات المفحوصة' : 'Products/Files Reviewed'}</span>
                          <span className="text-xl font-display font-bold text-slate-900 dark:text-white block mt-1">1,245 files</span>
                          <span className="text-[9px] text-emerald-600 block mt-0.5">↑ 14% this week</span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'المعاملات التي تم تدقيقها' : 'Transactions Checked'}</span>
                          <span className="text-xl font-display font-bold text-slate-900 dark:text-white block mt-1">45,890 TXs</span>
                          <span className="text-[9px] text-emerald-600 block mt-0.5">99.4% parsed OK</span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'معدل الالتزام والامتثال' : 'Compliance Score'}</span>
                          <span className="text-xl font-display font-bold text-emerald-600 block mt-1">98.4%</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Sovereign SAMA aligned</span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">{isRTL ? 'النتائج المفتوحة للمراجعة' : 'Open Findings'}</span>
                          <span className="text-xl font-display font-bold text-amber-500 block mt-1">3 flagged</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Pending human review</span>
                        </div>
                      </div>

                      {/* SANDBOX TESTBED INPUT FORM */}
                      <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                            {isRTL ? 'محاكاة تدقيق الشريعة والالتزام الفني:' : 'Interactive Compliance Sandbox & File Auditor'}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Agent: {selectedDashboardModule} AI Agent</span>
                        </div>

                        {/* Switch inputs based on selected module */}
                        {selectedDashboardModule === 'Islamic Banking' && (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-bold block uppercase">
                              {isRTL ? 'نص العقد المراد تدقيقه (مثل: اتفاقية مرابحة):' : 'Murabaha / Mudarabah Contract Payload:'}
                            </label>
                            <textarea
                              rows={5}
                              value={sandboxContractText}
                              onChange={(e) => setSandboxContractText(e.target.value)}
                              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        )}

                        {selectedDashboardModule === 'Crypto Assets' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold">Token Name / Code:</label>
                              <input
                                type="text"
                                value={sandboxCryptoTokenName}
                                onChange={(e) => setSandboxCryptoTokenName(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold">Total Token Supply:</label>
                              <input
                                type="text"
                                value={sandboxCryptoTotalSupply}
                                onChange={(e) => setSandboxCryptoTotalSupply(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-3">
                              <label className="text-[10px] text-slate-400 font-bold">Tokenomics & Staking Mechanism Description:</label>
                              <textarea
                                rows={3}
                                value={sandboxCryptoMechanism}
                                onChange={(e) => setSandboxCryptoMechanism(e.target.value)}
                                className="w-full p-2.5 font-mono text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300"
                              />
                            </div>
                          </div>
                        )}

                        {selectedDashboardModule === 'Takaful Insurance' && (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-bold block uppercase">Takaful Risk Allocation & Operator Fee Clauses:</label>
                            <textarea
                              rows={4}
                              value={sandboxTakafulClause}
                              onChange={(e) => setSandboxTakafulClause(e.target.value)}
                              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        )}

                        {selectedDashboardModule === 'Investment Funds' && (
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-bold block uppercase">Fund Portfolio Equities Holdings List (Format: Company | Debt Ratio | Non-Compliant Rev):</label>
                            <textarea
                              rows={4}
                              value={sandboxFundHoldingsText}
                              onChange={(e) => setSandboxFundHoldingsText(e.target.value)}
                              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleRunIndustryAgentAnalysis(selectedDashboardModule)}
                            disabled={isSimulatingAI}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isSimulatingAI ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>{isRTL ? 'جاري تحليل المستندات...' : 'AI Agent Processing...'}</span>
                              </>
                            ) : (
                              <>
                                <Cpu className="w-3.5 h-3.5" />
                                <span>{isRTL ? 'مراجعة وتدقيق المستند بالذكاء الاصطناعي' : 'Run Sharia AI Compliance Audit'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* SANDBOX SIMULATED ANALYSIS RESULTS */}
                      <AnimatePresence>
                        {simulationResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 block">Analysis completed at {simulationResult.timestamp}</span>
                                <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                                  {isRTL ? 'النتيجة الفنية للامتثال والتدقيق:' : 'Sharia Compliance Verification Certificate Status'}
                                </h5>
                              </div>
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-[9px] text-slate-400 block font-bold text-right uppercase">Audit Compliance Score</span>
                                  <span className={`text-xl font-mono font-bold block text-right ${simulationResult.score >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {simulationResult.score}%
                                  </span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                                  simulationResult.certEligible 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/15'
                                }`}>
                                  {simulationResult.certEligible ? 'CERTIFICATE ISSUED' : 'CERTIFICATE BLOCKED'}
                                </span>
                              </div>
                            </div>

                            {/* Findings mapping */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{isRTL ? 'النتائج والمستندات المرتبطة:' : 'Identified Findings & Sharia Evidence Map:'}</span>
                              {simulationResult.findings.map((find: any) => (
                                <div key={find.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/20 space-y-2 text-xs">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${find.severity === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                      <span className="font-bold text-slate-950 dark:text-white">{find.rule}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                                      find.severity === 'Critical' ? 'bg-red-500/15 text-red-600' : 'bg-emerald-500/15 text-emerald-600'
                                    }`}>
                                      {find.severity}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                                    {find.finding}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <span className="font-bold block text-slate-500">Source Evidence:</span>
                                    {find.evidence}
                                  </p>
                                  {find.remediation !== 'N/A' && (
                                    <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[10px] text-slate-600 dark:text-slate-400">
                                      <span className="font-bold text-amber-600 dark:text-amber-400 block">Recommended Sharia Purifying Action:</span>
                                      {find.remediation}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TAB 3: INDUSTRY KNOWLEDGE LIBRARY (Requirement 13)
            ======================================================== */}
        {activeMarketSubTab === 'knowledge' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مكتبة المعايير والفتاوى المنهجية' : 'Sectoral Sharia Standards & fatwa Repository'}</h3>
                  <p className="text-[11px] text-slate-400">{isRTL ? 'تصفح أدلة وقرارات ومواثيق الامتثال المعتمدة لكل قطاع.' : 'Verified AAOIFI references, previous decisions, and fatwa templates.'}</p>
                </div>
                <BookOpen className="w-4 h-4 text-amber-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {knowledgeLibrary.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                        {item.industry}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{item.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => triggerToast(`Downloaded standard documentation packet for ${item.title}`)}
                        className="text-[10px] text-emerald-600 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>{isRTL ? 'تحميل الوثيقة المرجعية' : 'Download Standard Spec'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TAB 4: PARTNER MARKETPLACE (Requirement 16)
            ======================================================== */}
        {activeMarketSubTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isRTL ? 'شبكة المكاتب الاستشارية وهيئات الرقابة المعتمدة' : 'Enterprise Certified Partner Network'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRTL ? 'تواصل مباشرة مع المستشارين الشرعيين ومكاتب التدقيق وشركاء تكامل الأنظمة المرخصين.' : 'Secure external audits, compose independent Sharia Boards, or connect specialized ERP implementation partners.'}</p>
              </div>

              {/* Filtering bar */}
              <div className="flex flex-wrap gap-2 text-xs">
                <div>
                  <select
                    value={partnerFilterCategory}
                    onChange={(e) => setPartnerFilterCategory(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Categories</option>
                    <option value="Sharia Advisor">Sharia Advisors</option>
                    <option value="Audit Firm">Audit Firms</option>
                    <option value="Consultant">Consultants</option>
                    <option value="ERP Vendor">ERP Vendors</option>
                    <option value="FinTech Provider">FinTech Providers</option>
                  </select>
                </div>
                <div>
                  <select
                    value={partnerFilterCountry}
                    onChange={(e) => setPartnerFilterCountry(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Countries</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Bahrain">Bahrain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Partners list cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartnersList.map((partner) => (
                <div key={partner.id} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4`}>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                        {partner.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px] font-mono">
                        <span>★</span>
                        <span>{partner.rating}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white text-sm">{partner.company}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{partner.country}</span>
                      </p>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Services Offered:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                        {partner.services.map((serv, i) => (
                          <li key={i} className="truncate">{serv}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {partner.certifications.map((cert, ci) => (
                        <span key={ci} className="bg-slate-100 dark:bg-slate-800/80 text-[9px] px-2 py-0.5 rounded font-mono text-slate-500 dark:text-slate-300">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">{partner.contact}</span>
                    <button
                      onClick={() => triggerToast(`Requesting connection with ${partner.company}...`)}
                      className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>Connect Partner</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-TAB 5: DATABASE EXTENSIONS VIEW (Requirement 17)
            ======================================================== */}
        {activeMarketSubTab === 'db_extensions' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-500" />
                  {isRTL ? 'مفتش الهيكل والمستندات التقنية لقواعد البيانات' : 'Enterprise Database Schema & Extensions Inspector'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isRTL ? 'جدول حقيقي يوضح الإضافات المدخلة في الجداول والربط المنطقي بينها.' : 'A transparent query of dynamic custom database tables provisioned for ethical financial SaaS products.'}
                </p>
              </div>

              {/* Database Schema Visualizer */}
              <div className="space-y-6 text-xs">

                {/* Table 1: industryPackages */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/20 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
                    <span className="font-mono font-bold text-emerald-600">Table: industryPackages</span>
                    <span className="text-[10px] text-slate-400 font-mono">Fields: industry | description | rules | agents | reports</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                          <th className="pb-2">industry (PK)</th>
                          <th className="pb-2">description</th>
                          <th className="pb-2">rules (array)</th>
                          <th className="pb-2">agents (array)</th>
                          <th className="pb-2">reports (array)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {packages.map((pkg) => (
                          <tr key={pkg.id}>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">{pkg.industry}</td>
                            <td className="py-2.5 max-w-xs truncate">{pkg.description}</td>
                            <td className="py-2.5 text-slate-500">{pkg.rules.length} rules</td>
                            <td className="py-2.5 text-slate-500">{pkg.agents.join(', ')}</td>
                            <td className="py-2.5 text-slate-500">{pkg.reports.length} reports</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: industryAgents */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/20 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
                    <span className="font-mono font-bold text-emerald-600">Table: industryAgents</span>
                    <span className="text-[10px] text-slate-400 font-mono">Fields: name | industry | knowledgeBase | rules</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                          <th className="pb-2">name (PK)</th>
                          <th className="pb-2">industry (FK)</th>
                          <th className="pb-2">knowledgeBase (array)</th>
                          <th className="pb-2">rules (array)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {industryAgents.map((ag) => (
                          <tr key={ag.id}>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">{ag.name}</td>
                            <td className="py-2.5">{ag.industry}</td>
                            <td className="py-2.5 text-slate-500 max-w-xs truncate">{ag.knowledgeBase.join(', ')}</td>
                            <td className="py-2.5 text-slate-500 max-w-xs truncate">{ag.rules.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 3: industryCertifications */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/20 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
                    <span className="font-mono font-bold text-emerald-600">Table: industryCertifications</span>
                    <span className="text-[10px] text-slate-400 font-mono">Fields: type | requirements | validity | status</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                          <th className="pb-2">type (PK)</th>
                          <th className="pb-2">requirements (array)</th>
                          <th className="pb-2">validity</th>
                          <th className="pb-2">status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {industryCertifications.map((cert) => (
                          <tr key={cert.id}>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">{cert.type}</td>
                            <td className="py-2.5 text-slate-500 max-w-xs truncate">{cert.requirements.join(', ')}</td>
                            <td className="py-2.5">{cert.validity}</td>
                            <td className={`py-2.5 font-bold ${cert.status === 'Certified' ? 'text-emerald-500' : 'text-slate-400'}`}>{cert.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 4: partners */}
                <div className="p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/20 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
                    <span className="font-mono font-bold text-emerald-600">Table: partners</span>
                    <span className="text-[10px] text-slate-400 font-mono">Fields: company | category | country | services</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                          <th className="pb-2">company (PK)</th>
                          <th className="pb-2">category</th>
                          <th className="pb-2">country</th>
                          <th className="pb-2">services (array)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {partners.map((pt) => (
                          <tr key={pt.id}>
                            <td className="py-2.5 font-bold text-slate-900 dark:text-white">{pt.company}</td>
                            <td className="py-2.5">{pt.category}</td>
                            <td className="py-2.5">{pt.country}</td>
                            <td className="py-2.5 text-slate-500 max-w-xs truncate">{pt.services.join(', ')}</td>
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
