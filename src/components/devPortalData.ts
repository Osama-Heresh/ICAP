// ICAP Developer Portal Data & Documentation
import { MarketplaceConnector } from '../types';

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Organization' | 'Customer' | 'Vendor' | 'Financial' | 'Compliance' | 'Document';
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  authRequired: boolean;
  exampleRequest?: string;
  exampleResponse: string;
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'get-org',
    method: 'GET',
    path: '/organizations/{id}',
    category: 'Organization',
    description: 'Retrieve general ledger profiles, registration status, and compliance metadata for a registered Islamic enterprise.',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'SaaS tenant organization ID (e.g., org-al-noor).' }
    ],
    authRequired: true,
    exampleResponse: JSON.stringify({
      id: "org-al-noor",
      name: "Al Noor Islamic Finance Group",
      industry: "Islamic Finance",
      country: "Saudi Arabia",
      subscriptionStatus: "Active",
      businessType: "Islamic Banking & Assets",
      primaryActivity: "AAOIFI Sharia Auditing & Retail Finance",
      registeredAt: "2024-01-15T08:00:00Z"
    }, null, 2)
  },
  {
    id: 'get-customers',
    method: 'GET',
    path: '/customers',
    category: 'Customer',
    description: 'Fetch list of retail and corporate customers associated with the general ledgers.',
    parameters: [
      { name: 'limit', type: 'number', required: false, description: 'Maximum number of records (default: 50).' },
      { name: 'type', type: 'string', required: false, description: 'Filter by Retail, Corporate, or Institutional.' }
    ],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { id: "c-1", name: "Al Rayan Real Estate", email: "finance@alrayan.com", country: "United Arab Emirates", type: "Corporate" },
      { id: "c-2", name: "Yasser Mansoor", email: "yasser@mansoor.net", country: "Saudi Arabia", type: "Retail" }
    ], null, 2)
  },
  {
    id: 'post-customer',
    method: 'POST',
    path: '/customers',
    category: 'Customer',
    description: 'Register a new customer profile into the integrated ledger database.',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Legal name of the entity/person.' },
      { name: 'email', type: 'string', required: true, description: 'Contact email address.' },
      { name: 'country', type: 'string', required: true, description: 'Country of residence/incorporation.' },
      { name: 'type', type: 'string', required: true, description: 'Retail, Corporate, or Institutional.' }
    ],
    authRequired: true,
    exampleRequest: JSON.stringify({
      name: "Al-Futtaim Sharia Fund",
      email: "capital@alfuttaim.ae",
      country: "United Arab Emirates",
      type: "Institutional"
    }, null, 2),
    exampleResponse: JSON.stringify({
      success: true,
      id: "c-104",
      name: "Al-Futtaim Sharia Fund",
      status: "Registered",
      createdAt: "2026-07-17T16:04:00Z"
    }, null, 2)
  },
  {
    id: 'get-vendors',
    method: 'GET',
    path: '/vendors',
    category: 'Vendor',
    description: 'Fetch a list of external vendors and suppliers for compliance risk screening.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { id: "v-1", name: "Halal Global Logistics", category: "Supply Chain", country: "Malaysia" },
      { id: "v-2", name: "Apex Commercial Tech", category: "Software Licensing", country: "United Kingdom" }
    ], null, 2)
  },
  {
    id: 'post-vendor',
    method: 'POST',
    path: '/vendors',
    category: 'Vendor',
    description: 'Insert a vendor profile for ongoing transaction vetting.',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Supplier company name.' },
      { name: 'category', type: 'string', required: true, description: 'Category classification.' },
      { name: 'country', type: 'string', required: true, description: 'Vendor country.' }
    ],
    authRequired: true,
    exampleRequest: JSON.stringify({
      name: "Standard Islamic Tech",
      category: "IT Infrastructure",
      country: "Bahrain"
    }, null, 2),
    exampleResponse: JSON.stringify({
      success: true,
      id: "v-87",
      name: "Standard Islamic Tech",
      status: "Screening_Approved"
    }, null, 2)
  },
  {
    id: 'get-invoices',
    method: 'GET',
    path: '/invoices',
    category: 'Financial',
    description: 'Extract standard Murabaha or general invoices and trade contracts.',
    parameters: [
      { name: 'currency', type: 'string', required: false, description: 'SAR, AED, KWD, USD.' },
      { name: 'status', type: 'string', required: false, description: 'Draft, Sent, Paid, Overdue.' }
    ],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { invoiceNumber: "INV-10025", amount: 5000, currency: "SAR", customerId: "c-1", status: "Paid", date: "2026-07-15" },
      { invoiceNumber: "INV-10026", amount: 12000, currency: "SAR", customerId: "c-2", status: "Sent", date: "2026-07-16" }
    ], null, 2)
  },
  {
    id: 'get-payments',
    method: 'GET',
    path: '/payments',
    category: 'Financial',
    description: 'Query disbursements and revenue collections to check purification of late fees.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { id: "pay-401", amount: 5000, currency: "SAR", paymentDate: "2026-07-15", paymentMethod: "Mada Bank Transfer" }
    ], null, 2)
  },
  {
    id: 'get-journal-entries',
    method: 'GET',
    path: '/journal-entries',
    category: 'Financial',
    description: 'Fetch general ledger journal adjustments for automated asset sequencing validation.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { id: "je-901", account: "1102 - Inventory Asset", debit: 120000, credit: 0, date: "2026-07-10", description: "Acquisition of commodity under Murabaha No. 54" },
      { id: "je-902", account: "1201 - Accounts Receivable", debit: 0, credit: 120000, date: "2026-07-11", description: "Commodity delivery transfer to Al-Futtaim" }
    ], null, 2)
  },
  {
    id: 'get-compliance-score',
    method: 'GET',
    path: '/compliance-score',
    category: 'Compliance',
    description: 'Request real-time AAOIFI compliance score rating and statistical indices.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify({
      score: 95.8,
      rating: "A+ Sharia Compliant",
      auditedSystemsCount: 5,
      activeRulesChecked: 142,
      lastAuditTimestamp: "2026-07-17T15:30:00Z"
    }, null, 2)
  },
  {
    id: 'get-findings',
    method: 'GET',
    path: '/findings',
    category: 'Compliance',
    description: 'List compliance warnings, non-sharia activities, and high-interest flags.',
    parameters: [
      { name: 'severity', type: 'string', required: false, description: 'high, medium, low.' }
    ],
    authRequired: true,
    exampleResponse: JSON.stringify([
      {
        id: "fnd-202",
        standardId: "AAOIFI-No-8",
        severity: "high",
        title: "Forbidden Late Payment Penalty Ledger Account",
        details: "Riba-suspect penalty charge applied without diversion to purification charity channel.",
        status: "Active"
      }
    ], null, 2)
  },
  {
    id: 'get-recommendations',
    method: 'GET',
    path: '/recommendations',
    category: 'Compliance',
    description: 'Retrieve AI-generated remediation protocols to resolve existing governance exceptions.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify([
      {
        id: "rec-801",
        title: "Revise Murabaha Purchase Contract Clause 9",
        description: "Replace standard compounding interest with an unconditional unilateral promise to pay charity.",
        shariaBasis: "AAOIFI Standard No. 8, Clause 5/2"
      }
    ], null, 2)
  },
  {
    id: 'post-upload-doc',
    method: 'POST',
    path: '/documents/upload',
    category: 'Document',
    description: 'Upload regulatory documents, trade sheets, or fatwas for compliance inspection.',
    parameters: [
      { name: 'fileName', type: 'string', required: true, description: 'Target file name (e.g. fatwa_financing.pdf).' },
      { name: 'documentType', type: 'string', required: true, description: 'Type: Contract, Policy, SOP, Fatwa.' }
    ],
    authRequired: true,
    exampleRequest: JSON.stringify({
      fileName: "murabaha_deal_99_signed.pdf",
      documentType: "Contract"
    }, null, 2),
    exampleResponse: JSON.stringify({
      success: true,
      documentId: "doc-543",
      hash: "sha256-a9f3c8b4...",
      processingJobId: "job-801",
      status: "Queued"
    }, null, 2)
  },
  {
    id: 'get-documents',
    method: 'GET',
    path: '/documents',
    category: 'Document',
    description: 'Query status and metadata of uploaded Islamic finance documents.',
    parameters: [],
    authRequired: true,
    exampleResponse: JSON.stringify([
      { id: "doc-543", name: "murabaha_deal_99_signed.pdf", type: "Contract", status: "Fully_Approved", complianceGrade: "Pass" }
    ], null, 2)
  }
];

export const MOCK_DEVELOPER_APPLICATIONS = [
  {
    id: 'app-odoo',
    organizationId: 'org-al-noor',
    name: 'Odoo Connector',
    description: 'Automated synchronizer that maps invoices, sales ledgers, and journals from Odoo direct instances.',
    developerName: 'Amir Sharia-Tech Solutions',
    company: 'Sharia-Tech Solutions Ltd',
    website: 'https://shariatech.example.com',
    contactEmail: 'amir@shariatech.example.com',
    applicationType: 'ERP Connector' as const,
    clientId: 'cli_odoo_0x8273948293',
    clientSecret: 'sec_98f8b8e8f810134f783cb2b1156822a1',
    status: 'Approved' as const,
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'app-findash',
    organizationId: 'org-al-noor',
    name: 'Financial Dashboard Connector',
    description: 'Read-only pipeline exporting Sharia performance metrics and audits to client administrative screens.',
    developerName: 'Zayd Al-Hassan',
    company: 'Dar Al-Rayan Tech',
    website: 'https://daralrayan.example.com',
    contactEmail: 'zayd@daralrayan.example.com',
    applicationType: 'Integration' as const,
    clientId: 'cli_findash_0x192837465',
    clientSecret: 'sec_7cf10be8764032d88fa77610191aa891',
    status: 'Approved' as const,
    createdAt: '2026-03-12T14:15:00Z'
  },
  {
    id: 'app-custom-audit',
    organizationId: 'org-al-noor',
    name: 'Custom Audit Tool',
    description: 'Internal analytical sandbox to batch upload Islamic microfinance contracts for automated Fatwa mapping.',
    developerName: 'ICAP Integration Partner',
    company: 'Islamic Compliance Partners Inc',
    website: 'https://compliancepartners.example.com',
    contactEmail: 'devs@compliancepartners.example.com',
    applicationType: 'Custom Application' as const,
    clientId: 'cli_audit_0x7728348912',
    clientSecret: 'sec_10af89aef021817c7678129011afb9a2',
    status: 'Approved' as const,
    createdAt: '2026-05-02T09:40:00Z'
  }
];

export const MOCK_API_KEYS = [
  {
    id: 'key-1',
    applicationId: 'app-odoo',
    keyName: 'ERP Connector Production Key',
    apiKey: 'icap_live_0x9a8b7c6d5e4f3g2h1i0j_99a8b7',
    permissions: ['read:customers', 'read:financials', 'write:documents'],
    createdAt: '2026-01-20T10:10:00Z',
    lastUsed: '2026-07-17T15:42:00Z',
    status: 'Active' as const
  },
  {
    id: 'key-2',
    applicationId: 'app-findash',
    keyName: 'Dashboard Read-Only Token',
    apiKey: 'icap_live_0x1a2b3c4d5e6f7g8h9i0j_bcde12',
    permissions: ['read:compliance', 'read:financials'],
    createdAt: '2026-03-12T14:20:00Z',
    lastUsed: '2026-07-17T13:10:00Z',
    status: 'Active' as const
  },
  {
    id: 'key-3',
    applicationId: 'app-custom-audit',
    keyName: 'Legacy Test Sandbox Key',
    apiKey: 'icap_test_0x5f4e3d2c1b0a9f8e7d6c_deff01',
    permissions: ['read:customers', 'write:documents', 'read:compliance'],
    createdAt: '2026-05-02T09:45:00Z',
    lastUsed: '2026-06-11T16:00:00Z',
    status: 'Revoked' as const
  }
];

export const MOCK_API_LOGS = [
  { id: 'l-1', applicationId: 'app-odoo', endpoint: '/api/v1/invoices', method: 'GET' as const, timestamp: '2026-07-17T15:42:00Z', status: 200, responseTime: 124 },
  { id: 'l-2', applicationId: 'app-odoo', endpoint: '/api/v1/customers', method: 'GET' as const, timestamp: '2026-07-17T15:40:00Z', status: 200, responseTime: 82 },
  { id: 'l-3', applicationId: 'app-findash', endpoint: '/api/v1/compliance-score', method: 'GET' as const, timestamp: '2026-07-17T13:10:00Z', status: 200, responseTime: 245 },
  { id: 'l-4', applicationId: 'app-odoo', endpoint: '/api/v1/documents/upload', method: 'POST' as const, timestamp: '2026-07-17T12:05:00Z', status: 201, responseTime: 310 },
  { id: 'l-5', applicationId: 'app-custom-audit', endpoint: '/api/v1/recommendations', method: 'GET' as const, timestamp: '2026-07-17T11:55:00Z', status: 401, responseTime: 12, errorMessage: 'API Key Revoked' },
  { id: 'l-6', applicationId: 'app-odoo', endpoint: '/api/v1/invoices', method: 'GET' as const, timestamp: '2026-07-17T11:40:00Z', status: 429, responseTime: 18, errorMessage: 'Rate Limit Exceeded (100 req/min)' },
  { id: 'l-7', applicationId: 'app-findash', endpoint: '/api/v1/findings', method: 'GET' as const, timestamp: '2026-07-17T10:15:00Z', status: 200, responseTime: 95 }
];

export const MOCK_WEBHOOKS = [
  { id: 'wh-1', organizationId: 'org-al-noor', url: 'https://shariatech.example.com/api/icap-webhook', event: 'compliance.finding.created' as const, secret: 'whsec_9918273645a3', status: 'Active' as const, createdAt: '2026-01-22T08:00:00Z' },
  { id: 'wh-2', organizationId: 'org-al-noor', url: 'https://compliancepartners.example.com/webhooks/receive', event: 'sync.completed' as const, secret: 'whsec_cc00bb11aa22', status: 'Active' as const, createdAt: '2026-05-02T10:00:00Z' },
  { id: 'wh-3', organizationId: 'org-al-noor', url: 'https://my-billing-system.com/webhook', event: 'certificate.issued' as const, secret: 'whsec_8877112233aa', status: 'Inactive' as const, createdAt: '2026-06-15T12:30:00Z' }
];

export const INITIAL_MARKETPLACE_CONNECTORS: MarketplaceConnector[] = [
  {
    id: 'conn-odoo',
    name: 'Odoo Connector',
    provider: 'ICAP Official',
    version: '1.0',
    status: 'Installed',
    supportedERP: 'Odoo v15, v16, v17 Enterprise',
    description: 'Fully certified, native adapter that automates real-time Murabaha tracking, purchase sequencing, and charity purification accounting.',
    rating: 4.9,
    logo: '🟣',
    price: 'Free'
  },
  {
    id: 'conn-sap',
    name: 'SAP Fiori Connector',
    provider: 'Certified Partner',
    version: '2.4',
    status: 'Available',
    supportedERP: 'SAP S/4HANA Finance Cloud',
    description: 'Enterprise integration bridge connecting SAP General Ledgers and Accounts Receivable directly to the ICAP continuous compliance auditor.',
    rating: 4.7,
    logo: '🔵',
    price: '$299/mo'
  },
  {
    id: 'conn-erpnext',
    name: 'ERPNext Sharia Adapter',
    provider: 'Islamic Compliance Partners',
    version: '1.2',
    status: 'Installed',
    supportedERP: 'ERPNext v13, v14, v15',
    description: 'An open-source adapter offering automated journal entry mappings conforming to AAOIFI sharia auditing standards.',
    rating: 4.5,
    logo: '🟢',
    price: 'Free'
  },
  {
    id: 'conn-oracle',
    name: 'Oracle Financials Sync',
    provider: 'Verified Developer',
    version: '1.0.8',
    status: 'Available',
    supportedERP: 'Oracle Fusion Cloud Financials',
    description: 'Direct transaction vault sync for high-volume corporate Islamic institutions with absolute data integrity and audit logging.',
    rating: 4.8,
    logo: '🔴',
    price: '$450/mo'
  }
];

export const MOCK_SUBMISSIONS = [
  {
    id: 'sub-1',
    name: 'Dynamics 365 Sharia Sync',
    description: 'Syncs Dynamics 365 general ledger entries with the purification checking module.',
    erpSupported: 'Microsoft Dynamics 365 Finance',
    documentation: 'https://github.com/shariatech/dynamics-connector-icap',
    version: '1.0.0',
    testingInfo: 'Successfully tested inside Al-Baraka Bank sandbox environments with over 100,000 ledger lines.',
    status: 'Technical Review' as const,
    createdAt: '2026-07-10T14:30:00Z'
  },
  {
    id: 'sub-2',
    name: 'NetSuite Islamic Leasing (Ijarah)',
    description: 'Direct pipeline importing lease contracts, payment terms, and ownership transfer covenants.',
    erpSupported: 'Oracle NetSuite ERP',
    documentation: 'https://docs.netsuite.ijarah.com',
    version: '0.9.5',
    testingInfo: 'Passed basic schema validation. Simulated with 50 signed rent contracts.',
    status: 'Submitted' as const,
    createdAt: '2026-07-16T11:20:00Z'
  }
];

export const SDK_INSTALL_DOCS = {
  javascript: `// Install via npm
npm install @icap/sdk

// Or via yarn
yarn add @icap/sdk`,
  python: `# Install via pip
pip install icap-sdk`,
  php: `# Install via composer
composer require icap/sdk`,
  java: `<!-- Add dependency in pom.xml -->
<dependency>
    <groupId>com.icap</groupId>
    <artifactId>icap-sdk</artifactId>
    <version>1.0.0</version>
</dependency>`
};

export const SDK_AUTH_DOCS = {
  javascript: `import { ICAPClient } from '@icap/sdk';

// Initialize the client securely
const icap = new ICAPClient({
  apiKey: 'YOUR_API_KEY_HERE',
  environment: 'production' // optional: sandbox
});`,
  python: `from icap_sdk import ICAPClient

# Initialize the client securely
icap = ICAPClient(
    api_key="YOUR_API_KEY_HERE",
    environment="production"
)`,
  php: `<?php
require_once 'vendor/autoload.php';

use ICAP\\SDK\\ICAPClient;

// Initialize client
$icap = new ICAPClient([
    'apiKey' => 'YOUR_API_KEY_HERE',
    'environment' => 'production'
]);`,
  java: `import com.icap.sdk.ICAPClient;

// Initialize client
ICAPClient icap = new ICAPClient("YOUR_API_KEY_HERE");`
};

export const SDK_METHODS_DOCS = {
  javascript: `// Retrieve customers
const customers = await icap.getCustomers();

// Retrieve invoices
const invoices = await icap.getInvoices();

// Retrieve payments
const payments = await icap.getPayments();

// Query journal entries
const journals = await icap.getJournalEntries();

// Upload document for Sharia check
const response = await icap.uploadDocument('./contracts/deal_99.pdf', 'Contract');
console.log('Document ID:', response.documentId);

// Fetch real-time compliance score
const compliance = await icap.getComplianceScore();
console.log('Current Score:', compliance.score);

// Retrieve active findings
const findings = await icap.getFindings({ severity: 'high' });`,
  python: `# Retrieve customers
customers = icap.get_customers()

# Retrieve invoices
invoices = icap.get_invoices()

# Upload document
response = icap.upload_document(
    file_path="./contracts/deal_99.pdf",
    doc_type="Contract"
)
print(f"Uploaded: {response['documentId']}")

# Get compliance summary
score_info = icap.get_compliance_score()`,
  php: `// Retrieve customers
$customers = $icap->getCustomers();

// Upload document
$response = $icap->uploadDocument('./contracts/deal_99.pdf', 'Contract');`,
  java: `// Retrieve customers
List<Customer> customers = icap.getCustomers();

// Get compliance score
ComplianceScore score = icap.getComplianceScore();`
};
