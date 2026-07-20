import { FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050D0A] border-t border-[#1E5148]/30 py-16 text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#1E5148]/10">
          
          {/* Left Column - Brand Info */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-[#0B2E26] border border-[#1E5148]/50 p-2.5 rounded-xl shadow-md flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-[#E5C384]" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-[#FDF8F0] !font-sans">
                Kodaik
              </span>
            </div>
            
            <p className="text-sm text-[#829693] max-w-sm leading-relaxed">
              Securing your digital legacy for the next generation. Trustless, non-custodial inheritance vaults on-chain.
            </p>
            
            <p className="text-xs text-[#829693]/60 pt-4">
              © 2024 Kodaik. Built by <span className="text-[#E5C384] font-medium">Abu Bakar</span>.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Resources Column */}
          <div className="md:col-span-2.5 space-y-4">
            <h5 className="text-xs font-bold text-[#E5C384] uppercase tracking-widest">
              Resources
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-[#E98B4B] transition-colors text-[#829693]">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#audit" className="hover:text-[#E98B4B] transition-colors text-[#829693]">
                  Security Audit
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-2.5 space-y-4">
            <h5 className="text-xs font-bold text-[#E5C384] uppercase tracking-widest">
              Legal
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#privacy" className="hover:text-[#E98B4B] transition-colors text-[#829693]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#E98B4B] transition-colors text-[#829693]">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner with Building On Arc Badge */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-[#829693]/50">
            Kodaik is a decentralized non-custodial protocol. Lock funds at your own responsibility.
          </span>
          
          <div className="border border-[#E5C384]/40 bg-[#071F1B] px-5 py-2.5 rounded-xl font-sans font-bold text-[10px] tracking-widest text-[#E5C384] uppercase shadow-inner">
            Building on Arc
          </div>
        </div>
      </div>
    </footer>
  );
}
