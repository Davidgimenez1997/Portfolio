export type Lang = 'es' | 'en';

export interface I18nText {
    es: string;
    en: string;
}

export interface Profile {
  name?: string;
  role?: Record<Lang, string>;
  location?: Record<Lang, string>;
  summary?: Record<Lang, string>;
  email?: string;
  links?: {
    github?: string;
    linkedin?: string;
    cv?: string;
  };
}

export interface Skills {
  core?: string[];
  daily?: string[];
  familiar?: string[];
}

export interface ExperienceItem {
  company?: string;
  role?: Record<Lang, string>;
  from?: Record<Lang, string>;
  to?: Record<Lang, string> | null;
  highlights?: Record<Lang, string[]>;
  stack?: string[];
}

export interface EducationItem {
    institution?: string;
    degree?: Record<Lang, string>;
    from?: string;
    to?: string | null;
    highlights?: Record<Lang, string[]>;
    stack?: string[];
}

export interface ProjectLinks {
    github?: string;
    live?: string;
}

export type ProjectType = 'case-study' | 'personal' | 'open-source' | 'experiment';

export interface Project {
    slug: string;
    type?: ProjectType;
    title: string | I18nText;
    description: string | I18nText;
    context?: I18nText;
    solution?: { es: string[]; en: string[] };
    impact?: { es: string[]; en: string[] };
    highlights?: string[];
    stack?: string[];
    links?: ProjectLinks;
}
