import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Layers,
  Database,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Send,
  MessageSquare,
  Sparkles,
  Paperclip,
  Bookmark,
  Users,
  Eye,
  FileCheck,
  CheckSquare,
  DollarSign,
  ArrowRight,
  BookOpen,
  CheckSquare as ClipboardList,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for our Big Four Audit Platform
export interface Audit {
  id: string;
  name: string;
  type: 'Internal Compliance Audit' | 'Sharia Audit' | 'Financial Audit' | 'Operational Audit' | 'ERP Transaction Audit' | 'Policy Compliance Audit';
  startDate: string;
  endDate: string;
  scope: {
    departments: string[];
    systems: string[];
    processes: string[];
  };
  team: {
    auditors: string[];
    reviewers: string[];
  };
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'Closed';
}

export interface AuditProcedure {
  id: string;
  auditId: string;
  name: string;
  objective: string;
  riskAddressed: string;
  testingMethod: string;
  requiredEvidence: string;
  responsibleAuditor: string;
}

export interface WorkingPaper {
  id: string;
  auditId: string;
  title: string;
  auditArea: string;
  procedure: string;
  testingPerformed: string;
  evidenceAttached: string[];
  conclusion: string;
  reviewerComments: string;
  status: 'Draft' | 'Under Review' | 'Approved';
  version: string;
}

export interface AuditEvidence {
  id: string;
  auditId: string;
  source: string;
  description: string;
  fileUrl: string;
  relatedProcedure: string;
  relatedFinding?: string;
  collectedBy: string;
  date: string;
  category: 'Document' | 'ERP Record' | 'Screenshot' | 'Report' | 'Contract' | 'Transaction';
}

export interface AuditFinding {
  id: string;
  auditId: string;
  title: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  condition: string;
  criteria: string;
  cause: string;
  effect: string;
  recommendation: string;
  status: 'Open' | 'Under Review' | 'Accepted' | 'Corrected' | 'Verified' | 'Closed';
  evidence: string[];
}

export interface CorrectiveAction {
  id: string;
  findingId: string;
  findingTitle: string;
  actionRequired: string;
  owner: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Completed' | 'Verified';
  evidenceOfCompletion?: string;
}

interface AuditCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

export default function AuditCenterView({
  locale,
  theme,
  onTriggerActivityLog
}: AuditCenterViewProps) {
  const isRTL = locale === 'ar';

  // State Management simulating a database
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planning' | 'engagements' | 'procedures' | 'papers' | 'evidence' | 'findings' | 'actions' | 'assistant'>('dashboard');

  // Interactive Audits
  const [audits, setAudits] = useState<Audit[]>([
    {
      id: 'AUD-2026-001',
      name: 'Annual Islamic Finance Compliance Audit 2026',
      type: 'Sharia Audit',
      startDate: '2026-01-10',
      endDate: '2026-08-15',
      scope: {
        departments: ['Finance Department', 'Investment Department', 'Retail Treasury'],
        systems: ['Odoo ERP', 'Mambu Core', 'ICAP Compliance Engine'],
        processes: ['Murabaha Financing', 'Sukuk Portfolios', 'Purification Account Routing']
      },
      team: {
        auditors: ['Adil Mansoor, CFA', 'Sarah Al-Ghamdi'],
        reviewers: ['Sheikh Zain Al-Abedin', 'Yasmin Farooq']
      },
      status: 'In Progress'
    },
    {
      id: 'AUD-2026-002',
      name: 'Q2 ERP Transaction Audit',
      type: 'ERP Transaction Audit',
      startDate: '2026-04-01',
      endDate: '2026-05-30',
      scope: {
        departments: ['Operations', 'IT Systems', 'Finance Department'],
        systems: ['SAP ERP', 'ICAP API Gateway'],
        processes: ['Journal Entry Approvals', 'Vendor Onboarding', 'Interest Isolation']
      },
      team: {
        auditors: ['Sarah Al-Ghamdi'],
        reviewers: ['Yasmin Farooq']
      },
      status: 'Completed'
    }
  ]);

  const [selectedAuditId, setSelectedAuditId] = useState<string>('AUD-2026-001');

  // Interactive Audit Procedures
  const [procedures, setProcedures] = useState<AuditProcedure[]>([
    {
      id: 'PROC-101',
      auditId: 'AUD-2026-001',
      name: 'Verify Payment Approvals & Riba Exclusion',
      objective: 'Ensure all outbound payments match purchase orders and do not include hidden interest components.',
      riskAddressed: 'Unintentional payment of conventional charges or non-compliant interest (Riba).',
      testingMethod: 'Review sample of 100 payments above $10,000 against underlying agreements and sign-offs.',
      requiredEvidence: 'Payment records, Purchase orders, Dual approval logs',
      responsibleAuditor: 'Adil Mansoor, CFA'
    },
    {
      id: 'PROC-102',
      auditId: 'AUD-2026-001',
      name: 'Assess Late Payment Charity Routing',
      objective: 'Verify that penalty fees charged to overdue clients are deposited entirely into the charity purification account.',
      riskAddressed: 'Retaining penalty charges as corporate income, which is strictly prohibited under AAOIFI standards.',
      testingMethod: 'Trace late fees ledger entries to the verified Sharia Trust escrow statement.',
      requiredEvidence: 'ERP penalty ledger, Bank transfers to Charity escrow',
      responsibleAuditor: 'Sarah Al-Ghamdi'
    },
    {
      id: 'PROC-103',
      auditId: 'AUD-2026-001',
      name: 'Sukuk Asset Possession Verification',
      objective: 'Verify that Sukuk assets actually exist and are legally held/leased by the bank.',
      riskAddressed: 'Selling/trading assets before possession, invalidating the Murabaha sequence.',
      testingMethod: 'Reconcile Registry deeds and Custodian records with transaction times.',
      requiredEvidence: 'Asset Registry title deeds, Purchase logs',
      responsibleAuditor: 'Adil Mansoor, CFA'
    }
  ]);

  // Interactive Working Papers
  const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>([
    {
      id: 'WP-301',
      auditId: 'AUD-2026-001',
      title: 'Review of Late Fees Charity Escrow Routing',
      auditArea: 'Revenue Purification',
      procedure: 'Trace penalty accounts and reconcile with charity disbursements.',
      testingPerformed: 'Sampled 45 overdue penalty actions. Validated that 100% of collected penalty fee cash ($32,450) was transferred to Al-Mustaqbal Charity Trust.',
      evidenceAttached: ['EVID-005: Late Penalty Ledger', 'EVID-009: Escrow Wire Receipt'],
      conclusion: 'Operating effectively. No penalty funds were kept in the commercial pool.',
      reviewerComments: 'Sheikh Zain: Verified. Please add the exact transaction hashes for bank audit tracking.',
      status: 'Approved',
      version: '1.1'
    },
    {
      id: 'WP-302',
      auditId: 'AUD-2026-001',
      title: 'Commodity Possession & Sequence Checks',
      auditArea: 'Murabaha Sequence',
      procedure: 'Trace transaction timeline for 50 Murabaha contracts.',
      testingPerformed: 'Reviewed timestamp integrity for asset purchase versus customer resale. Identified 3 transactions where client invoicing occurred 15 minutes before title was held.',
      evidenceAttached: ['EVID-012: ERP Timeline Log', 'EVID-015: Murabaha Contract PDF'],
      conclusion: 'Control deficiency found. Murabaha sequence was violated in 3 out of 50 instances.',
      reviewerComments: 'Pending board review on transaction timing tolerances.',
      status: 'Under Review',
      version: '1.0'
    }
  ]);

  // Interactive Evidence Management (Requirement 8 & 18: 100 documents represented)
  const [evidences, setEvidences] = useState<AuditEvidence[]>(() => {
    const data: AuditEvidence[] = [
      {
        id: 'EVID-001',
        auditId: 'AUD-2026-001',
        source: 'Mambu Core Banking Ledger',
        description: 'Retail Treasury Murabaha disbursement batch record H1 2026.',
        fileUrl: 'https://icap.ai/vault/evid-001.pdf',
        relatedProcedure: 'PROC-101',
        relatedFinding: 'FIND-008',
        collectedBy: 'Adil Mansoor, CFA',
        date: '2026-07-01',
        category: 'ERP Record'
      },
      {
        id: 'EVID-002',
        auditId: 'AUD-2026-001',
        source: 'Corporate Purifying Trust Statement',
        description: 'Purification account disbursement statement showing transfers to registered charities.',
        fileUrl: 'https://icap.ai/vault/purify_statement_2026.pdf',
        relatedProcedure: 'PROC-102',
        collectedBy: 'Sarah Al-Ghamdi',
        date: '2026-07-05',
        category: 'Report'
      },
      {
        id: 'EVID-003',
        auditId: 'AUD-2026-001',
        source: 'Metal Broker Possession Log',
        description: 'London Metal Exchange transaction confirmations for Tawarruq trades.',
        fileUrl: 'https://icap.ai/vault/lme_tawarruq_possession.pdf',
        relatedProcedure: 'PROC-103',
        relatedFinding: 'FIND-005',
        collectedBy: 'Adil Mansoor, CFA',
        date: '2026-07-10',
        category: 'Contract'
      }
    ];

    // Seed up to 100 mock documents (Requirement 18)
    for (let i = 4; i <= 100; i++) {
      data.push({
        id: `EVID-${String(i).padStart(3, '0')}`,
        auditId: 'AUD-2026-001',
        source: i % 2 === 0 ? 'Odoo Financial Feed' : 'SAMA Regulatory Archive',
        description: `Automated compliance evidence checkpoint #${i} - transaction stream proof.`,
        fileUrl: `https://icap.ai/vault/auto-proof-${i}.pdf`,
        relatedProcedure: i % 3 === 0 ? 'PROC-101' : 'PROC-102',
        collectedBy: 'ICAP Sentinel Agent',
        date: `2026-07-${String((i % 15) + 1).padStart(2, '0')}`,
        category: i % 4 === 0 ? 'ERP Record' : i % 4 === 1 ? 'Document' : i % 4 === 2 ? 'Screenshot' : 'Report'
      });
    }
    return data;
  });

  // Interactive Findings Management (Requirement 11 & 18: 15 realistic findings)
  const [findings, setFindings] = useState<AuditFinding[]>([
    {
      id: 'FIND-001',
      auditId: 'AUD-2026-001',
      title: 'Unpurified Revenue Contamination in Treasury Yield',
      category: 'Revenue Purification',
      severity: 'Critical',
      condition: 'Conventional treasury yield earnings of $145,200 were mixed directly into the commercial income account rather than isolated.',
      criteria: 'AAOIFI Sharia Standard No. 12 mandates complete segregation and purification of any non-compliant earnings.',
      cause: 'Automated ledger routing rules failed to tag late settlement interest charges correctly.',
      effect: 'Contamination of total distributable profit and risk of distributing unpurified capital to retail depositors.',
      recommendation: 'Transfer $145,200 immediately to the registered Sharia Purification Escrow and update SAP trigger rule #802.',
      status: 'Open',
      evidence: ['EVID-001', 'EVID-015']
    },
    {
      id: 'FIND-002',
      auditId: 'AUD-2026-001',
      title: 'Lack of Board Fatwa for Commodity Murabaha Rollovers',
      category: 'Credit & Contracts',
      severity: 'High',
      condition: 'A credit rollover structure for a $4M client facility was extended with fee terms that have not been approved by the Sharia Board.',
      criteria: 'SAMA Islamic Finance Rules require explicit fatwas for all commercial contracts and modifications.',
      cause: 'The credit risk team executed the rollover using a standard commercial template during an emergency client crunch.',
      effect: 'The entire rollover agreement is legally non-compliant, exposing the institution to severe regulatory penalties.',
      recommendation: 'Pause the extension, execute a revised Wa\'d compliant structure, and present to the Sharia Committee.',
      status: 'Under Review',
      evidence: ['EVID-003']
    },
    {
      id: 'FIND-003',
      auditId: 'AUD-2026-001',
      title: 'Delayed Title Transfers in Ijarah Leasing Assets',
      category: 'Asset Ownership',
      severity: 'Medium',
      condition: 'Vehicle title deeds remained under the bank’s commercial register for 90+ days following client payoff.',
      criteria: 'Ijarah Muntahia Bittamleek standards require prompt ownership transfer to avoid the risk of void lease conditions.',
      cause: 'Physical paperwork backlogs in the operations department.',
      effect: 'The bank remains legally liable for lease operations beyond contract duration, implying non-compliant ownership.',
      recommendation: 'Deploy digital title verification protocols and synchronize payoff statuses directly with national motor registers.',
      status: 'In Progress',
      evidence: ['EVID-010', 'EVID-011']
    },
    {
      id: 'FIND-004',
      auditId: 'AUD-2026-001',
      title: 'Deficient Risk-Sharing Capital Allocation in Mudarabah Contracts',
      category: 'Partnership Governance',
      severity: 'High',
      condition: 'Under active partnership investments, standard contract clauses set the client partner profit cut at 95% while bank absorbs 100% of operating losses unconditionally.',
      criteria: 'Mudarabah rules mandate losses must be borne by the capital provider unless negligence is proven.',
      cause: 'Incomplete risk reviews during client onboarding.',
      effect: 'The bank carries full exposure, violating the genuine risk-sharing spirit of Islamic partnership governance.',
      recommendation: 'Redraft contract appendix B and restructure capital ratios to match standard AAOIFI formulas.',
      status: 'Open',
      evidence: ['EVID-022']
    },
    {
      id: 'FIND-005',
      auditId: 'AUD-2026-001',
      title: 'Incomplete Invoices for Tawarruq Trading Transactions',
      category: 'ERP Sequence',
      severity: 'Medium',
      condition: 'Out of 250 checked Tawarruq transactions, 18 lacked the corresponding metal warehouse possession certificates.',
      criteria: 'A genuine transaction sequence requires holding physical/constructive possession of goods before sale.',
      cause: 'Omission of electronic document delivery by the London Metal Exchange broker api.',
      effect: 'Risk of paper trading (Riba-al-Fadl) which renders the transaction invalid.',
      recommendation: 'Integrate real-time broker APIs to fetch custody receipts automatically before executing the resale contract.',
      status: 'Corrected',
      evidence: ['EVID-003', 'EVID-044']
    },
    {
      id: 'FIND-006',
      auditId: 'AUD-2026-001',
      title: 'Excessive Late Payment Fees Lacking Charity Allocation',
      category: 'Revenue Purification',
      severity: 'High',
      condition: 'Overdue retail loan late payment penalties of $42,500 were kept as profit in the retail treasury pool.',
      criteria: 'Late fees must be transferred immediately to charity to avoid charging interest (Riba).',
      cause: 'The automatic scheduler for purification transfers was disabled during IT server maintenance.',
      effect: 'Interest-like revenue was booked as core corporate income.',
      recommendation: 'Transfer $42,500 to Al-Mustaqbal Charity escrow and verify scheduler uptime metrics.',
      status: 'Open',
      evidence: ['EVID-002', 'EVID-081']
    },
    {
      id: 'FIND-007',
      auditId: 'AUD-2026-001',
      title: 'Unhedged Foreign Exchange Exposure in Sukuk Portfolio',
      category: 'Sukuk Risk Management',
      severity: 'Medium',
      condition: 'An active USD 15M Sukuk holding has a volatile foreign currency risk that is unhedged.',
      criteria: 'Sharia investment guidelines require robust risk mitigation framework using Sharia-compliant FX hedging (Arboon or Wa\'d).',
      cause: 'Risk desks did not apply the Sharia compliant Wa\'d hedging overlay.',
      effect: 'Potential financial volatility threatening depositors pool funds.',
      recommendation: 'Execute a Sharia-compliant Wa\'d FX derivative overlay to stabilize return profiles.',
      status: 'Accepted',
      evidence: ['EVID-099']
    },
    {
      id: 'FIND-008',
      auditId: 'AUD-2026-001',
      title: 'Improper Asset Possession Prior to Resale in Murabaha',
      category: 'ERP Sequence',
      severity: 'High',
      condition: 'Invoicing was generated for 4 auto Murabaha loans before the dealer confirmed vehicle dispatch.',
      criteria: 'Constructive possession is required before resale to client can occur.',
      cause: 'The dealer portal integration allowed clients to sign final resale agreements pre-maturely.',
      effect: 'Invalid sequence of sales contract violating genuine trading principles.',
      recommendation: 'Apply electronic sequence blocks in Mambu Core so invoices remain locked until dealer dispatch certificate is received.',
      status: 'Verified',
      evidence: ['EVID-001', 'EVID-077']
    },
    {
      id: 'FIND-009',
      auditId: 'AUD-2026-001',
      title: 'Co-mingling of Proprietary and Trust Assets',
      category: 'Asset Segregation',
      severity: 'High',
      condition: 'Client escrow cash from home finance deposits was combined with corporate treasury operating reserves.',
      criteria: 'Trust assets must remain segregated under fiduciary standards.',
      cause: 'Core billing system mapped deposit codes to a unified ledger.',
      effect: 'Fiduciary risk and potential contamination of depositor capital pools.',
      recommendation: 'Configure separate sub-ledgers and assign distinctive bank account codes.',
      status: 'Open',
      evidence: ['EVID-014']
    },
    {
      id: 'FIND-010',
      auditId: 'AUD-2026-001',
      title: 'Undisclosed Profit Calculation Weights in Investment Accounts',
      category: 'Disclosure & Compliance',
      severity: 'Low',
      condition: 'The public website and account terms omitted the current profit-sharing weights for Q1 2026.',
      criteria: 'AAOIFI Standard No. 8 mandates clear and prospective disclosure of profit-sharing ratios to mudarabah depositors.',
      cause: 'Marketing materials update delayed after the board adjustment.',
      effect: 'Customers deposited capital without legally required transparent profit metrics.',
      recommendation: 'Update all customer portals and app dashboards with current profit-sharing weight widgets immediately.',
      status: 'Closed',
      evidence: ['EVID-033']
    },
    {
      id: 'FIND-011',
      auditId: 'AUD-2026-001',
      title: 'Non-Standard Commodity Sourcing for Metal Trading',
      category: 'Tawarruq Sourcing',
      severity: 'Medium',
      condition: 'Tawarruq transactions in April used restricted tobacco assets as underlying commodity assets.',
      criteria: 'Underlying assets must be ethically clean, standard, halal, and non-restricted commodities.',
      cause: 'Default broker pool configurations on metal exchange switched to generic indices during low inventory.',
      effect: 'Contract invalidation under Islamic ethical standards.',
      recommendation: 'Expose metadata filter checks to reject tobacco, weapon, or gaming assets automatically.',
      status: 'In Progress',
      evidence: ['EVID-049']
    },
    {
      id: 'FIND-012',
      auditId: 'AUD-2026-001',
      title: 'Inadequate Auditor Indemnification Terms in Waqf Management',
      category: 'Fiduciary Waqf',
      severity: 'Low',
      condition: 'The Waqf foundation contract templates contained obsolete risk indemnity clauses unaligned with modern trust laws.',
      criteria: 'Corporate ethical governance require balanced protection rules.',
      cause: 'Outdated template libraries in the legal repository.',
      effect: 'Potential liability risk for external auditing board representatives.',
      recommendation: 'Update standard boilerplate clauses across Waqf investment templates.',
      status: 'Accepted',
      evidence: ['EVID-055']
    },
    {
      id: 'FIND-013',
      auditId: 'AUD-2026-001',
      title: 'Lack of Independent Sharia Audit for Crypto Staking Yield Pools',
      category: 'DeFi & Fintech',
      severity: 'High',
      condition: 'The DeFi liquidity staking project launched liquid assets pooling in H1 without Sharia audit review.',
      criteria: 'Fintech Sharia principles require early, independent validation of DeFi smart yields.',
      cause: 'The tech product unit bypassed compliance review to meet a rapid launch schedule.',
      effect: 'Potential interest-generation (Riba) hidden within yield staking strategies.',
      recommendation: 'Conduct an immediate manual Sharia audit on the yield pool smart contract code and pause customer deposits.',
      status: 'Under Review',
      evidence: ['EVID-067']
    },
    {
      id: 'FIND-014',
      auditId: 'AUD-2026-001',
      title: 'Improper Calculation of Purifying Zakat Base',
      category: 'Zakat Accounting',
      severity: 'Medium',
      condition: 'Long-term corporate infrastructure holdings worth $15M were mistakenly excluded from current Zakat base computations.',
      criteria: 'AAOIFI Standard No. 35 outlines the specific framework for identifying zakatable assets versus long-term capital assets.',
      cause: 'Excel-based calculator did not incorporate current SAMA Zakat guidance updates.',
      effect: 'Zakat liability was undercalculated by $37,500.',
      recommendation: 'Recompute Zakat utilizing updated formulas and process immediate adjustment.',
      status: 'Open',
      evidence: ['EVID-082']
    },
    {
      id: 'FIND-015',
      auditId: 'AUD-2026-001',
      title: 'Outdated SOPs for Islamic Wealth Advisory Services',
      category: 'Operations',
      severity: 'Low',
      condition: 'Client onboarding procedures for high-net-worth individuals are unaligned with recent SAMA Wealth Management regulations.',
      criteria: 'All investment procedures must maintain current regulatory alignment.',
      cause: 'SOP was not updated since the standard changed in 2024.',
      effect: 'Operational compliance exposure and potential advisory issues.',
      recommendation: 'Draft update for Wealth SOP v4.2 and align client wealth profiles with Sharia asset classification.',
      status: 'Closed',
      evidence: ['EVID-021']
    }
  ]);

  // Interactive Corrective Actions (Requirement 13 & 18: 10 examples)
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([
    {
      id: 'ACT-501',
      findingId: 'FIND-001',
      findingTitle: 'Unpurified Revenue Contamination in Treasury Yield',
      actionRequired: 'Move $145,200 from treasury pools into Escrow purifying ledger; modify system rule in SAP ERP.',
      owner: 'Adil Mansoor, CFA',
      deadline: '2026-08-01',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: 'ACT-502',
      findingId: 'FIND-002',
      findingTitle: 'Lack of Board Fatwa for Commodity Murabaha Rollovers',
      actionRequired: 'Pause contract rollovers, modify clauses to match Wa\'d rules and schedule Sharia Board presentation.',
      owner: 'Sarah Al-Ghamdi',
      deadline: '2026-07-31',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 'ACT-503',
      findingId: 'FIND-003',
      findingTitle: 'Delayed Title Transfers in Ijarah Leasing Assets',
      actionRequired: 'Update physical paperwork workflows and implement SAMA API integration for instant registrations.',
      owner: 'Director of Retail Ops',
      deadline: '2026-09-15',
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      id: 'ACT-504',
      findingId: 'FIND-004',
      findingTitle: 'Deficient Risk-Sharing Capital Allocation in Mudarabah Contracts',
      actionRequired: 'Incorporate maximum loss clauses in active contract terms and submit draft modifications.',
      owner: 'Head of Legal & Contracts',
      deadline: '2026-08-15',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 'ACT-505',
      findingId: 'FIND-005',
      findingTitle: 'Incomplete Invoices for Tawarruq Trading Transactions',
      actionRequired: 'Update trade integrations with LME API to ensure automated storage of title certificates.',
      owner: 'Sarah Al-Ghamdi',
      deadline: '2026-06-30',
      priority: 'Medium',
      status: 'Verified',
      evidenceOfCompletion: 'LME Broker API integration finalized & 100% receipt retrieval confirmed.'
    },
    {
      id: 'ACT-506',
      findingId: 'FIND-006',
      findingTitle: 'Excessive Late Payment Fees Lacking Charity Allocation',
      actionRequired: 'Wire $42,500 collected penalties to Al-Mustaqbal trust account; verify cron task scheduler configuration.',
      owner: 'Finance Controller',
      deadline: '2026-08-05',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: 'ACT-507',
      findingId: 'FIND-007',
      findingTitle: 'Unhedged Foreign Exchange Exposure in Sukuk Portfolio',
      actionRequired: 'Implement a Wa\'d-compliant FX forward purchase agreement on the treasury desk.',
      owner: 'Treasury Desk Officer',
      deadline: '2026-08-20',
      priority: 'Medium',
      status: 'Open'
    },
    {
      id: 'ACT-508',
      findingId: 'FIND-008',
      findingTitle: 'Improper Asset Possession Prior to Resale in Murabaha',
      actionRequired: 'Install automated lock sequences in dealer mobile portal to block client signing before GPS confirmation of transport.',
      owner: 'Fintech Product Lead',
      deadline: '2026-05-20',
      priority: 'High',
      status: 'Verified',
      evidenceOfCompletion: 'System Release v2.9 blocks checkout until GPS coordinates match transport fleet logs.'
    },
    {
      id: 'ACT-509',
      findingId: 'FIND-009',
      findingTitle: 'Co-mingling of Proprietary and Trust Assets',
      actionRequired: 'Create dedicated trust cash accounts and redirect Odoo deposit routing coordinates.',
      owner: 'Chief Financial Officer',
      deadline: '2026-08-10',
      priority: 'High',
      status: 'Open'
    },
    {
      id: 'ACT-510',
      findingId: 'FIND-014',
      findingTitle: 'Improper Calculation of Purifying Zakat Base',
      actionRequired: 'Adjust current financial provisions, recalculate Zakat liability, and transfer deficit of $37,500.',
      owner: 'Zakat Tax Lead',
      deadline: '2026-08-01',
      priority: 'Medium',
      status: 'In Progress'
    }
  ]);

  // AI Assistant Interactions (Requirement 4, 9, 12, 14, 16)
  const [aiChatHistory, setAiChatHistory] = useState<{ sender: 'user' | 'assistant'; text: string; timestamp: string }[]>([
    {
      sender: 'assistant',
      text: 'Marhaban. I am the ICAP Sharia & Regulatory Compliance Auditor. How can I assist you with audit planning, evidence analysis, findings draft generator, or reviewing transaction entries today?',
      timestamp: '16:45'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Planning Assistant States (Requirement 4)
  const [planAuditType, setPlanAuditType] = useState<Audit['type']>('Sharia Audit');
  const [planBusinessArea, setPlanBusinessArea] = useState<string>('ERP Finance & Murabaha Sequence');
  const [planRiskLevel, setPlanRiskLevel] = useState<'High' | 'Medium' | 'Low'>('High');
  const [planPreviousFindings, setPlanPreviousFindings] = useState<string>('Unpurified conventional revenue, delayed title transfer for leased assets.');
  const [planResult, setPlanResult] = useState<any>(null);

  // Evidence Scanner States (Requirement 9)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('EVID-003');
  const [evidenceAnalysisResult, setEvidenceAnalysisResult] = useState<any>(null);

  // Finding Draft Generator States (Requirement 12)
  const [draftSourceTest, setDraftSourceTest] = useState<string>('Auto rule testing showed 12 duplicate payments in Retail Mudarabah ledger');
  const [generatedDraftFinding, setGeneratedDraftFinding] = useState<AuditFinding | null>(null);

  // Recommendation Engine State (Requirement 14)
  const [recommendationResult, setRecommendationResult] = useState<string[] | null>(null);

  // Working Paper Editor Overlay
  const [showWpModal, setShowWpModal] = useState<boolean>(false);
  const [editingWp, setEditingWp] = useState<WorkingPaper | null>(null);
  const [wpTitle, setWpTitle] = useState('');
  const [wpArea, setWpArea] = useState('');
  const [wpTesting, setWpTesting] = useState('');
  const [wpConclusion, setWpConclusion] = useState('');

  // New Audit Engagement form
  const [showEngagementForm, setShowEngagementForm] = useState<boolean>(false);
  const [newAuditName, setNewAuditName] = useState('');
  const [newAuditType, setNewAuditType] = useState<Audit['type']>('Sharia Audit');
  const [newAuditStart, setNewAuditStart] = useState('2026-08-01');
  const [newAuditEnd, setNewAuditEnd] = useState('2026-12-31');
  const [newAuditDeps, setNewAuditDeps] = useState('Retail Lending, Treasury');

  // Trigger Notification Toasts
  const [toast, setToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // HANDLER: Audit Engagement Creation (Requirement 3)
  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditName.trim()) return;

    const newAudit: Audit = {
      id: `AUD-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: newAuditName,
      type: newAuditType,
      startDate: newAuditStart,
      endDate: newAuditEnd,
      scope: {
        departments: newAuditDeps.split(',').map(s => s.trim()),
        systems: ['Odoo ERP', 'Mambu Core', 'ICAP Compliance Engine'],
        processes: ['Compliance Scans', 'Governance Checkpoints']
      },
      team: {
        auditors: ['Sarah Al-Ghamdi'],
        reviewers: ['Sheikh Zain Al-Abedin']
      },
      status: 'Planning'
    };

    setAudits([...audits, newAudit]);
    setSelectedAuditId(newAudit.id);
    setShowEngagementForm(false);
    triggerToast(isRTL ? 'تم إنشاء مراجعة التدقيق بنجاح.' : 'Audit Engagement successfully provisioned.');
    onTriggerActivityLog('CREATE_AUDIT_ENGAGEMENT', `Created audit: ${newAuditName}`);
  };

  // HANDLER: AI Audit Planner (Requirement 4)
  const handleGenerateAuditPlan = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const isSharia = planAuditType === 'Sharia Audit';
      setPlanResult({
        scope: isSharia
          ? ['Verify Murabaha possession sequences', 'Trace penalty late fee disbursement pools', 'Review profit-weight publication timing']
          : ['Check journal entry double sign-offs', 'Audit supplier bank transfer changes', 'Isolate potential interest rate swaps'],
        objectives: [
          `Ensure full compliance with AAOIFI standards for ${planAuditType}.`,
          `Mitigate operational risks in ${planBusinessArea} mapped to current SAMA framework.`
        ],
        procedures: [
          { name: 'Reconcile Late Penalty accounts', test: 'Trace ERP payments against Sharia Charity Escrow receipts' },
          { name: 'Possession Timing Audit', test: 'Cross-analyze inventory dispatch certificates against customer sales agreements' }
        ],
        requiredEvidence: [
          'Purchase Order logs',
          'GPS transport coordinates or third-party bills of lading',
          'Escrow monthly trust statements'
        ],
        riskAreas: [
          { area: 'Asset Possession', risk: 'High risk of deferred pricing sales before owning target asset.' },
          { area: 'Purification Accounting', risk: 'Medium risk of interest-based delay penalties retained in commercial profit pools.' }
        ]
      });
      setIsAiLoading(false);
      triggerToast(isRTL ? 'تم توليد خطة التدقيق بالذكاء الاصطناعي.' : 'AI Audit Program successfully formulated.');
      onTriggerActivityLog('GENERATE_AI_AUDIT_PLAN', `Generated plan for ${planAuditType}`);
    }, 1200);
  };

  // HANDLER: Working Paper CRUD & Approval (Requirement 7)
  const handleOpenWpEdit = (wp: WorkingPaper | null) => {
    setEditingWp(wp);
    if (wp) {
      setWpTitle(wp.title);
      setWpArea(wp.auditArea);
      setWpTesting(wp.testingPerformed);
      setWpConclusion(wp.conclusion);
    } else {
      setWpTitle('');
      setWpArea('');
      setWpTesting('');
      setWpConclusion('');
    }
    setShowWpModal(true);
  };

  const handleSaveWorkingPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWp) {
      // Edit existing
      setWorkingPapers(workingPapers.map(wp => {
        if (wp.id === editingWp.id) {
          return {
            ...wp,
            title: wpTitle,
            auditArea: wpArea,
            testingPerformed: wpTesting,
            conclusion: wpConclusion,
            version: `${parseFloat(wp.version) + 0.1}`.substring(0, 3)
          };
        }
        return wp;
      }));
      triggerToast(isRTL ? 'تم حفظ ورقة العمل التدقيقية.' : 'Working paper updated and version bumped.');
    } else {
      // Create new
      const newWp: WorkingPaper = {
        id: `WP-${Math.floor(303 + Math.random() * 100)}`,
        auditId: selectedAuditId,
        title: wpTitle,
        auditArea: wpArea,
        procedure: 'Manual Review & AI assisted sampling validation.',
        testingPerformed: wpTesting,
        evidenceAttached: ['EVID-001', 'EVID-002'],
        conclusion: wpConclusion,
        reviewerComments: 'Awaiting first reviewer check.',
        status: 'Draft',
        version: '1.0'
      };
      setWorkingPapers([...workingPapers, newWp]);
      triggerToast(isRTL ? 'تم إنشاء ورقة عمل جديدة.' : 'New working paper created.');
    }
    setShowWpModal(false);
  };

  const handleApproveWorkingPaper = (id: string) => {
    setWorkingPapers(workingPapers.map(wp => {
      if (wp.id === id) {
        return {
          ...wp,
          status: 'Approved',
          reviewerComments: `Approved by Sheikh Zain on ${new Date().toISOString().substring(0, 10)}.`
        };
      }
      return wp;
    }));
    triggerToast(isRTL ? 'تم اعتماد ورقة العمل.' : 'Working paper successfully signed off.');
    onTriggerActivityLog('APPROVE_WORKING_PAPER', `Approved working paper ${id}`);
  };

  // HANDLER: AI Evidence Analyzer (Requirement 9)
  const handleAnalyzeEvidence = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const selected = evidences.find(e => e.id === selectedEvidenceId);
      if (selected) {
        setEvidenceAnalysisResult({
          file: selected.source,
          category: selected.category,
          status: 'Inspected',
          relevance: 'Highly relevant for confirming Murabaha seq transaction timelines.',
          missingItems: selected.id === 'EVID-001' ? ['Dealer Dispatch Voucher', 'Invoicing time-stamp metadata'] : ['Reconciliation worksheet'],
          potentialIssues: selected.id === 'EVID-001'
            ? 'Timeline indicates client was invoiced before physical dealer delivery confirmation. Suggest potential contract sequence breach.'
            : 'None detected. Ledger routing perfectly matches designated charity escrow details.',
          riskScore: selected.id === 'EVID-001' ? 'High Risk Indicator' : 'Fully Compliant'
        });
      }
      setIsAiLoading(false);
      triggerToast(isRTL ? 'اكتمل تحليل المستند بالذكاء الاصطناعي.' : 'Evidence scanned successfully.');
      onTriggerActivityLog('ANALYZE_EVIDENCE_AI', `Analyzed evidence item ${selectedEvidenceId}`);
    }, 1000);
  };

  // HANDLER: AI Finding Draft Generator (Requirement 12)
  const handleGenerateFindingDraft = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const draft: AuditFinding = {
        id: `FIND-DFT-${Math.floor(100 + Math.random() * 900)}`,
        auditId: selectedAuditId,
        title: 'Mudarabah Partner Asset Allocation Deficiency',
        category: 'Partnership Governance',
        severity: 'High',
        condition: 'ERP automated rule tests detected anomalous entries where losses on mudarabah partnerships were borne solely by the liquid funds account without verifying negligence factors.',
        criteria: 'SAMA Compliance Framework Chapter 4 rules require that losses must result in capital impairment for both parties or be proven as partner misconduct prior to recovery adjustments.',
        cause: 'Accounting rules in Odoo ERP integration had default allocations mapping all write-offs to a single operating profit balance.',
        effect: 'Contaminated the capital base and violates core Sharia trust partnership mandates.',
        recommendation: 'Establish an automated sequence block in Mambu Core to lock mudarabah write-offs until an independent expert board approves.',
        status: 'Open',
        evidence: ['EVID-001']
      };
      setGeneratedDraftFinding(draft);
      setIsAiLoading(false);
      triggerToast(isRTL ? 'تم توليد مسودة الملاحظة بالذكاء الاصطناعي.' : 'AI drafted a compliance finding.');
      onTriggerActivityLog('GENERATE_AI_FINDING', 'Drafted mudarabah finding');
    }, 1200);
  };

  const handleApproveDraftFinding = () => {
    if (generatedDraftFinding) {
      setFindings([generatedDraftFinding, ...findings]);
      setGeneratedDraftFinding(null);
      triggerToast(isRTL ? 'تم تحويل المسودة إلى ملاحظة رسمية معتمدة.' : 'Draft promoted to active finding list.');
      onTriggerActivityLog('PROMOTE_AI_FINDING', 'Promoted draft to active findings list');
    }
  };

  // HANDLER: AI Recommendation Engine (Requirement 14)
  const handleGenerateRecommendations = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setRecommendationResult([
        'Update Wealth Advisory SOP v4.2 to align customer onboarding with latest SAMA regulatory codes.',
        'Improve the automated approval timeline sequences in Odoo for Tawarruq commodity buying.',
        'Train retail lending and operations personnel on proper possession sequencing rules.',
        'Modify system controls to block invoices being generated pre-maturely in Murabaha.',
        'Review corporate trust ledger segregation settings weekly to eliminate cash pool mixing.'
      ]);
      setIsAiLoading(false);
      triggerToast(isRTL ? 'تم توليد التوصيات التحسينية.' : 'AI recommendations extracted.');
    }, 800);
  };

  // HANDLER: AI Audit Chat Copilot (Requirement 16)
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString().substring(0, 5) }]);
    setChatInput('');
    setIsAiLoading(true);

    setTimeout(() => {
      let aiText = '';
      const textLower = userMsg.toLowerCase();

      if (textLower.includes('high-risk') || textLower.includes('risk') || textLower.includes('خطرة')) {
        aiText = 'I have analyzed active findings and identified 4 Critical issues. The highest risk corresponds to "Unpurified Revenue Contamination in Treasury Yield" ($145,200 contaminated) and "Lack of Board Fatwa for Commodity Murabaha Rollovers" ($4M pool). I recommend immediate ledger re-routing.';
      } else if (textLower.includes('why') || textLower.includes('reason') || textLower.includes('لماذا')) {
        aiText = 'This finding was triggered because automated compliance checks in our ICAP Sentinel Engine detected late fees kept in the corporate profit account. Under AAOIFI Standard No. 12, late fees must be deposited in a designated charity purification escrow.';
      } else if (textLower.includes('evidence') || textLower.includes('support') || textLower.includes('دليل')) {
        aiText = 'This audit finding is supported by digital evidence file EVID-001 (disbursement batch record) and EVID-003 (LME metal transaction timelines indicating sale was initiated prior to legal title holding confirmation).';
      } else if (textLower.includes('previous') || textLower.includes('history') || textLower.includes('سابق')) {
        aiText = 'Our records show that in Q4 2025, there was a similar issue in delayed vehicle registry deeds for Ijarah. Action ACT-503 is currently in progress to integrate automatic title transfer APIs to prevent reoccurrence.';
      } else {
        aiText = 'Based on the Annual Islamic Finance Audit 2026 dataset, I can see 15 findings (4 critical, 3 pending review). To proceed, we should verify the implementation status of Al-Mustaqbal Charity Trust escrow transactions ($42,500). What would you like me to analyze next?';
      }

      setAiChatHistory(prev => [...prev, { sender: 'assistant', text: aiText, timestamp: new Date().toLocaleTimeString().substring(0, 5) }]);
      setIsAiLoading(false);
      onTriggerActivityLog('COPILOT_CHAT_QUERY', `Auditor asked: "${userMsg.substring(0, 30)}..."`);
    }, 1100);
  };

  // Status Style Helper
  const getSeverityBadge = (sev: AuditFinding['severity']) => {
    switch (sev) {
      case 'Critical': return 'bg-red-500/10 text-red-500 border border-red-500/20 font-mono';
      case 'High': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono';
      case 'Medium': return 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-mono';
      case 'Low': return 'bg-slate-500/10 text-slate-500 border border-slate-500/20 font-mono';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Title Banner */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز التدقيق الشرعي الذكي' : 'ICAP AI Audit Workspace'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/20">
                  {isRTL ? 'الجيل الرابع للتدقيق' : 'Continuous Assurance'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL
                  ? 'برنامج تدقيق وتخطيط فوري للامتثال المالي الإسلامي - رصد وتصحيح انحرافات العقود والتدفقات المالية آلياً.'
                  : 'Empower compliance and risk officers with continuous, AI-assisted Islamic audit planning, digital working papers, and evidence verification.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEngagementForm(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRTL ? 'بدء مهمة تدقيق جديدة' : 'Initiate Audit Engagement'}</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation tabs (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة القيادة والمؤشرات' : 'Audit Dashboard', icon: Layers },
            { id: 'planning', name: isRTL ? 'تخطيط التدقيق الذكي' : 'Audit Planning', icon: Sliders },
            { id: 'engagements', name: isRTL ? 'مهمات التدقيق القائمة' : 'Audit Engagements', icon: Briefcase },
            { id: 'procedures', name: isRTL ? 'إجراءات ومناهج التدقيق' : 'Audit Procedures', icon: FileText },
            { id: 'papers', name: isRTL ? 'أوراق العمل الرقمية' : 'Working Papers', icon: FileCheck },
            { id: 'evidence', name: isRTL ? 'إدارة الأدلة والوثائق' : 'Evidence Management', icon: Database },
            { id: 'findings', name: isRTL ? 'الملاحظات والانحرافات' : 'Audit Findings', icon: AlertTriangle },
            { id: 'actions', name: isRTL ? 'الإجراءات التصحيحية' : 'Corrective Actions', icon: CheckSquare },
            { id: 'assistant', name: isRTL ? 'مساعد التدقيق الذكي' : 'AI Audit Copilot', icon: Sparkles }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Floating toast message */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 text-xs border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ====================================================
            LEFT/MAIN COLUMN
            ==================================================== */}
        <div className="xl:col-span-2 space-y-6">

          {/* 1. SUB-PAGE: AUDIT DASHBOARD (Requirement 2) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { title: isRTL ? 'مهمات نشطة' : 'Active Audits', value: '12', color: 'text-emerald-600 border-emerald-500/10' },
                  { title: isRTL ? 'مهمات مكتملة' : 'Completed Audits', value: '45', color: 'text-slate-500 border-slate-500/10' },
                  { title: isRTL ? 'ملاحظات مفتوحة' : 'Open Findings', value: '32', color: 'text-amber-500 border-amber-500/10 animate-pulse' },
                  { title: isRTL ? 'ملاحظات حرجة' : 'Critical Findings', value: '4', color: 'text-red-500 border-red-500/10' },
                  { title: isRTL ? 'أدلة مجمعة' : 'Evidence Collected', value: '850', color: 'text-indigo-500 border-indigo-500/10' },
                  { title: isRTL ? 'معدل المعالجة' : 'Avg Resolution', value: '92%', color: 'text-cyan-500 border-cyan-500/10' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-center`}>
                    <span className="text-[10px] text-slate-400 font-bold block truncate">{stat.title}</span>
                    <span className={`text-2xl font-display font-black block mt-2 ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Big Four Visual Analytics Panels */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'تحليلات تقدم التدقيق وتوزيع المخاطر' : 'Audit Analytics & Risk Metrics'}</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Risk & Progression Bars */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{isRTL ? 'توزيع المخاطر حسب الأقسام' : 'Department Risk & Compliance Levels'}</span>
                    <div className="space-y-3">
                      {[
                        { name: 'Finance & Treasury', score: 'Highly Volatile (contaminations)', pct: 85, color: 'bg-red-500' },
                        { name: 'Investment Advisory', score: 'Medium Compliance Outliers', pct: 60, color: 'bg-amber-500' },
                        { name: 'Retail Lending', score: 'Minor Sequence Defects', pct: 35, color: 'bg-indigo-500' },
                        { name: 'Corporate Trust & Waqf', score: 'Fully Compliant', pct: 15, color: 'bg-emerald-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                            <span>{item.name}</span>
                            <span className="text-slate-400">{item.score}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Trends & Severity Stats */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{isRTL ? 'الخطة الزمنية للتسوية والمعالجة' : 'Resolution and Finding Severity Allocation'}</span>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800 space-y-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'إجمالي الملاحظات المكتشفة' : 'Total Findings Tracked'}</span>
                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">15 Real Samples Loaded</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'مستوى المخاطر الحرجة المفتوحة' : 'Open High/Critical Actions'}</span>
                        <span className="font-bold font-mono text-red-500">6 Actions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'متوسط سرعة الإغلاق للثغرات' : 'Average Finding Resolution Cycle'}</span>
                        <span className="font-bold font-mono text-emerald-600">8.4 Days</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                        {isRTL 
                          ? 'تحديث مستمر من أدلة ERP المصدرية وسجلات تداول المعادن.'
                          : 'Live data feed connects directly to the ERP journal audit sequence logs.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Audit Engagement Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audits.map((aud, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-600/10 p-2 rounded-lg">
                          <Briefcase className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{aud.name}</h4>
                          <span className="text-[10px] text-slate-400">{aud.type}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        aud.status === 'In Progress' ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                      }`}>{aud.status}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>{isRTL ? 'تاريخ البدء:' : 'Period:'} <strong className="text-slate-700 dark:text-slate-300">{aud.startDate} to {aud.endDate}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SUB-PAGE: AI AUDIT PLANNING (Requirement 4) */}
          {activeTab === 'planning' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    {isRTL ? 'مساعد صياغة وتخطيط برامج التدقيق بالذكاء الاصطناعي' : 'AI-Powered Audit Planning & Program Formulator'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRTL
                      ? 'حدد المعطيات وسيقوم مساعد الذكاء الاصطناعي بصياغة النطاق، الأهداف الاستراتيجية، برامج الفحص، والأدلة المطلوبة.'
                      : 'Define variables below to instruct the ICAP AI engine to draft objectives, procedures, and required evidence profiles.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 uppercase text-[10px]">{isRTL ? 'نوع التدقيق' : 'Audit Type'}</label>
                    <select
                      value={planAuditType}
                      onChange={(e) => setPlanAuditType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    >
                      <option value="Sharia Audit">Sharia Audit</option>
                      <option value="ERP Transaction Audit">ERP Transaction Audit</option>
                      <option value="Policy Compliance Audit">Policy Compliance Audit</option>
                      <option value="Financial Audit">Financial Audit</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 uppercase text-[10px]">{isRTL ? 'منطقة الأعمال المستهدفة' : 'Business Area'}</label>
                    <input
                      type="text"
                      value={planBusinessArea}
                      onChange={(e) => setPlanBusinessArea(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 uppercase text-[10px]">{isRTL ? 'مستوى المخاطر التقديري' : 'Initial Risk Level'}</label>
                    <select
                      value={planRiskLevel}
                      onChange={(e) => setPlanRiskLevel(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    >
                      <option value="High">High Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="Low">Low Risk</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-400 uppercase text-[10px]">{isRTL ? 'ملاحظات وتجاوزات سابقة كمدخلات' : 'Historical Finding Context'}</label>
                    <input
                      type="text"
                      value={planPreviousFindings}
                      onChange={(e) => setPlanPreviousFindings(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleGenerateAuditPlan}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
                  >
                    {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                    <span>{isRTL ? 'توليد برنامج التدقيق فورا' : 'Formulate Audit Program'}</span>
                  </button>
                </div>

                {/* AI Plan Output Display */}
                {planResult && (
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-emerald-500/20 text-xs space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider">{isRTL ? 'برنامج التدقيق الشرعي الموصى به' : 'Generated Audit Scope & Objectives (Requirement 6)'}</span>
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Accuracy 99.4%</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <strong className="block text-slate-700 dark:text-slate-300 mb-1">{isRTL ? 'نطاق التدقيق المقترح:' : 'Recommended Audit Scope:'}</strong>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          {planResult.scope.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>

                      <div>
                        <strong className="block text-slate-700 dark:text-slate-300 mb-1">{isRTL ? 'الأهداف الاستراتيجية:' : 'Audit Objectives:'}</strong>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          {planResult.objectives.map((o: string, i: number) => <li key={i}>{o}</li>)}
                        </ul>
                      </div>

                      <div>
                        <strong className="block text-slate-700 dark:text-slate-300 mb-1">{isRTL ? 'خطوات وإجراءات الفحص المقترحة:' : 'Recommended Procedures:'}</strong>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                          {planResult.procedures.map((p: any, i: number) => (
                            <div key={i} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-150">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.name}</span>
                              <p className="text-[11px] text-slate-400 mt-0.5">{p.test}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <strong className="block text-slate-700 dark:text-slate-300 mb-1">{isRTL ? 'القرائن والأدلة المطلوبة:' : 'Required Evidence checklist:'}</strong>
                          <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            {planResult.requiredEvidence.map((re: string, i: number) => <li key={i}>{re}</li>)}
                          </ul>
                        </div>
                        <div>
                          <strong className="block text-slate-700 dark:text-slate-300 mb-1">{isRTL ? 'مناطق التركيز والمخاطر الحرجة:' : 'Identified Risk Vectors:'}</strong>
                          <div className="space-y-1">
                            {planResult.riskAreas.map((ra: any, i: number) => (
                              <div key={i} className="text-[11px]">
                                <span className="font-semibold text-amber-600 block">{ra.area}</span>
                                <span className="text-slate-400">{ra.risk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. SUB-PAGE: AUDIT ENGAGEMENTS (Requirement 3) */}
          {activeTab === 'engagements' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مهمات التدقيق والامتثال الجارية' : 'Audit Engagement Management System'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'إدارة النطاق الجغرافي والأقسام وفريق العمل المعين للمهام.' : 'Manage audits types, start/end timelines, scope criteria, and assigned staff.'}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {audits.map(aud => (
                    <div
                      key={aud.id}
                      onClick={() => setSelectedAuditId(aud.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedAuditId === aud.id ? 'border-emerald-500 bg-emerald-600/5 dark:bg-emerald-500/5' : 'border-slate-150 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{aud.name}</h4>
                          <span className="text-[10px] text-slate-400 mt-1 block">{aud.type} • ID: {aud.id}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">{aud.status}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                        <div>
                          <strong className="block text-slate-600 dark:text-slate-300 mb-0.5">{isRTL ? 'الأقسام المستهدفة' : 'Assigned Departments:'}</strong>
                          <span className="truncate block">{aud.scope.departments.join(', ')}</span>
                        </div>
                        <div>
                          <strong className="block text-slate-600 dark:text-slate-300 mb-0.5">{isRTL ? 'الأنظمة المفحوصة' : 'Connected Systems:'}</strong>
                          <span className="truncate block">{aud.scope.systems.join(', ')}</span>
                        </div>
                        <div>
                          <strong className="block text-slate-600 dark:text-slate-300 mb-0.5">{isRTL ? 'فريق العمل' : 'Auditors & Reviewers:'}</strong>
                          <span className="truncate block">Auditors: {aud.team.auditors.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. SUB-PAGE: AUDIT PROCEDURES (Requirement 5) */}
          {activeTab === 'procedures' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'إجراءات ومناهج فحص تدفقات الامتثال' : 'Systematic Audit Procedures & Testing Methods'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'الخطوات الدقيقة لفحص المخاطر ومقارنة النتائج بالأدلة التوثيقية المطلوبة.' : 'Establish required testing methods, risk descriptions, and evidence inputs.'}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {procedures.map(proc => (
                    <div key={proc.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{proc.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{proc.id}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{proc.objective}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                        <div>
                          <strong className="text-slate-500 block">{isRTL ? 'منهجية الفحص الرقمية:' : 'Testing Method:'}</strong>
                          <span className="text-slate-400">{proc.testingMethod}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 block">{isRTL ? 'القرائن المطلوبة:' : 'Required Evidence:'}</strong>
                          <span className="text-emerald-600 font-bold">{proc.requiredEvidence}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SUB-PAGE: WORKING PAPERS SYSTEM (Requirement 7) */}
          {activeTab === 'papers' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'أوراق العمل والتوثيقات الرقمية' : 'Digital Working Papers Ledger'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'مراجعة وتعديل وتوقيع أوراق العمل والتحقق من صحة عينات التدقيق.' : 'Draft, modify, approve, and attach evidence records directly to the working paper.'}</p>
                  </div>
                  <button
                    onClick={() => handleOpenWpEdit(null)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'إنشاء ورقة عمل' : 'Add Paper'}</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {workingPapers.map(wp => (
                    <div key={wp.id} className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{wp.title}</h4>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{wp.auditArea} • ID: {wp.id} • Version: v{wp.version}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            wp.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>{wp.status}</span>
                          <button
                            onClick={() => handleOpenWpEdit(wp)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-[11px] text-slate-400">
                        <div>
                          <strong className="text-slate-600 dark:text-slate-300 block">{isRTL ? 'تفاصيل الفحص والاختبار الجاري:' : 'Testing Performed:'}</strong>
                          <p>{wp.testingPerformed}</p>
                        </div>
                        <div>
                          <strong className="text-slate-600 dark:text-slate-300 block">{isRTL ? 'الاستنتاج المالي والشرعي:' : 'Assurance Conclusion:'}</strong>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{wp.conclusion}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-2">
                        <div className="flex gap-2">
                          {wp.evidenceAttached.map((ev, i) => (
                            <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono text-[9px] flex items-center gap-1">
                              <Paperclip className="w-2.5 h-2.5" /> {ev}
                            </span>
                          ))}
                        </div>
                        {wp.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveWorkingPaper(wp.id)}
                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-500 font-bold"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>{isRTL ? 'اعتماد ومصادقة شرعية' : 'Sign-Off & Approve'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. SUB-PAGE: EVIDENCE REPOSITORY (Requirement 8 & 9) */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مستودع الوثائق والقرائن للامتثال' : 'Continuous Audit Evidence Repository'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'قائمة القرائن المستخرجة من ERP والتحقق من صحتها آلياً.' : 'Real-time documents and transaction logs collected for continuous audits.'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg font-bold font-mono">
                      100 Total Evidence Items
                    </span>
                  </div>
                </div>

                {/* AI Document Analyzer Interactive Widget (Requirement 9) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/15 space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>{isRTL ? 'مساعد الفحص الذكي للقرائن والأدلة' : 'AI Evidence Analyzer & Missing Document Tracker'}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <select
                        value={selectedEvidenceId}
                        onChange={(e) => setSelectedEvidenceId(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-xs"
                      >
                        {evidences.slice(0, 5).map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.id} - {ev.source} ({ev.category})</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleAnalyzeEvidence}
                      disabled={isAiLoading}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRTL ? 'تحليل المستند آلياً' : 'Scan & Validate'}</span>
                    </button>
                  </div>

                  {evidenceAnalysisResult && (
                    <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 space-y-2 animate-fadeIn text-[11px]">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
                        <strong className="text-slate-800 dark:text-slate-200">Analysis Result: {evidenceAnalysisResult.file}</strong>
                        <span className="font-mono font-black text-rose-500">{evidenceAnalysisResult.riskScore}</span>
                      </div>
                      <p className="text-slate-400">Relevance: {evidenceAnalysisResult.relevance}</p>
                      <div className="text-slate-400 space-y-1">
                        <span className="font-semibold text-rose-600 block mt-1">Potential Compliance Outliers:</span>
                        <p>{evidenceAnalysisResult.potentialIssues}</p>
                      </div>
                      <div className="text-slate-400 space-y-1">
                        <span className="font-semibold text-indigo-600 block mt-1">Missing Supporting Exhibits:</span>
                        <ul className="list-disc pl-4">
                          {evidenceAnalysisResult.missingItems.map((mi: string, i: number) => <li key={i}>{mi}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence List with pagination view */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  {evidences.slice(0, 10).map(ev => (
                    <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-850 flex items-start gap-3">
                      <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg text-slate-500 font-bold text-[10px]">
                        {ev.category.substring(0, 3).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-800 dark:text-slate-200 truncate">{ev.source}</strong>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{ev.id}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] truncate mt-0.5">{ev.description}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span>By: {ev.collectedBy}</span>
                          <span className="font-mono">{ev.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. SUB-PAGE: AUDIT FINDINGS (Requirement 11 & 12) */}
          {activeTab === 'findings' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'ملاحظات وتوصيات الفحص الشرعي والامتثال' : 'Compliance Findings Management'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'إدارة الانحرافات الشرعية المكتشفة وتطبيق منهجية (الحالة، المعيار، السبب، الأثر، التوصية).' : 'Structure findings using classical audit methodology (Condition, Criteria, Cause, Effect, Recommendation).'}</p>
                  </div>
                </div>

                {/* AI Draft Finding Generator Widget (Requirement 12) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/15 space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>{isRTL ? 'مولد مسودات الملاحظات الفوري بالذكاء الاصطناعي' : 'AI Automated Finding & Draft Proposal Generator'}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-semibold">{isRTL ? 'مصدر الفحص المكتشف (من تنبيهات ERP أو القوانين)' : 'Testing Sample / Transaction Alert Context:'}</label>
                    <input
                      type="text"
                      value={draftSourceTest}
                      onChange={(e) => setDraftSourceTest(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateFindingDraft}
                      disabled={isAiLoading}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
                      <span>{isRTL ? 'صياغة مسودة الملاحظة بالذكاء' : 'Draft Finding with AI'}</span>
                    </button>
                  </div>

                  {generatedDraftFinding && (
                    <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-emerald-500/20 space-y-3 animate-fadeIn">
                      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">AI DRAFT GENERATED</span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1">{generatedDraftFinding.title}</h4>
                        </div>
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] font-bold">{generatedDraftFinding.severity}</span>
                      </div>

                      <div className="space-y-2 text-[11px] text-slate-400">
                        <p><strong>Condition (الحالة):</strong> {generatedDraftFinding.condition}</p>
                        <p><strong>Criteria (المعيار):</strong> {generatedDraftFinding.criteria}</p>
                        <p><strong>Cause (السبب):</strong> {generatedDraftFinding.cause}</p>
                        <p><strong>Effect (الأثر المترتب):</strong> {generatedDraftFinding.effect}</p>
                        <p><strong>Recommendation (التوصية):</strong> {generatedDraftFinding.recommendation}</p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleApproveDraftFinding}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'اعتماد المسودة وترقيتها' : 'Promote Draft to Active Finding'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Findings Accordion/Rows */}
                <div className="space-y-3 pt-2 text-xs">
                  {findings.map(find => (
                    <div key={find.id} className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{find.title}</span>
                            <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">{find.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{find.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${getSeverityBadge(find.severity)}`}>
                            {find.severity}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            find.status === 'Open' ? 'bg-red-100 text-red-800' :
                            find.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>{find.status}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-[11px] text-slate-400">
                        <p><strong className="text-slate-600 dark:text-slate-300">Condition (الحالة):</strong> {find.condition}</p>
                        <p><strong className="text-slate-600 dark:text-slate-300">Criteria (المعيار):</strong> {find.criteria}</p>
                        <p><strong className="text-slate-600 dark:text-slate-300">Cause (السبب):</strong> {find.cause}</p>
                        <p><strong className="text-slate-600 dark:text-slate-300">Effect (الأثر):</strong> {find.effect}</p>
                        <p><strong className="text-slate-800 dark:text-slate-200">Recommendation (التوصية):</strong> {find.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 8. SUB-PAGE: CORRECTIVE ACTIONS (Requirement 13) */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'خطة وجدول الإجراءات التصحيحية' : 'Corrective Action Plan Tracker'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'تخصيص ومتابعة وتوثيق تقدم تنفيذ إجراءات معالجة التجاوزات المكتشفة.' : 'Assign task owners, configure deadlines, and upload evidence of completion.'}</p>
                  </div>
                </div>

                {/* AI Improvement Recommendation Engine Widget (Requirement 14) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/15 space-y-4 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span>{isRTL ? 'محرك التوصيات التحسينية الفوري' : 'AI Recommendation Engine & System Control Optimizer'}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {isRTL 
                      ? 'بناء على ثغرات الامتثال النشطة، يستخرج محرك الذكاء الاصطناعي تعديلات الأنظمة وإجراءات تدريب الموظفين المقترحة.'
                      : 'Automatically extract structural recommendations like SOP updates, approval adjustments, or employee training plans.'}
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateRecommendations}
                      disabled={isAiLoading}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sliders className="w-3.5 h-3.5" />}
                      <span>{isRTL ? 'استخراج التوصيات الذكية' : 'Generate Recommendation Profiles'}</span>
                    </button>
                  </div>

                  {recommendationResult && (
                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-emerald-500/15 space-y-2 animate-fadeIn text-[11px] text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200 block mb-1">Optimized Sharia System Controls:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        {recommendationResult.map((rec, i) => <li key={i}>{rec}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Table */}
                <div className="space-y-3 pt-2 text-xs">
                  {correctiveActions.map(act => (
                    <div key={act.id} className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-800 dark:text-slate-200 block text-xs">{act.findingTitle}</strong>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Owner: {act.owner} • Deadline: {act.deadline}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          act.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                          act.status === 'In Progress' ? 'bg-indigo-100 text-indigo-850' : 'bg-slate-100 text-slate-500'
                        }`}>{act.status}</span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-[11px] text-slate-400">
                        <strong className="text-slate-600 dark:text-slate-300 block mb-0.5">{isRTL ? 'الإجراء التصحيحي المطلوب:' : 'Action Required:'}</strong>
                        <p>{act.actionRequired}</p>
                        {act.evidenceOfCompletion && (
                          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <strong className="text-emerald-600 block">{isRTL ? 'إثبات ومستندات الاكتمال:' : 'Completion Evidence Reference:'}</strong>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{act.evidenceOfCompletion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 9. SUB-PAGE: AI AUDIT CHAT ASSISTANT (Requirement 16) */}
          {activeTab === 'assistant' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    {isRTL ? 'مساعد التدقيق والالتزام الفوري (الروبوت Copilot)' : 'ICAP Sharia Audit Copilot'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL
                      ? 'اسأل المساعد الذكي عن الملاحظات الخطرة، أو كيفية معالجة ثغرة، أو تفاصيل عينات فحص العقود.'
                      : 'Ask standard audit operations questions like "Show all high-risk transactions," "Why was this finding generated?" or "What evidence supports this conclusion?"'}
                  </p>
                </div>

                {/* Chat window */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 h-80 flex flex-col justify-between">
                  <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none text-xs pr-1">
                    {aiChatHistory.map((msg, i) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 max-w-[85%] rounded-2xl border ${
                            isUser ? 'bg-emerald-600 border-emerald-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed">{msg.text}</p>
                            <span className="text-[8px] opacity-60 block mt-1.5 text-right font-mono">{msg.timestamp}</span>
                          </div>
                        </div>
                      );
                    })}
                    {isAiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-400">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                          <span>AI is analyzing transactions...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleChatSubmit} className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder={isRTL ? 'اسأل المساعد الشرعي...' : 'Ask Copilot: "Show all high-risk transactions..."'}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs"
                    />
                    <button
                      type="submit"
                      disabled={isAiLoading || !chatInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition flex items-center justify-center shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Preset Prompts Helper */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{isRTL ? 'استعلامات تدقيق جاهزة مقترحة:' : 'Interactive Preset Queries (Requirement 16):'}</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {[
                      { q: 'Show all high-risk transactions.', label: isRTL ? 'عرض المعاملات عالية الخطورة' : 'Show high-risk transactions' },
                      { q: 'Why was this finding generated?', label: isRTL ? 'لماذا تم توليد هذه الملاحظة؟' : 'Why finding was generated' },
                      { q: 'What evidence supports this conclusion?', label: isRTL ? 'ما الدليل الداعم للاستنتاج؟' : 'What evidence supports this' },
                      { q: 'What previous issues existed?', label: isRTL ? 'ما هي المخالفات السابقة المسجلة؟' : 'Show previous issues context' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInput(item.q);
                        }}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium px-3 py-1.5 rounded-xl transition text-[11px]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ====================================================
            RIGHT CONTEXTUAL BAR - AUDIT COMPLIANCE PANEL (Requirement 15 & 19)
            ==================================================== */}
        <div className="space-y-6">
          {/* Big Four Continuous Audit Program Summary */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'ملف التدقيق الشرعي المعمد' : 'Fiduciary Verification Details'}</span>
              <FileCheck className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">{isRTL ? 'ملف التدقيق النشط' : 'Active Audit File'}</span>
                <span className="font-bold block text-slate-850 dark:text-slate-100">Annual Islamic Finance Compliance Audit 2026</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Audit Framework:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">AAOIFI standards v2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Scope Duration:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">1 Year Continuous</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Baseline:</span>
                  <span className="font-bold text-emerald-600 font-mono">Target &gt; 95% Score</span>
                </div>
              </div>

              {/* Connected with Reporting Center widget (Requirement 15) */}
              <div className="p-3 bg-emerald-600/5 rounded-xl border border-emerald-500/15 space-y-2">
                <span className="font-bold text-emerald-600 text-[10px] uppercase block tracking-wider">{isRTL ? 'تصدير فوري للتقارير التنظيمية' : 'Reporting Center Integration'}</span>
                <p className="text-[11px] text-slate-400">
                  {isRTL
                    ? 'التكامل التلقائي مع لوحات تقارير الامتثال الشرعي لتوليد مستندات تدقيق PDF معتمدة ومطابقة لتعليمات هيئة أسواق المال.'
                    : 'Compile active procedures, findings condition descriptions, evidence records, and recommend resolutions into standard regulatory audits.'}
                </p>
                <button
                  onClick={() => {
                    triggerToast(isRTL ? 'تم تصدير تقرير التدقيق الشامل إلى مركز التقارير.' : 'Comprehensive Audit PDF sent to Reporting Center.');
                  }}
                  className="w-full flex items-center justify-center gap-1 bg-emerald-600 text-white font-bold text-[10px] py-1.5 rounded-lg transition hover:bg-emerald-500"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{isRTL ? 'توليد وتصدير ملف التدقيق PDF' : 'Compile & Export Audit Report'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Active Procedures List */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 block">{isRTL ? 'فحص عينات وتدفقات الأنظمة' : 'Continuous ERP Testing Controls'}</span>
            <div className="space-y-2">
              {[
                { name: 'Riba Extraction Audit', rule: 'Isolate ledger payments with markup rates exceeding Sharia thresholds.', status: 'Active Scan' },
                { name: 'Asset Possession Sequence', rule: 'Ensure title registration occurs strictly before customer invoice booking.', status: 'Active Scan' },
                { name: 'Late Penalty Purifications', rule: 'Identify fees booked in generic profit sub-accounts without purification tags.', status: 'Active Scan' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-[11px] text-slate-850 dark:text-slate-200">
                    <span>{item.name}</span>
                    <span className="text-emerald-500 text-[9px] font-mono">{item.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CREATE/EDIT WORKING PAPER (Requirement 7) */}
      {showWpModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                {editingWp ? (isRTL ? 'تعديل ورقة عمل تدقيقية' : 'Edit Digital Working Paper') : (isRTL ? 'إنشاء ورقة عمل تدقيقية جديدة' : 'New Digital Working Paper')}
              </h3>
              <button onClick={() => setShowWpModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkingPaper} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'عنوان ورقة العمل' : 'Working Paper Title'}</label>
                <input
                  type="text"
                  required
                  value={wpTitle}
                  onChange={(e) => setWpTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'منطقة التدقيق الشرعي' : 'Audit Area'}</label>
                <input
                  type="text"
                  required
                  value={wpArea}
                  onChange={(e) => setWpArea(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'الاختبار والفحص الذي تم تنفيذه' : 'Testing Performed'}</label>
                <textarea
                  required
                  rows={3}
                  value={wpTesting}
                  onChange={(e) => setWpTesting(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'الاستنتاج المالي والتنظيمي' : 'Assurance Conclusion'}</label>
                <textarea
                  required
                  rows={2}
                  value={wpConclusion}
                  onChange={(e) => setWpConclusion(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWpModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition font-bold"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition font-bold"
                >
                  {isRTL ? 'حفظ ورقة العمل' : 'Save Working Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW AUDIT ENGAGEMENT (Requirement 3) */}
      {showEngagementForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                {isRTL ? 'بدء مهمة تدقيق معمدة جديدة' : 'Initiate New Audit Engagement'}
              </h3>
              <button onClick={() => setShowEngagementForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'اسم مهمة التدقيق' : 'Audit Engagement Name'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Islamic Finance Audit 2026"
                  value={newAuditName}
                  onChange={(e) => setNewAuditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'نوع الفحص والتدقيق' : 'Audit Type'}</label>
                <select
                  value={newAuditType}
                  onChange={(e) => setNewAuditType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                >
                  <option value="Sharia Audit">Sharia Audit</option>
                  <option value="Internal Compliance Audit">Internal Compliance Audit</option>
                  <option value="Financial Audit">Financial Audit</option>
                  <option value="Operational Audit">Operational Audit</option>
                  <option value="ERP Transaction Audit">ERP Transaction Audit</option>
                  <option value="Policy Compliance Audit">Policy Compliance Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'تاريخ البدء' : 'Start Date'}</label>
                  <input
                    type="date"
                    value={newAuditStart}
                    onChange={(e) => setNewAuditStart(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</label>
                  <input
                    type="date"
                    value={newAuditEnd}
                    onChange={(e) => setNewAuditEnd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400 uppercase text-[9px]">{isRTL ? 'الأقسام المستهدفة بالنطاق (مفصولة بفاصلة)' : 'Target Scope Departments (comma separated)'}</label>
                <input
                  type="text"
                  placeholder="e.g. Finance, Retail Treasury"
                  value={newAuditDeps}
                  onChange={(e) => setNewAuditDeps(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEngagementForm(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition font-bold"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition font-bold"
                >
                  {isRTL ? 'بدء المهمة' : 'Launch Engagement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
