import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Users, 
  Heart, 
  Clock, 
  FileText,
  KeyRound,
  ShieldCheck,
  FlaskConical,
  Code,
  Users2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function HowItWorks() {
  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      num: "1",
      title: "1. Create & Lock",
      description: "Initialize your digital vault and securely deposit your assets (USDC/EURC). Your funds are instantly governed by immutable smart contracts.",
      icon: Lock,
      isTeal: false
    },
    {
      num: "2",
      title: "2. Designate Heirs",
      description: "Name your beneficiaries by providing their wallet addresses and allocate specific percentages of your vault to each.",
      icon: Users,
      isTeal: false
    },
    {
      num: "3",
      title: "3. Liveness Check-in",
      description: "Establish a heartbeat for your vault. A simple, gas-optimized one-click confirmation proves your presence periodically to keep the vault dormant.",
      icon: Heart,
      isTeal: true
    },
    {
      num: "4",
      title: "4. Grace Period",
      description: "If a scheduled check-in is missed, a 7-day grace period automatically initiates, providing a fail-safe window before any asset movement.",
      icon: Clock,
      isTeal: false
    },
    {
      num: "5",
      title: "5. Distribution",
      description: "Following the grace period, the smart contract unlocks. Beneficiaries can claim their exact designated shares indefinitely, with no expiry.",
      icon: FileText,
      isTeal: true
    }
  ];

  const faqs = [
    {
      question: "What happens if I forget to check in?",
      answer: "If a ping heartbeat is missed, the smart contract initiates the grace period (usually 7 days). During this time, the owner can still ping to cancel the inheritance process. If the grace period expires without any activity, the vault becomes permanently claimable by designated beneficiaries."
    },
    {
      question: "Can I change my beneficiaries later?",
      answer: "Yes, you can edit your beneficiaries, add or remove addresses, and modify allocation percentages at any time before the vault's heartbeat expires and the grace period passes."
    },
    {
      question: "Do beneficiary claims expire?",
      answer: "No. Once the vault's heartbeat and grace period have expired, the smart contract unlocks the funds. Beneficiaries can claim their designated shares at any point in the future—there is no deadline for claiming."
    },
    {
      question: "What does Testnet Phase mean?",
      answer: "Kodaik is currently running on the Arc Testnet. All transactions, deposits, and smart contract executions use test tokens and have zero financial risk, allowing you to thoroughly test your digital legacy setup."
    }
  ];

  return (
    <div className="min-h-screen text-[#FDF8F0] selection:bg-[#E98B4B]/30 selection:text-[#E98B4B]">
      
      {/* SECTION 1: How Kodaik Keeps Your Legacy Safe (Deep Teal Green) */}
      <section className="bg-[#051C18] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#E5C384] tracking-tight leading-none">
              How Kodaik Keeps Your Legacy Safe
            </h1>
            <p className="text-sm sm:text-base text-[#829693] leading-relaxed max-w-2xl mx-auto">
              A seamless fusion of cutting-edge decentralized security and intuitive design, ensuring your digital wealth transcends generations with absolute certainty.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative py-8">
            
            {/* Central Vertical Timeline Line (Gold) */}
            <div className="absolute right-[24px] sm:right-[40px] md:right-[60px] top-4 bottom-4 w-[1px] bg-[#E5C384]/35" />

            {/* Steps Container */}
            <div className="space-y-12">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const borderStyles = s.isTeal 
                  ? 'border-[#35DCA5]/40 hover:border-[#35DCA5]' 
                  : 'border-[#E5C384]/20 hover:border-[#E5C384]/40';
                
                const pillBorder = s.isTeal
                  ? 'border-[#35DCA5] text-[#35DCA5]'
                  : 'border-[#E5C384] text-[#E5C384]';

                const iconColor = s.isTeal ? 'text-[#35DCA5]' : 'text-[#E5C384]';

                return (
                  <div key={idx} className="relative flex items-center justify-between">
                    
                    {/* Card container on the left */}
                    <div className={`w-[calc(100%-64px)] sm:w-[calc(100%-96px)] md:w-[calc(100%-140px)] bg-[#0A2622] border ${borderStyles} p-6 sm:p-8 rounded-[18px] shadow-xl transition-all duration-300`}>
                      <div className="flex items-start gap-4">
                        <Icon className={`h-5 w-5 shrink-0 mt-1 ${iconColor}`} />
                        <div className="space-y-2">
                          <h3 className="font-display font-black text-lg sm:text-xl text-[#FDF8F0] tracking-tight">
                            {s.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#829693] leading-relaxed font-sans">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Pill on the vertical line */}
                    <div className={`absolute right-0 w-12 h-12 rounded-[14px] bg-[#051C18] border-2 ${pillBorder} flex items-center justify-center font-sans font-black text-sm select-none shadow-lg z-10`}>
                      {s.num}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: Why True Legacy Lives On-Chain (Warm Charcoal Black) */}
      <section className="bg-[#131211] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1E5148]/10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-[#E5C384] tracking-tight">
              Why True Legacy Lives On-Chain
            </h2>
          </div>

          {/* Three side-by-side cream cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Card 1: Non-Custodial */}
            <div className="bg-[#FDFBF7] rounded-[20px] p-8 shadow-2xl flex flex-col justify-between transition-all hover:translate-y-[-4px] duration-300">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#051C18] flex items-center justify-center text-[#E5C384]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-sans font-black text-xl text-[#12110F] tracking-tight">
                    Non-Custodial
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed font-medium font-sans">
                    You retain absolute ownership. Kodaik never holds your private keys or possesses the ability to access, freeze, or alter your funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Verifiable Logic */}
            <div className="bg-[#FDFBF7] rounded-[20px] p-8 shadow-2xl flex flex-col justify-between transition-all hover:translate-y-[-4px] duration-300">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#051C18] flex items-center justify-center text-[#35DCA5]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-sans font-black text-xl text-[#12110F] tracking-tight">
                    Verifiable Logic
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed font-medium font-sans">
                    Every rule governing your vault is encoded in open-source smart contracts. The execution is deterministic, transparent, and inevitable.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Testnet Phase */}
            <div className="bg-[#FDFBF7] rounded-[20px] p-8 shadow-2xl flex flex-col justify-between transition-all hover:translate-y-[-4px] duration-300">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#051C18] flex items-center justify-center text-[#E5C384]">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-sans font-black text-xl text-[#12110F] tracking-tight">
                    Testnet Phase
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C5F5B] leading-relaxed font-medium font-sans">
                    Currently operating on a secure test network. This allows you to experience the protocol's mechanics risk-free before mainnet deployment.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Horizontal Badges row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-[#E5C384] text-xs font-black uppercase tracking-widest pt-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Non-Custodial</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 shrink-0" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 shrink-0" />
              <span>No Company Control</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Frequently Asked Questions (Deep Teal Green) */}
      <section className="bg-[#051C18] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1E5148]/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4.5xl text-[#FDF8F0] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#0A2622] border border-[#1E5148]/30 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left cursor-pointer focus:outline-none select-none"
                  >
                    <span className="text-sm sm:text-base font-sans font-black text-[#FDF8F0] tracking-tight">
                      {faq.question}
                    </span>
                    <span className="text-[#E5C384] font-bold text-xl ml-4 shrink-0">
                      {isOpen ? (
                        <span className="block transform rotate-45 transition-transform duration-300">+</span>
                      ) : (
                        <span className="block transform rotate-0 transition-transform duration-300">+</span>
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-[#1E5148]/15">
                          <p className="text-xs sm:text-sm text-[#829693] leading-relaxed font-sans">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
