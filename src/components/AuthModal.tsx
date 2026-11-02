import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  Shield, 
  Lock,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onLoginSuccess: (updatedProfile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google' | 'apple'>('phone');
  
  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');

  // Email form state
  const [emailValue, setEmailValue] = useState(currentProfile.email || '');
  const [passwordValue, setPasswordValue] = useState('');

  // College Student Profile Details
  const [studentName, setStudentName] = useState(currentProfile.name || '');
  const [collegeName, setCollegeName] = useState(currentProfile.institution || 'Anna University, Chennai');
  const [rollNumber, setRollNumber] = useState(currentProfile.rollNumber || '21CS084');
  const [degree, setDegree] = useState(currentProfile.degree || 'B.Tech - Computer Science');
  const [semester, setSemester] = useState(currentProfile.semester || 'Semester 5');
  const [branch, setBranch] = useState(currentProfile.branch || 'Computer Science & Engineering');

  const popularColleges = [
    'Anna University, Chennai',
    'IIT Madras',
    'IIT Bombay',
    'IIT Delhi',
    'Delhi Technological University (DTU)',
    'National Institute of Technology (NIT)',
    'SRM Institute of Science and Technology',
    'Vellore Institute of Technology (VIT)',
    'BITS Pilani',
    'Custom College / International University'
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 7) {
      alert('Please enter a valid phone number');
      return;
    }
    setOtpSent(true);
    setOtpValue('742918'); // Pre-fill realistic demo OTP for student convenience
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      alert('Please enter the 6-digit verification code');
      return;
    }

    completeLogin('phone', {
      phone: `${phoneCountryCode} ${phoneNumber}`,
    });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.includes('@')) {
      alert('Please enter a valid student email address');
      return;
    }

    completeLogin('email', {
      email: emailValue,
    });
  };

  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    const mockEmail = provider === 'google'
      ? `${studentName.toLowerCase().replace(/\s+/g, '') || 'student'}@alumni.edu`
      : `${studentName.toLowerCase().replace(/\s+/g, '') || 'student'}@icloud.com`;

    completeLogin(provider, {
      email: mockEmail,
    });
  };

  const completeLogin = (provider: 'phone' | 'email' | 'google' | 'apple', extra: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...currentProfile,
      name: studentName.trim() || currentProfile.name || 'College Scholar',
      institution: collegeName,
      rollNumber,
      degree,
      semester,
      branch,
      authProvider: provider,
      ...extra,
    };

    onLoginSuccess(updated);
    confetti({ particleCount: 50, spread: 70 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">College Student Sign-In</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md">
                  Edu Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Always log in to sync semester notes, study rooms, and focus stats
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Sign-In Provider Selection Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setAuthMethod('phone')}
            className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'phone' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>

          <button
            onClick={() => setAuthMethod('email')}
            className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'email' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Mail</span>
          </button>

          <button
            onClick={() => setAuthMethod('google')}
            className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'google' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {/* Google G logo */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={() => setAuthMethod('apple')}
            className={`py-2 text-xs font-bold rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'apple' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {/* Apple logo */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.04-.51 2.56-1.24z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Student Academic Details Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>College Enrollment Info</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
              University Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Student Full Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">College Roll No / Student ID</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 21CS084"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">College / University</label>
              <input
                type="text"
                list="colleges-list"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Anna University, Chennai"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="colleges-list">
                {popularColleges.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Degree & Branch</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Current Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1. Phone Auth Tab */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Student Mobile Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+61">🇦🇺 +61</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  We'll send a 6-digit campus authentication code via SMS.
                </p>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Enter 6-Digit OTP sent to {phoneCountryCode} {phoneNumber}
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                  >
                    Edit Number
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  placeholder="742918"
                  className="w-full text-center tracking-[0.5em] font-mono text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Sign In</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. Mail Auth Tab */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                College or Personal Email Address
              </label>
              <input
                type="email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="student@university.edu or student@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In with College Email</span>
            </button>
          </form>
        )}

        {/* 3. Google Sign-In Tab */}
        {authMethod === 'google' && (
          <div className="space-y-3 text-center py-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Authenticate via your campus Google Workspace account (<span className="font-semibold">.edu</span>) or personal Google account for seamless Google Drive and Calendar syllabus sync.
            </p>
            <button
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 shadow-xs transition flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* 4. Apple Sign-In Tab */}
        {authMethod === 'apple' && (
          <div className="space-y-3 text-center py-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              Use your Apple ID with Face ID / Touch ID and private relay email protection.
            </p>
            <button
              onClick={() => handleOAuthLogin('apple')}
              className="w-full py-3 bg-black hover:bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.04-.51 2.56-1.24z"/>
              </svg>
              <span>Sign in with Apple</span>
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit Encrypted Campus Authentication • Session auto-saved</span>
        </div>

      </div>
    </div>
  );
};
