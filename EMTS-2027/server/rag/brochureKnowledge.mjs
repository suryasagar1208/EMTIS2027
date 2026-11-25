/**
 * Official knowledge chunks extracted verbatim from NSIT_Conference_Brochure_Final.pdf.
 * Serves as the single source of truth for Ganesha's RAG retrieval pipeline.
 */
export const BROCHURE_CHUNKS = [
  {
    id: 'conference-overview',
    topic: 'About ETIMS 2027 Conference',
    keywords: ['etims', '2027', 'conference', 'what is', 'about', 'national', 'multidisciplinary', 'objective', 'purpose', 'delegates', 'mode', 'activities', 'keynote', 'panel', 'poster', 'oral', 'kya hai'],
    text: `ETIMS 2027 is the 1st National Conference on Emerging Technologies, Innovation and Multidisciplinary Studies (Science, Engineering, Management, Humanities), organised by Netaji Subhas Institute of Technology (NSIT), Amhara, Bihta, Patna, Bihar.
Dates: 23–24 July 2027 (dates tentative; provisional, subject to institutional and publisher approval).
Mode & Scale: Physical Mode at NSIT Campus, Bihta · Eight Tracks · 200–300 Delegates (brochure estimate).
Purpose: Emerging technologies and complex societal challenges require multidisciplinary approaches integrating engineering, science, management and humanities. ETIMS 2027 provides a common platform for researchers, academicians, industry professionals and students to present findings, exchange ideas and explore collaboration.
Activities: Two-day event featuring keynote and invited lectures, parallel technical sessions, oral and poster presentations, industry interactions and panel discussions.`,
    hindiText: `ETIMS 2027 (1st National Conference on Emerging Technologies, Innovation and Multidisciplinary Studies) ek do-din ki national conference hai jo Netaji Subhas Institute of Technology (NSIT), Amhara, Bihta, Patna, Bihar dwara organise ki ja rahi hai. Ismein Science, Engineering, Management aur Humanities ke 8 tracks hain aur lagbhag 200–300 delegates (brochure estimate) expected hain. Ye physical mode mein 23–24 July 2027 (dates tentative hain) ko hogi.`
  },
  {
    id: 'about-nsit',
    topic: 'About Netaji Subhas Institute of Technology (NSIT)',
    keywords: ['nsit', 'institute', 'college', 'established', 'aicte', 'affiliation', 'university', 'campus', 'acres', 'facilities', 'departments', 'who is organizing', 'organiser', 'bihar', 'kaun'],
    text: `Established in 2007, Netaji Subhas Institute of Technology (NSIT) is located at Amhara, Bihta, approximately 30 km from Patna, Bihar.
Approvals: Established with the approval of AICTE and the Department of Science and Technology, Government of Bihar.
Affiliations: B.Tech programmes are affiliated with Bihar Engineering University; diploma programmes with the State Board of Technical Education; management programmes with Aryabhatta Knowledge University.
Campus & Facilities: Spread over approximately 9.2 acres, the campus provides laboratories, workshops, a digital library, auditorium, hostels and sports facilities.
Departments: Civil Engineering, Mechanical Engineering, Electrical and Electronics Engineering, Computer Science and Engineering, Applied Sciences, Management, and English and Humanities.`,
    hindiText: `Netaji Subhas Institute of Technology (NSIT) ki sthapna 2007 mein hui thi aur yeh Amhara, Bihta mein (Patna se lagbhag 30 km door) sthit hai. Yeh AICTE aur Department of Science and Technology, Govt. of Bihar se approved hai. B.Tech Bihar Engineering University se, Diploma SBTE se, aur Management Aryabhatta Knowledge University se affiliated hai. Lagbhag 9.2 acre campus mein laboratories, workshops, digital library, auditorium, hostels aur sports facilities hain.`
  },
  {
    id: 'important-dates',
    topic: 'Important Dates and Deadlines',
    keywords: ['date', 'dates', 'deadline', 'when', 'schedule', 'timeline', 'last date', 'submission deadline', 'early registration', 'final registration', 'acceptance', 'camera ready', 'kab', 'tareekh'],
    text: `Important Dates for ETIMS 2027 (Provisional; subject to institutional and publisher approval):
- Call for Papers: January 2027
- Full Paper Submission: 30 March 2027
- Acceptance Notification: 31 May 2027
- Camera-ready Submission: 20 June 2027
- Early Registration Deadline: 20 June 2027
- Final Registration Deadline: 10 July 2027
- Conference Dates: 23–24 July 2027 (tentative)
Note: All dates are provisional and subject to institutional and publisher approval.`,
    hindiText: `ETIMS 2027 ki important dates (ye sabhi dates provisional/tentative hain): Call for Papers: January 2027, Full Paper Submission: 30 March 2027, Acceptance Notification: 31 May 2027, Camera-ready Submission: 20 June 2027, Early Registration Deadline: 20 June 2027, Final Registration Deadline: 10 July 2027, aur Conference: 23–24 July 2027.`
  },
  {
    id: 'tracks-all',
    topic: 'Eight Technical Tracks (T1–T8)',
    keywords: ['track', 'tracks', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 'research tracks', 'topics', 'subjects', 'domains', 'computer', 'civil', 'electrical', 'mechanical', 'electronics', 'science', 'management', 'humanities', 'library'],
    text: `ETIMS 2027 invites original, unpublished research papers across eight tracks (related multidisciplinary contributions are also welcome):
T1 — Computer Science and Artificial Intelligence: AI, machine learning and deep learning; data science; cloud and high-performance computing; cybersecurity and blockchain; computer vision and NLP; software engineering.
T2 — Civil Engineering and Infrastructure: Structural, geotechnical, transportation and railway engineering; pavements; water resources and environmental engineering; construction management; advanced construction materials; geospatial technologies.
T3 — Electrical Engineering: Renewable energy; power systems and smart grids; power electronics and drives; electrical machines; energy storage; electric vehicles; energy management.
T4 — Mechanical and Manufacturing Engineering: Advanced and additive manufacturing; Industry 4.0 and smart manufacturing; robotics and automation; thermal and fluid engineering; automobile engineering; mechanical design and computational mechanics.
T5 — Electronics and Communication Engineering: Wireless and 5G/6G communication; IoT and embedded systems; VLSI; signal and image processing; antennas and microwave engineering; sensors; optical communication.
T6 — Applied Science: Applied and condensed-matter physics; photonics and thin films; nanomaterials and functional materials; electrochemistry and energy-storage materials; catalysis, polymers and green chemistry; environmental and analytical chemistry; mathematical modelling and numerical methods; optimization, statistics and cryptography.
T7 — Management: Technology and innovation management; operations and supply-chain management; project and construction management; entrepreneurship and start-up ecosystems; business analytics and decision sciences; human resource and organisational management; financial management and FinTech; sustainable business and ESG practices.
T8 — Humanities and Library Science: English language, literature and linguistics; professional and technical communication; ethics, society and culture; digital humanities; library and information science; digital libraries and knowledge management; scholarly communication and research metrics; information literacy.`,
    hindiText: `ETIMS 2027 mein 8 research tracks hain: T1 Computer Science & AI, T2 Civil Engineering & Infrastructure, T3 Electrical Engineering, T4 Mechanical & Manufacturing Engineering, T5 Electronics & Communication Engineering, T6 Applied Science, T7 Management, aur T8 Humanities & Library Science. Related multidisciplinary papers bhi welcome hain.`
  },
  {
    id: 'registration-fees',
    topic: 'Registration Categories and Fees',
    keywords: ['fee', 'fees', 'registration', 'cost', 'price', 'amount', 'ug', 'undergraduate', 'student', 'pg', 'scholar', 'faculty', 'industry', 'attendee', 'co-author', 'kitna', 'kitni', 'paisa', 'rupees', 'inr'],
    text: `Registration Fees for ETIMS 2027 (Early / Regular in INR):
- Faculty / academicians: ₹2,500 (Early) / ₹3,000 (Regular)
- Industry professionals: ₹3,500 (Early) / ₹4,000 (Regular)
- Research scholars / PG: ₹1,500 (Early) / ₹2,000 (Regular)
- UG students: ₹800 (Early) / ₹1,000 (Regular)
- Non-presenting co-author / attendee: ₹500 (Early) / ₹500 (Regular)
Deadlines: Early registration: 20 June 2027. Final registration: 10 July 2027 (dates provisional).
Inclusions: Fees include conference participation, materials, refreshments/meals and applicable certificate.
Note: Publication charges, if any, will be notified separately. At least one author of each accepted paper must register and present in person.`,
    hindiText: `ETIMS 2027 registration fees (Early / Regular INR mein): Faculty/Academicians ₹2,500 / ₹3,000; Industry Professionals ₹3,500 / ₹4,000; Research Scholars/PG ₹1,500 / ₹2,000; UG Students ₹800 / ₹1,000; aur Non-presenting Co-author/Attendee ₹500 / ₹500. Early deadline 20 June 2027 aur Final deadline 10 July 2027 hai (tentative). Fees mein participation, materials, meals/refreshments aur certificate shamil hain.`
  },
  {
    id: 'submission-requirements',
    topic: 'Call for Papers and Paper Submission Requirements',
    keywords: ['submit', 'submission', 'paper', 'abstract', 'word count', 'words', 'portal', 'template', 'how to submit', 'present', 'in person', 'kaise submit', 'kitne words'],
    text: `How to Submit: Submit original, unpublished full-length papers through the official submission portal once announced (the portal link and QR code are yet to be added).
Abstract Requirement: Include an abstract of approximately 250–300 words, subject to the final publisher template.
Presentation Requirement: At least one author of each accepted paper must register and present in person.
Full Paper Submission Deadline: 30 March 2027 (provisional).`,
    hindiText: `Paper submission ke liye original, unpublished full-length paper official submission portal (jo abhi announce hona baaki hai) ke through submit karna hoga. Abstract lagbhag 250–300 words ka hona chahiye (final publisher template ke according). Har accepted paper ke kam se kam ek author ko in-person register aur present karna zaroori hai.`
  },
  {
    id: 'review-publication',
    topic: 'Review and Publication Policy',
    keywords: ['publish', 'publication', 'indexing', 'scopus', 'ieee', 'springer', 'guaranteed', 'guarantee', 'peer review', 'review', 'screening', 'charges', 'proceedings'],
    text: `Review and Publication Policy: Manuscripts will undergo preliminary screening for relevance, originality and similarity, followed by independent peer review.
Publisher & Indexing Status: The organizing committee is exploring publication arrangements with an established academic publisher. Proceedings outlet, indexing status, manuscript requirements and any charges will be announced only after formal confirmation.
Important Disclaimer: Publisher and indexing are not yet confirmed; no publication or indexing guarantee is made.`,
    hindiText: `Manuscripts ki pehle relevance, originality aur similarity ke liye preliminary screening hogi, phir independent peer review hoga. Organising committee ek established academic publisher ke saath arrangements explore kar rahi hai, lekin abhi publisher aur indexing confirmed nahi hai aur koi publication ya indexing guarantee nahi di ja rahi hai.`
  },
  {
    id: 'organising-committee',
    topic: 'Organising Committee',
    keywords: ['organising', 'organizing', 'committee', 'patron', 'chief patron', 'director', 'chairman', 'convenor', 'convener', 'co-convenor', 'atif', 'hussain', 'm m singh', 'nitu singh', 'jyotirmayee', 'dalei', 'rajan', 'gautam', 'deepansh', 'farrukh', 'nilanjan'],
    text: `Organising Structure of ETIMS 2027 (NSIT):
- Chief Patron: Mr. M. M. Singh (Chairman, NSIT)
- Patron: Mrs. Nitu Singh (Managing Director, NSIT)
- Co-Patron: Dr. Jyotirmayee Dalei (Director, NSIT)
- Convenor: Dr. Atif Hussain (Assistant Professor, Department of Civil Engineering, NSIT)
- Co-Convenors: Dr. Rajan Kumar, Dr. Gautam, Mr. Deepansh Yadav, Md. Farrukh, Mr. Nilanjan Manna.`,
    hindiText: `ETIMS 2027 Organising Committee: Chief Patron Mr. M. M. Singh (Chairman, NSIT), Patron Mrs. Nitu Singh (MD, NSIT), Co-Patron Dr. Jyotirmayee Dalei (Director, NSIT), Convenor Dr. Atif Hussain (Assistant Professor, Civil Engineering, NSIT), aur Co-Convenors: Dr. Rajan Kumar, Dr. Gautam, Mr. Deepansh Yadav, Md. Farrukh, Mr. Nilanjan Manna.`
  },
  {
    id: 'advisory-committee',
    topic: 'Advisory Committee',
    keywords: ['advisory', 'advisor', 'iit patna', 'nit surathkal', 'gec', 'kailash', 'raju halder', 'akhilendra', 'debashisha', 'yatendra', 'gopal krishna', 'chandan'],
    text: `Advisory Committee Members:
- Dr. Kailash Chandra Ray (Associate Professor, Electrical Engineering, IIT Patna)
- Dr. Raju Halder (Associate Professor, Computer Science and Engineering, IIT Patna)
- Dr. Akhilendra Singh (Associate Professor, Mechanical Engineering, IIT Patna)
- Dr. Debashisha Jena (Professor, Electrical and Electronics Engineering, NIT Surathkal)
- Dr. Yatendra Kumar Singh (Associate Professor, Electrical Engineering, IIT Patna)
- Mr. Gopal Krishna (Assistant Professor, CSE AI & Data Science, GEC Munger)
- Mr. Chandan Kumar Sharma (Assistant Professor, Civil Engineering, GEC Bhojpur).`,
    hindiText: `Advisory Committee mein IIT Patna se Dr. Kailash Chandra Ray, Dr. Raju Halder, Dr. Akhilendra Singh aur Dr. Yatendra Kumar Singh; NIT Surathkal se Dr. Debashisha Jena; GEC Munger se Mr. Gopal Krishna; aur GEC Bhojpur se Mr. Chandan Kumar Sharma shamil hain.`
  },
  {
    id: 'awards-volunteers-sponsorship',
    topic: 'Awards, Student Volunteers, Who Should Attend, and Sponsorship',
    keywords: ['award', 'awards', 'best paper', 'poster', 'prize', 'volunteer', 'volunteers', 'sponsor', 'sponsorship', 'psu', 'attend', 'who should attend', 'stall', 'exhibition'],
    text: `Who Should Attend: Faculty and academicians; scientists and R&D researchers; research scholars and postgraduate students; undergraduate students; industry professionals and entrepreneurs; government and PSU representatives; librarians and information professionals.
Awards and Recognition: Best Paper, Best Student Paper and Best Poster awards may be presented based on originality, research quality and presentation. Track-wise awards depend on the number and quality of eligible submissions and decisions of the evaluation committee (awards are not guaranteed).
Student Volunteers: Student volunteers drawn from every department will support registration and the help desk, hall management and session assistance, guest reception and hospitality, publicity and outreach, photography and documentation, and audio-visual and IT support.
Sponsorship: ETIMS 2027 invites sponsorship from industries, PSUs, research organizations and professional bodies (institutional visibility, exhibition stalls, souvenir advertisements). Sponsorship categories and benefits will be communicated separately.`,
    hindiText: `Awards mein Best Paper, Best Student Paper aur Best Poster awards originality aur quality ke base par diye ja sakte hain (evaluation committee ke decision par depend karta hai). Har department ke student volunteers registration/help desk, hall management, hospitality, outreach, photography aur AV/IT support handle karenge. Industries, PSUs aur research organizations sponsorship, exhibition stalls aur souvenir ads ke liye participate kar sakti hain.`
  },
  {
    id: 'venue-accommodation-contact',
    topic: 'Venue, Accommodation, Travel, and Contact Details',
    keywords: ['venue', 'where', 'location', 'bihta', 'patna', 'accommodation', 'hostel', 'stay', 'room', 'travel', 'contact', 'email', 'phone', 'mobile', 'number', 'kahan', 'rehna', 'sampark'],
    text: `Venue & Access: ETIMS 2027 will be held in physical mode at Netaji Subhas Institute of Technology (NSIT), Amhara, Bihta, approximately 30 km west of Patna, Bihar.
Accommodation & Travel: Limited accommodation may be available upon prior request, subject to availability. Travel details will be shared through the conference website.
Contact Details: Dr. Atif Hussain | Conference Convenor (Assistant Professor, Civil Engineering, NSIT). Email: etims2027@nsiterp.in. Phone: +91 83402 58426.`,
    hindiText: `Conference physical mode mein NSIT, Amhara, Bihta (Patna se lagbhag 30 km west) mein hogi. Limited accommodation prior request aur availability ke hisab se mil sakti hai. Contact ke liye Conference Convenor Dr. Atif Hussain se email (etims2027@nsiterp.in) ya phone (+91 83402 58426) par sampark kar sakte hain.`
  },
];

