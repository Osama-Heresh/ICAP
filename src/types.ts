export interface Organization {
  id: string;
  name: string;
  industry: string;
  country: string;
  logo?: string;
  createdAt: string;
  subscriptionStatus: 'Active' | 'Pending' | 'Trial' | 'Expired';
  businessType?: string;
  employeesCount?: string;
  annualRevenueRange?: string;
  primaryActivity?: string;
}

export type UserRole =
  | 'SUPER ADMIN'
  | 'ORGANIZATION ADMIN'
  | 'COMPLIANCE OFFICER'
  | 'AUDITOR'
  | 'SHARIA REVIEWER'
  | 'EXECUTIVE USER'
  | 'EMPLOYEE'
  | 'PARTNER'
  | 'DEVELOPER'
  | 'CUSTOMER SUCCESS MANAGER'
  | 'CUSTOMER USER'
  | 'SALES EXECUTIVE'
  | 'PROJECT MANAGER';

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  jobTitle?: string;
  department?: string;
  status: 'Active' | 'Deactivated' | 'Pending';
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  organizationId: string;
  title: string;
  message: string;
  status: 'Read' | 'Unread';
  createdAt: string;
}

export interface ComplianceConfiguration {
  id: string;
  organizationId: string;
  scope: string[]; // Areas of compliance selected (e.g., "Islamic Finance")
  frameworks: string[]; // Selected frameworks (e.g., "AAOIFI Based")
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Needs Changes';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Standard {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  version: string;
  source: string;
  status: 'Active' | 'Archived' | 'Draft';
  uploadedDate: string;
  description?: string;
}

export type DocumentCategory =
  | 'Standards'
  | 'Policies'
  | 'SOPs'
  | 'Contracts'
  | 'Fatwas'
  | 'Audit Documents'
  | 'Financial Documents'
  | 'Other';

export interface KnowledgeDocument {
  id: string;
  organizationId: string;
  name: string;
  category: DocumentCategory;
  version: string;
  fileUrl?: string;
  status: 'Draft' | 'Processing' | 'Pending Review' | 'Approved' | 'Rejected' | 'Archived';
  processingStatus: 'Uploaded' | 'Processing' | 'Extracting Text' | 'Analyzing' | 'Ready' | 'Failed';
  uploadedBy: string;
  uploadedDate: string;
  approvedBy?: string;
  size: string; // e.g., "1.2 MB"
  type: string; // e.g., "PDF"
  extractedText?: string;
  metadata?: {
    author?: string;
    effectiveDate?: string;
    organization?: string;
    references?: string[];
    keywords?: string[];
  };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  changeDescription: string;
  uploadedBy: string;
  createdAt: string;
  fileUrl?: string;
}

export interface Policy {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  description: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Expired';
  attachmentName?: string;
}

export interface SOPStep {
  id: string;
  stepNumber: number;
  name: string;
  role: string;
}

export interface SOP {
  id: string;
  organizationId: string;
  name: string;
  department: string;
  purpose: string;
  steps: SOPStep[];
  status: 'Draft' | 'Under Review' | 'Approved' | 'Expired';
  attachmentName?: string;
}

export interface CustomRule {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  severity: 'High' | 'Medium' | 'Low';
  action: string;
  status: 'Active' | 'Inactive';
}

export interface ReviewAssignment {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  role: string;
  area: string;
}

export interface KnowledgeCategory {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  documentCount: number;
}

export interface KnowledgeNode {
  id: string;
  organizationId: string;
  type: 'Standard' | 'Rule' | 'Policy' | 'SOP' | 'Document' | 'Contract' | 'Finding';
  name: string;
  relationships: string[]; // IDs of related nodes
  createdAt: string;
}

export interface ProcessingJob {
  id: string;
  documentId: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  progress: number; // 0 to 100
  startedAt: string;
  completedAt?: string;
}

// ==========================================
// CANONICAL DATA MODELS
// ==========================================

export interface ErpCustomer {
  id: string;
  organizationId: string;
  externalId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  type: 'Retail' | 'Corporate' | 'Institutional';
}

export interface ErpVendor {
  id: string;
  organizationId: string;
  externalId: string;
  name: string;
  category: string;
  country: string;
}

export interface ErpInvoice {
  id: string;
  organizationId: string;
  externalId: string;
  invoiceNumber: string;
  customerId: string;
  amount: number;
  currency: string;
  date: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
}

export interface ErpPayment {
  id: string;
  organizationId: string;
  externalId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
}

export interface ErpJournalEntry {
  id: string;
  organizationId: string;
  externalId: string;
  account: string;
  debit: number;
  credit: number;
  date: string;
  description: string;
}

export interface ErpAccount {
  id: string;
  organizationId: string;
  accountCode: string;
  accountName: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
}

export interface ErpAsset {
  id: string;
  organizationId: string;
  name: string;
  value: number;
  purchaseDate: string;
  depreciation: number;
}

export interface ErpEmployee {
  id: string;
  organizationId: string;
  name: string;
  department: string;
  position: string;
}

export interface ErpContract {
  id: string;
  organizationId: string;
  title: string;
  vendor: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated';
}

// ==========================================
// ERP INTEGRATION STRUCTURES
// ==========================================

export interface Integration {
  id: string;
  organizationId: string;
  type: 'odoo' | 'sap' | 'oracle' | 'dynamics' | 'erpnext' | 'netsuite' | 'custom';
  name: string;
  status: 'Connected' | 'Pending' | 'Disconnected';
  credentials: {
    apiUrl: string;
    apiKey?: string;
    username?: string;
    password?: string;
    dbName?: string;
    environment: 'Sandbox' | 'Production' | 'Staging';
  };
  createdAt: string;
}

export interface ErpConnector {
  id: string;
  name: string;
  type: 'API' | 'Database' | 'File' | 'Webhook';
  supportedModules: string[];
  version: string;
  description: string;
  logo: string;
}

export interface SyncJob {
  id: string;
  organizationId: string;
  integrationId: string;
  status: 'Connecting' | 'Fetching' | 'Transforming' | 'Validating' | 'Completed' | 'Failed';
  startedAt: string;
  completedAt?: string;
  progress: number; // 0 to 100
}

export interface SyncLog {
  id: string;
  syncJobId: string;
  records: number;
  errors: number;
  duration: string;
  systemName: string;
  date: string;
  status: 'Success' | 'Partial' | 'Failed';
  details: string;
}

export interface DataMapping {
  id: string;
  organizationId: string;
  erpType: string;
  sourceField: string;
  targetField: string;
  customTransformation?: string;
}

// ==========================================
// DEVELOPER & API GATEWAY TYPES
// ==========================================

export interface DeveloperApplication {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  developerName: string;
  company: string;
  website: string;
  contactEmail: string;
  applicationType: 'ERP Connector' | 'Integration' | 'Reporting Tool' | 'Custom Application';
  clientId: string;
  clientSecret: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Revoked';
  createdAt: string;
}

export interface DeveloperApiKey {
  id: string;
  applicationId: string;
  keyName: string;
  apiKey: string;
  permissions: ('read:customers' | 'read:financials' | 'write:documents' | 'read:compliance' | string)[];
  createdAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

export interface ApiLogRecord {
  id: string;
  applicationId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  timestamp: string;
  status: number; // e.g. 200, 401, 429, 500
  responseTime: number; // in ms
  ipAddress?: string;
  errorMessage?: string;
}

export interface WebhookSubscription {
  id: string;
  organizationId: string;
  url: string;
  event: 'document.uploaded' | 'compliance.finding.created' | 'sync.completed' | 'certificate.issued' | 'risk.alert.generated';
  secret: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface MarketplaceConnector {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: 'Installed' | 'Available' | 'Pending Review';
  supportedERP: string;
  description: string;
  rating: number;
  logo: string;
  price?: string;
}

export interface ConnectorSubmission {
  id: string;
  name: string;
  description: string;
  erpSupported: string;
  documentation: string;
  version: string;
  testingInfo: string;
  status: 'Submitted' | 'Technical Review' | 'Security Review' | 'Approved' | 'Published';
  createdAt: string;
}

// ==========================================
// SAAS PLATFORM OPERATIONS & ADMIN TYPES
// ==========================================

export interface PlatformSetting {
  id: string;
  setting: string;
  value: string;
  category: string;
}

export interface SubscriptionLimit {
  users: number;
  storageGb: number;
  aiAnalysisLimit: number;
  erpConnections: number;
  reports: number;
  certificates: number;
  apiAccess: boolean;
}

export interface SubscriptionRecord {
  id: string;
  organizationId: string;
  plan: 'Starter' | 'Professional' | 'Enterprise' | 'Custom';
  status: 'Active' | 'Trial' | 'Suspended' | 'Expired';
  limits: SubscriptionLimit;
  billingCycle: 'Monthly' | 'Annual';
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
  invoiceCount: number;
  enterpriseContractDetails?: string;
}

export interface UsageRecord {
  id: string;
  organizationId: string;
  service: 'AI Requests' | 'Documents Processed' | 'ERP Transactions' | 'API Calls' | 'Storage' | 'Reports Generated' | 'Certificates Issued';
  quantity: number;
  date: string;
}

export interface SecurityPolicySettings {
  minPasswordLength: number;
  passwordExpiryDays: number;
  mfaRequired: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  encryptionStatus: 'AES-256 Enabled' | 'FIPS 140-2 Compliant' | 'Custom';
}

export interface SecurityPolicyRecord {
  id: string;
  organizationId: string;
  settings: SecurityPolicySettings;
}

export interface PlatformAuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  module: 'Dashboard' | 'Documents' | 'Compliance' | 'AI Engine' | 'Reports' | 'Certification' | 'Audit' | 'Integrations' | 'Administration' | 'Security';
  timestamp: string;
  ipAddress: string;
  details: string;
}

export interface SystemJob {
  id: string;
  jobName: string;
  status: 'Idle' | 'Running' | 'Completed' | 'Failed';
  startedAt: string;
  completedAt?: string;
  progress?: number;
}



