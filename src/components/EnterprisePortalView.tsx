import React, { useState, useMemo } from 'react';
import {
  Globe,
  Building2,
  Users,
  Award,
  BookOpen,
  MapPin,
  TrendingUp,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  Clock,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  Map,
  Grid,
  Percent,
  Check,
  Send,
  Download,
  Sliders,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ========================================================
// TYPES & DATA SCHEMAS (Requirement 15 & 16)
// ========================================================

export interface EnterpriseAccount {
  id: string;
  organization: string;
  country: 'Saudi Arabia' | 'UAE' | 'Malaysia' | 'Jordan' | 'Indonesia' | string;
  industry: 'Islamic Banking' | 'Conventional Windows' | 'FinTech' | 'Government' | 'Enterprise Corp';
  size: 'Enterprise' | 'Global conglomerate' | 'Mid-market';
  modulesUsed: string[];
  contracts: string; // Contract Value / Period
  complianceStatus: 'Fully Compliant' | 'Pending Review' | 'Minor Violation';
  partnerStatus: 'Strategic Partner' | 'Standard Client' | 'Integration Partner';
  maturityLevel: number; // 1 to 5 (Requirement 13)
}

export interface PartnerFirm {
  id: string;
  name: string;
  type: 'Big Four' | 'Regional Audit' | 'Independent Auditor' | 'Advisory';
  country: string;
  services: string[];
  certificationsCount: number;
  contactName: string;
}

export interface ScholarNetworkMember {
  id: string;
  name: string;
  specialization: string;
  countries: string[];
  frameworks: string[];
  experienceYears: number;
  status: 'Approved Advisor' | 'Under Review';
}

export interface GovernmentProgram {
  id: string;
  country: string;
  program: string;
  status: 'Active' | 'Under Development' | 'Drafting Legislation';
  monitoringAgency: string;
  nationalFramework: string;
}

export interface ResearchProject {
  id: string;
  institution: string;
  topic: string;
  status: 'Completed' | 'In Progress' | 'Grant Approved';
  author: string;
  publishYear: string;
  downloadsCount: number;
}

interface EnterprisePortalViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function EnterprisePortalView({
  locale,
  theme,
  onTriggerActivityLog
}: EnterprisePortalViewProps) {
  const isRTL = locale === 'ar';

  // Sub-navigation within Enterprise Portal
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'accounts' | 'banking' | 'government' | 'audit' | 'research' | 'expansion'>('dashboard');
  
  // Interactive Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(null);
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ========================================================
  // DEMO DATA (Requirement 16)
  // ========================================================

  // 1. Enterprise Customers (Requirement 15 & 16)
  const [enterpriseAccounts, setEnterpriseAccounts] = useState<EnterpriseAccount[]>([
    {
      id: 'ENT-ACC-1',
      organization: 'Islamic Bank Group',
      country: 'Saudi Arabia',
      industry: 'Islamic Banking',
      size: 'Enterprise',
      modulesUsed: ['AI Compliance Engine', 'Reporting Center', 'Audit Automation Hub'],
      contracts: '$450,000 / Annual',
      complianceStatus: 'Fully Compliant',
      partnerStatus: 'Strategic Partner',
      maturityLevel: 4 // Continuous Compliance
    },
    {
      id: 'ENT-ACC-2',
      organization: 'Global FinTech Company',
      country: 'Malaysia',
      industry: 'FinTech',
      size: 'Global conglomerate',
      modulesUsed: ['Crypto Screening API', 'Certification Platform'],
      contracts: '$220,000 / Annual',
      complianceStatus: 'Pending Review',
      partnerStatus: 'Integration Partner',
      maturityLevel: 3 // AI-Assisted Compliance
    },
    {
      id: 'ENT-ACC-3',
      organization: 'Crypto Exchange Al-Mustaqbal',
      country: 'UAE',
      industry: 'FinTech',
      size: 'Mid-market',
      modulesUsed: ['Web3 Smart Auditor', 'Instant Fatwa Recommender'],
      contracts: '$180,000 / Annual',
      complianceStatus: 'Fully Compliant',
      partnerStatus: 'Standard Client',
      maturityLevel: 2 // Managed Compliance
    },
    {
      id: 'ENT-ACC-4',
      organization: 'Batavia Sovereign Finance',
      country: 'Indonesia',
      industry: 'Conventional Windows',
      size: 'Enterprise',
      modulesUsed: ['Islamic Window purification module', 'SOP Builder'],
      contracts: '$310,000 / Annual',
      complianceStatus: 'Minor Violation',
      partnerStatus: 'Standard Client',
      maturityLevel: 1 // Basic Compliance
    }
  ]);

  // 2. Audit & Consulting Partners (Requirement 15 & 16)
  const [partners, setPartners] = useState<PartnerFirm[]>([
    {
      id: 'PART-AUD-1',
      name: 'Deloitte Sharia Advisory Division',
      type: 'Big Four',
      country: 'Saudi Arabia',
      services: ['Joint Certification', 'Compliance Reviews', 'AAOIFI Standard Readiness Reviews'],
      certificationsCount: 42,
      contactName: 'Sheikh Tariq Al-Jasser'
    },
    {
      id: 'PART-AUD-2',
      name: 'PwC Global Islamic Finance Group',
      type: 'Big Four',
      country: 'Malaysia',
      services: ['Audit Referrals', 'Continuous Governance Structuring', 'Sovereign Sukuk Advising'],
      certificationsCount: 56,
      contactName: 'Prof. Dr. Azmi Rahman'
    },
    {
      id: 'PART-AUD-3',
      name: 'An-Noor Independent Sharia Auditors',
      type: 'Regional Audit',
      country: 'Jordan',
      services: ['Halal Contract Reviews', 'Local Bank Sharia Audits'],
      certificationsCount: 19,
      contactName: 'Dr. Yaseen Al-Khaled'
    }
  ]);

  // 3. Sharia Scholar Network (Requirement 15 & 16)
  const [scholarNetwork, setScholarNetwork] = useState<ScholarNetworkMember[]>([
    {
      id: 'SCH-1',
      name: 'Sheikh Dr. Ibrahim Al-Asmar',
      specialization: 'Islamic Fiqh & Banking Contracts',
      countries: ['Saudi Arabia', 'Jordan'],
      frameworks: ['AAOIFI Standard 21', 'Dallah Al-Baraka Guidelines', 'Saudi Central Bank Regulations'],
      experienceYears: 24,
      status: 'Approved Advisor'
    },
    {
      id: 'SCH-2',
      name: 'Dr. Amina bint Abdul Latif',
      specialization: 'FinTech, Blockchain & Takaful',
      countries: ['Malaysia', 'Indonesia'],
      frameworks: ['IFSB Guidelines', 'Bank Negara Sharia Framework'],
      experienceYears: 15,
      status: 'Approved Advisor'
    },
    {
      id: 'SCH-3',
      name: 'Sheikh Yusuf Mansoor',
      specialization: 'Sukuk, Real Estate & ESG Finance',
      countries: ['UAE', 'UK'],
      frameworks: ['AAOIFI Standard 40', 'Dubai Financial Market Sharia Rules'],
      experienceYears: 18,
      status: 'Approved Advisor'
    }
  ]);

  // 4. Government Programs (Requirement 15 & 16)
  const [governmentPrograms, setGovernmentPrograms] = useState<GovernmentProgram[]>([
    {
      id: 'GOV-PROG-1',
      country: 'Saudi Arabia',
      program: 'Vision 2030 Sovereign Halal Tech Initiative',
      status: 'Active',
      monitoringAgency: 'Saudi Central Bank (SAMA)',
      nationalFramework: 'KSA National Unified Sharia Standard'
    },
    {
      id: 'GOV-PROG-2',
      country: 'UAE',
      program: 'Dubai Islamic Economy Development Accelerator',
      status: 'Active',
      monitoringAgency: 'Dubai Financial Services Authority (DFSA)',
      nationalFramework: 'DFSA Rulebook - Islamic Finance Code'
    },
    {
      id: 'GOV-PROG-3',
      country: 'Malaysia',
      program: 'Digital Bank Negara Sharia Sandbox',
      status: 'Active',
      monitoringAgency: 'Bank Negara Malaysia',
      nationalFramework: 'BNM Sharia Governance Policy Document'
    },
    {
      id: 'GOV-PROG-4',
      country: 'Jordan',
      program: 'Ethical Cooperative Agriculture Micro-finance Program',
      status: 'Drafting Legislation',
      monitoringAgency: 'Central Bank of Jordan',
      nationalFramework: 'Jordan Cooperative Islamic Finance Act'
    },
    {
      id: 'GOV-PROG-5',
      country: 'Indonesia',
      program: 'National Sharia Economy Masterplan',
      status: 'Under Development',
      monitoringAgency: 'KNEKS (National Committee for Islamic Economy)',
      nationalFramework: 'KNEKS Sharia FinTech Integration Protocol'
    }
  ]);

  // 5. Research Projects / Library (Requirement 15 & 16)
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([
    {
      id: 'RES-1',
      institution: 'King Abdulaziz University',
      topic: 'Integrating Large Language Models in AAOIFI Audit Workflows',
      status: 'Completed',
      author: 'Dr. Rashed Al-Qahtani',
      publishYear: '2025',
      downloadsCount: 412
    },
    {
      id: 'RES-2',
      institution: 'International Islamic University Malaysia (IIUM)',
      topic: 'Takaful Smart Contracts: Verification of Mutual Insurance Pools on Corda Blockchain',
      status: 'Completed',
      author: 'Prof. Wan Ahmad',
      publishYear: '2026',
      downloadsCount: 520
    },
    {
      id: 'RES-3',
      institution: 'Zamil Center for Islamic Banking',
      topic: 'AI-Guided Bias Avoidance in Micro-Sovereign Sukuk Distribution',
      status: 'In Progress',
      author: 'Sarah Jenkins & Dr. Omar Farooq',
      publishYear: '2026',
      downloadsCount: 185
    }
  ]);

  // 6. Global Expansion Industry Roadmap (Requirement 9)
  const [roadmapIndustries, setRoadmapIndustries] = useState([
    { id: 'ind-ib', name: 'Islamic Banking Core', developmentStatus: 'Production Ready', launchDate: 'Launched', marketStatus: 'High Adoption' },
    { id: 'ind-takaful', name: 'Takaful Insurance Systems', developmentStatus: 'Active Beta', launchDate: 'Q3 2026', marketStatus: 'Emerging Demand' },
    { id: 'ind-crypto', name: 'Crypto & Web3 Screening', developmentStatus: 'Active Beta', launchDate: 'Q4 2026', marketStatus: 'Rapid Growth' },
    { id: 'ind-fintech', name: 'FinTech Sandbox Rules', developmentStatus: 'In Development', launchDate: 'Q1 2027', marketStatus: 'High Strategic' },
    { id: 'ind-health', name: 'Healthcare & Waqf Finance', developmentStatus: 'Research Phase', launchDate: 'Q2 2027', marketStatus: 'Moderate' },
    { id: 'ind-realestate', name: 'Islamic Real Estate Murabaha', developmentStatus: 'Active Beta', launchDate: 'Q1 2027', marketStatus: 'High demand' },
    { id: 'ind-supply', name: 'Halal Supply Chain Tracking', developmentStatus: 'Research Phase', launchDate: 'Q3 2027', marketStatus: 'Moderate' },
    { id: 'ind-esg', name: 'Green Sukuk & ESG Overlay', developmentStatus: 'In Development', launchDate: 'Q1 2027', marketStatus: 'Critical Horizon' },
    { id: 'ind-aigov', name: 'Sharia AI Model Governance', developmentStatus: 'Active Beta', launchDate: 'Q3 2026', marketStatus: 'Immediate Requirement' }
  ]);

  // AI Governance Framework States (Requirement 10)
  const [aiTransparencyPct, setAiTransparencyPct] = useState(98);
  const [aiAuditabilityStatus, setAiAuditabilityStatus] = useState('Enabled (Daily cryptographic ledger logging)');
  const [humanOversightModel, setHumanOversightModel] = useState('Cooperative Advisory Override (Scholars review all red flags)');
  const [modelMonitoringState, setModelMonitoringState] = useState('Real-time checking for rule drift');
  const [biasDetectionEnabled, setBiasDetectionEnabled] = useState(true);
  const [showAiGovReportModal, setShowAiGovReportModal] = useState(false);

  // Future Certification Partners (Requirement 11)
  const [certificationPartners, setCertificationPartners] = useState([
    { id: 'CA-1', name: 'Global Sharia Standards Council', region: 'Global', approvedReviewers: 14, certificatesIssued: 245 },
    { id: 'CA-2', name: 'Amanah Advisory Advisory Board', region: 'Europe & UK', approvedReviewers: 6, certificatesIssued: 88 },
    { id: 'CA-3', name: 'Nusantara Sharia Certification Inst', region: 'Southeast Asia', approvedReviewers: 18, certificatesIssued: 312 }
  ]);

  // Enterprise Implementation Framework state (Requirement 12)
  const [selectedOnboardingBank, setSelectedOnboardingBank] = useState('Islamic Bank Group');
  const [implementationPhases, setImplementationPhases] = useState([
    { id: 1, name: 'Phase 1: Discovery & Legal Feasibility', status: 'Completed', details: 'Requirements mapped to AAOIFI Standards' },
    { id: 2, name: 'Phase 2: Compliance Rulebook Mapping', status: 'Completed', details: 'Translation of local centralized bank decrees to machine formulas' },
    { id: 3, name: 'Phase 3: Core ERP & Banking Ledger Integration', status: 'Completed', details: 'Connected SAP banking ledger to ICAP stream' },
    { id: 4, name: 'Phase 4: AI Sharia Agent Configuration', status: 'In Progress', details: 'Injecting custom fatwas and investment screening lists' },
    { id: 5, name: 'Phase 5: Automated Testing & Validation', status: 'Pending', details: 'Fuzzing historical transaction ledger for false positives' },
    { id: 6, name: 'Phase 6: Independent Scholar Certification', status: 'Pending', details: 'Audit referral and signing of verified certificate code' },
    { id: 7, name: 'Phase 7: Continuous Monitoring & Safeguard', status: 'Pending', details: 'Activating real-time watchdog' }
  ]);

  // Interactive Form States to add New Enterprise Account
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCountry, setNewOrgCountry] = useState('Saudi Arabia');
  const [newOrgIndustry, setNewOrgIndustry] = useState<'Islamic Banking' | 'Conventional Windows' | 'FinTech' | 'Government' | 'Enterprise Corp'>('Islamic Banking');
  const [newOrgSize, setNewOrgSize] = useState<'Enterprise' | 'Global conglomerate' | 'Mid-market'>('Enterprise');
  const [newOrgModules, setNewOrgModules] = useState('AI Compliance Engine, Reporting Center');
  const [newOrgContract, setNewOrgContract] = useState('$250,000 / Annual');
  const [newOrgMaturity, setNewOrgMaturity] = useState(3);

  const handleCreateEnterpriseAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const newAcc: EnterpriseAccount = {
      id: `ENT-ACC-${Math.floor(Math.random() * 1000) + 100}`,
      organization: newOrgName,
      country: newOrgCountry,
      industry: newOrgIndustry,
      size: newOrgSize,
      modulesUsed: newOrgModules.split(',').map(s => s.trim()),
      contracts: newOrgContract,
      complianceStatus: 'Fully Compliant',
      partnerStatus: 'Standard Client',
      maturityLevel: Number(newOrgMaturity)
    };

    setEnterpriseAccounts(prev => [...prev, newAcc]);
    onTriggerActivityLog('CREATE_ENTERPRISE_ACCOUNT', `Registered global institutional account: ${newOrgName} (Maturity level ${newOrgMaturity})`);
    triggerToast(`Enterprise Account for "${newOrgName}" successfully onboarded!`);
    
    // reset form
    setNewOrgName('');
    setNewOrgContract('$250,000 / Annual');
  };

  // Interactive Action to promote maturity level (Requirement 13)
  const promoteMaturity = (id: string) => {
    setEnterpriseAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextLevel = Math.min(acc.maturityLevel + 1, 5);
        onTriggerActivityLog('PROMOTE_ENTERPRISE_MATURITY', `Upgraded ${acc.organization} Sharia Governance maturity to Level ${nextLevel}`);
        triggerToast(`${acc.organization} promoted to Maturity Level ${nextLevel}!`);
        return { ...acc, maturityLevel: nextLevel };
      }
      return acc;
    }));
  };

  // Interactive Scholar Standards review vote simulation
  const [pendingStandardsToReview, setPendingStandardsToReview] = useState([
    { id: 'STD-REV-1', title: 'AAOIFI Standard 21 (Financial Assets Regulation)', proposer: 'Safwa Capital Ltd', votesApproved: ['Sheikh Dr. Ibrahim Al-Asmar'], votesPending: ['Dr. Amina bint Abdul Latif', 'Sheikh Yusuf Mansoor'], status: 'Under Peer Review' },
    { id: 'STD-REV-2', title: 'Cryptographic Liquidity Pool Purification Algorithm', proposer: 'Makkah Blockchain Labs', votesApproved: ['Dr. Amina bint Abdul Latif'], votesPending: ['Sheikh Dr. Ibrahim Al-Asmar', 'Sheikh Yusuf Mansoor'], status: 'Under Peer Review' }
  ]);

  const castScholarVote = (stdId: string, scholarName: string, approval: boolean) => {
    setPendingStandardsToReview(prev => prev.map(std => {
      if (std.id === stdId) {
        const alreadyApproved = std.votesApproved.includes(scholarName);
        if (alreadyApproved) return std;
        
        const newApproved = approval ? [...std.votesApproved, scholarName] : std.votesApproved;
        const newPending = std.votesPending.filter(s => s !== scholarName);
        const finalStatus = newApproved.length >= 2 ? 'Approved Framework' : 'Under Peer Review';

        if (finalStatus === 'Approved Framework') {
          onTriggerActivityLog('SCHOLAR_FRAMEWORK_APPROVED', `Sharia Scholar consensus achieved for framework: "${std.title}"`);
          triggerToast(`Consensus achieved! "${std.title}" is now an APPROVED FRAMEWORK inside the compliance dictionary.`);
        } else {
          onTriggerActivityLog('SCHOLAR_FRAMEWORK_VOTE', `${scholarName} cast an approval vote for "${std.title}"`);
          triggerToast(`Vote registered for ${scholarName}`);
        }

        return {
          ...std,
          votesApproved: newApproved,
          votesPending: newPending,
          status: finalStatus as any
        };
      }
      return std;
    }));
  };

  // Strategic Analytics totals calculations (Requirement 14)
  const executiveMetrics = useMemo(() => {
    const totalRevenue = enterpriseAccounts.length * 240000; // simulated SaaS license recurring revenue
    const countriesCount = Array.from(new Set(enterpriseAccounts.map(e => e.country))).length;
    const certsCount = partners.reduce((sum, p) => sum + p.certificationsCount, 0);
    const scholarsCount = scholarNetwork.length;
    
    return {
      globalCustomers: enterpriseAccounts.length,
      countriesCovered: countriesCount + 3, // demo coverage factor
      certificatesIssued: certsCount + 48,
      complianceEventsAudited: 124800,
      aiDecisionsResolved: 94820,
      estimatedAnnualRevenue: totalRevenue
    };
  }, [enterpriseAccounts, partners, scholarNetwork]);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP ENTERPRISE LEVEL COMMAND HEADER */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3.5 rounded-2xl text-amber-500 shadow-inner">
              <Globe className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'بوابة ومنظومة الخدمات المؤسسية العالمية' : 'ICAP Global Enterprise Strategy Portal'}
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-sans border border-amber-500/15">
                  Infrastructure Layer
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {isRTL
                  ? 'بوابة استراتيجية موحدة مصممة للهيئات الحكومية والمؤسسات المالية العالمية والجامعات لإدارة حوكمة الامتثال والتدقيق الشرعي الرقمي.'
                  : 'The unifying enterprise command deck designed for multinational banking groups, state regulators, audit networks, and Sharia scholars to regulate, monitor, and scale continuous compliance governance.'}
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Sub-Tabs (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150/40 dark:border-slate-800/80 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة القيادة الاستراتيجية' : 'Strategic Dashboard', icon: TrendingUp },
            { id: 'accounts', name: isRTL ? 'الحسابات والمؤسسات' : 'Enterprise Accounts', icon: Building2 },
            { id: 'banking', name: isRTL ? 'منظومة الشركاء والفقهاء' : 'Banking & Scholars Hub', icon: Users },
            { id: 'government', name: isRTL ? 'البرامج والهيئات الحكومية' : 'Government Programs', icon: Award },
            { id: 'audit', name: isRTL ? 'شبكة مكاتب التدقيق العالمية' : 'Audit Firm Network', icon: Shield },
            { id: 'research', name: isRTL ? 'البحوث والجامعات' : 'Research Center', icon: BookOpen },
            { id: 'expansion', name: isRTL ? 'خريطة التوسع والحوكمة' : 'Expansion & AI Governance', icon: MapPin }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
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

      {/* TOAST ALERTS */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/20 flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold font-sans">{toast}</span>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 1: STRATEGIC DASHBOARD & GLOBAL MAP (Requirement 1, 8, 14)
          ======================================================== */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Global Enterprise Stats Row (Requirement 14) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Global Customers', value: executiveMetrics.globalCustomers, desc: 'Large scale institutions', icon: Building2 },
              { label: 'Countries Covered', value: executiveMetrics.countriesCovered, desc: 'Multinational reach', icon: Globe },
              { label: 'Certificates Issued', value: executiveMetrics.certificatesIssued, desc: 'Pre-certified ledger systems', icon: Award },
              { label: 'Compliance Audited', value: executiveMetrics.complianceEventsAudited.toLocaleString(), desc: 'Transaction cycles', icon: Activity },
              { label: 'AI Decisions Resolved', value: executiveMetrics.aiDecisionsResolved.toLocaleString(), desc: 'Through legal models', icon: CheckCircle2 },
              { label: 'Est. Annual Contract ARR', value: `$${(executiveMetrics.estimatedAnnualRevenue / 1000).toFixed(0)}k`, desc: 'SaaS recurring volume', icon: DollarSign }
            ].map((metric, i) => (
              <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} space-y-1`}>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider">{metric.label}</span>
                  <metric.icon className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-slate-950 dark:text-white font-mono">{metric.value}</div>
                <div className="text-[9px] text-slate-400 font-sans">{metric.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* World Map Section (Requirement 8) */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Map className="w-4 h-4 text-amber-500" /> Global Compliance Intelligence Map
                    </h3>
                    <p className="text-[10px] text-slate-400">Continuous monitoring jurisdictions and accredited sovereign partners.</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded font-mono text-slate-500">Live Synchronization: OK</span>
                </div>

                {/* Stylized Interactive Map Grid */}
                <div className="p-8 rounded-xl bg-slate-950 text-white min-h-[280px] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                  
                  {/* Geographic Node list overlay simulating regions requested (Middle East, Asia, Europe, Africa, North America) */}
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { region: 'North America', status: 'Expanding', coverage: '3 Corps', certs: 14, color: 'text-blue-400' },
                      { region: 'Europe & UK', status: 'Active', coverage: '5 Hubs', certs: 88, color: 'text-amber-400' },
                      { region: 'Middle East', status: 'Dominant', coverage: '24 Banks', certs: 412, color: 'text-emerald-400' },
                      { region: 'Africa', status: 'Emerging', coverage: '2 Regulators', certs: 18, color: 'text-purple-400' },
                      { region: 'Southeast Asia', status: 'Dominant', coverage: '18 Entities', certs: 312, color: 'text-emerald-400' }
                    ].map((node, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[11px] font-bold">{node.region}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{node.coverage}</div>
                        <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[9px] font-mono text-slate-400">
                          <span>Certs:</span>
                          <span className={node.color}>{node.certs}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 pt-4 border-t border-slate-850 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
                    <p className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Regulatory updates automatically synchronized with central Sharia boards.</span>
                    </p>
                    <button
                      onClick={() => triggerToast('Generating international regulatory reports for Q3 2026...')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-white rounded font-bold font-sans"
                    >
                      Export Coverage Data
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Strategic Partners Breakdown Timeline */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" /> Strategic Alignment Roadmap
                </h3>
                
                <div className="space-y-3.5 text-xs">
                  {[
                    { title: 'Sovereign Integration (KSA)', desc: 'Connecting state database registries with ICAP verified tokens.', date: 'Q3 2026', step: '92% completed' },
                    { title: 'Big Four Audit Consortium', desc: 'Pre-onboarding 40 partners to refer continuous audit validation pipelines.', date: 'Q4 2026', step: 'Active pilot' },
                    { title: 'Universities Library Expansion', desc: 'Deploying ICAP SDK tokens to 15 Islamic Finance research laboratories.', date: 'Q1 2027', step: 'Contracts signed' }
                  ].map((item, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-amber-500/30 space-y-1">
                      <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[5px] top-1.5" />
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-950 dark:text-white">{item.title}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 rounded">{item.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                      <span className="text-[10px] text-emerald-600 font-mono block">{item.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: ENTERPRISE ACCOUNTS & CUSTOMER MATURITY (Requirement 2, 13)
          ======================================================= */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List of Accounts */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
                    Institutional Enterprise Relationships ({enterpriseAccounts.length})
                  </h3>
                  <p className="text-[11px] text-slate-400">Active bank groups, FinTechs, and corporate sovereign partners.</p>
                </div>

                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-full text-[11px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3.5">
                {enterpriseAccounts
                  .filter(acc => acc.organization.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(acc => (
                    <div
                      key={acc.id}
                      className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4 hover:shadow-md transition`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{acc.organization}</h4>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 font-sans">
                              {acc.country}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">Industry Focus: {acc.industry} · Size: {acc.size}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            acc.complianceStatus === 'Fully Compliant' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25' :
                            acc.complianceStatus === 'Pending Review' ? 'bg-amber-500/10 text-amber-600 border-amber-500/25' :
                            'bg-red-500/10 text-red-600 border-red-500/25'
                          }`}>
                            {acc.complianceStatus}
                          </span>
                          <span className="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-1 rounded font-bold">
                            {acc.partnerStatus}
                          </span>
                        </div>
                      </div>

                      {/* Maturity model indicator (Requirement 13) */}
                      <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            SHARIA GOVERNANCE MATURITY LEVEL:
                          </span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            Level {acc.maturityLevel} of 5 — {
                              acc.maturityLevel === 1 ? 'Basic Compliance' :
                              acc.maturityLevel === 2 ? 'Managed Compliance' :
                              acc.maturityLevel === 3 ? 'AI-Assisted Compliance' :
                              acc.maturityLevel === 4 ? 'Continuous Compliance' :
                              'Intelligent Governance'
                            }
                          </span>
                        </div>

                        {/* Visual Step Level Tracker */}
                        <div className="grid grid-cols-5 gap-1.5">
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            const isAchieved = lvl <= acc.maturityLevel;
                            return (
                              <div key={lvl} className="space-y-1">
                                <div className={`h-1.5 rounded-full ${isAchieved ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                <span className={`text-[8px] block text-center font-sans ${isAchieved ? 'text-slate-800 dark:text-slate-300 font-bold' : 'text-slate-400'}`}>
                                  L{lvl}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Systems integration, module breakdown & promotion */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-850 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">ACTIVE CONTRACT PIPELINE</span>
                          <span className="font-bold text-slate-950 dark:text-white font-mono">{acc.contracts}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {acc.maturityLevel < 5 ? (
                            <button
                              onClick={() => promoteMaturity(acc.id)}
                              className="px-3 py-1.5 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl font-bold font-sans"
                            >
                              Promote Maturity Level
                            </button>
                          ) : (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold">
                              ✓ Reached Peak Maturity
                            </span>
                          )}
                          <button
                            onClick={() => triggerToast(`Viewing technical environment profiles for ${acc.organization}...`)}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-sans"
                          >
                            Systems Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Add New Enterprise Customer Profile */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-xs uppercase tracking-wider">
                      Onboard Enterprise Client
                    </h4>
                    <p className="text-[10px] text-slate-400">Register corporate conglomerate or sovereign fund.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateEnterpriseAccount} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ORGANIZATION NAME</label>
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500 font-bold"
                      placeholder="e.g. Al-Baraka Islamic Holdings"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">COUNTRY</label>
                      <select
                        value={newOrgCountry}
                        onChange={(e) => setNewOrgCountry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none"
                      >
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="UAE">UAE</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">INDUSTRY TYPE</label>
                      <select
                        value={newOrgIndustry}
                        onChange={(e) => setNewOrgIndustry(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none"
                      >
                        <option value="Islamic Banking">Islamic Banking</option>
                        <option value="Conventional Windows">Conventional Windows</option>
                        <option value="FinTech">FinTech</option>
                        <option value="Government">Government</option>
                        <option value="Enterprise Corp">Enterprise Corp</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">CONTRACT VAL</label>
                      <input
                        type="text"
                        value={newOrgContract}
                        onChange={(e) => setNewOrgContract(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none"
                        placeholder="e.g. $400,000 / Annual"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">START MATURITY</label>
                      <select
                        value={newOrgMaturity}
                        onChange={(e) => setNewOrgMaturity(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none"
                      >
                        <option value="1">Level 1 (Basic)</option>
                        <option value="2">Level 2 (Managed)</option>
                        <option value="3">Level 3 (AI-Assisted)</option>
                        <option value="4">Level 4 (Continuous)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">INTEGRATED CORE MODULES</label>
                    <input
                      type="text"
                      value={newOrgModules}
                      onChange={(e) => setNewOrgModules(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none text-[11px]"
                      placeholder="AI Compliance, SOP monitoring, audit certificates"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-950 text-white font-bold rounded-xl hover:bg-slate-850 transition"
                  >
                    Onboard & Initialize Framework
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: BANKING PARTNERS & SCHOLARS (Requirement 3, 5)
          ======================================================= */}
      {activeSubTab === 'banking' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Banking Partnerships Tracker (Requirement 3) */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-500" /> Banking Partnership Framework
                  </h3>
                  <p className="text-[10px] text-slate-400">Enabling core banking integrations across fully Islamic, Digital, and Islamic Windows.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {[
                    { name: 'Islamic Bank Group', type: 'Full Islamic Bank', connected: 'SAP Finance Gateway & Oracle Ledger', certificates: '3 Active Certificates', scope: 'AAOIFI Standard 21, SCB Rules' },
                    { name: 'Al-Rajhi Digital Sandbox', type: 'Digital Bank', connected: 'Corda Private Node', certificates: '1 Active Certificate', scope: 'Web3 Token Smart Auditing' },
                    { name: 'Riyadh Commerce Windows', type: 'Traditional with Islamic Window', connected: 'Custom REST API Middleware', certificates: '2 Active Certificates', scope: 'Purification & Non-Riba Ledger Partitioning' }
                  ].map((bank, i) => (
                    <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-950 dark:text-white">{bank.name}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 rounded font-sans">{bank.type}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-500">
                        <p><strong>Systems Connected:</strong> {bank.connected}</p>
                        <p><strong>Compliance Scope:</strong> {bank.scope}</p>
                        <p className="text-emerald-600 font-mono"><strong>Status:</strong> {bank.certificates}</p>
                      </div>
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-850 flex justify-between">
                        <button
                          onClick={() => triggerToast(`Initiating manual audit reconciliation protocol with ${bank.name}...`)}
                          className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          Trigger Audit Sync
                        </button>
                        <span className="text-[9px] text-slate-400">Ver. 2.15</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sharia scholar standards review mapping board (Requirement 5) */}
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Scholars Collaborative Approval Board
                  </h3>
                  <p className="text-[10px] text-slate-400">Scholars review, debate, and consensus-approve standards mapping formulas before production deployment.</p>
                </div>

                <div className="space-y-3">
                  {pendingStandardsToReview.map(std => (
                    <div key={std.id} className="p-4 bg-slate-50/20 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-mono">PROPOSED BY: {std.proposer}</span>
                          <span className="font-bold text-slate-950 dark:text-white text-xs">{std.title}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${std.status === 'Approved Framework' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                          {std.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Approval Progress:</div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-2">
                            {std.votesApproved.map((app, idx) => (
                              <span key={idx} className="bg-emerald-500/10 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                                <Check className="w-3 h-3" /> {app} Approved
                              </span>
                            ))}
                          </div>
                          
                          {std.votesPending.length > 0 && (
                            <div className="pt-1.5 flex flex-wrap items-center gap-2">
                              <span className="text-[9px] text-slate-400 font-sans italic">Awaiting scholar reviews:</span>
                              {std.votesPending.map((pnd, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-2 py-1 rounded">
                                  <span className="text-[10px] text-slate-500">{pnd}</span>
                                  <button
                                    onClick={() => castScholarVote(std.id, pnd, true)}
                                    className="text-[9px] bg-amber-500 hover:bg-amber-600 text-slate-950 px-1.5 py-0.5 rounded-md font-bold"
                                  >
                                    Approve
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scholars Directory (Requirement 5) */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" /> Sharia Scholar Advisory Network
                  </h3>
                  <p className="text-[10px] text-slate-400">Accredited global jurists validating ICAP logic systems.</p>
                </div>

                <div className="space-y-3">
                  {scholarNetwork.map(sch => (
                    <div key={sch.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 dark:text-white">{sch.name}</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 rounded">{sch.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-500"><strong>Specialization:</strong> {sch.specialization}</p>
                      <p className="text-[10px] text-slate-400"><strong>Approved Frameworks:</strong> {sch.frameworks.join(', ')}</p>
                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850 flex justify-between text-[10px] text-slate-400">
                        <span><strong>Experience:</strong> {sch.experienceYears} Years</span>
                        <span>{sch.countries.join(', ')}</span>
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
          SUB-TAB 4: GOVERNMENT PROGRAMS & NATIVE COMPLIANCE (Requirement 6)
          ======================================================= */}
      {activeSubTab === 'government' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* National Compliance Framework Board */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Government Sandbox & Regulatory Programs
                  </h3>
                  <p className="text-[11px] text-slate-400">Enabling central bank registries to monitor industry compliance in real-time.</p>
                </div>

                <div className="space-y-3.5">
                  {governmentPrograms.map(prog => (
                    <div key={prog.id} className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150/40 dark:border-slate-800/40 rounded-xl space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-slate-400 text-[10px] font-mono">{prog.country}</span>
                          <h4 className="font-bold text-slate-950 dark:text-white text-xs">{prog.program}</h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                          prog.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' :
                          prog.status === 'Under Development' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-purple-500/10 text-purple-600'
                        }`}>
                          {prog.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-850">
                        <p><strong>Monitoring Agency:</strong> {prog.monitoringAgency}</p>
                        <p><strong>National Compliance Framework:</strong> {prog.nationalFramework}</p>
                      </div>

                      <div className="pt-1.5 flex justify-between items-center text-[10px]">
                        <button
                          onClick={() => triggerToast(`Requesting regulatory oversight log stream for ${prog.country}...`)}
                          className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                        >
                          View Oversight Logs
                        </button>
                        <span className="text-slate-400">Agency ID: SCB-GOV-{prog.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Monitoring Indicators */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  National Sandbox Telemetry
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">TOTAL SCANDINAVIAN INTEGRATED SCHEMES</span>
                    <div className="font-mono font-bold text-base text-slate-950 dark:text-white">5 Active Sandboxes</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">REAL-TIME GOVERNMENT TELEMETRY SIGNALS</span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>SAMA Saudi Central Bank</span>
                        <span className="text-emerald-500 font-bold font-mono">100% Synced</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full" />
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span>Bank Negara Malaysia (BNM)</span>
                        <span className="text-emerald-500 font-bold font-mono">100% Synced</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full" />
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span>Indonesia KNEKS Masterplan</span>
                        <span className="text-amber-500 font-bold font-mono">82% Configured</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-4/5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => triggerToast('Generating Government Regulatory Briefing PDF...')}
                      className="w-full py-2 bg-slate-950 text-white font-bold rounded-xl text-center text-xs"
                    >
                      Export Sandbox Guidelines
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: AUDIT FIRM NETWORK (Requirement 4)
          ======================================================= */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Partners list */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
                Certified Sharia Audit Partners
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {partners.map(p => (
                  <div key={p.id} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-3 flex flex-col justify-between`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                          {p.type}
                        </span>
                        <span className="text-slate-400 text-[10px]">{p.country}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                      <p className="text-[11px] text-slate-500"><strong>Assigned Lead:</strong> {p.contactName}</p>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">CAPABILITIES:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.services.map((serv, idx) => (
                            <span key={idx} className="bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded">
                              {serv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Verified Certs: <strong>{p.certificationsCount} issued</strong></span>
                      <button
                        onClick={() => triggerToast(`Submitting referral audit request to ${p.name}...`)}
                        className="text-amber-600 dark:text-amber-400 font-bold hover:underline text-[11px] flex items-center gap-1"
                      >
                        Refer Audit <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Referral Program Info */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Audit Ecosystem Benefits
                </h3>
                
                <div className="space-y-3 text-xs leading-relaxed text-slate-500">
                  <p>ICAP collaborates directly with Big Four and niche Islamic audit firms, allowing them to:</p>
                  <ul className="list-disc pl-4 space-y-2 text-[11px]">
                    <li>Instantly verify ledger tangibility ratios and debt metrics via pre-compiled formulas.</li>
                    <li>Settle continuous audit checkpoints without reviewing manual spreadsheets or PDFs.</li>
                    <li>Refer clients to the ICAP continuous auditing watchdog and earn strategic integration commissions.</li>
                  </ul>

                  <button
                    onClick={() => triggerToast('Initiating partnership registration workflow...')}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-center"
                  >
                    Apply as Audit Partner
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 6: RESEARCH CENTER & UNIVERSITY COLLAB (Requirement 7)
          ======================================================= */}
      {activeSubTab === 'research' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Research Papers Library */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
                    Academic Compliance Studies Library
                  </h3>
                  <p className="text-[11px] text-slate-400">Cooperative research publications advancing automated Sharia reasoning logic.</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {researchProjects.map(proj => (
                  <div key={proj.id} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-3 text-xs`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">{proj.institution}</span>
                        <h4 className="font-bold text-slate-950 dark:text-white text-xs">{proj.topic}</h4>
                      </div>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 rounded-full font-bold">
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500"><strong>Author:</strong> {proj.author} · Year: {proj.publishYear}</p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Downloads: <strong>{proj.downloadsCount} times</strong></span>
                      <button
                        onClick={() => triggerToast(`Downloading PDF document for study: "${proj.topic}"`)}
                        className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        Download study paper <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* University Grant Program info */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Academic Analytics
                </h3>
                
                <div className="space-y-3 text-xs text-slate-500">
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400">COOPERATING UNIVERSITIES</span>
                    <div className="text-lg font-bold text-slate-950 dark:text-white font-mono">14 Global Labs</div>
                  </div>

                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-400">STUDENT SDK ACCREDITATIONS</span>
                    <div className="text-lg font-bold text-slate-950 dark:text-white font-mono">1,240 Certified Students</div>
                  </div>

                  <p className="text-[11px] leading-relaxed pt-2">ICAP supplies free sandbox environments and API developer credentials to accredited researchers writing Fiqh financial algorithms.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 7: GLOBAL ROADMAP & AI GOVERNANCE (Requirement 9, 10, 11, 12)
          ======================================================= */}
      {activeSubTab === 'expansion' && (
        <div className="space-y-6">
          
          {/* Top Banner introducing AI Governance Report Trigger */}
          <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-display">
                  <Scale className="w-5 h-5 text-amber-500" /> AI Governance and Ethical Auditability Framework
                </h3>
                <p className="text-xs text-slate-400">Generate on-screen official AI model compliance auditing reports for enterprise stakeholders.</p>
              </div>
              <button
                onClick={() => setShowAiGovReportModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl shadow-md text-xs hover:opacity-90 transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Generate AI Governance Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Future Industry Roadmap (Requirement 9) */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Future Sharia Industry Roadmaps
                  </h3>
                  <p className="text-[11px] text-slate-400">Continuous rollout strategy into adjacent financial sectors.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {roadmapIndustries.map(ind => (
                    <div key={ind.id} className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 dark:text-white">{ind.name}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 rounded">{ind.launchDate}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Development:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-bold">{ind.developmentStatus}</span>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Market Potential:</span>
                        <span className="text-emerald-600 font-bold">{ind.marketStatus}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-end">
                        <button
                          onClick={() => {
                            setRoadmapIndustries(prev => prev.map(item => {
                              if (item.id === ind.id) {
                                return { ...item, developmentStatus: 'Beta Active' };
                              }
                              return item;
                            }));
                            onTriggerActivityLog('ACTIVATE_ROADMAP_INDUSTRY', `Accelerated pilot program for ${ind.name}`);
                            triggerToast(`Accelerated development pilot for ${ind.name}`);
                          }}
                          className="text-[9px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                        >
                          Accelerate Pilot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Implementation Framework Checklist (Requirement 12) & Future Certification Partners (Requirement 11) */}
            <div className="space-y-6">
              
              {/* Implementation Phases Tracker */}
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-500" /> Enterprise Implementation Phases
                  </h3>
                  <p className="text-[10px] text-slate-400">Standardized 7-stage client onboarding pipeline.</p>
                </div>

                <div className="space-y-3 text-xs">
                  {implementationPhases.map(phase => (
                    <div key={phase.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-950 dark:text-white">{phase.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 rounded ${
                          phase.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          phase.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {phase.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{phase.details}</p>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setImplementationPhases(prev => prev.map(p => {
                          if (p.id === 5) {
                            return { ...p, status: 'Completed' };
                          }
                          return p;
                        }));
                        triggerToast('Phase 5 (Automated Testing & Validation) verified as completed!');
                        onTriggerActivityLog('PROMOTE_IMPLEMENTATION_PHASE', 'Completed Phase 5 validation checks for active onboarding');
                      }}
                      className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                    >
                      Advance Onboarding Step
                    </button>
                  </div>
                </div>
              </div>

              {/* Future Certification Authority model (Requirement 11) */}
              <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Global Certification Authority Partners
                  </h3>
                  <p className="text-[10px] text-slate-400">Independent bodies empowered to sign ICAP Verified certificates.</p>
                </div>

                <div className="space-y-2 text-xs">
                  {certificationPartners.map(ca => (
                    <div key={ca.id} className="p-2.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-bold block text-slate-900 dark:text-white">{ca.name}</span>
                        <span className="text-[9px] text-slate-400">{ca.region}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] block font-bold text-slate-800 dark:text-slate-300">{ca.certificatesIssued} issued</span>
                        <span className="text-[9px] text-slate-400">{ca.approvedReviewers} approved auditors</span>
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
          AI GOVERNANCE EXPORTABLE REPORT MODAL (Requirement 10)
          ======================================================== */}
      <AnimatePresence>
        {showAiGovReportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl rounded-2xl ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-950'} p-6 border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto`}
            >
              
              {/* Report Header */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">ICAP System-wide AI Governance Compliance Report</h3>
                    <p className="text-[10px] text-slate-400">Regulatory Code validation & Model Auditability parameters</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiGovReportModal(false)}
                  className="text-slate-400 hover:text-slate-200 text-sm font-bold font-mono bg-slate-100 dark:bg-slate-850 p-1.5 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Report Content */}
              <div className="space-y-4 text-xs">
                
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[10px]">VERIFIED TRUST CERTIFICATION</span>
                  <p>All active compliance inference queries are mapped back to established AAOIFI Sharia rules using cryptographic log tracing. No unexplainable black-box logic was found during automatic daily regression runs.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-1">Model Transparency Score</span>
                    <div className="font-mono font-bold text-base text-emerald-500">{aiTransparencyPct}% Transparent</div>
                    <span className="text-[9px] text-slate-400 font-sans block mt-1">All logic matches standard fatwas exactly.</span>
                  </div>

                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold mb-1">System Auditability Status</span>
                    <div className="font-mono font-bold text-[11px] text-slate-900 dark:text-white mt-1">{aiAuditabilityStatus}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">OVERSIGHT & DRIFT DEEP-DIVE</span>
                  
                  <div className="space-y-2.5 p-3.5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Human oversight mode:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{humanOversightModel}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Drift & bias monitoring:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{modelMonitoringState}</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Active anti-bias algorithms:</span>
                      <strong className="text-emerald-500">{biasDetectionEnabled ? 'ACTIVE (SAMA Accreditations)' : 'Disabled'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 space-y-1.5 text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-white block uppercase text-[10px]">Cryptographic Seal</span>
                  <p className="font-mono text-[10px] break-all text-slate-400">
                    sha256: 04e38bd90a4dfb88e1a613d7d4bf09f98ca78df7c3ef2713e5138f32dae83348f90ee
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end gap-3 text-xs">
                <button
                  onClick={() => setShowAiGovReportModal(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-500 rounded-xl"
                >
                  Close Report
                </button>
                <button
                  onClick={() => {
                    triggerToast('AI Governance Compliance Report successfully saved as PDF!');
                    setShowAiGovReportModal(false);
                    onTriggerActivityLog('DOWNLOAD_AI_GOVERNANCE_REPORT', 'Generated formal cryptographic AI governance certificate');
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signed PDF</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
