import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/common/ThemeToggle'
import { LoginForm } from '../features/auth'

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="M7 17L17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const isSignup = mode === 'signup'

  return (
    <main className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
      />

      <div className="fixed top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-[400px] rounded-xl border border-border bg-surface px-8 py-9 shadow-card">
        <div className="mb-6 flex items-center justify-end gap-2">
          <a
            href="#"
            className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-text-muted no-underline hover:border-accent-border hover:text-accent"
          >
            Support
            <ArrowUpRightIcon />
          </a>
        </div>

        <h1 className="text-[28px] leading-tight font-semibold text-text-h">
          {isSignup ? (
            <>
              Create your <span className="text-accent italic">account</span>.
            </>
          ) : (
            <>
              Welcome <span className="text-accent italic">back</span>.
            </>
          )}
        </h1>
        <p className="mt-1 mb-6 text-[13px] text-text-muted">
          {isSignup ? 'Start journaling your trades.' : 'Sign in to your journal.'}
        </p>

        <div className="mb-6 inline-flex rounded-full bg-surface-2 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition-colors ${
              isSignup ? 'text-text-muted' : 'bg-surface text-text-h shadow-card'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition-colors ${
              isSignup ? 'bg-surface text-text-h shadow-card' : 'text-text-muted'
            }`}
          >
            Create account
          </button>
        </div>

        <LoginForm mode={mode} onSubmit={() => navigate('/dashboard')} />

        <div className="my-6 flex items-center gap-3 text-[11px] tracking-wide text-text-muted uppercase">
          <span className="h-px flex-1 bg-border" />
          Or continue with
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium text-text-h hover:border-accent-border"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </main>
  )
}
