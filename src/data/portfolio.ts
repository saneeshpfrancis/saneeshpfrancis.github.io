import type { LucideIcon } from "lucide-react";
import {
  Atom,
  BookOpenCheck,
  ClipboardList,
  FlaskConical,
  Globe2,
  LayoutDashboard,
  Mail,
  Microscope,
  Presentation,
  Radio,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon, type IconType } from "../components/ui/BrandIcons";

/* -------------------------------------------------------------------------- */
/*  Edit this file to update the content of the portfolio                     */
/* -------------------------------------------------------------------------- */

/** First month at Amrita Virtual Labs — used to compute years of experience. */
export const CAREER_START = new Date(2011, 5, 1);

export function yearsOfExperience(): number {
  const now = new Date();
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const beforeAnniversary =
    now.getMonth() < CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() < CAREER_START.getDate());
  if (beforeAnniversary) years -= 1;
  return years;
}

export const profile = {
  name: "Saneesh P F",
  fullName: "Saneesh P Francis",
  initials: "SF",
  title: "Project Manager & Technical Lead",
  organisation: "Physical Sciences Virtual Labs · Amrita Vishwa Vidyapeetham",
  roles: [
    "Project Manager",
    "Technical Lead",
    "Virtual Lab Developer",
    "Physics Educator",
    "EdTech Researcher",
  ],
  intro:
    "I build virtual laboratory experiences that make hands-on science education accessible to every learner — leading the Physical Sciences Virtual Labs at Amrita Vishwa Vidyapeetham (VALUE @ Amrita).",
  location: "Ernakulam, Kerala, India",
  workLocation: "Amritapuri, Kollam",
  email: "saneeshpf@gmail.com",
  languages: ["Malayalam", "English"],
  cvUrl: "https://saneeshpfrancis.github.io/assets/doc/Saneesh_CV_2022.pdf",
  /**
   * Optional: set your date of birth as "YYYY-MM-DD" to display your age in the
   * About section (it is calculated automatically). Leave as null to hide it.
   */
  birthDate: null as string | null,
};

export type SocialLink = { label: string; href: string; icon: IconType };

export const socials: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saneeshpf/", icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/saneeshpfrancis", icon: GitHubIcon },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Outreach", href: "#outreach" },
  { label: "Contact", href: "#contact" },
];

export const aboutParagraphs = [
  `I'm Saneesh — a physicist turned technologist who has spent over ${yearsOfExperience()} years building virtual laboratories that bring real science practice to students anywhere. I currently serve as the Project Manager and Technical Lead of the Physical Sciences Virtual Labs at Amrita Vishwa Vidyapeetham, where I lead the design, development and deployment of simulation-based, animation-driven and remote-triggered experiments used by learners across the globe.`,
  `Beyond building experiments, I work closely with educators — conducting hands-on workshops in universities across India and internationally, including a Commonwealth of Learning workshop in Nairobi, Kenya — and co-authoring peer-reviewed research on how virtual labs shape motivation, reflective learning and learning outcomes.`,
  `With an M.Sc. in Physics and an MCA in Computer Science, I enjoy working at the intersection of pedagogy, technology and project delivery.`,
];

export type Service = { title: string; description: string; icon: LucideIcon };

export const services: Service[] = [
  {
    title: "Virtual Lab Development",
    description:
      "Designing and building interactive physics simulations, animations and remote-triggered experiments delivered through the browser.",
    icon: FlaskConical,
  },
  {
    title: "Project & Technical Leadership",
    description:
      "Planning, coordinating and delivering virtual lab projects end-to-end with developers, designers and subject-matter experts.",
    icon: ClipboardList,
  },
  {
    title: "Workshops & Training",
    description:
      "Conducting awareness sessions and hands-on training programs for faculty and students in India and abroad.",
    icon: Presentation,
  },
  {
    title: "Educational Research",
    description:
      "Studying how virtual laboratories influence learning outcomes, motivation and laboratory skill development.",
    icon: Microscope,
  },
];

export type Experience = {
  role: string;
  organisation: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    role: "Project Manager & Technical Lead — Physical Sciences Virtual Labs",
    organisation: "VALUE @ Amrita · Amrita Vishwa Vidyapeetham",
    location: "Amritapuri, Kollam",
    start: "Nov 2013",
    end: "Present",
    current: true,
    summary:
      "Leading the physical sciences vertical of Amrita Virtual Labs — from pedagogy and simulation design to deployment, outreach and research.",
    highlights: [
      "Lead end-to-end development of physics virtual lab experiments: concept, simulation design, interactive animation, web deployment and maintenance.",
      "Own project planning, timelines and quality for the physical sciences track while coordinating developers, designers and subject experts.",
      "Technical lead for simulation-based, interactive-animation and remote-triggered experiment platforms.",
      "Represent Amrita Virtual Labs at national and international forums — including facilitating the Commonwealth of Learning workshop in Nairobi, Kenya (2022).",
      "Co-author peer-reviewed research on learning analytics, student motivation and reflective learning with virtual laboratories.",
    ],
    tags: ["Project Management", "Technical Leadership", "Virtual Labs", "Research"],
  },
  {
    role: "Project Assistant — VALUE Virtual Labs",
    organisation: "Amrita Vishwa Vidyapeetham",
    location: "Amritapuri, Kollam",
    start: "Jun 2011",
    end: "Nov 2013",
    summary:
      "Designed and developed physical science virtual lab experiments and trained faculty and students across Indian universities.",
    highlights: [
      "Designed and developed physical science virtual lab experiments for the national Virtual Labs initiative.",
      "Conducted workshops and hands-on training sessions in universities across India.",
      "Contributed to early studies on ICT-enabled physics education.",
    ],
    tags: ["Simulation Design", "Physics", "Workshops"],
  },
];

export type Education = {
  degree: string;
  field: string;
  institution: string;
  start: string;
  end: string;
  grade: string;
};

export const education: Education[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    field: "Computer Science",
    institution: "Indira Gandhi National Open University",
    start: "2012",
    end: "2017",
    grade: "First Class",
  },
  {
    degree: "Master of Science (M.Sc.)",
    field: "Physics",
    institution: "Mahatma Gandhi University",
    start: "2009",
    end: "2011",
    grade: "First Class",
  },
  {
    degree: "Bachelor of Science (B.Sc.)",
    field: "Physics",
    institution: "Mahatma Gandhi University",
    start: "2006",
    end: "2009",
    grade: "First Class",
  },
];

export type SkillGroup = { title: string; description: string; icon: LucideIcon; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Virtual Lab Engineering",
    description: "Turning physics concepts into interactive, browser-based experiments.",
    icon: Atom,
    skills: [
      "Physics Simulations",
      "Interactive Animations",
      "Remote-Triggered Experiments",
      "HTML · CSS · JavaScript",
      "UI/UX for Learning",
      "Experiment Documentation",
    ],
  },
  {
    title: "Project Leadership",
    description: "Delivering multidisciplinary education-technology projects on time.",
    icon: ClipboardList,
    skills: [
      "Project Planning & Delivery",
      "Team Coordination",
      "Stakeholder Management",
      "Quality Assurance",
      "Process Documentation",
      "Agile Practices",
    ],
  },
  {
    title: "Education & Research",
    description: "Evidence-based pedagogy for laboratory skill education.",
    icon: BookOpenCheck,
    skills: [
      "Physics Pedagogy",
      "Assessment Design",
      "Learning Analytics",
      "Academic Writing",
      "Workshop Facilitation",
      "Curriculum Alignment",
    ],
  },
  {
    title: "Domain Knowledge",
    description: "Strong foundations across the physical and computer sciences.",
    icon: Microscope,
    skills: [
      "Classical Mechanics",
      "Optics & Waves",
      "Electricity & Magnetism",
      "Modern Physics",
      "Solar Energy Systems",
      "Learning Management Systems",
    ],
  },
];

export type Project = {
  title: string;
  period: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  link?: string;
  linkLabel?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "VALUE Virtual Labs — Physical Sciences",
    period: "2011 – Present",
    description:
      "Amrita's flagship virtual laboratory platform delivering computer-simulated, remote-triggered and interactive animation-based physics experiments — freely accessible over the internet as part of India's national Virtual Labs initiative.",
    tags: ["Simulations", "Interactive Animations", "Remote Triggered", "Open Access"],
    icon: Atom,
    link: "https://vlab.amrita.edu",
    linkLabel: "vlab.amrita.edu",
    featured: true,
  },
  {
    title: "Remote-Triggered Experiments",
    period: "Ongoing",
    description:
      "Real laboratory instruments controllable from anywhere through the browser — for example a dual-axis solar irradiance measurement system — letting students run genuine experiments remotely and analyse live data.",
    tags: ["Hardware Integration", "Live Data", "IoT"],
    icon: Radio,
  },
  {
    title: "VL-LMS — Virtual Lab Learning Management System",
    period: "Ongoing",
    description:
      "A learning-management layer for virtual labs that helps institutions organise courses, track student experimentation and assess outcomes. Demonstrated to educators at the COL workshop in Nairobi.",
    tags: ["LMS", "Assessment", "Analytics"],
    icon: LayoutDashboard,
  },
  {
    title: "Virtual Labs Outreach & Adoption",
    period: "2011 – Present",
    description:
      "A nationwide and international outreach program that trains faculty and students through hands-on workshops, helping institutions integrate virtual labs as pre-lab and post-lab learning tools.",
    tags: ["Workshops", "Faculty Training", "Adoption"],
    icon: Globe2,
  },
];

export type Publication = {
  title: string;
  venue: string;
  year: number;
  type: "Journal" | "Conference";
  authors: string;
  publisher: string;
};

export const publications: Publication[] = [
  {
    title:
      "Intrinsic and extrinsic motivation among students for laboratory courses — Assessing the impact of virtual laboratories",
    venue: "Computers & Education, Vol. 198, 104758",
    publisher: "Elsevier",
    year: 2023,
    type: "Journal",
    authors: "Shyam Diwakar, Vysakh Kani Kolil, Saneesh P. Francis, Krishnashree Achuthan",
  },
  {
    title:
      "Impact of remote experimentation, interactivity and platform effectiveness on laboratory learning outcomes",
    venue: "International Journal of Educational Technology in Higher Education",
    publisher: "Springer",
    year: 2021,
    type: "Journal",
    authors:
      "Krishnashree Achuthan, Dhananjay Raghavan, Balakrishnan Shankar, Saneesh P. Francis, Vysakh Kani Kolil",
  },
  {
    title: "Remote Triggered Dual-Axis Solar Irradiance Measurement System",
    venue: "IEEE Transactions on Industry Applications",
    publisher: "IEEE",
    year: 2020,
    type: "Journal",
    authors:
      "Krishnashree Achuthan, Joshua D. Freeman, Prema Nedungadi, Umesh Mohankumar, Anu Varghese, Athul M. Vasanthakumari, Saneesh P. Francis, Vysakh Kani Kolil",
  },
  {
    title:
      "Augmented reflective learning and knowledge retention perceived among students in classrooms involving virtual laboratories",
    venue: "Education and Information Technologies",
    publisher: "Springer",
    year: 2017,
    type: "Journal",
    authors: "Krishnashree Achuthan, Saneesh P. Francis, Shyam Diwakar",
  },
  {
    title: "Learning curve analysis for virtual laboratory experimentation",
    venue: "International Conference on Advances in Computing, Communications and Informatics (ICACCI)",
    publisher: "IEEE",
    year: 2016,
    type: "Conference",
    authors: "Saneesh P. Francis, Vysakh Kani Kolil, Krishnashree Achuthan",
  },
  {
    title: "Improving perception of invisible phenomena in undergraduate physics education using ICT",
    venue: "International Conference on Information and Communication Technology (ICoICT)",
    publisher: "IEEE",
    year: 2014,
    type: "Conference",
    authors: "Krishnashree Achuthan, Saneesh P. Francis, et al.",
  },
];

export function scholarUrl(title: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(`"${title}"`)}`;
}

export type Workshop = {
  title: string;
  host: string;
  location: string;
  country: string;
  date: string;
  description: string;
  highlights: string[];
  international?: boolean;
};

export const workshops: Workshop[] = [
  {
    title: "Amrita Virtual Labs Workshop with the Commonwealth of Learning",
    host: "Commonwealth of Learning (COL) · Kenya Technical Trainers College",
    location: "Nairobi",
    country: "Kenya",
    date: "July 2022",
    description:
      "Travelled to Nairobi as facilitator for a multi-day workshop introducing virtual labs to Kenyan educators and trainers, extending Amrita Virtual Labs' reach to Africa.",
    highlights: [
      "Introduction to Virtual Labs & project background",
      "Live demonstration of physical sciences experiments",
      "Hands-on sessions with participants",
      "Demonstration of the VL-LMS platform",
    ],
    international: true,
  },
  {
    title: "Virtual Labs Workshop for Science Students",
    host: "DAV College, Amritsar",
    location: "Amritsar, Punjab",
    country: "India",
    date: "September 2023",
    description:
      "Delivered lectures on the introduction to virtual labs and their role in improving students' academic performance to around 400 UG and PG science students, followed by hands-on training.",
    highlights: ["~400 participants", "Lecture + demonstration", "Hands-on lab session"],
  },
  {
    title: "One-day Workshop on Virtual Labs",
    host: "Hindusthan College of Arts & Science · VALUE @ Amrita",
    location: "Coimbatore, Tamil Nadu",
    country: "India",
    date: "June 2025",
    description:
      "Resource person sharing insights into the virtual lab platform and its potential to enhance learning, followed by a hands-on training session in the computer lab.",
    highlights: ["Resource person", "Platform walkthrough", "Hands-on training"],
  },
  {
    title: "Faculty & Student Training Programs",
    host: "Universities and colleges across India",
    location: "Pan-India",
    country: "India",
    date: "2011 – Present",
    description:
      "Regularly conducts awareness and hands-on workshops that help institutions adopt virtual labs as pre-lab and post-lab learning tools.",
    highlights: ["Awareness sessions", "Faculty development", "Student training"],
  },
];

export const stats = [
  { value: `${yearsOfExperience()}+`, label: "Years in Virtual Labs" },
  { value: `${publications.length}`, label: "Research Publications" },
  { value: "2", label: "Continents Reached" },
  { value: "3", label: "Academic Degrees" },
];
