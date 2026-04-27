export interface Candidate {
  name: string;
  number: number;
  slogan: string;
  grade: string;
  bio: string;
  ideology: string;
  mission: string;
  vision: string;
  reasonForRunning: string;
  values: string[];
  strengths: string[];
  electionDate: string;
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  heroImage: string;
  aboutImage: string;
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  description: string;
  impact: string;
  icon: string;
  impactScore: number;
}

export interface FeedbackItem {
  id: string;
  name: string;
  grade?: string;
  message: string;
  category: string;
  timestamp: string;
  isRead: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const defaultCandidate: Candidate = {
  name: "Matthew Prueksakij",
  number: 7,
  slogan: "Students First, Future Forward",
  grade: "M.5",
  bio: "A passionate student leader with a vision for a better school community. I believe every student deserves a voice, and I'm ready to be that voice for all of us. With dedication, creativity, and a genuine love for our school, I'm committed to making real, lasting change that matters.",
  ideology: "Student-centered leadership, transparency, creativity, equality, and real action.",
  mission: "To make school life more organized, enjoyable, and supportive for every student.",
  vision: "A school where every student feels heard, respected, and represented.",
  reasonForRunning: "I want to turn student problems into real solutions, not just promises. Our school deserves a representative who listens, acts, and delivers.",
  values: ["Transparency", "Equality", "Creativity", "Action", "Empathy"],
  strengths: ["Leadership", "Communication", "Problem-solving", "Creativity", "Teamwork"],
  electionDate: "2026-05-15",
  videoUrl: "",
  videoTitle: "My Campaign Vision — Students First, Future Forward",
  videoDescription: "Watch my campaign video to learn more about my vision for our school and the changes I plan to make as your Student Council President.",
  heroImage: "",
  aboutImage: "",
};

export const defaultPolicies: Policy[] = [
  {
    id: "1",
    title: "Better School Communication",
    category: "Technology",
    description: "Create a central online announcement hub so students never miss important updates. This system will consolidate announcements from all departments into one accessible platform.",
    impact: "Students stay informed about school events, deadlines, and announcements in real-time. Estimated 60% reduction in missed deadlines.",
    icon: "MessageSquare",
    impactScore: 8,
  },
  {
    id: "2",
    title: "Mental Health Support",
    category: "Wellness",
    description: "Create anonymous suggestion and support channels for students who need help. Partner with school counselors to provide accessible mental health resources and peer support programs.",
    impact: "Students gain access to confidential support, reducing stigma around mental health and creating a safer school environment for everyone.",
    icon: "Heart",
    impactScore: 9,
  },
  {
    id: "3",
    title: "Student Activity Upgrade",
    category: "Culture",
    description: "Make school events more student-led, creative, and inclusive. Establish a student committee to plan and organize events that reflect diverse student interests.",
    impact: "Increased student participation in school life, stronger community bonds, and events that every student actually wants to attend.",
    icon: "Star",
    impactScore: 7,
  },
  {
    id: "4",
    title: "Cleaner and Greener School",
    category: "Environment",
    description: "Add recycling stations, energy-saving campaigns, and student-led green projects. Launch a school garden initiative and plastic-free campus campaign.",
    impact: "Reduce school waste by an estimated 40%, lower energy consumption, and instill environmental responsibility as a core value.",
    icon: "Leaf",
    impactScore: 8,
  },
  {
    id: "5",
    title: "Academic Support System",
    category: "Education",
    description: "Create peer tutoring, study groups, and shared resources before exams. Establish a digital library of student-created study materials accessible to all grades.",
    impact: "Improved academic performance across all grade levels, stronger peer connections, and significantly reduced exam stress.",
    icon: "BookOpen",
    impactScore: 9,
  },
];

export const defaultGallery: GalleryImage[] = [
  {
    id: "1",
    url: "https://placehold.co/600x800/4f46e5/ffffff?text=Campaign+Launch",
    caption: "Campaign Launch Day",
    category: "Events",
  },
  {
    id: "2",
    url: "https://placehold.co/800x600/7c3aed/ffffff?text=Student+Meeting",
    caption: "Student Council Meeting",
    category: "Events",
  },
  {
    id: "3",
    url: "https://placehold.co/600x600/2563eb/ffffff?text=Study+Together",
    caption: "Academic Support Initiative",
    category: "School",
  },
  {
    id: "4",
    url: "https://placehold.co/700x500/059669/ffffff?text=Green+Project",
    caption: "School Garden Project",
    category: "Campaign",
  },
  {
    id: "5",
    url: "https://placehold.co/600x900/e11d48/ffffff?text=Poster+No.7",
    caption: "Official Campaign Poster",
    category: "Campaign",
  },
  {
    id: "6",
    url: "https://placehold.co/800x600/d97706/ffffff?text=Community+Event",
    caption: "Community Engagement Day",
    category: "Events",
  },
  {
    id: "7",
    url: "https://placehold.co/600x600/6d28d9/ffffff?text=School+Life",
    caption: "A Day in School",
    category: "School",
  },
  {
    id: "8",
    url: "https://placehold.co/700x500/0891b2/ffffff?text=Debate+Club",
    caption: "Student Debate Club",
    category: "School",
  },
  {
    id: "9",
    url: "https://placehold.co/600x800/be185d/ffffff?text=Campaign+Sticker",
    caption: "Vote No. 7 — Campaign Material",
    category: "Campaign",
  },
];

export const defaultFAQ: FAQItem[] = [
  {
    id: "1",
    question: "When is the election?",
    answer: "The student council election will be held on May 15, 2026. All students from M.1 to M.6 are eligible and encouraged to vote!",
  },
  {
    id: "2",
    question: "How do I vote?",
    answer: "Voting takes place through the school's official online voting system. You'll receive a unique voting code from your homeroom teacher on election morning. The entire process takes less than 2 minutes.",
  },
  {
    id: "3",
    question: "What does the Student Council actually do?",
    answer: "The Student Council represents all students by voicing concerns to school administration, organizing school events, managing student welfare funds, and working on projects that improve daily school life.",
  },
  {
    id: "4",
    question: "How can I support this campaign?",
    answer: "Share this website with your friends, discuss the policies with classmates, attend campaign events, and most importantly — vote on election day! Every single vote counts and makes a difference.",
  },
  {
    id: "5",
    question: "Can I submit my own ideas for policies?",
    answer: "Yes! The Feedback page is open for all students to submit problems, ideas, and suggestions. Every submission is personally reviewed and taken seriously.",
  },
  {
    id: "6",
    question: "What happens after the election?",
    answer: "The winning candidate immediately begins their term. Within the first month, they will present an action plan to the administration, form their working team, and begin implementing their top-priority policies.",
  },
  {
    id: "7",
    question: "Is voting anonymous?",
    answer: "Yes, all votes are completely anonymous. The voting system only records that you voted, not who you voted for. Your choice is private and protected.",
  },
];
