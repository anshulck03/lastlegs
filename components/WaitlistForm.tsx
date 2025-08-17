'use client'

import { useState, useEffect, useRef } from 'react'

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    // Parse source from URL query params
    const urlParams = new URLSearchParams(window.location.search)
    const source = urlParams.get('src') || 'site'
    
    // Update hidden source input
    const sourceInput = formRef.current?.querySelector('input[name="source"]') as HTMLInputElement
    if (sourceInput) {
      sourceInput.value = source
    }

    // Focus email input if URL hash is #waitlist
    if (window.location.hash === '#waitlist' && emailInputRef.current) {
      requestAnimationFrame(() => {
        emailInputRef.current?.focus()
      })
    }
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement)?.value || ""
    if (honeypot.trim()) return // bot

    // optional min-time guard
    if (Date.now() - startTimeRef.current < 1200) {
      await new Promise(r => setTimeout(r, 1200 - (Date.now() - startTimeRef.current)))
    }

    setStatus("submitting")
    setError(null)
    
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
      
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) {
        setStatus("success")
        requestAnimationFrame(() => successRef.current?.focus())
      } else {
        setError(data?.message || "Couldn't submit. Try again in a moment.")
        setStatus("error")
      }
    } catch {
      setError("Server error. Please try again shortly.")
      setStatus("error")
    }
  }

  if (status === 'success') {
    return (
      <div 
        ref={successRef}
        role="status" 
        tabIndex={-1} 
        className="mt-6"
      >
        <h3 className="font-semibold text-[color:var(--text-1)]">
          You&apos;re in. Welcome to the first wave.
        </h3>
        <p className="text-[color:var(--text-2)]">
          We&apos;ll email you race updates + early access.
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action="/api/waitlist"
      method="POST"
      noValidate
      onSubmit={onSubmit}
      aria-describedby="waitlist-help"
      className="mt-6 w-full"
    >
      {/* Honeypot */}
      <input 
        type="text" 
        name="company" 
        tabIndex={-1} 
        autoComplete="off" 
        className="hidden" 
      />
      
      {/* Source (set on mount) */}
      <input type="hidden" name="source" value="site" />
      
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          ref={emailInputRef}
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@fastmail.com"
          className="flex-1 rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-1)] px-4 py-3 text-[color:var(--text-1)] placeholder-[color:var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[#DC143C] min-h-[44px]"
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          className="btn-primary h-11 shrink-0 px-6 md:w-auto w-full"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Claim Your Spot'}
        </button>
      </div>

      <div className="mt-2 space-y-1">
        <p id="waitlist-help" className="text-sm text-[color:var(--text-3)]">
          Unsubscribe anytime.
        </p>
        {status === "error" && (
          <p className="text-sm text-red-400">
            {error ?? "Couldn't submit. Try again in a moment."}
          </p>
        )}
      </div>
    </form>
  )
}
