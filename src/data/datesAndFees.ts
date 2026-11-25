import type { ImportantDateItem, RegistrationFeeTier } from '@/types/conference';

export const IMPORTANT_DATES: ImportantDateItem[] = [
  {
    id: 'cfp',
    activity: 'Call for Papers',
    date: 'January 2027',
    isoDate: '2027-01-15',
    statusNote: 'Opening of call for original manuscripts',
  },
  {
    id: 'full-paper',
    activity: 'Full Paper Submission',
    date: '30 March 2027',
    isoDate: '2027-03-30',
    statusNote: 'Full-length paper submission deadline',
  },
  {
    id: 'acceptance',
    activity: 'Acceptance Notification',
    date: '31 May 2027',
    isoDate: '2027-05-31',
    statusNote: 'Peer review decisions communicated',
  },
  {
    id: 'camera-ready',
    activity: 'Camera-ready Submission',
    date: '20 June 2027',
    isoDate: '2027-06-20',
    statusNote: 'Final formatted manuscript deadline',
  },
  {
    id: 'early-reg',
    activity: 'Early Registration Deadline',
    date: '20 June 2027',
    isoDate: '2027-06-20',
    statusNote: 'Early-bird fee window closes',
  },
  {
    id: 'final-reg',
    activity: 'Final Registration Deadline',
    date: '10 July 2027',
    isoDate: '2027-07-10',
    statusNote: 'Regular registration closes',
  },
  {
    id: 'conference',
    activity: 'Conference Dates',
    date: '23–24 July 2027',
    isoDate: '2027-07-23',
    statusNote: 'Two-day physical conference at NSIT, Bihta',
    isPrimary: true,
  },
];

export const DATES_DISCLAIMER =
  'Provisional; subject to institutional and publisher approval.';

export const REGISTRATION_FEES: RegistrationFeeTier[] = [
  {
    id: 'faculty',
    category: 'Faculty / Academicians',
    earlyInr: '₹2,500',
    regularInr: '₹3,000',
  },
  {
    id: 'industry',
    category: 'Industry Professionals',
    earlyInr: '₹3,500',
    regularInr: '₹4,000',
  },
  {
    id: 'scholars',
    category: 'Research Scholars / PG',
    earlyInr: '₹1,500',
    regularInr: '₹2,000',
  },
  {
    id: 'ug',
    category: 'UG Students',
    earlyInr: '₹800',
    regularInr: '₹1,000',
  },
  {
    id: 'attendee',
    category: 'Non-presenting Co-author / Attendee',
    earlyInr: '₹500',
    regularInr: '₹500',
  },
];

export const REGISTRATION_DETAILS = {
  earlyDeadline: '20 June 2027',
  finalDeadline: '10 July 2027',
  inclusions: [
    'Conference participation',
    'Conference materials',
    'Refreshments and meals',
    'Applicable certificate',
  ],
  publicationChargesNote:
    'Publication charges, if any, will be notified separately after formal publisher confirmation.',
  portalStatus: 'Official Registration Portal — To Be Announced',
  portalNote:
    'Online registration and approved payment instructions will be published here once finalised. No third-party payment links are active at this stage.',
};

export const SUBMISSION_DETAILS = {
  invitation:
    'ETIMS 2027 invites original, unpublished research papers across eight technical tracks. Related multidisciplinary contributions are also welcome.',
  abstractRequirement:
    'Include an abstract of approximately 250–300 words, subject to the final publisher template.',
  presentationRequirement:
    'At least one author of each accepted paper must register and present in person at NSIT, Bihta.',
  portalLabel: 'Submission Portal — To Be Announced',
  portalUrl: '', // Ready to populate when official portal URL is announced
  portalNote:
    'Submit original, unpublished full-length papers through the official submission portal once announced.',
  reviewProcess: [
    'Preliminary screening for relevance, originality, and similarity.',
    'Independent peer review by subject-matter reviewers.',
    'Publication arrangements are currently being explored with an established academic publisher.',
  ],
  publicationDisclaimer:
    'Publisher and indexing status are not yet confirmed; no publication or indexing guarantee is made. Proceedings outlet, indexing status, manuscript template requirements, and any publication charges will be announced only after formal confirmation.',
};

export const WHO_SHOULD_ATTEND = [
  'Faculty and academicians',
  'Scientists and R&D researchers',
  'Research scholars and postgraduate students',
  'Undergraduate students',
  'Industry professionals and entrepreneurs',
  'Government and PSU representatives',
  'Librarians and information professionals',
];

export const AWARDS_DETAILS = {
  categories: [
    {
      title: 'Best Paper Award',
      description:
        'Recognising outstanding originality, methodological rigour, and overall technical contribution.',
    },
    {
      title: 'Best Student Paper Award',
      description:
        'Encouraging high-quality research authored and presented by postgraduate or undergraduate students.',
    },
    {
      title: 'Best Poster Award',
      description:
        'Highlighting clarity, visual communication, and scholarly impact in poster presentations.',
    },
  ],
  disclaimer:
    'Awards may be presented based on originality, research quality and presentation. Track-wise awards depend on the number and quality of eligible submissions and decisions of the evaluation committee.',
};

export const VOLUNTEER_RESPONSIBILITIES = [
  'Registration and help desk',
  'Hall management',
  'Session assistance',
  'Guest reception and hospitality',
  'Publicity and outreach',
  'Photography and documentation',
  'Audio-visual and IT support',
];

export const SPONSORSHIP_DETAILS = {
  invitees: [
    'Industries',
    'Public Sector Undertakings (PSUs)',
    'Research organisations',
    'Professional bodies',
  ],
  opportunities: [
    'Institutional visibility',
    'Exhibition stalls',
    'Souvenir advertisements',
  ],
  note: 'Sponsorship categories and benefits will be communicated separately. Please contact the Conference Convenor for sponsorship enquiries.',
};

