// The shape of a finished CV, shared by the form, the API, and the templates.
export type CVResult = {
  fullName: string;
  jobTitle: string;
  photo?: string; // data URL (optional profile photo)
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin?: string;
  };
  summary: string;
  experience: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
    employmentType?: string; // e.g. "Full-time" (optional)
    workMode?: string; // "Remote" | "Hybrid" | "On-site" (optional)
  }[];
  education: { degree: string; institution: string; period: string }[];
  skills: string[];
  languages?: { name: string; level: string }[];
  certificates?: { name: string; issuer: string; year: string }[];
  // User-defined sections (e.g. Projects, Awards, Volunteering, Publications).
  customSections?: {
    heading: string;
    items: { title: string; subtitle: string; period: string; description: string }[];
  }[];
};
