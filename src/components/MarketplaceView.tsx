import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Cpu,
  Layers,
  Database,
  FileText,
  Users,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  Download,
  CheckCircle2,
  Settings,
  HelpCircle,
  Clock,
  Star,
  Activity,
  Code,
  DollarSign,
  Briefcase,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  Check,
  ShieldAlert,
  BookOpen,
  Share2,
  Trash2,
  BarChart3,
  CreditCard,
  Play,
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ========================================================
// TYPES & DATA SCHEMAS (Requirement 17)
// ========================================================

export interface MarketplaceProduct {
  id: string;
  name: string;
  type: 'AI Agent' | 'Application' | 'Connector' | 'Template';
  developer: string;
  price: number;
  pricingModel: 'One-time' | 'Subscription' | 'Usage-based' | 'Free';
  status: 'Published' | 'Under Review' | 'Draft';
  rating: number;
  reviewsCount: number;
  downloads: number;
  certificationLevel: 'Verified' | 'Certified' | 'Enterprise Certified';
  description: string;
  capabilities: string[];
  industry: string;
  isInstalled: boolean;
}

export interface DeveloperAccount {
  id: string;
  developer: string;
  applications: number;
  revenue: number;
  status: 'Approved' | 'Pending' | 'Suspended';
  apiKey: string;
  apiUsage: number;
  joinedDate: string;
}

export interface MarketplaceTransaction {
  id: string;
  buyer: string;
  seller: string;
  product: string;
  productType: string;
  amount: number;
  commission: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  category: 'Performance' | 'Accuracy' | 'Usability' | 'Support';
}

interface MarketplaceViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function MarketplaceView({
  locale,
  theme,
  onTriggerActivityLog
}: MarketplaceViewProps) {
  const isRTL = locale === 'ar';

  // State Management
  const [activeTab, setActiveTab] = useState<'agents' | 'apps' | 'connectors' | 'templates' | 'developer' | 'partner' | 'revenue'>('agents');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterCertification, setFilterCertification] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(null);
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ========================================================
  // DEMO DATA (Requirement 18)
  // ========================================================

  // Products List (Requirement 17 - marketplaceProducts & aiAgentsMarketplace merged schema)
  const [products, setProducts] = useState<MarketplaceProduct[]>([
    {
      id: 'MP-AG-1',
      name: 'Crypto Screening AI',
      type: 'AI Agent',
      developer: 'Makkah Blockchain Labs',
      price: 249,
      pricingModel: 'Subscription',
      status: 'Published',
      rating: 4.8,
      reviewsCount: 42,
      downloads: 320,
      certificationLevel: 'Certified',
      description: 'Real-time Web3 smart contract parser and tokenomics analyzer. Verifies lack of Riba or Gharar in decentralized pools.',
      capabilities: ['Smart Contract Security Code Analysis', 'Yield Pool Integrity Checking', 'Tether & Staking Purification Assessment'],
      industry: 'Crypto Assets',
      isInstalled: false
    },
    {
      id: 'MP-AG-2',
      name: 'Islamic Investment AI',
      type: 'AI Agent',
      developer: 'Safwa Capital Ltd',
      price: 499,
      pricingModel: 'Subscription',
      status: 'Published',
      rating: 4.9,
      reviewsCount: 88,
      downloads: 512,
      certificationLevel: 'Enterprise Certified',
      description: 'Automated global equities screening pipeline mapping directly to AAOIFI thresholds for debt, liquidity, and non-permissible interest limits.',
      capabilities: ['Automated Balance Sheet Purifier', 'Dynamic Stock Index Rebalancer', 'Historical Dividend Purification Logs'],
      industry: 'Investment Funds',
      isInstalled: true
    },
    {
      id: 'MP-AG-3',
      name: 'Audit Assistant AI',
      type: 'AI Agent',
      developer: 'Al Noor Sharia Advisory',
      price: 189,
      pricingModel: 'One-time',
      status: 'Published',
      rating: 4.7,
      reviewsCount: 31,
      downloads: 240,
      certificationLevel: 'Verified',
      description: 'Conversational compliance auditor that reviews internal meeting minutes and ledger entries to detect unauthorized commercial agreements.',
      capabilities: ['Natural Language Compliance Search', 'Risk Flag Tagging', 'Draft Sharia Audit Reports'],
      industry: 'Islamic Banking',
      isInstalled: false
    },
    {
      id: 'MP-APP-1',
      name: 'Halal Supply Chain Monitor',
      type: 'Application',
      developer: 'Tayyib Technologies',
      price: 150,
      pricingModel: 'Subscription',
      status: 'Published',
      rating: 4.6,
      reviewsCount: 19,
      downloads: 145,
      certificationLevel: 'Certified',
      description: 'IoT sensor telemetry integration that tracks shipping conditions and audits halal certificates across global shipping lines.',
      capabilities: ['Cross-Contamination Real-time Warnings', 'Logistics Washing Log Audits', 'Multi-country Certificate Validation'],
      industry: 'Halal Supply Chain',
      isInstalled: false
    },
    {
      id: 'MP-APP-2',
      name: 'Sukuk Analyzer & Structurer',
      type: 'Application',
      developer: 'Malaysian Islamic FinTech Corp',
      price: 850,
      pricingModel: 'Subscription',
      status: 'Published',
      rating: 4.9,
      reviewsCount: 56,
      downloads: 190,
      certificationLevel: 'Enterprise Certified',
      description: 'Advanced workbench for modeling asset-backed Wakala and Ijarah Sukuk pipelines with instant legal prospectus review.',
      capabilities: ['Tangibility Ratio Calculators', 'Purchase Undertaking Clause Verifier', 'Cash-flow Projection Mapping'],
      industry: 'Sukuk Markets',
      isInstalled: false
    },
    {
      id: 'MP-CON-1',
      name: 'SAP Compliance Connector',
      type: 'Connector',
      developer: 'Sovereign Ledger Partners',
      price: 1200,
      pricingModel: 'One-time',
      status: 'Published',
      rating: 4.8,
      reviewsCount: 24,
      downloads: 85,
      certificationLevel: 'Enterprise Certified',
      description: 'Direct SAP S/4HANA middleware to map sales orders, trade margins, and credit penalties directly into the ICAP engine.',
      capabilities: ['Real-time Ledger Mirroring', 'Transaction Sequence Timestamping', 'Charity Purification Auto-Escrows'],
      industry: 'ERP Integration',
      isInstalled: false
    },
    {
      id: 'MP-CON-2',
      name: 'Odoo Sharia Connector',
      type: 'Connector',
      developer: 'Odoo Open Community SA',
      price: 0,
      pricingModel: 'Free',
      status: 'Published',
      rating: 4.5,
      reviewsCount: 41,
      downloads: 380,
      certificationLevel: 'Verified',
      description: 'Plug-and-play module for Odoo Accounting to flag late payment interest hikes and segregate cooperative Takaful operations.',
      capabilities: ['Inter-company Wakala Ledger Allocation', 'Contract Template Synchronizer', 'Purification Ledger Generator'],
      industry: 'ERP Integration',
      isInstalled: true
    }
  ]);

  // Developer Accounts (Requirement 17 - developerAccounts)
  const [developers, setDevelopers] = useState<DeveloperAccount[]>([
    {
      id: 'DEV-1',
      developer: 'Makkah Blockchain Labs',
      applications: 2,
      revenue: 12450,
      status: 'Approved',
      apiKey: 'icap_live_makkah_bca8d98d22384f90',
      apiUsage: 45200,
      joinedDate: '2025-03-12'
    },
    {
      id: 'DEV-2',
      developer: 'Safwa Capital Ltd',
      applications: 3,
      revenue: 48900,
      status: 'Approved',
      apiKey: 'icap_live_safwa_f78a9c8e8d89e22e',
      apiUsage: 92400,
      joinedDate: '2025-05-20'
    },
    {
      id: 'DEV-3',
      developer: 'Tayyib Technologies',
      applications: 1,
      revenue: 4350,
      status: 'Approved',
      apiKey: 'icap_live_tayyib_e992ad8b5f39e338',
      apiUsage: 12800,
      joinedDate: '2025-09-05'
    }
  ]);

  // Marketplace Transactions (Requirement 17 - marketplaceTransactions)
  const [transactions, setTransactions] = useState<MarketplaceTransaction[]>([
    {
      id: 'TXN-901',
      buyer: 'National Bank of Kuwait',
      seller: 'Safwa Capital Ltd',
      product: 'Islamic Investment AI',
      productType: 'AI Agent',
      amount: 499,
      commission: 149.7, // 30% commission
      date: '2026-07-16',
      status: 'Completed'
    },
    {
      id: 'TXN-902',
      buyer: 'Arabian Peninsula Takaful',
      seller: 'Makkah Blockchain Labs',
      product: 'Crypto Screening AI',
      productType: 'AI Agent',
      amount: 249,
      commission: 74.7,
      date: '2026-07-15',
      status: 'Completed'
    },
    {
      id: 'TXN-903',
      buyer: 'Sovereign Sukuk Fund SA',
      seller: 'Malaysian Islamic FinTech Corp',
      product: 'Sukuk Analyzer & Structurer',
      productType: 'Application',
      amount: 850,
      commission: 255.0,
      date: '2026-07-12',
      status: 'Completed'
    },
    {
      id: 'TXN-904',
      buyer: 'Dubai Islamic Bank',
      seller: 'Sovereign Ledger Partners',
      product: 'SAP Compliance Connector',
      productType: 'Connector',
      amount: 1200,
      commission: 240.0, // 20% commission on connectors
      date: '2026-07-10',
      status: 'Completed'
    }
  ]);

  // Product Reviews (Requirement 17 - reviews)
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'REV-1',
      productId: 'MP-AG-1',
      productName: 'Crypto Screening AI',
      user: 'Habibullah Al-Mutawa',
      rating: 5,
      comment: 'Excellent integration of cryptographic validations. Instantly highlights any hidden liquidity pool risks.',
      date: '2026-07-14',
      category: 'Accuracy'
    },
    {
      id: 'REV-2',
      productId: 'MP-AG-2',
      productName: 'Islamic Investment AI',
      user: 'Zaidan Bin Ibrahim',
      rating: 5,
      comment: 'Saves our compliance team hundreds of hours. Dynamic balance sheet scanning is perfectly aligned with AAOIFI Standard 21.',
      date: '2026-07-10',
      category: 'Performance'
    },
    {
      id: 'REV-3',
      productId: 'MP-APP-1',
      productName: 'Halal Supply Chain Monitor',
      user: 'Fatimah Al-Ghamdi',
      rating: 4,
      comment: 'Very detailed logistical logs. The UI is straightforward, but setting up custom webhooks on legacy systems took some effort.',
      date: '2026-07-08',
      category: 'Usability'
    }
  ]);

  // Revenue Sharing Settings Configuration (Requirement 11)
  const [revShareSettings, setRevShareSettings] = useState({
    agentDeveloperShare: 70,
    agentIcapShare: 30,
    connectorPartnerShare: 80,
    connectorIcapShare: 20,
    appDeveloperShare: 75,
    appIcapShare: 25,
    templatePartnerShare: 85,
    templateIcapShare: 15
  });

  // API Monetization Matrix Configuration (Requirement 10)
  const [apiProducts, setApiProducts] = useState([
    { id: 'api-compliance', name: 'Compliance Core API', ratePerCall: 0.05, activeSubscribers: 142, billingModel: 'Pay Per Request' },
    { id: 'api-screening', name: 'Sharia Equity Screening API', ratePerCall: 0.12, activeSubscribers: 88, billingModel: 'Monthly Subscription' },
    { id: 'api-risk', name: 'Islamic Risk Scoring API', ratePerCall: 0.08, activeSubscribers: 61, billingModel: 'Pay Per Request' },
    { id: 'api-cert', name: 'Certificate Verification API', ratePerCall: 0.02, activeSubscribers: 205, billingModel: 'Free' },
    { id: 'api-doc', name: 'Document Sharia Analysis API', ratePerCall: 0.35, activeSubscribers: 45, billingModel: 'Enterprise License' }
  ]);

  // No-code AI Agent Builder States (Requirement 4)
  const [builderName, setBuilderName] = useState('My Custom Sharia Evaluator');
  const [builderPurpose, setBuilderPurpose] = useState('Analyze investment portfolios for non-compliant cash placement');
  const [builderIndustry, setBuilderIndustry] = useState('Investment Funds');
  const [builderKnowledge, setBuilderKnowledge] = useState('AAOIFI Sharia Standards, Al-Rajhi Internal Policies');
  const [builderRules, setBuilderRules] = useState('Reject stocks with debt-to-equity ratio above 30%. Flag non-permissible interest income instantly.');
  const [builderActions, setBuilderActions] = useState('Generate audit finding, notify treasurer, draft purification report');
  const [builderFormat, setBuilderFormat] = useState('Detailed JSON Compliance Report');

  // Interactive Product installation workflow (Requirement 3)
  const [installingProductId, setInstallingProductId] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<MarketplaceProduct | null>(null);
  const [installationStep, setInstallationStep] = useState<'browse' | 'details' | 'configuring' | 'success'>('browse');
  const [configuredTargetServer, setConfiguredTargetServer] = useState('production-core-1');
  const [configuredSyncInterval, setConfiguredSyncInterval] = useState('hourly');

  // Review Form state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewCategory, setNewReviewCategory] = useState<'Performance' | 'Accuracy' | 'Usability' | 'Support'>('Accuracy');

  // Trigger Install flow
  const handleOpenInstallFlow = (product: MarketplaceProduct) => {
    setSelectedProductForDetail(product);
    setInstallationStep('details');
  };

  const handleSimulateInstallation = () => {
    if (!selectedProductForDetail) return;
    setInstallationStep('configuring');
    onTriggerActivityLog('INSTALL_MARKET_PRODUCT_START', `Initiated custom setup for ${selectedProductForDetail.name}`);

    setTimeout(() => {
      setProducts(prev => prev.map(p => {
        if (p.id === selectedProductForDetail.id) {
          return { ...p, isInstalled: true, downloads: p.downloads + 1 };
        }
        return p;
      }));

      // Create simulated transaction
      const isConnector = selectedProductForDetail.type === 'Connector';
      const sharePct = isConnector ? revShareSettings.connectorIcapShare : revShareSettings.agentIcapShare;
      const commission = (selectedProductForDetail.price * sharePct) / 100;
      
      const newTxn: MarketplaceTransaction = {
        id: `TXN-${Math.floor(Math.random() * 1000) + 100}`,
        buyer: 'Primary Corporate Admin',
        seller: selectedProductForDetail.developer,
        product: selectedProductForDetail.name,
        productType: selectedProductForDetail.type,
        amount: selectedProductForDetail.price,
        commission,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };

      setTransactions(prev => [newTxn, ...prev]);

      // Update developer revenue metrics
      setDevelopers(prev => prev.map(dev => {
        if (dev.developer === selectedProductForDetail.developer) {
          return { ...dev, revenue: dev.revenue + selectedProductForDetail.price - commission };
        }
        return dev;
      }));

      setInstallationStep('success');
      onTriggerActivityLog('INSTALL_MARKET_PRODUCT_SUCCESS', `Successfully deployed ${selectedProductForDetail.name} into environment ${configuredTargetServer}`);
      triggerToast(`Successfully installed ${selectedProductForDetail.name}!`);
    }, 2000);
  };

  const handleToggleUninstall = (product: MarketplaceProduct) => {
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, isInstalled: false };
      }
      return p;
    }));
    onTriggerActivityLog('UNINSTALL_MARKET_PRODUCT', `Deactivated and uninstalled ${product.name}`);
    triggerToast(`Deactivated ${product.name} from current workspace`);
  };

  // Trigger AI Agent creation (Requirement 4)
  const handleBuildCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgentProduct: MarketplaceProduct = {
      id: `MP-CUSTOM-${Math.floor(Math.random() * 1000)}`,
      name: builderName,
      type: 'AI Agent',
      developer: 'My Company (Custom Builder)',
      price: 0,
      pricingModel: 'Free',
      status: 'Published',
      rating: 5.0,
      reviewsCount: 0,
      downloads: 1,
      certificationLevel: 'Verified',
      description: `Proprietary custom-built Sharia Agent for ${builderPurpose}. Powered by no-code execution rules.`,
      capabilities: builderActions.split(',').map(s => s.trim()),
      industry: builderIndustry,
      isInstalled: true
    };

    setProducts(prev => [newAgentProduct, ...prev]);
    onTriggerActivityLog('BUILD_CUSTOM_SHARIA_AGENT', `Created custom AI Compliance Agent: "${builderName}" for ${builderIndustry}`);
    triggerToast(`Custom Sharia Agent "${builderName}" successfully created and activated!`);
    
    // Reset builder form
    setBuilderName('My Custom Sharia Evaluator');
    setBuilderPurpose('Analyze investment portfolios for non-compliant cash placement');
  };

  // Submit Review (Requirement 13)
  const handleAddReview = (e: React.FormEvent, productId: string, productName: string) => {
    e.preventDefault();
    const newRev: Review = {
      id: `REV-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName,
      user: 'Sovereign Audit Lead',
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      category: newReviewCategory
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate rating in products array
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const totalRating = p.rating * p.reviewsCount + newReviewRating;
        const newCount = p.reviewsCount + 1;
        return {
          ...p,
          reviewsCount: newCount,
          rating: parseFloat((totalRating / newCount).toFixed(1))
        };
      }
      return p;
    }));

    onTriggerActivityLog('SUBMIT_PRODUCT_REVIEW', `Submitted ${newReviewRating}-star review on ${productName}`);
    triggerToast('Review submitted successfully!');
    setNewReviewComment('');
  };

  // Developer Self Registration simulator (Requirement 9)
  const [newDeveloperName, setNewDeveloperName] = useState('');
  const [developerIsRegistered, setDeveloperIsRegistered] = useState(false);
  const handleRegisterDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeveloperName.trim()) return;

    const newDevAccount: DeveloperAccount = {
      id: `DEV-${Math.floor(Math.random() * 1000)}`,
      developer: newDeveloperName,
      applications: 0,
      revenue: 0,
      status: 'Approved',
      apiKey: `icap_live_${newDeveloperName.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(2, 10)}`,
      apiUsage: 100,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setDevelopers(prev => [...prev, newDevAccount]);
    setDeveloperIsRegistered(true);
    onTriggerActivityLog('REGISTER_DEVELOPER_PORTAL', `Registered developer program workspace for: ${newDeveloperName}`);
    triggerToast(`Developer portal workspace successfully created for: ${newDeveloperName}`);
  };

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.developer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchIndustry = filterIndustry === 'All' || p.industry === filterIndustry;
      const matchCert = filterCertification === 'All' || p.certificationLevel === filterCertification;
      return matchSearch && matchIndustry && matchCert;
    });
  }, [products, searchQuery, filterIndustry, filterCertification]);

  // Ecosystem aggregate calculations (Requirement 16)
  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCommissions = transactions.reduce((sum, tx) => sum + tx.commission, 0);
    const developerPayouts = totalRevenue - totalCommissions;
    const installedCount = products.filter(p => p.isInstalled).length;
    const totalApiUsage = developers.reduce((sum, dev) => sum + dev.apiUsage, 0);

    return {
      totalRevenue,
      totalCommissions,
      developerPayouts,
      installedCount,
      totalApiUsage,
      developerCount: developers.length,
      publishedProducts: products.length
    };
  }, [transactions, products, developers]);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HERO BANNER & SEARCH */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3.5 rounded-2xl text-amber-500 shadow-inner">
              <ShoppingBag className="w-9 h-9" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'سوق حلول الامتثال والذكاء الاصطناعي' : 'ICAP AI Compliance Ecosystem Marketplace'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-sans border border-emerald-500/15">
                  Ecosystem Hub
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {isRTL
                  ? 'سوق متكامل يربط المؤسسات المالية بالفقهاء، المطورين، وشركات التقنية للاستفادة من أتمتة تدقيق العقود والمعايير الشرعية بشكل معتمد فوري.'
                  : 'An enterprise app exchange connecting Islamic financial institutions with Sharia advisors, system integrators, and software developers to deploy pre-certified audit agents, integrations, and tools instantly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Marketplace Sub-Navigation (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-150/40 dark:border-slate-800/80 pt-4">
          {[
            { id: 'agents', name: isRTL ? 'سوق وكلاء الذكاء الاصطناعي' : 'AI Agent Marketplace', icon: Cpu },
            { id: 'apps', name: isRTL ? 'تطبيقات الامتثال والتدقيق' : 'Compliance Applications', icon: Layers },
            { id: 'connectors', name: isRTL ? 'روابط وموصلات الأنظمة' : 'Connector Marketplace', icon: Database },
            { id: 'templates', name: isRTL ? 'نماذج التدقيق والتقارير' : 'Templates & Docs', icon: FileText },
            { id: 'developer', name: isRTL ? 'برنامج وبوابة المطورين' : 'Developer Hub', icon: Code },
            { id: 'partner', name: isRTL ? 'إدارة وتحليلات الشركاء' : 'Partner Dashboard', icon: Users },
            { id: 'revenue', name: isRTL ? 'التحليلات المالية والاشتراكات' : 'Revenue & API Admin', icon: TrendingUp }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedProductForDetail(null);
                  setInstallationStep('browse');
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

      {/* TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-bold font-sans">{toast}</span>
        </div>
      )}

      {/* ========================================================
          PAGE 1: AI AGENT MARKETPLACE & BUILDER (Requirement 2, 3, 4)
          ======================================================== */}
      {activeTab === 'agents' && installationStep === 'browse' && (
        <div className="space-y-6">
          
          {/* Marketplace Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-500" /> Filter:
              </span>
              
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Industries</option>
                <option value="Crypto Assets">Crypto Assets</option>
                <option value="Investment Funds">Investment Funds</option>
                <option value="Islamic Banking">Islamic Banking</option>
                <option value="Halal Supply Chain">Halal Supply Chain</option>
                <option value="Sukuk Markets">Sukuk Markets</option>
              </select>

              <select
                value={filterCertification}
                onChange={(e) => setFilterCertification(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500 text-slate-700 dark:text-slate-300"
              >
                <option value="All">All Certifications</option>
                <option value="Verified">Verified</option>
                <option value="Certified">Certified</option>
                <option value="Enterprise Certified">Enterprise Certified</option>
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search AI Compliance agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Products catalog list */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Sharia Compliance Agents ({filteredProducts.filter(p => p.type === 'AI Agent').length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts
                  .filter(p => p.type === 'AI Agent')
                  .map(agent => (
                    <div
                      key={agent.id}
                      className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} flex flex-col justify-between hover:shadow-md transition relative overflow-hidden`}
                    >
                      {agent.isInstalled && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold font-mono px-3 py-1 rounded-bl-xl">
                          ACTIVE INSTALLED
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{agent.industry}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            agent.certificationLevel === 'Enterprise Certified' ? 'bg-purple-500/10 text-purple-600 border-purple-500/25' :
                            agent.certificationLevel === 'Certified' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25' :
                            'bg-blue-500/10 text-blue-600 border-blue-500/25'
                          }`}>
                            {agent.certificationLevel}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{agent.name}</h4>
                          <span className="text-[10px] text-slate-400 font-sans block">By {agent.developer}</span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px]">
                          {agent.description}
                        </p>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= Math.floor(agent.rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-slate-400 ml-1">({agent.reviewsCount} reviews)</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">PRICING MODEL</span>
                            <span className="font-bold font-mono text-slate-900 dark:text-white">
                              {agent.price > 0 ? `$${agent.price}/mo` : 'Free'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block text-right">DEPLOYMENTS</span>
                            <span className="font-mono text-slate-500 text-right block">{agent.downloads} active</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2">
                        {agent.isInstalled ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleUninstall(agent)}
                              className="flex-1 py-1.5 border border-red-500/20 bg-red-500/15 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition"
                            >
                              Uninstall Agent
                            </button>
                            <button
                              onClick={() => triggerToast(`Navigating to AI Compliance Engine configuration for ${agent.name}...`)}
                              className="px-3 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenInstallFlow(agent)}
                            className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            <span>Deploy & Configure</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* AI Agent Builder (Requirement 4) */}
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-white text-xs uppercase tracking-wider">
                      No-Code Sharia Agent Builder
                    </h4>
                    <p className="text-[10px] text-slate-400">Instantly generate proprietary compliance models with specific guidelines.</p>
                  </div>
                </div>

                <form onSubmit={handleBuildCustomAgent} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">AGENT NAME</label>
                    <input
                      type="text"
                      value={builderName}
                      onChange={(e) => setBuilderName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500 font-bold"
                      placeholder="e.g. Al-Rajhi Stock Screener"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PRIMARY INDUSTRY FOCUS</label>
                    <select
                      value={builderIndustry}
                      onChange={(e) => setBuilderIndustry(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Investment Funds">Investment Funds</option>
                      <option value="Crypto Assets">Crypto Assets</option>
                      <option value="Islamic Banking">Islamic Banking</option>
                      <option value="Halal Supply Chain">Halal Supply Chain</option>
                      <option value="Sukuk Markets">Sukuk Markets</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">KNOWLEDGE BASE ATTACHMENTS</label>
                    <input
                      type="text"
                      value={builderKnowledge}
                      onChange={(e) => setBuilderKnowledge(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                      placeholder="e.g. AAOIFI Standard 21, Corporate Fatwas"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">COMPLIANCE DECISION RULES</label>
                    <textarea
                      value={builderRules}
                      onChange={(e) => setBuilderRules(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500"
                      placeholder="Input natural language logic..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">AUTOMATED ACTIONS ON VIOLATION</label>
                    <input
                      type="text"
                      value={builderActions}
                      onChange={(e) => setBuilderActions(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:outline-none focus:border-amber-500"
                      placeholder="e.g. Raise Audit Finding, Purify Dividends"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Play className="w-3.5 h-3.5 text-slate-950" />
                    <span>Compile & Activate Agent</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PRODUCT INSTALLATION & DETAILED PAGE (Requirement 3)
          ======================================================== */}
      {selectedProductForDetail && installationStep !== 'browse' && (
        <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
          
          {/* Breadcrumb / Back Navigation */}
          <button
            onClick={() => {
              setSelectedProductForDetail(null);
              setInstallationStep('browse');
            }}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            ← Back to Marketplace catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Product Info & Installation Form */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
                  {selectedProductForDetail.type === 'AI Agent' ? <Cpu className="w-10 h-10" /> : <Layers className="w-10 h-10" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                      {selectedProductForDetail.type}
                    </span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                      {selectedProductForDetail.certificationLevel}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedProductForDetail.name}
                  </h3>
                  <p className="text-xs text-slate-400">Published by {selectedProductForDetail.developer} · Version 2026.1</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider">Product Overview</h4>
                <p className="leading-relaxed">{selectedProductForDetail.description}</p>
                
                <div className="bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1 uppercase tracking-wider">Verified Sharia Capabilities</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {selectedProductForDetail.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews & Submission form (Requirement 13) */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">
                  Reviews & Customer Ratings ({reviews.filter(r => r.productId === selectedProductForDetail.id).length})
                </h4>

                <div className="space-y-3">
                  {reviews
                    .filter(r => r.productId === selectedProductForDetail.id)
                    .map(rev => (
                      <div key={rev.id} className="p-4 bg-slate-50/40 dark:bg-slate-900/20 border border-slate-150/40 dark:border-slate-800/40 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.user}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 font-mono">Category: {rev.category}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{rev.comment}</p>
                      </div>
                    ))}
                  
                  {reviews.filter(r => r.productId === selectedProductForDetail.id).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No reviews yet for this product. Be the first to leave one!</p>
                  )}
                </div>

                {/* Leave a review Form */}
                <form onSubmit={(e) => handleAddReview(e, selectedProductForDetail.id, selectedProductForDetail.name)} className="p-4 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">Submit a Certified Review</span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">RATING</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:border-amber-500 font-bold text-amber-500"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">AUDIT FOCUS CATEGORY</label>
                      <select
                        value={newReviewCategory}
                        onChange={(e) => setNewReviewCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:border-amber-500"
                      >
                        <option value="Accuracy">Compliance Accuracy</option>
                        <option value="Performance">Processing Speed</option>
                        <option value="Usability">API Integration Simplicity</option>
                        <option value="Support">Developer Responsiveness</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">FEEDBACK DETAILS</label>
                    <textarea
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:border-amber-500"
                      placeholder="Comment on execution speed, rule alignment, or edge cases..."
                      required
                    />
                  </div>

                  <button type="submit" className="px-4 py-1.5 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 dark:hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition">
                    Post Certified Review
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Deployment Step Configuration (Requirement 3) */}
            <div className="space-y-6">
              
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Deploy & Configure Agent</h4>
                
                {installationStep === 'details' && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-500">Configure parameters before activating this Sharia Intelligence module.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">TARGET CLOUD DEPLOYMENT</label>
                        <select
                          value={configuredTargetServer}
                          onChange={(e) => setConfiguredTargetServer(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
                        >
                          <option value="production-core-1">Production Core Cloud VM (GCC-1)</option>
                          <option value="sandbox-staging-2">Compliance Sandbox Staging VM</option>
                          <option value="asean-partner-edge">ASEAN Edge Ledger Nodes</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">AUTOMATED TRANSACTION SYNC RATE</label>
                        <select
                          value={configuredSyncInterval}
                          onChange={(e) => setConfiguredSyncInterval(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
                        >
                          <option value="real-time">Real-time Webhook Streaming</option>
                          <option value="hourly">Hourly Bulk Audit Batch</option>
                          <option value="daily">End of Day Ledger Balancing</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSimulateInstallation}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        <span>Deploy for ${selectedProductForDetail.price > 0 ? `$${selectedProductForDetail.price}/mo` : 'Free'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {installationStep === 'configuring' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Provisioning secure isolated sandbox environments...</p>
                    <p className="text-[10px] text-slate-400">Syncing with sovereign compliance registries...</p>
                  </div>
                )}

                {installationStep === 'success' && (
                  <div className="text-center py-6 space-y-4 text-xs">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">Installation Complete!</h5>
                      <p className="text-[11px] text-slate-400 mt-1">This agent is now actively listening on standard endpoints inside your compliance engine.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProductForDetail(null);
                        setInstallationStep('browse');
                      }}
                      className="w-full py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-lg transition"
                    >
                      Return to catalog
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          PAGE 2: COMPLIANCE APPLICATIONS (Requirement 6)
          ======================================================== */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Islamic Compliance Applications
              </h3>
              <p className="text-xs text-slate-400">Complete SaaS add-ons built on ICAP to manage specialized processes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(p => p.type === 'Application')
              .map(app => (
                <div
                  key={app.id}
                  className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition relative`}
                >
                  {app.isInstalled && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold font-mono px-3 py-1 rounded-bl-xl">
                      ACTIVE INSTALLED
                    </div>
                  )}

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{app.industry}</span>
                      <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {app.certificationLevel}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white text-sm">{app.name}</h4>
                      <span className="text-[10px] text-slate-400">Developer: {app.developer}</span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px] text-[11px]">
                      {app.description}
                    </p>

                    {/* App Features Checklist */}
                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Key Modules</span>
                      {app.capabilities.map((cap, ci) => (
                        <div key={ci} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[11px] border-t border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        ${app.price}/mo
                      </span>
                      <span className="text-slate-400 font-mono">{app.downloads} active licenses</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {app.isInstalled ? (
                      <button
                        onClick={() => handleToggleUninstall(app)}
                        className="w-full py-1.5 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl transition"
                      >
                        Uninstall App
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenInstallFlow(app)}
                        className="w-full py-1.5 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-white" />
                        <span>Deploy App</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 3: CONNECTOR MARKETPLACE EXPANSION (Requirement 7)
          ======================================================== */}
      {activeTab === 'connectors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ERP Connector Marketplace
              </h3>
              <p className="text-xs text-slate-400">Integrate Odoo, SAP, Oracle, Dynamics, and ERPNext ledgers directly with Sharia governance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(p => p.type === 'Connector')
              .map(conn => (
                <div
                  key={conn.id}
                  className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition relative`}
                >
                  {conn.isInstalled && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold font-mono px-3 py-1 rounded-bl-xl">
                      ACTIVE INSTALLED
                    </div>
                  )}

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">ERP SYSTEM</span>
                      <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Security Passed
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white text-sm">{conn.name}</h4>
                      <span className="text-[10px] text-slate-400 block font-sans">Developed by {conn.developer}</span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px] text-[11px]">
                      {conn.description}
                    </p>

                    <div className="bg-slate-50/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-150/50 dark:border-slate-800/60">
                      <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Features Provided</span>
                      {conn.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[11px] border-t border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {conn.price > 0 ? `$${conn.price} one-time` : 'Free / Open Source'}
                      </span>
                      <span className="text-slate-400 font-mono">{conn.downloads} clients</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {conn.isInstalled ? (
                      <button
                        onClick={() => handleToggleUninstall(conn)}
                        className="w-full py-1.5 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl transition"
                      >
                        Disconnect ERP Middleware
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenInstallFlow(conn)}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link Connector</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 4: TEMPLATES MARKETPLACE (Requirement 8)
          ======================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Standards & Compliance Template Marketplace
              </h3>
              <p className="text-xs text-slate-400">Pre-built compliance audit templates, legal contracts, and SOP checklists verified by scholars.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            
            {/* Standard pre-built templates */}
            {[
              { id: 'TMP-1', name: 'Annual Islamic Finance Audit Program', type: 'Audit Checklist', price: 99, rating: 4.8, developer: 'Al Noor Sharia Advisory', description: 'Comprehensive annual review checklist containing steps to verify Murabaha profit pools and interest-bearing loan avoidance.' },
              { id: 'TMP-2', name: 'Harmonized Murabaha master sale template', type: 'Contract Template', price: 49, rating: 4.9, developer: 'Makkah Legal Advisors', description: 'Certified AAOIFI-compliant bilateral sale terms containing penalty-cleansing charity purification clauses.' },
              { id: 'TMP-3', name: 'Takaful Wakala operator governance SOP', type: 'Corporate Policy', price: 120, rating: 4.7, developer: 'Safwa Compliance Experts', description: 'Operational guidelines to segregate participant pools from shareholder accounts and declare surplus payouts correctly.' }
            ].map(tmp => (
              <div key={tmp.id} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex flex-col justify-between space-y-4`}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono uppercase">{tmp.type}</span>
                    <span className="font-mono text-amber-500 font-bold">${tmp.price}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tmp.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">{tmp.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">By {tmp.developer}</span>
                  <button
                    onClick={() => {
                      onTriggerActivityLog('PURCHASE_TEMPLATE', `Purchased standard template: "${tmp.name}"`);
                      triggerToast(`Template "${tmp.name}" successfully downloaded!`);
                    }}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 5: DEVELOPER PROGRAM (Requirement 9)
          ======================================================== */}
      {activeTab === 'developer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Developer self service panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {!developerIsRegistered ? (
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Join the ICAP Developer Program
                    </h3>
                    <p className="text-xs text-slate-400">Build, publish, and monetize Sharia-compliant AI models, API bridges, or connectors.</p>
                  </div>

                  <form onSubmit={handleRegisterDeveloper} className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">COMPANY / DEVELOPER NAME</label>
                      <input
                        type="text"
                        value={newDeveloperName}
                        onChange={(e) => setNewDeveloperName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg focus:outline-none focus:border-amber-500"
                        placeholder="e.g. Al-Madinah FinTech Labs"
                        required
                      />
                    </div>
                    <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                      <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300 block">Terms & Revenue Share:</span>
                      <p className="text-[10px] text-slate-400">
                        Developers retain <strong>70% of AI Agent sales</strong> and <strong>80% of Connector/ERP module downloads</strong>. Payouts are reconciled monthly.
                      </p>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition">
                      Accept Terms & Generate Keys
                    </button>
                  </form>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6 text-xs`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Developer Dashboard: {newDeveloperName}</h4>
                      <span className="text-[10px] text-slate-400">Status: Active verified publisher</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Developer Live
                    </span>
                  </div>

                  {/* Private API key showcase */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                    <span className="font-bold text-[10px] text-slate-400 block uppercase">Your Sandbox Integration API Key</span>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value="icap_live_custom_developer_key_38402910d"
                        readOnly
                        className="flex-1 bg-white dark:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[10px] focus:outline-none"
                      />
                      <button
                        onClick={() => triggerToast('Developer API key copied to clipboard!')}
                        className="px-3 bg-amber-500 text-slate-950 rounded-lg font-bold"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Use this key in server-to-server middleware to query live Sharia screening APIs. Keep this secret safe.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase">Published</span>
                      <span className="text-lg font-bold font-display text-slate-900 dark:text-white">1 Agent</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase">Subscribers</span>
                      <span className="text-lg font-bold font-display text-slate-900 dark:text-white">1</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                      <span className="text-[10px] text-slate-400 block uppercase">API Queries</span>
                      <span className="text-lg font-bold font-display text-slate-900 dark:text-white">120 / day</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Developer accounts inspector listing */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Registered Developers Directory ({developers.length})</h4>
                <div className="space-y-2 text-xs">
                  {developers.map(dev => (
                    <div key={dev.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150/40 dark:border-slate-800/60 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{dev.developer}</span>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                          <span>Joined: {dev.joinedDate}</span>
                          <span>·</span>
                          <span>API Calls: {dev.apiUsage}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold block text-emerald-500 font-mono">${dev.revenue.toLocaleString()} Earned</span>
                        <span className="text-[10px] text-slate-400">Status: {dev.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Platform rules constraints info */}
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'} shadow-sm space-y-4 text-xs`}>
                <h4 className="font-bold text-slate-950 dark:text-white text-xs uppercase tracking-wider">Developer Sandbox Guideline</h4>
                <ul className="space-y-2.5 list-disc pl-4 text-slate-500 leading-relaxed">
                  <li><strong>Security Audits:</strong> All uploaded apps must pass automated static container analysis prior to public visibility.</li>
                  <li><strong>No Riba Rules:</strong> Applications or integrations cannot contain mechanisms supporting late interest accrual.</li>
                  <li><strong>Escrow Support:</strong> Any marketplace payments are handled by the ICAP central ledger, transferring earnings automatically on the 1st of each month.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 6: PARTNER MARKETPLACE & ANALYTICS (Requirement 15)
          ======================================================== */}
      {activeTab === 'partner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Partners directory */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sharia Advisors, Consultants, and Audit Partners Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'PT-1', name: 'Al Noor Sharia Advisory Ltd', category: 'Sharia Advisor', rating: 4.9, country: 'Saudi Arabia', services: ['Fatwa issuance', 'Sharia Board composition', 'Audits'] },
                  { id: 'PT-2', name: 'Global Islamic Compliance Auditors', category: 'Audit Firm', rating: 4.8, country: 'UAE', services: ['External Sharia Audits', 'Legislative alignment testing'] },
                  { id: 'PT-3', name: 'Fintech Sharia Advisory LLP', category: 'Consultant', rating: 4.7, country: 'Malaysia', services: ['Crypto Screening design', 'Tokenomics reviews'] }
                ].map(p => (
                  <div key={p.id} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/20 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{p.category}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                      </div>
                      <span className="text-xs bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full font-bold">
                        {p.country}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Provided Services:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.services.map((s, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-amber-500 font-bold">★ {p.rating} / 5.0 Rating</span>
                      <button
                        onClick={() => triggerToast(`Contacting advisor partner "${p.name}" via corporate secure email...`)}
                        className="px-3 py-1 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white rounded-lg font-bold"
                      >
                        Retain Services
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Revenue & Downloads Analytics Panel (Requirement 15) */}
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'} shadow-sm space-y-4`}>
                <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Partner Portal Metrics</h4>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Unified Partner Sales</span>
                    <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">$2,798.00</div>
                    <span className="text-[9px] text-emerald-500 font-bold block mt-0.5">↑ 14% month over month</span>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Retainer Commissions Paid</span>
                    <div className="text-xl font-bold font-display text-emerald-500 mt-1">$549.40</div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Average 20% platform cut applied</span>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Active Partner Integrations</span>
                    <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">1,012 Connections</div>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Across GCC and ASEAN regions</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          PAGE 7: REVENUE DASHBOARD & API MONETIZATION (Requirement 10, 11, 12, 16)
          ======================================================== */}
      {activeTab === 'revenue' && (
        <div className="space-y-6 text-xs">
          
          {/* Ecosystem Aggregate KPI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Marketplace Sales</span>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">${stats.totalRevenue.toLocaleString()}</div>
              <span className="text-[9px] text-slate-400 mt-1 block">From one-time & monthly licensing</span>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">ICAP Commision Retained</span>
              <div className="text-2xl font-bold font-display text-emerald-500 mt-2">${stats.totalCommissions.toLocaleString()}</div>
              <span className="text-[9px] text-slate-400 mt-1 block">Configured split parameters applied</span>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Developer Net Earnings</span>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-2">${stats.developerPayouts.toLocaleString()}</div>
              <span className="text-[9px] text-emerald-500 font-bold mt-1 block">Distributed via automated wire routing</span>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Sandbox API Traffic</span>
              <div className="text-2xl font-bold font-display text-amber-500 mt-2">{stats.totalApiUsage.toLocaleString()} calls</div>
              <span className="text-[9px] text-slate-400 mt-1 block">Across developer sandbox accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue share percentages configurator (Requirement 11) */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Configure Marketplace Revenue Shares</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Modify commissions split percentages applied dynamically during transactions checkouts.</p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between font-mono text-[10px] mb-1">
                    <span>AI AGENT SALE: Developer Cut</span>
                    <span className="font-bold text-amber-500">{revShareSettings.agentDeveloperShare}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={revShareSettings.agentDeveloperShare}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevShareSettings(prev => ({
                        ...prev,
                        agentDeveloperShare: val,
                        agentIcapShare: 100 - val
                      }));
                    }}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">ICAP Platform Commission split: {revShareSettings.agentIcapShare}%</span>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[10px] mb-1">
                    <span>ERP CONNECTOR SALE: Partner Cut</span>
                    <span className="font-bold text-amber-500">{revShareSettings.connectorPartnerShare}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={revShareSettings.connectorPartnerShare}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRevShareSettings(prev => ({
                        ...prev,
                        connectorPartnerShare: val,
                        connectorIcapShare: 100 - val
                      }));
                    }}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">ICAP Platform Commission split: {revShareSettings.connectorIcapShare}%</span>
                </div>

                <button
                  onClick={() => {
                    onTriggerActivityLog('MODIFY_REVENUE_SHARE_SETTINGS', `Updated Rev splits. AI Developer share set to ${revShareSettings.agentDeveloperShare}%.`);
                    triggerToast('Marketplace revenue splitting configurations saved successfully!');
                  }}
                  className="w-full py-2 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 text-white rounded-xl font-bold font-sans text-xs transition"
                >
                  Save Split Rules & Sync
                </button>
              </div>
            </div>

            {/* API monetization modeler (Requirement 10) */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Live API Monetization Matrix</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Establish charge-back rates applied per single request verification for tenant integrations.</p>

              <div className="space-y-2.5">
                {apiProducts.map(api => (
                  <div key={api.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150/40 dark:border-slate-800/60 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{api.name}</span>
                      <span className="font-mono text-amber-500">${api.ratePerCall}/call</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Model: <strong>{api.billingModel}</strong></span>
                      <span>{api.activeSubscribers} Active Keys</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database schema extensions view (Requirement 17) */}
            <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Ecosystem Database Extensions</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">View structured table extensions implemented dynamically to persist developer profiles, reviews, and transaction cuts.</p>

              <div className="space-y-3 pt-1">
                {[
                  { name: 'marketplaceProducts', fields: 'name, type, developer, price, status' },
                  { name: 'aiAgentsMarketplace', fields: 'agentName, creator, industry, knowledge, rating' },
                  { name: 'developerAccounts', fields: 'developer, applications, revenue, status' },
                  { name: 'marketplaceTransactions', fields: 'buyer, seller, product, amount, commission' },
                  { name: 'reviews', fields: 'productId, rating, comment' }
                ].map((tbl, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150/40 dark:border-slate-800/80">
                    <div className="flex justify-between font-mono font-bold text-[10px] text-amber-600">
                      <span>{tbl.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase">TABLE</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">Fields: {tbl.fields}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Transaction history log */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
            <h4 className="font-bold text-slate-950 dark:text-white uppercase tracking-wider text-xs">Platform Transaction Log (marketplaceTransactions)</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="py-2.5">TRANSACTION ID</th>
                    <th>PRODUCT</th>
                    <th>PRODUCT TYPE</th>
                    <th>SELLER DEVELOPER</th>
                    <th>BUYER CLUSTER</th>
                    <th>GROSS PRICE</th>
                    <th>PLATFORM SHARE</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400 font-sans">
                  {transactions.map(txn => (
                    <tr key={txn.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                      <td className="py-3 font-mono text-amber-500 font-bold">{txn.id}</td>
                      <td className="font-bold text-slate-900 dark:text-white">{txn.product}</td>
                      <td>{txn.productType}</td>
                      <td>{txn.seller}</td>
                      <td>{txn.buyer}</td>
                      <td className="font-mono font-bold text-slate-900 dark:text-white">${txn.amount}</td>
                      <td className="font-mono text-emerald-500 font-bold">${txn.commission}</td>
                      <td className="font-mono">{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
