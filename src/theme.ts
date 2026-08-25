export type ThemeId = 'dark' | 'light' | 'nordic' | 'emerald' | 'editorial';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
  description: string;
  accentName: string;
  previewColors: [string, string, string]; // 3 representative hex/color codes for preview swatch
  classes: {
    bg: string;
    bgSubtle: string;
    card: string;
    cardSubtle: string;
    cardHover: string;
    headerBg: string;
    border: string;
    borderSubtle: string;
    borderFocus: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentBg: string;
    accentText: string;
    accentBorder: string;
    accentHover: string;
    accentGradient: string;
    inputBg: string;
    tabActive: string;
    tabInactive: string;
    codeBg: string;
  };
  entityColors: Record<string, { bg: string; text: string; border: string; highlightBg: string; darkHighlightBg: string }>;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Obsidian Studio',
    isDark: true,
    description: 'Deep obsidian dark canvas with high-contrast glowing entity badges and sleek borders',
    accentName: 'Electric Indigo',
    previewColors: ['#090d16', '#6366f1', '#38bdf8'],
    classes: {
      bg: 'bg-[#090D16]',
      bgSubtle: 'bg-[#0F172A]',
      card: 'bg-[#111827]/90 backdrop-blur-md',
      cardSubtle: 'bg-[#1E293B]/70',
      cardHover: 'hover:bg-[#1E293B]',
      headerBg: 'bg-[#090D16]/90 backdrop-blur-md',
      border: 'border-zinc-800',
      borderSubtle: 'border-zinc-800/60',
      borderFocus: 'focus:border-indigo-500 focus:ring-indigo-500/30',
      textPrimary: 'text-zinc-100',
      textSecondary: 'text-zinc-400',
      textMuted: 'text-zinc-500',
      accent: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20',
      accentBg: 'bg-indigo-950/60',
      accentText: 'text-indigo-400',
      accentBorder: 'border-indigo-800/80',
      accentHover: 'hover:bg-indigo-900/60',
      accentGradient: 'bg-linear-to-tr from-indigo-600 via-blue-600 to-cyan-500',
      inputBg: 'bg-[#0B1120] text-zinc-100 placeholder:text-zinc-600 border-zinc-800',
      tabActive: 'bg-[#1E293B] text-indigo-300 shadow-sm border border-indigo-500/30',
      tabInactive: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
      codeBg: 'bg-[#050811] text-zinc-200 border-zinc-800/80',
    },
    entityColors: {
      ORGANIZATION: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-700/80', highlightBg: '#172554', darkHighlightBg: '#1e3a8a' },
      LOCATION: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-700/80', highlightBg: '#064e3b', darkHighlightBg: '#065f46' },
      PERSON: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-700/80', highlightBg: '#4c0519', darkHighlightBg: '#881337' },
      CONSUMER_GOOD: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-700/80', highlightBg: '#3b0764', darkHighlightBg: '#581c87' },
      EVENT: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-700/80', highlightBg: '#451a03', darkHighlightBg: '#78350f' },
      PRICE: { bg: 'bg-pink-950/80', text: 'text-pink-300', border: 'border-pink-700/80', highlightBg: '#500724', darkHighlightBg: '#831843' },
      NUMBER: { bg: 'bg-zinc-800/90', text: 'text-zinc-300', border: 'border-zinc-600/80', highlightBg: '#27272a', darkHighlightBg: '#3f3f46' },
      DATE: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-700/80', highlightBg: '#083344', darkHighlightBg: '#155e75' },
      WORK_OF_ART: { bg: 'bg-violet-950/80', text: 'text-violet-300', border: 'border-violet-700/80', highlightBg: '#2e1065', darkHighlightBg: '#4c1d95' },
      OTHER: { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-600/80', highlightBg: '#1e293b', darkHighlightBg: '#334155' },
    }
  },
  light: {
    id: 'light',
    name: 'Google Cloud Clean',
    isDark: false,
    description: 'Google Cloud console aesthetic with clean white cards and vibrant entity tags',
    accentName: 'Google Blue',
    previewColors: ['#f8f9fa', '#2563eb', '#10b981'],
    classes: {
      bg: 'bg-[#F8F9FA]',
      bgSubtle: 'bg-[#EEF2F6]',
      card: 'bg-white shadow-xs',
      cardSubtle: 'bg-zinc-50/70',
      cardHover: 'hover:bg-zinc-50',
      headerBg: 'bg-white/95 backdrop-blur-md',
      border: 'border-zinc-200',
      borderSubtle: 'border-zinc-100',
      borderFocus: 'focus:border-blue-500 focus:ring-blue-500/20',
      textPrimary: 'text-zinc-900',
      textSecondary: 'text-zinc-600',
      textMuted: 'text-zinc-400',
      accent: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-700',
      accentBorder: 'border-blue-200',
      accentHover: 'hover:bg-blue-100',
      accentGradient: 'bg-linear-to-tr from-blue-600 to-indigo-600',
      inputBg: 'bg-white text-zinc-900 placeholder:text-zinc-400 border-zinc-200',
      tabActive: 'bg-white text-blue-700 shadow-xs border border-zinc-200',
      tabInactive: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60',
      codeBg: 'bg-zinc-900 text-zinc-100 border-zinc-800',
    },
    entityColors: {
      ORGANIZATION: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', highlightBg: '#e8f0fe', darkHighlightBg: '#dbeafe' },
      LOCATION: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', highlightBg: '#e6f4ea', darkHighlightBg: '#d1fae5' },
      PERSON: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', highlightBg: '#fce8e6', darkHighlightBg: '#ffe4e6' },
      CONSUMER_GOOD: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', highlightBg: '#f3e8fd', darkHighlightBg: '#ede9fe' },
      EVENT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', highlightBg: '#fef7e0', darkHighlightBg: '#fef3c7' },
      PRICE: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', highlightBg: '#fce4ec', darkHighlightBg: '#fce7f3' },
      NUMBER: { bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-300', highlightBg: '#f1f3f4', darkHighlightBg: '#e4e4e7' },
      DATE: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', highlightBg: '#e0f7fa', darkHighlightBg: '#cffafe' },
      WORK_OF_ART: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', highlightBg: '#ede7f6', darkHighlightBg: '#ede9fe' },
      OTHER: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', highlightBg: '#f8f9fa', darkHighlightBg: '#e2e8f0' },
    }
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Glacier',
    isDark: true,
    description: 'Sub-zero arctic slate palette with glowing frost cyan and aurora accents',
    accentName: 'Aurora Cyan',
    previewColors: ['#0b1329', '#06b6d4', '#3b82f6'],
    classes: {
      bg: 'bg-[#0B1329]',
      bgSubtle: 'bg-[#0E1B38]',
      card: 'bg-[#112240]/90 backdrop-blur-md',
      cardSubtle: 'bg-[#192F56]/70',
      cardHover: 'hover:bg-[#1A325C]',
      headerBg: 'bg-[#0B1329]/90 backdrop-blur-md',
      border: 'border-cyan-900/40',
      borderSubtle: 'border-cyan-950/60',
      borderFocus: 'focus:border-cyan-400 focus:ring-cyan-500/30',
      textPrimary: 'text-cyan-50',
      textSecondary: 'text-cyan-200/70',
      textMuted: 'text-cyan-400/50',
      accent: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25',
      accentBg: 'bg-cyan-950/60',
      accentText: 'text-cyan-300',
      accentBorder: 'border-cyan-800/80',
      accentHover: 'hover:bg-cyan-900/60',
      accentGradient: 'bg-linear-to-tr from-cyan-600 via-teal-500 to-blue-500',
      inputBg: 'bg-[#080E20] text-cyan-50 placeholder:text-cyan-600/70 border-cyan-900/50',
      tabActive: 'bg-[#1A325C] text-cyan-300 shadow-sm border border-cyan-400/30',
      tabInactive: 'text-cyan-200/60 hover:text-cyan-100 hover:bg-cyan-950/50',
      codeBg: 'bg-[#050A18] text-cyan-100 border-cyan-950',
    },
    entityColors: {
      ORGANIZATION: { bg: 'bg-cyan-950/90', text: 'text-cyan-300', border: 'border-cyan-700/80', highlightBg: '#083344', darkHighlightBg: '#155e75' },
      LOCATION: { bg: 'bg-teal-950/90', text: 'text-teal-300', border: 'border-teal-700/80', highlightBg: '#042f2e', darkHighlightBg: '#115e59' },
      PERSON: { bg: 'bg-rose-950/90', text: 'text-rose-300', border: 'border-rose-700/80', highlightBg: '#4c0519', darkHighlightBg: '#881337' },
      CONSUMER_GOOD: { bg: 'bg-indigo-950/90', text: 'text-indigo-300', border: 'border-indigo-700/80', highlightBg: '#1e1b4b', darkHighlightBg: '#3730a3' },
      EVENT: { bg: 'bg-amber-950/90', text: 'text-amber-300', border: 'border-amber-700/80', highlightBg: '#451a03', darkHighlightBg: '#78350f' },
      PRICE: { bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-700/80', highlightBg: '#064e3b', darkHighlightBg: '#065f46' },
      NUMBER: { bg: 'bg-slate-800/90', text: 'text-slate-300', border: 'border-slate-600/80', highlightBg: '#1e293b', darkHighlightBg: '#334155' },
      DATE: { bg: 'bg-sky-950/90', text: 'text-sky-300', border: 'border-sky-700/80', highlightBg: '#082f49', darkHighlightBg: '#075985' },
      WORK_OF_ART: { bg: 'bg-purple-950/90', text: 'text-purple-300', border: 'border-purple-700/80', highlightBg: '#3b0764', darkHighlightBg: '#581c87' },
      OTHER: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-800/80', highlightBg: '#172554', darkHighlightBg: '#1e3a8a' },
    }
  },
  emerald: {
    id: 'emerald',
    name: 'AI Lab Emerald',
    isDark: true,
    description: 'Modern developer AI workbench aesthetic with carbon darks and bioluminescent greens',
    accentName: 'Cyber Emerald',
    previewColors: ['#0d1410', '#10b981', '#059669'],
    classes: {
      bg: 'bg-[#0B110E]',
      bgSubtle: 'bg-[#101A15]',
      card: 'bg-[#13201B]/90 backdrop-blur-md',
      cardSubtle: 'bg-[#1A2D26]/70',
      cardHover: 'hover:bg-[#1C322A]',
      headerBg: 'bg-[#0B110E]/90 backdrop-blur-md',
      border: 'border-emerald-900/40',
      borderSubtle: 'border-emerald-950/60',
      borderFocus: 'focus:border-emerald-400 focus:ring-emerald-500/30',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200/70',
      textMuted: 'text-emerald-400/50',
      accent: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25',
      accentBg: 'bg-emerald-950/60',
      accentText: 'text-emerald-300',
      accentBorder: 'border-emerald-800/80',
      accentHover: 'hover:bg-emerald-900/60',
      accentGradient: 'bg-linear-to-tr from-emerald-600 via-teal-600 to-green-500',
      inputBg: 'bg-[#070D0A] text-emerald-50 placeholder:text-emerald-700 border-emerald-900/50',
      tabActive: 'bg-[#1C322A] text-emerald-300 shadow-sm border border-emerald-500/30',
      tabInactive: 'text-emerald-200/60 hover:text-emerald-100 hover:bg-emerald-950/50',
      codeBg: 'bg-[#040806] text-emerald-100 border-emerald-950',
    },
    entityColors: {
      ORGANIZATION: { bg: 'bg-sky-950/90', text: 'text-sky-300', border: 'border-sky-700/80', highlightBg: '#082f49', darkHighlightBg: '#075985' },
      LOCATION: { bg: 'bg-emerald-950/90', text: 'text-emerald-300', border: 'border-emerald-700/80', highlightBg: '#064e3b', darkHighlightBg: '#065f46' },
      PERSON: { bg: 'bg-rose-950/90', text: 'text-rose-300', border: 'border-rose-700/80', highlightBg: '#4c0519', darkHighlightBg: '#881337' },
      CONSUMER_GOOD: { bg: 'bg-teal-950/90', text: 'text-teal-300', border: 'border-teal-700/80', highlightBg: '#042f2e', darkHighlightBg: '#115e59' },
      EVENT: { bg: 'bg-amber-950/90', text: 'text-amber-300', border: 'border-amber-700/80', highlightBg: '#451a03', darkHighlightBg: '#78350f' },
      PRICE: { bg: 'bg-green-950/90', text: 'text-green-300', border: 'border-green-700/80', highlightBg: '#052e16', darkHighlightBg: '#166534' },
      NUMBER: { bg: 'bg-zinc-800/90', text: 'text-zinc-300', border: 'border-zinc-600/80', highlightBg: '#27272a', darkHighlightBg: '#3f3f46' },
      DATE: { bg: 'bg-cyan-950/90', text: 'text-cyan-300', border: 'border-cyan-700/80', highlightBg: '#083344', darkHighlightBg: '#155e75' },
      WORK_OF_ART: { bg: 'bg-violet-950/90', text: 'text-violet-300', border: 'border-violet-700/80', highlightBg: '#2e1065', darkHighlightBg: '#4c1d95' },
      OTHER: { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-600/80', highlightBg: '#1e293b', darkHighlightBg: '#334155' },
    }
  },
  editorial: {
    id: 'editorial',
    name: 'Warm Editorial',
    isDark: false,
    description: 'Refined literary theme with warm linen textures, espresso typography, and terracotta accents',
    accentName: 'Terracotta Ochre',
    previewColors: ['#fdfbf7', '#d97706', '#b45309'],
    classes: {
      bg: 'bg-[#FBF8F3]',
      bgSubtle: 'bg-[#F4EFE6]',
      card: 'bg-[#FFFDF9] shadow-xs border-[#E8E1D5]',
      cardSubtle: 'bg-[#F5F0E6]',
      cardHover: 'hover:bg-[#F5EFE4]',
      headerBg: 'bg-[#FFFDF9]/95 backdrop-blur-md border-[#E8E1D5]',
      border: 'border-[#E8E1D5]',
      borderSubtle: 'border-[#EFE9DF]',
      borderFocus: 'focus:border-amber-600 focus:ring-amber-600/20',
      textPrimary: 'text-[#2D241E]',
      textSecondary: 'text-[#665A4F]',
      textMuted: 'text-[#96887B]',
      accent: 'bg-[#B45309] hover:bg-[#92400E] text-white shadow-xs',
      accentBg: 'bg-amber-100/70',
      accentText: 'text-amber-900',
      accentBorder: 'border-amber-300',
      accentHover: 'hover:bg-amber-100',
      accentGradient: 'bg-linear-to-tr from-amber-700 to-orange-600',
      inputBg: 'bg-[#FFFDF9] text-[#2D241E] placeholder:text-[#96887B] border-[#E8E1D5]',
      tabActive: 'bg-[#FFFDF9] text-amber-900 font-bold shadow-xs border border-[#E8E1D5]',
      tabInactive: 'text-[#665A4F] hover:text-[#2D241E] hover:bg-[#EFE9DF]',
      codeBg: 'bg-[#261E19] text-[#FBF8F3] border-[#3E322A]',
    },
    entityColors: {
      ORGANIZATION: { bg: 'bg-blue-100/70', text: 'text-blue-900', border: 'border-blue-300', highlightBg: '#dbeafe', darkHighlightBg: '#bfdbfe' },
      LOCATION: { bg: 'bg-emerald-100/70', text: 'text-emerald-900', border: 'border-emerald-300', highlightBg: '#d1fae5', darkHighlightBg: '#a7f3d0' },
      PERSON: { bg: 'bg-rose-100/70', text: 'text-rose-900', border: 'border-rose-300', highlightBg: '#ffe4e6', darkHighlightBg: '#fecdd3' },
      CONSUMER_GOOD: { bg: 'bg-purple-100/70', text: 'text-purple-900', border: 'border-purple-300', highlightBg: '#ede9fe', darkHighlightBg: '#ddd6fe' },
      EVENT: { bg: 'bg-amber-100/80', text: 'text-amber-900', border: 'border-amber-400', highlightBg: '#fef3c7', darkHighlightBg: '#fde68a' },
      PRICE: { bg: 'bg-orange-100/80', text: 'text-orange-900', border: 'border-orange-300', highlightBg: '#ffedd5', darkHighlightBg: '#fed7aa' },
      NUMBER: { bg: 'bg-[#EFE9DF]', text: 'text-[#2D241E]', border: 'border-[#D9CFC1]', highlightBg: '#f5f0e6', darkHighlightBg: '#e8e1d5' },
      DATE: { bg: 'bg-cyan-100/70', text: 'text-cyan-900', border: 'border-cyan-300', highlightBg: '#cffafe', darkHighlightBg: '#a5f3fc' },
      WORK_OF_ART: { bg: 'bg-stone-200/80', text: 'text-stone-900', border: 'border-stone-400', highlightBg: '#e7e5e4', darkHighlightBg: '#d6d3d1' },
      OTHER: { bg: 'bg-[#F4EFE6]', text: 'text-[#665A4F]', border: 'border-[#D9CFC1]', highlightBg: '#f4efe6', darkHighlightBg: '#e8e1d5' },
    }
  }
};
