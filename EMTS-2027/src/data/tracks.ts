import type { TechnicalTrack } from '@/types/conference';

export const TECHNICAL_TRACKS: TechnicalTrack[] = [
  {
    code: 'T1',
    title: 'Computer Science and Artificial Intelligence',
    summary:
      'Intelligent algorithms, scalable data systems, secure computing architectures, and software engineering methodologies.',
    iconName: 'cpu',
    topics: [
      'Artificial intelligence',
      'Machine learning and deep learning',
      'Data science',
      'Cloud and high-performance computing',
      'Cybersecurity and blockchain',
      'Computer vision and NLP',
      'Software engineering',
    ],
  },
  {
    code: 'T2',
    title: 'Civil Engineering and Infrastructure',
    summary:
      'Resilient structures, sustainable materials, transportation networks, water systems, and geospatial infrastructure.',
    iconName: 'building',
    topics: [
      'Structural engineering',
      'Geotechnical engineering',
      'Transportation and railway engineering',
      'Pavements',
      'Water resources',
      'Environmental engineering',
      'Construction management',
      'Advanced construction materials',
      'Geospatial technologies',
    ],
  },
  {
    code: 'T3',
    title: 'Electrical Engineering',
    summary:
      'Clean energy generation, smart grid systems, power electronics, electric mobility, and efficient energy management.',
    iconName: 'zap',
    topics: [
      'Renewable energy',
      'Power systems and smart grids',
      'Power electronics and drives',
      'Electrical machines',
      'Energy storage',
      'Electric vehicles',
      'Energy management',
    ],
  },
  {
    code: 'T4',
    title: 'Mechanical and Manufacturing Engineering',
    summary:
      'Industry 4.0 automation, additive manufacturing, robotics, thermal-fluid systems, and computational mechanics.',
    iconName: 'cog',
    topics: [
      'Advanced and additive manufacturing',
      'Industry 4.0 and smart manufacturing',
      'Robotics and automation',
      'Thermal and fluid engineering',
      'Automobile engineering',
      'Mechanical design',
      'Computational mechanics',
    ],
  },
  {
    code: 'T5',
    title: 'Electronics and Communication Engineering',
    summary:
      'Next-generation wireless networks, embedded IoT architectures, VLSI design, photonics, and signal processing.',
    iconName: 'radio',
    topics: [
      'Wireless and 5G/6G communication',
      'IoT and embedded systems',
      'VLSI',
      'Signal and image processing',
      'Antennas and microwave engineering',
      'Sensors',
      'Optical communication',
    ],
  },
  {
    code: 'T6',
    title: 'Applied Science',
    summary:
      'Condensed-matter physics, advanced nanomaterials, green chemistry, mathematical modelling, and optimization.',
    iconName: 'atom',
    topics: [
      'Applied and condensed-matter physics',
      'Photonics and thin films',
      'Nanomaterials and functional materials',
      'Electrochemistry and energy-storage materials',
      'Catalysis and polymers',
      'Green chemistry',
      'Environmental and analytical chemistry',
      'Mathematical modelling and numerical methods',
      'Optimization, statistics and cryptography',
    ],
  },
  {
    code: 'T7',
    title: 'Management',
    summary:
      'Innovation strategy, supply-chain operations, FinTech, business analytics, entrepreneurship, and ESG practices.',
    iconName: 'briefcase',
    topics: [
      'Technology and innovation management',
      'Operations and supply-chain management',
      'Project and construction management',
      'Entrepreneurship and start-up ecosystems',
      'Business analytics and decision sciences',
      'Human resource and organisational management',
      'Financial management and FinTech',
      'Sustainable business and ESG practices',
    ],
  },
  {
    code: 'T8',
    title: 'Humanities and Library Science',
    summary:
      'Linguistics, technical communication, ethics and culture, digital humanities, and modern knowledge management.',
    iconName: 'bookOpen',
    topics: [
      'English language, literature and linguistics',
      'Professional and technical communication',
      'Ethics, society and culture',
      'Digital humanities',
      'Library and information science',
      'Digital libraries and knowledge management',
      'Scholarly communication and research metrics',
      'Information literacy',
    ],
  },
];

