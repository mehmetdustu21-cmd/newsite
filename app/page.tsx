import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SocialProofStrip from './components/SocialProofStrip'
import BenefitCards from './components/BenefitCards'
import DemoForm from './components/DemoForm'
import PricingSection from './components/PricingSection'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

export const metadata = {
  title: 'EasyChat - Your AI Chatbot and WhatsApp Chatbot Solution',
  description: 'EasyChat provides advanced AI chatbot and WhatsApp chatbot solutions for seamless customer communication. Build your AI agent today!',
  keywords: 'easychat, whatsapp chatbot, chatbot ai agent, ai chatbot, customer service chatbot, ai agent',
}

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
