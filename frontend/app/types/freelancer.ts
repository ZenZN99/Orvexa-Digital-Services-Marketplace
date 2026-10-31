import { IUser } from "./user";

export enum JobTitle {
  NO_JOB_TITLE = "No job title",
  SOFTWARE_ENGINEER = "Software Engineer",
  SOFTWARE_DEVELOPER = "Software Developer",
  FULL_STACK_DEVELOPER = "Full Stack Developer",
  BACKEND_DEVELOPER = "Backend Developer",
  FRONTEND_DEVELOPER = "Frontend Developer",
  MOBILE_APP_DEVELOPER = "Mobile App Developer",
  DEVOPS_ENGINEER = "DevOps Engineer",
  DATA_ANALYST = "Data Analyst",
  DATA_SCIENTIST = "Data Scientist",

  UI_UX_DESIGNER = "UI/UX Designer",
  GRAPHIC_DESIGNER = "Graphic Designer",
  MOTION_GRAPHICS_DESIGNER = "Motion Graphics Designer",
  ILLUSTRATOR = "Illustrator",
  THREE_D_ARTIST = "3D Artist",

  VIDEO_EDITOR = "Video Editor",
  ANIMATOR = "Animator",
  PHOTOGRAPHER = "Photographer",

  CONTENT_WRITER = "Content Writer",
  COPYWRITER = "Copywriter",
  TRANSLATOR = "Translator",
  VOICE_OVER_ARTIST = "Voice Over Artist",

  DIGITAL_MARKETER = "Digital Marketer",
  SEO_SPECIALIST = "SEO Specialist",
  SOCIAL_MEDIA_MANAGER = "Social Media Manager",

  VIRTUAL_ASSISTANT = "Virtual Assistant",
  CUSTOMER_SUPPORT_SPECIALIST = "Customer Support Specialist",

  BUSINESS_CONSULTANT = "Business Consultant",
  PROJECT_MANAGER = "Project Manager",
  ACCOUNTANT = "Accountant",
}

export enum Skills {
  // Programming & Development
  JAVASCRIPT = "JavaScript",
  TYPESCRIPT = "TypeScript",
  PHP = "PHP",
  PYTHON = "Python",
  JAVA = "Java",
  C_SHARP = "C#",
  C_PLUS_PLUS = "C++",
  GO = "Go",
  RUST = "Rust",

  NODE_JS = "Node.js",
  NEST_JS = "NestJS",
  LARAVEL = "Laravel",
  DJANGO = "Django",
  SPRING_BOOT = "Spring Boot",
  DOT_NET = ".NET",

  REACT = "React",
  NEXT_JS = "Next.js",
  ANGULAR = "Angular",
  VUE_JS = "Vue.js",
  SVELTE = "Svelte",

  HTML = "HTML",
  CSS = "CSS",
  SCSS = "SCSS",
  TAILWIND_CSS = "Tailwind CSS",

  REST_API = "REST API",
  GRAPHQL = "GraphQL",
  MICROSERVICES = "Microservices",
  SYSTEM_DESIGN = "System Design",

  POSTGRESQL = "PostgreSQL",
  MYSQL = "MySQL",
  MONGODB = "MongoDB",
  REDIS = "Redis",
  SQL = "SQL",

  DOCKER = "Docker",
  KUBERNETES = "Kubernetes",
  AWS = "AWS",
  AZURE = "Azure",
  GCP = "Google Cloud",

  GIT = "Git",
  GITHUB = "GitHub",
  CI_CD = "CI/CD",

  // Mobile Development
  FLUTTER = "Flutter",
  REACT_NATIVE = "React Native",
  SWIFT = "Swift",
  KOTLIN = "Kotlin",

  // UI/UX & Design
  UI_UX_DESIGN = "UI/UX Design",
  FIGMA = "Figma",
  ADOBE_XD = "Adobe XD",
  PHOTOSHOP = "Adobe Photoshop",
  ILLUSTRATOR = "Adobe Illustrator",
  INDESIGN = "Adobe InDesign",

  GRAPHIC_DESIGN = "Graphic Design",
  LOGO_DESIGN = "Logo Design",
  BRANDING = "Branding",
  TYPOGRAPHY = "Typography",
  PROTOTYPING = "Prototyping",

  // Video & Animation
  VIDEO_EDITING = "Video Editing",
  VIDEO_PRODUCTION = "Video Production",
  MOTION_GRAPHICS = "Motion Graphics",
  ANIMATION = "Animation",
  THREE_D_MODELING = "3D Modeling",
  BLENDER = "Blender",
  AFTER_EFFECTS = "Adobe After Effects",
  PREMIERE_PRO = "Adobe Premiere Pro",

  // Writing & Translation
  CONTENT_WRITING = "Content Writing",
  COPYWRITING = "Copywriting",
  BLOG_WRITING = "Blog Writing",
  TECHNICAL_WRITING = "Technical Writing",
  CREATIVE_WRITING = "Creative Writing",
  TRANSLATION = "Translation",
  PROOFREADING = "Proofreading",
  EDITING = "Editing",

  // Marketing
  DIGITAL_MARKETING = "Digital Marketing",
  SEO = "SEO",
  SEM = "SEM",
  SOCIAL_MEDIA_MARKETING = "Social Media Marketing",
  SOCIAL_MEDIA_MANAGEMENT = "Social Media Management",
  EMAIL_MARKETING = "Email Marketing",
  CONTENT_MARKETING = "Content Marketing",
  GOOGLE_ADS = "Google Ads",
  META_ADS = "Meta Ads",

  // Business
  BUSINESS_CONSULTING = "Business Consulting",
  PROJECT_MANAGEMENT = "Project Management",
  BUSINESS_ANALYSIS = "Business Analysis",
  MARKET_RESEARCH = "Market Research",
  CUSTOMER_SUPPORT = "Customer Support",
  VIRTUAL_ASSISTANCE = "Virtual Assistance",

  // Data
  DATA_ANALYSIS = "Data Analysis",
  DATA_VISUALIZATION = "Data Visualization",
  MACHINE_LEARNING = "Machine Learning",
  ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence",
  EXCEL = "Microsoft Excel",
  POWER_BI = "Power BI",

  // Photography & Audio
  PHOTOGRAPHY = "Photography",
  PHOTO_EDITING = "Photo Editing",
  AUDIO_EDITING = "Audio Editing",
  SOUND_DESIGN = "Sound Design",
  VOICE_OVER = "Voice Over",

  // E-Commerce
  E_COMMERCE = "E-Commerce",
  SHOPIFY = "Shopify",
  WOOCOMMERCE = "WooCommerce",
  PRODUCT_LISTING = "Product Listing",
}

export interface IFreelancer {
  id: string;
  userId: string;
  jobTitle: JobTitle;
  about: string;
  skills: Skills[];
  website: string | null;
  completedOrders: number;
  ratingCount: number;
  ratingAverage: number;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
}
