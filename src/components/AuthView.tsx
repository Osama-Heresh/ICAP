import React, { useState } from 'react';
import { Shield, Lock, Mail, Building, Globe, Phone, User, Check, Eye, EyeOff } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../data';
import { UserRole } from '../types';

interface AuthViewProps {
  onLogin: (user: { email: string; role: UserRole; name: string; jobTitle: string }) => void;
  locale: 'en' | 'ar';
}

export default function AuthView({ onLogin, locale }: AuthViewProps) {
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'reset' | 'verification'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  // Register state
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('Islamic Finance');
  const [country, setCountry] = useState('Saudi Arabia');
  const [phone, setPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminJob, setAdminJob] = useState('');

  const isRTL = locale === 'ar';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const match = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (match) {
      onLogin({
        email: match.email,
        role: match.role,
        name: match.name,
        jobTitle: match.jobTitle,
      });
    } else {
      setError(
        isRTL
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى تجربة الحسابات التجريبية بالأسفل.'
          : 'Invalid credentials. Please select a demo profile below for quick login.'
      );
    }
  };

  const handleQuickLogin = (profile: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(profile.email);
    setPassword(profile.password);
    onLogin({
      email: profile.email,
      role: profile.role,
      name: profile.name,
      jobTitle: profile.jobTitle,
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 2) {
      setRegStep(2);
    } else {
      setSuccessMsg(
        isRTL
          ? 'تم تسجيل المؤسسة بنجاح! تم إرسال رابط تفعيل الحساب إلى بريدك الإلكتروني.'
          : 'Organization registered successfully! Verification email has been sent.'
      );
      setScreen('verification');
    }
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 -z-10" />

      {/* Header */}
      <header id="auth-header" className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-lg shadow-lg shadow-emerald-900/30">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
              ICAP
            </h1>
            <p className="text-xs text-slate-400 font-medium">Islamic Compliance AI Platform</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 border border-slate-700/60 px-3 py-1.5 rounded bg-slate-800/50">
          {isRTL ? 'بيئة التأسيس - نسخة SaaS' : 'Foundation Phase - SaaS Version 1.0'}
        </div>
      </header>

      {/* Main Form Box */}
      <main id="auth-main" className="flex-1 flex items-center justify-center p-6 my-4">
        <div className="bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl w-full max-w-xl p-8 shadow-2xl relative">
          <div className="absolute top-0 right-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

          {screen === 'login' && (
            <div id="login-panel">
              <h2 className="text-2xl font-display font-bold mb-1 text-slate-100">
                {isRTL ? 'تسجيل الدخول للمؤسسات' : 'Enterprise Portal Login'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {isRTL
                  ? 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة المراقبة وإطار حوكمة المعايير.'
                  : 'Enter your credentials to access your organization dashboards.'}
              </p>

              {error && (
                <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-xs p-3.5 rounded-lg mb-4 flex items-start gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                    {isRTL ? 'البريد الإلكتروني' : 'Corporate Email'}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute top-3.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@icap-demo.com"
                      className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-3 ${
                        isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                      } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 placeholder-slate-600 transition`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase font-bold text-slate-400">
                      {isRTL ? 'كلمة المرور' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setScreen('forgot')}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className={`absolute top-3.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-3 ${
                        isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'
                      } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 placeholder-slate-600 transition`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-3.5 ${isRTL ? 'left-3' : 'right-3'} text-slate-400 hover:text-slate-200`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-emerald-950/40 text-sm mt-6"
                >
                  {isRTL ? 'تسجيل الدخول الآمن' : 'Secure Sign In'}
                </button>
              </form>

              {/* Quick demo accounts */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isRTL ? 'تسجيل الدخول السريع التجريبي (موصى به)' : 'Quick Demo Access Profiles'}
                  </span>
                  <span className="text-[10px] bg-yellow-950/60 border border-yellow-800/40 text-yellow-400 px-2 py-0.5 rounded">
                    {isRTL ? 'فحص الصلاحيات' : 'Role-Based Access'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_CREDENTIALS.map((profile) => (
                    <button
                      key={profile.role}
                      onClick={() => handleQuickLogin(profile)}
                      className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/40 p-3 rounded-lg text-left transition flex flex-col justify-between"
                      style={{ direction: 'ltr' }}
                    >
                      <span className="text-xs font-bold text-slate-200 block truncate">{profile.name}</span>
                      <span className="text-[9px] text-emerald-400 font-mono mt-1 uppercase">
                        {profile.role.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center mt-6 text-xs text-slate-500">
                {isRTL ? 'ليس لديك مؤسسة مسجلة؟' : "Don't have an organization registered?"}{' '}
                <button onClick={() => setScreen('register')} className="text-emerald-400 hover:underline font-bold">
                  {isRTL ? 'سجل مؤسستك الآن' : 'Register Organization'}
                </button>
              </div>
            </div>
          )}

          {screen === 'register' && (
            <div id="register-panel">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-bold text-slate-100">
                  {isRTL ? 'تسجيل مؤسسة جديدة' : 'Register Organization'}
                </h2>
                <span className="text-xs text-slate-400">
                  {isRTL ? `الخطوة ${regStep} من 2` : `Step ${regStep} of 2`}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-1 rounded-full mb-6 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1 transition-all duration-300"
                  style={{ width: regStep === 1 ? '50%' : '100%' }}
                />
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regStep === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'اسم المؤسسة' : 'Organization Name'}
                      </label>
                      <div className="relative">
                        <Building className={`absolute top-3.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
                        <input
                          type="text"
                          required
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="e.g. Al Noor Finance Group"
                          className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-3 ${
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                          {isRTL ? 'القطاع' : 'Industry'}
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                        >
                          <option value="Islamic Finance">{isRTL ? 'التمويل الإسلامي' : 'Islamic Finance'}</option>
                          <option value="FinTech">{isRTL ? 'التكنولوجيا المالية' : 'FinTech'}</option>
                          <option value="Crypto Compliance">{isRTL ? 'العملات المشفرة والامتثال' : 'Crypto Compliance'}</option>
                          <option value="Asset Management">{isRTL ? 'إدارة الأصول' : 'Asset Management'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                          {isRTL ? 'الدولة' : 'Country'}
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                        >
                          <option value="Saudi Arabia">{isRTL ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                          <option value="United Arab Emirates">{isRTL ? 'الإمارات العربية المتحدة' : 'United Arab Emirates'}</option>
                          <option value="Bahrain">{isRTL ? 'البحرين' : 'Bahrain'}</option>
                          <option value="United Kingdom">{isRTL ? 'المملكة المتحدة' : 'United Kingdom'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'رقم الهاتف' : 'Phone'}
                      </label>
                      <div className="relative">
                        <Phone className={`absolute top-3.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+966 50 000 0000"
                          className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-3 ${
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'الاسم الكامل للمسؤول' : 'Administrator Full Name'}
                      </label>
                      <div className="relative">
                        <User className={`absolute top-3.5 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-slate-500`} />
                        <input
                          type="text"
                          required
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="Sheikh Alaa"
                          className={`w-full bg-slate-900 border border-slate-800 rounded-lg py-3 ${
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          } text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'المسمى الوظيفي' : 'Job Title'}
                      </label>
                      <input
                        type="text"
                        required
                        value={adminJob}
                        onChange={(e) => setAdminJob(e.target.value)}
                        placeholder="e.g. Chief Sharia Auditor"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                        {isRTL ? 'كلمة المرور' : 'Password'}
                      </label>
                      <input
                        type="password"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {regStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-lg text-sm transition"
                    >
                      {isRTL ? 'السابق' : 'Back'}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition shadow-lg shadow-emerald-950/40"
                  >
                    {regStep === 1 ? (isRTL ? 'الخطوة التالية' : 'Next Step') : (isRTL ? 'إكمال التسجيل' : 'Complete Setup')}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6 text-xs text-slate-500">
                {isRTL ? 'لديك مؤسسة مسجلة بالفعل؟' : 'Already have an organization registered?'}{' '}
                <button onClick={() => setScreen('login')} className="text-emerald-400 hover:underline font-bold">
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              </div>
            </div>
          )}

          {screen === 'forgot' && (
            <div id="forgot-panel">
              <h2 className="text-2xl font-display font-bold mb-1 text-slate-100">
                {isRTL ? 'نسيت كلمة المرور؟' : 'Recover Password'}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {isRTL
                  ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.'
                  : "Enter your corporate email and we'll send you reset instructions."}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSuccessMsg(
                    isRTL
                      ? 'تم إرسال رابط إعادة تعيين كلمة المرور بنجاح!'
                      : 'Password reset link has been dispatched to your email.'
                  );
                  setScreen('verification');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                    {isRTL ? 'البريد الإلكتروني' : 'Corporate Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@icap-demo.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition"
                >
                  {isRTL ? 'إرسال رابط استعادة كلمة المرور' : 'Send Recovery Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="w-full text-center text-slate-400 hover:text-white text-xs pt-2"
                >
                  {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                </button>
              </form>
            </div>
          )}

          {screen === 'verification' && (
            <div id="verification-panel" className="text-center py-6">
              <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2 text-slate-100">
                {isRTL ? 'تفقد بريدك الإلكتروني' : 'Action Required'}
              </h2>
              <p className="text-slate-300 text-sm mb-6 max-w-sm mx-auto">
                {successMsg ||
                  (isRTL
                    ? 'لقد أرسلنا تعليمات تفعيل الحساب والتحقق الآمن إلى بريدك الإلكتروني.'
                    : 'We have dispatched setup confirmation to your registered secure email.')}
              </p>
              <button
                onClick={() => setScreen('login')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition"
              >
                {isRTL ? 'العودة لتسجيل الدخول' : 'Return to Login'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer id="auth-footer" className="text-center py-6 border-t border-slate-800/40 text-slate-500 text-xs">
        <p>
          &copy; {new Date().getFullYear()} ICAP (Islamic Compliance AI Platform).{' '}
          {isRTL
            ? 'جميع الحقوق محفوظة. حوكمة شرعية مدعومة بالذكاء الاصطناعي للمؤسسات المالية.'
            : 'All rights reserved. Secure Enterprise Islamic Governance AI Platform.'}
        </p>
      </footer>
    </div>
  );
}
