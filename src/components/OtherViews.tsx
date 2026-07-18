import React, { useState } from 'react';
import {
  Building,
  Server,
  Cpu,
  FileSpreadsheet,
  Award,
  Activity,
  Settings,
  Shield,
  CheckCircle,
  AlertOctagon,
  RefreshCw,
  Send,
  Sparkles,
  Download,
  Users,
  UserCheck,
  Lock,
  Search,
  Check
} from 'lucide-react';
import { User, ActivityLog, Organization } from '../types';
import IntegrationsView from './IntegrationsView';

interface OtherViewsProps {
  viewName: 'Organization' | 'Integrations' | 'AI Compliance Engine' | 'Reports' | 'Certification' | 'Monitoring' | 'Administration' | 'Settings';
  users: User[];
  activityLogs: ActivityLog[];
  organization: Organization;
  locale: 'en' | 'ar';
  theme: 'light' | 'dark';
  onUpdateLocale: (lang: 'en' | 'ar') => void;
  onUpdateTheme: (th: 'light' | 'dark') => void;
  onAddUser: (user: User) => void;
  onTriggerActivityLog?: (action: string, details: string) => void;
}

export default function OtherViews({
  viewName,
  users,
  activityLogs,
  organization,
  locale,
  theme,
  onUpdateLocale,
  onUpdateTheme,
  onAddUser,
  onTriggerActivityLog
}: OtherViewsProps) {
  const isRTL = locale === 'ar';

  // AI Prompt Sandbox state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);


  // User Management Form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<any>('COMPLIANCE OFFICER');
  const [newUserDept, setNewUserDept] = useState('Compliance');

  // Certification state
  const [certRequested, setCertRequested] = useState(false);

  // AI compliance analysis simulator
  const handleAiCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;

    setAiLoading(true);
    setAiResult(null);

    setTimeout(() => {
      setAiLoading(false);
      const textLower = aiPrompt.toLowerCase();
      if (textLower.includes('riba') || textLower.includes('interest') || textLower.includes('penalty')) {
        setAiResult(
          isRTL
            ? '🔴 تحذير امتثال شرعي: تم الكشف عن بند "فائدة تأخيرية" أو "ربا". تفرض اللائحة تحويل هذه الإيرادات بالكامل إلى صندوق التطهير الخيري وعدم تسجيلها كأرباح.'
            : '🔴 COMPLIANCE CRITICAL WARNING: Clause contains "Riba" or "Compound Interest" concepts. AAOIFI Standard No. 8 forbids compound late penalty revenue. Income must be diverted to the Purification Account immediately.'
        );
      } else if (textLower.includes('murabaha') || textLower.includes('buy') || textLower.includes('purchase')) {
        setAiResult(
          isRTL
            ? '🟢 متوافق شرعياً: معاملة مرابحة قياسية. تم التحقق من نقل ملكية الأصل وسجل الضمان بالتتابع.'
            : '🟢 COMPLIANCE OK: Murabaha asset sequencing matches standard constraints. Serial logs verify Al Noor assumed physical possession before secondary sale transfer.'
        );
      } else {
        setAiResult(
          isRTL
            ? '🟡 تنبيه تدقيق: لم يتم رصد أي بنود عالية الخطورة. يوصى بمراجعة يدوية للضمانات وتصاريح الصرف.'
            : '🟡 COMPLIANCE NOTICE: Standard operational terms flagged. No high-risk elements detected, but manual review is suggested for transaction warrants.'
        );
      }
    }, 1200);
  };

  return (
    <div id="other-views-container" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* ==================================================== */}
      {/* 1. ORGANIZATION MODULE */}
      {/* ==================================================== */}
      {viewName === 'Organization' && (
        <div id="view-organization" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            <span className="text-4xl">{organization.logo || '🕌'}</span>
            <div>
              <h3 className="font-display font-bold text-slate-950 text-lg">{organization.name}</h3>
              <p className="text-xs text-slate-400">{organization.businessType} - {organization.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-700 block">{isRTL ? 'القطاع' : 'Industry'}</span>
              <span className="text-slate-600 block">{organization.industry}</span>
            </div>
            <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-700 block">{isRTL ? 'معدل التوظيف' : 'SaaS Tenants Count'}</span>
              <span className="text-slate-600 block">{organization.employeesCount} {isRTL ? 'موظفين' : 'employees'}</span>
            </div>
            <div className="bg-slate-50 border p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-700 block">{isRTL ? 'اشتراك المؤسسة' : 'Subscription Status'}</span>
              <span className="text-emerald-700 font-bold block">● {organization.subscriptionStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. UNIVERSAL ERP INTEGRATION FRAMEWORK */}
      {/* ==================================================== */}
      {viewName === 'Integrations' && (
        <IntegrationsView
          locale={locale}
          theme={theme}
          onTriggerActivityLog={onTriggerActivityLog || (() => {})}
        />
      )}

      {/* ==================================================== */}
      {/* 3. AI COMPLIANCE ENGINE */}
      {/* ==================================================== */}
      {viewName === 'AI Compliance Engine' && (
        <div id="view-ai-engine" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-yellow-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">{isRTL ? 'محاكي الفحص والتحليل بالذكاء الاصطناعي (AI Auditor)' : 'AI Compliance Reasoner'}</h3>
              <p className="text-xs text-slate-400">{isRTL ? 'أدخل تفاصيل الحركات أو بنود العقود لفحصها بالذكاء الاصطناعي ومطابقتها لمعايير أيوفي والسياسات الداخلية.' : 'Simulate transaction or contract clause audits directly against configured reference frameworks.'}</p>
            </div>
          </div>

          <form onSubmit={handleAiCheck} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500">{isRTL ? 'تفاصيل الحركة المالية أو العقد للمراجعة:' : 'Input Contract Clause / Transaction metadata:'}</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={isRTL ? 'مثال: "قرض مرابحة بقيمة ١٠٠٠٠ دولار بفائدة تأخير تبلغ ٥٪ شهرياً في حال العجز عن السداد..."' : 'E.g., "Murabaha financing layout of $10,000 where client is charged a late payment compound fee of 5% directly as profit..."'}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={aiLoading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs py-2.5 px-5 rounded-lg transition flex items-center gap-1.5 shadow"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isRTL ? 'تشغيل فحص الامتثال الشرعي الذكي' : 'Execute AI Audit'}
            </button>
          </form>

          {aiResult && (
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2 mt-4 text-xs">
              <span className="font-bold text-slate-500 block">{isRTL ? 'تقرير تشخيص محرك الامتثال الذكي:' : 'AI Auditor Response Report:'}</span>
              <p className="leading-relaxed font-sans">{aiResult}</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. REPORTS GENERATOR */}
      {/* ==================================================== */}
      {viewName === 'Reports' && (
        <div id="view-reports" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">{isRTL ? 'تقارير تدقيق الامتثال الشرعي السنوية' : 'Annual Audit Reporting Ledger'}</h3>
              <p className="text-xs text-slate-400">{isRTL ? 'أوراق تدقيق متكاملة موثقة إلكترونياً للتوافق والاشتراكات.' : 'Download complete audit sheets with certified digital signatures.'}</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition flex items-center gap-1.5 shadow">
              <Download className="w-4 h-4" /> {isRTL ? 'تحميل ورقة التدقيق الشاملة' : 'Download Complete Audit'}
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="border border-slate-150 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span>{isRTL ? 'التقرير الربع سنوي الثاني - حوكمة المرابحة' : 'Q2 Compliance & Asset Purification audit'}</span>
                <span className="text-emerald-600">95% {isRTL ? 'متوافق' : 'Compliant'}</span>
              </div>
              <p className="text-slate-400 text-[11px]">{isRTL ? 'تم التدقيق دلالياً في ١٢ يونيو ٢٠٢٦ ضد معيار أيوفي رقم ٨.' : 'Verified against AAOIFI standard No. 8 constraints on June 12, 2026.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. DIGITAL CERTIFICATION */}
      {/* ==================================================== */}
      {viewName === 'Certification' && (
        <div id="view-certification" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-slate-950 text-base">{isRTL ? 'شهادة الامتثال الرقمية المعتمدة لـ Al Noor' : 'Al Noor Certified Digital Compliance Seal'}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isRTL 
                ? 'تحصل المؤسسات التي تحافظ على معدل امتثال يفوق ٩٠٪ بشكل مستمر على ختم الجودة والشرعية الرقمي المعتمد من ICAP.' 
                : 'Organizations keeping overall score above 90% continuously receive the certified digital compliance seal.'}
            </p>

            <div className="bg-slate-50 border p-6 rounded-2xl relative overflow-hidden">
              <div className="border-2 border-emerald-600 rounded-lg p-4 bg-white text-center shadow space-y-2">
                <span className="text-emerald-700 font-bold block text-sm tracking-wide font-display">ICAP CERTIFIED</span>
                <span className="text-[10px] text-slate-500 block uppercase">Islamic Compliance AI Verified Seal</span>
                <span className="text-xs font-mono font-bold text-slate-800 block">ID: NOOR-2026-COMP</span>
              </div>
            </div>

            <button
              onClick={() => setCertRequested(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-6 rounded-lg transition shadow-md"
            >
              {certRequested ? (isRTL ? 'تم تقديم الطلب للهيئة' : 'Awaiting Board Sign-off') : (isRTL ? 'طلب شهادة دورية جديدة' : 'Request Updated Certificate')}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. RISK MONITORING & AUDIT LOGS */}
      {/* ==================================================== */}
      {viewName === 'Monitoring' && (
        <div id="view-monitoring" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-base">{isRTL ? 'سجلات التدقيق والمتابعة الحية للمؤسسة' : 'SaaS Isolated Audit Trail'}</h3>
            <p className="text-xs text-slate-400">{isRTL ? 'سجل حركات التدقيق معزول تماماً ومحمي من الفحص غير المصرح به.' : 'Continuous monitoring of metadata mutations and system accesses filtered by tenant.'}</p>
          </div>

          <div className="space-y-3 text-xs max-h-[300px] overflow-y-auto">
            {activityLogs.map((log) => (
              <div key={log.id} className="bg-slate-50 border p-3 rounded-lg flex justify-between items-start gap-4">
                <div>
                  <span className="font-bold text-slate-800 block">{log.userName}</span>
                  <p className="text-[11px] text-slate-500 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. ADMINISTRATION & USER MANAGEMENT */}
      {/* ==================================================== */}
      {viewName === 'Administration' && (
        <div id="view-admin" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-display font-bold text-slate-800">{isRTL ? 'إدارة حسابات وموظفي التدقيق' : 'User Accounts Directory'}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-150">
                <tr>
                  <th className="p-4">{isRTL ? 'الاسم' : 'Name'}</th>
                  <th className="p-4">{isRTL ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="p-4">{isRTL ? 'الدور الوظيفي' : 'Role'}</th>
                  <th className="p-4">{isRTL ? 'القسم' : 'Department'}</th>
                  <th className="p-4">{isRTL ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-900">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 font-mono uppercase text-[10px] font-bold text-emerald-800">{u.role.replace('_', ' ')}</td>
                    <td className="p-4">{u.department || 'Operations'}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User addition quick form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-xl space-y-4">
            <h4 className="font-display font-bold text-slate-800 text-xs">{isRTL ? 'دعوة عضو جديد لقسم الامتثال' : 'Invite New Compliance Professional'}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder={isRTL ? 'الاسم الكامل' : 'Full Name'}
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-slate-50 border p-2 rounded"
              />
              <input
                type="email"
                placeholder={isRTL ? 'البريد الإلكتروني' : 'Corporate Email'}
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="bg-slate-50 border p-2 rounded"
              />
            </div>
            <button
              onClick={() => {
                if (newUserName && newUserEmail) {
                  onAddUser({
                    id: `user-${Date.now()}`,
                    organizationId: 'org-al-noor',
                    name: newUserName,
                    email: newUserEmail,
                    role: newUserRole,
                    status: 'Active',
                    createdAt: new Date().toISOString()
                  });
                  setNewUserName('');
                  setNewUserEmail('');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded transition shadow"
            >
              {isRTL ? 'إرسال دعوة الانضمام' : 'Dispatch Invite'}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. SETTINGS MODULE */}
      {/* ==================================================== */}
      {viewName === 'Settings' && (
        <div id="view-settings" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-slate-900 text-base border-b border-slate-100 pb-3">{isRTL ? 'تعديل الخصائص وإعدادات المنصة' : 'Platform Preferences & Language Settings'}</h3>

          <div className="space-y-4 text-xs max-w-md">
            {/* Language switches */}
            <div className="flex justify-between items-center border-b pb-3 border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">{isRTL ? 'اللغة الافتراضية للمستندات والواجهة' : 'Primary Language Context'}</span>
                <span className="text-slate-400 text-[10px]">{isRTL ? 'تبديل واجهات العرض والاتجاه RTL / LTR تلقائياً.' : 'Swaps layouts between English (LTR) and Arabic (RTL) natively.'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateLocale('en')}
                  className={`px-3 py-1.5 rounded font-bold transition ${
                    locale === 'en' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => onUpdateLocale('ar')}
                  className={`px-3 py-1.5 rounded font-bold transition ${
                    locale === 'ar' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Theme selector */}
            <div className="flex justify-between items-center pb-3 border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block">{isRTL ? 'مظهر واجهة المستخدم' : 'Theme Preferences'}</span>
                <span className="text-slate-400 text-[10px]">{isRTL ? 'تخصيص المظهر المناسب للعمل.' : 'Select Slate Dark or Classic Light themes.'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateTheme('light')}
                  className={`px-3 py-1.5 rounded font-bold transition ${
                    theme === 'light' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isRTL ? 'نهاري' : 'Light'}
                </button>
                <button
                  onClick={() => onUpdateTheme('dark')}
                  className={`px-3 py-1.5 rounded font-bold transition ${
                    theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isRTL ? 'ليلي' : 'Dark Theme'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
