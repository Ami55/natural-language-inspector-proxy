import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  HelpCircle, 
  Search, 
  Tag, 
  Layers, 
  Cpu, 
  Smile, 
  BarChart3, 
  FileSpreadsheet, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeConfig } from '../theme';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, theme }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'entities' | 'sentiment' | 'ngrams'>('architecture');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
          className={cn(
            "relative w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col z-10",
            theme.classes.card,
            theme.classes.border
          )}
        >
          {/* Header */}
          <div className={cn(
            "p-5 sm:px-6 border-b flex items-center justify-between gap-4",
            theme.classes.cardSubtle,
            theme.classes.border
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border font-bold",
                theme.classes.accentBg,
                theme.classes.accentText,
                theme.classes.accentBorder
              )}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className={cn("text-base sm:text-lg font-bold tracking-tight", theme.classes.textPrimary)}>
                  How Entity Explorer & NLP Suite Works
                </h2>
                <p className={cn("text-xs", theme.classes.textSecondary)}>
                  Understanding the Cloud NLP pipeline, Named Entity Recognition, Sentiment math, and N-Grams.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-xl border transition-colors cursor-pointer",
                theme.isDark ? "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-zinc-700" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className={cn(
            "flex items-center gap-2 px-6 pt-3 border-b overflow-x-auto no-scrollbar",
            theme.classes.cardSubtle,
            theme.classes.border
          )}>
            {[
              { id: 'architecture', label: '1. Processing Engine', icon: <Cpu className="w-4 h-4" /> },
              { id: 'entities', label: '2. Entity & Salience', icon: <Tag className="w-4 h-4" /> },
              { id: 'sentiment', label: '3. Sentiment & Magnitude', icon: <Smile className="w-4 h-4" /> },
              { id: 'ngrams', label: '4. N-Gram Collocations', icon: <Layers className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer",
                  activeTab === tab.id
                    ? cn(theme.classes.accentText, theme.isDark ? "border-indigo-400" : "border-indigo-600")
                    : cn("border-transparent", theme.classes.textSecondary, "hover:text-zinc-300")
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm leading-relaxed">
            {/* Tab 1: Architecture & Pipeline */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div>
                  <h3 className={cn("text-base font-bold mb-2 flex items-center gap-2", theme.classes.textPrimary)}>
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Dual NLP Engine Architecture</span>
                  </h3>
                  <p className={theme.classes.textSecondary}>
                    Entity Explorer combines Google Cloud Natural Language API modeling with a transparent 5-stage NER pipeline to give you both high-level semantic insights and low-level computational transparency.
                  </p>
                </div>

                {/* 4-Step Visual Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400">
                      <span>STEP 01</span>
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Tokenization</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Splits continuous prose into discrete linguistic tokens while preserving punctuation boundaries and currency symbols.
                    </p>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                      <span>STEP 02</span>
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>POS Tagging</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Identifies grammatical roles (Proper Nouns, Verbs, Adpositions, Determiners) to establish syntactic context.
                    </p>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                      <span>STEP 03</span>
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>NER Extraction</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Detects multi-token spans and classifies them into PERSON, ORG, LOCATION, PRICE, DATE, and CONSUMER_GOOD.
                    </p>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-400">
                      <span>STEP 04</span>
                      <BarChart3 className="w-3.5 h-3.5" />
                    </div>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Salience & Sentiment</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Evaluates the centrality of each entity in the text along with polarity scores from -1.0 to +1.0.
                    </p>
                  </div>
                </div>

                <div className={cn("p-4 rounded-xl border flex items-start gap-3", theme.classes.cardSubtle, theme.classes.border)}>
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className={cn("font-bold", theme.classes.textPrimary)}>Server-Side Security & Reliability</span>
                    <p className={theme.classes.textSecondary}>
                      All inference is processed securely server-side with structured JSON schemas and fallback parsing, ensuring zero API key exposure to client browsers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Entities & Salience */}
            {activeTab === 'entities' && (
              <div className="space-y-6">
                <div>
                  <h3 className={cn("text-base font-bold mb-2 flex items-center gap-2", theme.classes.textPrimary)}>
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span>Named Entity Recognition & Salience Scoring</span>
                  </h3>
                  <p className={theme.classes.textSecondary}>
                    Named Entity Recognition (NER) is an information extraction technique that locates and classifies named entities mentioned in unstructured text into predefined categories.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cn("p-4 rounded-xl border space-y-2", theme.classes.cardSubtle, theme.classes.border)}>
                    <h4 className={cn("text-xs font-bold uppercase tracking-wider text-emerald-400", theme.classes.textPrimary)}>
                      Standard Google Cloud NLP Categories
                    </h4>
                    <ul className={cn("text-xs space-y-1.5 list-disc pl-4", theme.classes.textSecondary)}>
                      <li><strong className={theme.classes.textPrimary}>PERSON</strong>: Proper names of individuals (e.g. <em>Sundar Pichai</em>, <em>Elon Musk</em>).</li>
                      <li><strong className={theme.classes.textPrimary}>ORGANIZATION</strong>: Companies, institutions, non-profits (e.g. <em>Google</em>, <em>Stanford University</em>).</li>
                      <li><strong className={theme.classes.textPrimary}>LOCATION / GPE</strong>: Geo-political entities, cities, landmarks (e.g. <em>Cupertino</em>, <em>Austin, Texas</em>).</li>
                      <li><strong className={theme.classes.textPrimary}>CONSUMER_GOOD</strong>: Physical consumer products (e.g. <em>Pixel 8</em>, <em>iPhone 16</em>).</li>
                      <li><strong className={theme.classes.textPrimary}>PRICE / NUMBER</strong>: Monetary amounts and numerical expressions (e.g. <em>$799</em>).</li>
                      <li><strong className={theme.classes.textPrimary}>WORK_OF_ART</strong>: Titles of books, paintings, songs (e.g. <em>Mona Lisa</em>).</li>
                    </ul>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-2", theme.classes.cardSubtle, theme.classes.border)}>
                    <h4 className={cn("text-xs font-bold uppercase tracking-wider text-blue-400", theme.classes.textPrimary)}>
                      What is Entity Salience?
                    </h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      <strong>Salience</strong> ranges from <strong>0.0 (low importance)</strong> to <strong>1.0 (central subject)</strong>. It measures how essential an entity is to the overall meaning of the text.
                    </p>
                    <div className={cn("p-3 rounded-lg text-xs font-mono border space-y-1", theme.isDark ? "bg-black/40 border-zinc-800" : "bg-white border-zinc-200")}>
                      <p className="text-emerald-400 font-bold">Google (0.65 Salience) → Primary subject</p>
                      <p className="text-zinc-400">Mountain View (0.22 Salience) → Secondary location</p>
                    </div>
                  </div>
                </div>

                <div className={cn("p-4 rounded-xl border flex items-center justify-between text-xs", theme.classes.cardSubtle, theme.classes.border)}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className={theme.classes.textPrimary}>Knowledge Graph Linking</span>
                  </div>
                  <span className={theme.classes.textSecondary}>Entities link to Wikipedia automatically when available.</span>
                </div>
              </div>
            )}

            {/* Tab 3: Sentiment Analysis */}
            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <div>
                  <h3 className={cn("text-base font-bold mb-2 flex items-center gap-2", theme.classes.textPrimary)}>
                    <Smile className="w-4 h-4 text-emerald-500" />
                    <span>Sentiment Score vs. Sentiment Magnitude</span>
                  </h3>
                  <p className={theme.classes.textSecondary}>
                    Following the Google Cloud NLP specification, sentiment is measured with two distinct dimensions: <strong>Score</strong> (polarity) and <strong>Magnitude</strong> (emotional intensity).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={cn("p-4 rounded-xl border space-y-2", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between">
                      <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Sentiment Score</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">-1.0 to +1.0</span>
                    </div>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Represents the overall emotional leaning or direction of the text:
                    </p>
                    <ul className={cn("text-xs space-y-1 pl-4 list-disc", theme.classes.textSecondary)}>
                      <li><strong className="text-emerald-400">Positive (+0.2 to +1.0)</strong>: Words conveying praise, satisfaction, enthusiasm.</li>
                      <li><strong className="text-slate-400">Neutral (-0.2 to +0.2)</strong>: Objective statements, factual news, balanced remarks.</li>
                      <li><strong className="text-rose-400">Negative (-1.0 to -0.2)</strong>: Complaints, delays, dissatisfaction, criticism.</li>
                    </ul>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-2", theme.classes.cardSubtle, theme.classes.border)}>
                    <div className="flex items-center justify-between">
                      <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Sentiment Magnitude</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">0.0 to 1.0 (or +∞)</span>
                    </div>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Measures the absolute volume or strength of emotional content regardless of whether it is positive or negative.
                    </p>
                    <p className={cn("text-xs italic pt-1", theme.classes.textMuted)}>
                      Example: A mixed review with extreme praise AND extreme criticism may have a neutral score (~0.0) but a very high magnitude (0.85+).
                    </p>
                  </div>
                </div>

                <div className={cn("p-4 rounded-xl border space-y-2", theme.classes.cardSubtle, theme.classes.border)}>
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider text-purple-400", theme.classes.textPrimary)}>
                    Entity-Level Sentiment
                  </h4>
                  <p className={cn("text-xs", theme.classes.textSecondary)}>
                    Beyond document-level polarity, the engine computes how each individual entity is framed within its sentence. This lets you isolate which products, individuals, or features are receiving praise versus criticism.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 4: N-Grams */}
            {activeTab === 'ngrams' && (
              <div className="space-y-6">
                <div>
                  <h3 className={cn("text-base font-bold mb-2 flex items-center gap-2", theme.classes.textPrimary)}>
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>N-Gram Frequency & Keyword Collocations</span>
                  </h3>
                  <p className={theme.classes.textSecondary}>
                    An <strong>N-Gram</strong> is a contiguous sequence of <em>n</em> items from a given sample of text or speech.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <span className="text-xs font-mono font-bold text-indigo-400">N = 1</span>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Unigrams (1-Word)</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Individual word frequency counts (e.g. <em>"laptop"</em>, <em>"battery"</em>, <em>"delivery"</em>).
                    </p>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <span className="text-xs font-mono font-bold text-emerald-400">N = 2</span>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Bigrams (2-Words)</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Pairs of consecutive words capturing collocations (e.g. <em>"customer service"</em>, <em>"battery life"</em>).
                    </p>
                  </div>

                  <div className={cn("p-4 rounded-xl border space-y-1.5", theme.classes.cardSubtle, theme.classes.border)}>
                    <span className="text-xs font-mono font-bold text-purple-400">N = 3</span>
                    <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Trigrams (3-Words)</h4>
                    <p className={cn("text-xs", theme.classes.textSecondary)}>
                      Three-word sequences identifying recurring phrases (e.g. <em>"natural language processing"</em>).
                    </p>
                  </div>
                </div>

                <div className={cn("p-4 rounded-xl border space-y-2 text-xs", theme.classes.cardSubtle, theme.classes.border)}>
                  <h4 className={cn("font-bold text-sm", theme.classes.textPrimary)}>Advanced Filtering & Export</h4>
                  <p className={theme.classes.textSecondary}>
                    Includes customizable text normalization: <strong>Stopword removal</strong> (filters out grammatical glue words like <em>"the"</em>, <em>"is"</em>, <em>"at"</em>), <strong>punctuation stripping</strong>, <strong>case normalization</strong>, <strong>Lexical Type-Token Ratio (TTR)</strong>, and 1-click <strong>CSV/TSV</strong> spreadsheet export.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={cn(
            "p-4 sm:px-6 border-t flex items-center justify-between",
            theme.classes.cardSubtle,
            theme.classes.border
          )}>
            <span className={cn("text-xs", theme.classes.textMuted)}>
              Google Cloud Natural Language & NER Suite
            </span>
            <button
              onClick={onClose}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-xs",
                theme.classes.accent
              )}
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
