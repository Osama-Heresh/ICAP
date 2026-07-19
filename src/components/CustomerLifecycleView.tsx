import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Users,
  History,
  FileText,
  FileCheck,
  Calendar,
  Settings,
  Shield,
  LayoutGrid,
  CheckSquare,
  Award,
  MessageSquare,
  RefreshCw,
  HeartPulse,
  ShoppingBag,
  Building,
  Mail,
  Download,
  Plus,
  Trash2,
  FileSignature,
  TrendingUp,
  UserCheck,
  Check,
  Clock,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Info,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCode2,
  FileDown
} from 'lucide-react';
import { User, ActivityLog, Organization } from '../types';
import {
  DEMO_COMPANIES,
  DEMO_CONTACTS,
  DEMO_LEADS,
  DEMO_OPPORTUNITIES,
  DEMO_ACTIVITIES,
  DEMO_CONTRACTS,
  DEMO_PROJECTS,
  DEMO_TASKS,
  DEMO_CERTIFICATES,
  DEMO_RESOURCES,
  DEMO_TIMESHEETS,
  DEMO_SUCCESS_PLANS
} from '../clsdData';
import {
  CLCompany,
  CLContact,
  CLLead,
  CLActivity,
  CLProposal,
  CLContract,
  CLProject,
  CLTask,
  CLResource,
  CLTimesheet,
  CLSuccessPlan,
  CLTaskStatus,
  CLTaskApproval,
  LeadStage,
  CLContractType
} from '../clsdTypes';

interface CustomerLifecycleViewProps {
  user: User;
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  activeTab?: string;
  onTriggerActivityLog?: (action: string, details: string) => void;
}

export default function CustomerLifecycleView({
  user,
  locale,
  theme,
  activeTab,
  onTriggerActivityLog
}: CustomerLifecycleViewProps) {
  const isRTL = locale === 'ar';

  // Core Data in state to allow interaction
  const [rawCompanies, setCompanies] = useState<CLCompany[]>(DEMO_COMPANIES);
  const [rawContacts, setContacts] = useState<CLContact[]>(DEMO_CONTACTS);
  const [rawLeads, setLeads] = useState<CLLead[]>(DEMO_LEADS);
  const [rawActivities, setActivities] = useState<CLActivity[]>(DEMO_ACTIVITIES);
  const [rawContracts, setContracts] = useState<CLContract[]>(DEMO_CONTRACTS);
  const [rawProjects, setProjects] = useState<CLProject[]>(DEMO_PROJECTS);
  const [rawTasks, setTasks] = useState<CLTask[]>(DEMO_TASKS);
  const [rawCertificates, setCertificates] = useState<any[]>(DEMO_CERTIFICATES);
  const [rawResources, setResources] = useState<CLResource[]>(DEMO_RESOURCES);
  const [rawTimesheets, setTimesheets] = useState<CLTimesheet[]>(DEMO_TIMESHEETS);
  const [rawSuccessPlans, setSuccessPlans] = useState<CLSuccessPlan[]>(DEMO_SUCCESS_PLANS);

  // Proposal State
  const [rawProposals, setProposals] = useState<CLProposal[]>([
    {
      id: 'PROP-101-v1',
      leadId: 'LED-001',
      companyName: 'Al Rajhi Bank',
      version: 1,
      commercialProposal: 'Master Advisory, 12-month retainer',
      technicalProposal: 'Core Sharia screening API deployment',
      complianceProposal: 'AAOIFI Standard 12 & 49 compliance rules',
      pricing: 150000,
      discounts: 10000,
      attachments: ['proposal-v1.pdf'],
      approvals: [
        { name: 'Ahmed Al-Mansoori', role: 'VP of Governance', status: 'Approved' },
        { name: 'Sheikh Dr. Ibrahim Al-Khaled', role: 'Sharia Reviewer', status: 'Approved' }
      ],
      status: 'Approved',
      createdAt: '2026-07-10'
    }
  ]);

  // --- ROLE-BASED ACCESS CONTROL (RBAC) DATA SEPARATION ENGINE ---
  const leads = useMemo(() => {
    if (user.role === 'SUPER ADMIN' || user.role === 'ORGANIZATION ADMIN' || user.role === 'EXECUTIVE USER') {
      return rawLeads;
    }
    if (user.role === 'SALES EXECUTIVE') {
      return rawLeads.filter(l => l.assignedSalesExecutive === 'Layla Al-Amri' || l.assignedSalesExecutive === user.name);
    }
    if (user.role === 'CUSTOMER SUCCESS MANAGER') {
      return rawLeads.filter(l => l.stage === 'Won' || l.priority === 'Critical');
    }
    return [];
  }, [rawLeads, user.role, user.name]);

  const projects = useMemo(() => {
    if (
      user.role === 'SUPER ADMIN' ||
      user.role === 'ORGANIZATION ADMIN' ||
      user.role === 'EXECUTIVE USER' ||
      user.role === 'CUSTOMER SUCCESS MANAGER' ||
      user.role === 'SHARIA REVIEWER' ||
      user.role === 'AUDITOR' ||
      user.role === 'COMPLIANCE OFFICER'
    ) {
      return rawProjects;
    }
    if (user.role === 'PROJECT MANAGER') {
      return rawProjects.filter(p => p.assignedPM === 'Hani Shaker' || p.assignedPM === user.name);
    }
    if (user.role === 'CUSTOMER USER') {
      return rawProjects.filter(p => p.companyName === 'Al Rajhi Bank');
    }
    return [];
  }, [rawProjects, user.role, user.name]);

  const companies = useMemo(() => {
    if (user.role === 'CUSTOMER USER') {
      return rawCompanies.filter(c => c.name === 'Al Rajhi Bank');
    }
    if (user.role === 'PROJECT MANAGER') {
      const activeProjectCompanies = new Set(projects.map(p => p.companyName));
      return rawCompanies.filter(c => activeProjectCompanies.has(c.name));
    }
    return rawCompanies;
  }, [rawCompanies, user.role, projects]);

  const contacts = useMemo(() => {
    if (user.role === 'CUSTOMER USER') {
      return rawContacts.filter(c => c.companyName === 'Al Rajhi Bank');
    }
    if (user.role === 'PROJECT MANAGER') {
      const activeProjectCompanies = new Set(projects.map(p => p.companyName));
      return rawContacts.filter(c => activeProjectCompanies.has(c.companyName));
    }
    return rawContacts;
  }, [rawContacts, user.role, projects]);

  const activities = useMemo(() => {
    if (user.role === 'SUPER ADMIN' || user.role === 'ORGANIZATION ADMIN' || user.role === 'EXECUTIVE USER' || user.role === 'CUSTOMER SUCCESS MANAGER') {
      return rawActivities;
    }
    if (user.role === 'CUSTOMER USER') {
      return rawActivities.filter(a => a.customerName === 'Al Rajhi Bank');
    }
    if (user.role === 'SALES EXECUTIVE') {
      return rawActivities.filter(a => a.employeeName === 'Layla Al-Amri' || a.employeeName === user.name);
    }
    if (user.role === 'PROJECT MANAGER') {
      return rawActivities.filter(a => a.employeeName === 'Hani Shaker' || a.employeeName === user.name);
    }
    return rawActivities;
  }, [rawActivities, user.role, user.name]);

  const contracts = useMemo(() => {
    if (
      user.role === 'SUPER ADMIN' ||
      user.role === 'ORGANIZATION ADMIN' ||
      user.role === 'EXECUTIVE USER' ||
      user.role === 'SALES EXECUTIVE' ||
      user.role === 'CUSTOMER SUCCESS MANAGER' ||
      user.role === 'SHARIA REVIEWER' ||
      user.role === 'AUDITOR' ||
      user.role === 'COMPLIANCE OFFICER'
    ) {
      return rawContracts;
    }
    if (user.role === 'CUSTOMER USER') {
      return rawContracts.filter(c => c.companyName === 'Al Rajhi Bank');
    }
    if (user.role === 'PROJECT MANAGER') {
      const activeProjectCompanies = new Set(projects.map(p => p.companyName));
      return rawContracts.filter(c => activeProjectCompanies.has(c.companyName));
    }
    return [];
  }, [rawContracts, user.role, projects]);

  const tasks = useMemo(() => {
    if (user.role === 'SUPER ADMIN' || user.role === 'ORGANIZATION ADMIN' || user.role === 'EXECUTIVE USER') {
      return rawTasks;
    }
    if (user.role === 'CUSTOMER USER') {
      return rawTasks.filter(t => t.projectName === 'Al Rajhi Bank');
    }
    if (user.role === 'PROJECT MANAGER') {
      const activeProjectIds = new Set(projects.map(p => p.id));
      return rawTasks.filter(t => activeProjectIds.has(t.projectId));
    }
    if (user.role === 'SHARIA REVIEWER' || user.role === 'AUDITOR' || user.role === 'COMPLIANCE OFFICER') {
      return rawTasks.filter(t => t.assignedRole === 'Compliance Officer' || t.assignedRole === 'Sharia Reviewer' || t.assignedRole === 'Auditor');
    }
    return [];
  }, [rawTasks, user.role, projects]);

  const certificates = useMemo(() => {
    if (user.role === 'CUSTOMER USER') {
      return rawCertificates.filter(c => c.companyName === 'Al Rajhi Bank');
    }
    return rawCertificates;
  }, [rawCertificates, user.role]);

  const resources = useMemo(() => {
    if (user.role === 'CUSTOMER USER' || user.role === 'SALES EXECUTIVE') {
      return [];
    }
    return rawResources;
  }, [rawResources, user.role]);

  const timesheets = useMemo(() => {
    if (user.role === 'CUSTOMER USER' || user.role === 'SALES EXECUTIVE') {
      return [];
    }
    if (user.role === 'PROJECT MANAGER') {
      return rawTimesheets.filter(ts => ts.employeeName === 'Hani Shaker' || ts.employeeName === user.name);
    }
    return rawTimesheets;
  }, [rawTimesheets, user.role, user.name]);

  const successPlans = useMemo(() => {
    if (user.role === 'CUSTOMER USER') {
      return rawSuccessPlans.filter(p => p.companyName === 'Al Rajhi Bank');
    }
    return rawSuccessPlans;
  }, [rawSuccessPlans, user.role]);

  const proposals = useMemo(() => {
    if (user.role === 'CUSTOMER USER') {
      return rawProposals.filter(p => p.companyName === 'Al Rajhi Bank');
    }
    return rawProposals;
  }, [rawProposals, user.role]);

  // Active Tab/Sub-view configuration
  // For other general users, we allow selecting the active CLSD module.
  const [activeClsdTab, setActiveClsdTab] = useState<
    'pipeline' | 'contracts' | 'projects' | 'tasks' | 'portal' | 'resources' | 'timesheets' | 'collaboration' | 'success' | 'executive'
  >(() => {
    if (user.role === 'SALES EXECUTIVE') return 'pipeline';
    if (user.role === 'PROJECT MANAGER') return 'projects';
    if (user.role === 'CUSTOMER SUCCESS MANAGER') return 'success';
    if (user.role === 'CUSTOMER USER') return 'portal';
    return 'executive'; // default for Admins/Executives
  });

  // Sync parent activeTab with local sub-tab
  useEffect(() => {
    if (!activeTab) return;
    const tab = activeTab.trim();
    
    if (tab === 'Lead Management' || tab === 'Customers' || tab === 'Activities' || tab === 'Proposals' || tab === 'Meetings' || tab === 'Calendar') {
      setActiveClsdTab('pipeline');
    } else if (tab === 'Contracts' || tab === 'Renewals') {
      setActiveClsdTab('contracts');
    } else if (tab === 'Projects' || tab === 'Milestones' || tab === 'Deliverables' || tab === 'Project Reports') {
      setActiveClsdTab('projects');
    } else if (tab === 'Tasks' || tab === 'Their Tasks') {
      setActiveClsdTab('tasks');
    } else if (tab === 'Resources') {
      setActiveClsdTab('resources');
    } else if (tab === 'Customer Communication' || tab === 'Messages') {
      setActiveClsdTab('collaboration');
    } else if (tab === 'Health Checks' || tab === 'Satisfaction' || tab === 'Cross-selling') {
      setActiveClsdTab('success');
    } else if (
      tab === 'Their Company' || 
      tab === 'Their Projects' || 
      tab === 'Their Reports' || 
      tab === 'Their Certificates' || 
      tab === 'Downloads'
    ) {
      setActiveClsdTab('portal');
    } else if (tab === 'Customer Lifecycle') {
      setActiveClsdTab('executive');
    }
  }, [activeTab]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog & Creator forms states
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState<Partial<CLLead>>({
    companyName: '',
    industry: 'Islamic Banking',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    contactPerson: '',
    email: '',
    phone: '',
    expectedBudget: 50000,
    stage: 'New Lead',
    priority: 'Medium'
  });

  // Activity Log Creator State
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<CLActivity>>({
    type: 'Phone Call',
    customerName: '',
    description: '',
    outcome: '',
    nextAction: ''
  });

  // Proposal Creator State
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [newProp, setNewProp] = useState<Partial<CLProposal>>({
    companyName: '',
    pricing: 80000,
    discounts: 0,
    commercialProposal: 'Standard advisory service terms',
    technicalProposal: 'AAOIFI checklist verification',
    complianceProposal: 'Pre-vetted Sharia screening logs'
  });

  // Project Templates State
  const [selectedTemplate, setSelectedTemplate] = useState<'Enterprise Compliance' | 'Crypto Compliance' | 'ERP Integration' | 'Certification' | 'Training' | 'Consulting'>('Enterprise Compliance');

  // Interactive Task state
  const [selectedTask, setSelectedTask] = useState<CLTask | null>(null);
  const [commentText, setCommentText] = useState('');

  // Timesheet Logger state
  const [timeProject, setTimeProject] = useState('');
  const [timeHours, setTimeHours] = useState(8);
  const [timeCategory, setTimeCategory] = useState<'Core Work' | 'Support' | 'Training' | 'Travel' | 'Administrative'>('Core Work');

  // Collaboration Chat States
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Hani Shaker', role: 'PROJECT MANAGER', text: 'Sharia scholar verification is running late for Bank Nizwa project. Bassam, can you look at their transaction evidence logs today?', date: '10:15 AM' },
    { user: 'Bassam Al-Hadi', role: 'Consultant', text: 'Yes, looking at the Murabaha sequencing logs now. Will upload the report under Deliverables.', date: '10:30 AM' },
    { user: 'Nour El-Eman', role: 'Compliance Officer', text: 'Draft SOW contract version 2.1 for Boubyan Bank uploaded to contracts. Requires admin review before customer signing.', date: '11:02 AM' }
  ]);

  // Project Closure Verification State
  const [closureProjectId, setClosureProjectId] = useState('');
  const [closureVerificationResults, setClosureVerificationResults] = useState<{
    tasksOk: boolean;
    docsOk: boolean;
    approvalsOk: boolean;
    satisfactionOk: boolean;
    certsIssued: boolean;
    complete: boolean;
  } | null>(null);

  // Printable Report State
  const [printableReport, setPrintableReport] = useState<{
    title: string;
    content: string;
    metrics: { label: string; val: string }[];
  } | null>(null);

  // HELPER FOR QUICK FEEDBACK / NOTIFICATIONS
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const triggerAlert = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // --- PHASE 1: DRAG & DROP PIPELINE HANDLER ---
  const handleLeadStageChange = (leadId: string, newStage: LeadStage) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          if (l.stage !== newStage) {
            // Trigger activity timeline logging automatically
            const act: CLActivity = {
              id: `ACT-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              time: '09:00',
              employeeName: user.name,
              customerName: l.companyName,
              type: 'Follow-up',
              description: `Lead state transitioned from [${l.stage}] to [${newStage}]`,
              files: [],
              outcome: 'Updated pipeline records',
              nextAction: 'Review appropriate follow-up milestones'
            };
            setActivities(prevAct => [act, ...prevAct]);
            if (onTriggerActivityLog) {
              onTriggerActivityLog(
                'CRM Pipeline Change',
                `Lead ${l.companyName} (${leadId}) moved to stage ${newStage}`
              );
            }
          }
          return { ...l, stage: newStage, probability: newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : l.probability };
        }
        return l;
      })
    );
    triggerAlert(
      isRTL
        ? `تم تحديث حالة العميل إلى [${newStage}] بنجاح!`
        : `Lead successfully moved to [${newStage}]!`
    );
  };

  // --- PHASE 2: SIGN CONTRACT -> AUTO GENERATE PROJECT ---
  const handleSignContract = (contractId: string) => {
    let signedContractCompany = '';
    let contractValue = 100000;
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          signedContractCompany = c.companyName;
          contractValue = c.value;
          return {
            ...c,
            status: 'SIGNED',
            customerSignatures: [
              { name: 'Sheikh Al-Mansoori', date: new Date().toISOString().split('T')[0], ip: '192.168.1.115' }
            ]
          };
        }
        return c;
      })
    );

    if (signedContractCompany) {
      // Auto-Spawn Customer Project (Phase 3 Engine)
      const newProjId = `PRJ-${String(rawProjects.length + 1).padStart(3, '0')}`;
      const newProjNum = `PRJ-${202600 + rawProjects.length + 1}`;
      const startD = new Date().toISOString().split('T')[0];
      const endD = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

      const generatedProject: CLProject = {
        id: newProjId,
        projectNumber: newProjNum,
        companyName: signedContractCompany,
        productsPurchased: ['AAOIFI Compliance Auto-Audit', 'Zakat & Purification Calculator'],
        assignedPM: 'Hani Shaker',
        status: 'Initiation',
        startDate: startD,
        targetFinishDate: endD,
        milestones: [
          { name: 'Phase 1: Project Setup & SOW Alignment', targetDate: startD, status: 'Completed' },
          { name: 'Phase 2: Operational Evidence Review', targetDate: endD, status: 'Pending' }
        ],
        budget: contractValue,
        projectDocuments: [
          { name: 'SOW_Executed_Signed.pdf', type: 'PDF', url: '#', size: '2.1 MB' }
        ],
        projectTeam: [
          { name: 'Hani Shaker', role: 'Project Manager' },
          { name: 'Bassam Al-Hadi', role: 'Consultant' }
        ],
        customerTeam: [
          { name: 'Sheikh Ahmed Al-Suwaidi', role: 'VP Operations' }
        ],
        healthScore: 100,
        riskLevel: 'Low'
      };

      // Generate Tasks from Template
      const templateTasks = [
        { title: 'Project Kickoff & Requirements Alignment', role: 'Project Manager', hrs: 8 },
        { title: 'AAOIFI Standard Mapping & Framework Modeling', role: 'Consultant', hrs: 24 },
        { title: 'Screening Logic Validation & Test Transactions', role: 'Compliance Officer', hrs: 40 },
        { title: 'Executive Audit Trail Report Compilation', role: 'Auditor', hrs: 16 }
      ];

      const generatedTasks: CLTask[] = templateTasks.map((t, idx) => ({
        id: `TSK-NEW-${newProjId}-${idx + 1}`,
        projectId: newProjId,
        projectName: signedContractCompany,
        title: `${t.title}`,
        description: `Verify operations conform to signed standard criteria.`,
        checklist: [{ text: 'Examine contract files', done: false }],
        comments: [],
        internalNotes: 'Spawned automatically from contract signature.',
        customerNotes: 'Please provide transaction evidence logs.',
        files: [],
        evidence: [],
        estimatedHours: t.hrs,
        actualHours: 0,
        completionPercentage: 0,
        dependencies: [],
        status: 'Pending',
        approvalStatus: 'Pending',
        priority: 'Medium',
        assignedTo: 'Hani Shaker',
        assignedRole: t.role
      }));

      setProjects(prev => [...prev, generatedProject]);
      setTasks(prev => [...generatedTasks, ...prev]);

      if (onTriggerActivityLog) {
        onTriggerActivityLog(
          'Contract Signed SOW Engine',
          `Contract signed for ${signedContractCompany}. Auto-generated project ${newProjNum} and ${generatedTasks.length} tasks.`
        );
      }

      triggerAlert(
        isRTL
          ? `تم توقيع العقد! قام محرك التشغيل تلقائياً بإنشاء المشروع [${newProjNum}] وإسناد المهام الاستراتيجية.`
          : `Contract SIGNED! Project Delivery Engine auto-generated project [${newProjNum}] and task roster.`,
        'success'
      );
    }
  };

  // --- PHASE 10: AUTO VERIFICATION & CLOSURE CHECKLIST ---
  const handleVerifyProjectClosure = (projId: string) => {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    // Run auto-verification queries
    const projTasks = tasks.filter(t => t.projectId === projId);
    const allCompleted = projTasks.every(t => t.status === 'Completed' || t.status === 'Cancelled');
    const hasDocuments = proj.projectDocuments.length > 0;
    const hasCustomerApproval = proj.status === 'Client Approval' || proj.status === 'Closed' || projTasks.some(t => t.approvalStatus === 'Customer Approved');
    const hasNps = successPlans.some(p => p.companyName === proj.companyName && p.npsScore > 0);

    const isEligibleForClosure = allCompleted && hasDocuments && hasCustomerApproval;

    setClosureVerificationResults({
      tasksOk: allCompleted,
      docsOk: hasDocuments,
      approvalsOk: hasCustomerApproval,
      satisfactionOk: hasNps,
      certsIssued: true,
      complete: isEligibleForClosure
    });

    if (isEligibleForClosure) {
      // Transition project status to CLOSED and auto generate artifacts
      setProjects(prev =>
        prev.map(p => {
          if (p.id === projId) {
            return { ...p, status: 'Closed' };
          }
          return p;
        })
      );

      // Auto generate Certificate
      const newCertNum = `ICAP-CERT-2026-${3000 + rawCertificates.length}`;
      const generatedCert = {
        id: `CERT-${Date.now()}`,
        companyName: proj.companyName,
        projectName: 'Enterprise Sharia Compliance Advisory',
        certificateNumber: newCertNum,
        productName: proj.productsPurchased[0] || 'AAOIFI System Audit',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        status: 'Active',
        signedBy: 'Sheikh Dr. Ibrahim Al-Khaled (Chairman)'
      };
      setCertificates(prev => [generatedCert, ...prev]);

      // Auto generate Customer Success Plan (Phase 11)
      const generatedPlan: CLSuccessPlan = {
        id: `CSP-${Date.now()}`,
        companyName: proj.companyName,
        planTitle: `Post-Closure Continuous Success Plan`,
        annualReviewDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
        renewalReminderDate: new Date(Date.now() + 335 * 86400000).toISOString().split('T')[0],
        healthCheckStatus: 'Excellent',
        continuousMonitoringSchedule: 'Quarterly',
        crossSellingRecommendations: ['Sukuk Structuring Tool', 'Takaful Reserve Screening Module'],
        upsellingRecommendations: ['Enterprise Compliance Auto-Audit Cloud Upgrade'],
        npsScore: 9
      };
      setSuccessPlans(prev => [generatedPlan, ...prev]);

      triggerAlert(
        isRTL
          ? `🟢 اكتملت الفحوصات التلقائية! تم إغلاق المشروع بنجاح، وإصدار شهادة الامتثال، وتفعيل خطة نجاح العميل.`
          : `🟢 Verification successful! Project Closed, Compliance Certificate issued, and Customer Success plan instantiated!`,
        'success'
      );
    } else {
      triggerAlert(
        isRTL
          ? `🔴 فشل الإغلاق التلقائي! هناك مهام غير مكتملة أو موافقات مفقودة. يرجى المراجعة.`
          : `🔴 Automated closure prevented! Incomplete tasks or missing approvals exist. Check validation details below.`,
        'error'
      );
    }
  };

  // --- PHASE 9: ADD TIMESHEET HOURLY LOGS ---
  const handleAddTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeProject) return;

    const logged: CLTimesheet = {
      id: `TS-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      employeeName: user.name,
      projectName: timeProject,
      taskTitle: `Operational execution logs screened according to AAOIFI guidelines.`,
      hours: timeHours,
      billable: true,
      category: timeCategory
    };

    setTimesheets(prev => [logged, ...prev]);
    triggerAlert(
      isRTL
        ? `تم تسجيل ${timeHours} ساعة عمل بنجاح بمخزن الفواتير!`
        : `Successfully registered ${timeHours} hours in timesheet logs!`
    );
  };

  // --- PHASE 1: CRM LEAD CREATION ---
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.companyName || !newLead.contactPerson) return;

    const leadNum = `LED-${String(rawLeads.length + 1).padStart(3, '0')}`;
    const created: CLLead = {
      id: leadNum,
      companyName: newLead.companyName,
      industry: newLead.industry || 'Islamic Banking',
      country: newLead.country || 'Saudi Arabia',
      city: newLead.city || 'Riyadh',
      website: `https://www.${newLead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      employeesCount: 500,
      annualRevenue: 25000000,
      contactPerson: newLead.contactPerson,
      jobTitle: 'Director of Compliance',
      phone: newLead.phone || '+966 50 111 2222',
      email: newLead.email || 'info@company.com',
      linkedIn: 'https://linkedin.com',
      source: 'Direct Outreach',
      productsInterested: ['AAOIFI Compliance Auto-Audit'],
      expectedBudget: Number(newLead.expectedBudget) || 120000,
      probability: 20,
      stage: 'New Lead',
      assignedSalesExecutive: user.name,
      nextFollowUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'Medium',
      status: 'Active',
      notes: 'Initial contact made through corporate referral.',
      attachments: []
    };

    setLeads(prev => [created, ...prev]);
    setShowAddLead(false);
    triggerAlert(
      isRTL
        ? `تم تسجيل العميل المحتمل [${leadNum}] بنجاح في نظام إدارة العلاقات (CRM)!`
        : `Successfully registered lead [${leadNum}] in CRM!`
    );
  };

  // --- PHASE 1: LOG CUSTOMER TIMELINE ACTIVITY ---
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.customerName || !newActivity.description) return;

    const created: CLActivity = {
      id: `ACT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: '11:00',
      employeeName: user.name,
      customerName: newActivity.customerName,
      type: newActivity.type as any,
      description: newActivity.description,
      files: [],
      outcome: newActivity.outcome || 'Logged successfully',
      nextAction: newActivity.nextAction || 'Follow up next week'
    };

    setActivities(prev => [created, ...prev]);
    setShowAddActivity(false);
    triggerAlert(
      isRTL
        ? 'تم تسجيل النشاط في المخطط الزمني للعميل بنجاح!'
        : 'Timeline activity logged successfully!'
    );
  };

  // --- PHASE 1: GENERATE PROPOSAL ---
  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.companyName) return;

    const created: CLProposal = {
      id: `PROP-${Date.now()}`,
      leadId: 'LED-012',
      companyName: newProp.companyName,
      version: 1,
      commercialProposal: newProp.commercialProposal || 'Standard terms',
      technicalProposal: newProp.technicalProposal || 'Standard system setup',
      complianceProposal: newProp.complianceProposal || 'AAOIFI Standard checkups',
      pricing: Number(newProp.pricing) || 80000,
      discounts: Number(newProp.discounts) || 0,
      attachments: ['standard-agreement-v1.pdf'],
      approvals: [
        { name: 'Ahmed Al-Mansoori', role: 'VP of Governance', status: 'Pending' }
      ],
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProposals(prev => [created, ...prev]);
    setShowAddProposal(false);
    triggerAlert(
      isRTL
        ? 'تم إنشاء نسخة العرض التجاري/الشرعي بنجاح في انتظار الموافقات الداخلية!'
        : 'Draft proposal generated successfully, awaiting internal approvals!'
    );
  };

  // --- PHASE 6: INTERACTIVE TASK WORKFLOW ENGINE ---
  const handleTaskWorkflowStep = (taskId: string, nextApproval: CLTaskApproval) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          let nextStatus: CLTaskStatus = t.status;
          if (nextApproval === 'Fully Closed') {
            nextStatus = 'Completed';
          } else if (nextApproval === 'Customer Approved') {
            nextStatus = 'Waiting Internal Review';
          } else {
            nextStatus = 'In Progress';
          }

          const updated = {
            ...t,
            approvalStatus: nextApproval,
            status: nextStatus,
            completionPercentage: nextApproval === 'Fully Closed' ? 100 : Math.min(t.completionPercentage + 15, 95)
          };

          if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(updated);
          }

          return updated;
        }
        return t;
      })
    );

    triggerAlert(
      isRTL
        ? `تم تمرير المهمة بخطوة التدفق الشرعي والتشغيلي بنجاح: [${nextApproval}]`
        : `Task advanced in workflow path to: [${nextApproval}]`
    );
  };

  // --- PHASE 7: CHAT COLLABORATION ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage) return;

    const msg = {
      user: user.name,
      role: user.role,
      text: chatMessage,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, msg]);
    setChatMessage('');
  };

  // --- PHASE 11: GENERATE PRINTABLE REPORT (Phase 11 Reporting) ---
  const handleGeneratePrintableReport = (reportType: string) => {
    let title = '';
    let content = '';
    let metrics: { label: string; val: string }[] = [];

    if (reportType === 'pipeline') {
      title = isRTL ? 'تقرير خط المبيعات والفرص البيعية (CRM)' : 'Sales Pipeline & Opportunity Intelligence Report';
      metrics = [
        { label: isRTL ? 'إجمالي العملاء المحتملين' : 'Total CRM Leads', val: `${leads.length}` },
        { label: isRTL ? 'الفرص البيعية النشطة' : 'Active Opportunities', val: `${leads.filter(l => l.stage !== 'Lost' && l.stage !== 'Archived').length}` },
        { label: isRTL ? 'معدل كسب الصفقات' : 'Avg Conversion Rate', val: '31.2%' }
      ];
      content = `This document provides a secure executive breakdown of current Sharia-certified SaaS product inquiries across the GCC region. High-interest leads from Islamic retail banking represent 64% of upcoming pipeline volume. Expected conversion velocities have increased by 14% Q/Q.`;
    } else if (reportType === 'resources') {
      title = isRTL ? 'تقرير كفاءة واستغلال الموارد البشرية' : 'Resource Allocation & Utilization Audit';
      metrics = [
        { label: isRTL ? 'إجمالي الاستشاريين والعلماء' : 'Active Consultants & Scholars', val: `${resources.length}` },
        { label: isRTL ? 'معدل الاستغلال العام' : 'Avg Utilization Rate', val: '82.4%' },
        { label: isRTL ? 'أفراد ذوو ضغط عمل مرتفع' : 'Over-utilized Members', val: '3' }
      ];
      content = `Analysis of resource workload indexes confirms peak Sharia board reviews occurring around quarterly financial screening intervals. Operational audits recommend allocating secondary tasks to Under-utilized junior consultants to balance peak advisory capacity.`;
    } else if (reportType === 'closure') {
      title = isRTL ? 'وثيقة إغلاق وتسليم المشروع الشرعي والتقني' : 'Project Completion & Sharia Handover Ledger';
      metrics = [
        { label: isRTL ? 'المشاريع المغلقة' : 'Closed Projects', val: '4' },
        { label: isRTL ? 'معدل الرضا العام (NPS)' : 'Avg Customer Satisfaction', val: '9.2 / 10' },
        { label: isRTL ? 'المهام المستلمة بالكامل' : 'Completed Delivery Tasks', val: '124' }
      ];
      content = `This report officially registers successful completion of AAOIFI audit auto-feed integrations. All task checklist validations have passed automated checks, digital certificates have been signed off by the Sharia board chair, and lessons learned registers are archived in the Knowledge Center.`;
    }

    setPrintableReport({ title, content, metrics });
  };

  // Filter lists based on search
  const filteredLeads = leads.filter(l =>
    l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.assignedPM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Active Project Roster & KPI Calculations
  const totalPipelineVal = leads.reduce((sum, l) => sum + (l.stage !== 'Lost' && l.stage !== 'Archived' ? l.expectedBudget : 0), 0);
  const totalWonDeals = leads.filter(l => l.stage === 'Won').length;
  const activeProjectsCount = projects.filter(p => p.status !== 'Closed').length;

  return (
    <div className="space-y-6" id="clsd-suite-container">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5" id="clsd-header">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-950/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              ICAP Delivery Suite
            </span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1">
            {isRTL ? 'إدارة دورة حياة العملاء والتشغيل' : 'Customer Lifecycle & Service Delivery'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            {isRTL
              ? 'المنصة الشاملة لإدارة رحلة العميل بالكامل من أولى مراحل المبيعات والفرص البيعية، مروراً بصياغة وتوقيع العقود الشرعية، وإسناد وتشغيل المشاريع، حتى تسليمها وضمان نجاح العميل المستمر.'
              : 'End-to-end suite managing leads, Sharia proposals, smart compliance contract sign-offs, automated delivery engines, project execution workflows, and long-term customer success.'}
          </p>
        </div>

        {/* Global printable report panel */}
        <div className="flex items-center gap-2" id="clsd-report-actions">
          <button
            onClick={() => handleGeneratePrintableReport('pipeline')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            {isRTL ? 'تقرير المبيعات PDF' : 'Sales PDF'}
          </button>
          <button
            onClick={() => handleGeneratePrintableReport('resources')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Users className="w-4 h-4 text-emerald-500" />
            {isRTL ? 'تقرير الموارد PDF' : 'Resources PDF'}
          </button>
          <button
            onClick={() => handleGeneratePrintableReport('closure')}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {isRTL ? 'تقرير الإغلاق PDF' : 'Closure PDF'}
          </button>
        </div>
      </div>

      {/* Floating Alert HUD */}
      {alertMsg && (
        <div
          id="clsd-alert-hud"
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-bounce ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
              : alertMsg.type === 'error'
              ? 'bg-red-950/90 border-red-500/30 text-red-300'
              : 'bg-slate-900/95 border-slate-800 text-slate-200'
          }`}
        >
          <span className="font-bold">{alertMsg.type === 'success' ? '🟢' : alertMsg.type === 'error' ? '🔴' : 'ℹ️'}</span>
          <span className="text-sm font-semibold">{alertMsg.text}</span>
        </div>
      )}

      {/* Printable Report Overlay */}
      {printableReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="printable-overlay">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl p-8 shadow-2xl relative border border-slate-100 animate-fade-in">
            <button
              onClick={() => setPrintableReport(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-slate-100 p-2 rounded-full transition"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm tracking-wider uppercase">
                <Shield className="w-5 h-5 text-yellow-500" />
                ICAP (Islamic Compliance AI Platform)
              </div>
              <h2 className="text-2xl font-extrabold font-display text-slate-900 mt-2">{printableReport.title}</h2>
              <p className="text-xs text-slate-500 mt-1">Generated: July 19, 2026 | Safe Secure Export File</p>
            </div>

            <div className="grid grid-cols-3 gap-4 my-6">
              {printableReport.metrics.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 uppercase font-bold block">{m.label}</span>
                  <span className="text-lg font-extrabold text-emerald-700 mt-1 block">{m.val}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 my-6 text-sm text-slate-700 leading-relaxed">
              <p>{printableReport.content}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 font-mono text-xs text-slate-600">
                // System digital signature trace verified<br />
                // Certifier Board ID: AAOIFI-901-REG<br />
                // Hash verification: [0x8f2a9c1d8847ffb00e31e]<br />
                // Authorized by: {user.name} ({user.role})
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isRTL ? 'طباعة التقرير / حفظ كـ PDF' : 'Print / Save PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Module Tabs Control (For users with Admin or general access to inspect the suite) */}
      {user.role !== 'CUSTOMER USER' && (
        <div className="flex items-center overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 gap-1 scrollbar-thin" id="clsd-tabs">
          <button
            onClick={() => setActiveClsdTab('executive')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'executive'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isRTL ? 'لوحة القيادة التنفيذية' : 'Executive Dashboard'}
          </button>
          <button
            onClick={() => setActiveClsdTab('pipeline')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'pipeline'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            {isRTL ? 'إدارة المبيعات (CRM)' : 'Sales CRM'}
          </button>
          <button
            onClick={() => setActiveClsdTab('contracts')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'contracts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileSignature className="w-3.5 h-3.5" />
            {isRTL ? 'إدارة العقود والموافقات' : 'Contract Management'}
          </button>
          <button
            onClick={() => setActiveClsdTab('projects')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {isRTL ? 'محرك تشغيل المشاريع' : 'Project Engine'}
          </button>
          <button
            onClick={() => setActiveClsdTab('tasks')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'tasks'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            {isRTL ? 'مهامي والتحقق الشرعي' : 'Task Workflows'}
          </button>
          <button
            onClick={() => setActiveClsdTab('resources')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'resources'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {isRTL ? 'تخصيص الموارد البشرية' : 'Resource Allocation'}
          </button>
          <button
            onClick={() => setActiveClsdTab('timesheets')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'timesheets'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isRTL ? 'تسجيل الساعات الفواتير' : 'Billing Timesheets'}
          </button>
          <button
            onClick={() => setActiveClsdTab('collaboration')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'collaboration'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {isRTL ? 'النقاش والتعاون الداخلي' : 'Internal Collaboration'}
          </button>
          <button
            onClick={() => setActiveClsdTab('success')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeClsdTab === 'success'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            {isRTL ? 'نجاح العملاء والفرص البديلة' : 'Customer Success'}
          </button>
          <button
            onClick={() => setActiveClsdTab('portal')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border border-dashed border-emerald-500/40 ${
              activeClsdTab === 'portal'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            <Building className="w-3.5 h-3.5 animate-pulse" />
            {isRTL ? 'معاينة بوابة العميل' : 'Client Portal Preview'}
          </button>
        </div>
      )}

      {/* Global search helper */}
      {activeClsdTab !== 'portal' && (
        <div className="relative" id="clsd-global-search">
          <Search className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRTL ? 'فحص ومراقبة محتويات Suite بالاسم، العميل، أو المعرّف...' : 'Screen, audit and search suite datasets by company, executive, PM or task...'}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-10 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 transition"
          />
        </div>
      )}

      {/* --- EXECUTIVE VIEW PANEL --- */}
      {activeClsdTab === 'executive' && (
        <div className="space-y-6" id="view-exec">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">{isRTL ? 'قيمة مبيعات CRM الجارية' : 'Net Sales Pipeline Value'}</span>
              <div className="text-2xl font-extrabold mt-1 text-emerald-400">${(totalPipelineVal / 1000000).toFixed(2)}M</div>
              <div className="text-[10px] text-slate-400 mt-1">150 {isRTL ? 'عميلاً مسجلاً بالكامل' : 'fully tracked accounts'}</div>
              <Briefcase className="absolute right-3 bottom-3 text-slate-800 w-12 h-12 -z-0" />
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">{isRTL ? 'المشاريع الجارية حالياً' : 'Active Delivery Projects'}</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeProjectsCount}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">100% {isRTL ? 'مراقبة بشكل مستمر' : 'on-track continuous monitoring'}</div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">{isRTL ? 'معدل رضا العملاء المستهدف' : 'Overall Customer Satisfaction'}</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">9.2 / 10</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">NPS {isRTL ? 'ممتاز عبر جميع الأقاليم' : 'Excellent score across GCC'}</div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">{isRTL ? 'معدل استغلال الاستشاريين' : 'Consultant Utilization'}</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">82.4%</div>
              <div className="text-[10px] text-slate-400 mt-1">{isRTL ? 'القدرة التشغيلية مثالية' : 'Capacity within safety limit'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{isRTL ? 'المخطط الزمني للأنشطة والامتثال الأخير' : 'Recent Activities & Compliance Timeline'}</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {activities.slice(0, 5).map((act, index) => (
                  <div key={index} className="flex gap-3 text-xs">
                    <span className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-300 h-fit">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{act.customerName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{act.date}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{act.description}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {act.type}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium">By: {act.employeeName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{isRTL ? 'حالة المشاريع الحالية ومعدلات المخاطر' : 'Project Health & Risk Radar'}</h3>
              <div className="space-y-3">
                {projects.slice(0, 4).map((p, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{p.companyName}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.riskLevel === 'Low'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : p.riskLevel === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                      }`}>
                        Risk: {p.riskLevel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                      <span>PM: {p.assignedPM}</span>
                      <span>Progress: {p.healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 transition-all" style={{ width: `${p.healthScore}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PIPELINE CRM TAB VIEW --- */}
      {activeClsdTab === 'pipeline' && (
        <div className="space-y-6" id="view-crm">
          {/* CRM Dashboard widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="crm-widgets">
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-400 text-xs uppercase font-bold">{isRTL ? 'العملاء المستهدفين الكلي' : 'Total Pipeline Value'}</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">${(totalPipelineVal / 1000000).toFixed(2)}M</div>
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-400 text-xs uppercase font-bold">{isRTL ? 'إجمالي الصفقات الرابحة' : 'Total Won Deals'}</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalWonDeals} {isRTL ? 'صفقات مكتملة' : 'Deals'}</div>
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-400 text-xs uppercase font-bold">{isRTL ? 'معدل النجاح المتوقع' : 'Win Probability'}</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">32.4%</div>
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-slate-400 text-xs uppercase font-bold">{isRTL ? 'العروض المالية المفتوحة' : 'Open Proposals'}</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{proposals.length} {isRTL ? 'عروض جارية' : 'Drafts'}</div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-2" id="crm-controls">
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddLead(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {isRTL ? 'إضافة عميل محتمل جديد' : 'New Sales Lead'}
              </button>
              <button
                onClick={() => setShowAddActivity(true)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <History className="w-4 h-4 text-emerald-500" />
                {isRTL ? 'سجل تفاعل عميل' : 'Log Timeline Activity'}
              </button>
              <button
                onClick={() => setShowAddProposal(true)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                {isRTL ? 'صياغة عرض مالي/شرعي' : 'Generate Proposal'}
              </button>
            </div>
          </div>

          {/* ADD LEAD MODAL */}
          {showAddLead && (
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800" id="add-lead-modal">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{isRTL ? 'إضافة عميل محتمل جديد في المبيعات' : 'Register New CRM Lead Prospect'}</h3>
              <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'اسم الشركة' : 'Company Name'}</label>
                  <input
                    type="text"
                    required
                    value={newLead.companyName}
                    onChange={(e) => setNewLead(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'مسؤول الاتصال' : 'Contact Person'}</label>
                  <input
                    type="text"
                    required
                    value={newLead.contactPerson}
                    onChange={(e) => setNewLead(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'البريد الإلكتروني' : 'Contact Email'}</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end col-span-3">
                  <button
                    type="button"
                    onClick={() => setShowAddLead(false)}
                    className="bg-slate-200 dark:bg-slate-800 py-2 px-4 rounded-xl text-xs font-semibold"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white py-2 px-6 rounded-xl text-xs font-bold"
                  >
                    {isRTL ? 'حفظ وحجز' : 'Save Prospect'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADD TIMELINE ACTIVITY MODAL */}
          {showAddActivity && (
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800" id="add-activity-modal">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{isRTL ? 'تسجيل تفاعل مع العميل' : 'Log Customer Timeline Activity'}</h3>
              <form onSubmit={handleCreateActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'الشركة المستهدفة' : 'Customer/Company'}</label>
                  <input
                    type="text"
                    required
                    value={newActivity.customerName}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'نوع النشاط' : 'Activity Type'}</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Online Meeting">Online Meeting</option>
                    <option value="WhatsApp Conversation">WhatsApp Conversation</option>
                    <option value="Demo">Demo</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">{isRTL ? 'تفاصيل النقاش ومخرجاته' : 'Description / Discussion details'}</label>
                  <textarea
                    required
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs h-20"
                  />
                </div>
                <div className="flex gap-2 justify-end col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowAddActivity(false)}
                    className="bg-slate-200 dark:bg-slate-800 py-2 px-4 rounded-xl text-xs font-semibold"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white py-2 px-6 rounded-xl text-xs font-bold"
                  >
                    {isRTL ? 'حفظ النشاط' : 'Log Activity'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADD PROPOSAL MODAL */}
          {showAddProposal && (
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-fade-in" id="add-proposal-modal">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{isRTL ? 'صياغة عرض فني وشرعي جديد للفرص' : 'Generate Technical/Compliance Proposal'}</h3>
              <form onSubmit={handleCreateProposal} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'اسم الشركة' : 'Company Name'}</label>
                  <input
                    type="text"
                    required
                    value={newProp.companyName}
                    onChange={(e) => setNewProp(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'التكلفة المقترحة ($)' : 'Pricing Proposed ($)'}</label>
                  <input
                    type="number"
                    value={newProp.pricing}
                    onChange={(e) => setNewProp(prev => ({ ...prev, pricing: Number(e.target.value) }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'البنود التجارية' : 'Commercial Offer Terms'}</label>
                  <textarea
                    value={newProp.commercialProposal}
                    onChange={(e) => setNewProp(prev => ({ ...prev, commercialProposal: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs h-20"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'محددات الامتثال الشرعي (AAOIFI)' : 'Sharia & AAOIFI Compliance Terms'}</label>
                  <textarea
                    value={newProp.complianceProposal}
                    onChange={(e) => setNewProp(prev => ({ ...prev, complianceProposal: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white text-xs h-20"
                  />
                </div>
                <div className="flex gap-2 justify-end col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProposal(false)}
                    className="bg-slate-200 dark:bg-slate-800 py-2 px-4 rounded-xl text-xs font-semibold"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white py-2 px-6 rounded-xl text-xs font-bold"
                  >
                    {isRTL ? 'إنشاء العرض وحفظ المسودة' : 'Save Draft Proposal'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* KANBAN PIPELINE */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4" id="kanban-pipeline">
            {(['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'] as LeadStage[]).map((stage) => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage);
              return (
                <div key={stage} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 min-w-[220px] flex flex-col h-[550px]" id={`kanban-col-${stage.replace(/\s+/g, '-')}`}>
                  <div className="flex justify-between items-center mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{stage}</span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition cursor-pointer group"
                      >
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-500 font-mono block">
                          {lead.id}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 group-hover:underline">
                          {lead.companyName}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span>{lead.city}, {lead.country}</span>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-900 text-[10px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">
                            ${(lead.expectedBudget / 1000).toFixed(0)}k
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded">
                            {lead.probability}%
                          </span>
                        </div>

                        {/* Drag and Drop Simulation controls */}
                        <div className="flex justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stage !== 'New Lead' && (
                            <button
                              onClick={() => {
                                const stagesList: LeadStage[] = ['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'];
                                const currIdx = stagesList.indexOf(stage);
                                handleLeadStageChange(lead.id, stagesList[currIdx - 1]);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-1 rounded transition text-[10px]"
                              title="Move Left"
                            >
                              ◀
                            </button>
                          )}
                          {stage !== 'Won' && (
                            <button
                              onClick={() => {
                                const stagesList: LeadStage[] = ['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'];
                                const currIdx = stagesList.indexOf(stage);
                                handleLeadStageChange(lead.id, stagesList[currIdx + 1]);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-1 rounded transition text-[10px]"
                              title="Move Right"
                            >
                              ▶
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CONTRACT MANAGEMENT TAB VIEW --- */}
      {activeClsdTab === 'contracts' && (
        <div className="space-y-6" id="view-contracts">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3" id="contracts-controls">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isRTL ? 'إدارة الوثائق والاتفاقيات الشرعية والعامة' : 'Corporate Governance Contracts & SLAs'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="contracts-list">
            <div className="col-span-2 space-y-4">
              {contracts.filter(c => c.companyName.toLowerCase().includes(searchTerm.toLowerCase())).map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:border-emerald-600/40 transition"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {contract.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        contract.status === 'SIGNED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : contract.status === 'IN_REVIEW'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white pt-1">
                      {contract.name}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Customer: <span className="font-semibold text-slate-700 dark:text-slate-300">{contract.companyName}</span> | Value: <span className="text-emerald-600 font-bold">${contract.value.toLocaleString()}</span>
                    </p>
                    <div className="flex gap-4 pt-3 text-[10px] text-slate-400">
                      <span>Expiry: {contract.expiryDate}</span>
                      {contract.signatureDate && (
                        <span className="text-emerald-600">Signed on: {contract.signatureDate}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-2 h-full">
                    <div className="text-[10px] text-slate-400">
                      Version: {contract.versions[contract.versions.length - 1]?.version || 'v1.0'}
                    </div>

                    {contract.status !== 'SIGNED' ? (
                      <button
                        onClick={() => handleSignContract(contract.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FileSignature className="w-3.5 h-3.5" />
                        {isRTL ? 'التوقيع والموافقة الشرعية' : 'Execute & Sign Contract'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {isRTL ? 'مكتمل وموقّع الكترونياً' : 'Executed (Secured)'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar approvals monitor & electronic audit trail (Phase 2) */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">{isRTL ? 'مراقبة مسار الموافقات الإلكترونية' : 'Digital Approvals Audit Trail'}</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="bg-emerald-100 dark:bg-emerald-950/40 p-1.5 rounded text-emerald-600">✓</div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Legal Review Signoff</p>
                      <p className="text-[10px] text-slate-400">Ahmed Al-Mansoori | July 18, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="bg-emerald-100 dark:bg-emerald-950/40 p-1.5 rounded text-emerald-600">✓</div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Sharia Board Board Signoff</p>
                      <p className="text-[10px] text-slate-400">Chairman Ibrahim | July 18, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="bg-yellow-100 dark:bg-yellow-950/40 p-1.5 rounded text-yellow-600">⚡</div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Client Board Approval</p>
                      <p className="text-[10px] text-slate-400">Pending final client electronic signature IP check</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PROJECTS DELIVERY ENGINE TAB VIEW --- */}
      {activeClsdTab === 'projects' && (
        <div className="space-y-6" id="view-projects">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800" id="projects-template-engine">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isRTL ? 'محرك قوالب إسناد المشاريع' : 'Project Assignment Template Engine (Phase 3)'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-xl">
                {isRTL
                  ? 'اختر قالب تشغيل معتمد من الهيئة الشرعية، وسيقوم المحرك آلياً بتوليد وتوزيع مهام الامتثال المناسبة بمجرد تنشيط المنتجات.'
                  : 'Select an AAOIFI-vetted delivery model. Upon product selection, the compliance engine automatically generates specific tasks, hours, checklists, and dependencies.'}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as any)}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-800 dark:text-white"
              >
                <option value="Enterprise Compliance">Enterprise Compliance Template</option>
                <option value="Crypto Compliance">Crypto Compliance Template</option>
                <option value="ERP Integration">ERP Integration Template</option>
                <option value="Certification">Standard Certification Blueprint</option>
                <option value="Training">Standard Training Blueprint</option>
                <option value="Consulting">Strategic Advisory Blueprint</option>
              </select>

              <button
                onClick={() => {
                  triggerAlert(
                    isRTL
                      ? `🟢 تم إعداد محرك التوليد الآلي على قالب: [${selectedTemplate}]`
                      : `🟢 Spawning engine successfully preset to [${selectedTemplate}] model!`
                  );
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2.5 px-4 rounded-xl font-bold transition"
              >
                {isRTL ? 'تهيئة القالب' : 'Preset Blueprint'}
              </button>
            </div>
          </div>

          {/* Projects Table List */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto" id="projects-roster">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">{isRTL ? 'معرّف المشروع' : 'Project Num'}</th>
                  <th className="p-4">{isRTL ? 'العميل المستهدف' : 'Company Name'}</th>
                  <th className="p-4">{isRTL ? 'مدير المشروع' : 'Project Manager'}</th>
                  <th className="p-4">{isRTL ? 'الميزانية ($)' : 'Budget'}</th>
                  <th className="p-4">{isRTL ? 'حالة التشغيل' : 'Status'}</th>
                  <th className="p-4">{isRTL ? 'تاريخ البداية' : 'Start Date'}</th>
                  <th className="p-4 text-center">{isRTL ? 'فحص الإغلاق' : 'Closure Check'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition">
                    <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-300">{p.projectNumber}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-extrabold text-slate-800 dark:text-slate-100">{p.companyName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{p.productsPurchased.join(', ')}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{p.assignedPM}</td>
                    <td className="p-4 font-mono font-bold text-emerald-600">${p.budget.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Closed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono">{p.startDate}</td>
                    <td className="p-4 text-center">
                      {p.status !== 'Closed' ? (
                        <button
                          onClick={() => handleVerifyProjectClosure(p.id)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-1 px-3 rounded-lg font-bold transition text-[10px]"
                        >
                          {isRTL ? 'فحص تلقائي للإغلاق' : 'Run Auto Closure'}
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">
                          ✓ {isRTL ? 'مغلق ومسجل' : 'Closed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TASK MANAGEMENT & WORKFLOW ENGINE TAB VIEW --- */}
      {activeClsdTab === 'tasks' && (
        <div className="space-y-6" id="view-tasks">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="tasks-work-matrix">
            {/* Left sidebar: Task list with assigned focus (My Tasks, Phase 4) */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span>{isRTL ? 'قائمة مهامي الموكلة' : 'My Assigned Work / Tasks'}</span>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                  {tasks.filter(t => t.assignedTo.includes(user.name) || user.role === 'SUPER ADMIN').length}
                </span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                {tasks.filter(t => t.assignedTo.includes(user.name) || user.role === 'SUPER ADMIN').slice(0, 15).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                      selectedTask?.id === task.id
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                      <span>{task.id}</span>
                      <span className={`px-1.5 py-0.5 rounded uppercase ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : task.status === 'Blocked'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1.5">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">Project: {task.projectName}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-1" style={{ width: `${task.completionPercentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Selected Task Details & Active Workflow Engine (Phase 6) */}
            <div className="md:col-span-2">
              {selectedTask ? (
                <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-left" id="selected-task-detail">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded font-mono font-bold">
                      {selectedTask.id} | Project: {selectedTask.projectName}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2">
                      {selectedTask.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      {selectedTask.description}
                    </p>
                  </div>

                  {/* ACTIVE WORKFLOW ENGINE VISUALIZATION (Phase 6) */}
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                      {isRTL ? 'مسار سير العمل والاعتماد الشرعي للمهمة' : 'Task Compliance & Sharia Workflow State'}
                    </h4>

                    {/* Step wizard HUD */}
                    <div className="flex items-center overflow-x-auto gap-2 pb-2 scrollbar-none text-[10px] font-semibold font-mono">
                      {([
                        { name: 'Pending', key: 'Pending' },
                        { name: 'PM Reviewed', key: 'Manager Reviewed' },
                        { name: 'QA Verified', key: 'QA Approved' },
                        { name: 'Compliance OK', key: 'Compliance Verified' },
                        { name: 'Sharia Signed', key: 'Sharia Signed' },
                        { name: 'Client Signed', key: 'Customer Approved' },
                        { name: 'Fully Closed', key: 'Fully Closed' }
                      ] as { name: string; key: CLTaskApproval }[]).map((step, idx) => {
                        const currentIdx = ['Pending', 'Manager Reviewed', 'QA Approved', 'Compliance Verified', 'Sharia Signed', 'Customer Approved', 'Fully Closed'].indexOf(selectedTask.approvalStatus);
                        const stepIdx = ['Pending', 'Manager Reviewed', 'QA Approved', 'Compliance Verified', 'Sharia Signed', 'Customer Approved', 'Fully Closed'].indexOf(step.key);

                        return (
                          <div key={step.key} className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-lg ${
                              stepIdx === currentIdx
                                ? 'bg-emerald-600 text-white font-bold animate-pulse'
                                : stepIdx < currentIdx
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}>
                              {idx + 1}. {step.name}
                            </span>
                            {idx < 6 && <span className="text-slate-300">→</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Next step workflow action controls */}
                    <div className="mt-4 flex gap-2">
                      <span className="text-xs text-slate-500 font-medium self-center">
                        {isRTL ? 'خطوة الاعتماد التالية:' : 'Approve next compliance step:'}
                      </span>
                      {selectedTask.approvalStatus === 'Pending' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'Manager Reviewed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          Manager Review
                        </button>
                      )}
                      {selectedTask.approvalStatus === 'Manager Reviewed' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'QA Approved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          QA Review
                        </button>
                      )}
                      {selectedTask.approvalStatus === 'QA Approved' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'Compliance Verified')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          Compliance Review
                        </button>
                      )}
                      {selectedTask.approvalStatus === 'Compliance Verified' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'Sharia Signed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          Sharia Board Sign
                        </button>
                      )}
                      {selectedTask.approvalStatus === 'Sharia Signed' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'Customer Approved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          Customer Approval
                        </button>
                      )}
                      {selectedTask.approvalStatus === 'Customer Approved' && (
                        <button
                          onClick={() => handleTaskWorkflowStep(selectedTask.id, 'Fully Closed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1.5 px-3 rounded font-bold transition"
                        >
                          Close Task
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task checklist (Phase 4 Checklist) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">{isRTL ? 'قائمة الفحص والمراجعة' : 'Checklist Items'}</h4>
                    <div className="space-y-2">
                      {selectedTask.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => {
                              setTasks(prev =>
                                prev.map(t => {
                                  if (t.id === selectedTask.id) {
                                    const updatedChecklist = [...t.checklist];
                                    updatedChecklist[idx] = { ...updatedChecklist[idx], done: !updatedChecklist[idx].done };
                                    return { ...t, checklist: updatedChecklist };
                                  }
                                  return t;
                                })
                              );
                              // Update local selectedTask state too
                              const updatedChecklist = [...selectedTask.checklist];
                              updatedChecklist[idx] = { ...updatedChecklist[idx], done: !updatedChecklist[idx].done };
                              setSelectedTask({ ...selectedTask, checklist: updatedChecklist });
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments & Discussion (Phase 4 Comments & Notes) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400">{isRTL ? 'التعليقات والملاحظات الشرعية' : 'Discussion & Compliance Notes'}</h4>
                    <div className="space-y-3">
                      {selectedTask.comments.map((c, idx) => (
                        <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                            <span>{c.user} ({c.role})</span>
                            <span className="text-[10px] text-slate-400">{c.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={isRTL ? 'أضف توجيهاً أو استفساراً شرعياً...' : 'Type advisory or task comment...'}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!commentText) return;
                          const newComment = {
                            user: user.name,
                            role: user.role,
                            text: commentText,
                            date: 'Just Now'
                          };
                          setTasks(prev =>
                            prev.map(t => {
                              if (t.id === selectedTask.id) {
                                return { ...t, comments: [...t.comments, newComment] };
                              }
                              return t;
                            })
                          );
                          setSelectedTask({
                            ...selectedTask,
                            comments: [...selectedTask.comments, newComment]
                          });
                          setCommentText('');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition"
                      >
                        {isRTL ? 'إرسال' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 h-[300px] rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-medium">{isRTL ? 'اختر مهمة من القائمة لعرض تفاصيل سير العمل والاعتماد' : 'Select a delivery task to screen compliance details & approve steps'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RESOURCE ALLOCATION TAB VIEW --- */}
      {activeClsdTab === 'resources' && (
        <div className="space-y-6" id="view-resources">
          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" id="resource-summary-card">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              {isRTL ? 'كفاءة توزيع الموارد البشرية والاستشاريين' : 'Active Delivery Team Workload & Allocation Index'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((res) => (
                <div key={res.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{res.name}</h4>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{res.role}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      res.workload === 'Over-utilized'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                        : res.workload === 'Optimal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {res.workload}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">
                      <span className="text-slate-400 block">Projects</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 block">{res.currentProjects}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">
                      <span className="text-slate-400 block">Availability</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 block">{res.availability}%</span>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/60">
                      <span className="text-slate-400 block">Utilization</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 block">{res.utilization}%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>Weekly capacity utilization:</span>
                      <span>{res.utilization}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-1.5 rounded-full ${res.utilization > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${res.utilization}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TIMESHEETS TAB VIEW --- */}
      {activeClsdTab === 'timesheets' && (
        <div className="space-y-6" id="view-timesheets">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="timesheets-container">
            {/* Timesheet logging form */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                {isRTL ? 'سجل ساعات العمل الاستشارية والتقنية' : 'Record Advisory & Delivery Hours'}
              </h3>

              <form onSubmit={handleAddTimesheet} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">{isRTL ? 'المشروع المستهدف' : 'Delivery Project'}</label>
                  <select
                    value={timeProject}
                    onChange={(e) => setTimeProject(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-white text-xs"
                  >
                    <option value="">Select Project...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.companyName}>{p.companyName} ({p.projectNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">{isRTL ? 'عدد الساعات' : 'Hours Spent'}</label>
                    <input
                      type="number"
                      value={timeHours}
                      onChange={(e) => setTimeHours(Number(e.target.value))}
                      required
                      min={1}
                      max={12}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">{isRTL ? 'التصنيف التشغيلي' : 'Work Category'}</label>
                    <select
                      value={timeCategory}
                      onChange={(e) => setTimeCategory(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-800 dark:text-white text-xs"
                    >
                      <option value="Core Work">Core Compliance</option>
                      <option value="Support">Operational Support</option>
                      <option value="Training">AAOIFI Training</option>
                      <option value="Travel">Business Travel</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  {isRTL ? 'حفظ الساعات بالدفتر' : 'Log Hours to Ledger'}
                </button>
              </form>
            </div>

            {/* Timesheet history list */}
            <div className="md:col-span-2 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                {isRTL ? 'سجل الساعات المدونة مؤخراً' : 'Recent Timesheet Audit Ledger'}
              </h3>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                {timesheets.slice(0, 10).map((ts) => (
                  <div key={ts.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-extrabold text-slate-800 dark:text-slate-100">{ts.projectName}</div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Logged by: {ts.employeeName} | Date: {ts.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-mono font-extrabold px-2.5 py-1 rounded text-[10px]">
                        {ts.hours} Hrs
                      </span>
                      <span className="text-[9px] block text-slate-400 mt-1 uppercase font-semibold">{ts.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INTERNAL COLLABORATION TAB VIEW --- */}
      {activeClsdTab === 'collaboration' && (
        <div className="space-y-6" id="view-collab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="collab-box">
            {/* Chat room pane */}
            <div className="md:col-span-2 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <span>💬 {isRTL ? 'قناة النقاش والمداولات الداخلية للامتثال' : 'Internal Sharia Advisory Discussion Rail'}</span>
                <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 px-2.5 py-1 rounded-full font-bold">
                  {isRTL ? 'خاص بالموظفين' : 'Staff Only (Secured)'}
                </span>
              </h3>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 scrollbar-thin text-left">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {msg.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{msg.user}</span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                          {msg.role}
                        </span>
                        <span className="text-slate-400 text-[9px] ml-auto">{msg.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 max-w-[90%]">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isRTL ? 'اكتب رسالة إلى طاقم العمل أو العلماء...' : 'Discuss screening parameters or flag unapproved riba interest items...'}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition"
                >
                  {isRTL ? 'إرسال' : 'Send'}
                </button>
              </form>
            </div>

            {/* Sidebar decisions log & pinned board agenda (Phase 7) */}
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">📌 {isRTL ? 'محضر القرارات وجدول الأعمال المثبت' : 'Decision Log & Pinned Board Items'}</h4>
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">KFH Sukuk Structuring Validation</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">Board approved the automated checking rules for standard secondary Sukuk asset sequencing.</p>
                    <span className="text-[9px] text-slate-400 block mt-2 font-mono">Decision Date: July 15, 2026</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">Al Rajhi Compliance SLA Renewal</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-[11px]">Sari to initiate up-selling Sukuk screening modules next week during annual review call.</p>
                    <span className="text-[9px] text-slate-400 block mt-2 font-mono">Decision Date: July 10, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOMER SUCCESS PLAN TAB VIEW --- */}
      {activeClsdTab === 'success' && (
        <div className="space-y-6" id="view-success">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3" id="success-head">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isRTL ? 'مراقبة خطط نجاح واستدامة حوكمة العملاء' : 'Ongoing Client Success & Growth Plans'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="success-roster">
            {successPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{plan.companyName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{plan.planTitle}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    plan.healthCheckStatus === 'Excellent' || plan.healthCheckStatus === 'Good'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Health: {plan.healthCheckStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block">{isRTL ? 'المراجعة السنوية القادمة' : 'Annual Review Date'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{plan.annualReviewDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isRTL ? 'إشعار التجديد التلقائي' : 'Renewal Reminder'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{plan.renewalReminderDate}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">🌟 {isRTL ? 'مصفوفة الفرص البديلة والبيع المتبادل (AI)' : 'Cross-selling & Upselling Core Recommendations'}</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.crossSellingRecommendations.map((rec, i) => (
                      <span key={i} className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded-lg text-[10px] font-semibold border border-emerald-100/45">
                        {rec} (Cross-sell)
                      </span>
                    ))}
                    {plan.upsellingRecommendations.map((rec, i) => (
                      <span key={i} className="bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-lg text-[10px] font-semibold border border-yellow-100/45">
                        {rec} (Upsell)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CLIENT CUSTOMER PORTAL VIEW --- */}
      {activeClsdTab === 'portal' && (
        <div className="space-y-6" id="view-portal">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-emerald-500/30 shadow-lg relative overflow-hidden" id="portal-hud">
            <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded absolute top-4 right-4">
              {isRTL ? 'بوابة العميل الآمنة' : 'Secure Client Portal'}
            </span>
            <h3 className="text-lg font-bold font-display">{isRTL ? 'مرحباً بك في بوابة الامتثال والتقارير' : 'Secure AAOIFI Compliance Operations Portal'}</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">
              {isRTL
                ? 'مساحة الامتثال الخاصة بمؤسستكم. يمكنك تتبع تقدم مشاريعكم الجارية، تسليم وثائق الإثبات، مراجعة وتنزيل الشهادات الصادرة من الهيئة الشرعية.'
                : 'Your organization isolated, secure compliance portal. Monitor active projects, coordinate audits, upload evidence logs, and download Sharia Compliance certificates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portal-widgets">
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <span className="text-slate-400 text-xs uppercase font-bold block">Compliance Seal Status</span>
              <span className="text-xl font-bold text-emerald-600 mt-1 block">96% Compliant</span>
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <span className="text-slate-400 text-xs uppercase font-bold block">My Active Compliance Audits</span>
              <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">2 Projects</span>
            </div>
            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <span className="text-slate-400 text-xs uppercase font-bold block">Awaiting My Evidence Uploads</span>
              <span className="text-xl font-bold text-yellow-600 mt-1 block">3 Tasks</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="portal-content">
            {/* Active projects list */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                {isRTL ? 'مشاريعنا الجارية للتسليم والتدقيق' : 'Our Active Compliance Advisory Projects'}
              </h4>

              <div className="space-y-3">
                {projects.slice(0, 2).map((p, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{p.companyName}</span>
                      <span className="text-emerald-600 font-bold font-mono text-[10px]">{p.status}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-1" style={{ width: '85%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document download and certificate zone */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                <span>🏆 {isRTL ? 'شهادات الامتثال الشرعي الصادرة (Secured)' : 'Issued compliance Certificates'}</span>
              </h4>

              <div className="space-y-3">
                {certificates.slice(0, 3).map((cert, index) => (
                  <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-extrabold text-slate-800 dark:text-slate-200">{cert.projectName}</div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Cert ID: {cert.certificateNumber}</p>
                    </div>
                    <button
                      onClick={() => {
                        triggerAlert(
                          isRTL
                            ? 'تم بدء تنزيل الشهادة مع الختم الرقمي للهيئة الشرعية بنجاح!'
                            : 'Compliance certificate seal download started successfully!'
                        );
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg transition"
                      title="Download Certified Copy"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
