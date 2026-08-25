import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Cpu, 
  Layers, 
  Tag, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  User,
  Building2,
  MapPin,
  Calendar,
  Package,
  FileText,
  Terminal,
  Download,
  Smile,
  Frown,
  Meh,
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Info,
  DollarSign,
  Compass,
  Moon,
  Sun,
  Palette,
  HelpCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { analyzeSentence } from './services/geminiService';
import { FullAnalysisResult, CloudNLPEntity } from './types';
import { NGramAnalyzer } from './components/NGramAnalyzer';
import { HowItWorksModal } from './components/HowItWorksModal';
import { THEMES, ThemeId, ThemeConfig } from './theme';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ORGANIZATION: <Building2 className="w-3.5 h-3.5" />,
  ORG: <Building2 className="w-3.5 h-3.5" />,
  LOCATION: <MapPin className="w-3.5 h-3.5" />,
  GPE: <MapPin className="w-3.5 h-3.5" />,
  PERSON: <User className="w-3.5 h-3.5" />,
  CONSUMER_GOOD: <Package className="w-3.5 h-3.5" />,
  PRODUCT: <Package className="w-3.5 h-3.5" />,
  EVENT: <Calendar className="w-3.5 h-3.5" />,
  DATE: <Calendar className="w-3.5 h-3.5" />,
  PRICE: <DollarSign className="w-3.5 h-3.5" />,
  NUMBER: <Tag className="w-3.5 h-3.5" />,
  WORK_OF_ART: <FileText className="w-3.5 h-3.5" />,
  OTHER: <Tag className="w-3.5 h-3.5" />,
};

const SAMPLE_PRESETS = [
  {
    label: "Google & Stanford Story",
    text: "Google, headquartered in Mountain View, was founded by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University. Sundar Pichai announced the new Pixel 8 for $799."
  },
  {
    label: "Apple & Cupertino",
    text: "Tim Cook visited the Apple Park headquarters in Cupertino last Monday to review the upcoming iPhone 16 launch."
  },
  {
    label: "Tesla Global Deliveries",
    text: "Tesla delivered 484,000 electric vehicles in Austin, Texas during the fourth quarter, outperforming Wall Street expectations according to Elon Musk."
  },
  {
    label: "Louvre Museum & Art",
    text: "The Mona Lisa was painted by Leonardo da Vinci in Florence in 1503 and is currently displayed at the Louvre Museum in Paris."
  }
];

export default function App() {
  // Theme state
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('nlp_theme') as ThemeId;
    return saved && THEMES[saved] ? saved : 'dark';
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[themeId] || THEMES.dark;

  useEffect(() => {
    localStorage.setItem('nlp_theme', themeId);
  }, [themeId]);

  // Close theme picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [input, setInput] = useState(SAMPLE_PRESETS[0].text);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Primary view mode: 'explorer' (Google Cloud NLP) vs 'pipeline' (NER step-by-step visualizer) vs 'ngram' (N-Gram Frequency Analyzer)
  const [viewMode, setViewMode] = useState<'explorer' | 'pipeline' | 'ngram'>('explorer');
  
  // Pipeline step: 0: Raw, 1: Tokenization, 2: POS, 3: Entity Detection, 4: Final Report
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  
  // Filter for entity explorer
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || input;
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentence(text);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial analysis on first load
  useEffect(() => {
    handleAnalyze(SAMPLE_PRESETS[0].text);
  }, []);

  const handlePresetSelect = (presetText: string) => {
    setInput(presetText);
    handleAnalyze(presetText);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsExportingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: currentTheme.isDark ? '#090D16' : '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('nlp-entity-report.pdf');
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleCopyJSON = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  const getSentimentDetails = (score: number) => {
    if (score > 0.2) {
      return { 
        label: 'Positive', 
        color: currentTheme.isDark ? 'text-emerald-400' : 'text-emerald-600', 
        bg: currentTheme.isDark ? 'bg-emerald-950/70' : 'bg-emerald-50', 
        border: currentTheme.isDark ? 'border-emerald-800/80' : 'border-emerald-200', 
        icon: <Smile className={cn("w-5 h-5", currentTheme.isDark ? "text-emerald-400" : "text-emerald-600")} /> 
      };
    }
    if (score < -0.2) {
      return { 
        label: 'Negative', 
        color: currentTheme.isDark ? 'text-rose-400' : 'text-rose-600', 
        bg: currentTheme.isDark ? 'bg-rose-950/70' : 'bg-rose-50', 
        border: currentTheme.isDark ? 'border-rose-800/80' : 'border-rose-200', 
        icon: <Frown className={cn("w-5 h-5", currentTheme.isDark ? "text-rose-400" : "text-rose-600")} /> 
      };
    }
    return { 
      label: 'Neutral', 
      color: currentTheme.isDark ? 'text-slate-400' : 'text-slate-600', 
      bg: currentTheme.isDark ? 'bg-slate-900/70' : 'bg-slate-50', 
      border: currentTheme.isDark ? 'border-slate-700/80' : 'border-slate-200', 
      icon: <Meh className={cn("w-5 h-5", currentTheme.isDark ? "text-slate-400" : "text-slate-600")} /> 
    };
  };

  const renderAnnotatedText = () => {
    if (!result?.cloudNLP?.annotated_text) return null;
    const parts = result.cloudNLP.annotated_text.split(/(<entity.*?>.*?<\/entity>)/g);

    return parts.map((part, index) => {
      const match = part.match(/<entity type="(.*?)" id="(.*?)">(.*?)<\/entity>/);
      if (match) {
        const [, type, id, text] = match;
        const normalizedType = type.toUpperCase();
        const colors = currentTheme.entityColors[normalizedType] || currentTheme.entityColors.OTHER;
        const isMatchedFilter = selectedTypeFilter === 'ALL' || selectedTypeFilter === normalizedType;

        return (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 mx-1 my-1 rounded-lg font-medium text-sm border transition-all duration-200 cursor-pointer shadow-xs",
              colors.bg,
              colors.text,
              colors.border,
              !isMatchedFilter && "opacity-25 grayscale",
              isMatchedFilter && "hover:ring-2 hover:ring-indigo-400 hover:scale-105"
            )}
            title={`${type} • ID: ${id}`}
            onClick={() => setSelectedTypeFilter(selectedTypeFilter === normalizedType ? 'ALL' : normalizedType)}
          >
            {CATEGORY_ICONS[normalizedType] || <Tag className="w-3.5 h-3.5" />}
            <span className="font-semibold">{text}</span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider ml-0.5 px-1 py-0.2 rounded",
              currentTheme.isDark ? "bg-black/40 text-zinc-300" : "bg-white/70 text-zinc-700"
            )}>
              {type}
            </span>
          </span>
        );
      }
      return <span key={index} className={currentTheme.classes.textPrimary}>{part}</span>;
    });
  };

  const filteredEntities = result?.cloudNLP?.entities.filter(entity => {
    if (selectedTypeFilter === 'ALL') return true;
    return entity.type.toUpperCase() === selectedTypeFilter;
  }) || [];

  const uniqueEntityTypes: string[] = Array.from(
    new Set<string>(result?.cloudNLP?.entities.map(e => e.type.toUpperCase()) || [])
  );

  const pipelineSteps = [
    { id: 0, name: 'Raw Input', icon: <Search className="w-4 h-4" /> },
    { id: 1, name: '1. Tokenization', icon: <Layers className="w-4 h-4" /> },
    { id: 2, name: '2. POS Tagging', icon: <Cpu className="w-4 h-4" /> },
    { id: 3, name: '3. NER Classification', icon: <Tag className="w-4 h-4" /> },
    { id: 4, name: '4. Linguistic Report', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("min-h-screen font-sans antialiased transition-colors duration-200", currentTheme.classes.bg, currentTheme.classes.textPrimary)}>
      {/* Top Header Bar */}
      <header className={cn("border-b sticky top-0 z-30 transition-colors", currentTheme.classes.headerBg, currentTheme.classes.border)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md", currentTheme.classes.accentGradient)}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={cn("text-lg font-bold tracking-tight", currentTheme.classes.textPrimary)}>Entity Explorer</h1>
                <span className={cn(
                  "px-2 py-0.5 text-[11px] font-semibold rounded-full border",
                  currentTheme.classes.accentBg,
                  currentTheme.classes.accentText,
                  currentTheme.classes.accentBorder
                )}>
                  Cloud NLP & NER Suite
                </span>
              </div>
              <p className={cn("text-xs font-medium hidden sm:block", currentTheme.classes.textSecondary)}>
                Named Entity Recognition, Salience, Sentiment & N-Gram Collocation Engine
              </p>
            </div>
          </div>

          {/* Action Toolbar & Theme Switcher */}
          <div className="flex items-center gap-2">
            {/* Theme Picker Dropdown */}
            <div className="relative" ref={themePickerRef}>
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
                  currentTheme.classes.card,
                  currentTheme.classes.border,
                  currentTheme.classes.textPrimary,
                  "hover:border-zinc-500"
                )}
                title="Change Theme & Color Palette"
              >
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{currentTheme.name}</span>
                <span className="flex items-center gap-0.5 ml-1">
                  {currentTheme.previewColors.map((color, idx) => (
                    <span 
                      key={idx} 
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </button>

              {/* Theme Menu Drawer */}
              <AnimatePresence>
                {showThemePicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className={cn(
                      "absolute right-0 mt-2 w-72 rounded-2xl border p-3 shadow-2xl z-50 space-y-2 backdrop-blur-xl",
                      currentTheme.isDark ? "bg-[#111827]/98 border-zinc-700" : "bg-white/98 border-zinc-200"
                    )}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-700/50 text-xs font-bold uppercase tracking-wider">
                      <span className={currentTheme.classes.textPrimary}>Select Theme & Palette</span>
                      <span className={cn("text-[10px]", currentTheme.classes.textMuted)}>5 Presets</span>
                    </div>

                    <div className="space-y-1.5">
                      {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                        const t = THEMES[id];
                        const isSelected = themeId === id;
                        return (
                          <button
                            key={id}
                            onClick={() => {
                              setThemeId(id);
                              setShowThemePicker(false);
                            }}
                            className={cn(
                              "w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer",
                              isSelected 
                                ? cn(t.classes.accentBg, t.classes.accentBorder, "ring-2 ring-indigo-500/40")
                                : cn("hover:bg-zinc-800/20 border-transparent", currentTheme.classes.textSecondary)
                            )}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-bold", isSelected ? t.classes.accentText : currentTheme.classes.textPrimary)}>
                                  {t.name}
                                </span>
                                {t.isDark ? (
                                  <Moon className="w-3 h-3 text-indigo-400" />
                                ) : (
                                  <Sun className="w-3 h-3 text-amber-500" />
                                )}
                              </div>
                              <p className={cn("text-[11px] line-clamp-1", currentTheme.classes.textMuted)}>
                                {t.accentName}
                              </p>
                            </div>

                            {/* Color Swatch Dots */}
                            <div className="flex items-center gap-1">
                              {t.previewColors.map((color, idx) => (
                                <span 
                                  key={idx} 
                                  className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* How It Works Guide Button */}
            <button
              onClick={() => setShowHowItWorks(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer",
                currentTheme.classes.card,
                currentTheme.classes.border,
                currentTheme.classes.textPrimary,
                "hover:border-indigo-500 hover:text-indigo-400"
              )}
              title="How NLP Analysis & Entity Explorer Works"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            {/* Quick Dark/Light Switch Button */}
            <button
              onClick={() => setThemeId(currentTheme.isDark ? 'light' : 'dark')}
              className={cn(
                "p-2 rounded-xl border transition-colors cursor-pointer",
                currentTheme.classes.card,
                currentTheme.classes.border,
                currentTheme.classes.textPrimary
              )}
              title={currentTheme.isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {currentTheme.isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {result && (
              <>
                <button
                  onClick={handleCopyJSON}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer",
                    currentTheme.classes.card,
                    currentTheme.classes.border,
                    currentTheme.classes.textPrimary
                  )}
                  title="Copy Raw API JSON"
                >
                  {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{copiedJSON ? "Copied" : "JSON"}</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isExportingPDF}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer",
                    currentTheme.classes.accent
                  )}
                  title="Export analysis to formatted PDF"
                >
                  {isExportingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{isExportingPDF ? "Exporting..." : "Download PDF"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Sample Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className={cn("font-semibold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap pl-1", currentTheme.classes.textMuted)}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Try Samples:
          </span>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset.text)}
              className={cn(
                "px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border shadow-2xs cursor-pointer",
                currentTheme.classes.card,
                currentTheme.classes.border,
                currentTheme.classes.textSecondary,
                "hover:border-indigo-500 hover:text-indigo-400"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className={cn("rounded-2xl border shadow-sm overflow-hidden transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
          <div className={cn("p-4 border-b flex items-center justify-between transition-colors", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
            <div className={cn("flex items-center gap-2 font-semibold text-sm", currentTheme.classes.textPrimary)}>
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Source Text for Analysis</span>
            </div>
            <div className={cn("flex items-center gap-3 text-xs font-mono", currentTheme.classes.textMuted)}>
              <span>{input.length} characters</span>
              <span>•</span>
              <span>{input.trim() ? input.trim().split(/\s+/).length : 0} words</span>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter or paste text here to extract entities, analyze sentiment, and inspect the NLP processing pipeline..."
              rows={3}
              className={cn(
                "w-full resize-y min-h-[90px] p-3 rounded-xl transition-all text-base leading-relaxed border",
                currentTheme.classes.inputBg,
                currentTheme.classes.borderFocus
              )}
            />
          </div>

          <div className={cn("px-4 py-3 border-t flex items-center justify-between flex-wrap gap-3 transition-colors", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
            <div className={cn("text-xs flex items-center gap-1.5", currentTheme.classes.textSecondary)}>
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Generates Entity Salience, Sentiment, Annotated Text Spans, and NER Pipeline breakdown.</span>
            </div>
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !input.trim()}
              className={cn(
                "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer",
                loading ? "opacity-50 cursor-not-allowed" : currentTheme.classes.accent
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing NLP Pipeline...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Run NLP Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-2xl flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <h4 className="font-semibold text-sm text-rose-200">Analysis Error</h4>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Primary View Mode Tabs */}
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3", currentTheme.classes.border)}>
          <div className={cn(
            "inline-flex p-1 rounded-xl flex-wrap gap-1 border",
            currentTheme.isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-zinc-200/70 border-zinc-300"
          )}>
            <button
              onClick={() => setViewMode('explorer')}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer",
                viewMode === 'explorer' 
                  ? currentTheme.classes.tabActive 
                  : currentTheme.classes.tabInactive
              )}
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Entity Explorer (Cloud NLP)</span>
              {result && (
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full",
                  currentTheme.classes.accentBg,
                  currentTheme.classes.accentText
                )}>
                  {result.cloudNLP.entities.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('pipeline')}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer",
                viewMode === 'pipeline' 
                  ? currentTheme.classes.tabActive 
                  : currentTheme.classes.tabInactive
              )}
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>NER Step-by-Step Pipeline</span>
              <span className={cn(
                "ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full",
                currentTheme.classes.accentBg,
                currentTheme.classes.accentText
              )}>
                4 Steps
              </span>
            </button>

            <button
              onClick={() => setViewMode('ngram')}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer",
                viewMode === 'ngram' 
                  ? currentTheme.classes.tabActive 
                  : currentTheme.classes.tabInactive
              )}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>N-Gram Analyzer</span>
              <span className="ml-1 px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 text-[11px] font-bold rounded-full border border-emerald-700/60">
                Live
              </span>
            </button>
          </div>

          {result && (
            <div className={cn("text-xs font-medium flex items-center gap-2", currentTheme.classes.textSecondary)}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Extracted {result.cloudNLP.entities.length} entities • {result.nerPipeline.tokens.length} tokens</span>
            </div>
          )}
        </div>

        {/* VIEW 3: N-GRAM ANALYZER */}
        {viewMode === 'ngram' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NGramAnalyzer 
              initialText={input} 
              theme={currentTheme}
              onApplyToMainText={(txt) => {
                setInput(txt);
                setViewMode('explorer');
                handleAnalyze(txt);
              }}
            />
          </motion.div>
        )}

        {/* View Mode content for Explorer & Pipeline (when result is present) */}
        {result && viewMode !== 'ngram' && (
          <div className="space-y-6">

            {/* VIEW 1: GOOGLE CLOUD NLP ENTITY EXPLORER */}
            {viewMode === 'explorer' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                ref={reportRef}
                className="space-y-6"
              >
                {/* Annotated Highlight Section */}
                <section className={cn("rounded-2xl border shadow-sm overflow-hidden transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
                  <div className={cn("p-4 border-b flex flex-wrap items-center justify-between gap-3 transition-colors", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
                    <div className={cn("flex items-center gap-2 font-semibold text-sm", currentTheme.classes.textPrimary)}>
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>Entities & Text Highlights</span>
                    </div>
                    
                    {/* Entity Type Filter Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setSelectedTypeFilter('ALL')}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border",
                          selectedTypeFilter === 'ALL'
                            ? currentTheme.classes.accent
                            : cn(
                                currentTheme.isDark 
                                  ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700" 
                                  : "bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200"
                              )
                        )}
                      >
                        All ({result.cloudNLP.entities.length})
                      </button>
                      {uniqueEntityTypes.map(type => {
                        const count = result.cloudNLP.entities.filter(e => e.type.toUpperCase() === type).length;
                        const colors = currentTheme.entityColors[type] || currentTheme.entityColors.OTHER;
                        const isSelected = selectedTypeFilter === type;
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedTypeFilter(isSelected ? 'ALL' : type)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer",
                              isSelected 
                                ? cn(colors.bg, colors.text, colors.border, "ring-2 ring-indigo-500/50 shadow-xs") 
                                : cn(
                                    currentTheme.isDark 
                                      ? "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700" 
                                      : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                                  )
                            )}
                          >
                            {CATEGORY_ICONS[type] || <Tag className="w-3 h-3" />}
                            <span>{type}</span>
                            <span className="text-[10px] opacity-75 font-mono">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className={cn("p-6 sm:p-8 text-lg sm:text-xl leading-loose", currentTheme.classes.card)}>
                    {renderAnnotatedText()}
                  </div>
                </section>

                {/* Sentiment & Salience Overview Metric Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Overall Document Sentiment */}
                  <div className={cn("p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", getSentimentDetails(result.cloudNLP.overall_sentiment.score).bg, getSentimentDetails(result.cloudNLP.overall_sentiment.score).border)}>
                      {getSentimentDetails(result.cloudNLP.overall_sentiment.score).icon}
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-xs font-bold uppercase tracking-wider", currentTheme.classes.textMuted)}>Overall Sentiment</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <p className={cn("text-xl font-bold", getSentimentDetails(result.cloudNLP.overall_sentiment.score).color)}>
                          {getSentimentDetails(result.cloudNLP.overall_sentiment.score).label}
                        </p>
                        <span className={cn("text-xs font-mono", currentTheme.classes.textMuted)}>
                          ({result.cloudNLP.overall_sentiment.score > 0 ? `+${result.cloudNLP.overall_sentiment.score.toFixed(2)}` : result.cloudNLP.overall_sentiment.score.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Magnitude / Strength */}
                  <div className={cn("p-5 rounded-2xl border shadow-sm flex items-center gap-4 transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", currentTheme.classes.accentBg, currentTheme.classes.accentText, currentTheme.classes.accentBorder)}>
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-xs font-bold uppercase tracking-wider", currentTheme.classes.textMuted)}>Sentiment Magnitude</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <p className={cn("text-xl font-bold", currentTheme.classes.accentText)}>
                          {(result.cloudNLP.overall_sentiment.magnitude * 100).toFixed(0)}%
                        </p>
                        <span className={cn("text-xs font-medium", currentTheme.classes.textMuted)}>Intensity</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Entities Found */}
                  <div className={cn("p-5 rounded-2xl border shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1 transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", currentTheme.classes.accentBg, currentTheme.classes.accentText, currentTheme.classes.accentBorder)}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-xs font-bold uppercase tracking-wider", currentTheme.classes.textMuted)}>Identified Entities</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <p className={cn("text-xl font-bold", currentTheme.classes.textPrimary)}>
                          {result.cloudNLP.entities.length} Entities
                        </p>
                        <span className={cn("text-xs", currentTheme.classes.textMuted)}>across {uniqueEntityTypes.length} types</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Entity Details Grid */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-base font-bold flex items-center gap-2", currentTheme.classes.textPrimary)}>
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>Entity Breakdown & Salience Scores</span>
                    </h3>
                    <span className={cn("text-xs font-medium", currentTheme.classes.textMuted)}>
                      Showing {filteredEntities.length} of {result.cloudNLP.entities.length} entities
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntities.map((entity: CloudNLPEntity) => {
                      const normalizedType = entity.type.toUpperCase();
                      const colors = currentTheme.entityColors[normalizedType] || currentTheme.entityColors.OTHER;
                      const entitySentiment = getSentimentDetails(entity.sentiment.score);
                      const saliencePercent = Math.min(100, Math.max(0, Math.round(entity.salience * 100)));

                      return (
                        <motion.div
                          key={entity.id}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between",
                            currentTheme.classes.card,
                            currentTheme.classes.border
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span 
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                  colors.bg,
                                  colors.text,
                                  colors.border
                                )}
                              >
                                {CATEGORY_ICONS[normalizedType] || <Tag className="w-3 h-3" />}
                                {entity.type}
                              </span>

                              {entity.metadata?.wikipedia_url && (
                                <a
                                  href={entity.metadata.wikipedia_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cn("p-1 transition-colors", currentTheme.classes.textMuted, "hover:text-blue-400")}
                                  title="Open Wikipedia page"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            <div>
                              <h4 className={cn("text-lg font-bold leading-tight", currentTheme.classes.textPrimary)}>
                                {entity.text}
                              </h4>
                            </div>
                          </div>

                          <div className={cn("mt-4 pt-4 border-t space-y-3", currentTheme.classes.border)}>
                            {/* Salience Progress */}
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={cn("font-medium", currentTheme.classes.textSecondary)}>Salience (Importance)</span>
                                <span className={cn("font-mono font-bold", currentTheme.classes.textPrimary)}>{saliencePercent}%</span>
                              </div>
                              <div className={cn("w-full h-2 rounded-full overflow-hidden", currentTheme.isDark ? "bg-zinc-800" : "bg-zinc-100")}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${saliencePercent}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={cn("h-full rounded-full", currentTheme.isDark ? "bg-indigo-500" : "bg-blue-600")}
                                />
                              </div>
                            </div>

                            {/* Entity Sentiment */}
                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className={cn("font-medium", currentTheme.classes.textSecondary)}>Sentiment</span>
                              <div className="flex items-center gap-1.5">
                                <span className={cn("font-bold", entitySentiment.color)}>
                                  {entitySentiment.label}
                                </span>
                                <span className={cn("font-mono", currentTheme.classes.textMuted)}>
                                  ({entity.sentiment.score > 0 ? `+${entity.sentiment.score.toFixed(2)}` : entity.sentiment.score.toFixed(2)})
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {/* VIEW 2: NER STEP-BY-STEP PIPELINE VISUALIZER */}
            {viewMode === 'pipeline' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Pipeline Step Navigator */}
                <nav className={cn("flex items-center justify-between p-2 rounded-2xl border shadow-sm overflow-x-auto gap-1", currentTheme.classes.card, currentTheme.classes.border)}>
                  {pipelineSteps.map((step, idx) => (
                    <button
                      key={step.id}
                      onClick={() => setActivePipelineStep(step.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
                        activePipelineStep === step.id 
                          ? cn(currentTheme.classes.accentBg, currentTheme.classes.accentText, "border", currentTheme.classes.accentBorder, "shadow-xs") 
                          : cn(currentTheme.classes.textSecondary, "hover:bg-zinc-800/20")
                      )}
                    >
                      {step.icon}
                      <span>{step.name}</span>
                      {idx < pipelineSteps.length - 1 && (
                        <ChevronRight className={cn("w-4 h-4 ml-1 hidden md:block", currentTheme.classes.textMuted)} />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Pipeline Step Content Area */}
                <div className={cn("rounded-2xl border shadow-sm min-h-[420px] overflow-hidden", currentTheme.classes.card, currentTheme.classes.border)}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePipelineStep}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 sm:p-8"
                    >
                      {/* Step 0: Raw Input Overview */}
                      {activePipelineStep === 0 && (
                        <div className="space-y-6">
                          <div className={cn("flex items-center gap-2", currentTheme.classes.accentText)}>
                            <Search className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Raw Input Text</h2>
                          </div>
                          <p className={cn(
                            "text-xl sm:text-2xl font-medium leading-relaxed italic border-l-4 pl-6 py-2 rounded-r-xl",
                            currentTheme.classes.textPrimary,
                            currentTheme.classes.accentBg,
                            currentTheme.isDark ? "border-indigo-500" : "border-indigo-400"
                          )}>
                            "{input}"
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            <div className={cn("p-4 rounded-xl border", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
                              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", currentTheme.classes.textMuted)}>Characters</h4>
                              <p className={cn("text-2xl font-mono font-bold", currentTheme.classes.textPrimary)}>{input.length}</p>
                            </div>
                            <div className={cn("p-4 rounded-xl border", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
                              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", currentTheme.classes.textMuted)}>Estimated Tokens</h4>
                              <p className="text-2xl font-mono font-bold text-indigo-400">{result.nerPipeline.tokens.length}</p>
                            </div>
                            <div className={cn("p-4 rounded-xl border", currentTheme.classes.cardSubtle, currentTheme.classes.border)}>
                              <h4 className={cn("text-xs font-bold uppercase tracking-widest mb-1", currentTheme.classes.textMuted)}>Named Entities</h4>
                              <p className="text-2xl font-mono font-bold text-emerald-400">{result.nerPipeline.entities.length}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 1: Tokenization */}
                      {activePipelineStep === 1 && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className={cn("flex items-center gap-2", currentTheme.classes.accentText)}>
                              <Layers className="w-5 h-5" />
                              <h2 className="text-xl font-bold">Step 1: Tokenization</h2>
                            </div>
                            <span className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-full border",
                              currentTheme.classes.accentBg,
                              currentTheme.classes.accentText,
                              currentTheme.classes.accentBorder
                            )}>
                              {result.nerPipeline.tokens.length} Discrete Tokens
                            </span>
                          </div>
                          <p className={cn("text-sm", currentTheme.classes.textSecondary)}>
                            The NLP tokenizer decomposes continuous text into distinct linguistic tokens, preserving punctuation boundaries and isolating meaningful semantic units.
                          </p>
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {result.nerPipeline.tokens.map((token, i) => (
                              <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.025 }}
                                key={i}
                                className={cn(
                                  "group relative px-3.5 py-2.5 rounded-xl font-mono text-base border-2 shadow-2xs hover:shadow-md transition-all cursor-default",
                                  currentTheme.isDark 
                                    ? "bg-zinc-900/90 border-zinc-800 hover:border-indigo-500" 
                                    : "bg-white border-zinc-200 hover:border-indigo-400"
                                )}
                              >
                                <span className={cn("font-semibold", currentTheme.classes.textPrimary)}>{token.text}</span>
                                <span className={cn(
                                  "absolute -top-2.5 -right-2 px-1.5 py-0.2 text-[9px] font-mono rounded-full opacity-70 group-hover:opacity-100",
                                  currentTheme.isDark ? "bg-zinc-700 text-zinc-100" : "bg-zinc-800 text-white"
                                )}>
                                  #{i}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Part-of-Speech Tagging */}
                      {activePipelineStep === 2 && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className={cn("flex items-center gap-2", currentTheme.classes.accentText)}>
                              <Cpu className="w-5 h-5" />
                              <h2 className="text-xl font-bold">Step 2: Part-of-Speech (POS) Tagging</h2>
                            </div>
                            <span className={cn("text-xs font-medium", currentTheme.classes.textMuted)}>
                              Proper Nouns (PROPN) serve as primary entity candidate anchors
                            </span>
                          </div>
                          <p className={cn("text-sm", currentTheme.classes.textSecondary)}>
                            Grammatical roles assigned to each token help the entity classification engine identify noun phrases, proper names, and syntactic boundaries.
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-7 pt-4">
                            {result.nerPipeline.tokens.map((token, i) => {
                              const isPropN = token.pos === 'PROPN';
                              return (
                                <div key={i} className="relative group">
                                  <div className="absolute -top-5.5 left-0 right-0 text-center">
                                    <span className={cn(
                                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-2xs",
                                      isPropN 
                                        ? "bg-rose-950/80 text-rose-300 border border-rose-800 font-black" 
                                        : cn(currentTheme.classes.accentBg, currentTheme.classes.accentText, "border", currentTheme.classes.accentBorder)
                                    )}>
                                      {token.pos}
                                    </span>
                                  </div>
                                  <div className={cn(
                                    "px-3 py-2 rounded-lg font-mono text-sm border shadow-2xs",
                                    isPropN 
                                      ? "bg-rose-950/30 border-rose-800 text-rose-200 font-semibold" 
                                      : cn(currentTheme.classes.cardSubtle, currentTheme.classes.border, currentTheme.classes.textPrimary)
                                  )}>
                                    {token.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Entity Detection & Classification */}
                      {activePipelineStep === 3 && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className={cn("flex items-center gap-2", currentTheme.classes.accentText)}>
                              <Tag className="w-5 h-5" />
                              <h2 className="text-xl font-bold">Step 3: Entity Detection & Classification</h2>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-950/70 text-emerald-300 rounded-full border border-emerald-800">
                              {result.nerPipeline.entities.length} Spans Detected
                            </span>
                          </div>

                          {/* Visual Highlighted Sentence */}
                          <div className={cn("p-6 rounded-2xl shadow-inner border", currentTheme.classes.codeBg)}>
                            <div className="flex flex-wrap gap-x-2 gap-y-4 items-baseline">
                              {result.nerPipeline.tokens.map((token, i) => {
                                const entity = result.nerPipeline.entities.find(e => i >= e.startIndex && i <= e.endIndex);
                                const isEntityStart = entity && i === entity.startIndex;
                                const isEntityEnd = entity && i === entity.endIndex;
                                const isInsideEntity = entity && i >= entity.startIndex && i <= entity.endIndex;

                                if (isInsideEntity) {
                                  const normalizedCat = entity.category.toUpperCase();
                                  const colors = currentTheme.entityColors[normalizedCat] || currentTheme.entityColors.OTHER;

                                  return (
                                    <span 
                                      key={i} 
                                      className={cn(
                                        "px-1.5 py-0.5 font-medium text-base sm:text-lg border",
                                        colors.bg,
                                        colors.text,
                                        colors.border,
                                        isEntityStart && "rounded-l-md pl-2.5",
                                        isEntityEnd && "rounded-r-md pr-2.5",
                                        !isEntityStart && !isEntityEnd && "border-x-0"
                                      )}
                                    >
                                      {token.text}
                                      {isEntityEnd && (
                                        <span className={cn(
                                          "ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1 py-0.2 rounded shadow-2xs",
                                          currentTheme.isDark ? "bg-black/50 text-zinc-200" : "bg-white/80 text-zinc-700"
                                        )}>
                                          {CATEGORY_ICONS[normalizedCat] || <Tag className="w-3 h-3" />}
                                          {entity.category}
                                        </span>
                                      )}
                                    </span>
                                  );
                                }

                                return (
                                  <span key={i} className="text-zinc-300 text-base sm:text-lg font-mono">
                                    {token.text}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detailed Entity Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.nerPipeline.entities.map((entity, i) => {
                              const normalizedCat = entity.category.toUpperCase();
                              const colors = currentTheme.entityColors[normalizedCat] || currentTheme.entityColors.OTHER;

                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  className={cn("p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-3", currentTheme.classes.card, currentTheme.classes.border)}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", colors.bg, colors.text, colors.border)}>
                                        {CATEGORY_ICONS[normalizedCat] || <Tag className="w-3 h-3" />}
                                        {entity.category}
                                      </span>
                                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {entity.confidence}% Confidence
                                      </div>
                                    </div>
                                    <h4 className={cn("text-lg font-bold mt-1", currentTheme.classes.textPrimary)}>{entity.text}</h4>
                                    {entity.explanation && (
                                      <p className={cn("text-xs mt-1.5 leading-relaxed", currentTheme.classes.textSecondary)}>
                                        {entity.explanation}
                                      </p>
                                    )}
                                  </div>

                                  <div className={cn("w-full h-1.5 rounded-full overflow-hidden mt-2", currentTheme.isDark ? "bg-zinc-800" : "bg-zinc-100")}>
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${entity.confidence}%` }}
                                      transition={{ duration: 0.5 }}
                                      className="h-full bg-emerald-500 rounded-full"
                                    />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Step 4: Linguistic Final Report */}
                      {activePipelineStep === 4 && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className={cn("flex items-center gap-2", currentTheme.classes.accentText)}>
                              <FileText className="w-5 h-5" />
                              <h2 className="text-xl font-bold">Step 4: Comprehensive Linguistic Final Report</h2>
                            </div>
                          </div>
                          <div className={cn("markdown-body p-6 sm:p-8 rounded-2xl border leading-relaxed", currentTheme.classes.cardSubtle, currentTheme.classes.border, currentTheme.classes.textPrimary)}>
                            <Markdown>{result.nerPipeline.markdownReport}</Markdown>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Empty State / Feature Overview when no results yet and not in ngram view */}
        {!result && !loading && viewMode !== 'ngram' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className={cn("p-6 rounded-2xl border shadow-sm space-y-3 transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", currentTheme.classes.accentBg, currentTheme.classes.accentText, currentTheme.classes.accentBorder)}>
                <Search className="w-5 h-5" />
              </div>
              <h3 className={cn("font-bold", currentTheme.classes.textPrimary)}>Google Cloud NLP Explorer</h3>
              <p className={cn("text-sm leading-relaxed", currentTheme.classes.textSecondary)}>
                Extract named entities with Salience scores (centrality in context), entity sentiments, document emotion, and annotated visual highlights.
              </p>
            </div>

            <div className={cn("p-6 rounded-2xl border shadow-sm space-y-3 transition-colors", currentTheme.classes.card, currentTheme.classes.border)}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", currentTheme.classes.accentBg, currentTheme.classes.accentText, currentTheme.classes.accentBorder)}>
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className={cn("font-bold", currentTheme.classes.textPrimary)}>4-Stage NER Pipeline</h3>
              <p className={cn("text-sm leading-relaxed", currentTheme.classes.textSecondary)}>
                Walk step-by-step through Tokenization, Part-of-Speech tagging, Span Detection, and Confidence Scoring to see how NLP models reason.
              </p>
            </div>

            <div 
              onClick={() => setViewMode('ngram')}
              className={cn(
                "p-6 rounded-2xl border shadow-sm space-y-3 transition-all cursor-pointer group hover:scale-[1.01]",
                currentTheme.classes.card,
                currentTheme.classes.border
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform",
                currentTheme.classes.accentBg,
                currentTheme.classes.accentText,
                currentTheme.classes.accentBorder
              )}>
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className={cn("font-bold transition-colors", currentTheme.classes.textPrimary)}>N-Gram Frequency Analyzer</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-800">
                  Instant
                </span>
              </div>
              <p className={cn("text-sm leading-relaxed", currentTheme.classes.textSecondary)}>
                Compute Unigrams, Bigrams, Trigrams, and keyword collocations with live frequency rankings, filters, and CSV/TSV data export.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={cn("max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t mt-12 text-xs flex flex-col items-center gap-4", currentTheme.classes.border, currentTheme.classes.textMuted)}>
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className={cn("font-semibold", currentTheme.classes.textPrimary)}>Entity Explorer & NLP Visualizer</span>
          <span>• Powered by Gemini</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowHowItWorks(true)}
            className={cn("hover:underline cursor-pointer flex items-center gap-1", currentTheme.classes.accentText)}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it Works</span>
          </button>
          <button 
            onClick={() => handlePresetSelect(SAMPLE_PRESETS[0].text)}
            className={cn("hover:underline cursor-pointer", currentTheme.classes.textSecondary)}
          >
            Reset to Default
          </button>
          <a 
            href="https://cloud.google.com/natural-language/docs/basics" 
            target="_blank" 
            rel="noreferrer" 
            className={cn("hover:underline", currentTheme.classes.accentText)}
          >
            Google Cloud NLP Documentation
          </a>
        </div>
        <p className="w-full text-center pt-4 border-t border-current/10">
          © 2026 Natural Language Inspector. Developed by Ami - SEO Girl. All rights reserved.
        </p>
      </footer>
      {/* How It Works Educational Guide Modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        theme={currentTheme}
      />
    </div>
  );
}
