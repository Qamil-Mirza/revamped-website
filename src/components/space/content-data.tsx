import type { IconType } from "react-icons";
import { FaReact, FaPython, FaDocker, FaAws, FaGithub, FaLinkedin, FaMedium } from "react-icons/fa";
import { FaNodeJs } from "react-icons/fa6";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiExpress,
  SiFastapi,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiSupabase,
  SiKubernetes,
} from "react-icons/si";

/**
 * Single source of truth for the "About" facet content. Both the card-based
 * classic layout (panels/*Content.tsx) and the CRT terminal layout
 * (panels/terminal/*Terminal.tsx) read from here so they never drift.
 */

export interface BioData {
  tagline: string;
  paragraphs: string[];
}

export const BIO: BioData = {
  tagline: "I Like To Work On Hard Problems.",
  paragraphs: [
    "I'm a full-stack developer with a background in data science and statistics for quantum chemistry and computational biology, currently studying at UC Berkeley. I love building useful things at the intersection of web development, machine learning, and computational biology.",
    "I’m enthusiastic about using machine learning and deep learning to solve meaningful problems in areas like computational biology and finance. Recent projects include toxicity prediction models in PyTorch and reinforcement learning for portfolio optimization and smarter decision making. I enjoy asking clear questions, running clean experiments, and shipping results.",
    "I thrive in collaborative teams where sharing ideas sparks better solutions. When I’m not coding, I’m outdoors, diving into research, or tinkering with new tools to stretch my skills and learn something new every day.",
  ],
};

export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  detail: string;
  tags: string[];
}

export const EDUCATION: EducationEntry[] = [
  {
    degree: "B.A. Data Science & Statistics",
    institution: "University of California Berkeley",
    period: "2023 - 2027",
    detail:
      "Specialized in applied math and modelling alongside quantum chemistry and computational biology, GPA 3.97/4.0",
    tags: [
      "AI / ML",
      "Applied Math",
      "Quantum Chemistry",
      "Computational Biology",
      "Computer Science",
    ],
  },
  {
    degree: "CAIE A-Levels",
    institution: "Kolej Yayasan UEM",
    period: "2021 - 2023",
    detail:
      "Completed Cambridge Assessment International Education (CAIE) A-Levels with distinction: A* in Mathematics, Physics, and Chemistry, and A in Further Mathematics.",
    tags: ["Mathematics", "Further Mathematics", "Physics", "Chemistry"],
  },
];

export interface Job {
  title: string;
  period: string;
  org: string;
  points: string[];
  tags: string[];
}

export const EXPERIENCE: Job[] = [
  {
    title: "Machine Learning Research Assistant",
    period: "Jun 2025 - Present",
    org: "UC Berkeley PATH (Partners for Advanced Transportation Technology)",
    points: [
      "Built an active-learning CV pipeline (YOLOv12 → frame triage → Label Studio → retrain) for road-distress detection (potholes, vertical/lateral cracks, faded markings, manholes, blurred signage)",
      "Processed 50,000+ frames; auto-filtered candidate frames and standardised ontology/QA guidelines, reducing manual review time by 80% per video",
      "Achieved 0.994 mAP@0.5 on a 7k image internal validation set for road-distress detection via iterative retraining and label-quality improvements",
    ],
    tags: ["Computer Vision", "YOLOv12", "Active Learning", "Label Studio"],
  },
  {
    title: "AI Search Optimization Engineer",
    period: "June 2025 - Aug 2025",
    org: "Maxis Berhad",
    points: [
      "Developed a fully customizable spin-the-wheel React application, now deployed in 15,200+ Maxis retail stores nationwide to support customer engagement campaigns",
      "Designed and deployed a serverless AWS-based document storage platform, migrating 1.5 million documents across multiple departments, eliminating third-party dependency and reducing annual infrastructure costs by RM100,000+",
      "Hardened backend APIs through comprehensive security audits, remediating high-risk vulnerabilities including SQL injection points and outdated cryptographic algorithms (MD5, SHA1)",
      "Rewrote document parsing logic and integrated a new parser into the company's internal AI assistant, improving dependency injection for scalable self-hosting and enhancing knowledge access for 3,800+ employees",
    ],
    tags: ["React", "AWS Lambda", "Security Audits", "Document Parsing", "RAG Pipeline"],
  },
  {
    title: "Machine Learning Research Assistant",
    period: "Jan 2025 - May 2025",
    org: "Merck Group",
    points: [
      "Built a modular, end-to-end model development pipeline by organising the project on GitHub and scripting automated workflows for data extraction, feature engineering, model training, and evaluation",
      "Engineered Directed Message Passing Neural Networks (D-MPNNs) to predict drug potency (IC50/EC50), leveraging protein–ligand interaction fingerprints; results accepted to the NeurIPS 2025 AI4Science Workshop",
      "Streamlined molecular docking workflow for 18,000+ ligands, optimizing docking parameters to reduce protocol noise by 25% and significantly improving signal quality in downstream modeling",
    ],
    tags: ["PyTorch", "Graph Neural Networks", "Molecular Docking", "High-Performance Computing"],
  },
  {
    title: "Full Stack Software Engineer Intern",
    period: "May 2024 - August 2024",
    org: "Supa",
    points: [
      "Developed and deployed an onboarding app on AWS Elastic Container Service integrated with PostgreSQL and a Node.js and Express.js REST API, streamlining workflows for 100+ annotators.",
      "Developed a skill-based tagging system for user categorization and added markdown support to enhance the RAG pipeline, benefiting 500+ users.",
      "Engineered an embedding visualization tool for 1M+ data points that can be run in the browser using Python and Plotly",
    ],
    tags: ["AWS Elastic Container Service", "PostgreSQL", "Node.js", "Express.js", "React", "Retrieval Augmented Generation", "WebGL"],
  },
  {
    title: "Data Science Intern",
    period: "April 2021 - June 2021",
    org: "Study Hub Asia",
    points: [
      "Engineered a robust data pipeline using Python and SQL to standardize child abuse reporting across 13 states, increasing data accuracy by 25%.",
      "Designed Figma prototypes and an interactive pitch deck to visualize project goals, securing financial and technical backing from three key stakeholders",
      "Scraped and structured a dataset of 1,000+ childcare centers using Python and BeautifulSoup, creating a user-friendly searchable database for reporting insights.",
    ],
    tags: ["Python", "SQLAlchemy", "BeautifulSoup", "Selenium", "Figma Prototyping", "Deck Design"],
  },
];

export interface Tool {
  name: string;
  Icon: IconType;
  color: string;
  size?: number;
  faded?: boolean;
}

export interface TechGroup {
  title: string;
  tools: Tool[];
}

export const TECH_GROUPS: TechGroup[] = [
  {
    title: "Frontend",
    tools: [
      { name: "React", Icon: FaReact, color: "#61DBFB" },
      { name: "TypeScript", Icon: SiTypescript, color: "#007ACC", size: 20 },
      { name: "Next.js", Icon: SiNextdotjs, color: "#000000" },
      { name: "Tailwind", Icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    title: "Backend",
    tools: [
      { name: "Node.js", Icon: FaNodeJs, color: "#00FF00", faded: true },
      { name: "Express", Icon: SiExpress, color: "#000000" },
      { name: "Python", Icon: FaPython, color: "#3776AB" },
      { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
    ],
  },
  {
    title: "Database",
    tools: [
      { name: "MongoDB", Icon: SiMongodb, color: "#00ED64", faded: true },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#ffffff", size: 25 },
      { name: "Redis", Icon: SiRedis, color: "#D82C20" },
      { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E", faded: true },
    ],
  },
  {
    title: "DevOps & Tools",
    tools: [
      { name: "Docker", Icon: FaDocker, color: "#2496ED" },
      { name: "AWS", Icon: FaAws, color: "#FF9900", faded: true },
      { name: "Git", Icon: FaGithub, color: "#181717" },
      { name: "Kubernetes", Icon: SiKubernetes, color: "#326CE5" },
    ],
  },
];

export interface ProjectHighlight {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

export const PROJECT_HIGHLIGHTS: ProjectHighlight[] = [
  {
    title: "Predicting Drug Target Affinities with Graph Neural Networks",
    description:
      "Directed Message Passing Neural Networks augmented with molecular descriptors and protein-ligand interactions. Accepted to the NeurIPS 2025 AI4Science Workshop.",
    tags: ["Graph Neural Networks", "PyTorch", "Drug Discovery"],
    url: "/documents/Drug_discovery_through_deep_learning_and_3D_protein_ligand_modeling.pdf",
  },
  {
    title: "In Silico Directed Evolution for Protein Sequence Design",
    description:
      "Augmenting low-activity activation domain sequences using in silico directed evolution and machine learning.",
    tags: ["Transformers", "PyTorch", "Computational Biology"],
    url: "https://github.com/Qamil-Mirza/compbio146-berkeley/blob/main/ds4bio-sp25/final-group/Augmenting%20Low-Activity%20Activation%20Domain%20Sequences%20Using%20In%20Silico%20Directed%20Evolution%20and%20Machine%20Learning.pdf",
  },
  {
    title: "Optimizing Equity Derivative Hedging Strategies",
    description:
      "Bay Area Decision Science Challenge 2025: a Mixed Integer Linear Program to hedge options exposure across a portfolio of stocks.",
    tags: ["Python", "Optimization", "Quant Finance"],
    url: "https://github.com/Qamil-Mirza/My-Data-Projects/blob/main/Bay-Area-Decision-Science-Challenge-2025/optimizing-equity-derivative-hedging-strategies.ipynb",
  },
  {
    title: "Home Expense Dashboard",
    description:
      "A full-stack app for tracking home expenses with insights, visualizations, and automated debt reconciliation.",
    tags: ["React", "FastAPI", "Supabase"],
    url: "https://www.loom.com/share/b313c33112f642398345d875ae5d4c95",
  },
];

export interface SocialChannel {
  label: string;
  href: string;
  Icon: IconType;
}

export interface ContactData {
  email: string;
  socials: SocialChannel[];
}

export const CONTACT: ContactData = {
  email: "qamilmirza@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Qamil-Mirza", Icon: FaGithub },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/qamil-mirza/", Icon: FaLinkedin },
    { label: "Medium", href: "https://medium.com/@qamilmirza", Icon: FaMedium },
  ],
};
