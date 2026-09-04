import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sprout,
  User,
} from 'lucide-react';
import { BotanicalDecoration } from '../ui/BotanicalDecoration';
import { RainDripBorder, RestingLeaf } from '../ui/RainDripBorder';
import { apiService, AuthSession } from '../../services/api';
import { NatureAtmosphere } from '../ui/NatureAtmosphere';
import { AtmosphereControl } from '../ui/AtmosphereControl';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  initialMode?: AuthMode;
  onAuthenticate: (session: AuthSession) => void;
}

const fieldBase =
  'w-full rounded-2xl border border-charcoal/10 bg-white/92 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light shadow-sm outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100';

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onAuthenticate }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [fullName, setFullName] = useState('Arjun Patel');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [email, setEmail] = useState('arjun@agripilot.demo');
  const [password, setPassword] = useState('harvest123');
  const [confirmPassword, setConfirmPassword] = useState('harvest123');
  const [location, setLocation] = useState('Malur, Karnataka');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [identifier, setIdentifier] = useState('arjun@agripilot.demo');

  const isRegister = mode === 'register';

  const authBlurb = useMemo(
    () =>
      isRegister
        ? 'Create your AgriPilot farm account to save decisions, keep market alerts live, and reopen your dashboard anywhere.'
        : 'Sign in to see todays best move, live market updates, and your current harvest plan.',
    [isRegister]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorText('');
    setIsLoading(true);

    try {
      const session = isRegister
        ? await apiService.register({
            fullName,
            mobileNumber,
            email,
            password,
            confirmPassword,
            location,
            primaryCrop,
          })
        : await apiService.login(identifier, password);

      if (!session) {
        setErrorText(
          isRegister
            ? 'Registration failed. Please check the form and try again.'
            : 'Login failed. Check your email/mobile and password.'
        );
        return;
      }

      apiService.setStoredToken(session.accessToken);
      onAuthenticate(session);
    } catch (error) {
      console.error('[AgriPilot Auth] Authentication failed:', error);
      const fallbackMessage = isRegister
        ? 'Registration failed. Please check the form and try again.'
        : 'Login failed. Check your email/mobile and password.';
      if (error instanceof Error && error.message) {
        setErrorText(error.message);
      } else {
        setErrorText(fallbackMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorText('');
    setIsLoading(true);

    try {
      const session = await apiService.demoLogin();
      if (!session) {
        setErrorText('Demo login failed. Please try again.');
        return;
      }

      apiService.setStoredToken(session.accessToken);
      onAuthenticate(session);
    } catch (error) {
      console.error('[AgriPilot Auth] Demo login failed:', error);
      setErrorText('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (nextMode: AuthMode) => {
    setErrorText('');
    setMode(nextMode);
    window.history.pushState({}, '', nextMode === 'register' ? '/register' : '/login');
  };

  return (
    <div className="auth-shell min-h-screen overflow-hidden relative">
      <NatureAtmosphere />
      <div className="auth-shell-bg" />
      <div className="auth-shell-dots" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-stretch gap-6 p-4 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10 z-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="glass-panel auth-brand-panel relative overflow-hidden rounded-[2rem] border border-white/60 p-8 text-white shadow-[0_30px_80px_rgba(9,57,38,0.18)] md:p-10"
        >
          <RestingLeaf position="top-right" />
          <RainDripBorder side="left" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800" />
          <BotanicalDecoration variant="contour" className="left-0 top-0 h-full w-full opacity-70" />
          <BotanicalDecoration variant="leaf" className="-right-10 top-8 rotate-[18deg]" />
          <BotanicalDecoration variant="flower" className="bottom-6 left-8 h-28 w-28 rotate-[-10deg]" />
          <div className="absolute -right-12 top-10 h-48 w-48 rounded-full bg-lime-300/20 blur-3xl" />
          <div className="absolute -left-14 bottom-4 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-start space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15 backdrop-blur">
                <Leaf className="h-6 w-6 text-lime-200" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-200/80">AgriPilot</p>
                <h1 className="text-2xl font-black tracking-tight md:text-3xl">Farmer-first decision intelligence</h1>
              </div>
            </div>

            <div className="max-w-xl space-y-6 pt-2 pb-6 md:pt-4 md:pb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-emerald-50 backdrop-blur">
                <Sprout className="h-4 w-4 text-lime-200" />
                <span>Know your market. Move your harvest smarter.</span>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100/80">What should I do?</p>
                <h2 className="max-w-lg text-4xl font-black leading-tight text-white md:text-5xl">
                  See the best action for your harvest in seconds.
                </h2>
                <p className="max-w-lg text-sm leading-7 text-emerald-50/80 md:text-base">{authBlurb}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Live markets', 'Crowding and demand at a glance'],
                  ['Smart plans', 'The best move for today'],
                  ['Fast updates', 'Plan changes when markets shift'],
                ].map(([title, body], index) => (
                  <div
                    key={title}
                    className={`agri-card ${index % 2 === 0 ? 'agri-leaf-side' : 'agri-field-lines'} relative overflow-hidden rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm group hover:border-lime-300/40 transition-colors`}
                  >
                    <RestingLeaf position="top-right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-6 text-emerald-50/75">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative flex items-center"
        >
          <div className="auth-form-card glass-panel relative w-full overflow-hidden rounded-[2rem] border border-charcoal/10 p-5 shadow-[0_24px_70px_rgba(17,24,21,0.12)] md:p-8">
            <RestingLeaf position="top-left" />
            <RainDripBorder side="right" />
            <BotanicalDecoration variant="vine" className="right-0 top-6 h-28 w-44 opacity-70" />
            <BotanicalDecoration variant="sprout" className="bottom-6 left-6 h-24 w-24 opacity-60" />
            <div className="absolute -right-4 top-12 h-32 w-24 rounded-[999px] bg-emerald-100/70 blur-xl" />
            <div className="absolute right-0 top-0 h-full w-28 opacity-100 auth-leaf-side" />

            <div className="relative z-10">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-emerald-700">Welcome</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-charcoal md:text-3xl">
                    {isRegister ? 'Create your account' : 'Login to AgriPilot'}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-charcoal-muted">
                    {isRegister
                      ? 'Register once and keep your farm decision assistant ready every day.'
                      : 'Use your farm account to open your recommendation, market alerts, and live updates.'}
                  </p>
                </div>

                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 md:flex">
                  <Leaf className="h-7 w-7" />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-2 rounded-2xl bg-surface-subtle p-1 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => toggleMode('login')}
                  className={`rounded-xl px-4 py-3 transition-all ${
                    !isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-charcoal-muted'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => toggleMode('register')}
                  className={`rounded-xl px-4 py-3 transition-all ${
                    isRegister ? 'bg-white text-emerald-800 shadow-sm' : 'text-charcoal-muted'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input className={`${fieldBase} pl-11`} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Arjun Patel" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input
                            className={`${fieldBase} pl-11`}
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                        <input
                          type="email"
                          className={`${fieldBase} pl-11`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@farm.com"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input
                            type="password"
                            className={`${fieldBase} pl-11`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input
                            type="password"
                            className={`${fieldBase} pl-11`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Location / Village
                        </label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input
                            className={`${fieldBase} pl-11`}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Malur, Karnataka"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                          Primary Crop
                        </label>
                        <div className="relative">
                          <Sprout className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                          <input
                            className={`${fieldBase} pl-11`}
                            value={primaryCrop}
                            onChange={(e) => setPrimaryCrop(e.target.value)}
                            placeholder="Tomato"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                        Email or Mobile
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                        <input
                          className={`${fieldBase} pl-11`}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="name@farm.com or 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-light" />
                        <input
                          type="password"
                          className={`${fieldBase} pl-11`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-charcoal/20 text-emerald-700 focus:ring-emerald-200"
                    />
                    Keep me signed in
                  </label>
                  {!isRegister && (
                    <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                      Forgot password?
                    </button>
                  )}
                </div>

                {errorText && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    {errorText}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-5 py-4 text-sm font-bold text-white shadow-[0_12px_30px_rgba(13,92,70,0.22)] transition-all hover:bg-emerald-800 disabled:opacity-60"
                >
                  <span>{isLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Login to AgriPilot'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800 transition-all hover:border-emerald-300 hover:bg-emerald-100 disabled:opacity-60"
                  >
                    <Sprout className="h-4 w-4 text-emerald-600" />
                    <span>{isLoading ? 'Opening demo...' : 'Continue with demo account'}</span>
                  </button>
                )}
              </form>

              <div className="mt-6 rounded-2xl border border-charcoal/10 bg-surface-subtle px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-charcoal-muted">
                  {isRegister ? 'Already have an account?' : 'New to AgriPilot?'}
                </p>
                <button
                  type="button"
                  onClick={() => toggleMode(isRegister ? 'login' : 'register')}
                  className="mt-2 text-sm font-bold text-emerald-800 hover:text-emerald-900"
                >
                  {isRegister ? 'Go back to login' : 'Create your farmer account'}
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
