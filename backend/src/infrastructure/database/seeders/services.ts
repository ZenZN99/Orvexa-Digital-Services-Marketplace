import {
  ServiceCategory,
  ServiceStatus,
} from '../../../common/enums/service.enum.js';
import { Freelancer } from '../../../modules/profiles/freelancer/schema/freelancer.schema.js';
import { Service } from '../../../modules/services/schema/service.schema.js';

const serviceTemplates = [
  {
    category: ServiceCategory.PROGRAMMING,
    title: 'I will build a professional backend API with NestJS',
    description:
      'I will build a scalable and production-ready backend API using NestJS, TypeScript, PostgreSQL, and Redis.',
    features: [
      'REST API',
      'Authentication',
      'PostgreSQL',
      'Redis',
      'Clean Architecture',
    ],
    keywords: ['nestjs', 'typescript', 'nodejs', 'backend', 'api'],
    price: 150,
    deliveryDays: 5,
  },
  {
    category: ServiceCategory.PROGRAMMING,
    title: 'I will develop a modern Next.js web application',
    description:
      'I will create a fast, responsive, and modern web application using Next.js and TypeScript.',
    features: [
      'Next.js',
      'TypeScript',
      'Responsive Design',
      'API Integration',
      'SEO',
    ],
    keywords: ['nextjs', 'react', 'typescript', 'frontend', 'web'],
    price: 200,
    deliveryDays: 7,
  },
  {
    category: ServiceCategory.PROGRAMMING,
    title: 'I will build a full stack web application',
    description:
      'I will develop a complete full stack application with a modern frontend and scalable backend.',
    features: [
      'Frontend',
      'Backend',
      'Database',
      'Authentication',
      'Deployment',
    ],
    keywords: ['fullstack', 'react', 'nestjs', 'postgresql', 'web'],
    price: 500,
    deliveryDays: 14,
  },
  {
    category: ServiceCategory.DESIGN,
    title: 'I will design a modern professional website UI',
    description:
      'I will design a clean, modern, and user-friendly interface for your website or application.',
    features: [
      'Modern UI',
      'Responsive Design',
      'Desktop Design',
      'Mobile Design',
      'Figma',
    ],
    keywords: ['ui', 'ux', 'figma', 'website', 'design'],
    price: 120,
    deliveryDays: 4,
  },
  {
    category: ServiceCategory.DIGITAL_MARKETING,
    title: 'I will create a professional digital marketing strategy',
    description:
      'I will create a detailed digital marketing strategy to help your business grow online.',
    features: [
      'Marketing Strategy',
      'Audience Research',
      'Content Strategy',
      'SEO',
      'Analytics',
    ],
    keywords: ['marketing', 'seo', 'digital', 'strategy', 'business'],
    price: 100,
    deliveryDays: 3,
  },
  {
    category: ServiceCategory.WRITING_TRANSLATION,
    title: 'I will translate your content professionally',
    description:
      'I will provide accurate and professional translation for your documents and online content.',
    features: [
      'Accurate Translation',
      'Proofreading',
      'Fast Delivery',
      'Professional Quality',
    ],
    keywords: ['translation', 'writing', 'proofreading', 'language'],
    price: 50,
    deliveryDays: 2,
  },
  {
    category: ServiceCategory.VIDEO_AUDIO,
    title: 'I will edit your professional videos',
    description:
      'I will professionally edit your videos for YouTube, social media, advertisements, and business.',
    features: [
      'Video Editing',
      'Color Correction',
      'Transitions',
      'Audio Editing',
      'Motion Graphics',
    ],
    keywords: ['video', 'editing', 'youtube', 'premiere', 'content'],
    price: 100,
    deliveryDays: 4,
  },
  {
    category: ServiceCategory.AI,
    title: 'I will integrate AI into your application',
    description:
      'I will integrate AI capabilities into your application using modern AI APIs and backend architecture.',
    features: [
      'AI Integration',
      'API Integration',
      'Chatbots',
      'Automation',
      'Backend Integration',
    ],
    keywords: ['ai', 'openai', 'chatbot', 'automation', 'api'],
    price: 250,
    deliveryDays: 7,
  },
];

export const generateServices = (createdFreelancers: Freelancer[]) => {
  const services: Partial<Service>[] = [];

  createdFreelancers.forEach((freelancer, freelancerIndex) => {
    const serviceCount = 3;

    for (let i = 0; i < serviceCount; i++) {
      const template =
        serviceTemplates[
          (freelancerIndex * serviceCount + i) % serviceTemplates.length
        ];

      const isPublished = (freelancerIndex + i) % 5 !== 0;

      const ratingCount = isPublished ? (freelancerIndex + i) % 30 : 0;

      const ratingAverage =
        ratingCount > 0
          ? Number((3.5 + ((freelancerIndex + i) % 15) / 10).toFixed(2))
          : 0;

      services.push({
        freelancerId: freelancer.id,

        category: template.category,

        title: `${template.title} #${freelancerIndex + 1}`,

        description: template.description,

        features: template.features,

        images: [
          {
            url: `https://picsum.photos/seed/service-${freelancerIndex}-${i}/1200/800`,
            publicId: `seed-service-${freelancerIndex}-${i}`,
          },
        ],

        keywords: template.keywords,

        price: template.price,

        deliveryDays: template.deliveryDays,

        status: isPublished ? ServiceStatus.PUBLISHED : ServiceStatus.PENDING,

        ordersCount: ratingCount > 0 ? (freelancerIndex + i) % 20 : 0,

        ratingCount,

        ratingAverage,

        reason: null,
      });
    }
  });

  return services;
};
