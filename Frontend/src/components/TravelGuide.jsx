import { PlayCircle, ExternalLink } from 'lucide-react';

export default function TravelGuide({ travelGuide }) {
  if (!travelGuide) return null;

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <PlayCircle className="w-5 h-5 text-red-500" />
        <h3 className="text-white font-semibold text-sm">Travel Guide</h3>
        <a
          href={`https://www.youtube.com/watch?v=${travelGuide.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-white/30 hover:text-white/60 transition-colors"
          title="Open in YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={travelGuide.url}
          title={travelGuide.title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-white/40 text-xs px-5 py-3 line-clamp-1">{travelGuide.title}</p>
    </div>
  );
}
