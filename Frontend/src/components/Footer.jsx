import { useState } from 'react';
import { PlayCircle, Globe, X, Info, ExternalLink } from 'lucide-react';

// Inline LinkedIn SVG since lucide-react doesn't include it
function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 max-w-lg w-full z-10 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
            <span className="text-lg font-black text-white">P</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Product Manager Accelerator</h3>
            <p className="text-white/40 text-xs">Empowering PMs at every career stage</p>
          </div>
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-4">
          The <span className="text-primary-300 font-semibold">Product Manager Accelerator</span> is a premier program supporting PM professionals from entry-level to executive leadership, with a community of over <span className="text-white font-medium">100,000+ members</span>.
        </p>

        <div className="space-y-2 mb-5">
          {[
            { emoji: '🚀', label: 'AI PM Bootcamp', desc: 'Build real-life AI products with cross-functional teams.' },
            { emoji: '🏆', label: 'PMA Pro', desc: 'Master FAANG-level PM skills and job-hunting strategies.' },
            { emoji: '📈', label: 'PMA Leader', desc: 'Accelerate careers to Director and Executive levels.' },
          ].map(({ emoji, label, desc }) => (
            <div key={label} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-lg">{emoji}</span>
              <div>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-white/40 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2 text-sm flex-1 justify-center"
          >
            <LinkedInIcon className="w-4 h-4 text-blue-400" />
            LinkedIn
          </a>
          <a
            href="https://pmaccelerator.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2 text-sm flex-1 justify-center"
          >
            <Globe className="w-4 h-4 text-primary-400" />
            Website
          </a>
          <a
            href="https://www.youtube.com/c/drnancyli"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2 text-sm flex-1 justify-center"
          >
            <PlayCircle className="w-4 h-4 text-red-400" />
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <footer className="border-t border-white/5 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <span>Developed by</span>
            <span className="text-primary-400 font-semibold">Rebira Adugna</span>
            <span>·</span>
            <span>AI Engineer Intern Assessment</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="about-pma-btn"
              onClick={() => setShowAbout(true)}
              className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              About PM Accelerator
            </button>
            <span>·</span>
            <a
              href="https://www.linkedin.com/company/product-manager-accelerator/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}
