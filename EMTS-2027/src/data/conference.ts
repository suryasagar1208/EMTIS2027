import type { HighlightMetric, NavItem, ThemeMeta } from '@/types/conference';

export const THEME_OPTIONS: ThemeMeta[] = [
  {
    id: 'glass',
    label: 'Glassmorphism',
    shortLabel: 'Glass',
    description: 'Translucent layered surfaces with subtle blur and soft depth.',
  },
  {
    id: 'swiss',
    label: 'Swiss Design',
    shortLabel: 'Swiss',
    description: 'Minimalist grid structure, crisp borders, and editorial typography.',
  },
];

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'tracks', label: 'Technical Tracks', href: '#tracks' },
  { id: 'committees', label: 'Committees', href: '#committees' },
  { id: 'dates', label: 'Important Dates', href: '#dates' },
  { id: 'registration', label: 'Registration', href: '#registration' },
  { id: 'submission', label: 'Submission', href: '#submission' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const CONFERENCE_INFO = {
  acronym: 'ETIMS 2027',
  edition: '1st National Conference',
  fullTitle: 'Emerging Technologies, Innovation and Multidisciplinary Studies',
  disciplinesTagline: 'Science • Engineering • Management • Humanities',
  datesDisplay: '23–24 July 2027',
  datesNote: 'Tentative (provisional; subject to institutional and publisher approval)',
  countdownTargetIso: '2027-07-23T09:00:00+05:30',
  mode: 'Physical Mode',
  venueShort: 'NSIT Campus, Amhara, Bihta, Patna, Bihar',
  venueFull: 'Netaji Subhas Institute of Technology (NSIT), Amhara, Bihta, Patna, Bihar, India',
  distanceFromPatna: 'Approximately 30 km west of Patna',
  brochurePdfUrl: '/assets/brochure/NSIT_Conference_Brochure_Final.pdf',
  assets: {
    nsitLogo: '/assets/logo/nsit-logo.jpg',
    nsitEmblem: '/assets/logo/nsit-emblem.png',
    etimsBadge: '/assets/logo/etims-2027-badge.png',
    heroCampusPhoto: '/assets/campus/campus-overview.jpg',
    buildingCampusPhoto: '/assets/campus/campus-building-grounds.jpg',
  },
};

export const HERO_HIGHLIGHTS: HighlightMetric[] = [
  {
    id: 'duration',
    label: 'Conference Format',
    value: 'Two-Day Event',
    note: '23–24 July 2027 (tentative)',
    iconName: 'calendar',
  },
  {
    id: 'tracks',
    label: 'Technical Scope',
    value: 'Eight Tracks',
    note: 'Science, Engineering, Management & Humanities',
    iconName: 'layers',
  },
  {
    id: 'delegates',
    label: 'Brochure Estimate',
    value: '200–300 Delegates',
    note: 'Expected participants (brochure estimate)',
    iconName: 'users',
  },
  {
    id: 'mode',
    label: 'Attendance Mode',
    value: 'Physical Mode',
    note: 'NSIT Campus, Amhara, Bihta',
    iconName: 'mapPin',
  },
  {
    id: 'platform',
    label: 'Research Exchange',
    value: 'Multidisciplinary',
    note: 'Academicians, Industry & Students',
    iconName: 'sparkles',
  },
];

export const ABOUT_CONFERENCE = {
  overview:
    'Emerging technologies and complex societal challenges require multidisciplinary approaches integrating engineering, science, management and humanities. ETIMS 2027 provides a common platform for researchers, academicians, industry professionals and students to present findings, exchange ideas and explore collaboration.',
  objectives: [
    'Present original research findings across eight multidisciplinary tracks.',
    'Exchange innovative ideas bridging academia, industry, and society.',
    'Explore inter-institutional academic and research collaborations.',
    'Discuss emerging technologies and sustainable technological solutions.',
    'Promote scholarly research dissemination and peer engagement.',
    'Encourage multidisciplinary knowledge sharing across disciplines.',
  ],
  activities: [
    'Keynote lectures',
    'Invited lectures',
    'Parallel technical sessions',
    'Oral presentations',
    'Poster presentations',
    'Industry interactions',
    'Panel discussions',
  ],
};

export const ABOUT_INSTITUTE = {
  name: 'Netaji Subhas Institute of Technology (NSIT)',
  establishedYear: '2007',
  location: 'Amhara, Bihta, approximately 30 km from Patna, Bihar',
  campusArea: 'Approximately 9.2 acres',
  approvals:
    'Established in 2007 with the approval of AICTE and the Department of Science and Technology, Government of Bihar.',
  affiliations: [
    { programme: 'B.Tech Programmes', body: 'Bihar Engineering University' },
    { programme: 'Diploma Programmes', body: 'State Board of Technical Education' },
    { programme: 'Management Programmes', body: 'Aryabhatta Knowledge University' },
  ],
  facilities: [
    'Laboratories',
    'Workshops',
    'Digital Library',
    'Auditorium',
    'Hostels',
    'Sports Facilities',
  ],
  departments: [
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical and Electronics Engineering',
    'Computer Science and Engineering',
    'Applied Sciences',
    'Management',
    'English and Humanities',
  ],
  departmentsSummary:
    'Together, these departments encompass engineering and technology, physics, chemistry, mathematics, management and humanities — providing the foundation for interdisciplinary learning, research and knowledge exchange at ETIMS 2027.',
};

export const VENUE_DETAILS = {
  campusName: 'Netaji Subhas Institute of Technology (NSIT)',
  addressLines: ['Amhara, Bihta, Patna', 'Bihar, India'],
  accessNote:
    'ETIMS 2027 will be held in physical mode at NSIT, Amhara, Bihta, approximately 30 km west of Patna.',
  accommodationNote:
    'Limited accommodation may be available upon prior request, subject to availability.',
  travelNote: 'Detailed travel and local transit instructions will be shared through the conference website.',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Netaji+Subhas+Institute+of+Technology+Amhara+Bihta+Patna+Bihar',
};

export const CONTACT_INFO = {
  convenorName: 'Dr. Atif Hussain',
  role: 'Conference Convenor',
  designation: 'Assistant Professor, Department of Civil Engineering, NSIT',
  email: 'etims2027@nsiterp.in',
  phoneDisplay: '+91 83402 58426',
  phoneHref: 'tel:+918340258426',
  websiteNote: 'Official submission portal and QR code will be updated once announced.',
};

