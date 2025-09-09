import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SocialProofStrip from './components/SocialProofStrip'
import BenefitCards from './components/BenefitCards'
import DemoForm from './components/DemoForm'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <SocialProofStrip />
      <BenefitCards />
      <DemoForm />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
