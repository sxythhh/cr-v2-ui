"use client";
// @ts-nocheck

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

// Content Rewards Wordmark SVG
function ContentRewardsWordmark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 282 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.9722 10.4421V10.1724C26.9722 7.93752 25.5465 7.01276 22.464 7.01276H15.6053C10.0568 7.01276 8.70816 7.74486 8.70816 12.5228V16.4145C8.70816 20.8071 10.5962 21.6933 15.6053 21.6933H20.5759C25.3153 21.6933 27.2034 21.1924 27.2034 17.8402V17.5319H35.873C35.9115 18.264 35.95 18.919 35.95 19.5741C35.95 23.0419 35.1409 25.3538 33.1372 26.818C31.018 28.3978 27.6657 28.7061 22.7722 28.7061H13.2164C8.78522 28.7061 5.66415 28.5134 3.23666 26.6254C0.886228 24.7759 0 22.2328 0 18.4181V10.7889C0 2.38896 3.66051 0 13.2164 0H22.7722C27.6657 0 30.9795 0.231192 33.0216 1.81099C34.8326 3.19813 35.6033 5.51003 35.6033 8.86228C35.6033 9.36319 35.6033 9.90264 35.5647 10.4421H26.9722Z" fill="white"/>
      <path d="M56.2872 21.6933H61.7202C67.1532 21.6933 69.2339 20.8842 69.2339 16.3374V12.3687C69.2339 7.82193 67.1532 7.01276 61.7202 7.01276H56.2487C50.7001 7.01276 48.735 7.7834 48.735 12.5228V16.4145C48.735 20.8456 50.8543 21.6933 56.2872 21.6933ZM53.9753 28.7061C48.9662 28.7061 45.4598 28.5134 43.0709 26.741C40.7975 25.0456 40.0269 22.464 40.0269 18.4181V10.7889C40.0269 6.47332 40.759 3.69904 43.0709 1.96511C45.3442 0.269723 48.8121 0 53.9368 0H63.9936C69.1183 0 72.6632 0.269723 74.898 1.96511C77.0173 3.58345 77.9035 6.28066 77.9035 10.4421V18.264C77.9035 22.4254 77.0558 25.0841 74.898 26.741C72.5861 28.4749 69.0797 28.7061 63.9936 28.7061H53.9753Z" fill="white"/>
      <path d="M120.928 28.3593H108.406L91.6057 7.97605V28.3593H83.0517V0.346785H95.7286L112.413 20.8842V0.346785H120.928V28.3593Z" fill="white"/>
      <path d="M144.815 28.3593H136.261V7.20542H124.548V0.346785H156.529V7.20542H144.815V28.3593Z" fill="white"/>
      <path d="M190.858 7.16689H168.818V11.4054H189.586V17.3007H168.818V21.5777H191.205V28.3593H160.264V0.346785H190.858V7.16689Z" fill="white"/>
      <path d="M234.04 28.3593H221.517L204.717 7.97605V28.3593H196.163V0.346785H208.84L225.524 20.8842V0.346785H234.04V28.3593Z" fill="white"/>
      <path d="M257.927 28.3593H249.373V7.20542H237.659V0.346785H269.64V7.20542H257.927V28.3593Z" fill="white"/>
      <path d="M22.8493 39.3468C31.3262 39.3468 34.3317 41.2348 34.3317 48.5173C34.3317 53.1411 33.1758 55.453 29.6694 56.3007C32.5978 56.9943 34.1005 58.7667 34.1005 61.6181V67.3593H25.5465V63.0823C25.5465 60.6933 24.5061 60.1924 21.6933 60.1924H8.93935V67.3593H0.346785V39.3468H22.8493ZM22.541 46.321H8.93935V53.1797H22.541C24.93 53.1797 25.6236 52.1393 25.6236 49.4806C25.6236 47.3228 24.7373 46.321 22.541 46.321Z" fill="white"/>
      <path d="M70.3335 46.1669H48.2934V50.4054H69.062V56.3007H48.2934V60.5777H70.6803V67.3593H39.7394V39.3468H70.3335V46.1669Z" fill="white"/>
      <path d="M91.8221 67.3593H82.0351L73.0958 39.3468H81.6113L87.391 59.2677L94.5579 39.3468H102.418L109.2 59.2677L115.365 39.3468H123.88L114.517 67.3593H104.884L98.4111 48.0549L91.8221 67.3593Z" fill="white"/>
      <path d="M131.143 67.3593H121.818L137.116 39.3468H148.02L163.047 67.3593H153.646L150.948 62.697H133.879L131.143 67.3593ZM137.116 55.9539H147.866L142.433 46.0513L137.116 55.9539Z" fill="white"/>
      <path d="M188.566 39.3468C197.042 39.3468 200.048 41.2348 200.048 48.5173C200.048 53.1411 198.892 55.453 195.386 56.3007C198.314 56.9943 199.817 58.7667 199.817 61.6181V67.3593H191.263V63.0823C191.263 60.6933 190.222 60.1924 187.41 60.1924H174.656V67.3593H166.063V39.3468H188.566ZM188.257 46.321H174.656V53.1797H188.257C190.646 53.1797 191.34 52.1393 191.34 49.4806C191.34 47.3228 190.454 46.321 188.257 46.321Z" fill="white"/>
      <path d="M230.116 39.3468C238.439 39.3468 242.369 42.044 242.369 48.7485V58.3814C242.369 64.585 239.402 67.3593 232.62 67.3593H205.533V39.3468H230.116ZM227.496 46.244H214.087V60.5392H228.575C232.197 60.5392 233.815 59.1135 233.815 55.9539V51.0219C233.815 47.7082 231.773 46.244 227.496 46.244Z" fill="white"/>
      <path d="M247.028 58.0346H255.466V58.5356C255.466 60.8475 256.507 61.2328 259.474 61.2328H270.224C272.266 61.2328 273.152 60.6163 273.152 58.9209C273.152 56.8787 271.804 56.5704 269.03 56.4934L255.582 56.0695C249.07 55.8769 246.989 54.1429 246.989 47.7082C246.989 44.6642 247.529 42.5834 248.955 41.1578C250.997 39.1927 254.079 39 258.587 39H271.65C278.007 39 280.782 41.1192 280.782 46.5137C280.782 46.9761 280.743 47.5155 280.705 48.0549H272.459V47.9393C272.459 46.0898 271.534 45.1651 269.646 45.1651H259.782C257.123 45.1651 255.736 45.3963 255.736 47.3614C255.736 49.0953 256.738 49.5962 259.088 49.6733L273.152 50.0201C279.587 50.1742 281.899 52.5631 281.899 59.1135C281.899 62.6584 281.244 64.7392 278.74 66.3575C277.006 67.4749 274.154 67.7061 270.07 67.7061H258.665C249.995 67.7061 246.912 66.396 246.912 60.2695C246.912 59.9612 246.951 59.1906 247.028 58.0346Z" fill="white"/>
    </svg>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mock sign-in: no-op
    console.log('Sign in attempted (mock)', { email });
    setTimeout(() => {
      setLoading(false);
      router.push('/vn');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <ContentRewardsWordmark className="h-20 w-auto" />
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Contact your manager if you need an account
        </p>
      </div>
    </div>
  );
}
