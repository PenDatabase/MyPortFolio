export const person = {
  name: 'David Eneasato',
  email: 'davideneasatochibueze@gmail.com',
  github: 'https://github.com/PenDatabase',
  linkedin: 'https://www.linkedin.com/in/david-eneasato-2ba3a42b1/',
}

export const proof = [
  { value: '1,000+', label: 'concurrent users on the services I work on', source: 'Scorac Technologies' },
  { value: '500+', label: 'code submissions checked for plagiarism at once', source: 'Scorac grading pipeline' },
  { value: '4.89 / 5', label: 'CGPA in Computer Science', source: 'Covenant University' },
]

export const CATEGORIES = ['All', 'Products', 'Open source', 'Infrastructure']

// Every project. `kind` drives the /work filter; `why` is the one line under the title.
export const projects = [
  {
    slug: 'scorac',
    name: 'Scorac',
    kind: 'Products',
    year: '2025',
    why: 'AI and backend services for a coding platform with 1,000+ concurrent users, including the plagiarism checker and grading service.',
    url: 'https://scorac.com/',
    host: 'scorac.com',
    image: '/projects/scorac-logo.webp',
    logo: true,
  },
  {
    slug: '100l-playbook',
    name: 'The 100L Playbook',
    kind: 'Products',
    year: '2026',
    why: 'A guide for first-year students on the habits, grades and skills that turn year one into an advantage.',
    url: 'https://100lvl-must-knows.vercel.app',
    host: '100lvl-must-knows.vercel.app',
    image: '/projects/100lvl-must-knows.webp',
  },
  {
    slug: 'exam-advice',
    name: '5.0 CGPA Critical Advice',
    kind: 'Products',
    year: '2026',
    why: 'Exam advice and course guides from senior students, for anyone sitting their first exams.',
    url: 'https://exam-adviser.vercel.app',
    host: 'exam-adviser.vercel.app',
    image: '/projects/exam-adviser.webp',
  },
  {
    slug: 'converge',
    name: 'Converge GCT',
    kind: 'Infrastructure',
    year: '2025',
    why: 'VMs on OpenShift Virtualization with isolated networks, plus Active Directory, DNS and DHCP on Windows Server.',
    url: 'https://convergroup.com/',
    host: 'convergroup.com',
    image: '/projects/converge.webp',
  },
  {
    slug: 'cu-packages',
    name: 'CU Packages',
    kind: 'Products',
    year: '2025',
    why: 'Resumption packages for TIZ: a Django ordering backend and a Telegram bot that takes Paystack payments.',
    url: 'https://github.com/PenDatabase/TIZ-ecommerce-packages',
    host: 'GitHub',
    image: '/projects/cupackages.webp',
  },
  {
    slug: 'random-chat',
    name: 'Random Chat',
    kind: 'Open source',
    year: '2026',
    why: 'A Telegram bot that pairs Covenant University students for random chats.',
    url: 'https://github.com/PenDatabase/randomchat',
    host: 'GitHub',
    lang: 'JavaScript',
  },
  {
    slug: 'tempfileshare',
    name: 'TempFileShare',
    kind: 'Open source',
    year: '2026',
    why: 'Share a file without an account. Bins delete themselves after a few days.',
    url: 'https://github.com/PenDatabase/tempfileshare',
    host: 'GitHub',
    lang: 'HTML',
  },
  {
    slug: 'websocket-lb',
    name: 'WebSocket load test',
    kind: 'Infrastructure',
    year: '2026',
    why: 'A small FastAPI app for testing load balancing over WebSockets.',
    url: 'https://github.com/PenDatabase/simple-websocket-project',
    host: 'GitHub',
    lang: 'Python',
  },
  {
    slug: 'storefront',
    name: 'Storefront API',
    kind: 'Open source',
    year: '2025',
    why: 'A REST API for an e-commerce store, built with Django.',
    url: 'https://github.com/PenDatabase/storefront3',
    host: 'GitHub',
    lang: 'Python',
  },
  {
    slug: 'followup-buddy',
    name: 'FollowUp Buddy',
    kind: 'Products',
    year: '2025',
    why: 'An app for tracking evangelism contacts and follow-ups.',
    url: 'https://github.com/PenDatabase/FollowUp-Buddy',
    host: 'GitHub',
    lang: 'HTML',
  },
]

export const work = [
  {
    company: 'Scorac Technologies',
    role: 'Software Engineer',
    dates: 'Nov 2025 to now',
    points: [
      'Built AI and backend features on services serving 1,000+ concurrent users',
      'Built a microservice that checks 500+ code submissions for plagiarism at once',
      'Added production error logging to the grading service, with alerts through a Telegram bot',
    ],
  },
  {
    company: 'Converge GCT',
    role: 'Infrastructure Engineering',
    dates: null,
    points: [
      'Provisioned VMs on OpenShift Virtualization with multiple networks and isolated environments',
      'Ran VM snapshots, restores and clones, and fixed cloning failures by sealing VMs correctly',
      'Configured Windows Server core services: AD, DNS, DHCP and file services',
    ],
  },
  {
    company: 'AlgorithmX',
    role: 'Software Engineer, contract',
    dates: 'Aug to Sep 2025',
    points: [
      'Cut REST API failure rates by reworking error handling',
      'Resolved database errors to keep deployments stable and data intact',
      'Worked in a distributed team with Git and Agile',
    ],
  },
  {
    company: 'TIZ',
    role: 'Full-stack and bot developer',
    dates: 'Dec 2024 to May 2025',
    points: [
      'Built a Django ordering backend with session auth and optimised queries',
      'Built a Telegram ordering bot with Paystack payments in real time',
    ],
  },
  {
    company: 'ProgrammedHQ',
    role: 'Founder, full-stack developer',
    dates: null,
    points: [
      'Builds websites and web apps for SMEs with Django, including payment integrations and custom databases',
    ],
  },
]
