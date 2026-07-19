import { UserRole } from './types';

export interface CLCompany {
  id: string;
  name: string;
  industry: string;
  country: string;
  city: string;
  website: string;
  employeesCount: number;
  annualRevenue: number;
  status: 'Lead' | 'Opportunity' | 'Customer' | 'Inactive';
}

export interface CLContact {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedIn: string;
}

export type LeadStage =
  | 'New Lead'
  | 'Qualified'
  | 'Meeting Scheduled'
  | 'Demo Completed'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Waiting Decision'
  | 'Won'
  | 'Lost'
  | 'Archived';

export interface CLLead {
  id: string; // LED-001
  companyName: string;
  industry: string;
  country: string;
  city: string;
  website: string;
  employeesCount: number;
  annualRevenue: number;
  contactPerson: string;
  jobTitle: string;
  phone: string;
  email: string;
  linkedIn: string;
  source: string;
  productsInterested: string[];
  expectedBudget: number;
  probability: number;
  stage: LeadStage;
  assignedSalesExecutive: string;
  nextFollowUpDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Contacted' | 'Nurturing' | 'Inactive';
  notes: string;
  attachments: string[];
}

export type CLActivityType =
  | 'Phone Call'
  | 'Email'
  | 'Meeting'
  | 'Online Meeting'
  | 'Site Visit'
  | 'WhatsApp Conversation'
  | 'Presentation'
  | 'Demo'
  | 'Proposal Sent'
  | 'Contract Discussion'
  | 'Document Requested'
  | 'Follow-up';

export interface CLActivity {
  id: string;
  date: string;
  time: string;
  employeeName: string;
  customerName: string;
  type: CLActivityType;
  description: string;
  files: string[];
  outcome: string;
  nextAction: string;
  reminder?: string;
}

export interface CLProposal {
  id: string; // PROP-001-v1
  leadId: string;
  companyName: string;
  version: number;
  commercialProposal: string;
  technicalProposal: string;
  complianceProposal: string;
  pricing: number;
  discounts: number;
  attachments: string[];
  approvals: { name: string; role: string; status: 'Pending' | 'Approved' | 'Rejected' }[];
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Negotiating';
  createdAt: string;
}

export type CLContractType =
  | 'Service Agreement'
  | 'Statement of Work'
  | 'NDA'
  | 'Purchase Order'
  | 'Change Request';

export interface CLContract {
  id: string; // CON-001
  name: string;
  companyName: string;
  type: CLContractType;
  value: number;
  signatureDate?: string;
  expiryDate: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'AWAITING_SIGNATURE' | 'SIGNED' | 'EXPIRED' | 'RENEWED';
  versions: { version: string; date: string; url: string }[];
  customerSignatures: { name: string; date: string; ip: string }[];
  internalApprovals: { name: string; role: string; status: 'Pending' | 'Approved' }[];
}

export interface CLMilestone {
  name: string;
  targetDate: string;
  status: 'Pending' | 'Completed' | 'Delayed';
}

export interface CLProject {
  id: string; // PRJ-001
  projectNumber: string;
  companyName: string;
  productsPurchased: string[];
  assignedPM: string;
  status: 'Initiation' | 'Execution' | 'QA Review' | 'Compliance Audit' | 'Sharia Board Signing' | 'Client Approval' | 'Closed';
  startDate: string;
  targetFinishDate: string;
  milestones: CLMilestone[];
  budget: number;
  projectDocuments: { name: string; type: string; url: string; size: string }[];
  projectTeam: { name: string; role: string }[];
  customerTeam: { name: string; role: string }[];
  healthScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export type CLTaskStatus =
  | 'Pending'
  | 'In Progress'
  | 'Waiting Customer'
  | 'Waiting Internal Review'
  | 'Blocked'
  | 'Completed'
  | 'Cancelled';

export type CLTaskApproval =
  | 'Pending'
  | 'Manager Reviewed'
  | 'QA Approved'
  | 'Compliance Verified'
  | 'Sharia Signed'
  | 'Customer Approved'
  | 'Fully Closed';

export interface CLTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  checklist: { text: string; done: boolean }[];
  comments: { user: string; role: string; text: string; date: string }[];
  internalNotes: string;
  customerNotes: string;
  files: string[];
  evidence: { name: string; url: string; date: string }[];
  estimatedHours: number;
  actualHours: number;
  completionPercentage: number;
  dependencies: string[]; // task IDs
  status: CLTaskStatus;
  approvalStatus: CLTaskApproval;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string; // User Name
  assignedRole: string; // Role name
}

export interface CLResource {
  id: string;
  name: string;
  role: 'Consultant' | 'Compliance Officer' | 'Auditor' | 'Sharia Scholar' | 'Developer' | 'Integration Engineer' | 'Trainer' | 'Project Manager' | 'Support Team';
  currentProjects: number;
  availability: number; // %
  workload: 'Under-utilized' | 'Optimal' | 'Over-utilized';
  vacation: boolean;
  capacity: number; // hours/week
  utilization: number; // %
}

export interface CLTimesheet {
  id: string;
  date: string;
  employeeName: string;
  projectName: string;
  taskTitle: string;
  hours: number;
  billable: boolean;
  category: 'Core Work' | 'Support' | 'Training' | 'Travel' | 'Administrative';
}

export interface CLSuccessPlan {
  id: string;
  companyName: string;
  planTitle: string;
  annualReviewDate: string;
  renewalReminderDate: string;
  healthCheckStatus: 'Excellent' | 'Good' | 'Needs Attention' | 'At Risk';
  continuousMonitoringSchedule: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  crossSellingRecommendations: string[];
  upsellingRecommendations: string[];
  npsScore: number;
}
