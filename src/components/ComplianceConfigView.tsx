import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle,
  HelpCircle,
  Plus,
  BookOpen,
  FileText,
  Workflow,
  PlusCircle,
  AlertOctagon,
  Users,
  Check,
  AlertCircle,
  File,
  Eye,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import {
  Standard,
  Policy,
  SOP,
  CustomRule,
  ReviewAssignment,
  User,
  ComplianceConfiguration
} from '../types';

interface ComplianceConfigViewProps {
  standards: Standard[];
  policies: Policy[];
  sops: SOP[];
  customRules: CustomRule[];
  users: User[];
  locale: 'en' | 'ar';
  onAddStandard: (std: Standard) => void;
  onAddPolicy: (pol: Policy) => void;
  onAddSOP: (sop: SOP) => void;
  onAddRule: (rule: CustomRule) => void;
}

export default function ComplianceConfigView({
  standards,
  policies,
  sops,
  customRules,
  users,
  locale,
  onAddStandard,
  onAddPolicy,
  onAddSOP,
  onAddRule
}: ComplianceConfigViewProps) {
  const isRTL = locale === 'ar';
  const [subTab, setSubTab] = useState<'wizard' | 'standards' | 'policies' | 'sops' | 'rules' | 'reviewers' | 'approval'>('wizard');

  // Wizard Steps State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardOrgName, setWizardOrgName] = useState('Al Noor Islamic Finance Group');
  const [wizardIndustry, setWizardIndustry] = useState('Islamic Banking');
  const [wizardCountry, setWizardCountry] = useState('Saudi Arabia');
  const [wizardScope, setWizardScope] = useState<string[]>(['Islamic Finance', 'FinTech Compliance']);
  const [wizardFrameworks, setWizardFrameworks] = useState<string[]>(['AAOIFI Based Methodology']);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [wizardFiles, setWizardFiles] = useState<{ name: string; category: string }[]>([]);
  const [wizardApproved, setWizardApproved] = useState<boolean | null>(null);

  // New item modal states
  const [showStdModal, setShowStdModal] = useState(false);
  const [showPolModal, setShowPolModal] = useState(false);
  const [showSopModal, setShowSopModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  // Standard Form State
  const [newStdName, setNewStdName] = useState('');
  const [newStdCat, setNewStdCat] = useState('Islamic Finance');
  const [newStdVer, setNewStdVer] = useState('2025.1');
  const [newStdSrc, setNewStdSrc] = useState('AAOIFI');
  const [newStdDesc, setNewStdDesc] = useState('');

  // Policy Form State
  const [newPolName, setNewPolName] = useState('');
  const [newPolCat, setNewPolCat] = useState('Islamic Finance');
  const [newPolDesc, setNewPolDesc] = useState('');
  const [newPolEff, setNewPolEff] = useState('2026-01-01');

  // SOP Form State
  const [newSopName, setNewSopName] = useState('');
  const [newSopDept, setNewSopDept] = useState('');
  const [newSopPurp, setNewSopPurp] = useState('');
  const [sopSteps, setSopSteps] = useState<{ name: string; role: string }[]>([
    { name: 'Initiate Request', role: 'Employee' },
    { name: 'Sharia Review check', role: 'Compliance Officer' }
  ]);
  const [tempStepName, setTempStepName] = useState('');
  const [tempStepRole, setTempStepRole] = useState('Compliance Officer');

  // Custom Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCond, setNewRuleCond] = useState('');
  const [newRuleSev, setNewRuleSev] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newRuleAct, setNewRuleAct] = useState('');

  const t = {
    title: isRTL ? 'إدارة تهيئة الامتثال والسياسات' : 'Compliance Configuration Workspace',
    wizard: isRTL ? 'مساعد التهيئة المتقدم' : 'Setup Onboarding Wizard',
    standards: isRTL ? 'المعايير المرجعية' : 'Standards Management',
    policies: isRTL ? 'السياسات الداخلية' : 'Policy Management',
    sops: isRTL ? 'إجراءات العمل القياسية SOP' : 'SOP Workflows',
    rules: isRTL ? 'القواعد المخصصة' : 'Custom Compliance Rules',
    reviewers: isRTL ? 'المراجعون والمعتمدون' : 'Compliance Reviewers',
    approval: isRTL ? 'مخطط الموافقة والاعتماد' : 'Configuration Approval',
    addStd: isRTL ? 'إضافة معيار جديد' : 'Add Standard',
    addPol: isRTL ? 'إضافة سياسة جديدة' : 'Add Policy',
    addSop: isRTL ? 'إنشاء إجراء SOP جديد' : 'Create SOP Flow',
    addRule: isRTL ? 'إضافة قاعدة فحص مخصصة' : 'Add Custom Rule',
  };

  const handleScopeToggle = (scope: string) => {
    if (wizardScope.includes(scope)) {
      setWizardScope(wizardScope.filter((s) => s !== scope));
    } else {
      setWizardScope([...wizardScope, scope]);
    }
  };

  const handleFrameworkToggle = (fw: string) => {
    if (wizardFrameworks.includes(fw)) {
      setWizardFrameworks(wizardFrameworks.filter((f) => f !== fw));
    } else {
      setWizardFrameworks([...wizardFrameworks, fw]);
    }
  };

  const simulateProgress = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setWizardFiles([
            ...wizardFiles,
            { name: isRTL ? 'دليل التدقيق الداخلي.pdf' : 'Internal_Audit_Manual_AAOIFI.pdf', category: 'Standards' }
          ]);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleAddSopStep = () => {
    if (tempStepName) {
      setSopSteps([...sopSteps, { name: tempStepName, role: tempStepRole }]);
      setTempStepName('');
    }
  };

  return (
    <div id="compliance-config-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header and Sub Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">{t.title}</h2>
          <p className="text-xs text-slate-400">
            {isRTL 
              ? 'تحديد النطاقات الشرعية، وتوثيق المعايير، والتحقق التلقائي من السياسات.' 
              : 'Define governance constraints, reference libraries, workflows, and automated purification criteria.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['wizard', 'standards', 'policies', 'sops', 'rules', 'reviewers', 'approval'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`text-xs font-bold px-3 py-2 rounded-md transition ${
                subTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. COMPLIANCE ONBOARDING WIZARD */}
      {/* ==================================================== */}
      {subTab === 'wizard' && (
        <div id="wizard-container" className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                {isRTL ? 'مساعد تهيئة نظام الامتثال الشرعي' : 'Compliance Setup Wizard'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL ? 'تهيئة شاملة للقواعد والبيانات المرجعية للذكاء الاصطناعي' : 'Complete AI readiness guidelines & policy frameworks step-by-step'}
              </p>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded font-mono">
              ⚡ {isRTL ? 'حفظ تلقائي محلي نشط' : 'Progress saved automatically'}
            </span>
          </div>

          {/* Progress Tracker Steps */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col gap-2">
                <div className={`h-1.5 rounded-full ${wizardStep >= s ? 'bg-emerald-600' : 'bg-slate-100'}`} />
                <span className={`text-[10px] font-bold ${wizardStep === s ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {s === 1 && (isRTL ? 'المؤسسة' : 'Organization')}
                  {s === 2 && (isRTL ? 'النطاق' : 'Scope')}
                  {s === 3 && (isRTL ? 'المرجعيات' : 'Frameworks')}
                  {s === 4 && (isRTL ? 'المستندات' : 'Documents')}
                  {s === 5 && (isRTL ? 'المراجعة' : 'Review')}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Org Information */}
          {wizardStep === 1 && (
            <div className="space-y-4 max-w-2xl">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{isRTL ? 'تفاصيل ومعلومات المؤسسة' : 'Organization Information Parameters'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isRTL ? 'اسم المؤسسة' : 'Organization Name'}</label>
                  <input
                    type="text"
                    value={wizardOrgName}
                    onChange={(e) => setWizardOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isRTL ? 'القطاع' : 'Industry'}</label>
                  <input
                    type="text"
                    value={wizardIndustry}
                    onChange={(e) => setWizardIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isRTL ? 'الدولة' : 'Country'}</label>
                  <input
                    type="text"
                    value={wizardCountry}
                    onChange={(e) => setWizardCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{isRTL ? 'النشاط الشرعي الرئيسي' : 'Primary Sharia Activity'}</label>
                  <input
                    type="text"
                    defaultValue="Islamic Wealth & Mudaraba"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Compliance Scope */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{isRTL ? 'تحديد نطاقات الامتثال الشرعي المطلوبة' : 'Compliance Scope Selection'}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Islamic Finance',
                  'Crypto Compliance',
                  'FinTech Compliance',
                  'Banking Products',
                  'Investment Compliance',
                  'Internal Audit',
                  'Risk Management',
                  'Governance'
                ].map((scope) => {
                  const selected = wizardScope.includes(scope);
                  return (
                    <button
                      key={scope}
                      onClick={() => handleScopeToggle(scope)}
                      className={`p-4 border rounded-xl text-left transition flex flex-col justify-between h-28 ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Sliders className={`w-5 h-5 ${selected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold mt-2 block">{scope}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Reference Framework */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{isRTL ? 'اختيار المرجعيات والأدلة الشرعية الحاكمة' : 'Reference Compliance Framework'}</h4>
              <div className="space-y-3 max-w-2xl">
                {[
                  { name: 'AAOIFI Based Methodology', desc: 'Accounting and Auditing Organization for Islamic Financial Institutions.' },
                  { name: 'IFSB Guidance', desc: 'Islamic Financial Services Board regulatory core.' },
                  { name: 'IFRS & Accounting standard adaptation', desc: 'Reconciling international finance structures.' },
                  { name: 'Customer Internal Policies', desc: 'Directives and screening models specified by your board.' }
                ].map((fw) => {
                  const selected = wizardFrameworks.includes(fw.name);
                  return (
                    <div
                      key={fw.name}
                      onClick={() => handleFrameworkToggle(fw.name)}
                      className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-4 ${
                        selected ? 'border-emerald-600 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`mt-0.5 rounded-full p-0.5 border ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{fw.name}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{fw.desc}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3.5 flex items-start gap-3 mt-4 text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold">{isRTL ? 'تنبيه مسؤولية الامتثال' : 'Framework Advisory Note'}</h5>
                    <p className="text-[10px] text-amber-800 mt-0.5 leading-relaxed">
                      {isRTL
                        ? 'يستخدم نظام ICAP الذكاء الاصطناعي لفحص وتحليل الوثائق بناءً على المرجعيات المحددة. تظل قرارات الاعتماد النهائية خاضعة لمراجعة واعتماد اللجان والمحكمين البشريين.'
                        : 'ICAP uses selected frameworks as reference sources for analysis. Final certification decisions remain subject to approved human review.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Upload Documents */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 mb-2">{isRTL ? 'رفع وتصنيف مستندات الامتثال الخاصة بك' : 'Upload Sharia Compliance Documents'}</h4>
              <p className="text-xs text-slate-500 mb-4">{isRTL ? 'يدعم النظام ملفات PDF, DOCX, XLSX لاستخراج البيانات وتصنيفها تلقائياً.' : 'Supports PDF, DOCX, XLSX formats to extract terms, conditions and fatwas.'}</p>

              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-8 text-center bg-slate-50 transition cursor-pointer" onClick={simulateProgress}>
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-700">{isRTL ? 'اضغط هنا لمحاكاة رفع مستندات جديدة' : 'Click here to simulate drag & drop upload'}</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, XLSX up to 25MB</p>

                {uploadProgress > 0 && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>{uploadProgress === 100 ? (isRTL ? 'تم الرفع!' : 'Uploaded!') : (isRTL ? 'جاري الرفع...' : 'Uploading...')}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-1 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {wizardFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700">{isRTL ? 'الملفات المرفوعة للتهيئة:' : 'Uploaded files for this session:'}</h5>
                  {wizardFiles.map((f, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <File className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-slate-800">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">
                        {f.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {wizardStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 mb-4">{isRTL ? 'مراجعة طلب التهيئة والامتثال العام' : 'Review Configuration Settings'}</h4>
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3.5 max-w-2xl text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 font-medium block">{isRTL ? 'اسم المؤسسة' : 'Organization'}</span>
                    <span className="font-bold text-slate-800">{wizardOrgName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">{isRTL ? 'نطاق الامتثال' : 'Selected Scopes'}</span>
                    <span className="font-bold text-slate-800">{wizardScope.join(', ')}</span>
                  </div>
                </div>

                <div className="pb-3 border-b border-slate-200">
                  <span className="text-slate-400 font-medium block mb-1">{isRTL ? 'المرجعيات الشرعية والأنظمة المعتمدة' : 'Approved Frameworks'}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {wizardFrameworks.map((fw) => (
                      <span key={fw} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block mb-1">{isRTL ? 'المستندات الحاكمة المرفقة بالملف' : 'Governance Documents Added'}</span>
                  <p className="text-[10px] text-slate-500">
                    {wizardFiles.length > 0 
                      ? `${wizardFiles.length} ${isRTL ? 'مستندات جاهزة للمعالجة' : 'document(s) packaged'}` 
                      : (isRTL ? 'لم يتم إرفاق ملفات إضافية. يمكنك المتابعة على أية حال.' : 'No new files uploaded for this configuration.')}
                  </p>
                </div>
              </div>

              {wizardApproved && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-3 text-emerald-800 max-w-2xl text-xs font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>{isRTL ? 'تم إرسال إعدادات التهيئة بنجاح لقسم التدقيق وهيئة الرقابة الشرعية.' : 'Onboarding settings have been submitted for Sharia Board sign-off.'}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-150">
            <button
              onClick={() => setWizardStep((p) => Math.max(1, p - 1))}
              disabled={wizardStep === 1}
              className={`text-xs font-bold px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                wizardStep === 1 
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> {isRTL ? 'السابق' : 'Back'}
            </button>

            {wizardStep < 5 ? (
              <button
                onClick={() => setWizardStep((p) => Math.min(5, p + 1))}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow"
              >
                {isRTL ? 'التالي' : 'Next'} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setWizardApproved(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition flex items-center gap-2 shadow"
              >
                {isRTL ? 'تقديم للمراجعة والاعتماد' : 'Submit For Approval'} <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. STANDARDS MANAGEMENT */}
      {/* ==================================================== */}
      {subTab === 'standards' && (
        <div id="standards-tab" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'دليل معايير الامتثال المرجعية' : 'Standards Reference Library'}</h3>
            <button
              onClick={() => setShowStdModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> {t.addStd}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-150">
                <tr>
                  <th className="p-4">{isRTL ? 'المعيار' : 'Standard Name'}</th>
                  <th className="p-4">{isRTL ? 'الفئة' : 'Category'}</th>
                  <th className="p-4">{isRTL ? 'الإصدار' : 'Version'}</th>
                  <th className="p-4">{isRTL ? 'المصدر' : 'Source'}</th>
                  <th className="p-4">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="p-4">{isRTL ? 'تاريخ الرفع' : 'Uploaded Date'}</th>
                  <th className="p-4 text-center">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {standards.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-900">{std.name}</td>
                    <td className="p-4">{std.category}</td>
                    <td className="p-4 font-mono">{std.version}</td>
                    <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold text-[10px]">{std.source}</span></td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        std.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{std.uploadedDate}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="text-slate-500 hover:text-emerald-600 p-1 rounded hover:bg-slate-100"><Eye className="w-4 h-4" /></button>
                        <button className="text-slate-500 hover:text-red-600 p-1 rounded hover:bg-slate-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standard Create Modal */}
          {showStdModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-250 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                <h4 className="text-base font-display font-bold text-slate-900">{isRTL ? 'إضافة معيار شرعي جديد' : 'Add Reference Standard'}</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'اسم المعيار' : 'Standard Name'}</label>
                    <input type="text" value={newStdName} onChange={(e) => setNewStdName(e.target.value)} placeholder="e.g. AAOIFI Standard No. 12" className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الفئة' : 'Category'}</label>
                      <input type="text" value={newStdCat} onChange={(e) => setNewStdCat(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الإصدار' : 'Version'}</label>
                      <input type="text" value={newStdVer} onChange={(e) => setNewStdVer(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'المصدر' : 'Source Institution'}</label>
                    <input type="text" value={newStdSrc} onChange={(e) => setNewStdSrc(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الوصف' : 'Description'}</label>
                    <textarea value={newStdDesc} onChange={(e) => setNewStdDesc(e.target.value)} rows={3} className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button onClick={() => setShowStdModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-lg">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                  <button onClick={() => {
                    if (newStdName) {
                      onAddStandard({
                        id: `std-${Date.now()}`,
                        organizationId: 'org-al-noor',
                        name: newStdName,
                        category: newStdCat,
                        version: newStdVer,
                        source: newStdSrc,
                        status: 'Active',
                        uploadedDate: new Date().toISOString().split('T')[0],
                        description: newStdDesc
                      });
                      setShowStdModal(false);
                      setNewStdName('');
                    }
                  }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg">{isRTL ? 'حفظ' : 'Save Standard'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. POLICY MANAGEMENT */}
      {/* ==================================================== */}
      {subTab === 'policies' && (
        <div id="policies-tab" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'لوائح وسياسات التدقيق الداخلي للمؤسسة' : 'Internal Compliance Policies'}</h3>
            <button
              onClick={() => setShowPolModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> {t.addPol}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {policies.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-sm mb-2">{p.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{p.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center">
                  <span>{isRTL ? 'مراجعة:' : 'Review Date:'} {p.reviewDate}</span>
                  {p.attachmentName && <span className="flex items-center gap-1 text-slate-500 hover:underline cursor-pointer"><File className="w-3.5 h-3.5 text-emerald-600" /> {p.attachmentName.substring(0, 15)}...</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Policy Creation Modal */}
          {showPolModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-250 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                <h4 className="text-base font-display font-bold text-slate-900">{isRTL ? 'إضافة لائحة حوكمة جديدة' : 'Create Internal Policy'}</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'اسم السياسة' : 'Policy Name'}</label>
                    <input type="text" value={newPolName} onChange={(e) => setNewPolName(e.target.value)} placeholder="e.g. Ethical Asset Management Charter" className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الفئة' : 'Category'}</label>
                    <input type="text" value={newPolCat} onChange={(e) => setNewPolCat(e.target.value)} className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الوصف وشروط الامتثال الشرعي' : 'Governance Constraints & Description'}</label>
                    <textarea value={newPolDesc} onChange={(e) => setNewPolDesc(e.target.value)} rows={4} placeholder="Exclude gambling assets, conventional interest accounts..." className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button onClick={() => setShowPolModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-lg">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                  <button onClick={() => {
                    if (newPolName) {
                      onAddPolicy({
                        id: `pol-${Date.now()}`,
                        organizationId: 'org-al-noor',
                        name: newPolName,
                        category: newPolCat,
                        description: newPolDesc,
                        effectiveDate: new Date().toISOString().split('T')[0],
                        reviewDate: '2027-01-01',
                        status: 'Draft'
                      });
                      setShowPolModal(false);
                      setNewPolName('');
                      setNewPolDesc('');
                    }
                  }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg">{isRTL ? 'حفظ السياسة' : 'Save Policy'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. SOP MANAGEMENT & FLOWCHART BUILDER */}
      {/* ==================================================== */}
      {subTab === 'sops' && (
        <div id="sops-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'إجراءات العمل وسيناريوهات التدقيق' : 'Standard Operating Procedures (SOPs)'}</h3>
              <button
                onClick={() => setShowSopModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> {t.addSop}
              </button>
            </div>

            <div className="space-y-4">
              {sops.map((sop) => (
                <div key={sop.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">{sop.department}</span>
                      <h4 className="font-display font-bold text-slate-800 text-sm mt-1.5">{sop.name}</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded font-bold">{sop.status}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{sop.purpose}</p>

                  {/* Flowchart Steps Timeline */}
                  <div className="flex items-center flex-wrap gap-2.5 pt-2">
                    {sop.steps.map((st, i) => (
                      <React.Fragment key={st.id}>
                        <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex items-center gap-2 max-w-[180px]">
                          <span className="w-5 h-5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {st.stepNumber}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-800 block truncate">{st.name}</span>
                            <span className="text-[9px] text-slate-400 block truncate font-medium">{st.role}</span>
                          </div>
                        </div>
                        {i < sop.steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual SOP flowchart Builder Sidebar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">{isRTL ? 'مصمم ومحاكي الإجراءات التفاعلي' : 'Interactive SOP Visual Designer'}</h4>
            <p className="text-xs text-slate-500">{isRTL ? 'أنشئ تسلسلاً للمهام واعتماد الحركات المالية لضمان سلامتها شرعياً قبل الصرف.' : 'Compose secure compliance checking steps dynamically. Link execution steps with authorization roles.'}</p>

            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3.5 space-y-3.5">
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'اسم الإجراء' : 'SOP Flow Name'}</label>
                  <input type="text" value={newSopName} onChange={(e) => setNewSopName(e.target.value)} placeholder="e.g. Mudaraba Joint Capital Setup" className="w-full bg-white border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'القسم الحركي' : 'Department'}</label>
                  <input type="text" value={newSopDept} onChange={(e) => setNewSopDept(e.target.value)} placeholder="Treasury, Sales..." className="w-full bg-white border p-2 rounded" />
                </div>
              </div>

              {/* Step Composer form */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{isRTL ? 'إضافة خطوة جديدة للمسار' : 'Add Node to Flow'}</span>
                <div className="space-y-1.5 text-xs">
                  <input type="text" value={tempStepName} onChange={(e) => setTempStepName(e.target.value)} placeholder="Task/Check details..." className="w-full bg-white border p-1.5 rounded text-xs" />
                  <select value={tempStepRole} onChange={(e) => setTempStepRole(e.target.value)} className="w-full bg-white border p-1.5 rounded text-xs">
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Sharia Reviewer">Sharia Reviewer</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Operations Manager">Operations Manager</option>
                  </select>
                </div>
                <button onClick={handleAddSopStep} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1.5 px-2 rounded transition flex items-center justify-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5" /> {isRTL ? 'إضافة خطوة' : 'Insert Step'}
                </button>
              </div>

              {/* Dynamic steps summary */}
              {sopSteps.length > 0 && (
                <div className="border-t border-slate-200 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 block">{isRTL ? 'ترتيب الخطوات:' : 'Sequence Preview:'}</span>
                  <div className="space-y-1">
                    {sopSteps.map((st, idx) => (
                      <div key={idx} className="bg-white border p-1.5 rounded text-[10px] flex justify-between items-center">
                        <span className="font-bold">{idx + 1}. {st.name}</span>
                        <span className="text-slate-400">{st.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (newSopName) {
                    onAddSOP({
                      id: `sop-${Date.now()}`,
                      organizationId: 'org-al-noor',
                      name: newSopName,
                      department: newSopDept || 'Operations',
                      purpose: newSopPurp || 'Custom defined procedure workflow.',
                      steps: sopSteps.map((s, idx) => ({ id: `s-st-${idx}`, stepNumber: idx + 1, ...s })),
                      status: 'Draft'
                    });
                    setNewSopName('');
                    setNewSopDept('');
                    setSopSteps([]);
                  }
                }}
                disabled={!newSopName}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-3 rounded-lg transition mt-4 flex items-center justify-center gap-2 shadow"
              >
                <Check className="w-4 h-4" /> {isRTL ? 'حفظ وتفعيل المسار' : 'Save and Compile SOP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. CUSTOM COMPLIANCE RULES */}
      {/* ==================================================== */}
      {subTab === 'rules' && (
        <div id="rules-tab" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'قواعد الرقابة والفرز التلقائي المخصصة' : 'Custom Automated Compliance Rules'}</h3>
            <button
              onClick={() => setShowRuleModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> {t.addRule}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customRules.map((rule) => (
              <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-display font-bold text-slate-800 text-sm">{rule.name}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      rule.severity === 'High' ? 'bg-red-100 text-red-800' : rule.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{rule.description}</p>

                  <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[10px] font-mono text-slate-600 mt-3.5 space-y-1">
                    <div><span className="font-bold text-emerald-600">IF: </span>{rule.condition}</div>
                    <div><span className="font-bold text-slate-500">THEN: </span>{rule.action}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className={`text-[10px] font-bold ${rule.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ● {rule.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-600">{isRTL ? 'تعديل' : 'Edit'}</button>
                    <button className="text-[10px] font-bold text-red-600 hover:underline">{isRTL ? 'حذف' : 'Delete'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Rule creation Modal */}
          {showRuleModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-250 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
                <h4 className="text-base font-display font-bold text-slate-900">{isRTL ? 'إضافة قاعدة تدقيق مخصصة' : 'Add Custom Filtering Rule'}</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'اسم القاعدة' : 'Rule Name'}</label>
                    <input type="text" value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} placeholder="e.g. purification delay check" className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الوصف' : 'Description'}</label>
                    <input type="text" value={newRuleDesc} onChange={(e) => setNewRuleDesc(e.target.value)} placeholder="Trigger if asset transfer is lagged..." className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الشرط المنطقي (قيمة الفحص)' : 'Condition Expression'}</label>
                    <input type="text" value={newRuleCond} onChange={(e) => setNewRuleCond(e.target.value)} placeholder="asset_delivery_days > 3" className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'الإجراء المتخذ عند الاكتشاف' : 'Consequent Action'}</label>
                    <input type="text" value={newRuleAct} onChange={(e) => setNewRuleAct(e.target.value)} placeholder="Flag transaction and alert Auditor" className="w-full bg-slate-50 border p-2 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">{isRTL ? 'مستوى الخطورة' : 'Severity'}</label>
                      <select value={newRuleSev} onChange={(e) => setNewRuleSev(e.target.value as any)} className="w-full bg-slate-50 border p-2 rounded-lg">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 text-xs font-bold">
                  <button onClick={() => setShowRuleModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-lg">{isRTL ? 'إلغاء' : 'Cancel'}</button>
                  <button onClick={() => {
                    if (newRuleName) {
                      onAddRule({
                        id: `rule-${Date.now()}`,
                        organizationId: 'org-al-noor',
                        name: newRuleName,
                        description: newRuleDesc,
                        category: 'Custom Rule',
                        condition: newRuleCond,
                        severity: newRuleSev,
                        action: newRuleAct,
                        status: 'Active'
                      });
                      setShowRuleModal(false);
                      setNewRuleName('');
                      setNewRuleDesc('');
                      setNewRuleCond('');
                      setNewRuleAct('');
                    }
                  }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg">{isRTL ? 'حفظ القاعدة' : 'Save Rule'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. COMPLIANCE REVIEWERS */}
      {/* ==================================================== */}
      {subTab === 'reviewers' && (
        <div id="reviewers-tab" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'تخصيص الصلاحيات وأطراف التدقيق الحركي' : 'Compliance Reviewers Assignments'}</h3>
          <p className="text-xs text-slate-500">{isRTL ? 'تعيين صلاحيات فحص الحركات وتدقيق فتاوى المنتجات وسلامة العقود.' : 'Delegate specific verification scope or financial categories to certified internal audit officials.'}</p>

          <div className="space-y-3 max-w-xl text-xs">
            {users.map((u) => (
              <div key={u.id} className="border border-slate-150 p-4 rounded-xl flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    {u.name.substring(0, 1)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{u.name}</h5>
                    <p className="text-[10px] text-slate-400">{u.jobTitle} - {u.department}</p>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                  {u.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. CONFIGURATION APPROVAL WORKFLOW */}
      {/* ==================================================== */}
      {subTab === 'approval' && (
        <div id="approval-tab" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'مخطط سير عملية موافقة تهيئة الامتثال' : 'Compliance Configuration Workflow Blueprint'}</h3>
            <p className="text-xs text-slate-400">{isRTL ? 'تحقق ومصادقة إلكترونية ثنائية بواسطة مراقب الامتثال ورئيس الهيئة الشرعية.' : 'Interactive visual timeline of the governance schema deployment and approval checkpoints.'}</p>
          </div>

          <div className="relative border-l-2 border-slate-100 pl-6 space-y-8 py-2 text-xs">
            {/* Step 1: Draft */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 bg-emerald-600 text-white p-1 rounded-full"><Check className="w-3.5 h-3.5" /></span>
              <h4 className="font-bold text-slate-800">{isRTL ? 'صياغة تهيئة إطار العمل' : '1. Core Configuration Structured'}</h4>
              <p className="text-slate-400 mt-1">{isRTL ? 'تم إنشاء إعدادات التهيئة والمستندات بنجاح.' : 'Framework scope, standards, and screening modules specified.'}</p>
            </div>

            {/* Step 2: Under Review */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 bg-emerald-600 text-white p-1 rounded-full"><Check className="w-3.5 h-3.5" /></span>
              <h4 className="font-bold text-slate-800">{isRTL ? 'تقديم الملف وقواعد الفرز والتصفية' : '2. Submitted and Awaiting Validation'}</h4>
              <p className="text-slate-400 mt-1">{isRTL ? 'تم تقديم الملف للتدقيق ومصادقة اللجان.' : 'All policies and custom check criteria package submitted for Sharia Supervisory board review.'}</p>
            </div>

            {/* Step 3: Pending Approval */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 bg-yellow-500 text-white p-1 rounded-full"><AlertCircle className="w-3.5 h-3.5" /></span>
              <h4 className="font-bold text-yellow-600">{isRTL ? 'توقيع الهيئة الشرعية والموافقة النهائية' : '3. Final Sharia board Sign-off'}</h4>
              <p className="text-slate-400 mt-1">{isRTL ? 'رئيس الهيئة يراجع المستندات للموافقة الإلكترونية.' : 'Chairman signature needed to activate custom interest purification routing rule and SOPs.'}</p>
              
              <div className="flex gap-2.5 mt-3">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-[10px] transition shadow">
                  {isRTL ? 'توقيع واعتماد التهيئة' : 'Sign & Approve Config'}
                </button>
                <button className="bg-red-50 border border-red-200 text-red-600 font-bold py-1.5 px-3 rounded text-[10px] transition hover:bg-red-100">
                  {isRTL ? 'طلب مراجعة إضافية' : 'Request Adjustments'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
