'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Indian Taekwondo Batch & Pricing Matrix (WT/Kup Standard)
const BATCH_DETAILS = {
  beginner: {
    id: 'beginner',
    title: 'Beginner Foundation',
    beltEligibility: 'White to Green Stripe (10th – 7th Kup)',
    defaultBelt: 'White Belt (10th Kup)',
    description: 'Fundamental stances (Sogi), basic kicks (Ap/Dollyo Chagi), body conditioning & discipline.',
    schedule: '3 Sessions / Week (Mon - Wed - Fri)',
    pricing: {
      '3_months': { amount: '₹6,500', label: '3 Months (Standard)', monthly: '₹2,166/mo' },
      '6_months': { amount: '₹11,500', label: '6 Months (15% Off)', monthly: '₹1,916/mo' },
      '12_months': { amount: '₹20,000', label: '1 Year (25% Off)', monthly: '₹1,666/mo' },
    },
    perks: ['Loaner sparring equipment included', 'Kup Belt examination eligibility', 'Basic fitness assessment']
  },
  intermediate: {
    id: 'intermediate',
    title: 'Intermediate Skill',
    beltEligibility: 'Green to Blue Belt (6th – 4th Kup)',
    defaultBelt: 'Green Belt (4th Kup)',
    description: 'Taegeuk Poomsae forms 1–5, combination kicking drills, light contact sparring (Kyorugi) & self-defense.',
    schedule: '4 Sessions / Week (Mon to Thu)',
    pricing: {
      '3_months': { amount: '₹7,500', label: '3 Months (Standard)', monthly: '₹2,500/mo' },
      '6_months': { amount: '₹13,500', label: '6 Months (15% Off)', monthly: '₹2,250/mo' },
      '12_months': { amount: '₹24,000', label: '1 Year (25% Off)', monthly: '₹2,000/mo' },
    },
    perks: ['Full Poomsae & Kyorugi drills', 'District tournament eligibility', 'Quarterly grading guidance']
  },
  advanced: {
    id: 'advanced',
    title: 'Advanced & Dan Prep',
    beltEligibility: 'Red Stripe to Black Belt (3rd Kup – Dan)',
    defaultBelt: 'Red Belt (2nd Kup)',
    description: 'Taegeuk 6–8 & Koryo Poomsae, power breaking (Kyukpa), tactical sparring, and assistant leadership training.',
    schedule: '5 Sessions / Week (Mon to Fri)',
    pricing: {
      '3_months': { amount: '₹9,000', label: '3 Months (Standard)', monthly: '₹3,000/mo' },
      '6_months': { amount: '₹16,000', label: '6 Months (15% Off)', monthly: '₹2,666/mo' },
      '12_months': { amount: '₹28,000', label: '1 Year (25% Off)', monthly: '₹2,333/mo' },
    },
    perks: ['Black Belt Dan examination prep', 'Kyukpa power breaking drills', 'State-level tournament sponsorship']
  },
  elite: {
    id: 'elite',
    title: 'Elite Tournament Squad',
    beltEligibility: 'Competitive Athletes (All Belts)',
    defaultBelt: 'Blue Belt (3rd Kup - Athlete)',
    description: 'Intensive full-contact sparring, WTF electronic scoring system tactics, weight division conditioning, and national selection prep.',
    schedule: '6 Sessions / Week (Mon to Sat)',
    pricing: {
      '3_months': { amount: '₹10,500', label: '3 Months (Standard)', monthly: '₹3,500/mo' },
      '6_months': { amount: '₹19,000', label: '6 Months (15% Off)', monthly: '₹3,166/mo' },
      '12_months': { amount: '₹33,000', label: '1 Year (25% Off)', monthly: '₹2,750/mo' },
    },
    perks: ['WT Electronic scoring gear training', 'Dedicated athletic conditioning coach', 'National competition registration support']
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'enroll'>('enroll');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Enrollment State
  const [fullName, setFullName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBatchKey, setSelectedBatchKey] = useState<keyof typeof BATCH_DETAILS>('beginner');
  const [selectedDurationKey, setSelectedDurationKey] = useState<'3_months' | '6_months' | '12_months'>('3_months');
  
  // UI Control State
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentBatch = BATCH_DETAILS[selectedBatchKey];
  const currentPricing = currentBatch.pricing[selectedDurationKey];

  // Handle Returning Student Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      // Verify profile exists in Firestore
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        router.push('/portal');
      } else {
        router.push('/portal'); // Proceed to portal where fallback handles it
      }
    } catch (err: any) {
      console.error('Firebase Login Error:', err);
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle New Student Enrollment & Profile Creation
  const handleEnrollmentSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create Firebase Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, enrollEmail, password);
      const user = userCredential.user;

      // 2. Save Full Student Profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        fullName,
        email: enrollEmail,
        phone,
        selectedBatch: currentBatch.title,
        beltEligibility: currentBatch.beltEligibility,
        membershipDuration: currentPricing.label,
        totalFee: currentPricing.amount,
        membershipStatus: 'active',
        beltRank: 'NOT GRADED YET (WHITE BELT)',
        examsPassed: 0,
        progressPercentage: 45,
        createdAt: new Date().toISOString(),
      });

      // 3. Redirect to Dashboard
      setShowBreakdownModal(false);
      router.push('/portal');
    } catch (err: any) {
      console.error('Firebase Enrollment Error:', err);
      setErrorMsg(err.message || 'Could not complete enrollment. Please check details.');
      setShowBreakdownModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center px-4 py-12 relative">
      
      {/* Brand Heading */}
      <div className="text-center mb-8">
        <Link href="/" className="text-3xl font-black tracking-tighter uppercase text-white hover:text-red-500 transition-colors">
          FIT <span className="text-red-600">KICKERS</span>
        </Link>
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mt-1">
          TAEKWONDO ACADEMY PORTAL
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-950 rounded-xl mb-6 border border-zinc-800">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2.5 text-xs sm:text-sm font-bold uppercase rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            STUDENT LOGIN
          </button>
          <button
            onClick={() => setActiveTab('enroll')}
            className={`py-2.5 text-xs sm:text-sm font-bold uppercase rounded-lg transition-all ${
              activeTab === 'enroll'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            NEW ENROLLMENT
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 rounded-xl text-red-400 text-xs sm:text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: STUDENT LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Registered Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="student@fitkickers.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-red-600/30 mt-2"
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER STUDENT PORTAL ➔'}
            </button>
          </form>
        )}

        {/* TAB 2: NEW STUDENT ENROLLMENT */}
        {activeTab === 'enroll' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Shreeram Chitre"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={enrollEmail}
                  onChange={(e) => setEnrollEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Create Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Batch Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Select Taekwondo Batch *</label>
              <select
                value={selectedBatchKey}
                onChange={(e) => setSelectedBatchKey(e.target.value as keyof typeof BATCH_DETAILS)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="beginner">Beginner Foundation (White to Green Stripe)</option>
                <option value="intermediate">Intermediate Skill (Green to Blue Belt)</option>
                <option value="advanced">Advanced & Dan Prep (Red to Black Belt)</option>
                <option value="elite">Elite Tournament Sparring Squad</option>
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">Membership Duration *</label>
              <select
                value={selectedDurationKey}
                onChange={(e) => setSelectedDurationKey(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600"
              >
                <option value="3_months">3 Months (Standard)</option>
                <option value="6_months">6 Months (15% Savings)</option>
                <option value="12_months">1 Year (25% Savings - Best Value)</option>
              </select>
            </div>

            {/* Dynamic Price Preview Box */}
            <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase text-zinc-500">Calculated Fee</p>
                <p className="text-2xl font-black text-red-500">{currentPricing.amount}</p>
                <p className="text-xs text-zinc-400">{currentPricing.monthly}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!fullName || !enrollEmail || !phone || !password) {
                    setErrorMsg('Please fill in your name, email, phone, and password first.');
                    return;
                  }
                  setErrorMsg('');
                  setShowBreakdownModal(true);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase px-4 py-2.5 rounded-lg border border-zinc-700 transition-colors"
              >
                REVIEW BATCH & REGISTER
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider">
            ← BACK TO FIT KICKERS ACADEMY
          </Link>
        </div>
      </div>

      {/* POPUP BATCH & PRICING BREAKDOWN MODAL */}
      {showBreakdownModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-red-500 bg-red-950/60 border border-red-800/40 px-2.5 py-1 rounded-md">
                  CONFIRM ENROLLMENT
                </span>
                <h3 className="text-xl font-black uppercase text-white mt-1">
                  {currentBatch.title}
                </h3>
              </div>
              <button
                onClick={() => setShowBreakdownModal(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Batch Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-800/60 text-xs sm:text-sm">
                <span className="text-zinc-400">Belt Rank Target:</span>
                <span className="font-semibold text-zinc-200">{currentBatch.beltEligibility}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60 text-xs sm:text-sm">
                <span className="text-zinc-400">Weekly Schedule:</span>
                <span className="font-semibold text-zinc-200">{currentBatch.schedule}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60 text-xs sm:text-sm">
                <span className="text-zinc-400">Selected Plan:</span>
                <span className="font-semibold text-zinc-200">{currentPricing.label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60 text-xs sm:text-sm">
                <span className="text-zinc-400">Total Course Fee:</span>
                <span className="font-bold text-red-500 text-base">{currentPricing.amount}</span>
              </div>
            </div>

            {/* Perks */}
            <div className="bg-zinc-950 p-4 rounded-xl space-y-2 border border-zinc-800/80">
              <p className="text-xs font-mono uppercase text-zinc-400 font-bold mb-1">Included Batch Perks:</p>
              {currentBatch.perks.map((perk, idx) => (
                <p key={idx} className="text-xs text-zinc-300 flex items-center space-x-2">
                  <span className="text-red-500">✓</span>
                  <span>{perk}</span>
                </p>
              ))}
            </div>

            {/* Future Payment Note */}
            <div className="bg-zinc-800/40 p-3 rounded-xl border border-zinc-700/50 text-xs text-zinc-400">
              <span className="text-red-400 font-bold block mb-0.5">💳 PAYMENT INTEGRATION NOTICE</span>
              Online Payment Gateway (UPI / Credit Card) will be activated soon. Registering now creates your official student record and grants immediate tracking access.
            </div>

            {/* Submit Action */}
            <button
              onClick={handleEnrollmentSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-red-600/30"
            >
              {loading ? 'REGISTERING ACCOUNT...' : 'PROCEED TO REGISTER & START TRACKING ➔'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
