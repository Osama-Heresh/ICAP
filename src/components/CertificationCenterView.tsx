import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Shield,
  Zap,
  Layers,
  Sparkles,
  ExternalLink,
  QrCode,
  Sliders,
  Users,
  Send,
  Calendar,
  Lock,
  ChevronRight,
  Bookmark,
  TrendingUp,
  FileCheck,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Check,
  Trash2,
  FilePlus,
  Compass,
  Printer,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CertificationCenterViewProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

// ----------------------------------------------------
// DATABASE STRUCT TYPES (Requirement 16)
// ----------------------------------------------------
interface CertificationRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  type: 'Sharia Compliance Certificate' | 'Crypto Compliance Certificate' | 'FinTech Compliance Certificate' | 'Enterprise Compliance Certificate' | 'Internal Compliance Certificate';
  scope: 'Full Organization' | 'Specific Product' | 'Specific Service' | 'Specific Department';
  scopeDetails: string;
  period: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'AI Analysis' | 'Human Review' | 'Approved' | 'Rejected' | 'Issued' | 'Expired';
  reviewer?: string;
  reviewerRole?: string;
  assignedDate?: string;
  deadline?: string;
  reviewerStatus?: string;
  createdAt: string;
  documentsCount: number;
}

interface Certificate {
  certificateId: string;
  organizationId: string;
  organizationName: string;
  type: string;
  framework: string;
  level: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Suspended' | 'Expired' | 'Revoked';
  verificationUrl: string;
  approvedBy: string;
  suspensionReason?: string;
  qrScannedCount: number;
  score: number;
}

interface CertificateTemplate {
  id: string;
  name: string;
  type: string;
  design: 'Modern' | 'Traditional Islamic' | 'Enterprise';
  logoEnabled: boolean;
  validityPeriod: string;
  description: string;
  approvalInfo: string;
  signatureAreaName: string;
}

interface CertificateReview {
  id: string;
  certificateId: string;
  reviewer: string;
  decision: 'Approved' | 'Rejected' | 'Needs Modification';
  comments: string;
  date: string;
  evidenceReviewed: string[];
}

interface CertificateRenewal {
  id: string;
  certificateId: string;
  requestDate: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  newExpiryDate: string;
}

interface CertificateHistory {
  id: string;
  certificateId: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

// ----------------------------------------------------
// PREMIUM DEMO DATA SEEDING (Requirement 17)
// ----------------------------------------------------
const INITIAL_REQUESTS: CertificationRequest[] = [
  {
    id: 'REQ-CERT-201',
    organizationId: 'org-al-noor',
    organizationName: 'Al Noor Islamic Finance Group',
    type: 'Sharia Compliance Certificate',
    scope: 'Full Organization',
    scopeDetails: 'Global Operations & Subsidiaries',
    period: '2026-2027 (Annual Audit)',
    status: 'AI Analysis',
    reviewer: 'Sheikh Zain Al-Abedin',
    reviewerRole: 'Sharia Reviewer',
    assignedDate: '2026-07-15',
    deadline: '2026-07-25',
    reviewerStatus: 'Analyzing Evidence',
    createdAt: '2026-07-15 09:00',
    documentsCount: 4
  },
  {
    id: 'REQ-CERT-202',
    organizationId: 'org-hilal-crypto',
    organizationName: 'Hilal DeFi Liquid Assets Pool',
    type: 'Crypto Compliance Certificate',
    scope: 'Specific Product',
    scopeDetails: 'ETH Murabaha Smart Yield Vaults',
    period: 'H2 2026 Season',
    status: 'Human Review',
    reviewer: 'Adil Mansoor, CFA',
    reviewerRole: 'Auditor',
    assignedDate: '2026-07-10',
    deadline: '2026-07-20',
    reviewerStatus: 'Drafting Final Clauses',
    createdAt: '2026-07-09 11:30',
    documentsCount: 6
  },
  {
    id: 'REQ-CERT-203',
    organizationId: 'org-rawabi-fintech',
    organizationName: 'Rawabi Micro-Invest Payments',
    type: 'FinTech Compliance Certificate',
    scope: 'Specific Service',
    scopeDetails: 'Buy-Now-Pay-Later (BNPL) Murabaha Engine',
    period: 'Q3-Q4 2026 Range',
    status: 'Under Review',
    reviewer: 'Sarah Al-Ghamdi',
    reviewerRole: 'Compliance Officer',
    assignedDate: '2026-07-16',
    deadline: '2026-07-30',
    reviewerStatus: 'Document Verifications',
    createdAt: '2026-07-16 14:22',
    documentsCount: 3
  }
];

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    certificateId: 'ICAP-SC-2026-000001',
    organizationId: 'org-al-noor',
    organizationName: 'Al Noor Islamic Finance Group',
    type: 'Sharia Compliance Certificate',
    framework: 'AAOIFI Sharia Standards No. 8, 12 & 21',
    level: 'Level 4: Continuous Monitoring Certified',
    issueDate: '2026-01-10',
    expiryDate: '2027-01-09',
    status: 'Active',
    verificationUrl: 'https://icap.ai/verify/ICAP-SC-2026-000001',
    approvedBy: 'Sharia Advisory Board & Senior Council',
    qrScannedCount: 142,
    score: 98
  },
  {
    certificateId: 'ICAP-CC-2026-000015',
    organizationId: 'org-hilal-crypto',
    organizationName: 'Hilal DeFi Liquid Assets Pool',
    type: 'Crypto Compliance Certificate',
    framework: 'ICAP Crypto Sharia Framework v2.1',
    level: 'Level 3: Advanced Certified Compliance',
    issueDate: '2026-03-15',
    expiryDate: '2026-09-14',
    status: 'Active',
    verificationUrl: 'https://icap.ai/verify/ICAP-CC-2026-000015',
    approvedBy: 'AI Smart Contract Audit Agent & External Board',
    qrScannedCount: 89,
    score: 95
  },
  {
    certificateId: 'ICAP-FT-2026-000032',
    organizationId: 'org-rawabi-fintech',
    organizationName: 'Rawabi Micro-Invest Payments',
    type: 'FinTech Compliance Certificate',
    framework: 'SAMA/DFSA Sharia FinTech Directive',
    level: 'Level 2: Verified Compliance',
    issueDate: '2025-08-20',
    expiryDate: '2026-08-19',
    status: 'Active',
    verificationUrl: 'https://icap.ai/verify/ICAP-FT-2026-000032',
    approvedBy: 'Regional Compliance Lead Team',
    qrScannedCount: 204,
    score: 92
  },
  {
    certificateId: 'ICAP-EC-2026-000041',
    organizationId: 'org-andalus-holdings',
    organizationName: 'Andalus Real Estate Trust',
    type: 'Enterprise Compliance Certificate',
    framework: 'Corporate Ethical Sharia Governance v1.0',
    level: 'Level 1: Basic Review',
    issueDate: '2025-04-12',
    expiryDate: '2026-04-11',
    status: 'Expired',
    verificationUrl: 'https://icap.ai/verify/ICAP-EC-2026-000041',
    approvedBy: 'Board of Ethics Committee',
    qrScannedCount: 31,
    score: 89
  }
];

const INITIAL_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'TMP-CERT-01',
    name: 'Official Traditional Islamic Certificate Layout',
    type: 'Sharia Compliance Certificate',
    design: 'Traditional Islamic',
    logoEnabled: true,
    validityPeriod: '1 Year (Renewable)',
    description: 'This is to certify that all investment books, treasury placements and active contracts of the organization have been verified through continuous semantic analysis and adhere to established AAOIFI standards.',
    approvalInfo: 'Certified by the ICAP Advisory Council and Regional Sharia Scholars.',
    signatureAreaName: 'Sheikh Zain Al-Abedin, Chief Sharia Officer'
  },
  {
    id: 'TMP-CERT-02',
    name: 'Modern Corporate FinTech Certificate Layout',
    type: 'FinTech Compliance Certificate',
    design: 'Modern',
    logoEnabled: true,
    validityPeriod: '6 Months (Automated Audit)',
    description: 'A certificate confirming that the smart contracts, automated escrow mechanics, and ledger routing policies have passed strict non-interest (Riba) compliance scans and ethical asset standards.',
    approvalInfo: 'Automated AI Compliance Engine & External Board Verification.',
    signatureAreaName: 'Audit Lead of ICAP Engineering'
  }
];

const INITIAL_REVIEWS: CertificateReview[] = [
  {
    id: 'REV-901',
    certificateId: 'ICAP-SC-2026-000001',
    reviewer: 'Sheikh Zain Al-Abedin',
    decision: 'Approved',
    comments: 'Reviewed Murabaha transaction structures. Excellent compliance and zero interest contamination in active accounts.',
    date: '2026-01-10',
    evidenceReviewed: ['Odoo Ledger Stream', 'Charity Account Purification Proof', 'Corporate Lending SOP v2']
  }
];

const INITIAL_RENEWALS: CertificateRenewal[] = [
  {
    id: 'REN-801',
    certificateId: 'ICAP-FT-2026-000032',
    requestDate: '2026-07-10',
    status: 'Pending Review',
    newExpiryDate: '2027-08-19'
  }
];

const INITIAL_HISTORY: CertificateHistory[] = [
  {
    id: 'HIST-001',
    certificateId: 'ICAP-SC-2026-000001',
    action: 'Certificate Issued',
    user: 'Sharia Admin Agent',
    timestamp: '2026-01-10 11:20',
    details: 'Initial certified token minted following successful compliance score of 98%.'
  },
  {
    id: 'HIST-002',
    certificateId: 'ICAP-FT-2026-000032',
    action: 'Renewal Requested',
    user: 'Rawabi Admin Office',
    timestamp: '2026-07-10 09:15',
    details: 'Annual renewal protocol triggered due to upcoming expiry on 2026-08-19.'
  }
];

export default function CertificationCenterView({
  locale,
  theme,
  onTriggerActivityLog
}: CertificationCenterViewProps) {
  const isRTL = locale === 'ar';

  // Sub tab navigation (Requirement 1)
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'requests' | 'workflow' | 'templates' | 'issued' | 'renewals' | 'public' | 'history'>('dashboard');

  // Interactive local states simulating DB tables (Requirement 16 & 17)
  const [requests, setRequests] = useState<CertificationRequest[]>(INITIAL_REQUESTS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [templates, setTemplates] = useState<CertificateTemplate[]>(INITIAL_TEMPLATES);
  const [reviews, setReviews] = useState<CertificateReview[]>(INITIAL_REVIEWS);
  const [renewals, setRenewals] = useState<CertificateRenewal[]>(INITIAL_RENEWALS);
  const [history, setHistory] = useState<CertificateHistory[]>(INITIAL_HISTORY);

  // Active / Selected item states
  const [selectedCertificateId, setSelectedCertificateId] = useState<string>('ICAP-SC-2026-000001');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('REQ-CERT-201');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('TMP-CERT-01');

  // Modals / Overlays
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [showReviewActionModal, setShowReviewActionModal] = useState<boolean>(false);
  const [showAssignReviewerModal, setShowAssignReviewerModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPublicModal, setShowPublicModal] = useState<boolean>(false);

  // New Request Form Fields (Requirement 3)
  const [newReqOrgName, setNewReqOrgName] = useState<string>('Al Noor Islamic Finance Group');
  const [newReqType, setNewReqType] = useState<CertificationRequest['type']>('Sharia Compliance Certificate');
  const [newReqScope, setNewReqScope] = useState<CertificationRequest['scope']>('Full Organization');
  const [newReqScopeDetails, setNewReqScopeDetails] = useState<string>('Corporate Treasury Branch');
  const [newReqPeriod, setNewReqPeriod] = useState<string>('FY 2026-2027 (Renewable)');
  const [newReqDocAttached, setNewReqDocAttached] = useState<boolean>(true);

  // Human Review & Sharia Decision inputs (Requirement 5 & 6)
  const [reviewDecision, setReviewDecision] = useState<'Approved' | 'Rejected' | 'Needs Modification'>('Approved');
  const [reviewComments, setReviewComments] = useState<string>('');
  const [reviewerNameInput, setReviewerNameInput] = useState<string>('Sheikh Zain Al-Abedin');
  const [reviewEvidence, setReviewEvidence] = useState<string>('Financial purification statements & ledger hashes');

  // Reviewer Assignment inputs (Requirement 5)
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [assigneeRole, setAssigneeRole] = useState<'Compliance Officer' | 'Auditor' | 'Sharia Reviewer' | 'External Reviewer'>('Sharia Reviewer');
  const [assigneeDeadline, setAssigneeDeadline] = useState<string>('2026-07-28');

  // Certificate Template Builder inputs (Requirement 7)
  const [tplName, setTplName] = useState<string>('Universal Ethic Certificate');
  const [tplType, setTplType] = useState<string>('Sharia Compliance Certificate');
  const [tplDesign, setTplDesign] = useState<'Modern' | 'Traditional Islamic' | 'Enterprise'>('Traditional Islamic');
  const [tplDescription, setTplDescription] = useState<string>('This verifies that the underlying digital assets, smart pools, and transaction logs meet rigorous ethical compliance standards.');
  const [tplSigner, setTplSigner] = useState<string>('Advisory Council Executive');
  const [tplValidity, setTplValidity] = useState<string>('1 Year (Renewable)');

  // Public Verification Portal inputs (Requirement 11)
  const [publicSearchQuery, setPublicSearchQuery] = useState<string>('');
  const [searchedCertificate, setSearchedCertificate] = useState<Certificate | null>(null);

  // Suspension state (Requirement 14)
  const [suspensionReasonInput, setSuspensionReasonInput] = useState<string>('Compliance Failure');
  const [showSuspensionModal, setShowSuspensionModal] = useState<boolean>(false);

  // Notification Toast Helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedCert = certificates.find(c => c.certificateId === selectedCertificateId) || certificates[0];
  const selectedReq = requests.find(r => r.id === selectedRequestId) || requests[0];
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // ----------------------------------------------------
  // SUBMIT REQUEST HANDLER (Requirement 3)
  // ----------------------------------------------------
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: CertificationRequest = {
      id: `REQ-CERT-${Math.floor(204 + Math.random() * 500)}`,
      organizationId: 'org-user',
      organizationName: newReqOrgName,
      type: newReqType,
      scope: newReqScope,
      scopeDetails: newReqScopeDetails,
      period: newReqPeriod,
      status: 'Submitted',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      documentsCount: newReqDocAttached ? 3 : 0
    };

    setRequests([newReq, ...requests]);
    setSelectedRequestId(newReq.id);
    setShowRequestForm(false);
    showToast(isRTL ? 'تم تقديم طلب الشهادة وبدء خط التدقيق الفوري!' : 'Certification request submitted and verification queue started!');
    onTriggerActivityLog('SUBMIT_CERTIFICATION_REQUEST', `Request submitted for ${newReq.type}`);

    // Add to history
    const hist: CertificateHistory = {
      id: `HIST-${Math.random().toString().slice(-4)}`,
      certificateId: 'N/A',
      action: 'Request Submitted',
      user: 'Customer Admin',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details: `New request filed for ${newReq.type}. Scope: ${newReq.scope}.`
    };
    setHistory([hist, ...history]);
  };

  // ----------------------------------------------------
  // ASSIGN REVIEWER HANDLER (Requirement 5)
  // ----------------------------------------------------
  const handleAssignReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigneeName) return;

    setRequests(prev => prev.map(r => {
      if (r.id === selectedRequestId) {
        return {
          ...r,
          reviewer: assigneeName,
          reviewerRole: assigneeRole,
          assignedDate: new Date().toISOString().slice(0, 10),
          deadline: assigneeDeadline,
          reviewerStatus: 'Review Assigned',
          status: 'Under Review'
        };
      }
      return r;
    }));

    showToast(isRTL ? `تم تعيين المراجع ${assigneeName} بنجاح!` : `Reviewer ${assigneeName} assigned successfully!`);
    onTriggerActivityLog('ASSIGN_REVIEWER', `Assigned ${assigneeName} as ${assigneeRole} to ${selectedRequestId}`);
    setShowAssignReviewerModal(false);
  };

  // ----------------------------------------------------
  // SHARIA/HUMAN APPROVAL WORKFLOW (Requirement 6)
  // ----------------------------------------------------
  const handleReviewDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerNameInput) return;

    // 1. Save review decision in reviews list
    const newReview: CertificateReview = {
      id: `REV-${Math.floor(902 + Math.random() * 500)}`,
      certificateId: selectedReq.id,
      reviewer: reviewerNameInput,
      decision: reviewDecision,
      comments: reviewComments,
      date: new Date().toISOString().slice(0, 10),
      evidenceReviewed: reviewEvidence.split(',').map(e => e.trim())
    };
    setReviews([newReview, ...reviews]);

    // 2. Update status of the certification request
    setRequests(prev => prev.map(r => {
      if (r.id === selectedRequestId) {
        return {
          ...r,
          status: reviewDecision === 'Approved' ? 'Approved' : reviewDecision === 'Rejected' ? 'Rejected' : 'Under Review',
          reviewerStatus: `Decision: ${reviewDecision}`
        };
      }
      return r;
    }));

    // 3. If Approved, auto-generate the Certificate (Requirement 8)
    if (reviewDecision === 'Approved') {
      const generatedId = `ICAP-SC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newCert: Certificate = {
        certificateId: generatedId,
        organizationId: selectedReq.organizationId,
        organizationName: selectedReq.organizationName,
        type: selectedReq.type,
        framework: selectedReq.type === 'Sharia Compliance Certificate' ? 'AAOIFI Sharia Standards No. 8, 12 & 21' : 'ICAP Ethical FinTech Frame v2.0',
        level: 'Level 3: Advanced Certified Compliance',
        issueDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
        status: 'Active',
        verificationUrl: `https://icap.ai/verify/${generatedId}`,
        approvedBy: reviewerNameInput,
        qrScannedCount: 0,
        score: selectedReq.type === 'Sharia Compliance Certificate' ? 97 : 94
      };

      setCertificates([newCert, ...certificates]);
      setSelectedCertificateId(newCert.certificateId);

      // Add timeline entry
      const hist: CertificateHistory = {
        id: `HIST-${Math.random().toString().slice(-4)}`,
        certificateId: generatedId,
        action: 'Certificate Issued',
        user: reviewerNameInput,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        details: `Certificate generated following approval by ${reviewerNameInput}. Status: Active.`
      };
      setHistory([hist, ...history]);

      showToast(isRTL ? `تم اعتماد الطلب وإصدار الشهادة الرقمية رقم: ${generatedId}` : `Request approved! Digital Certificate ${generatedId} successfully issued.`);
      onTriggerActivityLog('APPROVE_AND_ISSUE_CERTIFICATE', `Issued ${generatedId} for ${selectedReq.organizationName}`);
    } else {
      showToast(isRTL ? 'تم حفظ قرار المراجعة والتعليقات بنجاح!' : 'Review decision and recommendations saved!');
      onTriggerActivityLog('SAVE_REVIEW_DECISION', `Saved review decision: ${reviewDecision} for request ${selectedReq.id}`);
    }

    setShowReviewActionModal(false);
    setReviewComments('');
  };

  // ----------------------------------------------------
  // TEMPLATE BUILDER (Requirement 7)
  // ----------------------------------------------------
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName) return;

    const newTpl: CertificateTemplate = {
      id: `TMP-CERT-${Math.floor(103 + Math.random() * 500)}`,
      name: tplName,
      type: tplType,
      design: tplDesign,
      logoEnabled: true,
      validityPeriod: tplValidity,
      description: tplDescription,
      approvalInfo: `Certified and signed off by ${tplSigner}`,
      signatureAreaName: tplSigner
    };

    setTemplates([newTpl, ...templates]);
    setSelectedTemplateId(newTpl.id);
    showToast(isRTL ? 'تم حفظ وحفظ قالب الشهادة بنجاح!' : 'Certificate layout template created and saved!');
    onTriggerActivityLog('CREATE_CERT_TEMPLATE', `Saved template: ${newTpl.name}`);
  };

  // ----------------------------------------------------
  // SUSPEND / REACTIVATE / REVOKE (Requirement 14)
  // ----------------------------------------------------
  const handleUpdateCertStatus = (id: string, newStatus: Certificate['status']) => {
    setCertificates(prev => prev.map(c => {
      if (c.certificateId === id) {
        return {
          ...c,
          status: newStatus,
          suspensionReason: newStatus === 'Suspended' ? suspensionReasonInput : undefined
        };
      }
      return c;
    }));

    // Add History Event
    const hist: CertificateHistory = {
      id: `HIST-${Math.random().toString().slice(-4)}`,
      certificateId: id,
      action: `Status Changed to ${newStatus}`,
      user: 'Compliance Director',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details: `${newStatus === 'Suspended' ? `Suspension reason: ${suspensionReasonInput}` : `Status manually modified to ${newStatus}`}`
    };
    setHistory([hist, ...history]);

    showToast(isRTL ? `تم تحديث حالة الشهادة إلى ${newStatus}` : `Certificate status changed to ${newStatus}`);
    onTriggerActivityLog('UPDATE_CERT_STATUS', `Updated ${id} status to ${newStatus}`);
    setShowSuspensionModal(false);
  };

  // ----------------------------------------------------
  // PUBLIC VERIFICATION (Requirement 10 & 11)
  // ----------------------------------------------------
  const handlePublicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicSearchQuery) return;

    const found = certificates.find(
      c => c.certificateId.toLowerCase().includes(publicSearchQuery.toLowerCase()) ||
           c.organizationName.toLowerCase().includes(publicSearchQuery.toLowerCase())
    );

    if (found) {
      setSearchedCertificate(found);
      showToast(isRTL ? 'تم العثور على الشهادة الرقمية بنجاح!' : 'Authentic Digital Certificate found!');
    } else {
      setSearchedCertificate(null);
      showToast(isRTL ? 'لم يتم العثور على أي شهادة متوافقة' : 'No certificate matched search credentials.');
    }
  };

  // ----------------------------------------------------
  // RENEWAL WORKFLOW TRIGGER (Requirement 12)
  // ----------------------------------------------------
  const handleRenewCertificate = (certId: string) => {
    // Add renewal record
    const newRen: CertificateRenewal = {
      id: `REN-${Math.floor(802 + Math.random() * 500)}`,
      certificateId: certId,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending Review',
      newExpiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10)
    };
    setRenewals([newRen, ...renewals]);

    // Update Request workflow
    const targetCert = certificates.find(c => c.certificateId === certId);
    if (targetCert) {
      const newReq: CertificationRequest = {
        id: `REQ-CERT-REN-${Math.floor(500 + Math.random() * 500)}`,
        organizationId: targetCert.organizationId,
        organizationName: targetCert.organizationName,
        type: targetCert.type as any,
        scope: 'Full Organization',
        scopeDetails: 'Asset and contract portfolio annual renewal cycle',
        period: `${new Date().getFullYear() + 1} Period`,
        status: 'Submitted',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        documentsCount: 2
      };
      setRequests([newReq, ...requests]);
    }

    showToast(isRTL ? 'تم تقديم طلب التجديد وبدء عملية التدقيق والتحليل الفوري!' : 'Renewal process initiated and compliance audit task re-opened.');
    onTriggerActivityLog('TRIGGER_CERTIFICATE_RENEWAL', `Initiated renewal for ${certId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation (Requirement 1) */}
      <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600/10 p-3 rounded-xl">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {isRTL ? 'مركز إصدار وتوثيق الشهادات الرقمية' : 'Digital Certification Platform'}
                <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-sans border border-emerald-500/20">
                  {isRTL ? 'إثبات معتمد' : 'Verifiable Trust'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL 
                  ? 'إدارة متكاملة لخطوات ترخيص ومطابقة المحافظ المالية والصكوك والعقود الاستثمارية مع إمكانية التحقق العام الفوري.'
                  : 'Manage Sharia and FinTech certification processes, issue secure QR-verifiable certificates, and track compliance lifecycles.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestForm(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRTL ? 'طلب شهادة امتثال جديدة' : 'Request New Certification'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs list (Requirement 1) */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {[
            { id: 'dashboard', name: isRTL ? 'لوحة المراقبة والتحليلات' : 'Dashboard & Analytics', icon: Layers },
            { id: 'requests', name: isRTL ? 'طلبات المطابقة والاعتماد' : 'Certification Requests', icon: FileText },
            { id: 'workflow', name: isRTL ? 'مسار العمل والاعتمادات' : 'Reviewer & Approvals', icon: Sliders },
            { id: 'templates', name: isRTL ? 'قوالب ومصمم الشهادات' : 'Certificate Builder', icon: FileCheck },
            { id: 'issued', name: isRTL ? 'الشهادات الرقمية النشطة' : 'Issued Certificates', icon: Award },
            { id: 'renewals', name: isRTL ? 'مراقبة وإدارة التجديد' : 'Renewal Management', icon: RefreshCw },
            { id: 'public', name: isRTL ? 'بوابة التحقق العام' : 'Public Verification Portal', icon: QrCode },
            { id: 'history', name: isRTL ? 'سجل العمليات والتدقيق' : 'Compliance History', icon: Clock }
          ].map(tab => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
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

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 max-w-xl text-xs font-mono">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Grid split into Main Content & Right contextual Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ====================================================
            LEFT & MAIN SECTIONS FOR ALL MODULE SUB-PAGES
            ==================================================== */}
        <div className="xl:col-span-2 space-y-6">

          {/* 1. SUB-PAGE: DASHBOARD & ANALYTICS (Requirement 2 & 15) */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards (Requirement 2) */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { title: isRTL ? 'الشهادات النشطة' : 'Active Certificates', val: '25', desc: 'Secure blockchain tokens', color: 'text-emerald-600 border-emerald-500/20' },
                  { title: isRTL ? 'المراجعات المعلقة' : 'Pending Reviews', val: '8', desc: 'Awaiting human review', color: 'text-amber-600 border-amber-500/20' },
                  { title: isRTL ? 'أوشكت على الانتهاء' : 'Expiring Soon', val: '5', desc: 'Need renewal checks', color: 'text-rose-600 border-rose-500/20' },
                  { title: isRTL ? 'الصادرة هذا العام' : 'Issued This Year', val: '40', desc: 'Full compliance issued', color: 'text-indigo-600 border-indigo-500/20' },
                  { title: isRTL ? 'معدل درجة الامتثال' : 'Average Compliance', val: '96%', desc: 'Across active portfolio', color: 'text-cyan-600 border-cyan-500/20' }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm text-xs`}>
                    <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block">{stat.title}</span>
                    <span className={`text-2xl font-display font-black block mt-2 ${stat.color}`}>{stat.val}</span>
                    <span className="text-[9px] text-slate-400 block mt-1">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Interactive Charts Container (Requirement 2 & 15) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">{isRTL ? 'مستويات الامتثال وتوزيع الموثوقية' : 'Compliance Level Distribution & Expiry Trailing'}</h3>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress bars representing levels (Requirement 9) */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{isRTL ? 'توزيع رتب ومستويات الامتثال المعتمدة' : 'Verified Compliance Levels (Requirement 9)'}</span>
                    <div className="space-y-3 text-xs">
                      {[
                        { lvl: 'Level 4: Continuous Monitoring Certified', req: 'Continuous audit scan + above 95%', pct: 45, color: 'bg-emerald-600' },
                        { lvl: 'Level 3: Advanced Certified Compliance', req: 'AI Analysis + Scholar sign-off + above 90%', pct: 30, color: 'bg-indigo-600' },
                        { lvl: 'Level 2: Verified Compliance', req: 'Manual audit verification + above 85%', pct: 15, color: 'bg-amber-600' },
                        { lvl: 'Level 1: Basic Compliance Review', req: 'Initial document check + above 80%', pct: 10, color: 'bg-slate-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <span>{item.lvl}</span>
                            <span>{item.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                          </div>
                          <span className="text-[9px] text-slate-400 block">{item.req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational indicators timeline */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{isRTL ? 'إحصائيات تجديد التراخيص والشهادات' : 'Compliance Renewal Rate & Expiry Metrics'}</span>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-4 border border-slate-150 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'معدل تجديد الشهادات الفعلي' : 'Successful Renewal Rate'}</span>
                        <span className="font-bold font-mono text-emerald-600">92.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'متوسط فترة المعالجة' : 'Average Processing Time'}</span>
                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">3.2 Days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">{isRTL ? 'التحققات العامة من الـ QR' : 'Total Public QR Scans'}</span>
                        <span className="font-bold font-mono text-indigo-600">4,120 Scans</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                        {isRTL 
                          ? 'تحديث آلي لشهادات العملاء بناءً على تحليلات ذكاء المعاملات الفورية لـ ERP.'
                          : 'Automated monitoring loops recalculate score thresholds directly from SAP and Odoo activity streams.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Organizations Highlight with level icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.slice(0, 2).map((cert, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-600/10 p-2 rounded-lg">
                          <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cert.organizationName}</h4>
                          <span className="text-[10px] text-slate-400">{cert.type}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">{cert.level.split(':')[0]}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span>{isRTL ? 'تاريخ الانتهاء:' : 'Expires:'} <strong className="text-slate-700 dark:text-slate-300">{cert.expiryDate}</strong></span>
                      <span>Score: <strong className="text-emerald-600 font-mono">{cert.score}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SUB-PAGE: CERTIFICATION REQUESTS (Requirement 3) */}
          {activeSubTab === 'requests' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'طلبات ترخيص ومطابقة الامتثال الجارية' : 'Active Compliance Certification Pipeline'}</h3>
                    <p className="text-xs text-slate-400">{isRTL ? 'قائمة بطلبات إصدار شهادات الالتزام المقدمة من الجهات ومتابعة تقدم مسار الفحص والتدقيق.' : 'List of pending requests submitted for Sharia, FinTech and enterprise standards.'}</p>
                  </div>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'تقديم طلب جديد' : 'New Request'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {requests.map(req => (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequestId(req.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedRequestId === req.id
                          ? 'border-emerald-500 bg-emerald-600/5 dark:bg-emerald-500/5'
                          : 'border-slate-150 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{req.organizationName}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">{req.id}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1">{req.type}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'AI Analysis' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                          req.status === 'Human Review' ? 'bg-amber-100 text-amber-800' :
                          req.status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{req.status}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                        <div>
                          <span>{isRTL ? 'النطاق المستهدف:' : 'Scope Focus:'}</span>
                          <strong className="block text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{req.scope}</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'تفاصيل النطاق:' : 'Scope Focus Details:'}</span>
                          <strong className="block text-slate-700 dark:text-slate-300 font-semibold mt-0.5 truncate max-w-[150px]">{req.scopeDetails}</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'فترة التغطية:' : 'Review Cycle Period:'}</span>
                          <strong className="block text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{req.period}</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'المستندات المرفقة:' : 'Attached Evidence Documents:'}</span>
                          <strong className="block text-emerald-600 font-bold mt-0.5">{req.documentsCount} Files Attached</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SUB-PAGE: CERTIFICATION WORKFLOW (Requirement 4, 5, 6) */}
          {activeSubTab === 'workflow' && (
            <div className="space-y-6">
              {/* Detailed Workflow Pipeline View (Requirement 4) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مسار وإجراءات تدقيق شهادة الامتثال الرقمية' : 'End-to-End Compliance Verification Workflow Pipeline'}</h3>
                <p className="text-xs text-slate-400">
                  {isRTL 
                    ? 'خطوات مسار العمل الشامل للتدقيق الفوري وإصدار الشهادات المعتمدة من الهيئة الاستشارية الشرعية والامتثال.'
                    : 'The multi-stage pipeline traces the validation from initial configuration checks up to digital sign-off and public mint.'}
                </p>

                {/* Vertical Timeline Steps showing current status progress */}
                <div className="space-y-3 pt-3">
                  {[
                    { title: '1. Certification Request Submitted', status: 'Completed', date: '2026-07-15 09:00', desc: 'Customer completed standard organization layout submission & metadata.' },
                    { title: '2. Configuration Review & Policy Check', status: 'Completed', date: '2026-07-15 10:15', desc: 'ICAP verified correct alignment with general corporate governance.' },
                    { title: '3. Legal Contract Document Verification', status: 'Completed', date: '2026-07-15 11:30', desc: 'Verified 4 active contracts and PDF documents against standard templates.' },
                    { title: '4. AI Compliance Analysis Scan', status: selectedReq.status === 'AI Analysis' ? 'Active' : 'Completed', date: '2026-07-15 14:00', desc: 'Semantic scanner mapped double entries, penal codes, and investment contracts.' },
                    { title: '5. Risk & Non-Compliance Exposure Assessment', status: (selectedReq.status === 'Submitted' || selectedReq.status === 'Under Review') ? 'Pending' : (selectedReq.status === 'AI Analysis') ? 'Pending' : 'Completed', date: '2026-07-15 16:30', desc: 'Automated valuation of potential exposures and credit leakage vectors.' },
                    { title: '6. Human Expert Committee Review', status: (selectedReq.status === 'Human Review' || selectedReq.status === 'Approved' || selectedReq.status === 'Issued') ? 'Completed' : 'Pending', date: '2026-07-16 10:00', desc: 'Internal compliance officers evaluate exception items manually.' },
                    { title: '7. Sharia Board Council Approval', status: (selectedReq.status === 'Approved' || selectedReq.status === 'Issued') ? 'Completed' : 'Pending', date: '2026-07-16 15:30', desc: 'Specialized board signs off on asset purifications and issues digital certificates.' }
                  ].map((step, idx) => {
                    const isActive = step.status === 'Active';
                    const isCompleted = step.status === 'Completed';

                    return (
                      <div key={idx} className="flex gap-4 items-start text-xs">
                        <div className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold ${
                            isCompleted ? 'bg-emerald-600 border-emerald-500 text-white' :
                            isActive ? 'bg-indigo-600 border-indigo-500 text-white animate-pulse' :
                            'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400'
                          }`}>
                            {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                          </div>
                          {idx < 6 && <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-800 my-1"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`font-bold ${isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>{step.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive reviewer panel */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 space-y-4 pt-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{isRTL ? 'إجراءات ومراجعي المعاملة الحالية' : 'Active Review Assignments & Sharia Board Decision Pool'}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">{selectedReq.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400 text-[10px] uppercase">Assigned Auditor</span>
                        <button
                          onClick={() => setShowAssignReviewerModal(true)}
                          className="text-emerald-600 hover:text-emerald-500 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Users className="w-3 h-3" /> {isRTL ? 'تعديل التعيين' : 'Modify Assignee'}
                        </button>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold block text-slate-800 dark:text-slate-100">{selectedReq.reviewer || 'No Reviewer Assigned'}</span>
                        <span className="text-[11px] text-slate-400 block">{selectedReq.reviewerRole || 'Sharia Advisory & Compliance'}</span>
                        <span className="text-[10px] text-slate-400 block">{isRTL ? 'المهلة النهائية:' : 'Deadline Limit:'} <strong className="text-rose-600 font-mono">{selectedReq.deadline || '2026-07-28'}</strong></span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 flex flex-col justify-between">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase block mb-1">Human Board Governance Action</span>
                        <p className="text-slate-400 text-[10px]">
                          Authorized compliance auditors and Sharia experts must review comments, verify ledger hashes and click to submit final decisions.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowReviewActionModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg transition text-center w-full mt-2"
                      >
                        {isRTL ? 'إثبات القرار والتحليل الشرعي' : 'Input Sharia Board Decision / Review'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SUB-PAGE: CERTIFICATE TEMPLATE BUILDER (Requirement 7) */}
          {activeSubTab === 'templates' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مصمم ومصنع قوالب الشهادات الرسمية' : 'Premium Certificate Template Designer'}</h3>
                <p className="text-xs text-slate-400">{isRTL ? 'تخصيص الحقول، الشعار، النمط البصري ومعلومات التوقيع لشهادات المطابقة التلقائية.' : 'Configure layouts, descriptions, signature fields, and design visual motifs for digital output.'}</p>

                <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'اسم القالب:' : 'Template Name:'}</label>
                      <input
                        type="text"
                        value={tplName}
                        onChange={(e) => setTplName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                        placeholder="e.g. Traditional Islamic Gold Seal Ledger"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'نوع الترخيص:' : 'Certificate Category:'}</label>
                      <select
                        value={tplType}
                        onChange={(e) => setTplType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                      >
                        <option value="Sharia Compliance Certificate">Sharia Compliance Certificate</option>
                        <option value="Crypto Compliance Certificate">Crypto Compliance Certificate</option>
                        <option value="FinTech Compliance Certificate">FinTech Compliance Certificate</option>
                        <option value="Enterprise Compliance Certificate">Enterprise Compliance Certificate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'النمط البصري (Design Motif):' : 'Visual Motif (Requirement 7):'}</label>
                      <select
                        value={tplDesign}
                        onChange={(e) => setTplDesign(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                      >
                        <option value="Traditional Islamic">Traditional Islamic (Gold & Green Borders)</option>
                        <option value="Modern">Modern Minimalist (High Tech Slate)</option>
                        <option value="Enterprise">Enterprise Corporate (PwC/Deloitte Style)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'اسم ومسمى الموقع المعتمد:' : 'Certified Authority Signer:'}</label>
                      <input
                        type="text"
                        value={tplSigner}
                        onChange={(e) => setTplSigner(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                        placeholder="Sheikh Zain Al-Abedin, Chief Sharia Board"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'صلاحية الشهادة:' : 'Default Validity Period:'}</label>
                      <input
                        type="text"
                        value={tplValidity}
                        onChange={(e) => setTplValidity(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                        placeholder="1 Year (Renewable)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'نص الوصف والاعتماد الأساسي:' : 'Primary Verification Description Text:'}</label>
                    <textarea
                      value={tplDescription}
                      onChange={(e) => setTplDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-lg p-2.5"
                      placeholder="Input compliance proof descriptions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition"
                  >
                    {isRTL ? 'حفظ قالب الشهادة الجديد' : 'Save Certificate Template'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 5. SUB-PAGE: ISSUED CERTIFICATES (Requirement 8) */}
          {activeSubTab === 'issued' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'الشهادات الرقمية المعتمدة الصادرة للعملاء' : 'Active digitally signed & QR-Verifiable Certificates'}</h3>
                  <p className="text-xs text-slate-400">{isRTL ? 'استعرض كافة شهادات الالتزام المفعلة مع تفاصيل درجة الموثوقية وتاريخ التراخيص.' : 'Manage issued tokens, suspension statuses, or download verifiable credential sheets.'}</p>
                </div>

                <div className="space-y-3">
                  {certificates.map(cert => (
                    <div
                      key={cert.certificateId}
                      onClick={() => setSelectedCertificateId(cert.certificateId)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedCertificateId === cert.certificateId
                          ? 'border-emerald-500 bg-emerald-600/5 dark:bg-emerald-500/5'
                          : 'border-slate-150 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <Award className={`w-5 h-5 ${cert.status === 'Active' ? 'text-emerald-600' : cert.status === 'Suspended' ? 'text-rose-600' : 'text-slate-400'}`} />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{cert.organizationName}</span>
                            <span className="text-[11px] text-slate-400 block">{cert.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                            cert.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            cert.status === 'Suspended' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-500'
                          }`}>{cert.status}</span>
                          <span className="block text-[10px] font-mono font-bold text-slate-500 mt-1">{cert.certificateId}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                        <div>
                          <span>Framework:</span>
                          <strong className="block text-slate-700 dark:text-slate-300 truncate max-w-[150px] mt-0.5">{cert.framework}</strong>
                        </div>
                        <div>
                          <span>Issue Date:</span>
                          <strong className="block text-slate-700 dark:text-slate-300 mt-0.5">{cert.issueDate}</strong>
                        </div>
                        <div>
                          <span>Expiry Limit:</span>
                          <strong className="block text-slate-700 dark:text-slate-300 mt-0.5">{cert.expiryDate}</strong>
                        </div>
                        <div>
                          <span>Signatory Board:</span>
                          <strong className="block text-slate-700 dark:text-slate-300 truncate max-w-[150px] mt-0.5">{cert.approvedBy}</strong>
                        </div>
                      </div>

                      {/* Quick Suspension & Control buttons (Requirement 14) */}
                      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        {cert.status === 'Active' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCertificateId(cert.certificateId);
                              setShowSuspensionModal(true);
                            }}
                            className="text-rose-600 hover:text-rose-500 font-bold text-[10px] px-2.5 py-1 rounded border border-rose-200 bg-rose-50/50"
                          >
                            Suspend / Revoke Certificate
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateCertStatus(cert.certificateId, 'Active');
                            }}
                            className="text-emerald-600 hover:text-emerald-500 font-bold text-[10px] px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50/50"
                          >
                            Reactivate Certificate
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenewCertificate(cert.certificateId);
                          }}
                          className="text-indigo-600 hover:text-indigo-500 font-bold text-[10px] px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50/50"
                        >
                          Trigger Immediate Renewal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. SUB-PAGE: RENEWAL MANAGEMENT (Requirement 12) */}
          {activeSubTab === 'renewals' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'مراقبة صلاحية وتجديد الشهادات المعتمدة' : 'Continuous Expiry & Renewal Pipeline'}</h3>
                <p className="text-xs text-slate-400">{isRTL ? 'متابعة تلقائية للشهادات التي اقتربت على الانتهاء مع جدولة فترات التنبيه (٩٠، ٦٠، ٣٠ يوماً) وتفعيل خط التجديد.' : 'Auto-monitors certificates close to expiration with alerts and custom task scheduling.'}</p>

                {/* Expiry alerts & notifications block (Requirement 12) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-500/10 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-600 font-bold">
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      <span>{isRTL ? 'تنبيه: شهادة قريبة على الانتهاء (أقل من ٣٠ يوم)' : 'Alert: Critical Expiring Certificate (30d Limit)'}</span>
                    </div>
                    <p className="text-slate-400">
                      <strong>Rawabi Micro-Invest Payments</strong> certificate (ID: <strong>ICAP-FT-2026-000032</strong>) expires on <strong>2026-08-19</strong>. Compliance scans indicate renewal files are overdue.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleRenewCertificate('ICAP-FT-2026-000032')}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] px-3 py-1.5 rounded"
                      >
                        {isRTL ? 'تنشيط طلب التجديد الفوري' : 'Initiate Standard Renewal Task'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-600 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>{isRTL ? 'إشعار التجديد الدوري (٦٠ يوماً)' : 'Standard Expiry Reminder (60d Alert)'}</span>
                    </div>
                    <p className="text-slate-400">
                      <strong>Hilal DeFi Liquid Assets Pool</strong> is 58 days away from expiry. High compliance rating of 95% makes it eligible for automated renewal path review.
                    </p>
                  </div>
                </div>

                {/* Renewal requests table */}
                <div className="space-y-3">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">{isRTL ? 'طلبات تجديد الشهادات تحت المراجعة والتدقيق' : 'Logged Renewal Pipeline Tracking (Requirement 12)'}</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-500">
                      <thead className="text-[10px] uppercase text-slate-400 bg-slate-50 dark:bg-slate-900">
                        <tr>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Certificate ID</th>
                          <th className="p-2.5">Request Date</th>
                          <th className="p-2.5">Proposed Expiry</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {renewals.map(ren => (
                          <tr key={ren.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                            <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{ren.id}</td>
                            <td className="p-2.5 font-mono">{ren.certificateId}</td>
                            <td className="p-2.5">{ren.requestDate}</td>
                            <td className="p-2.5 font-mono">{ren.newExpiryDate}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[9px] animate-pulse">Pending Audit</span>
                            </td>
                            <td className="p-2.5">
                              <button
                                onClick={() => {
                                  setCertificates(prev => prev.map(c => {
                                    if (c.certificateId === ren.certificateId) {
                                      return { ...c, expiryDate: ren.newExpiryDate, status: 'Active' };
                                    }
                                    return c;
                                  }));
                                  setRenewals(prev => prev.filter(r => r.id !== ren.id));
                                  showToast('Certificate renewal approved and successfully signed.');
                                }}
                                className="text-emerald-600 hover:text-emerald-500 font-bold"
                              >
                                Approve Renewal
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. SUB-PAGE: PUBLIC VERIFICATION PORTAL (Requirement 10 & 11) */}
          {activeSubTab === 'public' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="text-center max-w-md mx-auto space-y-2">
                  <div className="bg-emerald-600/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <QrCode className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white">{isRTL ? 'بوابة ومحرك الاستعلام الفوري والتحقق العام' : 'Public Certificate Registry & QR Authenticator'}</h3>
                  <p className="text-xs text-slate-400">
                    {isRTL 
                      ? 'يمكن للمستثمرين والعملاء والجهات الرقابية إدخال رقم الشهادة أو اسم المنشأة للاستعلام الفوري والتحقق من صلاحيتها.'
                      : 'Allows anyone to verify certificates by inputting the Certificate ID or searching the organization holder.'}
                  </p>
                </div>

                <form onSubmit={handlePublicSearch} className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    value={publicSearchQuery}
                    onChange={(e) => setPublicSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'أدخل رقم الشهادة أو اسم المنشأة...' : 'e.g. ICAP-SC-2026-000001 or Al Noor'}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 rounded-xl p-2.5 text-xs"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isRTL ? 'تحقق الآن' : 'Verify Registry'}</span>
                  </button>
                </form>

                {/* Display Search Results (Requirement 10) */}
                <AnimatePresence mode="wait">
                  {searchedCertificate ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl max-w-xl mx-auto space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            {isRTL ? 'شهادة صالحة ومطابقة شرعياً' : 'VERIFIED COMPLIANT CERTIFICATE'}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white mt-1.5">{searchedCertificate.organizationName}</h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{searchedCertificate.type}</span>
                        </div>
                        <span className="font-mono text-slate-400 font-semibold">{searchedCertificate.certificateId}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                        <div>
                          <span>{isRTL ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                          <strong className="block text-slate-800 dark:text-slate-200 font-bold">{searchedCertificate.issueDate}</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'صلاحية لغاية:' : 'Expiration Limit:'}</span>
                          <strong className="block text-slate-800 dark:text-slate-200 font-bold">{searchedCertificate.expiryDate}</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'درجة التدقيق ومطابقة المعاملات:' : 'Transaction Integrity Score:'}</span>
                          <strong className="block text-emerald-600 font-bold">{searchedCertificate.score}% Overall Compliant</strong>
                        </div>
                        <div>
                          <span>{isRTL ? 'مرجع معيار الفحص المستند:' : 'Assigned Compliance Model:'}</span>
                          <strong className="block text-slate-800 dark:text-slate-200 font-bold">{searchedCertificate.framework}</strong>
                        </div>
                      </div>

                      {/* Verification history timeline inside public registry check (Requirement 10) */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] text-slate-400">
                        <span className="font-bold block text-slate-600 dark:text-slate-300">Registry Log Details</span>
                        <div className="flex justify-between">
                          <span>Auto-scan validation cycle signature</span>
                          <span className="font-mono text-emerald-600">SECURE_PASS_0x99A3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total verified smart-ledgers count</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200">145 Documents</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : publicSearchQuery ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-center text-xs text-slate-400 max-w-sm mx-auto">
                      {isRTL ? 'لم يتم العثور على أي نتائج مطابقة.' : 'No active certificate matched input query. Check ID format.'}
                    </div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 8. SUB-PAGE: COMPLIANCE HISTORY (Requirement 13) */}
          {activeSubTab === 'history' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'سجل تتبع الشهادات وحركات الترخيص والتجديد' : 'Auditable Certification Version History & Lifecycles'}</h3>
                <p className="text-xs text-slate-400">{isRTL ? 'خط زمن للتغييرات، التعليقات، التجديدات، حالات التجميد أو سحب الرخص للشهادات.' : 'Full audit trails documenting creations, changes, and suspensions.'}</p>

                <div className="space-y-4 pt-2">
                  {history.map(item => (
                    <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 text-xs flex gap-3 items-start">
                      <div className="bg-emerald-600/10 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-800 dark:text-slate-100">{item.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1">{item.details}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 mt-2 border-t border-slate-200 dark:border-slate-800/80">
                          <span>{isRTL ? 'بواسطة المراجع:' : 'User Signature:'} <strong className="text-slate-700 dark:text-slate-300 font-mono">{item.user}</strong></span>
                          <span>Certificate ID: <strong className="font-mono">{item.certificateId}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ====================================================
            RIGHT PANEL: CERTIFICATE VISUAL GRAPHIC & CONTROLS (Requirement 8)
            ==================================================== */}
        <div className="space-y-6">

          {/* Premium Digital Certificate Canvas Preview Card (Requirement 8) */}
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <span className="font-display font-bold text-xs uppercase text-slate-400">{isRTL ? 'معاينة الوثيقة والختم الرقمي' : 'Certified Document & Seal Live Preview'}</span>
              <button
                onClick={() => window.print()}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold text-[11px] flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> {isRTL ? 'طباعة' : 'Print Layout'}
              </button>
            </div>

            {/* Simulated Printed Certificate Layout styled like PwC / Traditional Islamic / Modern (Requirement 7 & 8) */}
            <div className={`border-2 p-4 rounded-xl relative overflow-hidden transition duration-300 ${
              tplDesign === 'Traditional Islamic'
                ? 'border-emerald-600 bg-emerald-950/5'
                : tplDesign === 'Modern'
                ? 'border-slate-800 bg-slate-900/10'
                : 'border-blue-900 bg-blue-950/5'
            }`}>
              
              {/* Ornate Gold border graphic if traditional (Requirement 7) */}
              {tplDesign === 'Traditional Islamic' && (
                <div className="absolute inset-0 border-4 border-amber-500/20 pointer-events-none"></div>
              )}

              <div className="text-center space-y-3 relative z-10 text-xs">
                
                {/* Logo area */}
                <div className="flex justify-center mb-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-xs ${
                    tplDesign === 'Traditional Islamic' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    ICAP
                  </div>
                </div>

                {/* Main Header title */}
                <h4 className={`font-display font-black text-sm uppercase tracking-wide ${
                  tplDesign === 'Traditional Islamic' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {isRTL ? 'شهادة التوافق والالتزام الشرعي الرقمية' : 'CERTIFICATE OF ISLAMIC COMPLIANCE'}
                </h4>

                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">{isRTL ? 'موثقة ومحققة آلياً' : 'VERIFIED COMPLIANCE RECORD'}</span>

                <div className="py-2 border-t border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 block">{isRTL ? 'تمنح هذه الشهادة المعتمدة لـ:' : 'This certifies that all transaction records of:'}</span>
                  <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-100 block">{selectedCert.organizationName}</span>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed px-2">
                    {tplDesign === 'Traditional Islamic' 
                      ? 'Adhere fully to the established AAOIFI standards. Real-time smart ledger monitoring records zero non-permissible interest (Riba) accruals and matches investment criteria.'
                      : tplDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-400 pt-1">
                  <div>
                    <span>{isRTL ? 'رقم الشهادة:' : 'Certificate ID:'}</span>
                    <strong className="block text-slate-800 dark:text-slate-200 font-mono font-bold mt-0.5">{selectedCert.certificateId}</strong>
                  </div>
                  <div>
                    <span>{isRTL ? 'مستوى الاعتماد:' : 'Level of Review:'}</span>
                    <strong className="block text-emerald-600 font-bold mt-0.5">{selectedCert.level}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-400">
                  <div>
                    <span>{isRTL ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                    <strong className="block text-slate-800 dark:text-slate-200 font-mono mt-0.5">{selectedCert.issueDate}</strong>
                  </div>
                  <div>
                    <span>{isRTL ? 'صالح لغاية:' : 'Expiration Limit:'}</span>
                    <strong className="block text-slate-800 dark:text-slate-200 font-mono mt-0.5">{selectedCert.expiryDate}</strong>
                  </div>
                </div>

                {/* QR Code Graphic element (Requirement 10 & 11) */}
                <div className="flex justify-center pt-2">
                  <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:scale-105 transition" onClick={() => {
                    setPublicSearchQuery(selectedCert.certificateId);
                    setSearchedCertificate(selectedCert);
                    setActiveSubTab('public');
                    showToast('Opening verification page inside registry portal.');
                  }}>
                    <QrCode className="w-12 h-12 text-slate-900" />
                    <span className="text-[7px] text-slate-400 block mt-1 font-mono">{isRTL ? 'اضغط للتحقق' : 'Click to Verify'}</span>
                  </div>
                </div>

                {/* Approval Signatures block */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[8px] text-slate-400">
                  <div className="text-left">
                    <span>Authorized Signature:</span>
                    <strong className="block text-slate-700 dark:text-slate-300 font-semibold mt-0.5">{selectedCert.approvedBy}</strong>
                  </div>
                  <div className="text-right">
                    <span>Registry Signature:</span>
                    <strong className="block text-emerald-600 font-mono mt-0.5">SECURE_VERIFIED_ICAP</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Verification URL block */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-150 p-3 rounded-xl text-[10px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-600 dark:text-slate-300 block">Certificate Ledger Metadata</span>
              <div className="flex justify-between items-center">
                <span>Unique verification URL:</span>
                <a
                  href={selectedCert.verificationUrl}
                  onClick={(e) => { e.preventDefault(); showToast(`Opening secure link: ${selectedCert.verificationUrl}`); }}
                  className="text-emerald-600 hover:underline flex items-center gap-0.5"
                >
                  Verify Seal <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="flex justify-between">
                <span>Total public QR inquiries count:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{selectedCert.qrScannedCount} Views</span>
              </div>
            </div>
          </div>

          {/* Quick Support Advisor Agent Widget */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-800 p-5 rounded-2xl text-white space-y-3">
            <h4 className="font-display font-bold text-xs flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              {isRTL ? 'تحليلات ذكاء المعاملات والسياسات' : 'Smart Contract Scan Advisor'}
            </h4>
            <p className="text-[11px] text-emerald-300 leading-relaxed">
              Based on overall score ratings, Al Noor Islamic Finance holds continuous monitoring status. All payment vouchers were automatically checked against the AAOIFI criteria.
            </p>
          </div>

        </div>

      </div>

      {/* ====================================================
          MODAL: SUBMIT REQUEST FORM (Requirement 3)
          ==================================================== */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 shadow-2xl space-y-4`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تقديم طلب ترخيص ومطابقة جديد' : 'Submit New Certification Request'}</h3>
              <button onClick={() => setShowRequestForm(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'اسم المنشأة:' : 'Organization / Brand Name:'}</label>
                <input
                  type="text"
                  value={newReqOrgName}
                  onChange={(e) => setNewReqOrgName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'نوع الترخيص المطلوب:' : 'Certification Type:'}</label>
                  <select
                    value={newReqType}
                    onChange={(e) => setNewReqType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Sharia Compliance Certificate">Sharia Compliance Certificate</option>
                    <option value="Crypto Compliance Certificate">Crypto Compliance Certificate</option>
                    <option value="FinTech Compliance Certificate">FinTech Compliance Certificate</option>
                    <option value="Enterprise Compliance Certificate">Enterprise Compliance Certificate</option>
                    <option value="Internal Compliance Certificate">Internal Compliance Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'النطاق المستهدف:' : 'Assessment Scope:'}</label>
                  <select
                    value={newReqScope}
                    onChange={(e) => setNewReqScope(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Full Organization">Full Organization Operations</option>
                    <option value="Specific Product">Specific Product Line</option>
                    <option value="Specific Service">Specific Service / Protocol</option>
                    <option value="Specific Department">Specific Regional Department</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'تفاصيل النطاق:' : 'Scope Focus Details:'}</label>
                  <input
                    type="text"
                    value={newReqScopeDetails}
                    onChange={(e) => setNewReqScopeDetails(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                    placeholder="e.g. Asset and Ledger Code 4509"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">{isRTL ? 'فترة التغطية المطلوبة:' : 'Requested Review Period:'}</label>
                  <input
                    type="text"
                    value={newReqPeriod}
                    onChange={(e) => setNewReqPeriod(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                    placeholder="e.g. FY 2026-2027"
                    required
                  />
                </div>
              </div>

              {/* Drag and Drop File Selection Simulation (Requirement 3 & Usability guidelines) */}
              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                <FilePlus className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="font-bold text-slate-600 dark:text-slate-300 block">Drag & Drop Compliance Evidence Files</span>
                <span className="text-[10px] text-slate-400 block">Attach contracts, charter policies or purification statement ledgers (Max 10MB)</span>
                <div className="flex justify-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="docCheck"
                    checked={newReqDocAttached}
                    onChange={(e) => setNewReqDocAttached(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <label htmlFor="docCheck" className="text-[10px] text-slate-400 cursor-pointer">Simulate attaching 3 regulatory compliance files</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition shadow"
                >
                  Submit Certification Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ====================================================
          MODAL: INPUT REVIEWER DECISION & RECOMMENDATION (Requirement 6)
          ==================================================== */}
      {showReviewActionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 shadow-2xl space-y-4`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'اعتماد قرار الهيئة والمجلس الاستشاري' : 'Sharia Board / Compliance Reviewer Sign-off'}</h3>
              <button onClick={() => setShowReviewActionModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleReviewDecision} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Reviewer Board Name:</label>
                  <input
                    type="text"
                    value={reviewerNameInput}
                    onChange={(e) => setReviewerNameInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Review Verdict / Decision:</label>
                  <select
                    value={reviewDecision}
                    onChange={(e) => setReviewDecision(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Approved">Approved (Issue Digital Seal)</option>
                    <option value="Rejected">Rejected Compliance</option>
                    <option value="Needs Modification">Needs Modification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Reviewer Comments / Directives:</label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  placeholder="e.g. Verified zero non-compliant cash accruals. Smart contracts pass standard checks."
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Reviewed Evidence (Comma-separated files or ledgers):</label>
                <input
                  type="text"
                  value={reviewEvidence}
                  onChange={(e) => setReviewEvidence(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  placeholder="e.g. purification receipts, contract clauses, balance sheets"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReviewActionModal(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition shadow"
                >
                  Submit Board Decision
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ====================================================
          MODAL: ASSIGN REVIEWER (Requirement 5)
          ==================================================== */}
      {showAssignReviewerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 shadow-2xl space-y-4`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">{isRTL ? 'تعيين وتفويض مراجع للمعاملة' : 'Assign Reviewer to Task'}</h3>
              <button onClick={() => setShowAssignReviewerModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleAssignReviewer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Assignee Expert Name:</label>
                <input
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  placeholder="e.g. Sheikh Zain Al-Abedin"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Role Pool:</label>
                  <select
                    value={assigneeRole}
                    onChange={(e) => setAssigneeRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Sharia Reviewer">Sharia Reviewer</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="External Reviewer">External Reviewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Deadline Target Limit:</label>
                  <input
                    type="date"
                    value={assigneeDeadline}
                    onChange={(e) => setAssigneeDeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignReviewerModal(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition shadow"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ====================================================
          MODAL: SUSPEND / REVOKE REASON (Requirement 14)
          ==================================================== */}
      {showSuspensionModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 shadow-2xl space-y-4`}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Suspend Certificate</h3>
              <button onClick={() => setShowSuspensionModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Reason for Suspension / Revocation:</label>
                <select
                  value={suspensionReasonInput}
                  onChange={(e) => setSuspensionReasonInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg p-2"
                >
                  <option value="Compliance Failure">Compliance Failure (Discovered non-permissible interest)</option>
                  <option value="Expired Review">Expired Review (Annual audits missed)</option>
                  <option value="Incorrect Information">Incorrect Information Provided</option>
                  <option value="Customer Request">Customer Direct Request</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSuspensionModal(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCertStatus(selectedCertificateId, 'Suspended')}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-5 rounded-xl transition shadow"
                >
                  Confirm Suspension
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
