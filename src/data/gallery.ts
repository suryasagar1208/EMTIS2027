import type { GalleryPhoto } from '@/types/conference';

/**
 * Supplied NSIT campus & academic facility photographs extracted from
 * ETIMS_2027_Campus_Images_and_NSIT_Logo.pdf.
 * Add new approved images to /public/assets/gallery/ and append an entry below.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'campus-overview',
    src: '/assets/gallery/campus-overview.jpg',
    alt: 'Panoramic view of the NSIT campus, landscaped grounds and outdoor sports courts',
    title: 'NSIT Campus Overview',
    caption:
      'Panoramic view of the Netaji Subhas Institute of Technology campus, landscaped grounds, and outdoor sports courts at Amhara, Bihta.',
    category: 'Campus',
    width: 1536,
    height: 864,
  },
  {
    id: 'campus-building-grounds',
    src: '/assets/gallery/campus-building-grounds.jpg',
    alt: 'View of the NSIT academic building and landscaped campus grounds',
    title: 'Academic Building & Grounds',
    caption:
      'Main academic building and landscaped lawns spread across the ~9.2-acre NSIT campus.',
    category: 'Infrastructure',
    width: 1536,
    height: 845,
  },
  {
    id: 'lecture-hall',
    src: '/assets/gallery/lecture-hall.jpg',
    alt: 'Students attending a classroom lecture in a tiered lecture hall at NSIT',
    title: 'Tiered Lecture Hall',
    caption:
      'Tiered lecture hall hosting academic sessions, keynote addresses, and technical interactions.',
    category: 'Academic Spaces',
    width: 1536,
    height: 1152,
  },
  {
    id: 'computer-lab',
    src: '/assets/gallery/computer-lab.jpg',
    alt: 'Students working at desktop computers in the NSIT computer laboratory',
    title: 'Computer Laboratory',
    caption:
      'Computing laboratory equipped for programming, data science, and engineering coursework.',
    category: 'Laboratories',
    width: 1536,
    height: 659,
  },
  {
    id: 'practical-lab-session',
    src: '/assets/gallery/practical-lab-session.jpg',
    alt: 'Students and an instructor working together during a practical laboratory session',
    title: 'Practical Laboratory Session',
    caption:
      'Faculty-guided hands-on practical experimentation and applied engineering training.',
    category: 'Laboratories',
    width: 1536,
    height: 862,
  },
];

