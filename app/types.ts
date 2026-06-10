// The shape of a finished CV, shared by the form, the API, and the template.
export type CVResult = {
  fullName: string;
  jobTitle: string;
  contact: { email: string; phone: string };
  summary: string;
  experience: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: { degree: string; institution: string; period: string }[];
  skills: string[];
};
