import { useState } from 'react'

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function LoginForm({ mode = 'signin', onSubmit }) {
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="email" className="text-xs font-medium tracking-wide text-text-muted uppercase">
            Email
          </label>
          {isSignup && (
            <span className="text-[11px] tracking-wide text-text-muted uppercase">For verification</span>
          )}
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm text-text-h outline-none transition-colors placeholder:text-text-muted focus:border-accent-border"
        />
      </div>

      {!isSignup && (
        <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-medium tracking-wide text-text-muted uppercase"
          >
            Password
          </label>
          {isSignup && (
            <span className="text-[11px] tracking-wide text-text-muted uppercase">Min 8 chars</span>
          )}
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 pr-14 text-sm text-text-h outline-none transition-colors placeholder:text-text-muted focus:border-accent-border"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[11px] font-medium tracking-wide text-text-muted uppercase hover:text-text-h"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      )}

      {!isSignup && (
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex cursor-pointer items-center gap-1.5 text-text-muted">
            <input type="checkbox" name="remember" className="accent-accent" />
            <span>Remember device</span>
          </label>
          <a href="#" className="text-text-muted no-underline hover:underline">
            Forgot password?
          </a>
        </div>
      )}

      <button
        type="submit"
        className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-accent px-3 py-2.5 text-sm font-semibold text-[#06110b] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {isSignup ? 'Create account' : 'Sign in'}
        <ArrowRightIcon />
      </button>
    </form>
  )
}
