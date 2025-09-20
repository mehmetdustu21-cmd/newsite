import { Metadata } from 'next'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import DemoVideoSection from './components/DemoVideoSection'
import SocialProofSection from './components/SocialProofSection'
import DemoForm from './components/DemoForm'
import PricingSection from './components/PricingSection'
import Footer from './components/Footer'
import LiveSupportButton from './components/LiveSupportButton'

export const metadata: Metadata = {
  title: 'EasyChat - Your AI Chatbot and WhatsApp Chatbot Solution',
  description: 'EasyChat provides advanced AI chatbot and WhatsApp chatbot solutions for seamless customer communication. Build your AI agent today!',
  keywords: 'easychat, whatsapp chatbot, chatbot ai agent, ai chatbot, customer service chatbot, ai agent',
}

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <DemoVideoSection />
      <SocialProofSection />
      <DemoForm />
      <PricingSection />
      <Footer />
      <LiveSupportButton />
    </main>
  )
}
