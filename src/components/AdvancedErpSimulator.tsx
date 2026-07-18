import React, { useState, useEffect } from 'react';
import {
  Database,
  Cpu,
  RefreshCw,
  Play,
  Check,
  X,
  AlertTriangle,
  Activity,
  Code,
  FileText,
  Key,
  Plus,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  Shield,
  Workflow,
  Network,
  Zap,
  TrendingUp,
  BarChart2,
  PieChart,
  Sliders,
  HelpCircle,
  Clock,
  ArrowRight,
  Terminal,
  CheckCircle,
  ChevronRight,
  Upload,
  Globe,
  Settings,
  Eye,
  Layers,
  Flame,
  Calendar,
  HeartPulse,
  Info,
  Server
} from 'lucide-react';

interface AdvancedErpSimulatorProps {
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onTriggerActivityLog: (action: string, details: string) => void;
}

// ==========================================
// DB MODEL SCHEMA TYPES (Requirement 16)
// ==========================================
interface ErpSystemDb {
  id: string;
  name: string;
  type: 'odoo' | 'sap' | 'dynamics' | 'oracle' | 'erpnext' | 'custom';
  version: string;
  status: 'Healthy' | 'Warning' | 'Failed' | 'Disconnected';
}

interface ConnectorConfigurationDb {
  id: string;
  organizationId: string;
  connectorType: string;
  credentials: Record<string, string>;
  settings: {
    syncFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly';
    modules: string[];
    lastRun?: string;
    nextRun?: string;
  };
}

interface TransformationRuleDb {
  id: string;
  sourceSystem: string;
  sourceField: string;
  targetObject: string;
  targetField: string;
  transformationRule: string;
}

interface ErpRecordDb {
  id: string;
  organizationId: string;
  sourceSystem: string;
  recordType: 'customer' | 'vendor' | 'invoice' | 'payment' | 'journal_entry' | 'account' | 'asset' | 'employee' | 'contract';
  externalId: string;
  data: Record<string, any>;
  mappedData: Record<string, any>;
  timestamp: string;
  validationStatus: 'Passed' | 'Warning' | 'Rejected';
}

interface ValidationResultDb {
  id: string;
  recordId: string;
  errors: string[];
  warnings: string[];
  status: 'Passed' | 'Warning' | 'Rejected';
}

export default function AdvancedErpSimulator({
  locale,
  theme,
  onTriggerActivityLog
}: AdvancedErpSimulatorProps) {
  const isRTL = locale === 'ar';

  // State: Tab within Simulator
  const [simulatorTab, setSimulatorTab] = useState<'connectors' | 'transformer' | 'quality' | 'simulation' | 'explorer' | 'db_schema'>('connectors');

  // ==========================================
  // STATE: 16. DATABASE EXTENSIONS / STATE
  // ==========================================
  const [erpSystems, setErpSystems] = useState<ErpSystemDb[]>([
    { id: 'sys-1', name: 'Al-Noor Odoo Production', type: 'odoo', version: '17.0', status: 'Healthy' },
    { id: 'sys-2', name: 'Global SAP S/4HANA Core', type: 'sap', version: 'S/4HANA 2023', status: 'Healthy' },
    { id: 'sys-3', name: 'Dynamics 365 Financials', type: 'dynamics', version: 'v9.2', status: 'Warning' },
    { id: 'sys-4', name: 'Oracle Cloud ERP', type: 'oracle', version: '24B', status: 'Disconnected' },
    { id: 'sys-5', name: 'ERPNext Sharia Ledger', type: 'erpnext', version: 'v15.1', status: 'Healthy' }
  ]);

  const [connectorConfigs, setConnectorConfigs] = useState<ConnectorConfigurationDb[]>([
    {
      id: 'cfg-1',
      organizationId: 'org-icap-demo',
      connectorType: 'odoo',
      credentials: { url: 'https://odoo.alnoor.com', dbName: 'alnoor_prod', username: 'admin_audit', apiKey: '••••••••••••••••' },
      settings: { syncFrequency: 'Daily', modules: ['Accounting', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Vendors', 'Employees'], lastRun: '2026-07-17 08:00', nextRun: '2026-07-18 08:00' }
    },
    {
      id: 'cfg-2',
      organizationId: 'org-icap-demo',
      connectorType: 'sap',
      credentials: { url: 'https://sap-gateway.alnoor.com', clientId: 'sap_icap_990', systemId: 'PRD-100' },
      settings: { syncFrequency: 'Hourly', modules: ['Finance', 'Accounts Payable', 'Accounts Receivable', 'Assets', 'Procurement'], lastRun: '2026-07-17 16:00', nextRun: '2026-07-17 17:00' }
    }
  ]);

  const [transformationRules, setTransformationRules] = useState<TransformationRuleDb[]>([
    // Odoo standard rules
    { id: 'rule-1', sourceSystem: 'odoo', sourceField: 'partner_id.name', targetObject: 'customer', targetField: 'name', transformationRule: 'TitleCase()' },
    { id: 'rule-2', sourceSystem: 'odoo', sourceField: 'amount_total', targetObject: 'invoice', targetField: 'amount', transformationRule: 'ToDecimal()' },
    { id: 'rule-3', sourceSystem: 'odoo', sourceField: 'payment_state', targetObject: 'payment', targetField: 'status', transformationRule: 'MapValues({"paid":"Completed", "not_paid":"Pending"})' },
    { id: 'rule-4', sourceSystem: 'odoo', sourceField: 'x_non_compliant_interest_fees', targetObject: 'invoice', targetField: 'impureRevenue', transformationRule: 'ExtractInterestOrRiba()' },
    
    // SAP standard rules
    { id: 'rule-5', sourceSystem: 'sap', sourceField: 'KUNNR', targetObject: 'customer', targetField: 'externalId', transformationRule: 'Prefix("SAP_")' },
    { id: 'rule-6', sourceSystem: 'sap', sourceField: 'WRBTR', targetObject: 'invoice', targetField: 'amount', transformationRule: 'ToDecimal()' },
    { id: 'rule-7', sourceSystem: 'sap', sourceField: 'ANBTR', targetObject: 'asset', targetField: 'value', transformationRule: 'ToDecimal()' }
  ]);

  // Selected Connector for Setup / Simulation Tab
  const [selectedConnectorId, setSelectedConnectorId] = useState<string>('odoo');

  // Test Connection result modal or log state
  const [testConnInput, setTestConnInput] = useState<Record<string, string>>({
    url: 'https://odoo.alnoor-finance.com',
    dbName: 'alnoor_sharia_prod',
    username: 'icap_validator',
    password: '••••••••••••••••',
    apiKey: 'odoo_sec_key_abc8812300fd'
  });
  const [testingProgress, setTestingProgress] = useState(false);
  const [testOutputLog, setTestOutputLog] = useState<string[]>([]);
  const [isTestSuccess, setIsTestSuccess] = useState<boolean | null>(null);

  // Scheduler Configuration states
  const [selectedSchedConnector, setSelectedSchedConnector] = useState('odoo');
  const [schedFrequency, setSchedFrequency] = useState<'Hourly' | 'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [schedModules, setSchedModules] = useState<string[]>(['Accounting', 'Sales']);

  // ==========================================
  // TRANSFORMATION RULE BUILDER STATES (Req 8)
  // ==========================================
  const [ruleSourceSys, setRuleSourceSys] = useState<string>('odoo');
  const [ruleSourceField, setRuleSourceField] = useState<string>('');
  const [ruleTargetObject, setRuleTargetObject] = useState<string>('invoice');
  const [ruleTargetField, setRuleTargetField] = useState<string>('');
  const [ruleTransformationRule, setRuleTransformationRule] = useState<string>('None');

  // Test mapping states
  const [testMapSourceVal, setTestMapSourceVal] = useState<string>('partner_company_ltd');
  const [testMapResult, setTestMapResult] = useState<string>('');

  // ==========================================
  // VALIDATION / DATA QUALITY SCORE STATES (Req 9, 10)
  // ==========================================
  const [dataQualityStats, setDataQualityStats] = useState({
    overall: 94.2,
    completeness: 97.4,
    accuracy: 93.1,
    consistency: 95.8,
    duplicates: 2.1,
    errors: 1.4
  });

  // ==========================================
  // IMPORT SIMULATION STATES (Req 11)
  // ==========================================
  const [importingType, setImportingType] = useState<'customers' | 'vendors' | 'invoices' | 'payments' | 'journal_entries'>('invoices');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResultsLog, setImportResultsLog] = useState<string[]>([]);
  const [importSummary, setImportSummary] = useState<{
    found: number;
    processed: number;
    success: number;
    failed: number;
    warnings: number;
  } | null>(null);

  // ==========================================
  // REAL-TIME EVENT SIMULATION STATES (Req 12)
  // ==========================================
  const [realtimeEvents, setRealtimeEvents] = useState<{
    id: string;
    timestamp: string;
    event: string;
    source: string;
    action: string;
    payload: Record<string, any>;
    mappedPayload: Record<string, any>;
  }[]>([]);

  // ==========================================
  // EXPLORER DATA RECORD LIST (Req 13, 17)
  // ==========================================
  const [explorerFilter, setExplorerFilter] = useState<'customer' | 'invoice' | 'payment' | 'account' | 'asset' | 'employee' | 'contract'>('invoice');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('inv-901');

  // Demo ERP Raw & Normalized Records (Req 17, 19)
  const [erpRecords, setErpRecords] = useState<ErpRecordDb[]>([
    {
      id: 'inv-901',
      organizationId: 'org-icap-demo',
      sourceSystem: 'odoo',
      recordType: 'invoice',
      externalId: 'O-INV/2026/0411',
      timestamp: '2026-07-17 15:45:10',
      validationStatus: 'Rejected',
      data: {
        id: 94021,
        partner_id: { id: 504, name: 'Al-Madina Trading' },
        amount_total: 45000.00,
        amount_tax: 2250.00,
        payment_state: 'not_paid',
        x_sharia_penalty_type: 'compounded_rate',
        x_penalty_percentage: 1.5,
        create_date: '2026-07-10',
        line_ids: [
          { product_id: 102, description: 'Sovereign Commodities Supply', price_unit: 42750.00 }
        ]
      },
      mappedData: {
        organizationId: 'org-icap-demo',
        sourceSystem: 'odoo',
        externalId: 'O-INV/2026/0411',
        recordType: 'invoice',
        canonicalVersion: '1.0',
        customer: { id: 'c-504', name: 'Al-Madina Trading' },
        financials: {
          subtotal: 42750.00,
          tax: 2250.00,
          grandTotal: 45000.00,
          currency: 'USD',
          paymentStatus: 'Pending'
        },
        shariaCheckpoints: {
          hasLatePaymentInterest: true,
          interestRatePercent: 1.5,
          interestMechanism: 'compounded_late_fees',
          purificationActionRequired: 'REJECT_OR_DIVERT'
        },
        timestamp: '2026-07-17T15:45:10Z'
      }
    },
    {
      id: 'inv-902',
      organizationId: 'org-icap-demo',
      sourceSystem: 'sap',
      recordType: 'invoice',
      externalId: 'SAP-FI-2026-904',
      timestamp: '2026-07-17 14:12:00',
      validationStatus: 'Passed',
      data: {
        BELNR: '180004021',
        GJAHR: '2026',
        KUNNR: '0000401124',
        WRBTR: 125000.00,
        WAERS: 'USD',
        BUDAT: '2026-07-15',
        XBLNR: 'DELIVERY-8910',
        INTEREST_CLAUSE: 'none',
        PURIFICATION_ACCOUNT: 'charity-fund-09a'
      },
      mappedData: {
        organizationId: 'org-icap-demo',
        sourceSystem: 'sap',
        externalId: 'SAP-FI-2026-904',
        recordType: 'invoice',
        canonicalVersion: '1.0',
        customer: { id: 'SAP-0000401124', name: 'Dar Al-Taqwa Fund' },
        financials: {
          subtotal: 125000.00,
          tax: 0.00,
          grandTotal: 125000.00,
          currency: 'USD',
          paymentStatus: 'Completed'
        },
        shariaCheckpoints: {
          hasLatePaymentInterest: false,
          interestRatePercent: 0,
          interestMechanism: 'none',
          purificationActionRequired: 'NONE'
        },
        timestamp: '2026-07-17T14:12:00Z'
      }
    },
    {
      id: 'cust-903',
      organizationId: 'org-icap-demo',
      sourceSystem: 'odoo',
      recordType: 'customer',
      externalId: 'O-CUST-8812',
      timestamp: '2026-07-17 12:00:15',
      validationStatus: 'Passed',
      data: {
        id: 8812,
        name: 'tayseer investment group',
        email: 'info@tayseer-inv.com',
        phone: '+96611400292',
        credit_limit: 500000.00,
        sharia_approved: true
      },
      mappedData: {
        organizationId: 'org-icap-demo',
        sourceSystem: 'odoo',
        externalId: 'O-CUST-8812',
        recordType: 'customer',
        name: 'Tayseer Investment Group',
        email: 'info@tayseer-inv.com',
        phone: '+96611400292',
        creditLimit: 500000.00,
        shariaComplianceFlag: 'Approved',
        timestamp: '2026-07-17T12:00:15Z'
      }
    },
    {
      id: 'asset-904',
      organizationId: 'org-icap-demo',
      sourceSystem: 'sap',
      recordType: 'asset',
      externalId: 'SAP-AST-44102',
      timestamp: '2026-07-17 10:30:22',
      validationStatus: 'Warning',
      data: {
        ANLN1: '40001024',
        ANBTR: 2500000.00,
        AKTIV: '2025-01-10',
        DEPRECIATION_RATE: 10,
        LEASING_TERMS: 'ijara_with_guarantee_deposit'
      },
      mappedData: {
        organizationId: 'org-icap-demo',
        sourceSystem: 'sap',
        externalId: 'SAP-AST-44102',
        recordType: 'asset',
        name: 'Ijara Commercial Property 1024',
        value: 2500000.00,
        acquisitionDate: '2025-01-10',
        leasingTerms: 'Ijara with guarantee deposit',
        shariaComplianceIssues: ['Verify third party guarantee documentation to ensure no lease-to-own penalty loops.'],
        timestamp: '2026-07-17T10:30:22Z'
      }
    }
  ]);

  // Handler: Test Connection Simulation
  const handleTestConnection = (systemType: string) => {
    setTestingProgress(true);
    setTestOutputLog([]);
    setIsTestSuccess(null);

    const logs: string[] = [];
    const pushLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setTestOutputLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      }, delay);
    };

    pushLog(`Initiating handshake with ${systemType.toUpperCase()} endpoint...`, 200);
    pushLog(`Verifying authentication credentials and TLS 1.3 tunnels...`, 600);
    pushLog(`Querying active system schemas & modules...`, 1200);

    setTimeout(() => {
      setTestingProgress(false);
      setIsTestSuccess(true);
      onTriggerActivityLog('ERP_TEST_CONNECTION', `Tested and verified connection to ERP ${systemType.toUpperCase()}`);
      
      if (systemType === 'odoo') {
        setTestOutputLog(prev => [
          ...prev,
          `[SUCCESS] Connection Established!`,
          `Odoo Version: 17.0 Community Edition`,
          `Supported API protocols: XML-RPC, JSON-RPC`,
          `Authorized scopes found: Accounting, Sales, Inventory, Human Resources`,
          `Database Handshake: Completed. 125,410 active rows mapped.`
        ]);
      } else if (systemType === 'sap') {
        setTestOutputLog(prev => [
          ...prev,
          `[SUCCESS] SAP RFC Connected successfully!`,
          `System: S/4HANA Core Demo Enterprise`,
          `SAP Version: ERP ECC 6.0 / S/4HANA 2023 Cloud`,
          `Modules Available: Finance (FI), Assets (AM), Procurement (MM), Cash Mgmt`
        ]);
      } else if (systemType === 'dynamics') {
        setTestOutputLog(prev => [
          ...prev,
          `[SUCCESS] Microsoft Dynamics OData Gateway Handshake Passed!`,
          `Tenant ID: verified-dynamics-tenant-09x4`,
          `OData Endpoint: Dynamics 365 Finance v9.2`,
          `Modules Available: Finance, General Ledger, Accounts Payable, Accounts Receivable`
        ]);
      } else if (systemType === 'oracle') {
        setTestOutputLog(prev => [
          ...prev,
          `[SUCCESS] Oracle Financials REST Gateway Connected!`,
          `Instance URL: Verified. API Key Signature validated.`,
          `Oracle Modules: Financials, Procurement, Enterprise Performance Management`
        ]);
      } else {
        setTestOutputLog(prev => [
          ...prev,
          `[SUCCESS] ERPNext Connection Handshake OK!`,
          `Server URL: Handshake passed on REST API v15.1`,
          `Available DocTypes: Sales Invoice, Purchase Invoice, Journal Entry, Employee`
        ]);
      }
    }, 1800);
  };

  // Handler: Run Visual Rule Test Map
  useEffect(() => {
    let result = testMapSourceVal;
    if (ruleTransformationRule === 'TitleCase()') {
      result = testMapSourceVal.split(/[\s_-]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } else if (ruleTransformationRule === 'ToDecimal()') {
      const parsed = parseFloat(testMapSourceVal);
      result = isNaN(parsed) ? '0.00' : parsed.toFixed(2);
    } else if (ruleTransformationRule === 'ExtractInterestOrRiba()') {
      if (testMapSourceVal.toLowerCase().includes('interest') || testMapSourceVal.toLowerCase().includes('riba') || parseFloat(testMapSourceVal) > 0) {
        result = 'FLAGGED_RIBA: Purification Required';
      } else {
        result = 'COMPLIANT_HALAL';
      }
    } else if (ruleTransformationRule.startsWith('Prefix')) {
      result = 'SAP_' + testMapSourceVal;
    }
    setTestMapResult(result);
  }, [testMapSourceVal, ruleTransformationRule]);

  // Handler: Save Mapping Rule
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleSourceField || !ruleTargetField) return;

    const newRule: TransformationRuleDb = {
      id: `rule-${Date.now()}`,
      sourceSystem: ruleSourceSys,
      sourceField: ruleSourceField,
      targetObject: ruleTargetObject,
      targetField: ruleTargetField,
      transformationRule: ruleTransformationRule
    };

    setTransformationRules(prev => [...prev, newRule]);
    setRuleSourceField('');
    setRuleTargetField('');
    onTriggerActivityLog('ERP_RULE_CREATE', `Created transformation mapping rule for ${ruleSourceSys}: ${ruleSourceField} -> ${ruleTargetObject}.${ruleTargetField}`);
  };

  // Handler: Delete Mapping Rule
  const handleDeleteRule = (id: string) => {
    setTransformationRules(prev => prev.filter(r => r.id !== id));
  };

  // Handler: Import Ingestion Simulator
  const handleRunImportSimulator = () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportResultsLog([]);
    setImportSummary(null);

    const typeLabels: Record<string, string> = {
      customers: 'Customers',
      vendors: 'Vendors',
      invoices: 'Invoices',
      payments: 'Payments',
      journal_entries: 'Journal Entries'
    };

    const logs: string[] = [];
    const addLog = (msg: string, prg: number) => {
      setTimeout(() => {
        setImportProgress(prg);
        setImportResultsLog(prev => [...prev, `[${prg}%] ${msg}`]);
      }, prg * 40);
    };

    addLog(`Connecting to ${selectedConnectorId.toUpperCase()} active endpoint...`, 5);
    addLog(`Initiating stream extraction for: ${typeLabels[importingType]}`, 15);
    addLog(`Downloading batch stream segments (Row 1 to 5000)...`, 30);
    addLog(`Applying schema transformation rules & standard conversions...`, 50);
    addLog(`Executing AAOIFI Standard No. 8 validation checkpoints...`, 70);
    addLog(`Checking for duplicate external IDs...`, 85);
    addLog(`Indexing records into ICAP Canonical Storage engine...`, 95);

    setTimeout(() => {
      setIsImporting(false);
      setImportProgress(100);

      let found = 15000;
      let processed = 15000;
      let success = 14950;
      let failed = 50;
      let warnings = 120;

      if (importingType === 'journal_entries') {
        found = 600000;
        processed = 600000;
        success = 598800;
        failed = 1200;
        warnings = 3200;
      } else if (importingType === 'customers') {
        found = 5000;
        processed = 5000;
        success = 4995;
        failed = 5;
        warnings = 25;
      } else if (importingType === 'payments') {
        found = 30000;
        processed = 30000;
        success = 29980;
        failed = 20;
        warnings = 80;
      }

      setImportSummary({ found, processed, success, failed, warnings });
      setImportResultsLog(prev => [
        ...prev,
        `[100%] Ingestion complete. Summary: Processed: ${processed.toLocaleString()} records, Successful: ${success.toLocaleString()} records, Errors: ${failed.toLocaleString()} records.`
      ]);

      onTriggerActivityLog('ERP_IMPORT_SIMULATION', `Simulated ingestion of ${processed.toLocaleString()} ${typeLabels[importingType]} from ${selectedConnectorId.toUpperCase()}`);
    }, 4200);
  };

  // Handler: Realtime event fire simulation
  const handleFireRealtimeEvent = (eventName: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const id = `evt-${Date.now()}`;

    let payload: Record<string, any> = {};
    let mapped: Record<string, any> = {};

    if (eventName === 'New Invoice Created') {
      payload = {
        invoice_number: `INV-RT-${Math.floor(Math.random() * 8999 + 1000)}`,
        customer_ref: 'CUST-8812',
        gross_amount: 14500.00,
        terms: 'Payment due in 30 days. Late fees 2% per month compound.',
        riba_amount: 290.00
      };
      mapped = {
        organizationId: 'org-icap-demo',
        sourceSystem: selectedConnectorId,
        externalId: payload.invoice_number,
        recordType: 'invoice',
        canonicalVersion: '1.0',
        customer: { id: 'O-CUST-8812', name: 'Tayseer Investment Group' },
        financials: { subtotal: 14210.00, tax: 290.00, grandTotal: 14500.00 },
        shariaCheckpoints: {
          hasLatePaymentInterest: true,
          interestRatePercent: 2.0,
          interestMechanism: 'compounded_late_fees',
          purificationActionRequired: 'REJECT_OR_DIVERT'
        },
        timestamp: new Date().toISOString(),
        validationStatus: 'Rejected'
      };
    } else if (eventName === 'Payment Received') {
      payload = {
        payment_id: `PAY-RT-${Math.floor(Math.random() * 8999 + 1000)}`,
        invoice_ref: 'O-INV/2026/0411',
        net_received: 45000.00,
        date: '2026-07-17',
        payment_gateway: 'Islamic Bank Gateway'
      };
      mapped = {
        organizationId: 'org-icap-demo',
        sourceSystem: selectedConnectorId,
        externalId: payload.payment_id,
        recordType: 'payment',
        amount: 45000.00,
        associatedInvoice: 'O-INV/2026/0411',
        shariaCheckpoints: { hasLatePaymentInterest: false, purificationActionRequired: 'NONE' },
        timestamp: new Date().toISOString(),
        validationStatus: 'Passed'
      };
    } else if (eventName === 'Contract Changed') {
      payload = {
        contract_id: `CON-RT-${Math.floor(Math.random() * 8999 + 1000)}`,
        title: 'Equipment Leasing Agreement - Ijara Muntahia Bittamleek',
        guarantees: 'Lessee must provide absolute warranty for lease payment and damage asset values concurrently.',
        amount: 85000.00
      };
      mapped = {
        organizationId: 'org-icap-demo',
        sourceSystem: selectedConnectorId,
        externalId: payload.contract_id,
        recordType: 'contract',
        title: payload.title,
        shariaCheckpoints: {
          hasLatePaymentInterest: false,
          purificationActionRequired: 'MANUAL_REVIEW_REQUIRED',
          notes: 'Two contracts in one (lease and sale) without separation of risk. Check for AAOIFI Sharia Standard No. 9 compliance.'
        },
        timestamp: new Date().toISOString(),
        validationStatus: 'Warning'
      };
    } else {
      payload = {
        vendor_id: 'V-RT-402',
        vendor_name: 'Impure Sourcing Co',
        activity_type: 'Conventional Insurance Agency',
        tax_id: 'TX-9042'
      };
      mapped = {
        organizationId: 'org-icap-demo',
        sourceSystem: selectedConnectorId,
        externalId: payload.vendor_id,
        recordType: 'vendor',
        name: payload.vendor_name,
        shariaCheckpoints: {
          hasLatePaymentInterest: false,
          purificationActionRequired: 'REJECT_OR_DIVERT',
          reason: 'Vendor primary activity involves Haram sector (Conventional Insurance).'
        },
        timestamp: new Date().toISOString(),
        validationStatus: 'Rejected'
      };
    }

    const newEvent = {
      id,
      timestamp,
      event: eventName,
      source: selectedConnectorId,
      action: mapped.validationStatus === 'Rejected' ? 'Rejected & Flagged for Purification' : mapped.validationStatus === 'Warning' ? 'Flagged for Sharia Review' : 'Sent to ICAP Storage Ledger',
      payload,
      mappedPayload: mapped
    };

    setRealtimeEvents(prev => [newEvent, ...prev].slice(0, 30));

    // Also add to Explorer list so we can inspect it!
    const newErpRec: ErpRecordDb = {
      id,
      organizationId: 'org-icap-demo',
      sourceSystem: selectedConnectorId,
      recordType: mapped.recordType,
      externalId: mapped.externalId,
      data: payload,
      mappedData: mapped,
      timestamp,
      validationStatus: mapped.validationStatus
    };

    setErpRecords(prev => [newErpRec, ...prev]);

    // Re-calculate some small data quality fluctuations
    setDataQualityStats(prev => ({
      ...prev,
      overall: Math.max(85, Math.min(99, prev.overall + (mapped.validationStatus === 'Rejected' ? -0.2 : 0.1))),
      errors: Math.max(0.5, prev.errors + (mapped.validationStatus === 'Rejected' ? 0.1 : -0.05))
    }));

    onTriggerActivityLog('ERP_REALTIME_EVENT', `Fired real-time simulated event "${eventName}" from ${selectedConnectorId.toUpperCase()}`);
  };

  // Automated sync scheduler save
  const handleUpdateScheduler = (e: React.FormEvent) => {
    e.preventDefault();
    setErpSystems(prev => prev.map(sys => {
      if (sys.type === selectedSchedConnector) {
        return { ...sys, status: 'Healthy' as const };
      }
      return sys;
    }));
    onTriggerActivityLog('ERP_SCHED_UPDATE', `Configured Sync schedule for ${selectedSchedConnector.toUpperCase()} to ${schedFrequency} (Modules: ${schedModules.join(', ')})`);
    alert(`Sync Schedule Updated successfully for ${selectedSchedConnector.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6" id="advanced-erp-engine" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Header Panel */}
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
          <Workflow className="w-96 h-96 -mr-16 -mt-16 text-emerald-500" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              ICAP V2 Engine
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              ● ACTIVE DEPLOYMENT
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold">
            {isRTL ? 'محرك محاكاة موصلات الـ ERP وتحويل البيانات المتقدم' : 'Advanced ERP Connector Simulation & Transformation Engine'}
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {isRTL 
              ? 'بوابة تحويل وتدقيق متقدمة لربط ومطابقة بيانات النظم المالية العملاقة (Odoo, SAP, Dynamics, Oracle) ونمذجتها معيارياً بالتوافق التام مع ضوابط هيئة المراجعة والمحاسبة الإسلامية (AAOIFI).' 
              : 'Enterprise-grade ingestion layer mirroring, transforming, and validating massive multi-ledger ledger transactions from top global platforms into strict sharia-compliant canonical formats.'}
          </p>
        </div>

        {/* Local Simulator Menu Navigation */}
        <div className="flex flex-wrap gap-1 bg-slate-800/60 p-1 rounded-lg mt-6 w-fit text-xs border border-slate-700">
          {[
            { id: 'connectors', name: isRTL ? 'موصلات الـ ERP' : 'ERP Connector Library', icon: Server },
            { id: 'transformer', name: isRTL ? 'قواعد وهندسة التحويل' : 'Transformation Builder', icon: Workflow },
            { id: 'quality', name: isRTL ? 'جودة وتدقيق البيانات' : 'Data Quality Analyzer', icon: BarChart2 },
            { id: 'simulation', name: isRTL ? 'محاكاة البث الحي' : 'Ingestion & Event Simulator', icon: Play },
            { id: 'explorer', name: isRTL ? 'مستكشف البيانات' : 'Canonical Data Explorer', icon: Database },
            { id: 'db_schema', name: isRTL ? 'هيكل قواعد البيانات' : 'DB Extensions Inspector', icon: Code }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSimulatorTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
                simulatorTab === tab.id 
                  ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================
          1. ERP CONNECTORS TAB
          ========================================== */}
      {simulatorTab === 'connectors' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Connector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                id: 'odoo',
                name: 'Odoo Connector',
                version: 'v17.0 (LTS)',
                logo: '🟣',
                authType: 'XML-RPC / API Key',
                modules: ['Accounting', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Vendors', 'Employees'],
                doc: 'Comprehensive XML-RPC endpoint connection supporting model-level auditing and automatic late penalty detection fields.',
                demoResponse: 'Odoo Version: 17.0 LTS. Available modules verified.'
              },
              {
                id: 'sap',
                name: 'SAP S/4HANA Connector',
                version: 'NetWeaver RFC v2023',
                logo: '🔵',
                authType: 'OAuth 2.0 / Client Secret',
                modules: ['Finance (FI)', 'Accounts Payable (AP)', 'Accounts Receivable (AR)', 'Assets (AM)', 'Procurement (MM)'],
                doc: 'Integrates with RFC Gateway. Extract company code parameters, GL segments, and asset registers safely.',
                demoResponse: 'System S/4HANA Demo Connected. RFC Handshake OK.'
              },
              {
                id: 'dynamics',
                name: 'Microsoft Dynamics 365',
                version: 'v9.2 Enterprise',
                logo: '🟢',
                authType: 'Azure Active Directory Client Credentials',
                modules: ['Finance', 'Sales', 'Customers', 'Vendors', 'Projects'],
                doc: 'Leverages OData v4 web API. Maps multi-currency customer balances and contracts for compliant profit-rate structures.',
                demoResponse: 'Tenant ID verified. Azure AD Token Issued.'
              },
              {
                id: 'oracle',
                name: 'Oracle ERP Cloud',
                version: '24B Cloud REST',
                logo: '🔴',
                authType: 'API Key / Username',
                modules: ['Financials', 'Procurement', 'Assets', 'Projects'],
                doc: 'Oracle REST API integrations. Real-time capture of accounts payable invoices and asset depreciation schedules.',
                demoResponse: 'Oracle Instance verified. Authorization approved.'
              },
              {
                id: 'erpnext',
                name: 'ERPNext Connector',
                version: 'Frappe v15.1',
                logo: '⚙️',
                authType: 'API Key & Secret Token',
                modules: ['Accounting', 'Inventory', 'HR', 'CRM'],
                doc: 'Direct JSON API listener. Perfect for rapid open-source Islamic banking asset ledger ingestion.',
                demoResponse: 'ERPNext token authenticated. Available DocTypes downloaded.'
              },
              {
                id: 'custom',
                name: 'Custom Rest API Gateway',
                version: 'REST OpenAPI 3.0',
                logo: '📡',
                authType: 'Bearer Access Token',
                modules: ['Financials', 'Contracts', 'Journal Entries'],
                doc: 'Define a generic JSON payload structure to post customized multi-ledger transactional streams straight to ICAP.',
                demoResponse: 'API Gateway live on port 3000.'
              }
            ].map((conn) => {
              const activeSys = erpSystems.find(s => s.type === conn.id);
              const isConfigured = connectorConfigs.some(cfg => cfg.connectorType === conn.id);
              
              return (
                <div key={conn.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{conn.logo}</span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{conn.name}</h3>
                          <span className="text-[10px] text-slate-400 font-mono block">{conn.version}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        activeSys?.status === 'Healthy' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : activeSys?.status === 'Warning' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : activeSys?.status === 'Disconnected' 
                          ? 'bg-slate-100 text-slate-600' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activeSys?.status || 'Available'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[48px]">
                      {conn.doc}
                    </p>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold text-[10px] uppercase">Auth:</span>
                        <span className="text-slate-700 font-mono text-[10px] truncate max-w-[180px]">{conn.authType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold text-[10px] uppercase">Modules:</span>
                        <span className="text-slate-700 text-[10px] truncate max-w-[180px]">{conn.modules.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedConnectorId(conn.id);
                        handleTestConnection(conn.id);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-2 rounded-lg text-center transition"
                    >
                      {isRTL ? 'فحص الاتصال' : 'Test Connection'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedConnectorId(conn.id);
                        setSelectedSchedConnector(conn.id);
                        const element = document.getElementById('config-editor-anchor');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded-lg text-center transition"
                    >
                      {isConfigured ? (isRTL ? 'تعديل الإعدادات' : 'Configure') : (isRTL ? 'تثبيت وربط' : 'Install Adapter')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Setup / Configuration Panel & Sync Scheduler */}
          <div id="config-editor-anchor" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live Connection Test & Output Console */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    {isRTL ? `محاكي فحص اتصال: ${selectedConnectorId.toUpperCase()}` : `Credential Testing Terminal: ${selectedConnectorId.toUpperCase()}`}
                  </h3>
                </div>
                <span className="bg-slate-100 text-slate-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                  XML-RPC / REST Tunnel
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 col-span-2">
                  <label className="text-slate-400 font-bold block">{selectedConnectorId.toUpperCase()} Endpoint URL</label>
                  <input
                    type="text"
                    value={testConnInput.url}
                    onChange={(e) => setTestConnInput({ ...testConnInput, url: e.target.value })}
                    className="w-full bg-slate-50 border p-2 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                {selectedConnectorId === 'odoo' && (
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Database Name</label>
                    <input
                      type="text"
                      value={testConnInput.dbName}
                      onChange={(e) => setTestConnInput({ ...testConnInput, dbName: e.target.value })}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none font-mono"
                    />
                  </div>
                )}
                {selectedConnectorId === 'sap' && (
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">SAP Client ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 100"
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none font-mono"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">API Key / Token</label>
                  <input
                    type="password"
                    value={testConnInput.apiKey}
                    onChange={(e) => setTestConnInput({ ...testConnInput, apiKey: e.target.value })}
                    className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={testingProgress}
                  onClick={() => handleTestConnection(selectedConnectorId)}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition"
                >
                  {testingProgress ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>{isRTL ? 'جاري الفحص المباشر...' : 'Connecting Gateways...'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isRTL ? 'تشغيل فحص الاتصال التلقائي' : 'Execute Diagnostic Test'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Console logs */}
              <div className="bg-slate-950 rounded-lg p-3 text-[11px] font-mono text-slate-300 min-h-[140px] max-h-[180px] overflow-y-auto space-y-1 border border-slate-800">
                <span className="text-slate-500 block">/* Ingestion test log stdout: */</span>
                {testOutputLog.length === 0 && (
                  <span className="text-slate-600 block italic">System idle. Trigger connection test.</span>
                )}
                {testOutputLog.map((logStr, idx) => (
                  <div key={idx} className={logStr.includes('SUCCESS') ? 'text-emerald-400 font-bold' : ''}>
                    {logStr}
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Scheduler Configuration Card (Requirement 15) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'جدولة وضبط وتكرار عمليات المزامنة الملقمة' : 'Automated Sync Ingestion Scheduler'}
                </h3>
              </div>

              <form onSubmit={handleUpdateScheduler} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Selected ERP Connector:</label>
                    <select
                      value={selectedSchedConnector}
                      onChange={(e) => setSelectedSchedConnector(e.target.value)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                    >
                      <option value="odoo">Odoo Adapter</option>
                      <option value="sap">SAP S/4HANA</option>
                      <option value="dynamics">Microsoft Dynamics 365</option>
                      <option value="oracle">Oracle ERP Cloud</option>
                      <option value="erpnext">ERPNext Frappe</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold block">Frequency Interval:</label>
                    <select
                      value={schedFrequency}
                      onChange={(e) => setSchedFrequency(e.target.value as any)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                    >
                      <option value="Hourly">Hourly Continuous Ingestion</option>
                      <option value="Daily">Daily Ledger Update</option>
                      <option value="Weekly">Weekly Financial Batch</option>
                      <option value="Monthly">Monthly General Reconciliation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold block">Select ERP Modules to Sync:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Accounting', 'Sales', 'Purchase', 'Inventory', 'Asset Ledger', 'Contracts', 'HR & Salaries'].map((mod) => {
                      const checked = schedModules.includes(mod);
                      return (
                        <label key={mod} className="flex items-center gap-1.5 border rounded p-2 bg-slate-50 hover:bg-slate-100 cursor-pointer text-[10px] font-bold">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setSchedModules(schedModules.filter(m => m !== mod));
                              } else {
                                setSchedModules([...schedModules, mod]);
                              }
                            }}
                          />
                          <span>{mod}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-[10px] text-slate-500 font-mono border">
                  <div>
                    <span className="block font-bold">Last Run Status: <strong className="text-emerald-600">SUCCESS</strong></span>
                    <span className="block">Timestamp: 2026-07-17 08:00 UTC</span>
                  </div>
                  <div>
                    <span className="block font-bold">Next Scheduled Run:</span>
                    <span className="block text-slate-700">{schedFrequency === 'Hourly' ? 'Every Hour' : schedFrequency === 'Daily' ? 'Tomorrow at 08:00 UTC' : 'Next Week'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition"
                >
                  {isRTL ? 'حفظ وتأكيد جدولة المزامنة' : 'Publish Sync Ingestion Schedule'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          2. DATA TRANSFORMATION & RULE BUILDER TAB
          ========================================== */}
      {simulatorTab === 'transformer' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Visual Transformation Flow Diagram (Requirement 7) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-800">
              {isRTL ? 'مخطط تدفق خط تحويل ومعالجة البيانات الموحد' : 'Visual Mapping & Transformation Pipeline'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRTL 
                ? 'نموذج التدفق الحركي الذي يخضع له السجل الخام المستخلص من موصلات الـ ERP حتى تتم ترجمته لنموذج البيانات الموحد وحفظه للفحص الشرعي.' 
                : 'Canonical transformation lifecycle: extraction, schema-matching, token-stripping, AAOIFI-compliance rules, and structural vector hashing.'}
            </p>

            <div className="p-6 bg-slate-50 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold border">
              
              {/* Step 1 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-center border-b-4 border-purple-500 min-w-[130px] shadow-sm">
                <span className="text-xl block mb-1">🔌</span>
                <span className="text-[10px] text-purple-400 block uppercase font-mono">1. Raw Extract</span>
                <span className="text-slate-200 mt-1 block">ERP Table Rows</span>
              </div>

              <div className="text-slate-400 animate-pulse hidden md:block">
                <ArrowRight className="w-5 h-5 text-slate-300" />
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-center border-b-4 border-yellow-500 min-w-[130px] shadow-sm">
                <span className="text-xl block mb-1">⚙️</span>
                <span className="text-[10px] text-yellow-400 block uppercase font-mono">2. Map Schema</span>
                <span className="text-slate-200 mt-1 block">Transformation Rule</span>
              </div>

              <div className="text-slate-400 animate-pulse hidden md:block">
                <ArrowRight className="w-5 h-5 text-slate-300" />
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-center border-b-4 border-red-500 min-w-[130px] shadow-sm">
                <span className="text-xl block mb-1">🛡️</span>
                <span className="text-[10px] text-red-400 block uppercase font-mono">3. Sharia Audit</span>
                <span className="text-slate-200 mt-1 block">Riba & Penalty Validation</span>
              </div>

              <div className="text-slate-400 animate-pulse hidden md:block">
                <ArrowRight className="w-5 h-5 text-slate-300" />
              </div>

              {/* Step 4 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-center border-b-4 border-emerald-500 min-w-[130px] shadow-sm">
                <span className="text-xl block mb-1">🕋</span>
                <span className="text-[10px] text-emerald-400 block uppercase font-mono">4. Canonical Model</span>
                <span className="text-slate-200 mt-1 block">Normalized Payload</span>
              </div>

              <div className="text-slate-400 animate-pulse hidden md:block">
                <ArrowRight className="w-5 h-5 text-slate-300" />
              </div>

              {/* Step 5 */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-center border-b-4 border-blue-500 min-w-[130px] shadow-sm font-mono text-[10px]">
                <Database className="w-5 h-5 mx-auto mb-1 text-emerald-400 animate-pulse" />
                <span className="text-blue-400 block uppercase">5. Storage</span>
                <span className="text-slate-300 mt-1 block">Ready for AI Core</span>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Transformation Rule Builder Form (Requirement 8) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900">
                {isRTL ? 'منشئ قواعد المطابقة المرئي' : 'Transformation Rule Builder'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL 
                  ? 'قم ببناء وتعديل علاقات التحويل الرياضية والمترجمات الحرفية لحقول الـ ERP.' 
                  : 'Map custom enterprise data model fields into strict ICAP standard keys with visual rules.'}
              </p>

              <form onSubmit={handleSaveRule} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Source ERP Platform:</label>
                  <select
                    value={ruleSourceSys}
                    onChange={(e) => setRuleSourceSys(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  >
                    <option value="odoo">Odoo Connector</option>
                    <option value="sap">SAP S/4HANA</option>
                    <option value="dynamics">MS Dynamics 365</option>
                    <option value="oracle">Oracle Cloud</option>
                    <option value="erpnext">ERPNext</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Source ERP Table Field:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. partner_id.name or amount_total"
                    value={ruleSourceField}
                    onChange={(e) => setRuleSourceField(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Target Canonical Object:</label>
                    <select
                      value={ruleTargetObject}
                      onChange={(e) => setRuleTargetObject(e.target.value)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                    >
                      <option value="customer">customer (Standard)</option>
                      <option value="invoice">invoice (General)</option>
                      <option value="payment">payment (Cash)</option>
                      <option value="account">account (GL Ledger)</option>
                      <option value="asset">asset (Ijara/Murabaha)</option>
                      <option value="contract">contract (Warrants)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">Target Unified Field:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. customer.name"
                      value={ruleTargetField}
                      onChange={(e) => setRuleTargetField(e.target.value)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-bold block">Apply Transformation Rule Template:</label>
                  <select
                    value={ruleTransformationRule}
                    onChange={(e) => setRuleTransformationRule(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                  >
                    <option value="None">Direct Map (None)</option>
                    <option value="TitleCase()">TitleCase() - Format names correctly</option>
                    <option value="ToDecimal()">ToDecimal() - Convert string to DecimalFloat</option>
                    <option value="ExtractInterestOrRiba()">ExtractInterestOrRiba() - Detect impure late fees</option>
                    <option value="Prefix('SAP_')">Prefix('SAP_') - Namespace system keys</option>
                  </select>
                </div>

                {/* Live Sandbox Test Rule Tool */}
                <div className="bg-slate-50 border p-3.5 rounded-xl space-y-2">
                  <span className="font-bold text-[10px] text-slate-400 uppercase block">Rule Simulator Testbed</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Test Input:</span>
                      <input
                        type="text"
                        value={testMapSourceVal}
                        onChange={(e) => setTestMapSourceVal(e.target.value)}
                        className="w-full bg-white border p-1 rounded font-mono text-[10.5px]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500">Translated Mapped Value:</span>
                      <div className="font-mono text-[11px] p-1 bg-white border rounded text-emerald-800 font-bold min-h-[22px] truncate">
                        {testMapResult}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition"
                >
                  {isRTL ? 'حفظ وتثبيت قاعدة المطابقة' : 'Save Transformation Template Rule'}
                </button>
              </form>
            </div>

            {/* Right: Active Rule Ledger */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'مستودع وقائمة قواعد الترجمة المعتمدة' : 'Active Mapping Template Rules'}
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  {transformationRules.length} Rules Registered
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b">
                    <tr>
                      <th className="p-3">ERP Source</th>
                      <th className="p-3">Source Column</th>
                      <th className="p-3">Direction</th>
                      <th className="p-3">ICAP Target Element</th>
                      <th className="p-3">Active Mapping rule</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                    {transformationRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50/40">
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-800 font-sans font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                            {rule.sourceSystem}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-bold">{rule.sourceField}</td>
                        <td className="p-3 text-slate-400">➔</td>
                        <td className="p-3 text-emerald-800 font-bold">{rule.targetObject}.{rule.targetField}</td>
                        <td className="p-3 text-slate-500">{rule.transformationRule}</td>
                        <td className="p-3 text-center font-sans">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ==========================================
          3. DATA VALIDATION & QUALITY DASHBOARD TAB
          ========================================== */}
      {simulatorTab === 'quality' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Data Quality Metrics Rows (Requirement 10) */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            
            <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm text-center col-span-2 flex flex-col justify-between border-b-4 border-emerald-500">
              <span className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wider">{isRTL ? 'إجمالي نقاط دقة وجودة البيانات' : 'Overall ERP Ingestion Quality'}</span>
              <div>
                <span className="text-4xl font-display font-bold text-emerald-400">{dataQualityStats.overall}%</span>
                <p className="text-[10px] text-slate-400 mt-1">Weighted metric score across all connected channels</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'معدل اكتمال الحقول' : 'Completeness'}</span>
              <span className="text-2xl font-display font-bold text-slate-900 block">{dataQualityStats.completeness}%</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-1.5" style={{ width: `${dataQualityStats.completeness}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'دقة ترجمة المعاملات' : 'Accuracy'}</span>
              <span className="text-2xl font-display font-bold text-slate-900 block">{dataQualityStats.accuracy}%</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-yellow-500 h-1.5" style={{ width: `${dataQualityStats.accuracy}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'التوافق والاتساق' : 'Consistency'}</span>
              <span className="text-2xl font-display font-bold text-slate-900 block">{dataQualityStats.consistency}%</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-1.5" style={{ width: `${dataQualityStats.consistency}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
              <span className="text-xs text-red-400 font-bold block mb-2">{isRTL ? 'أخطاء مطابقة الهيكل' : 'Validation Errors'}</span>
              <span className="text-2xl font-display font-bold text-red-500 block">{dataQualityStats.errors}%</span>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-red-500 h-1.5" style={{ width: `${dataQualityStats.errors}%` }} />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Validation Rules List (Requirement 9) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'محددات وقواعد الفحص والتصفية التلقائية' : 'Validation Guard Checklist'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'قبل حفظ البيانات وحقنها، تخضع المعاملات لتدقيق هيكلي معقد للتأكد من خلوها من الأخطاء وامتثالها للضوابط الشرعية.' 
                  : 'Automated validators executed upon raw stream buffer load before final commit to partition.'}
              </p>

              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'Required Fields Check', desc: 'Ensures crucial keys like Customer ID, Ledger Code, Grand Total are present and not null.', status: 'Active (Fatal)', errAction: 'Reject & Set Status "Rejected"' },
                  { name: 'Data Type Struct Enforcement', desc: 'Validates that amount rates are accurate numeric floats, transaction dates conform to ISO-8601.', status: 'Active (Fatal)', errAction: 'Reject Record' },
                  { name: 'Duplicate Record Purging', desc: 'Detects duplicate external ERP IDs within the database to prevent double accounting.', status: 'Active (Deduplicate)', errAction: 'Ignore Incoming Duplicate' },
                  { name: 'Late Penalty Interest Identifier (AAOIFI)', desc: 'Detects contractual clauses matching compound late fees or late interest (Riba) flags.', status: 'Active (Warning/Reject)', errAction: 'Flag for Purification Review' },
                  { name: 'Haram Industry Screening', desc: 'Cross-checks vendor categories against lists of non-compliant sectors (conventional banking, alcohol, tobacco).', status: 'Active (Fatal)', errAction: 'Reject Ingestion' }
                ].map((val, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-slate-50 flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 block text-xs">{val.name}</span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{val.desc}</p>
                      <div className="flex gap-2 text-[9px] font-mono font-bold mt-1.5">
                        <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">Status: {val.status}</span>
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">Action: {val.errAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Validation Simulator Sandbox */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'محاكي واختبار الأخطاء والرفض التلقائي' : 'Interactive Validation Exception Simulator'}
                </h3>
              </div>

              <div className="p-4 bg-red-50/35 border border-red-150 rounded-xl space-y-3 text-xs">
                <span className="bg-red-100 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded">
                  SIMULATED FAILURE CASE
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Invoice #INV-2904 Ingestion Test</h4>
                  <p className="text-slate-500 text-[11px]">This transaction contains a late penalty agreement calculated as a compounded monthly rate of 1.5%.</p>
                </div>

                <div className="p-3 bg-white rounded-lg border font-mono text-[10px] text-slate-600 space-y-1">
                  <div>"invoice_id": "INV-2904",</div>
                  <div>"partner_name": "Dar Al-Taqwa Fund",</div>
                  <div className="text-red-500 font-bold">"customer_id": null,  &lt;-- [CRITICAL ERROR: Missing Customer Reference]</div>
                  <div className="text-red-500 font-bold">"late_penalty_rate": 1.5,  &lt;-- [RIBA WARNING: Compounded late interest]</div>
                  <div>"amount_total": 8500.00</div>
                </div>

                <div className="flex items-center gap-3 bg-red-100/50 p-2.5 rounded-lg border border-red-200 text-red-900 text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <strong className="block">Status: Rejected</strong>
                    <span>Missing Required Customer ID. Transaction contains non-compliant interest structures. Record blocked from canonical storage.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          4. INGESTION & EVENTS SIMULATION TAB
          ========================================== */}
      {simulatorTab === 'simulation' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Ingestion Stream Simulator (Requirement 11) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Play className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'محاكي سحب واستيراد دفعات البيانات الضخمة' : 'ERP Bulk Stream Ingestion Simulator'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isRTL 
                  ? 'اختر نوع الحركات المالية لتوليد بيانات ضخمة قياسية من موصل الـ ERP وحقنها داخل قاعدة التدقيق الموحدة لـ ICAP.' 
                  : 'Synthesize massive live data flow extraction and transformation. Watch schema properties normalize instantly.'}
              </p>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">Select Connector Stream:</label>
                    <select
                      value={selectedConnectorId}
                      onChange={(e) => setSelectedConnectorId(e.target.value)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none uppercase font-bold"
                    >
                      <option value="odoo">Odoo Adapter</option>
                      <option value="sap">SAP S/4HANA</option>
                      <option value="dynamics">MS Dynamics 365</option>
                      <option value="oracle">Oracle ERP Cloud</option>
                      <option value="erpnext">ERPNext Frappe</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">Inbound Data Type:</label>
                    <select
                      value={importingType}
                      onChange={(e) => setImportingType(e.target.value as any)}
                      className="w-full bg-slate-50 border p-2 rounded focus:outline-none"
                    >
                      <option value="invoices">Invoices (Accounts Receivable)</option>
                      <option value="customers">Customers (res.partner)</option>
                      <option value="vendors">Vendors (Suppliers)</option>
                      <option value="payments">Payments (Cashbook Transactions)</option>
                      <option value="journal_entries">Journal Entries (Double-Entry Ledger)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={isImporting}
                    onClick={handleRunImportSimulator}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition text-center flex items-center justify-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Streaming Records ({importProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-white" />
                        <span>Execute Batch Stream Ingestion</span>
                      </>
                    )}
                  </button>
                </div>

                {isImporting && (
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2 transition-all duration-300" style={{ width: `${importProgress}%` }} />
                  </div>
                )}

                {/* Console Log Area */}
                <div className="bg-slate-950 rounded-lg p-3.5 text-[11px] font-mono text-slate-300 min-h-[140px] max-h-[180px] overflow-y-auto space-y-1">
                  {importResultsLog.length === 0 && (
                    <span className="text-slate-600 block italic">Ready. Click "Execute Batch Stream Ingestion" to run simulation.</span>
                  )}
                  {importResultsLog.map((l, i) => (
                    <div key={i} className={l.includes('ingestion complete') ? 'text-emerald-400 font-bold' : ''}>
                      {l}
                    </div>
                  ))}
                </div>

                {/* Import Ingestion Summary (Requirement 11) */}
                {importSummary && (
                  <div className="bg-slate-50 p-4 rounded-xl border space-y-2.5">
                    <span className="font-bold text-[10px] text-slate-400 block uppercase tracking-wider">Stream Import Summary Ledger</span>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="border bg-white rounded p-1.5 shadow-sm">
                        <span className="text-[10px] text-slate-400 block">Found</span>
                        <strong className="text-slate-900 font-mono">{importSummary.found.toLocaleString()}</strong>
                      </div>
                      <div className="border bg-white rounded p-1.5 shadow-sm">
                        <span className="text-[10px] text-slate-400 block">Processed</span>
                        <strong className="text-blue-600 font-mono">{importSummary.processed.toLocaleString()}</strong>
                      </div>
                      <div className="border bg-white rounded p-1.5 shadow-sm">
                        <span className="text-[10px] text-slate-400 block">Success</span>
                        <strong className="text-emerald-600 font-mono">{importSummary.success.toLocaleString()}</strong>
                      </div>
                      <div className="border bg-white rounded p-1.5 shadow-sm col-span-1">
                        <span className="text-[10px] text-slate-400 block">Rejected</span>
                        <strong className="text-red-500 font-mono">{importSummary.failed.toLocaleString()}</strong>
                      </div>
                      <div className="border bg-white rounded p-1.5 shadow-sm col-span-1">
                        <span className="text-[10px] text-slate-400 block">Warnings</span>
                        <strong className="text-yellow-600 font-mono">{importSummary.warnings.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Webhook Simulator & Event Stream (Requirement 12) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'محاكي ومحفز الأحداث الحية الفورية' : 'Real-time Event Webhook Simulator'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {isRTL 
                  ? 'أطلق حركات حية فورية تحاكي قيام مستخدم بإنشاء فاتورة أو دفع معاملة داخل نظام ERP خارجي لمشاهدة استجابة التحويل المباشر لـ ICAP.' 
                  : 'Dispatch micro-events replicating instantaneous database triggers. Watch translation and filtering occur in real-time.'}
              </p>

              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  'New Invoice Created',
                  'Payment Received',
                  'Vendor Updated',
                  'Contract Changed'
                ].map((evName) => (
                  <button
                    key={evName}
                    onClick={() => handleFireRealtimeEvent(evName)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{evName}</span>
                  </button>
                ))}
              </div>

              {/* Event output logs */}
              <div className="space-y-2 max-h-[230px] overflow-y-auto text-xs">
                {realtimeEvents.length === 0 ? (
                  <div className="text-slate-400 italic text-center py-6 border rounded-lg bg-slate-50">
                    No active webhook events fired yet. Click one of the buttons above to simulate!
                  </div>
                ) : (
                  realtimeEvents.map((evt) => (
                    <div key={evt.id} className="border rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-800 block">{evt.event}</span>
                        <span className="text-slate-400 font-mono">{evt.timestamp}</span>
                      </div>
                      <div className="flex gap-2 text-[9px] font-mono font-bold">
                        <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">Source: {evt.source}</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          evt.action.includes('Rejected') ? 'bg-red-100 text-red-800' : evt.action.includes('Review') ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>Action: {evt.action}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          5. ERP DATA EXPLORER TAB (Requirement 13)
          ========================================== */}
      {simulatorTab === 'explorer' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Explorer Filter & Record List */}
            <div className="xl:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Filter ERP Records:</label>
                <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
                  {[
                    { id: 'invoice', label: 'Invoices' },
                    { id: 'customer', label: 'Customers' },
                    { id: 'payment', label: 'Payments' },
                    { id: 'asset', label: 'Assets' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setExplorerFilter(btn.id as any)}
                      className={`flex-1 font-bold py-1.5 px-2.5 rounded transition text-[10.5px] ${
                        explorerFilter === btn.id 
                          ? 'bg-white text-slate-950 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Record List */}
              <div className="space-y-2 text-xs max-h-[400px] overflow-y-auto">
                {erpRecords
                  .filter(rec => rec.recordType === explorerFilter)
                  .map((rec) => {
                    const isSelected = selectedRecordId === rec.id;
                    return (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedRecordId(rec.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50/20' 
                            : 'border-slate-150 hover:bg-slate-50/45'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[11px] font-bold text-slate-800">{rec.externalId}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            rec.validationStatus === 'Passed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : rec.validationStatus === 'Warning' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>{rec.validationStatus}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span className="uppercase font-mono">ERP: {rec.sourceSystem}</span>
                          <span>{rec.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Columns: Raw vs Mapped SPLIT SCREEN (Requirement 13) */}
            <div className="xl:col-span-2 space-y-4">
              
              {selectedRecordId ? (
                (() => {
                  const record = erpRecords.find(r => r.id === selectedRecordId);
                  if (!record) return <div className="text-slate-400 italic">Record not found.</div>;
                  
                  return (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Inspect record canonical translation</span>
                          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{record.externalId}</span>
                            <span className="text-xs text-slate-400 font-mono font-normal">({record.recordType.toUpperCase()})</span>
                          </h3>
                        </div>

                        <div className="flex gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-1 rounded">
                            Source System: {record.sourceSystem.toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                            record.validationStatus === 'Passed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : record.validationStatus === 'Warning' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Validation: {record.validationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Side by side JSON inspection panels */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
                        
                        {/* Panel 1: Original Raw ERP Record */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Original raw ERP response:</span>
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl max-h-[300px] overflow-y-auto border border-slate-800 text-[11px] leading-relaxed">
                            <pre><code>{JSON.stringify(record.data, null, 2)}</code></pre>
                          </div>
                        </div>

                        {/* Panel 2: Mapped ICAP Standard Format (Requirement 19) */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-emerald-600 font-bold uppercase block font-sans flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> 
                            <span>Normalized canonical record for AI analysis:</span>
                          </span>
                          <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl max-h-[300px] overflow-y-auto border border-emerald-950 text-[11px] leading-relaxed">
                            <pre><code>{JSON.stringify(record.mappedData, null, 2)}</code></pre>
                          </div>
                        </div>

                      </div>

                      {/* Map Ingestion & Compliance Audit Timeline Log */}
                      <div className="bg-slate-50 p-4 rounded-xl border text-xs text-slate-600 space-y-2">
                        <span className="font-bold text-[10px] text-slate-400 block uppercase tracking-wider">Transformation & Audit History Timeline</span>
                        <div className="space-y-2">
                          <div className="flex gap-2.5 items-start">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-mono px-1 py-0.5 rounded mt-0.5 font-bold">SUCCESS</span>
                            <div>
                              <strong>Ingestion & Schema-Matching Handshake Complete</strong>
                              <p className="text-slate-400 text-[11px]">Successfully mapped raw properties to canon keys using Transformation Template rule definitions.</p>
                            </div>
                          </div>
                          <div className="flex gap-2.5 items-start">
                            <span className={`${record.validationStatus === 'Rejected' ? 'bg-red-100 text-red-700' : record.validationStatus === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'} text-[10px] font-mono px-1 py-0.5 rounded mt-0.5 font-bold`}>
                              {record.validationStatus.toUpperCase()}
                            </span>
                            <div>
                              <strong>AAOIFI Sharia Compliance Filtering Gate</strong>
                              {record.validationStatus === 'Rejected' ? (
                                <p className="text-red-500 font-bold text-[11px]">REJECTED. Late-payment interest penalty contract detected. Blocked from financial ledger integration.</p>
                              ) : record.validationStatus === 'Warning' ? (
                                <p className="text-yellow-600 font-bold text-[11px]">WARNING. Ambiguous warranty or lease clauses detected. Flagged for secondary human-in-the-loop audit review.</p>
                              ) : (
                                <p className="text-emerald-600 text-[11px]">CLEAN ledger structures confirmed. No Riba flags found. Fully compliant.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="text-slate-400 italic text-center py-12 bg-white rounded-xl border border-slate-200">
                  Select an ERP record from the list to inspect its canonical transformation payload.
                </div>
              )}

            </div>

          </div>

          {/* Core AI Compliance Engine preparation Card (Requirement 19) */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-yellow-400">
            <div className="space-y-2">
              <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Up Next: ICAP AI Compliance Core
              </span>
              <h3 className="text-lg font-display font-bold">Prepared for Automated Islamic AI Audit Ingestion</h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                The normalized canonical output files generated by this transformation layer are fully packaged with standard metadata (including organizationId, sourceSystem, timestamps, and compliance scores) and are ready to seed the AI audit modules.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs shrink-0 font-mono text-[10.5px]">
              {['Sharia AI', 'Audit AI', 'Accounting AI', 'Legal AI', 'Risk AI'].map((aiItem) => (
                <span key={aiItem} className="bg-slate-800 text-yellow-300 border border-slate-700 px-2.5 py-1 rounded">
                  {aiItem}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================
          6. DATABASE SCHEMA INSPECTOR TAB (Requirement 16)
          ========================================== */}
      {simulatorTab === 'db_schema' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Table structural metadata schema definitions */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Code className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'توسعات قاعدة البيانات المخططة (ER Diagram Schema)' : 'Drizzle ORM Database Schema Extensions'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL 
                  ? 'عرض مواصفات الجداول والامتدادات الحاكمة التي تمت إضافتها لقاعدة بيانات ICAP لحفظ حركات وقنوات الـ ERP.' 
                  : 'View the Postgres table configurations and columns dynamically created in the integration module schema layers.'}
              </p>

              <div className="space-y-3.5 text-xs">
                {[
                  {
                    tableName: 'erpSystems',
                    fields: [
                      { name: 'id', type: 'uuid (Primary Key)' },
                      { name: 'name', type: 'varchar(255)' },
                      { name: 'type', type: 'varchar(50)' },
                      { name: 'version', type: 'varchar(50)' },
                      { name: 'status', type: 'varchar(50)' }
                    ]
                  },
                  {
                    tableName: 'connectorConfigurations',
                    fields: [
                      { name: 'id', type: 'uuid (PK)' },
                      { name: 'organizationId', type: 'uuid (FK)' },
                      { name: 'connectorType', type: 'varchar(50)' },
                      { name: 'credentials', type: 'jsonb (Encrypted)' },
                      { name: 'settings', type: 'jsonb' }
                    ]
                  },
                  {
                    tableName: 'transformationRules',
                    fields: [
                      { name: 'id', type: 'uuid (PK)' },
                      { name: 'sourceSystem', type: 'varchar(50)' },
                      { name: 'sourceField', type: 'varchar(255)' },
                      { name: 'targetObject', type: 'varchar(50)' },
                      { name: 'targetField', type: 'varchar(255)' },
                      { name: 'transformationRule', type: 'text' }
                    ]
                  },
                  {
                    tableName: 'erpRecords',
                    fields: [
                      { name: 'id', type: 'uuid (PK)' },
                      { name: 'organizationId', type: 'uuid (FK)' },
                      { name: 'sourceSystem', type: 'varchar(50)' },
                      { name: 'externalId', type: 'varchar(100)' },
                      { name: 'data', type: 'jsonb (Raw ERP Payload)' },
                      { name: 'mappedData', type: 'jsonb (Normalized Canonical)' }
                    ]
                  }
                ].map((tbl) => (
                  <div key={tbl.tableName} className="border rounded-xl p-4 bg-slate-50/50 space-y-2">
                    <span className="font-mono font-bold text-emerald-800 text-xs block flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      <span>{tbl.tableName}</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t pt-2">
                      {tbl.fields.map((fld) => (
                        <div key={fld.name} className="flex justify-between bg-white border p-1 rounded px-2">
                          <span className="text-slate-700 font-bold">{fld.name}</span>
                          <span className="text-slate-400 text-[10px]">{fld.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Live Schema DB Query Console */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b pb-3">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900">
                  {isRTL ? 'منصة استعلام جداول الـ Integration' : 'Relational Schema SQL Console Query'}
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                  <span className="text-slate-500 block">-- Query active integration configurations and systems</span>
                  <div className="text-emerald-400">
                    SELECT name, type, version, status FROM erpSystems WHERE status = 'Healthy';
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-[10.5px] font-mono">
                    <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b">
                      <tr>
                        <th className="p-2.5">name</th>
                        <th className="p-2.5">type</th>
                        <th className="p-2.5">version</th>
                        <th className="p-2.5">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 bg-white">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-800">Al-Noor Odoo Production</td>
                        <td className="p-2.5">odoo</td>
                        <td className="p-2.5">17.0</td>
                        <td className="p-2.5 font-bold text-emerald-600">Healthy</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-800">Global SAP S/4HANA Core</td>
                        <td className="p-2.5">sap</td>
                        <td className="p-2.5">S/4HANA 2023</td>
                        <td className="p-2.5 font-bold text-emerald-600">Healthy</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-800">ERPNext Sharia Ledger</td>
                        <td className="p-2.5">erpnext</td>
                        <td className="p-2.5">v15.1</td>
                        <td className="p-2.5 font-bold text-emerald-600">Healthy</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
