'use client'

import { useState } from 'react'
import { ProfileSchema, type ProfileInput } from '@/lib/validation/profile'

const tones = [
  { value: 'analytical', label: 'Analytical' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'drill-sergeant', label: 'Drill Sergeant' },
]

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<ProfileInput>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    const requiredStub = {
      age: 25,
      distancePreference: 'HALF',
      fitnessLevel: 'intermediate',
      strengthPriority: 'medium',
    }
    const parsed = ProfileSchema.safeParse({ ...requiredStub, ...form })
    if (!parsed.success) {
      setSaving(false)
      setError('Please fix the highlighted fields')
      return
    }
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.message || 'Save failed')
      }
      setSuccess('Settings saved')
      // TODO: trigger plan refetch client-side when plan UI exists
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="max-w-[720px] mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <form onSubmit={submit} className="space-y-6">
        <section className="card p-6">
          <h2 className="text-lg font-medium mb-4">Coach Tone</h2>
          <select name="coachTone" onChange={onChange} className="w-full border rounded p-2">
            <option value="">Select tone</option>
            {tones.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-medium mb-4">Pace Calibration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Run Pace (min/mi)</label>
              <input name="runPaceMinPerMi" inputMode="decimal" onChange={onChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Bike Speed (mph)</label>
              <input name="bikeMph" inputMode="decimal" onChange={onChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Swim (sec/100m)</label>
              <input name="swimSecPer100m" inputMode="decimal" onChange={onChange} className="w-full border rounded p-2" />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-medium mb-4">Facilities</h2>
          <div className="flex gap-2 flex-wrap">
            {['pool', 'gym', 'treadmill', 'trainer'].map((f) => (
              <label key={f} className="inline-flex items-center gap-2 border rounded-full px-3 py-1 cursor-pointer">
                <input type="checkbox" onChange={(e) => {
                  setForm((cur) => {
                    const facilities = new Set<string>(Array.isArray(cur.facilities as any) ? (cur.facilities as any) : [])
                    if (e.target.checked) facilities.add(f)
                    else facilities.delete(f)
                    return { ...cur, facilities: Array.from(facilities) as any }
                  })
                }} />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button disabled={saving} className="btn-primary px-4 py-2 rounded">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          {success && <span className="text-green-600 text-sm">{success}</span>}
        </div>
      </form>
    </main>
  )
}

