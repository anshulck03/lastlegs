import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ValueCards from '@/components/ValueCards'
import HowItWorks from '@/components/HowItWorks'
import DashboardPreview from '@/components/DashboardPreview'
import RaceFinder from '@/components/RaceFinder'
import Guarantee from '@/components/Guarantee'
import FAQ from '@/components/FAQ'
import Waitlist from '@/components/Waitlist'
import Footer from '@/components/Footer'
import MiniNav from '@/components/ui/MiniNav'

export default function Home() {
  return (
    <main className="bg-analytic">
      <div className="radar-sweep" />
      <div className="crimson-node" />
      <div className="crimson-node" />
      <div className="crimson-node" />
      <div className="crimson-node" />
      <div className="crimson-node" />
      <Header />
      <MiniNav />
      <Hero />
      <ValueCards />
      <HowItWorks />
      <DashboardPreview />
      <RaceFinder />
      <Guarantee />
      <FAQ />
      <Waitlist />
      <Footer />
    </main>
  )
}
