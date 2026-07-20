import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  BellRing, 
  KeyRound, 
  Users, 
  Sparkles, 
  Lock,
  ArrowRight,
  ShieldAlert,
  Fingerprint
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Vault Configuration & Locking",
      description: "An owner initializes an inheritance vault on-chain. They specify a vault name, choose assets to secure (native ARC), select a keep-alive heartbeat interval (e.g. 180 days), and designate beneficiaries with custom basis-point share divisions.",
      icon: Lock,
      color: "#E98B4B"
    },
    {
      num: "02",
      title: "The Keep-Alive Protocol",
      description: "To prevent claim windows from opening, the owner must periodically log a transaction known as a 'Ping' (Keep-Alive) with the smart contract. This resets the countdown back to the configured heartbeat interval, proving they remain active.",
      icon: Clock,
      color: "#E5C384"
    },
    {
      num: "03",
      title: "Autonomous Heartbeat Expiry",
      description: "If the owner remains inactive past the heartbeat interval, the smart contract registers a decentralized flag. The system does not depend on central authorities; the absolute passage of time on the blockchain determines the expiration.",
      icon: ShieldAlert,
      color: "#E98B4B"
    },
    {
      num: "04",
      title: "Consensus-Free Beneficiary Claiming",
      description: "Once the deadline has expired, the Claim Portal is unlocked. Any registered beneficiary can call the non-custodial 'claim' transaction, triggering instant, automated smart contract distribution of assets directly to their wallet.",
      icon: KeyRound,
      color: "#E5C384"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <div className="inline-flex items-center space-x-1 bg-[#153F39] border border-[#E5C384]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#E5C384]">
          <Fingerprint className="h-4 w-4 text-[#E98B4B]" />
          <span>Sovereign Digital Asset Inheritance</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#FDF8F0] tracking-tight">
          How Kodaik <span className="text-[#E5C384]">Protects Your Legacy</span>
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1]/80 leading-relaxed">
          The non-custodial cryptographic heartbeat protocol guarantees your assets go exactly where you want, with absolute zero third-party dependencies.
        </p>
      </div>

      {/* Interactive Timeline Layout */}
      <div className="relative border-l border-[#1E5148]/60 ml-4 sm:ml-8 space-y-16 mb-20">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative pl-8 sm:pl-12 group"
            >
              {/* Timeline dot */}
              <div 
                className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 bg-[#071F1B] border-[#1E5148] flex items-center justify-center transition-all duration-300 group-hover:border-[#E98B4B]"
                style={{ borderColor: idx % 2 === 0 ? '#E98B4B' : '#E5C384' }}
              >
                <span className="text-[10px] font-bold font-mono text-[#FDF8F0]">{s.num}</span>
              </div>

              {/* Card Container */}
              <div className="bg-[#153F39]/60 border border-[#1E5148] p-6 sm:p-8 rounded-2xl shadow-xl space-y-4 transition-all duration-300 hover:border-[#1E5148]/80">
                <div className="flex items-center space-x-3.5">
                  <div 
                    className="p-3 rounded-xl w-fit"
                    style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#FDF8F0]">
                    {s.title}
                  </h3>
                </div>

                <p className="text-sm text-[#CBD5E1]/85 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final Call to Action */}
      <div className="bg-[#153F39] border border-[#E5C384]/30 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E98B4B]/5 rounded-full blur-2xl" />
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FDF8F0] mb-4">
          Ready to Secure Your On-Chain Assets?
        </h2>
        <p className="text-sm text-[#CBD5E1]/80 max-w-xl mx-auto mb-8">
          Lock in your legacy setup on the Arc Testnet today. It takes less than 5 minutes to safeguard what you've built.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
          <Link
            to="/create"
            className="bg-[#E98B4B] hover:bg-[#d67b3c] text-[#071F1B] px-8 py-3.5 rounded-xl font-display font-bold text-sm transition-all shadow-md shadow-[#E98B4B]/10 flex items-center justify-center space-x-2"
          >
            <span>Create a Vault</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="bg-transparent border border-[#1E5148] hover:bg-[#1E5148]/20 text-[#CBD5E1] px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

    </div>
  );
}
