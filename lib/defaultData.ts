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
}

export interface Policy {
  id: string;
  title: string;
  category: string;
  description: string;
  impact: string;
  icon: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email?: string;
  message: string;
  category: string;
  timestamp: string;
  isRead: boolean;
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
  bio: "A passionate student leader with a vision for a better school community. I believe every student deserves a voice, and I'm ready to be that voice for all of us. With dedication, creativity, and a genuine love for our school, I'm committed to making real, lasting change.",
  ideology: "Student-centered leadership, transparency, creativity, equality, and action.",
  mission: "To make school life more organized, enjoyable, and supportive for every student.",
  vision: "A school where every student feels heard, respected, and represented.",
  reasonForRunning: "I want to turn student problems into real solutions, not just promises. Our school deserves a representative who listens, acts, and delivers — and that's exactly what I intend to do.",
  values: ["Transparency", "Equality", "Creativity", "Action", "Empathy"],
  strengths: ["Leadership", "Communication", "Problem-solving", "Creativity", "Teamwork"],
  electionDate: "2026-05-15",
  videoUrl: "",
  videoTitle: "My Campaign Vision — Students First, Future Forward",
  videoDescription: "Watch my campaign video to learn more about my vision for our school and the changes I plan to make as your Student Council President.",
};

export const defaultPolicies: Policy[] = [
  {
    id: "1",
    title: "Better School Communication",
    category: "Technology",
    description: "Create a central online announcement hub so students never miss important updates. This system will consolidate announcements from all departments into one accessible platform available on any device.",
    impact: "Students stay informed about school events, deadlines, and announcements in real-time. Estimated 60% reduction in missed deadlines and improved school-wide communication.",
    icon: "MessageSquare",
  },
  {
    id: "2",
    title: "Mental Health Support",
    category: "Wellness",
    description: "Create anonymous suggestion and support channels for students who need help. Partner with school counselors to provide accessible mental health resources and peer support programs.",
    impact: "Students gain access to confidential support, reducing stigma around mental health and creating a safer, more caring school environment for everyone.",
    icon: "Heart",
  },
  {
    id: "3",
    title: "Student Activity Upgrade",
    category: "Culture",
    description: "Make school events more student-led, creative, and inclusive. Establish a student committee to plan and organize events that reflect diverse student interests and talents.",
    impact: "Increased student participation in school life, stronger community bonds, and events that every student actually wants to attend and be part of.",
    icon: "Star",
  },
  {
    id: "4",
    title: "Cleaner and Greener School",
    category: "Environment",
    description: "Add recycling stations, energy-saving campaigns, and student-led green projects. Launch a school garden initiative and a plastic-free campus campaign with student volunteers.",
    impact: "Reduce school waste by an estimated 40%, lower energy consumption, and instill environmental responsibility as a core school value.",
    icon: "Leaf",
  },
  {
    id: "5",
    title: "Academic Support System",
    category: "Education",
    description: "Create peer tutoring, study groups, and shared resources before exams. Establish a digital library of student-created study materials accessible to all grades.",
    impact: "Improved academic performance across all grade levels, stronger peer connections, and significantly reduced exam stress for every student.",
    icon: "BookOpen",
  },
];

export const defaultFAQ: FAQItem[] = [
  {
    id: "1",
    question: "When is the election?",
    answer: "The student council election will be held on May 15, 2026. All students are encouraged to participate and cast their vote!",
  },
  {
    id: "2",
    question: "How do I vote?",
    answer: "Voting will take place through the school's official voting system. You'll receive a voting code from your homeroom teacher on election day. The process is simple and takes less than 2 minutes.",
  },
  {
    id: "3",
    question: "What does the Student Council do?",
    answer: "The Student Council represents student interests, organizes school events, communicates student concerns to administration, and works to improve school life for every student.",
  },
  {
    id: "4",
    question: "How can I support the campaign?",
    answer: "You can support by sharing this website, talking to your friends, attending campaign events, and most importantly — voting on election day! Every vote counts.",
  },
  {
    id: "5",
    question: "Can I submit ideas for policies?",
    answer: "Absolutely! Visit the Feedback page to submit your ideas and suggestions. I personally read every submission and take each one seriously.",
  },
];
