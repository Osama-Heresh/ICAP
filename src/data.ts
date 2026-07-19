import {
  Organization,
  User,
  Standard,
  Policy,
  SOP,
  CustomRule,
  KnowledgeDocument,
  KnowledgeNode,
  KnowledgeCategory,
  ActivityLog,
  Notification
} from './types';

// Demo Credentials
export const DEMO_CREDENTIALS = [
  {
    email: 'superadmin@icap-demo.com',
    password: 'Super123!',
    role: 'SUPER ADMIN' as const,
    name: 'Ali Al-Mubarak',
    jobTitle: 'Platform Administrator'
  },
  {
    email: 'admin@icap-demo.com',
    password: 'Admin123!',
    role: 'ORGANIZATION ADMIN' as const,
    name: 'Ahmed Al-Mansoori',
    jobTitle: 'VP of Governance & Operations'
  },
  {
    email: 'compliance@icap-demo.com',
    password: 'Compliance123!',
    role: 'COMPLIANCE OFFICER' as const,
    name: 'Fatima Al-Sayed',
    jobTitle: 'Head of Sharia Compliance'
  },
  {
    email: 'auditor@icap-demo.com',
    password: 'Auditor123!',
    role: 'AUDITOR' as const,
    name: 'Johnathan Vance',
    jobTitle: 'Senior Internal Auditor'
  },
  {
    email: 'sharia@icap-demo.com',
    password: 'Sharia123!',
    role: 'SHARIA REVIEWER' as const,
    name: 'Sheikh Dr. Ibrahim Al-Khaled',
    jobTitle: 'Chairman of Sharia Board'
  },
  {
    email: 'exec@icap-demo.com',
    password: 'Exec123!',
    role: 'EXECUTIVE USER' as const,
    name: 'Yousef Al-Ghamdi',
    jobTitle: 'Chief Executive Officer'
  },
  {
    email: 'partner@icap-demo.com',
    password: 'Partner123!',
    role: 'PARTNER' as const,
    name: 'Zaid Al-Harbi',
    jobTitle: 'Strategic Partner'
  },
  {
    email: 'developer@icap-demo.com',
    password: 'Developer123!',
    role: 'DEVELOPER' as const,
    name: 'Tariq Al-Fahad',
    jobTitle: 'Lead Developer'
  },
  {
    email: 'csm@icap-demo.com',
    password: 'Csm123!',
    role: 'CUSTOMER SUCCESS MANAGER' as const,
    name: 'Sari Al-Rayan',
    jobTitle: 'Senior Customer Success Manager'
  },
  {
    email: 'customer@icap-demo.com',
    password: 'Customer123!',
    role: 'CUSTOMER USER' as const,
    name: 'Sheikh Ahmed Al-Suwaidi',
    jobTitle: 'Corporate Client Representative'
  },
  {
    email: 'sales@icap-demo.com',
    password: 'Sales123!',
    role: 'SALES EXECUTIVE' as const,
    name: 'Layla Al-Amri',
    jobTitle: 'Islamic Sales Executive'
  },
  {
    email: 'pm@icap-demo.com',
    password: 'Pm123!',
    role: 'PROJECT MANAGER' as const,
    name: 'Hani Shaker',
    jobTitle: 'Lead Delivery Project Manager'
  }
];

// Sample Organization
export const DEMO_ORGANIZATION: Organization = {
  id: 'org-al-noor',
  name: 'Al Noor Islamic Finance Group',
  industry: 'Islamic Finance',
  country: 'Saudi Arabia',
  logo: '🕌',
  createdAt: '2024-01-15T08:00:00Z',
  subscriptionStatus: 'Active',
  businessType: 'Islamic Banking & Assets',
  employeesCount: '250-500',
  annualRevenueRange: '$50M - $100M',
  primaryActivity: 'AAOIFI Sharia Auditing & Retail Finance'
};

// Initial User Base
export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    organizationId: 'org-al-noor',
    name: 'Ahmed Al-Mansoori',
    email: 'admin@icap-demo.com',
    role: 'ORGANIZATION ADMIN',
    phone: '+966 50 123 4567',
    jobTitle: 'VP of Governance & Operations',
    department: 'Executive Office',
    status: 'Active',
    createdAt: '2024-01-16T09:00:00Z',
    lastLogin: '2026-07-17T14:30:00Z'
  },
  {
    id: 'user-compliance',
    organizationId: 'org-al-noor',
    name: 'Fatima Al-Sayed',
    email: 'compliance@icap-demo.com',
    role: 'COMPLIANCE OFFICER',
    phone: '+966 50 234 5678',
    jobTitle: 'Head of Sharia Compliance',
    department: 'Compliance & Legal',
    status: 'Active',
    createdAt: '2024-01-18T10:15:00Z',
    lastLogin: '2026-07-17T15:20:00Z'
  },
  {
    id: 'user-auditor',
    organizationId: 'org-al-noor',
    name: 'Johnathan Vance',
    email: 'auditor@icap-demo.com',
    role: 'AUDITOR',
    phone: '+966 50 345 6789',
    jobTitle: 'Senior Internal Auditor',
    department: 'Internal Audit',
    status: 'Active',
    createdAt: '2024-02-01T08:00:00Z',
    lastLogin: '2026-07-17T11:45:00Z'
  },
  {
    id: 'user-sharia',
    organizationId: 'org-al-noor',
    name: 'Sheikh Dr. Ibrahim Al-Khaled',
    email: 'sharia@icap-demo.com',
    role: 'SHARIA REVIEWER',
    phone: '+966 50 456 7890',
    jobTitle: 'Chairman of Sharia Board',
    department: 'Sharia Supervisory Board',
    status: 'Active',
    createdAt: '2024-01-15T14:00:00Z',
    lastLogin: '2026-07-17T15:05:00Z'
  },
  {
    id: 'user-exec',
    organizationId: 'org-al-noor',
    name: 'Yousef Al-Ghamdi',
    email: 'yousef@icap-demo.com',
    role: 'EXECUTIVE USER',
    phone: '+966 50 567 8901',
    jobTitle: 'Chief Executive Officer',
    department: 'C-Suite',
    status: 'Active',
    createdAt: '2024-01-15T08:30:00Z',
    lastLogin: '2026-07-16T18:00:00Z'
  }
];

// Initial Standards Frameworks
export const DEMO_STANDARDS: Standard[] = [
  {
    id: 'std-1',
    organizationId: 'org-al-noor',
    name: 'AAOIFI Sharia Standard No. 8 (Murabaha)',
    category: 'Islamic Finance',
    version: '2025.1',
    source: 'AAOIFI',
    status: 'Active',
    uploadedDate: '2024-02-10',
    description: 'Deals with Murabaha to the purchase orderer including rules for promise, purchase, ownership risk, and pricing transparency.'
  },
  {
    id: 'std-2',
    organizationId: 'org-al-noor',
    name: 'IFSB Guidance on Risk Management',
    category: 'Risk Management',
    version: '2025.2',
    source: 'IFSB',
    status: 'Active',
    uploadedDate: '2024-03-15',
    description: 'Guiding principles on risk management controls for institutions offering Islamic financial services.'
  },
  {
    id: 'std-3',
    organizationId: 'org-al-noor',
    name: 'IFRS 9 Financial Instruments Adaptation',
    category: 'Accounting',
    version: '2025',
    source: 'IFRS Foundation',
    status: 'Active',
    uploadedDate: '2024-04-12',
    description: 'Modified IFRS impairment classification conforming to non-interest-bearing financing assets.'
  },
  {
    id: 'std-4',
    organizationId: 'org-al-noor',
    name: 'AAOIFI Governance Standard No. 1 (Sharia Board)',
    category: 'Islamic Finance',
    version: '2024.3',
    source: 'AAOIFI',
    status: 'Active',
    uploadedDate: '2024-01-20',
    description: 'Presents criteria for appointment, composition, and reporting responsibility of Sharia Supervisory Boards.'
  }
];

// Initial Policies
export const DEMO_POLICIES: Policy[] = [
  {
    id: 'pol-1',
    organizationId: 'org-al-noor',
    name: 'Ethical Investment Policy',
    category: 'Islamic Finance',
    description: 'Mandates strict exclusion lists (alcohol, gambling, conventional finance, interest-bearing assets) and purification rates calculation rules.',
    effectiveDate: '2026-01-01',
    reviewDate: '2027-01-01',
    status: 'Approved',
    attachmentName: 'Investment_Policy_2026_Approved.pdf'
  },
  {
    id: 'pol-2',
    organizationId: 'org-al-noor',
    name: 'Enterprise Risk & Liquidity Policy',
    category: 'Risk Management',
    description: 'Delineates liquidity ratios, reserve mechanisms, and Commodity Murabaha placement rules for deficit coverage.',
    effectiveDate: '2025-06-15',
    reviewDate: '2026-06-15',
    status: 'Approved',
    attachmentName: 'Risk_Liquidity_Policy.pdf'
  },
  {
    id: 'pol-3',
    organizationId: 'org-al-noor',
    name: 'Vendor Sharia Procurement Policy',
    category: 'Company Policy',
    description: 'Dictates vendor screening procedures to ensure contractors align with basic ethical and fair labor covenants of Sharia.',
    effectiveDate: '2025-09-01',
    reviewDate: '2026-09-01',
    status: 'Approved',
    attachmentName: 'Procurement_SOP_V2.pdf'
  }
];

// Initial SOPs
export const DEMO_SOPS: SOP[] = [
  {
    id: 'sop-1',
    organizationId: 'org-al-noor',
    name: 'Murabaha Financing SOP',
    department: 'Retail Banking',
    purpose: 'To ensure proper sequential ownership transfer of physical assets during Murabaha transactions, preventing riba.',
    steps: [
      { id: 'step-1', stepNumber: 1, name: 'Employee / Client Request and Credit Check', role: 'Relationship Manager' },
      { id: 'step-2', stepNumber: 2, name: 'Vendor Price Quote and Purchase Undertaking Signed', role: 'Compliance Officer' },
      { id: 'step-3', stepNumber: 3, name: 'Physical Asset Acquisition (Al Noor takes possession/risk)', role: 'Operations Desk' },
      { id: 'step-4', stepNumber: 4, name: 'Sale & Sequential Ownership Transfer to Client (Murabaha contract)', role: 'Operations Desk' },
      { id: 'step-5', stepNumber: 5, name: 'Sharia Audit Logging and Reconciliation', role: 'Sharia Reviewer' }
    ],
    status: 'Approved',
    attachmentName: 'Murabaha_Execution_SOP_V3.pdf'
  },
  {
    id: 'sop-2',
    organizationId: 'org-al-noor',
    name: 'Commodity Murabaha Liquidity SOP',
    department: 'Treasury & Risk',
    purpose: 'Specifies the buying and selling of underlying metal commodities to handle urgent liquid asset generation without direct currency swaps.',
    steps: [
      { id: 'sop2-1', stepNumber: 1, name: 'Treasury liquidity shortfall identified', role: 'Treasury Analyst' },
      { id: 'sop2-2', stepNumber: 2, name: 'Approved broker purchases metal certificates', role: 'Treasury Desk' },
      { id: 'sop2-3', stepNumber: 3, name: 'Immediate resell to counterparty on deferred payment', role: 'Sharia Reviewer' }
    ],
    status: 'Approved',
    attachmentName: 'Treasury_Commodity_SOP.pdf'
  }
];

// Initial Custom Compliance Rules
export const DEMO_CUSTOM_RULES: CustomRule[] = [
  {
    id: 'rule-1',
    organizationId: 'org-al-noor',
    name: 'Interest Income Purification Check',
    description: 'Any incoming remittance flagged with codes representing interest, conventional bond coupons, or late penalties must be diverted to the purification ledger.',
    category: 'Islamic Finance',
    condition: 'Transaction type matches "Conventional Interest" OR "Riba" OR "Late Interest"',
    severity: 'High',
    action: 'Divert to Purification Holding Fund & Flag for Sharia Board',
    status: 'Active'
  },
  {
    id: 'rule-2',
    organizationId: 'org-al-noor',
    name: 'Sharia Sign-off on Disbursals Above $10,000',
    description: 'All financing payouts exceeding $10,000 must carry the Sharia Supervisory Board approved electronic hash signature.',
    category: 'Governance',
    condition: 'Transaction Value > 10,000 USD AND ShariaSignatureStatus === "Missing"',
    severity: 'High',
    action: 'Place transaction on automated compliance hold and page Compliance Officer',
    status: 'Active'
  },
  {
    id: 'rule-3',
    organizationId: 'org-al-noor',
    name: 'Counterparty Sanction & Ethics Screen',
    description: 'Automatic lookup on regional lists for non-compliant speculative entities (such as traditional gambling operators).',
    category: 'Vendor Compliance',
    condition: 'Counterparty Industry in ["Gambling", "Alcohol", "Traditional Banks"]',
    severity: 'High',
    action: 'Reject vendor onboarding automatically',
    status: 'Active'
  }
];

// Initial Documents & Pipeline Status
export const DEMO_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    organizationId: 'org-al-noor',
    name: 'AAOIFI Sharia Standards 2025 Compilation.pdf',
    category: 'Standards',
    version: '2025.1',
    status: 'Approved',
    processingStatus: 'Ready',
    uploadedBy: 'Fatima Al-Sayed',
    uploadedDate: '2026-07-15',
    size: '14.2 MB',
    type: 'PDF',
    extractedText: 'AAOIFI Sharia Standards 2025 compilation. Section 8 details Murabaha requirements. Section 12 details Mudaraba partnership allocations. In all transactions, ownership risk must transfer sequentially and interest (Riba) is strictly prohibited. Late payment terms must be formulated as charitable donations rather than compound revenue.',
    metadata: {
      author: 'AAOIFI Board of Trustees',
      effectiveDate: '2025-01-01',
      organization: 'Accounting and Auditing Organization for Islamic Financial Institutions',
      references: ['Standard No. 8', 'Standard No. 12', 'Governance No. 1'],
      keywords: ['Murabaha', 'Mudaraba', 'Ownership Risk', 'Riba', 'Purification']
    }
  },
  {
    id: 'doc-2',
    organizationId: 'org-al-noor',
    name: 'Al Noor Internal Investment Guidelines 2026.docx',
    category: 'Policies',
    version: '2026.0',
    status: 'Approved',
    processingStatus: 'Ready',
    uploadedBy: 'Ahmed Al-Mansoori',
    uploadedDate: '2026-07-16',
    size: '2.1 MB',
    type: 'DOCX',
    extractedText: 'This document lists the ethical and Sharia framework for Al Noor Asset Management. No corporate equity investments are allowed in entities whose total conventional debt-to-equity ratio exceeds 33%. Cash-plus-interest accounts must be non-existent. A maximum 5% purification tax is levied on tolerable mixed revenue streams.',
    metadata: {
      author: 'Al Noor Sharia Supervisory Committee',
      effectiveDate: '2026-01-01',
      organization: 'Al Noor Islamic Finance Group',
      references: ['AAOIFI No. 21'],
      keywords: ['Purification', 'Debt-to-Equity', 'Mixed Revenue', 'Screening']
    }
  },
  {
    id: 'doc-3',
    organizationId: 'org-al-noor',
    name: 'Murabaha Purchase Order Flow SOP.xlsx',
    category: 'SOPs',
    version: '3.4',
    status: 'Pending Review',
    processingStatus: 'Extracting Text',
    uploadedBy: 'Fatima Al-Sayed',
    uploadedDate: '2026-07-17',
    size: '4.5 MB',
    type: 'XLSX',
    extractedText: 'Processing Step 1: Client submits financing form. Step 2: Al Noor buys from verified vendor. Step 3: Logistics registers asset serials. Step 4: Sales contract signed with 12-month installment plan. Step 5: Audit logs generated automatically.',
    metadata: {
      author: 'Operations Desk',
      effectiveDate: '2025-12-01',
      organization: 'Al Noor Retail Division',
      references: ['SOP-1'],
      keywords: ['Flowchart', 'Installments', 'Operations', 'Serials']
    }
  },
  {
    id: 'doc-4',
    organizationId: 'org-al-noor',
    name: 'Treasury Metal Commodity Broker Agreement.pdf',
    category: 'Contracts',
    version: '1.2',
    status: 'Draft',
    processingStatus: 'Processing',
    uploadedBy: 'Ahmed Al-Mansoori',
    uploadedDate: '2026-07-17',
    size: '8.1 MB',
    type: 'PDF',
    extractedText: 'Broker Agreement between Al Noor and London Metal exchange brokers for procurement of aluminum ingots. Real physical storage warrants are guaranteed during the ownership period of Al Noor before secondary transfer.',
    metadata: {
      author: 'LME Legal Advisers',
      effectiveDate: '2026-03-01',
      organization: 'LME Broker & Al Noor',
      references: ['Standard No. 8'],
      keywords: ['Ingots', 'LME', 'Warrant', 'Possession']
    }
  }
];

// Initial Knowledge Categories
export const DEMO_KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  { id: 'cat-1', organizationId: 'org-al-noor', name: 'AAOIFI Standards', description: 'Official standards governing Sharia, accounting, auditing, governance, and ethics.', status: 'Active', documentCount: 45 },
  { id: 'cat-2', organizationId: 'org-al-noor', name: 'IFSB Guidance', description: 'Capital adequacy and risk management guidelines for Islamic finance institutions.', status: 'Active', documentCount: 12 },
  { id: 'cat-3', organizationId: 'org-al-noor', name: 'Internal Policies', description: 'Internal directives, screening rules, and ethics charters approved by the Board.', status: 'Active', documentCount: 18 },
  { id: 'cat-4', organizationId: 'org-al-noor', name: 'SOPs', description: 'Standard operating procedures detailing sequence of transactions and sign-offs.', status: 'Active', documentCount: 32 },
  { id: 'cat-5', organizationId: 'org-al-noor', name: 'Fatwas', description: 'Formal legal rulings issued by our Sharia Supervisory Board on complex products.', status: 'Active', documentCount: 22 },
  { id: 'cat-6', organizationId: 'org-al-noor', name: 'Audit Documents', description: 'Historic external audit worksheets, Sharia compliance audits, and regulatory findings.', status: 'Active', documentCount: 15 }
];

// Initial Knowledge Graph Nodes (Murabaha and Riba Networks)
export const DEMO_KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'node-std8', organizationId: 'org-al-noor', type: 'Standard', name: 'AAOIFI Standard No. 8', relationships: ['node-pol1', 'node-sop1', 'node-rule2'], createdAt: '2024-02-10' },
  { id: 'node-pol1', organizationId: 'org-al-noor', type: 'Policy', name: 'Ethical Investment Policy', relationships: ['node-std8', 'node-rule1'], createdAt: '2026-01-01' },
  { id: 'node-sop1', organizationId: 'org-al-noor', type: 'SOP', name: 'Murabaha Financing SOP', relationships: ['node-std8', 'node-rule2'], createdAt: '2025-11-01' },
  { id: 'node-rule1', organizationId: 'org-al-noor', type: 'Rule', name: 'Interest purification check', relationships: ['node-pol1'], createdAt: '2026-01-15' },
  { id: 'node-rule2', organizationId: 'org-al-noor', type: 'Rule', name: 'Sign-off check for > $10,000', relationships: ['node-std8', 'node-sop1'], createdAt: '2026-01-20' },
  { id: 'node-finding1', organizationId: 'org-al-noor', type: 'Finding', name: 'Delayed Serials verification on Murabaha deal #994', relationships: ['node-sop1'], createdAt: '2026-07-01' }
];

// Initial Activity Logs
export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    organizationId: 'org-al-noor',
    userId: 'user-compliance',
    userName: 'Fatima Al-Sayed',
    userRole: 'COMPLIANCE OFFICER',
    action: 'UPLOAD_DOCUMENT',
    timestamp: '2026-07-17T15:20:00Z',
    details: 'Uploaded "Treasury Metal Commodity Broker Agreement.pdf" into Contracts'
  },
  {
    id: 'log-2',
    organizationId: 'org-al-noor',
    userId: 'user-admin',
    userName: 'Ahmed Al-Mansoori',
    userRole: 'ORGANIZATION ADMIN',
    action: 'UPDATE_POLICY',
    timestamp: '2026-07-17T14:15:00Z',
    details: 'Updated terms on "Ethical Investment Policy" to match AAOIFI 2026 modifications'
  },
  {
    id: 'log-3',
    organizationId: 'org-al-noor',
    userId: 'user-sharia',
    userName: 'Sheikh Dr. Ibrahim Al-Khaled',
    userRole: 'SHARIA REVIEWER',
    action: 'APPROVE_SOP',
    timestamp: '2026-07-17T11:05:00Z',
    details: 'Reviewed and electronically signed "Murabaha Financing SOP"'
  },
  {
    id: 'log-4',
    organizationId: 'org-al-noor',
    userId: 'user-compliance',
    userName: 'Fatima Al-Sayed',
    userRole: 'COMPLIANCE OFFICER',
    action: 'CREATE_RULE',
    timestamp: '2026-07-16T17:00:00Z',
    details: 'Configured Custom Compliance Rule: Interest Income Purification Check'
  }
];

// Initial Notifications
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-1',
    organizationId: 'org-al-noor',
    title: 'New Policy Uploaded',
    message: 'Fatima Al-Sayed uploaded "Treasury Metal Commodity Broker Agreement.pdf" awaiting review.',
    status: 'Unread',
    createdAt: '2026-07-17T15:20:00Z'
  },
  {
    id: 'not-2',
    organizationId: 'org-al-noor',
    title: 'Compliance Deviation Cleared',
    message: 'Audit findings on Murabaha deal #994 verified and certified by Sheikh Dr. Ibrahim Al-Khaled.',
    status: 'Unread',
    createdAt: '2026-07-17T11:10:00Z'
  },
  {
    id: 'not-3',
    organizationId: 'org-al-noor',
    title: 'Database Sync Success',
    message: 'Odoo and ERPNext compliance adapters successfully fetched latest transaction batch.',
    status: 'Read',
    createdAt: '2026-07-17T08:00:00Z'
  }
];

// ==========================================
// ERP INTEGRATION DEMO DATA
// ==========================================

import {
  Integration,
  ErpConnector,
  SyncJob,
  SyncLog,
  DataMapping,
  ErpCustomer,
  ErpVendor,
  ErpInvoice,
  ErpPayment,
  ErpJournalEntry,
  ErpAccount,
  ErpAsset,
  ErpEmployee,
  ErpContract
} from './types';

export const DEMO_ERP_CONNECTORS: ErpConnector[] = [
  {
    id: 'odoo',
    name: 'Odoo ERP Adapter',
    type: 'API',
    supportedModules: ['Accounting', 'Sales (Customers)', 'Purchases (Vendors)', 'Invoices', 'Inventory'],
    version: 'v4.2.0',
    description: 'Direct JSON-RPC connection to Odoo server models with instant schema parsing.',
    logo: '🟣'
  },
  {
    id: 'sap',
    name: 'SAP S/4HANA Connector',
    type: 'API',
    supportedModules: ['Finance (GL)', 'Procurement', 'Fixed Assets', 'Contracts', 'Payments'],
    version: 'v1.12.3',
    description: 'Enterprise REST/SOAP endpoint integrator with parallel ledger mapping.',
    logo: '🔵'
  },
  {
    id: 'oracle',
    name: 'Oracle ERP Cloud',
    type: 'Database',
    supportedModules: ['General Ledger', 'Accounts Payable', 'Fixed Assets', 'Employees'],
    version: 'v9.4.1',
    description: 'Secure JDBC/SQL encrypted pipeline for continuous transactional audit.',
    logo: '🔴'
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    type: 'API',
    supportedModules: ['Finance', 'Supply Chain', 'Sales', 'Assets', 'Contracts'],
    version: 'v3.1.0',
    description: 'Microsoft Dataverse OData gateway linking entity records in real-time.',
    logo: '🟢'
  },
  {
    id: 'erpnext',
    name: 'ERPNext Sharia',
    type: 'Webhook',
    supportedModules: ['Murabaha Ledger', 'Accounts', 'Sales Invoice', 'Purchases', 'Employees'],
    version: 'v2.0.5',
    description: 'Specialized Islamic ledger webhooks firing events upon stock receipt & sales.',
    logo: '🔵'
  },
  {
    id: 'netsuite',
    name: 'NetSuite SuiteTalk',
    type: 'API',
    supportedModules: ['Accounting', 'Billing', 'Vendors', 'Invoices', 'Contracts'],
    version: 'v1.0.8',
    description: 'SuiteTalk REST Web Services connecting cloud ledger segments instantly.',
    logo: '🟠'
  },
  {
    id: 'custom',
    name: 'Custom CSV/Excel Broker',
    type: 'File',
    supportedModules: ['Any Spreadsheet', 'XML Ledgers', 'JSON Dumps'],
    version: 'v5.0.1',
    description: 'Upload flat-file reports directly to match ICAP canonical fields.',
    logo: '⚙️'
  }
];

export const DEMO_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    organizationId: 'org-al-noor',
    type: 'odoo',
    name: 'Al Noor Corporate Odoo',
    status: 'Connected',
    credentials: {
      apiUrl: 'https://odoo.alnoor-finance.com:8069',
      username: 'admin_compliance',
      dbName: 'alnoor_prod',
      environment: 'Production'
    },
    createdAt: '2024-05-12T10:00:00Z'
  },
  {
    id: 'int-2',
    organizationId: 'org-al-noor',
    type: 'erpnext',
    name: 'Dar Al-Rayan ERPNext Integration',
    status: 'Connected',
    credentials: {
      apiUrl: 'https://erpnext.rayanretail.ae',
      apiKey: 'usr_8df3f2d29f8f30d22384a',
      environment: 'Production'
    },
    createdAt: '2025-02-14T08:30:00Z'
  },
  {
    id: 'int-3',
    organizationId: 'org-al-noor',
    type: 'dynamics',
    name: 'MS Dynamics 365 Sandbox',
    status: 'Pending',
    credentials: {
      apiUrl: 'https://alnoor-sandbox.sandbox.operations.dynamics.com',
      environment: 'Sandbox'
    },
    createdAt: '2026-06-20T11:15:00Z'
  }
];

export const DEMO_SYNC_LOGS: SyncLog[] = [
  {
    id: 'log-sync-1',
    syncJobId: 'job-100',
    records: 467500,
    errors: 0,
    duration: '14.5s',
    systemName: 'Al Noor Corporate Odoo',
    date: '2026-07-17 10:30:00',
    status: 'Success',
    details: 'Fetched 2,500 Customers, 15,000 Invoices, and 450,000 Journal Entries. Checked interest-purification mappings successfully.'
  },
  {
    id: 'log-sync-2',
    syncJobId: 'job-101',
    records: 23140,
    errors: 4,
    duration: '8.2s',
    systemName: 'Dar Al-Rayan ERPNext Integration',
    date: '2026-07-17 09:15:00',
    status: 'Partial',
    details: 'Fetched 1,200 Accounts, 18,500 Journal Entries, and 3,440 Payments. 4 entries failed structural constraints (Missing Account Codes).'
  },
  {
    id: 'log-sync-3',
    syncJobId: 'job-102',
    records: 0,
    errors: 1,
    duration: '2.1s',
    systemName: 'MS Dynamics 365 Sandbox',
    date: '2026-07-16 16:40:00',
    status: 'Failed',
    details: 'Authentication Failure: Invalid OAuth Access Token. Credentials validation rejected.'
  },
  {
    id: 'log-sync-4',
    syncJobId: 'job-103',
    records: 12500,
    errors: 0,
    duration: '5.6s',
    systemName: 'Al Noor Corporate Odoo',
    date: '2026-07-16 10:30:00',
    status: 'Success',
    details: 'Regular daily synchronization. Synchronized 12,500 invoice records and stock receipts.'
  }
];

export const DEMO_DATA_MAPPINGS: DataMapping[] = [
  // Odoo Maps
  { id: 'map-1', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'partner_name', targetField: 'customer.name', customTransformation: 'TitleCase()' },
  { id: 'map-2', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'partner_email', targetField: 'customer.email' },
  { id: 'map-3', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'amount_total', targetField: 'invoice.amount' },
  { id: 'map-4', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'invoice_date', targetField: 'invoice.date' },
  { id: 'map-5', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'account_code', targetField: 'account.accountCode' },
  { id: 'map-6', organizationId: 'org-al-noor', erpType: 'odoo', sourceField: 'late_fee_type', targetField: 'journal_entry.description', customTransformation: "Prefix('LATE_PENALTY: ')" },

  // SAP Maps
  { id: 'map-7', organizationId: 'org-al-noor', erpType: 'sap', sourceField: 'KUNNR', targetField: 'customer.externalId' },
  { id: 'map-8', organizationId: 'org-al-noor', erpType: 'sap', sourceField: 'NAME1', targetField: 'customer.name' },
  { id: 'map-9', organizationId: 'org-al-noor', erpType: 'sap', sourceField: 'DMBTR', targetField: 'invoice.amount' },
  { id: 'map-10', organizationId: 'org-al-noor', erpType: 'sap', sourceField: 'BUKRS', targetField: 'account.accountCode' }
];

export interface ErpErrorRecord {
  id: string;
  errorType: string;
  record: string;
  reason: string;
  solution: string;
  status: 'Open' | 'Resolved' | 'Ignored';
  systemName: string;
}

export const DEMO_ERP_ERRORS: ErpErrorRecord[] = [
  {
    id: 'err-1',
    errorType: 'Missing Account Code',
    record: 'Invoice INV-2026-9041 (Amount: $12,450)',
    reason: 'The imported ledger entry does not assign a structural general ledger Account Code.',
    solution: 'Verify and map Odoo model "account.move.line" fields or add account code in Odoo billing ledger.',
    status: 'Open',
    systemName: 'Al Noor Corporate Odoo'
  },
  {
    id: 'err-2',
    errorType: 'Unmapped Late Fee Term',
    record: 'Payment PAY-98441 (Amount: $300)',
    reason: 'Payment record tagged with "late_payment_charge" lacks a corresponding Purification Rule route.',
    solution: 'Map "late_payment_charge" source fields to ICAP Purification Ledger under AAOIFI Standard No. 8.',
    status: 'Open',
    systemName: 'Dar Al-Rayan ERPNext Integration'
  },
  {
    id: 'err-3',
    errorType: 'Invalid Currency Code',
    record: 'Customer Ledger CUST-01290 (AED)',
    reason: 'The currency code AED was rejected by the strict corporate ledger validator.',
    solution: 'Define multi-currency standards in the main Compliance Configuration page.',
    status: 'Resolved',
    systemName: 'Dar Al-Rayan ERPNext Integration'
  }
];

// Canonical sample items for dashboard preview
export const CANONICAL_CUSTOMERS: ErpCustomer[] = [
  { id: 'c-1', organizationId: 'org-al-noor', externalId: 'CUST-1002', name: 'Al-Bilad Retail Partners', email: 'billing@albilad-retail.com', phone: '+966 11 940 1022', country: 'Saudi Arabia', type: 'Corporate' },
  { id: 'c-2', organizationId: 'org-al-noor', externalId: 'CUST-3904', name: 'Khalid Al-Gosaibi Holding', email: 'accounts@gosaibi-holding.com', phone: '+966 13 883 4958', country: 'Saudi Arabia', type: 'Institutional' },
  { id: 'c-3', organizationId: 'org-al-noor', externalId: 'CUST-8839', name: 'Faisal Mohammed Abdul-Sami', email: 'faisal.sami@gmail.com', phone: '+971 50 203 1049', country: 'United Arab Emirates', type: 'Retail' }
];

export const CANONICAL_VENDORS: ErpVendor[] = [
  { id: 'v-1', organizationId: 'org-al-noor', externalId: 'VEND-0091', name: 'London Metal Exchange Brokers Ltd', category: 'Commodity Brokerage', country: 'United Kingdom' },
  { id: 'v-2', organizationId: 'org-al-noor', externalId: 'VEND-0841', name: 'Zamil Steel Industries', category: 'Infrastructure & Real Estate', country: 'Saudi Arabia' }
];

export const CANONICAL_INVOICES: ErpInvoice[] = [
  { id: 'inv-1', organizationId: 'org-al-noor', externalId: 'INV-10931', invoiceNumber: 'ALN-2026-0041', customerId: 'CUST-1002', amount: 154000, currency: 'USD', date: '2026-07-15', status: 'Paid' },
  { id: 'inv-2', organizationId: 'org-al-noor', externalId: 'INV-20912', invoiceNumber: 'ALN-2026-0922', customerId: 'CUST-3904', amount: 840000, currency: 'SAR', date: '2026-07-16', status: 'Sent' }
];

export const CANONICAL_PAYMENTS: ErpPayment[] = [
  { id: 'pay-1', organizationId: 'org-al-noor', externalId: 'PAY-44021', amount: 154000, currency: 'USD', paymentDate: '2026-07-15', paymentMethod: 'Islamic Wire (Murabaha Trade)' }
];

export const CANONICAL_JOURNAL_ENTRIES: ErpJournalEntry[] = [
  { id: 'je-1', organizationId: 'org-al-noor', externalId: 'JE-009410', account: '110200 - Murabaha Financing Assets', debit: 154000, credit: 0, date: '2026-07-15', description: 'Initial Murabaha physical asset acquisition' },
  { id: 'je-2', organizationId: 'org-al-noor', externalId: 'JE-009411', account: '320400 - Sharia Purification Holding Ledger', debit: 0, credit: 750, date: '2026-07-15', description: 'Purification diversion of transaction interest coupon' }
];

export const CANONICAL_ACCOUNTS: ErpAccount[] = [
  { id: 'acc-1', organizationId: 'org-al-noor', accountCode: '110200', accountName: 'Murabaha Financing Assets', category: 'Asset' },
  { id: 'acc-2', organizationId: 'org-al-noor', accountCode: '320400', accountName: 'Sharia Purification Holding Ledger', category: 'Liability' }
];

export const CANONICAL_ASSETS: ErpAsset[] = [
  { id: 'ast-1', organizationId: 'org-al-noor', name: 'LME Aluminium Storage Serials #1209-A', value: 150000, purchaseDate: '2026-07-15', depreciation: 0 }
];

export const CANONICAL_EMPLOYEES: ErpEmployee[] = [
  { id: 'emp-1', organizationId: 'org-al-noor', name: 'Fatima Al-Sayed', department: 'Compliance & Legal', position: 'Head of Sharia Compliance' }
];

export const CANONICAL_CONTRACTS: ErpContract[] = [
  { id: 'con-1', organizationId: 'org-al-noor', title: 'London Metal Exchange Master Murabaha Deed', vendor: 'London Metal Exchange Brokers Ltd', startDate: '2026-01-01', endDate: '2027-12-31', status: 'Active' }
];

