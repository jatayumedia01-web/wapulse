export type NavLink = { label: string; href: string };

export type Program = {
  slug: string;
  title: string;
  description: string;
  grades: string;
  image: string;
  heroImage: string;
  overview: string;
  highlights: string[];
  curriculum: string[];
  outcomes: string[];
  dayInLife: string[];
  facultyLead: string;
  relatedSlugs: string[];
};

export type NewsItem = {
  slug: string;
  date: string;
  category: "Event" | "News" | "Achievement";
  title: string;
  excerpt: string;
  image: string;
  author: string;
  readTime: string;
  content: string[];
  tags: string[];
};

export type Leader = { name: string; role: string; bio: string; image: string };

export type Faculty = { name: string; department: string; qualification: string; image: string };

export type Facility = {
  title: string;
  description: string;
  image: string;
  features: string[];
};

export type Club = { name: string; category: string; description: string };

export type AdmissionStep = { step: number; title: string; description: string };

export type FAQ = { question: string; answer: string };

export type Scholarship = {
  name: string;
  coverage: string;
  criteria: string;
  deadline: string;
};

export type CalendarEvent = {
  date: string;
  title: string;
  type: "Academic" | "Event" | "Holiday" | "Exam";
  description: string;
};

export type Department = {
  name: string;
  email: string;
  phone: string;
  hours: string;
};

export type Accreditation = { name: string; year: string; description: string };

export type PortalFeature = { title: string; description: string; icon: string };
