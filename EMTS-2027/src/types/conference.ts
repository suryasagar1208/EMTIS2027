export type ThemeId = 'glass' | 'swiss';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HighlightMetric {
  id: string;
  label: string;
  value: string;
  note?: string;
  iconName: 'calendar' | 'layers' | 'users' | 'mapPin' | 'sparkles';
}

export interface TechnicalTrack {
  code: string;
  title: string;
  summary: string;
  topics: string[];
  iconName:
    | 'cpu'
    | 'building'
    | 'zap'
    | 'cog'
    | 'radio'
    | 'atom'
    | 'briefcase'
    | 'bookOpen';
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  designation?: string;
  affiliation: string;
  photo?: string;
  initials: string;
}

export interface ImportantDateItem {
  id: string;
  activity: string;
  date: string;
  isoDate?: string;
  statusNote?: string;
  isPrimary?: boolean;
}

export interface RegistrationFeeTier {
  id: string;
  category: string;
  earlyInr: string;
  regularInr: string;
  note?: string;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  width: number;
  height: number;
}

