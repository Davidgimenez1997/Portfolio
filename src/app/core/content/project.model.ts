export interface Project {
    slug: string;
    title: string;
    description: string;
    stack: string[];
    highlights: string[];
    links?: {
        github?: string;
        live?: string;
    };
}
