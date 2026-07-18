import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  RefreshCw,
  Eye,
  Trash2,
  FileCode,
  Network,
  Share2,
  Check,
  ChevronRight,
  Database,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import {
  KnowledgeDocument,
  KnowledgeCategory,
  KnowledgeNode,
  DocumentCategory
} from '../types';

interface KnowledgeCenterViewProps {
  documents: KnowledgeDocument[];
  categories: KnowledgeCategory[];
  knowledgeNodes: KnowledgeNode[];
  locale: 'en' | 'ar';
  onAddDocument: (doc: KnowledgeDocument) => void;
  onUpdateDocStatus: (docId: string, status: any, procStatus: any) => void;
}

export default function KnowledgeCenterView({
  documents,
  categories,
  knowledgeNodes,
  locale,
  onAddDocument,
  onUpdateDocStatus
}: KnowledgeCenterViewProps) {
  const isRTL = locale === 'ar';
  const [subTab, setSubTab] = useState<'kd-dashboard' | 'kd-repository' | 'kd-pipeline' | 'kd-search' | 'kd-categories' | 'kd-versions' | 'kd-graph'>('kd-dashboard');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Upload/Pipeline Simulator state
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  // Selected document for details/preview view
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);

  // Selected Graph Node state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const t = {
    title: isRTL ? 'مركز المعرفة الشرعية والتدقيق' : 'Compliance Knowledge Center',
    dashboard: isRTL ? 'لوحة قيادة المعرفة' : 'Knowledge Dashboard',
    repository: isRTL ? 'مستودع الوثائق' : 'Documents Repository',
    pipeline: isRTL ? 'خط معالجة البيانات والذكاء الاصطناعي' : 'Processing Pipeline',
    search: isRTL ? 'البحث الذكي المتقدم' : 'Knowledge Search',
    categories: isRTL ? 'تصنيفات المعرفة' : 'Knowledge Categories',
    versions: isRTL ? 'إدارة الإصدارات والنسخ' : 'Version Management',
    graph: isRTL ? 'مخطط العلاقات والروابط' : 'Knowledge Graph',
    uploadLabel: isRTL ? 'رفع وثيقة جديدة' : 'Upload New Document',
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  // Trigger processing pipeline simulation when a document is uploaded
  const handleSimulateUpload = (fileName: string, category: DocumentCategory) => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: KnowledgeDocument = {
      id: newDocId,
      organizationId: 'org-al-noor',
      name: fileName,
      category: category,
      version: '1.0',
      status: 'Draft',
      processingStatus: 'Uploaded',
      uploadedBy: 'Fatima Al-Sayed',
      uploadedDate: new Date().toISOString().split('T')[0],
      size: '3.4 MB',
      type: fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.xlsx') ? 'XLSX' : 'DOCX',
      extractedText: 'Processing draft. AI extractor is running. Sharia purification codes being classified.',
      metadata: {
        author: 'Internal Operations Division',
        effectiveDate: new Date().toISOString().split('T')[0],
        organization: 'Al Noor Islamic Finance Group',
        references: ['SOP-1'],
        keywords: ['Draft', 'Audit', 'Governance']
      }
    };

    onAddDocument(newDoc);
    setSelectedDocId(newDocId);
    setSubTab('kd-pipeline');
    setUploadingDoc(fileName);
    setPipelineProgress(10);
    setPipelineStep(1);

    // Step-by-step pipeline simulation
    setTimeout(() => {
      onUpdateDocStatus(newDocId, 'Draft', 'Processing');
      setPipelineProgress(30);
      setPipelineStep(2);
    }, 1000);

    setTimeout(() => {
      onUpdateDocStatus(newDocId, 'Draft', 'Extracting Text');
      setPipelineProgress(55);
      setPipelineStep(3);
    }, 2500);

    setTimeout(() => {
      onUpdateDocStatus(newDocId, 'Draft', 'Analyzing');
      setPipelineProgress(80);
      setPipelineStep(4);
    }, 4000);

    setTimeout(() => {
      onUpdateDocStatus(newDocId, 'Approved', 'Ready');
      setPipelineProgress(100);
      setPipelineStep(5);
      setUploadingDoc(null);
    }, 5500);
  };

  // Search Results filtering
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.extractedText && doc.extractedText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="knowledge-center-view" className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Tab Header and Sub Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">{t.title}</h2>
          <p className="text-xs text-slate-400">
            {isRTL 
              ? 'تحويل معايير المعاملات وفتاوى التطهير المالي إلى قاعدة بيانات قابلة للفرز والتشخيص ذكياً.' 
              : 'Structure regulatory standards, investment guides and fatwas into version-controlled compliance intelligence.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['kd-dashboard', 'kd-repository', 'kd-pipeline', 'kd-search', 'kd-categories', 'kd-versions', 'kd-graph'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`text-xs font-bold px-3 py-2 rounded-md transition ${
                subTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t[tab.replace('kd-', '') as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. KNOWLEDGE DASHBOARD */}
      {/* ==================================================== */}
      {subTab === 'kd-dashboard' && (
        <div id="kd-dashboard-tab" className="space-y-6">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'إجمالي مستندات المعرفة' : 'Total Documents'}</span>
              <span className="text-2xl font-display font-bold text-slate-900">{documents.length}</span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'وثائق تمت معالجتها جاهزة' : 'Processed (AI-Ready)'}</span>
              <span className="text-2xl font-display font-bold text-emerald-600">
                {documents.filter((d) => d.processingStatus === 'Ready').length}
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'قيد التحليل والمعالجة' : 'Processing Now'}</span>
              <span className="text-2xl font-display font-bold text-yellow-600">
                {documents.filter((d) => d.processingStatus !== 'Ready' && d.processingStatus !== 'Failed').length}
              </span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'فئات المعاملات الحاكمة' : 'Knowledge Categories'}</span>
              <span className="text-2xl font-display font-bold text-slate-900">{categories.length}</span>
            </div>
            <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-2">{isRTL ? 'مراجع المعايير النشطة' : 'Standards Bound'}</span>
              <span className="text-2xl font-display font-bold text-indigo-600">7</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h4 className="font-display font-bold text-slate-800 text-sm mb-4">{isRTL ? 'توزيع الوثائق حسب تصنيفات الشريعة' : 'Documents by Category distribution'}</h4>
              <div className="space-y-3.5 text-xs">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex justify-between items-center border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                    <div>
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                    <span className="bg-slate-50 border border-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded">
                      {cat.documentCount} {isRTL ? 'ملفات' : 'files'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing and Embedding Readiness Indicator */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-slate-800 text-sm mb-2">{isRTL ? 'حالة جاهزية محرك البحث الدلالي (Embedding & Vector)' : 'AI Semantic Embedding Index Readiness'}</h4>
                <p className="text-xs text-slate-400 mb-4">{isRTL ? 'يفحص النظام جاهزية النصوص ومتجهات العلاقات لضمان نتائج بحث خالية من شبهة الهلوسة.' : 'Verifies vector alignment metrics and chunking boundaries to protect reasoning modules from hallucinating.'}</p>
              </div>

              <div className="space-y-3 text-xs border border-slate-100 rounded-lg p-4 bg-slate-50">
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'معالجة وتجزئة النصوص (Text Chunking)' : 'Text Chunking Pipeline'}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">● {isRTL ? 'مكتمل' : 'Completed'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'استخراج التصنيفات الشرعية التلقائي' : 'Topic Modeling Classification'}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">● {isRTL ? 'مكتمل' : 'Completed'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'فهرسة الكلمات المفتاحية الذكية' : 'Keywords and Reference Tagging'}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">● {isRTL ? 'مكتمل' : 'Completed'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'مصفوفة المتجهات الدلالية (Embeddings)' : 'Vector Embeddings (Dimension 1536)'}</span>
                  <span className="text-yellow-600 font-bold flex items-center gap-1">● {isRTL ? 'معلق بانتظار التحديث' : 'Pending Update'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                <span>{isRTL ? 'حالة التوافر العام للذكاء الاصطناعي:' : 'Overall AI Availability:'}</span>
                <span className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded font-bold">
                  {isRTL ? 'قيد التحديث' : 'Updating Index'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. DOCUMENTS REPOSITORY */}
      {/* ==================================================== */}
      {subTab === 'kd-repository' && (
        <div id="kd-repository-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-800">{isRTL ? 'ملفات ومستندات المؤسسة النشطة' : 'Corporate Document Vault'}</h4>
              <span className="text-xs text-slate-400">{filteredDocs.length} {isRTL ? 'وثائق موجودة' : 'document(s) found'}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-150">
                  <tr>
                    <th className="p-4">{isRTL ? 'اسم الملف' : 'Document Name'}</th>
                    <th className="p-4">{isRTL ? 'الفئة' : 'Category'}</th>
                    <th className="p-4">{isRTL ? 'الإصدار' : 'Version'}</th>
                    <th className="p-4">{isRTL ? 'معالجة الذكاء الاصطناعي' : 'AI Processing'}</th>
                    <th className="p-4">{isRTL ? 'الحالة' : 'Status'}</th>
                    <th className="p-4 text-center">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`hover:bg-slate-50/50 cursor-pointer transition ${
                        selectedDocId === doc.id ? 'bg-slate-50' : ''
                      }`}
                    >
                      <td className="p-4 font-bold text-slate-900 truncate max-w-[200px]">{doc.name}</td>
                      <td className="p-4">{doc.category}</td>
                      <td className="p-4 font-mono">{doc.version}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 font-bold ${
                          doc.processingStatus === 'Ready' ? 'text-emerald-600' : 'text-yellow-600'
                        }`}>
                          <RefreshCw className={`w-3 h-3 ${doc.processingStatus !== 'Ready' ? 'animate-spin' : ''}`} />
                          {doc.processingStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setSelectedDocId(doc.id)} className="text-slate-500 hover:text-emerald-600 p-1 rounded hover:bg-slate-100"><Eye className="w-4 h-4" /></button>
                          <button className="text-slate-500 hover:text-red-600 p-1 rounded hover:bg-slate-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick upload side panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">{isRTL ? 'إجراءات تحميل المستندات المباشرة' : 'Upload and Classify File'}</h4>
            <p className="text-xs text-slate-500">{isRTL ? 'اختر ملفاً لرفعه، وسيقوم نظام التدقيق التلقائي الذكي بفهرسة البيانات وتصنيفها مباشرة.' : 'Drop contract, fatwa, or financial spreadsheet. ICAP will run OCR & classified extraction sequence.'}</p>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => handleSimulateUpload('AAOIFI_Governance_Mudaraba_2026.pdf', 'Standards')}
                className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3 rounded-lg text-left text-xs font-bold text-slate-700 hover:text-slate-900 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>AAOIFI_Governance_Mudaraba_2026.pdf</span>
                </div>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">PDF</span>
              </button>

              <button
                onClick={() => handleSimulateUpload('Murabaha_Purification_Rates_2026.xlsx', 'Financial Documents')}
                className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-600 p-3 rounded-lg text-left text-xs font-bold text-slate-700 hover:text-slate-900 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Murabaha_Purification_Rates_2026.xlsx</span>
                </div>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">XLSX</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. DOCUMENT PROCESSING PIPELINE */}
      {/* ==================================================== */}
      {subTab === 'kd-pipeline' && (
        <div id="kd-pipeline-tab" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base">{isRTL ? 'معالجة واستخلاص النصوص التلقائي (OCR / Extraction)' : 'Document Processing Pipeline Status'}</h4>
              <p className="text-xs text-slate-400">{isRTL ? 'تتبع الخطوات الحركية الخمس لاستخلاص نصوص الفتاوى وتصنيفها دلالياً.' : 'Observe the granular 5-stage pipeline processing documents for semantic AI audits.'}</p>
            </div>
            {uploadingDoc && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded font-bold flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {isRTL ? 'معالجة جارية...' : 'Active Job...'}
              </span>
            )}
          </div>

          {/* Granular Pipeline Steps layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { id: 1, name: isRTL ? 'التحقق من صحة الملف' : 'File Validation', desc: isRTL ? 'التحقق من صيغة وحجم وجودة الملف.' : 'Type, size & integrity verification checks.' },
              { id: 2, name: isRTL ? 'استخراج النصوص وتجزئتها' : 'Text Extraction', desc: isRTL ? 'تحليل الصور الضوئية واستخلاص الكلمات.' : 'OCR engine running text stream extraction.' },
              { id: 3, name: isRTL ? 'التصنيف الشرعي الآلي' : 'Document Classification', desc: isRTL ? 'تحديد مواضيع الفقه والمعاملات المالية.' : 'Topic modeling to identify transactional themes.' },
              { id: 4, name: isRTL ? 'استخراج البيانات الوصفية (Metadata)' : 'Metadata Extraction', desc: isRTL ? 'جلب التواريخ، والجهات الحاكمة، والمراجع.' : 'Identifying dates, authors & reference codes.' },
              { id: 5, name: isRTL ? 'تهيئة المتجهات الدلالية' : 'Knowledge Index Prep', desc: isRTL ? 'تضمين الملف في نموذج البحث الذكي.' : 'Structuring documents for vector graph storage.' },
            ].map((st) => {
              const active = pipelineStep >= st.id;
              const current = pipelineStep === st.id;
              return (
                <div key={st.id} className={`border rounded-xl p-4.5 transition relative flex flex-col justify-between min-h-[140px] ${
                  current ? 'border-emerald-600 bg-emerald-50/20' : active ? 'border-emerald-100 bg-slate-50/50' : 'border-slate-100 text-slate-400'
                }`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                        active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {st.id}
                      </span>
                      {active && !current && <Check className="w-4 h-4 text-emerald-600" />}
                      {current && <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />}
                    </div>
                    <h5 className="text-xs font-bold text-slate-800">{st.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDoc && (
            <div className="border-t border-slate-150 pt-5 space-y-4">
              <h5 className="text-xs font-bold text-slate-700">{isRTL ? 'تفاصيل ومعاينة المستند المختار:' : 'Selected Document Metadata Preview:'}</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2">
                  <div><span className="text-slate-400 block">{isRTL ? 'اسم الملف:' : 'File Name:'}</span><span className="font-bold text-slate-800">{selectedDoc.name}</span></div>
                  <div><span className="text-slate-400 block">{isRTL ? 'التصنيف:' : 'Category:'}</span><span className="font-bold text-slate-800">{selectedDoc.category}</span></div>
                  <div><span className="text-slate-400 block">{isRTL ? 'الحجم والنوع:' : 'Type / Size:'}</span><span className="font-bold text-slate-800">{selectedDoc.type} - {selectedDoc.size}</span></div>
                  {selectedDoc.metadata?.keywords && (
                    <div className="pt-2">
                      <span className="text-slate-400 block mb-1">{isRTL ? 'الكلمات المفتاحية:' : 'Extracted Keywords:'}</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDoc.metadata.keywords.map((kw) => (
                          <span key={kw} className="bg-white border border-slate-200 text-[9px] font-bold text-slate-600 px-1.5 py-0.5 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl md:col-span-2 space-y-2">
                  <span className="text-slate-400 block font-bold mb-1">{isRTL ? 'معاينة النص المستخلص دلالياً:' : 'OCR Text Snippet Extracted:'}</span>
                  <div className="max-h-40 overflow-y-auto bg-white p-3 border border-slate-200 rounded-lg text-[11px] font-mono leading-relaxed text-slate-600">
                    {selectedDoc.extractedText || (isRTL ? 'لا يوجد نص مستخلص.' : 'No text content extracted.')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. ADVANCED KNOWLEDGE SEARCH */}
      {/* ==================================================== */}
      {subTab === 'kd-search' && (
        <div id="kd-search-tab" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <h4 className="text-sm font-bold text-slate-800">{isRTL ? 'البحث الشرعي الذكي ومراجعة الأحكام المرجعية' : 'Semantic Knowledge Search Engine'}</h4>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2 text-xs">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'ابحث في المعايير والسياسات مثل "المرابحة" أو "الربا" ...' : 'Search standard chapters e.g. "Murabaha" or "Possession"...'}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 ${
                  isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                } text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500`}
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none"
              >
                <option value="All">{isRTL ? 'كل التصنيفات' : 'All Categories'}</option>
                <option value="Standards">{isRTL ? 'المعايير' : 'Standards'}</option>
                <option value="Policies">{isRTL ? 'السياسات' : 'Policies'}</option>
                <option value="SOPs">SOPs</option>
                <option value="Contracts">{isRTL ? 'العقود' : 'Contracts'}</option>
              </select>
            </div>
          </div>

          {/* Results display */}
          <div className="space-y-4">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="border border-slate-150 p-4 rounded-xl space-y-3 hover:shadow-sm transition">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-700 hover:underline cursor-pointer">{doc.name}</span>
                    <span className="bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 px-2.5 py-0.5 rounded">
                      {doc.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {/* Basic Highlight implementation */}
                    {searchQuery ? (
                      <span>
                        ...
                        {doc.extractedText?.split(new RegExp(`(${searchQuery})`, 'gi')).map((pt, i) => (
                          <span key={i} className={pt.toLowerCase() === searchQuery.toLowerCase() ? 'bg-yellow-100 font-bold px-1 rounded' : ''}>
                            {pt}
                          </span>
                        ))}
                        ...
                      </span>
                    ) : (
                      doc.extractedText
                    )}
                  </p>

                  <div className="flex gap-4 items-center text-[10px] text-slate-400 font-medium">
                    <span>{isRTL ? 'الإصدار:' : 'Version:'} {doc.version}</span>
                    <span>{isRTL ? 'تاريخ المعالجة:' : 'Date:'} {doc.uploadedDate}</span>
                    <span className="text-emerald-600 font-bold">● {isRTL ? 'جاهز للتدقيق بالذكاء الاصطناعي' : 'Indexed'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                {isRTL ? 'لم يتم العثور على أية نتائج مطابقة للبحث.' : 'No matching compliance documents found in this vault.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. KNOWLEDGE GRAPH RELATIONSHIP MAP */}
      {/* ==================================================== */}
      {subTab === 'kd-graph' && (
        <div id="kd-graph-tab" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-sm">{isRTL ? 'روابط العلاقات التفاعلية (Knowledge Graph Map)' : 'Knowledge Node Relationship Blueprint'}</h4>
            <p className="text-xs text-slate-400">{isRTL ? 'رسم تخطيطي تفاعلي يمثل الترابط الشرعي بين المعيار، والسياسة، والـ SOP، والـ قواعد المخصصة.' : 'Interactive visual rendering showing how AAOIFI Standards constrain internal investment policies and retail SOP execution.'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* SVG Interactive Canvas */}
            <div className="lg:col-span-3 border border-slate-150 bg-slate-50 rounded-xl p-4 flex items-center justify-center relative min-h-[350px]">
              <svg className="w-full h-[320px]" viewBox="0 0 600 320">
                {/* Connecting Lines */}
                <line x1="100" y1="160" x2="300" y2="80" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4" />
                <line x1="100" y1="160" x2="300" y2="240" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="300" y1="80" x2="500" y2="160" stroke="#CBD5E1" strokeWidth="1.5" />
                <line x1="300" y1="240" x2="500" y2="160" stroke="#10B981" strokeWidth="2.5" />

                {/* Node 1: AAOIFI Standard */}
                <g
                  onMouseEnter={() => setHoveredNodeId('node-std8')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  <circle cx="100" cy="160" r="32" fill="#1E293B" stroke="#059669" strokeWidth="3" />
                  <text x="100" y="165" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">AAOIFI Std</text>
                </g>

                {/* Node 2: Investment Policy */}
                <g
                  onMouseEnter={() => setHoveredNodeId('node-pol1')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  <circle cx="300" cy="80" r="30" fill="#0369A1" stroke="#0284C7" strokeWidth="2" />
                  <text x="300" y="84" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">Policy</text>
                </g>

                {/* Node 3: Murabaha SOP */}
                <g
                  onMouseEnter={() => setHoveredNodeId('node-sop1')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  <circle cx="300" cy="240" r="30" fill="#047857" stroke="#10B981" strokeWidth="2" />
                  <text x="300" y="244" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">SOP Flow</text>
                </g>

                {/* Node 4: Purification Rule */}
                <g
                  onMouseEnter={() => setHoveredNodeId('node-rule1')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  <circle cx="500" cy="160" r="28" fill="#B45309" stroke="#D97706" strokeWidth="2" />
                  <text x="500" y="164" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">Rule</text>
                </g>
              </svg>

              <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium">
                {isRTL ? '💡 مرر مؤشر الفأرة فوق النقاط لرؤية تفاصيل العلاقات الدلالية.' : '💡 Hover over nodes to see transactional constraints.'}
              </span>
            </div>

            {/* Side Node Detail Card */}
            <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-xl text-xs space-y-4">
              <h5 className="font-bold text-slate-800 border-b border-slate-200 pb-2">{isRTL ? 'معلومات العقدة والارتباط دلالياً' : 'Structural Constraints Summary'}</h5>
              {hoveredNodeId === 'node-std8' ? (
                <div className="space-y-2">
                  <span className="font-bold text-emerald-700">AAOIFI Standard No. 8</span>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{isRTL ? 'المعيار الشرعي الرئيسي المنظم لعمليات وصيغ التمويل بالمرابحة للأمر بالشراء.' : 'The sovereign standard constraining ownership transitions, markup rules and deferred asset execution.'}</p>
                </div>
              ) : hoveredNodeId === 'node-pol1' ? (
                <div className="space-y-2">
                  <span className="font-bold text-blue-700">Ethical Investment Policy</span>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{isRTL ? 'سياسة الاستثمار الأخلاقي التي تحظر المساهمة في شركات القمار والمصارف التقليدية.' : 'Internal policy that screens asset portfolios to reject high non-sharia compliant debt-ratios.'}</p>
                </div>
              ) : hoveredNodeId === 'node-sop1' ? (
                <div className="space-y-2">
                  <span className="font-bold text-emerald-800">Murabaha Financing SOP</span>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{isRTL ? 'الإجراء التفصيلي المعتمد في الفروع لحركات التملك ونقل الملكية بالتتابع.' : 'Step-by-step branch instruction requiring sequential delivery confirmation logs.'}</p>
                </div>
              ) : hoveredNodeId === 'node-rule1' ? (
                <div className="space-y-2">
                  <span className="font-bold text-amber-700">Purification Rule Check</span>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{isRTL ? 'الفلتر التلقائي المبرمج لحجز الإيرادات المشتركة أو أية جزاءات تأخيرية.' : 'Automated rule preventing delay-penalty income from registering as regular profit.'}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic text-[11px]">{isRTL ? 'لم يتم اختيار أي عصب في شبكة المعرفة.' : 'Hover over a graph node to inspect connected governance logic.'}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
