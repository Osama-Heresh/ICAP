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
  LeadStage,
  CLTaskStatus,
  CLTaskApproval
} from './clsdTypes';

// A deterministic helper pseudo-random generator so the data is stable and looks organic
class SeededRandom {
  private seed: number;
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  choose<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  chooseMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, count);
  }
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

const rng = new SeededRandom(198904);

// GCC Arabic & Islamic-themed Companies
const BASE_COMPANY_NAMES = [
  'Al Rajhi Bank', 'Saudi National Bank (SNB)', 'Abu Dhabi Islamic Bank (ADIB)',
  'Dubai Islamic Bank (DIB)', 'Kuwait Finance House (KFH)', 'Qatar Islamic Bank (QIB)',
  'Bahrain Islamic Bank (BisB)', 'Bank Nizwa (Oman)', 'Rayan Investment Group',
  'Noor Takaful Insurance', 'Dar Al Takaful', 'Gulf Investment House',
  'Boubyan Bank', 'Warba Bank', 'Masraf Al Rayan', 'Barwa Real Estate',
  'Amlak Finance', 'Emaar Properties (Sharia Div)', 'Aramco Sharia Compliance Office',
  'SABIC Halal Logistics', 'Jabal Omar Development', 'Aldar Properties PJSC',
  'Deyaar Development', 'Islamic Development Bank (IsDB)', 'Meezan Bank GCC',
  'Kuwait International Bank', 'Al Baraka Banking Group', 'Ajman Bank',
  'Sharjah Islamic Bank', 'Alizz Islamic Bank'
];

const INDUSTRIES = [
  'Islamic Banking', 'Takaful Insurance', 'Islamic Asset Management',
  'Sharia FinTech', 'Halal Supply Chain', 'Sovereign Wealth Fund',
  'Sharia Microfinance', 'Real Estate Murabaha', 'Crypto Sharia Compliance',
  'Islamic REITs'
];

const GCC_COUNTRIES = [
  { name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Dammam'] },
  { name: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  { name: 'Kuwait', cities: ['Kuwait City', 'Hawally', 'Salmiya'] },
  { name: 'Qatar', cities: ['Doha', 'Al Wakrah'] },
  { name: 'Bahrain', cities: ['Manama', 'Riffa'] },
  { name: 'Oman', cities: ['Muscat', 'Sohar'] }
];

const FIRST_NAMES = [
  'Ahmed', 'Fatima', 'Mohammed', 'Ibrahim', 'Yousef', 'Zaid', 'Aisha', 'Tariq',
  'Abdulaziz', 'Sarah', 'Hamad', 'Reem', 'Waleed', 'Noura', 'Khaled', 'Yasmin',
  'Omar', 'Mariam', 'Sultan', 'Amal', 'Fahad', 'Laila', 'Bandar', 'Mona'
];

const LAST_NAMES = [
  'Al-Mansoori', 'Al-Sayed', 'Al-Khaled', 'Al-Ghamdi', 'Al-Harbi', 'Al-Fahad',
  'Al-Mubarak', 'Al-Rasheed', 'Al-Saud', 'Al-Sabah', 'Al-Thani', 'Al-Nayan',
  'Al-Hashimi', 'Al-Saleh', 'Al-Kouri', 'Al-Zaabi', 'Al-Haddad', 'Al-Suwaidi'
];

const JOB_TITLES = [
  'Head of Sharia Board', 'Chief Financial Officer', 'Director of Compliance',
  'Lead Sharia Auditor', 'VP of Operations', 'General Counsel', 'CTO',
  'Managing Director', 'Senior Risk Officer', 'Treasury Manager'
];

const PRODUCTS = [
  'Murabaha Finance Engine', 'Mudaraba Pool Dashboard', 'Sukuk Structuring Tool',
  'AAOIFI Compliance Auto-Audit', 'Zakat & Purification Calculator',
  'Takaful Reserve Screening Module', 'Halal Logistics Tracking Portal'
];

const EMPLOYEES = [
  { name: 'Ali Al-Mubarak', role: 'SUPER ADMIN' },
  { name: 'Ahmed Al-Mansoori', role: 'ORGANIZATION ADMIN' },
  { name: 'Fatima Al-Sayed', role: 'COMPLIANCE OFFICER' },
  { name: 'Johnathan Vance', role: 'AUDITOR' },
  { name: 'Sheikh Dr. Ibrahim Al-Khaled', role: 'SHARIA REVIEWER' },
  { name: 'Yousef Al-Ghamdi', role: 'EXECUTIVE USER' },
  { name: 'Zaid Al-Harbi', role: 'PARTNER' },
  { name: 'Tariq Al-Fahad', role: 'DEVELOPER' },
  // Additional CLSD specific personnel
  { name: 'Sari Al-Rayan', role: 'CUSTOMER SUCCESS MANAGER' },
  { name: 'Layla Al-Amri', role: 'SALES EXECUTIVE' },
  { name: 'Hani Shaker', role: 'PROJECT MANAGER' },
  { name: 'Bassam Al-Hadi', role: 'Consultant' },
  { name: 'Nour El-Eman', role: 'Compliance Officer' }
];

// GENERATE 25 COMPANIES
export const DEMO_COMPANIES: CLCompany[] = BASE_COMPANY_NAMES.map((name, index) => {
  const countryData = rng.choose(GCC_COUNTRIES);
  const city = rng.choose(countryData.cities);
  const employees = rng.range(50, 4500);
  const revenue = rng.range(2, 850) * 1000000;
  const statusList: ('Lead' | 'Opportunity' | 'Customer' | 'Inactive')[] = ['Lead', 'Opportunity', 'Customer'];
  const status = index < 8 ? 'Lead' : index < 15 ? 'Opportunity' : 'Customer';

  return {
    id: `comp-${100 + index}`,
    name,
    industry: rng.choose(INDUSTRIES),
    country: countryData.name,
    city,
    website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    employeesCount: employees,
    annualRevenue: revenue,
    status
  };
});

// GENERATE 80 CONTACTS (spread across 25 companies)
export const DEMO_CONTACTS: CLContact[] = [];
let contactIdCount = 1;
DEMO_COMPANIES.forEach((comp) => {
  const contactsForThisCompany = rng.range(2, 5); // 2 to 5 contacts per company guarantees > 80 total
  for (let i = 0; i < contactsForThisCompany; i++) {
    const first = rng.choose(FIRST_NAMES);
    const last = rng.choose(LAST_NAMES);
    const job = rng.choose(JOB_TITLES);
    const name = `${first} ${last}`;
    DEMO_CONTACTS.push({
      id: `con-${1000 + contactIdCount}`,
      companyId: comp.id,
      companyName: comp.name,
      name,
      jobTitle: job,
      phone: `+966 50 ${rng.range(100, 999)} ${rng.range(1000, 9999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      linkedIn: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase().replace(/[^a-z]/g, '')}`
    });
    contactIdCount++;
  }
});

// GENERATE 150 LEADS
const LEAD_SOURCES = ['Corporate Website', 'Sharia Board Referral', 'AAOIFI Conference Dubai', 'LinkedIn Campaign', 'Direct Outreach', 'Strategic Partner Referral'];
const LEAD_PRIORITIES: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
const STAGES: LeadStage[] = [
  'New Lead', 'Qualified', 'Meeting Scheduled', 'Demo Completed',
  'Proposal Sent', 'Negotiation', 'Waiting Decision', 'Won', 'Lost', 'Archived'
];

export const DEMO_LEADS: CLLead[] = [];
for (let i = 1; i <= 150; i++) {
  // Generate a mock company name for the leads that aren't converted yet, plus reuse some
  const customCompName = i <= 25 ? DEMO_COMPANIES[i - 1].name : `${rng.choose(BASE_COMPANY_NAMES)} Corp ${i}`;
  const countryData = rng.choose(GCC_COUNTRIES);
  const city = rng.choose(countryData.cities);
  const first = rng.choose(FIRST_NAMES);
  const last = rng.choose(LAST_NAMES);
  const contactName = `${first} ${last}`;
  const stage = STAGES[i % STAGES.length];
  const priority = LEAD_PRIORITIES[i % LEAD_PRIORITIES.length];

  DEMO_LEADS.push({
    id: `LED-${String(i).padStart(3, '0')}`,
    companyName: customCompName,
    industry: rng.choose(INDUSTRIES),
    country: countryData.name,
    city,
    website: `https://www.${customCompName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    employeesCount: rng.range(50, 2000),
    annualRevenue: rng.range(1, 200) * 1000000,
    contactPerson: contactName,
    jobTitle: rng.choose(JOB_TITLES),
    phone: `+966 5${rng.range(0, 9)} ${rng.range(100, 999)} ${rng.range(1000, 9999)}`,
    email: `${first.toLowerCase()}@${customCompName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    linkedIn: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
    source: rng.choose(LEAD_SOURCES),
    productsInterested: rng.chooseMultiple(PRODUCTS, rng.range(1, 3)),
    expectedBudget: rng.range(5, 75) * 10000,
    probability: stage === 'Won' ? 100 : stage === 'Lost' ? 0 : stage === 'Negotiation' ? 80 : stage === 'Proposal Sent' ? 60 : rng.range(10, 50),
    stage,
    assignedSalesExecutive: rng.choose(['Layla Al-Amri', 'Hussein Al-Zahrani']),
    nextFollowUpDate: new Date(Date.now() + rng.range(1, 15) * 86400000).toISOString().split('T')[0],
    priority,
    status: i % 10 === 0 ? 'Inactive' : 'Active',
    notes: `Interested in deploying automated compliance checking for standard retail portfolio. Focused heavily on Sharia board review speed-up.`,
    attachments: [`specification-doc-v2.pdf`, `security-architecture-v1.pdf`]
  });
}

// GENERATE 40 OPPORTUNITIES (subset of leads that are Qualified, Demo Completed, Proposal Sent, Negotiation, Waiting Decision, Won)
export const DEMO_OPPORTUNITIES: CLLead[] = DEMO_LEADS.filter(lead =>
  ['Qualified', 'Meeting Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Waiting Decision', 'Won'].includes(lead.stage)
).slice(0, 40);

// Ensure we have exactly 40 opportunities if the filter slice is smaller (let's override stages of the first 40 to guarantee >=40)
if (DEMO_OPPORTUNITIES.length < 40) {
  for (let i = 0; i < 40; i++) {
    DEMO_LEADS[i].stage = rng.choose(['Qualified', 'Meeting Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Waiting Decision']);
    DEMO_LEADS[i].probability = rng.range(40, 95);
  }
  // Refill
  DEMO_OPPORTUNITIES.length = 0;
  DEMO_OPPORTUNITIES.push(...DEMO_LEADS.filter(lead =>
    ['Qualified', 'Meeting Scheduled', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Waiting Decision', 'Won'].includes(lead.stage)
  ).slice(0, 40));
}

// GENERATE 100 MEETINGS / ACTIVITIES
const ACTIVITY_DESCRIPTIONS = [
  'Conducted introduction call explaining ICAP platform capabilities and GCC compliance vectors.',
  'Delivered deep-dive demonstration on AAOIFI audit automation and core ledger screening integrations.',
  'Followed up on custom pricing offer. The client requested a minor adjustments to consulting team on-site hours.',
  'Online call to review security architecture and tenant database isolation model.',
  'Sent updated commercial proposal v2 detailing technical support SLA and Sukuk structuring calculator fees.',
  'Conducted on-site discovery visit at primary retail operations center in Riyadh.',
  'Completed WhatsApp follow-up discussing Sharia Board validation times. Reassured them of our fast board co-signatures.',
  'Discussed draft SOW contract terms with legal team. Reached preliminary agreement on IP clauses.',
  'Client requested additional documents on previous certifications issued by our Sharia Board.',
  'Awaiting final sign-off on NDA. Legal departments have finalized all details.'
];

const OUTCOMES = [
  'Extremely positive feedback. Client scheduled a technical demo for next Wednesday.',
  'Security team satisfied with JWT-based compartmentalization and tenant isolation.',
  'Agreed to proceed with SOW signing. Draft contract is under executive review.',
  'Requested formal commercial quotation. Budget estimation sent for approval.',
  'Minor amendments requested for pricing tables. Version 1.3 dispatched.',
  'Discussions concluded. Client board is presenting Sukuk tool to Chairman for final signature.',
  'Reminder set for follow-up next Monday morning.'
];

export const DEMO_ACTIVITIES: CLActivity[] = [];
for (let i = 1; i <= 100; i++) {
  const company = rng.choose(DEMO_COMPANIES);
  const employee = rng.choose(EMPLOYEES);
  const type = rng.choose([
    'Phone Call', 'Email', 'Meeting', 'Online Meeting', 'Site Visit',
    'WhatsApp Conversation', 'Presentation', 'Demo', 'Proposal Sent',
    'Contract Discussion', 'Document Requested', 'Follow-up'
  ]) as any;

  DEMO_ACTIVITIES.push({
    id: `ACT-${20000 + i}`,
    date: new Date(Date.now() - rng.range(1, 60) * 86400000).toISOString().split('T')[0],
    time: `${String(rng.range(8, 17)).padStart(2, '0')}:${rng.choose(['00', '15', '30', '45'])}`,
    employeeName: employee.name,
    customerName: company.name,
    type,
    description: rng.choose(ACTIVITY_DESCRIPTIONS),
    files: rng.next() > 0.6 ? [`report_attachment_${i}.pdf`] : [],
    outcome: rng.choose(OUTCOMES),
    nextAction: 'Schedule subsequent proposal review call',
    reminder: rng.next() > 0.7 ? `Follow up on standard pricing in 3 days` : undefined
  });
}

// GENERATE 50 CONTRACTS
const CONTRACT_NAMES = [
  'Master Sharia Compliance Advisory SLA', 'SOW - Core System AAOIFI Audit Auto-Feed',
  'Mutual Non-Disclosure Agreement (MNDA)', 'Purchase Order - Sukuk Structuring Module',
  'Change Request #1 - Extra On-Site Trainer Days', 'SOW - Crypto Ledger Screening Service Agreement',
  'SOW - ERP Ledger Connector Configuration'
];

export const DEMO_CONTRACTS: CLContract[] = [];
for (let i = 1; i <= 50; i++) {
  const company = DEMO_COMPANIES[i % DEMO_COMPANIES.length];
  const type = rng.choose(['Service Agreement', 'Statement of Work', 'NDA', 'Purchase Order', 'Change Request']) as any;
  const status = i < 20 ? 'SIGNED' : i < 35 ? 'IN_REVIEW' : i < 45 ? 'AWAITING_SIGNATURE' : 'DRAFT';
  const val = rng.range(2, 60) * 5000;

  DEMO_CONTRACTS.push({
    id: `CON-${String(i).padStart(3, '0')}`,
    name: `${rng.choose(CONTRACT_NAMES)} (${company.name})`,
    companyName: company.name,
    type,
    value: val,
    signatureDate: status === 'SIGNED' ? new Date(Date.now() - rng.range(15, 120) * 86400000).toISOString().split('T')[0] : undefined,
    expiryDate: new Date(Date.now() + rng.range(90, 365) * 86400000).toISOString().split('T')[0],
    status,
    versions: [
      { version: 'v1.0', date: '2026-01-10', url: '#' },
      { version: 'v1.1', date: '2026-02-15', url: '#' }
    ],
    customerSignatures: status === 'SIGNED' ? [
      { name: `Sheikh ${rng.choose(FIRST_NAMES)} ${rng.choose(LAST_NAMES)}`, date: '2026-02-20', ip: `192.168.1.${rng.range(10, 250)}` }
    ] : [],
    internalApprovals: [
      { name: 'Ali Al-Mubarak', role: 'Platform Administrator', status: 'Approved' },
      { name: 'Ahmed Al-Mansoori', role: 'VP of Governance', status: 'Approved' }
    ]
  });
}

// GENERATE 20 ACTIVE PROJECTS (auto-spawned from the first 20 SIGNED contracts)
export const DEMO_PROJECTS: CLProject[] = [];
const PROJECT_MANAGERS = ['Hani Shaker', 'Sari Al-Rayan', 'Fahad Al-Qahtani'];

const TEMPLATE_TASKS_POOL = {
  'Enterprise Compliance': [
    { title: 'Project Kickoff & Requirements Alignment', role: 'Project Manager', hrs: 8 },
    { title: 'AAOIFI Standard Mapping & Framework Modeling', role: 'Consultant', hrs: 24 },
    { title: 'Screening Logic Validation & Test Transactions', role: 'Compliance Officer', hrs: 40 },
    { title: 'Executive Audit Trail Report Compilation', role: 'Auditor', hrs: 16 },
    { title: 'Sharia Supervisory Board Audit Run', role: 'Sharia Scholar', hrs: 12 },
    { title: 'Customer Execution Approval Signoff', role: 'Project Manager', hrs: 8 }
  ],
  'Crypto Compliance': [
    { title: 'Kickoff & Blockchain Node Ledger Mapping', role: 'Integration Engineer', hrs: 16 },
    { title: 'Halal Tokenomics Compliance Screening Rules', role: 'Compliance Officer', hrs: 32 },
    { title: 'Smart Contract Vulnerability & Sharia Screening', role: 'Developer', hrs: 40 },
    { title: 'Sharia Board Fatwa Review and Co-signature', role: 'Sharia Scholar', hrs: 20 },
    { title: 'Customer Digital Wallet Integration Verification', role: 'Project Manager', hrs: 8 }
  ],
  'ERP Integration': [
    { title: 'ERP Ledger Mapping & REST API Blueprinting', role: 'Integration Engineer', hrs: 20 },
    { title: 'Riba-Flagging Screening Rules Deployment', role: 'Compliance Officer', hrs: 30 },
    { title: 'Auto-Purification Ledger Hook Construction', role: 'Developer', hrs: 50 },
    { title: 'Integration UAT & Load Testing', role: 'Developer', hrs: 24 },
    { title: 'Auditor Sign-off & Client Operations Sign-off', role: 'Auditor', hrs: 12 }
  ],
  'Certification': [
    { title: 'Pre-Audit Portfolio Data Gathering', role: 'Consultant', hrs: 16 },
    { title: 'Screening Against Standard No. 12 (Murabaha)', role: 'Compliance Officer', hrs: 24 },
    { title: 'Auditor Verification Report Draft', role: 'Auditor', hrs: 16 },
    { title: 'Sharia Supervisory Board Ruling Lodge', role: 'Sharia Scholar', hrs: 12 },
    { title: 'Drafting Certificate and Digital Seal Signing', role: 'Sharia Scholar', hrs: 8 }
  ],
  'Training': [
    { title: 'Curriculum Customization for AAOIFI Guidelines', role: 'Trainer', hrs: 12 },
    { title: 'Training Materials Drafting & Translation', role: 'Trainer', hrs: 20 },
    { title: 'Interactive Board Training Workshops Run', role: 'Trainer', hrs: 16 },
    { title: 'Staff Competency Testing & Certificates Export', role: 'Trainer', hrs: 8 }
  ],
  'Consulting': [
    { title: 'Corporate Governance Gap Analysis', role: 'Consultant', hrs: 40 },
    { title: 'Tailored Compliance Manual Construction', role: 'Consultant', hrs: 80 },
    { title: 'Sharia Board Liaison & Review Workshops', role: 'Sharia Scholar', hrs: 32 },
    { title: 'Final Advisory Presentation to Executive Board', role: 'Consultant', hrs: 16 }
  ]
};

for (let i = 1; i <= 20; i++) {
  const contract = DEMO_CONTRACTS.filter(c => c.status === 'SIGNED')[i - 1] || DEMO_CONTRACTS[0];
  const templateName = rng.choose(['Enterprise Compliance', 'Crypto Compliance', 'ERP Integration', 'Certification', 'Training', 'Consulting']) as keyof typeof TEMPLATE_TASKS_POOL;
  const pm = rng.choose(PROJECT_MANAGERS);
  const status = i < 15 ? 'Execution' : i < 17 ? 'QA Review' : i < 19 ? 'Sharia Board Signing' : 'Closed';
  const score = rng.range(75, 100);
  const risk = rng.choose(['Low', 'Medium', 'High']) as any;

  DEMO_PROJECTS.push({
    id: `PRJ-${String(i).padStart(3, '0')}`,
    projectNumber: `PRJ-${202600 + i}`,
    companyName: contract.companyName,
    productsPurchased: rng.chooseMultiple(PRODUCTS, rng.range(1, 2)),
    assignedPM: pm,
    status,
    startDate: new Date(Date.now() - rng.range(5, 45) * 86400000).toISOString().split('T')[0],
    targetFinishDate: new Date(Date.now() + rng.range(20, 90) * 86400000).toISOString().split('T')[0],
    milestones: [
      { name: 'Phase 1: Discovery & Kickoff', targetDate: '2026-07-10', status: 'Completed' },
      { name: 'Phase 2: Compliance Framework Model', targetDate: '2026-07-28', status: 'Pending' },
      { name: 'Phase 3: Integration and Sharia Sign-off', targetDate: '2026-08-15', status: 'Pending' }
    ],
    budget: contract.value,
    projectDocuments: [
      { name: 'Discovery_Session_Minutes.pdf', type: 'PDF', url: '#', size: '142 KB' },
      { name: 'Compliance_Model_Draft_v1.2.pdf', type: 'PDF', url: '#', size: '1.2 MB' }
    ],
    projectTeam: [
      { name: pm, role: 'Project Manager' },
      { name: 'Bassam Al-Hadi', role: 'Consultant' },
      { name: 'Nour El-Eman', role: 'Compliance Officer' }
    ],
    customerTeam: [
      { name: `Sheikh ${rng.choose(FIRST_NAMES)} Al-Suwaidi`, role: 'Head of Retail Finance' },
      { name: `${rng.choose(FIRST_NAMES)} Al-Haddad`, role: 'Integration Coordinator' }
    ],
    healthScore: score,
    riskLevel: risk
  });
}

// GENERATE 300 TASKS (across projects)
export const DEMO_TASKS: CLTask[] = [];
let taskIdCounter = 1;

DEMO_PROJECTS.forEach((proj) => {
  // Use template to build realistic tasks
  const templateType = proj.id.endsWith('1') || proj.id.endsWith('7') ? 'Enterprise Compliance' :
                       proj.id.endsWith('2') || proj.id.endsWith('8') ? 'Crypto Compliance' :
                       proj.id.endsWith('3') || proj.id.endsWith('9') ? 'ERP Integration' :
                       proj.id.endsWith('4') ? 'Certification' :
                       proj.id.endsWith('5') ? 'Training' : 'Consulting';

  const templateTasks = TEMPLATE_TASKS_POOL[templateType];

  // Let's generate 15 tasks per project to reach 300 total tasks (15 * 20 = 300!)
  for (let t = 1; t <= 15; t++) {
    const poolTask = templateTasks[(t - 1) % templateTasks.length];
    const statusIdx = rng.range(0, 6);
    const statusList: CLTaskStatus[] = ['Pending', 'In Progress', 'Waiting Customer', 'Waiting Internal Review', 'Blocked', 'Completed', 'Cancelled'];
    const status = t < 5 ? 'Completed' : t < 10 ? 'In Progress' : 'Pending';

    const approvalList: CLTaskApproval[] = ['Pending', 'Manager Reviewed', 'QA Approved', 'Compliance Verified', 'Sharia Signed', 'Customer Approved', 'Fully Closed'];
    const approvalStatus = status === 'Completed' ? 'Fully Closed' : 'Pending';

    const first = rng.choose(FIRST_NAMES);
    const last = rng.choose(LAST_NAMES);
    const employee = rng.choose(EMPLOYEES);

    DEMO_TASKS.push({
      id: `TSK-${String(taskIdCounter).padStart(4, '0')}`,
      projectId: proj.id,
      projectName: proj.companyName,
      title: `${poolTask.title} (Task #${t})`,
      description: `Execute comprehensive operational checks conforming to standard AAOIFI mandates. Review related transaction logs and ledger mappings for interest items.`,
      checklist: [
        { text: 'Analyze initial draft terms', done: status === 'Completed' },
        { text: 'Establish data compliance vectors', done: status === 'Completed' },
        { text: 'Produce executive Sharia verification report', done: status === 'Completed' }
      ],
      comments: [
        { user: 'Bassam Al-Hadi', role: 'Consultant', text: 'This looks solid, verified standard compliance rules.', date: '2026-07-15' },
        { user: proj.assignedPM, role: 'Project Manager', text: 'Please upload final verification evidence immediately.', date: '2026-07-16' }
      ],
      internalNotes: 'This client is highly sensitive to auditing timelines. Ensure Sharia Board reports are pre-vetted.',
      customerNotes: 'We require your internal transaction log sample for Month 6 to finalize screening.',
      files: [`evidence_logs_${taskIdCounter}.xlsx`],
      evidence: status === 'Completed' ? [
        { name: `compliance_log_proof_${taskIdCounter}.pdf`, url: '#', date: '2026-07-16' }
      ] : [],
      estimatedHours: poolTask.hrs,
      actualHours: status === 'Completed' ? poolTask.hrs : rng.range(0, poolTask.hrs),
      completionPercentage: status === 'Completed' ? 100 : status === 'In Progress' ? rng.range(20, 85) : 0,
      dependencies: [],
      status: status as CLTaskStatus,
      approvalStatus,
      priority: rng.choose(['Low', 'Medium', 'High', 'Critical']),
      assignedTo: employee.name,
      assignedRole: employee.role
    });

    taskIdCounter++;
  }
});

// GENERATE 30 CERTIFICATES
export interface CLSDCertificate {
  id: string;
  companyName: string;
  projectName: string;
  certificateNumber: string;
  productName: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Expired';
  signedBy: string;
}

export const DEMO_CERTIFICATES: CLSDCertificate[] = [];
for (let i = 1; i <= 30; i++) {
  const company = DEMO_COMPANIES[i % DEMO_COMPANIES.length];
  const project = DEMO_PROJECTS[i % DEMO_PROJECTS.length];
  const num = `ICAP-CERT-2026-${1000 + i}`;
  const product = rng.choose(PRODUCTS);

  DEMO_CERTIFICATES.push({
    id: `CERT-${100 + i}`,
    companyName: company.name,
    projectName: `${product} Integration`,
    certificateNumber: num,
    productName: product,
    issueDate: new Date(Date.now() - rng.range(30, 200) * 86400000).toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + rng.range(150, 400) * 86400000).toISOString().split('T')[0],
    status: i < 25 ? 'Active' : i < 28 ? 'Pending' : 'Expired',
    signedBy: 'Sheikh Dr. Ibrahim Al-Khaled (Sharia Board Chair)'
  });
}

// GENERATE RESOURCES
export const DEMO_RESOURCES: CLResource[] = [
  { id: 'res-1', name: 'Ahmed Al-Mansoori', role: 'Project Manager', currentProjects: 4, availability: 20, workload: 'Over-utilized', vacation: false, capacity: 40, utilization: 95 },
  { id: 'res-2', name: 'Hani Shaker', role: 'Project Manager', currentProjects: 5, availability: 30, workload: 'Optimal', vacation: false, capacity: 40, utilization: 85 },
  { id: 'res-3', name: 'Fatima Al-Sayed', role: 'Compliance Officer', currentProjects: 6, availability: 15, workload: 'Over-utilized', vacation: false, capacity: 40, utilization: 98 },
  { id: 'res-4', name: 'Nour El-Eman', role: 'Compliance Officer', currentProjects: 3, availability: 50, workload: 'Optimal', vacation: false, capacity: 40, utilization: 65 },
  { id: 'res-5', name: 'Johnathan Vance', role: 'Auditor', currentProjects: 4, availability: 40, workload: 'Optimal', vacation: false, capacity: 40, utilization: 72 },
  { id: 'res-6', name: 'Sheikh Dr. Ibrahim Al-Khaled', role: 'Sharia Scholar', currentProjects: 8, availability: 20, workload: 'Over-utilized', vacation: false, capacity: 20, utilization: 90 },
  { id: 'res-7', name: 'Bassam Al-Hadi', role: 'Consultant', currentProjects: 3, availability: 60, workload: 'Under-utilized', vacation: false, capacity: 40, utilization: 45 },
  { id: 'res-8', name: 'Tariq Al-Fahad', role: 'Developer', currentProjects: 5, availability: 25, workload: 'Optimal', vacation: false, capacity: 40, utilization: 82 },
  { id: 'res-9', name: 'Sari Al-Rayan', role: 'Project Manager', currentProjects: 3, availability: 45, workload: 'Optimal', vacation: false, capacity: 40, utilization: 70 }
];

// GENERATE TIMESHEETS
export const DEMO_TIMESHEETS: CLTimesheet[] = [];
for (let i = 1; i <= 60; i++) {
  const employee = rng.choose(EMPLOYEES);
  const proj = rng.choose(DEMO_PROJECTS);
  const hrs = rng.choose([4, 6, 8]);
  const bill = rng.next() > 0.2;

  DEMO_TIMESHEETS.push({
    id: `TS-${1000 + i}`,
    date: new Date(Date.now() - rng.range(1, 14) * 86400000).toISOString().split('T')[0],
    employeeName: employee.name,
    projectName: proj.companyName,
    taskTitle: `Standard Sharia audit review of secondary Murabaha clauses.`,
    hours: hrs,
    billable: bill,
    category: rng.choose(['Core Work', 'Support', 'Training', 'Travel', 'Administrative'])
  });
}

// GENERATE CUSTOMER SUCCESS PLANS
export const DEMO_SUCCESS_PLANS: CLSuccessPlan[] = DEMO_COMPANIES.filter(c => c.status === 'Customer').map((comp, idx) => {
  return {
    id: `CSP-${idx + 100}`,
    companyName: comp.name,
    planTitle: `Annual Sharia Operational Posture Strategy Plan`,
    annualReviewDate: '2027-01-15',
    renewalReminderDate: '2026-12-15',
    healthCheckStatus: rng.choose(['Excellent', 'Good', 'Needs Attention']) as any,
    continuousMonitoringSchedule: 'Monthly',
    crossSellingRecommendations: ['Sukuk Structuring Tool', 'Zakat & Purification Calculator'],
    upsellingRecommendations: ['AAOIFI Compliance Auto-Audit Enterprise Upgrade'],
    npsScore: rng.range(8, 10)
  };
});
