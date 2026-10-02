import React from 'react';
import { Phone, Calendar, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-30 w-full bg-neutral-950 border-t border-white/10 py-16 px-6 select-none">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Slogan */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Studio Photographique d'Art</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wide">
            Studio <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">Ezélia</span>
          </h2>
          <p className="text-sm text-neutral-400 italic font-medium mt-1">
            « L'art à portée de main »
          </p>
          <p className="text-xs text-neutral-500 mt-2 max-w-sm">
            Mariages royaux, célébrations d'exception, portraits impériaux et créations photographiques exclusives.
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <a
            href="https://wa.me/2250700000000"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Réserver une Séance</span>
          </a>

          <a
            href="tel:+2250700000000"
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-violet-400" />
            <span>+225 07 00 00 00 00</span>
          </a>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <div>
          © {new Date().getFullYear()} Studio Ezélia. Tous droits réservés.
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Abidjan, Côte d'Ivoire</span>
          <span>·</span>
          <span>International</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
