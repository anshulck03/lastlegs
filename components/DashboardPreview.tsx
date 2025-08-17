'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'
import PixelEmitter from './ui/PixelEmitter'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'plan', label: 'Plan' },
  { id: 'progress', label: 'Progress' }
]

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState('home')

  // Keyboard navigation for tabs
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
      setActiveTab(tabs[prevIndex].id)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
      setActiveTab(tabs[nextIndex].id)
    }
  }, [activeTab])

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <Section id="dashboard" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="text-center mb-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-6">Your Training Dashboard</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Everything you need to track your progress and stay on course.
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto relative"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <PixelEmitter count={8} color="crimson" className="absolute inset-0" />
          <div className="card p-6 lg:p-8">
            {/* Tab Navigation */}
            <div 
              className="flex space-x-1 mb-8"
              role="tablist"
              aria-label="Training dashboard tabs"
              onKeyDown={handleKeyDown}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-2)] ${
                    activeTab === tab.id
                      ? 'text-[var(--text-1)]'
                      : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                  }`}
                >
                  {activeTab === tab.id && (
                    <>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--crimson)]" />
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--crimson)] rounded-full" />
                    </>
                  )}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Content Panels */}
            <div className="bg-[var(--bg-2)] rounded-xl p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'home' && (
                  <motion.div
                    key="home"
                    id="panel-home"
                    role="tabpanel"
                    aria-labelledby="tab-home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.1 : 0.3,
                      ease: "easeInOut"
                    }}
                    className="space-y-6"
                  >
                    {/* Weekly Overview */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Weekly Mileage */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-3)]">Weekly Mileage</span>
                          <span className="text-2xl font-bold text-[var(--text-1)]">47.2 mi</span>
                        </div>
                        <div className="w-full bg-[var(--line)] rounded-full h-3">
                          <motion.div
                            className="bg-[var(--crimson)] h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '78%' }}
                            transition={{ duration: prefersReducedMotion ? 0.1 : 1, delay: 0.5 }}
                          />
                        </div>
                        <div className="text-xs text-[var(--text-3)]">78% of weekly goal</div>
                      </div>

                      {/* Swim/Bike/Run Split */}
                      <div className="space-y-3">
                        <div className="text-sm text-[var(--text-3)]">This Week&apos;s Split</div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[var(--text-1)]">1.2</div>
                            <div className="text-xs text-[var(--text-3)]">Swim</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[var(--text-1)]">32.1</div>
                            <div className="text-xs text-[var(--text-3)]">Bike</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-[var(--text-1)]">13.9</div>
                            <div className="text-xs text-[var(--text-3)]">Run</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compliance & Streak */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="text-sm text-[var(--text-3)]">Training Compliance</div>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="var(--line)"
                                strokeWidth="4"
                                fill="none"
                              />
                              <motion.circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="var(--crimson)"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray="175.93"
                                strokeDashoffset="175.93"
                                initial={{ strokeDashoffset: 175.93 }}
                                animate={{ strokeDashoffset: 52.78 }}
                                transition={{ duration: prefersReducedMotion ? 0.1 : 1, delay: 1 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-[var(--text-1)]">85%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[var(--text-2)]">Completed 17 of 20 sessions</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm text-[var(--text-3)]">Current Streak</div>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[var(--crimson)] rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-[var(--bg-0)]">7</span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[var(--text-1)]">7 days</div>
                            <div className="text-sm text-[var(--text-2)]">Keep it going!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'plan' && (
                  <motion.div
                    key="plan"
                    id="panel-plan"
                    role="tabpanel"
                    aria-labelledby="tab-plan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.1 : 0.3,
                      ease: "easeInOut"
                    }}
                    className="space-y-6"
                  >
                    {/* Calendar Week Mockup */}
                    <div className="space-y-4">
                      <div className="text-sm text-[var(--text-3)]">This Week&apos;s Plan</div>
                      <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                          <div key={day} className="text-center space-y-2">
                            <div className="text-xs text-[var(--text-3)]">{day}</div>
                            <div className="h-16 bg-[var(--bg-1)] rounded-lg border border-[var(--line)] p-1">
                              {index === 1 && (
                                <div className="w-full h-2 bg-[var(--crimson)]/20 rounded text-xs text-[var(--crimson)] flex items-center justify-center">
                                  Swim
                                </div>
                              )}
                              {index === 3 && (
                                <div className="w-full h-2 bg-[var(--crimson)]/20 rounded text-xs text-[var(--crimson)] flex items-center justify-center">
                                  Bike
                                </div>
                              )}
                              {index === 5 && (
                                <div className="w-full h-2 bg-[var(--crimson)]/20 rounded text-xs text-[var(--crimson)] flex items-center justify-center">
                                  Run
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Summary */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-[var(--bg-1)] rounded-lg">
                        <div className="text-lg font-bold text-[var(--text-1)]">5</div>
                        <div className="text-xs text-[var(--text-3)]">Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-[var(--bg-1)] rounded-lg">
                        <div className="text-lg font-bold text-[var(--text-1)]">12h</div>
                        <div className="text-xs text-[var(--text-3)]">Total Time</div>
                      </div>
                      <div className="text-center p-4 bg-[var(--bg-1)] rounded-lg">
                        <div className="text-lg font-bold text-[var(--text-1)]">85%</div>
                        <div className="text-xs text-[var(--text-3)]">Completion</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'progress' && (
                  <motion.div
                    key="progress"
                    id="panel-progress"
                    role="tabpanel"
                    aria-labelledby="tab-progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.1 : 0.3,
                      ease: "easeInOut"
                    }}
                    className="space-y-6"
                  >
                    {/* Mini Sparkline Chart */}
                    <div className="space-y-3">
                      <div className="text-sm text-[var(--text-3)]">Weekly Progress</div>
                      <div className="h-16 bg-[var(--bg-1)] rounded-lg p-4 flex items-end justify-between">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke="var(--crimson)"
                            strokeWidth="2"
                            points="0,35 10,30 20,25 30,20 40,15 50,10 60,8 70,5 80,12 90,8 100,5"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Circular Compliance Ring */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="var(--line)"
                            strokeWidth="6"
                            fill="none"
                          />
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="var(--crimson)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray="251.2"
                            strokeDashoffset="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 37.68 }}
                            transition={{ duration: prefersReducedMotion ? 0.1 : 1.5, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[var(--text-1)]">85%</div>
                            <div className="text-xs text-[var(--text-3)]">Compliance</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-[var(--bg-1)] rounded-lg">
                        <div className="text-sm font-bold text-[var(--text-1)]">+12%</div>
                        <div className="text-xs text-[var(--text-3)]">vs Last Week</div>
                      </div>
                      <div className="text-center p-3 bg-[var(--bg-1)] rounded-lg">
                        <div className="text-sm font-bold text-[var(--text-1)]">92%</div>
                        <div className="text-xs text-[var(--text-3)]">Goal Progress</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
