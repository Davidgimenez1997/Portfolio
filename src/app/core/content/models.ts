export interface Profile {
  name?: string;
  role?: Record<'es' | 'en', string>;
  location?: string;
  summary?: Record<'es' | 'en', string>;
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
  role?: Record<'es' | 'en', string>;
  from?: string;
  to?: string | null;
  highlights?: Record<'es' | 'en', string[]>;
  stack?: string[];
}

export interface Project {
    slug?: string;
    title?: string;
    description?: string;
    stack?: string[];
    highlights?: string[];
    links?: {
        github?: string;
        live?: string;
    };
}
