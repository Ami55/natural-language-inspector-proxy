import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  SlidersHorizontal, 
  Trash2, 
  Type, 
  Sparkles, 
  TrendingUp, 
  FileSpreadsheet,
  HelpCircle,
  Hash
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NGramItem, NGramStats } from '../types';
import { ThemeConfig } from '../theme';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COMMON_STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", 
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", 
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", 
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", 
  "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", 
  "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", 
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", 
  "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", 
  "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", 
  "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", 
  "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", 
  "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", 
  "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", 
  "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);

const NGRAM_SAMPLE_CORPUS = [
  {
    name: "Customer Feedback & Reviews",
    text: `The product quality is absolutely amazing and well designed.
The battery life lasts all day and exceeds my expectations.
Customer service was quick, helpful, and very responsive.
The product quality was good but delivery was slightly delayed.
Overall customer service and support made the whole experience fantastic.`
  },
  {
    name: "AI & Natural Language Research",
    text: `Natural language processing enables machines to understand human language.
Large language models utilize transformer architectures for entity extraction.
Named entity recognition identifies real world objects like persons and organizations.
Machine learning and natural language processing power modern search engines.
Entity recognition and sentiment analysis provide rich semantic insights.`
  },
  {
    name: "Search Queries & Intent",
    text: `best lightweight laptop for programming
cheap flight tickets to new york
how to learn python machine learning
best lightweight laptop for graphic design
cheap hotel in new york city downtown`
  }
];

interface NGramAnalyzerProps {
  initialText: string;
  theme: ThemeConfig;
  onApplyToMainText?: (text: string) => void;
}

export const NGramAnalyzer: React.FC<NGramAnalyzerProps> = ({ 
  initialText,
  theme,
  onApplyToMainText
}) => {
  const [corpusText, setCorpusText] = useState(initialText);
  const [n, setN] = useState<number>(2);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Normalization filters
  const [lowercase, setLowercase] = useState(true);
  const [removePunctuation, setRemovePunctuation] = useState(true);
  const [removeStopwords, setRemoveStopwords] = useState(false);
  const [minFrequency, setMinFrequency] = useState(1);
  const [showFilterSettings, setShowFilterSettings] = useState(false);
  
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Sync with main text if initialText changes and corpus is currently matching
  React.useEffect(() => {
    if (initialText && !corpusText) {
      setCorpusText(initialText);
    }
  }, [initialText]);

  // Tokenize and extract N-Grams
  const { nGrams, stats } = useMemo(() => {
    if (!corpusText.trim()) {
      return { 
        nGrams: [] as NGramItem[], 
        stats: { totalTokens: 0, totalNGrams: 0, uniqueNGrams: 0, lexicalDiversity: 0 } as NGramStats,
      };
    }

    // Split by lines or sentence boundaries
    const lines = corpusText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const freqMap: Record<string, number> = {};
    let totalGramsCount = 0;
    let totalProcessedTokens = 0;

    lines.forEach(line => {
      let processed = line;
      if (lowercase) {
        processed = processed.toLowerCase();
      }
      if (removePunctuation) {
        processed = processed.replace(/[^\w\s\$\€\£\%\-]/g, ' ');
      }

      let tokens = processed
        .split(/\s+/)
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (removeStopwords) {
        tokens = tokens.filter(t => !COMMON_STOPWORDS.has(t.toLowerCase()));
      }

      totalProcessedTokens += tokens.length;

      if (tokens.length < n) return;

      for (let i = 0; i <= tokens.length - n; i++) {
        const gram = tokens.slice(i, i + n).join(' ');
        freqMap[gram] = (freqMap[gram] || 0) + 1;
        totalGramsCount++;
      }
    });

    const items: NGramItem[] = Object.entries(freqMap)
      .map(([gram, count]) => ({
        gram,
        count,
        percentage: totalGramsCount > 0 ? (count / totalGramsCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count || a.gram.localeCompare(b.gram));

    const uniqueCount = items.length;
    const diversity = totalProcessedTokens > 0 
      ? Math.round((uniqueCount / totalProcessedTokens) * 100) 
      : 0;

    const statsObj: NGramStats = {
      totalTokens: totalProcessedTokens,
      totalNGrams: totalGramsCount,
      uniqueNGrams: uniqueCount,
      lexicalDiversity: diversity
    };

    return {
      nGrams: items,
      stats: statsObj,
    };
  }, [corpusText, n, lowercase, removePunctuation, removeStopwords]);

  // Apply search & min frequency filter
  const filteredNGrams = useMemo(() => {
    return nGrams.filter(item => {
      if (item.count < minFrequency) return false;
      if (searchTerm.trim() && !item.gram.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [nGrams, searchTerm, minFrequency]);

  const maxCount = nGrams.length > 0 ? nGrams[0].count : 1;

  const handleCopyTSV = () => {
    if (filteredNGrams.length === 0) return;
    const header = "Rank\tN-Gram\tFrequency\tPercentage\n";
    const body = filteredNGrams.map((g, i) => `${i + 1}\t${g.gram}\t${g.count}\t${g.percentage.toFixed(1)}%`).join('\n');
    navigator.clipboard.writeText(header + body);
    setCopiedFormat('tsv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownloadCSV = () => {
    if (filteredNGrams.length === 0) return;
    const header = "Rank,N-Gram,Frequency,Percentage\n";
    const body = filteredNGrams.map((g, i) => `${i + 1},"${g.gram.replace(/"/g, '""')}",${g.count},${g.percentage.toFixed(2)}%`).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `n-grams-${n}-gram-analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nLabels: Record<number, string> = {
    1: 'Unigrams (1-word)',
    2: 'Bigrams (2-words)',
    3: 'Trigrams (3-words)',
    4: '4-Grams (4-words)',
    5: '5-Grams (5-words)',
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Toolbar */}
      <div className={cn(
        "rounded-2xl border p-5 space-y-4 transition-colors duration-200",
        theme.classes.card,
        theme.classes.border
      )}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-bold border transition-colors",
              theme.classes.accentBg,
              theme.classes.accentText,
              theme.classes.accentBorder
            )}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className={cn("text-base font-bold flex items-center gap-2", theme.classes.textPrimary)}>
                <span>N-Gram Frequency & Collocation Analyzer</span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full border",
                  theme.classes.accentBg,
                  theme.classes.accentText,
                  theme.classes.accentBorder
                )}>
                  Client-Side NLP
                </span>
              </h2>
              <p className={cn("text-xs", theme.classes.textSecondary)}>
                Generate contiguous word sequences to uncover recurring phrases, keyword collocations, and lexical distribution.
              </p>
            </div>
          </div>

          {/* N-Gram Length (N Selector) */}
          <div className={cn(
            "flex items-center gap-1.5 p-1 rounded-xl border self-start md:self-auto",
            theme.isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-zinc-100 border-zinc-200"
          )}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setN(val)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  n === val
                    ? theme.classes.tabActive
                    : theme.classes.tabInactive
                )}
              >
                {val === 1 ? '1 Uni' : val === 2 ? '2 Bi' : val === 3 ? '3 Tri' : `${val}-gram`}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Samples */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 pb-1 no-scrollbar">
          <span className={cn("font-semibold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap", theme.classes.textMuted)}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Corpus:
          </span>
          <button
            onClick={() => setCorpusText(initialText)}
            className={cn(
              "px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all border cursor-pointer",
              theme.isDark 
                ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800" 
                : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200"
            )}
          >
            Use Main Input Text
          </button>
          {NGRAM_SAMPLE_CORPUS.map((corpus, idx) => (
            <button
              key={idx}
              onClick={() => setCorpusText(corpus.text)}
              className={cn(
                "px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all border cursor-pointer",
                theme.isDark 
                  ? "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800/80" 
                  : "bg-white hover:bg-zinc-100 text-zinc-600 border-zinc-200"
              )}
            >
              {corpus.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Column & Results Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Area & Filtering Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className={cn("rounded-2xl border overflow-hidden flex flex-col transition-colors", theme.classes.card, theme.classes.border)}>
            <div className={cn("p-3.5 border-b flex items-center justify-between", theme.classes.cardSubtle, theme.classes.border)}>
              <div className={cn("flex items-center gap-2 font-semibold text-xs uppercase tracking-wider", theme.classes.textPrimary)}>
                <Type className="w-3.5 h-3.5 text-emerald-500" />
                <span>Text / Phrase Corpus</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilterSettings(!showFilterSettings)}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border",
                    showFilterSettings || removeStopwords || !lowercase || !removePunctuation || minFrequency > 1
                      ? cn(theme.classes.accentBg, theme.classes.accentText, theme.classes.accentBorder)
                      : cn(theme.classes.textSecondary, "border-transparent hover:bg-zinc-800/20")
                  )}
                  title="Toggle Normalization Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Options</span>
                </button>
                <button
                  onClick={() => setCorpusText('')}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors cursor-pointer",
                    theme.isDark ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40" : "text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                  )}
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Options Drawer */}
            <AnimatePresence>
              {showFilterSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn("overflow-hidden border-b p-3.5 space-y-2.5 text-xs", theme.classes.cardSubtle, theme.classes.border, theme.classes.textPrimary)}
                >
                  <div className={cn("font-bold text-[11px] uppercase tracking-wider", theme.classes.textMuted)}>
                    Text Processing Rules
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={lowercase}
                        onChange={(e) => setLowercase(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Lowercase</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={removePunctuation}
                        onChange={(e) => setRemovePunctuation(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Strip Punctuation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={removeStopwords}
                        onChange={(e) => setRemoveStopwords(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Remove Stopwords</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className={theme.classes.textSecondary}>Min:</span>
                      <select
                        value={minFrequency}
                        onChange={(e) => setMinFrequency(Number(e.target.value))}
                        className={cn("border rounded px-2 py-0.5 text-xs font-semibold", theme.classes.inputBg, theme.classes.border)}
                      >
                        <option value={1}>≥ 1 (All)</option>
                        <option value={2}>≥ 2 times</option>
                        <option value={3}>≥ 3 times</option>
                        <option value={5}>≥ 5 times</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-3">
              <textarea
                value={corpusText}
                onChange={(e) => setCorpusText(e.target.value)}
                placeholder="Type or paste sentences, search queries, or user feedback here (one phrase per line or full paragraph)..."
                rows={10}
                className={cn(
                  "w-full resize-y min-h-[220px] p-3 font-sans border rounded-xl transition-all text-sm leading-relaxed",
                  theme.classes.inputBg,
                  theme.classes.borderFocus
                )}
              />
            </div>

            <div className={cn("px-3.5 py-2.5 border-t flex items-center justify-between text-xs", theme.classes.cardSubtle, theme.classes.border, theme.classes.textSecondary)}>
              <span>{corpusText.trim() ? corpusText.trim().split(/\r?\n/).length : 0} lines • {stats.totalTokens} tokens</span>
              {onApplyToMainText && (
                <button
                  onClick={() => onApplyToMainText(corpusText)}
                  className={cn("font-semibold text-xs hover:underline cursor-pointer", theme.classes.accentText)}
                >
                  Send to Entity Explorer →
                </button>
              )}
            </div>
          </div>

          {/* Quick Frequency Preview Cloud */}
          {filteredNGrams.length > 0 && (
            <div className={cn("rounded-2xl border p-4 space-y-3", theme.classes.card, theme.classes.border)}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className={cn("flex items-center gap-1.5", theme.classes.textPrimary)}>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Top N-Gram Collocations
                </span>
                <span className={cn("text-[10px] font-normal", theme.classes.textMuted)}>Click to search</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredNGrams.slice(0, 15).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchTerm(searchTerm === item.gram ? '' : item.gram)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                      searchTerm === item.gram
                        ? theme.classes.accent
                        : cn(
                            theme.isDark 
                              ? "bg-zinc-900/90 text-zinc-200 border-zinc-800 hover:border-zinc-700" 
                              : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                          )
                    )}
                  >
                    <span>{item.gram}</span>
                    <span className={cn(
                      "text-[10px] px-1 py-0.2 rounded font-mono font-bold",
                      searchTerm === item.gram 
                        ? "bg-white/20 text-white" 
                        : (theme.isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200/70 text-zinc-600")
                    )}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Statistics & Detailed Ranking Table */}
        <div className="lg:col-span-7 space-y-4">
          {/* Summary Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={cn("p-3.5 rounded-xl border transition-colors", theme.classes.card, theme.classes.border)}>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", theme.classes.textMuted)}>Tokens</p>
              <p className={cn("text-xl font-bold font-mono mt-0.5", theme.classes.textPrimary)}>{stats.totalTokens}</p>
            </div>
            <div className={cn("p-3.5 rounded-xl border transition-colors", theme.classes.card, theme.classes.border)}>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", theme.classes.textMuted)}>Total {n}-Grams</p>
              <p className="text-xl font-bold font-mono text-emerald-500 mt-0.5">{stats.totalNGrams}</p>
            </div>
            <div className={cn("p-3.5 rounded-xl border transition-colors", theme.classes.card, theme.classes.border)}>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", theme.classes.textMuted)}>Unique {n}-Grams</p>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{stats.uniqueNGrams}</p>
            </div>
            <div className={cn("p-3.5 rounded-xl border transition-colors", theme.classes.card, theme.classes.border)}>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center justify-between", theme.classes.textMuted)}>
                <span>Lexical TTR</span>
                <span title="Type-Token Ratio: ratio of unique n-grams to total tokens" className="cursor-help">
                  <HelpCircle className="w-3 h-3 text-zinc-400" />
                </span>
              </p>
              <p className="text-xl font-bold font-mono text-purple-400 mt-0.5">{stats.lexicalDiversity}%</p>
            </div>
          </div>

          {/* Results Table Card */}
          <div className={cn("rounded-2xl border overflow-hidden flex flex-col min-h-[420px] transition-colors", theme.classes.card, theme.classes.border)}>
            {/* Table Header Bar */}
            <div className={cn("p-3.5 border-b flex flex-wrap items-center justify-between gap-3", theme.classes.cardSubtle, theme.classes.border)}>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span className={cn("font-bold text-xs uppercase tracking-wider", theme.classes.textPrimary)}>
                  {nLabels[n]} Results
                </span>
                <span className={cn("text-xs font-mono", theme.classes.textSecondary)}>
                  ({filteredNGrams.length} matched)
                </span>
              </div>

              {/* Filter Search Input & Export Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className={cn("w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2", theme.classes.textMuted)} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search N-Gram..."
                    className={cn(
                      "pl-8 pr-3 py-1 border rounded-lg text-xs w-36 sm:w-44 transition-all",
                      theme.classes.inputBg,
                      theme.classes.borderFocus
                    )}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={cn("absolute right-2 top-1/2 -translate-y-1/2 text-xs", theme.classes.textMuted)}
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCopyTSV}
                  disabled={filteredNGrams.length === 0}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 cursor-pointer border",
                    theme.isDark 
                      ? "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700" 
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                  )}
                  title="Copy formatted TSV table to clipboard"
                >
                  {copiedFormat === 'tsv' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedFormat === 'tsv' ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleDownloadCSV}
                  disabled={filteredNGrams.length === 0}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 cursor-pointer border",
                    theme.classes.accentBg,
                    theme.classes.accentText,
                    theme.classes.accentBorder
                  )}
                  title="Download CSV spreadsheet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
              </div>
            </div>

            {/* Scrollable Table Body */}
            <div className="flex-1 overflow-y-auto max-h-[460px] custom-scrollbar">
              {filteredNGrams.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead className={cn(
                    "sticky top-0 border-b z-10 text-[11px] font-bold uppercase tracking-wider",
                    theme.classes.cardSubtle,
                    theme.classes.border,
                    theme.classes.textMuted
                  )}>
                    <tr>
                      <th className="py-2.5 px-4 w-12 text-center">#</th>
                      <th className="py-2.5 px-4">{n}-Gram Sequence</th>
                      <th className="py-2.5 px-4 text-right w-28">Frequency</th>
                      <th className="py-2.5 px-4 w-36 hidden sm:table-cell">Distribution</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y text-sm", theme.isDark ? "divide-zinc-800/80" : "divide-zinc-100")}>
                    {filteredNGrams.map((item, idx) => {
                      const relPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                      return (
                        <tr
                          key={item.gram}
                          className={cn("transition-colors group", theme.classes.cardHover)}
                        >
                          <td className={cn("py-2.5 px-4 text-xs font-mono text-center", theme.classes.textMuted)}>
                            {idx + 1}
                          </td>
                          <td className={cn("py-2.5 px-4 font-medium", theme.classes.textPrimary)}>
                            <span className="font-mono text-[13px] group-hover:text-emerald-400 transition-colors">
                              {item.gram}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-500">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <span>{item.count}</span>
                              <span className={cn("text-[10px] font-normal", theme.classes.textMuted)}>
                                ({item.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 hidden sm:table-cell">
                            <div className={cn("w-full h-2 rounded-full overflow-hidden", theme.isDark ? "bg-zinc-800" : "bg-zinc-100")}>
                              <div
                                style={{ width: `${relPercent}%` }}
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={cn("flex flex-col items-center justify-center p-12 text-center h-full", theme.classes.textMuted)}>
                  <div className={cn("w-14 h-14 border rounded-full flex items-center justify-center mb-3", theme.classes.cardSubtle, theme.classes.border)}>
                    <Search className="w-6 h-6 opacity-40" />
                  </div>
                  <h4 className={cn("text-sm font-bold mb-1", theme.classes.textPrimary)}>No N-Grams Found</h4>
                  <p className="text-xs max-w-xs">
                    {corpusText.trim() 
                      ? 'No items matched your search filter or minimum frequency threshold.' 
                      : 'Type or paste some text on the left to extract n-grams.'}
                  </p>
                </div>
              )}
            </div>

            {/* Table Footer Summary */}
            <div className={cn("p-3 border-t flex items-center justify-between text-xs font-medium", theme.classes.cardSubtle, theme.classes.border, theme.classes.textSecondary)}>
              <span>Showing {filteredNGrams.length} of {nGrams.length} unique {n}-grams</span>
              <span>N-Gram Order: {n}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
