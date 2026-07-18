import React from 'react';
import {
  Shield,
  BookOpen,
  FileText,
  AlertTriangle,
  Award,
  Cpu,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import { ActivityLog } from '../types';

interface DashboardViewProps {
  stats: {
    score: number;
    standards: number;
    documents: number;
    findings: number;
    certificates: number;
    systems: number;
  };
  activityLogs: ActivityLog[];
  locale: 'en' | 'ar';
}

export default function DashboardView({ stats, activityLogs, locale }: DashboardViewProps) {
  const isRTL = locale === 'ar';

  const t = {
    overallScore: isRTL ? 'معدل الامتثال الشرعي العام' : 'Overall Compliance Score',
    activeStandards: isRTL ? 'معايير الامتثال النشطة' : 'Active Standards',
    documentsUploaded: isRTL ? 'المستندات المرفوعة' : 'Documents Uploaded',
    openFindings: isRTL ? 'الملاحظات والنتائج المفتوحة' : 'Open Findings',
    certificates: isRTL ? 'الشهادات الرقمية النشطة' : 'Digital Certificates',
    connectedSystems: isRTL ? 'الأنظمة ومصادر البيانات' : 'Connected Systems',
    trendTitle: isRTL ? 'منحنى معدل الامتثال العام (٢٠٢٦)' : 'Compliance Score Trend (2026)',
    riskTitle: isRTL ? 'توزيع مستويات المخاطر الشرعية' : 'Sharia Risk Distribution',
    findingsTitle: isRTL ? 'الملاحظات المفتوحة حسب التصنيف' : 'Findings by Category',
    recentActivity: isRTL ? 'أحدث سجلات التدقيق والنشاط' : 'Recent Audit Activity',
    viewAll: isRTL ? 'عرض الكل' : 'View All',
    purificationLabel: isRTL ? 'حسابات التطهير المالي' : 'Purification Holds',
    shariaBoard: isRTL ? 'توقيعات الهيئة الشرعية' : 'Sharia Board Signatures'
  };

  // Mock Category Distribution
  const categories = [
    { name: isRTL ? 'تمويل المرابحة' : 'Murabaha Retail', count: 5, color: 'bg-emerald-500' },
    { name: isRTL ? 'معاملات الخزينة' : 'Treasury Al-Mousawamah', count: 3, color: 'bg-yellow-500' },
    { name: isRTL ? 'العقود والموردين' : 'Vendor Procurement', count: 2, color: 'bg-amber-600' },
    { name: isRTL ? 'الإيرادات المختلطة' : 'Mixed Revenue Stream', count: 2, color: 'bg-red-500' }
  ];

  return (
    <div id="dashboard-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Compliance Score */}
        <div id="stat-score" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.overallScore}</span>
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-slate-900">{stats.score}%</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +1.4% {isRTL ? 'هذا الشهر' : 'vs last month'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-slate-100 h-1.5">
            <div className="bg-emerald-500 h-1.5 transition-all duration-500" style={{ width: `${stats.score}%` }} />
          </div>
        </div>

        {/* Active Standards */}
        <div id="stat-standards" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.activeStandards}</span>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-slate-900">{stats.standards}</span>
            <span className="text-xs text-slate-400 block mt-1">{isRTL ? 'أيوفي وإف إس بي' : 'AAOIFI & IFSB active'}</span>
          </div>
        </div>

        {/* Documents Uploaded */}
        <div id="stat-documents" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.documentsUploaded}</span>
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-slate-900">{stats.documents}</span>
            <span className="text-xs text-slate-400 block mt-1">{isRTL ? 'جاهزة للمعالجة بالذكاء الاصطناعي' : 'Indexed & AI-Ready'}</span>
          </div>
        </div>

        {/* Open Findings */}
        <div id="stat-findings" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.openFindings}</span>
            <div className="bg-red-100 p-2 rounded-lg text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-red-600">{stats.findings}</span>
            <span className="text-xs text-slate-400 block mt-1">{isRTL ? 'تتطلب تصحيحاً ومراجعة' : 'Requires purification'}</span>
          </div>
        </div>

        {/* Digital Certificates */}
        <div id="stat-certificates" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.certificates}</span>
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-800">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-slate-900">{stats.certificates}</span>
            <span className="text-xs text-slate-400 block mt-1">{isRTL ? 'شهادات متوافقة نشطة' : 'Active Digital Seals'}</span>
          </div>
        </div>

        {/* Connected Systems */}
        <div id="stat-systems" className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.connectedSystems}</span>
            <div className="bg-slate-100 p-2 rounded-lg text-slate-700">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-display font-bold text-slate-900">{stats.systems}</span>
            <span className="text-xs text-slate-400 block mt-1">{isRTL ? 'تكامل في الوقت الفعلي' : 'ERP connectors live'}</span>
          </div>
        </div>
      </div>

      {/* Main Charts Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">{t.trendTitle}</h3>
              <p className="text-xs text-slate-400">{isRTL ? 'مراقبة تطور الامتثال الفصلي للمؤسسة' : 'Quarterly tracking of corporate compliance rate'}</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">95% {isRTL ? 'مكتمل' : 'Target Achieved'}</span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-64 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" />

              {/* Shaded Area under the curve */}
              <path
                d="M 10,180 L 100,160 L 200,150 L 300,120 L 400,60 L 490,40 L 490,200 L 10,200 Z"
                fill="url(#gradient-emerald)"
                opacity="0.15"
              />

              {/* Line */}
              <path
                d="M 10,180 L 100,160 L 200,150 L 300,120 L 400,60 L 490,40"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="10" cy="180" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="100" cy="160" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="200" cy="150" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="300" cy="120" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="60" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="490" cy="40" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

              {/* Definitions */}
              <defs>
                <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
            {/* Legend */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
              <span>{isRTL ? 'الربع الأول' : 'Q1 Jan'}</span>
              <span>{isRTL ? 'الربع الثاني' : 'Q2 Apr'}</span>
              <span>{isRTL ? 'الربع الثالث' : 'Q3 Jul'}</span>
              <span>{isRTL ? 'الربع الرابع' : 'Q4 Oct'}</span>
              <span>{isRTL ? 'المتوقع' : 'Target (Dec)'}</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-slate-900 text-base mb-4">{t.riskTitle}</h3>
          
          <div className="space-y-4">
            {/* High risk */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{isRTL ? 'مخاطر عالية (شبهة ربا / تأخير معالجة)' : 'High Risk (E.g. Interest Flags)'}</span>
                <span className="font-bold text-red-600">12%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Medium risk */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{isRTL ? 'مخاطر متوسطة (عقود موردين تحتاج تدقيق)' : 'Medium Risk (E.g. Procurement Terms)'}</span>
                <span className="font-bold text-yellow-600">28%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            {/* Low risk */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>{isRTL ? 'مخاطر منخفضة (إجرائية / تنظيمية)' : 'Low Risk (SOP Adjustments)'}</span>
                <span className="font-bold text-emerald-600">60%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Shield and compliance seal info */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 mt-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">{isRTL ? 'الذكاء الاصطناعي متاح للتشخيص' : 'Compliance Shield Status'}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {isRTL 
                    ? 'يقوم محرك البحث الاستباقي ومحلل الرشيد بفحص دوري لتجنب المعاملات الربوية.' 
                    : 'AI engine is continuously screening ERP databases to ensure compliant liquidity flow.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings By Category and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Findings by Category */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-bold text-slate-900 text-base mb-4">{t.findingsTitle}</h3>
          
          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${c.color}`} />
                  <span className="text-xs font-medium text-slate-700">{c.name}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded">
                  {c.count} {isRTL ? 'ملاحظات' : 'findings'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-900 text-base">{t.recentActivity}</h3>
            <span className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer">{t.viewAll}</span>
          </div>

          <div className="space-y-3.5">
            {activityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start gap-3.5 border-b border-slate-100 pb-3 last:border-none last:pb-0">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-600 shrink-0">
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-800">{log.userName}</p>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{log.details}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mt-1">
                    {log.userRole.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
