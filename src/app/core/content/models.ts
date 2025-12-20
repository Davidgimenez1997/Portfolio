export interface Profile {
  name: string;
  role: Record<'es' | 'en', string>;
  location: string;
  summary: Record<'es' | 'en', string>;
  links: {
    github?: string;
    linkedin?: string;
    cv?: string;
  };
}

export interface Skills {
  core: string[];
  daily: string[];
  familiar: string[];
}

export interface ExperienceItem {
  company: string;
  role: Record<'es' | 'en', string>;
  from: string; // YYYY-MM
  to: string | null; // YYYY-MM | null
  highlights: Record<'es' | 'en', string[]>;
  stack: string[];
}
