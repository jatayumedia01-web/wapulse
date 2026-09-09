import type {
  Accreditation,
  AdmissionStep,
  CalendarEvent,
  Club,
  Department,
  FAQ,
  Facility,
  Faculty,
  Leader,
  NavLink,
  NewsItem,
  PortalFeature,
  Program,
  Scholarship,
} from "./types";

export const siteConfig = {
  name: "Bright Future International School",
  shortName: "Bright Future",
  tagline: "Inspiring Minds. Shaping Futures.",
  email: "info@brightfuture.edu.in",
  phone: "+91 98765 43210",
  address: "123 Education Lane, New Delhi, India 110001",
  founded: 1998,
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Academics", href: "/academics" },
  { label: "Campus Life", href: "/campus-life" },
  { label: "News & Events", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const features = [
  {
    icon: "book",
    title: "Holistic Education",
    description: "Nurturing mind, body & character",
  },
  {
    icon: "users",
    title: "Expert Educators",
    description: "Passionate, qualified teachers",
  },
  {
    icon: "lightbulb",
    title: "Innovative Learning",
    description: "Modern methods & technology",
  },
  {
    icon: "globe",
    title: "Global Perspective",
    description: "International curriculum & culture",
  },
  {
    icon: "shield",
    title: "Safe & Supportive Campus",
    description: "A secure environment for all",
  },
];

export const aboutStats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "1500+", label: "Happy Students" },
  { value: "100+", label: "Awards Won" },
];

export const aboutCards = [
  { icon: "ratio", title: "15:1", subtitle: "Student-Teacher Ratio" },
  { icon: "clubs", title: "30+", subtitle: "Clubs & Activities" },
  { icon: "countries", title: "20+", subtitle: "Countries Represented" },
];

export const coreValues = [
  {
    title: "Excellence",
    description: "Striving for the highest standards in academics, arts, and character.",
  },
  {
    title: "Integrity",
    description: "Building honest, ethical leaders who make principled decisions.",
  },
  {
    title: "Innovation",
    description: "Embracing creative thinking and modern learning technologies.",
  },
  {
    title: "Inclusion",
    description: "Celebrating diversity and ensuring every voice is heard and valued.",
  },
];

export const timeline = [
  { year: "1998", event: "Bright Future International School founded with 120 students." },
  { year: "2005", event: "Expanded to a 50-acre campus with world-class facilities." },
  { year: "2012", event: "Received International Baccalaureate accreditation." },
  { year: "2018", event: "Crossed 1,000 enrolled students milestone." },
  { year: "2024", event: "Ranked among India's top 10 international schools." },
];

export const leadership: Leader[] = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Principal",
    bio: "PhD in Educational Leadership with 20+ years shaping academic excellence across India and abroad.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop",
  },
  {
    name: "Mrs. Ananya Desai",
    role: "Vice Principal — Academics",
    bio: "Former Cambridge examiner specializing in curriculum design and teacher development programs.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
  },
  {
    name: "Mr. David Chen",
    role: "Director of Student Life",
    bio: "Passionate about holistic development, sports, and building inclusive campus communities.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
  },
];

export const programs: Program[] = [
  {
    slug: "early-years",
    title: "Early Years",
    description: "Play-based learning for curious young minds.",
    grades: "Ages 3–5",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&h=700&fit=crop",
    overview:
      "Our Early Years program nurtures natural curiosity through sensory play, storytelling, and guided exploration in a warm, safe environment designed for young learners.",
    highlights: [
      "Reggio-inspired learning spaces",
      "Bilingual language exposure",
      "Outdoor nature exploration",
      "Social-emotional development focus",
    ],
    curriculum: [
      "Language & Literacy Foundations",
      "Numeracy Through Play",
      "Creative Arts & Music",
      "Physical Development & Motor Skills",
      "Social Skills & Emotional Intelligence",
    ],
    outcomes: [
      "Confident communication skills",
      "School readiness across core areas",
      "Curiosity-driven learning habits",
      "Strong peer relationships",
    ],
    dayInLife: [
      "8:30 AM — Morning circle & mindfulness",
      "9:00 AM — Play-based literacy activities",
      "10:30 AM — Outdoor nature exploration",
      "12:00 PM — Lunch & social skills practice",
      "1:30 PM — Creative arts & music",
      "3:00 PM — Story time & dismissal",
    ],
    facultyLead: "Ms. Emma Richardson, Early Years Coordinator",
    relatedSlugs: ["primary-school"],
  },
  {
    slug: "primary-school",
    title: "Primary School",
    description: "Building strong foundations in core subjects.",
    grades: "Grades 1–5",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1600&h=700&fit=crop",
    overview:
      "Primary years focus on building literacy, numeracy, and critical thinking through inquiry-based learning aligned with international standards.",
    highlights: [
      "Cambridge Primary framework",
      "STEM discovery labs",
      "Reading & writing workshops",
      "Character education program",
    ],
    curriculum: [
      "English Language Arts",
      "Mathematics & Logic",
      "Science & Environmental Studies",
      "Social Studies & Global Awareness",
      "Art, Music & Physical Education",
    ],
    outcomes: [
      "Strong academic foundations",
      "Independent learning skills",
      "Digital literacy basics",
      "Leadership through house system",
    ],
    dayInLife: [
      "8:00 AM — Assembly & house meetings",
      "8:30 AM — Core subjects (Math, English, Science)",
      "11:00 AM — STEM discovery lab session",
      "12:30 PM — Lunch & playground",
      "1:30 PM — Arts, PE & library rotation",
      "3:30 PM — Homework club & dismissal",
    ],
    facultyLead: "Mr. James Okafor, Primary School Head",
    relatedSlugs: ["early-years", "middle-school"],
  },
  {
    slug: "middle-school",
    title: "Middle School",
    description: "Developing critical thinking & independence.",
    grades: "Grades 6–8",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=700&fit=crop",
    overview:
      "Middle school bridges foundational learning with advanced concepts, encouraging students to think critically, collaborate, and discover their passions.",
    highlights: [
      "Project-based learning",
      "Debate & public speaking",
      "Coding & robotics electives",
      "Personalized academic mentoring",
    ],
    curriculum: [
      "Advanced Mathematics",
      "Integrated Sciences",
      "World History & Geography",
      "Literature & Creative Writing",
      "Technology & Design Thinking",
    ],
    outcomes: [
      "Analytical problem-solving",
      "Research & presentation skills",
      "Career interest exploration",
      "Resilience and self-management",
    ],
    dayInLife: [
      "8:00 AM — Advisory period & goal setting",
      "8:45 AM — Block scheduling (Sciences/Humanities)",
      "11:00 AM — Electives: Coding, Debate, or Arts",
      "12:30 PM — Lunch & club meetings",
      "1:30 PM — Project-based learning labs",
      "3:45 PM — Sports practice & study hall",
    ],
    facultyLead: "Dr. Priya Nair, Middle School Director",
    relatedSlugs: ["primary-school", "high-school"],
  },
  {
    slug: "high-school",
    title: "High School",
    description: "Preparing students for university & beyond.",
    grades: "Grades 9–12",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=700&fit=crop",
    overview:
      "Our rigorous high school program prepares students for top universities worldwide with AP courses, career counseling, and leadership opportunities.",
    highlights: [
      "IB & AP course offerings",
      "University placement support",
      "Internship partnerships",
      "Model UN & leadership council",
    ],
    curriculum: [
      "Advanced Placement Sciences",
      "Economics & Business Studies",
      "Humanities & Philosophy",
      "Research Methods & Capstone",
      "College Readiness & SAT Prep",
    ],
    outcomes: [
      "98% university acceptance rate",
      "Scholarship achievements",
      "Global citizenship mindset",
      "Industry-ready soft skills",
    ],
    dayInLife: [
      "8:00 AM — AP/IB seminar sessions",
      "9:30 AM — Advanced coursework",
      "11:30 AM — University counseling workshops",
      "12:30 PM — Leadership council meetings",
      "2:00 PM — Research & capstone projects",
      "4:00 PM — Internship & community service",
    ],
    facultyLead: "Prof. Michael Torres, High School Principal",
    relatedSlugs: ["middle-school", "co-curricular"],
  },
  {
    slug: "co-curricular",
    title: "Co-Curricular",
    description: "Sports, arts, music & leadership programs.",
    grades: "All Grades",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1600&h=700&fit=crop",
    overview:
      "Beyond academics, our co-curricular program develops well-rounded individuals through sports, performing arts, community service, and leadership.",
    highlights: [
      "30+ clubs and societies",
      "Inter-school competitions",
      "Community service initiatives",
      "Annual cultural festival",
    ],
    curriculum: [
      "Sports & Athletics Programs",
      "Visual & Performing Arts",
      "Music & Orchestra",
      "Community Service Learning",
      "Student Leadership Training",
    ],
    outcomes: [
      "Teamwork and discipline",
      "Creative self-expression",
      "Social responsibility",
      "Balanced personal growth",
    ],
    dayInLife: [
      "3:30 PM — Sports team training sessions",
      "4:30 PM — Club & society meetings",
      "5:30 PM — Music, dance & drama rehearsals",
      "6:30 PM — Community service projects",
      "Weekends — Inter-school competitions & festivals",
    ],
    facultyLead: "Mr. David Chen, Director of Student Life",
    relatedSlugs: ["high-school"],
  },
];

export const stats = [
  { value: "25+", label: "Years of Excellence", icon: "award" },
  { value: "1500+", label: "Students Enrolled", icon: "users" },
  { value: "120+", label: "Qualified Teachers", icon: "graduation" },
  { value: "100+", label: "Awards Won", icon: "trophy" },
  { value: "98%", label: "University Acceptance", icon: "chart" },
];

export const facilities: Facility[] = [
  {
    title: "Modern Classrooms",
    description: "Smart boards, science labs & digital learning tools.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=500&fit=crop",
    features: ["Interactive smart boards", "STEM & robotics labs", "1:1 device program", "Maker spaces"],
  },
  {
    title: "Sports & Athletics",
    description: "Olympic-size pool, football fields & indoor courts.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8121?w=800&h=500&fit=crop",
    features: ["Olympic swimming pool", "Football & cricket grounds", "Indoor basketball courts", "Athletics track"],
  },
  {
    title: "Arts & Culture",
    description: "Music rooms, art studios & annual performances.",
    image: "https://images.unsplash.com/photo-1514320291840-755a4152e9ed?w=800&h=500&fit=crop",
    features: ["500-seat auditorium", "Recording studio", "Art & sculpture studios", "Dance & drama rooms"],
  },
  {
    title: "Library & Research",
    description: "A knowledge hub with 50,000+ books and digital archives.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop",
    features: ["50,000+ book collection", "Digital research databases", "Quiet study zones", "Reading gardens"],
  },
  {
    title: "Health & Wellness",
    description: "On-campus medical center and counseling services.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
    features: ["24/7 medical staff", "Counseling center", "Nutrition programs", "Mindfulness workshops"],
  },
  {
    title: "Boarding Facilities",
    description: "Safe, comfortable residential halls with 24/7 supervision.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=500&fit=crop",
    features: ["Separate boys & girls wings", "Nutritious meal plans", "Study halls & recreation", "House parent support"],
  },
];

export const clubs: Club[] = [
  { name: "Robotics Club", category: "STEM", description: "Build and compete with custom robots in national championships." },
  { name: "Model United Nations", category: "Leadership", description: "Debate global issues and develop diplomatic skills." },
  { name: "Photography Society", category: "Arts", description: "Capture campus life and exhibit work in annual showcases." },
  { name: "Eco Warriors", category: "Service", description: "Lead sustainability projects and environmental awareness drives." },
  { name: "Chess Academy", category: "Academics", description: "Strategic thinking through competitive chess tournaments." },
  { name: "Drama & Theatre", category: "Arts", description: "Perform in school productions and inter-school festivals." },
  { name: "Basketball Team", category: "Sports", description: "Train with professional coaches and compete regionally." },
  { name: "Coding Club", category: "STEM", description: "Learn Python, web development, and app building." },
  { name: "Literary Society", category: "Academics", description: "Creative writing, poetry slams, and published school magazine." },
  { name: "Football Academy", category: "Sports", description: "Professional coaching for inter-school football leagues." },
  { name: "Science Olympiad", category: "STEM", description: "Prepare for national and international science competitions." },
  { name: "Debate Club", category: "Leadership", description: "Weekly debates on current affairs and global issues." },
  { name: "Art & Design Studio", category: "Arts", description: "Painting, sculpture, digital art, and annual exhibitions." },
  { name: "Music Orchestra", category: "Arts", description: "Classical and contemporary music performances year-round." },
  { name: "Community Service Club", category: "Service", description: "Volunteer programs supporting local NGOs and charities." },
  { name: "Swimming Team", category: "Sports", description: "Olympic pool training with certified coaches." },
  { name: "Entrepreneurship Club", category: "Leadership", description: "Startup ideas, business plans, and pitch competitions." },
  { name: "Astronomy Club", category: "STEM", description: "Stargazing nights and space science exploration." },
  { name: "Yoga & Wellness", category: "Sports", description: "Mindfulness, yoga, and holistic wellness practices." },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1427504494784-3a9ca7044f45?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=450&fit=crop",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=450&fit=crop",
];

export const testimonials = [
  {
    quote: "Bright Future has transformed our daughter's confidence. The teachers truly care about every child's growth.",
    name: "Priya Sharma",
    role: "Parent of Grade 8 Student",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
  },
  {
    quote: "The international curriculum and diverse community prepared me perfectly for university abroad.",
    name: "Arjun Mehta",
    role: "Class of 2024 Alumni",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
  },
  {
    quote: "As an educator, I'm impressed by the school's commitment to innovation and student wellbeing.",
    name: "Dr. Sarah Williams",
    role: "Visiting Academic Advisor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  },
];

export const newsEvents: NewsItem[] = [
  {
    slug: "science-innovation-fair-2026",
    date: "Mar 15, 2026",
    category: "Event",
    title: "Annual Science & Innovation Fair 2026",
    excerpt: "Students showcase groundbreaking projects in robotics, biology & sustainable energy.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop",
    author: "Science Department",
    readTime: "5 min read",
    tags: ["STEM", "Innovation", "Student Projects"],
    content: [
      "Bright Future International School is proud to announce the Annual Science & Innovation Fair 2026, our flagship event celebrating student creativity and scientific inquiry.",
      "This year's fair features over 120 student projects spanning robotics, biotechnology, sustainable energy, and environmental science. Visitors can explore interactive demonstrations, attend student-led presentations, and meet our young innovators.",
      "Highlights include a robotics battle arena, a sustainable city model exhibition, and live chemistry demonstrations by Grade 11 students. Industry partners from leading tech companies will serve as guest judges.",
      "The event will be held in the Main Auditorium and STEM Complex on March 15, 2026, from 9:00 AM to 4:00 PM. Parents, alumni, and prospective families are warmly invited to attend.",
      "Registration is free via our admissions office or online contact form. Prize categories include Best Innovation, Sustainability Award, and People's Choice. We look forward to celebrating the brilliant minds shaping tomorrow.",
    ],
  },
  {
    slug: "debate-championship-winners",
    date: "Mar 22, 2026",
    category: "Achievement",
    title: "International Debate Championship Winners",
    excerpt: "Our debate team secured first place at the regional inter-school competition.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop",
    author: "Communications Team",
    readTime: "4 min read",
    tags: ["Debate", "Achievement", "Competition"],
    content: [
      "Congratulations to the Bright Future Debate Team for winning first place at the Regional Inter-School Debate Championship held in Mumbai last weekend.",
      "Team members Aisha Patel, Rohan Gupta, and Meera Singh debated topics ranging from climate policy to digital ethics, impressing judges with their research depth and eloquence.",
      "This victory marks our school's third consecutive year of debate excellence and qualifies the team for the National Finals in April 2026.",
      "Coach Mrs. Kavitha Nair praised the team's dedication: 'Their preparation and teamwork exemplify the values we instill in every Bright Future student.'",
    ],
  },
  {
    slug: "open-house-campus-tour",
    date: "Apr 5, 2026",
    category: "Event",
    title: "Open House & Campus Tour Day",
    excerpt: "Prospective families are invited to explore our campus and meet our faculty.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=450&fit=crop",
    author: "Admissions Office",
    readTime: "3 min read",
    tags: ["Admissions", "Campus Tour", "Open House"],
    content: [
      "Join us for Open House & Campus Tour Day on April 5, 2026 — the perfect opportunity for prospective families to experience Bright Future firsthand.",
      "Guided tours will cover our classrooms, science labs, sports facilities, library, and boarding halls. Meet principals, teachers, and current students who will share their experiences.",
      "Information sessions on admissions, curriculum, fees, and scholarships will run throughout the day from 10:00 AM to 3:00 PM.",
      "RSVP is recommended but walk-ins are welcome. Register online or call our admissions office to reserve your spot.",
    ],
  },
  {
    slug: "new-stem-laboratory",
    date: "Feb 28, 2026",
    category: "News",
    title: "New STEM Laboratory Opens on Campus",
    excerpt: "State-of-the-art lab equipped with 3D printers, VR headsets, and robotics kits.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop",
    author: "Principal's Office",
    readTime: "4 min read",
    tags: ["STEM", "Infrastructure", "Technology"],
    content: [
      "Bright Future International School has inaugurated a new state-of-the-art STEM Laboratory, furthering our commitment to innovation-driven education.",
      "The facility features 3D printers, virtual reality headsets, advanced robotics kits, and collaborative workstations designed for hands-on learning across all grade levels.",
      "Students will engage in project-based learning modules covering coding, engineering design, data science, and artificial intelligence fundamentals.",
      "The lab was funded through our Education Excellence Fund and will serve as a hub for inter-school STEM competitions and community workshops.",
    ],
  },
  {
    slug: "annual-cultural-festival",
    date: "Jan 20, 2026",
    category: "Event",
    title: "Annual Cultural Festival — Rang De Bright Future",
    excerpt: "Three days of music, dance, drama, and art celebrating our diverse community.",
    image: "https://images.unsplash.com/photo-1514320291840-755a4152e9ed?w=800&h=450&fit=crop",
    author: "Arts Department",
    readTime: "4 min read",
    tags: ["Arts", "Culture", "Festival"],
    content: [
      "Bright Future's Annual Cultural Festival 'Rang De Bright Future' returns this January with three spectacular days of performances, exhibitions, and celebrations.",
      "Over 500 students will participate in music concerts, classical and contemporary dance performances, drama productions, and a grand art exhibition featuring works from all grade levels.",
      "The festival opens with an international food fair representing cuisines from our 20+ nationalities, followed by evening performances in our 500-seat auditorium.",
      "Parents and community members are invited to attend. Tickets are available at the school office or through the parent portal.",
    ],
  },
  {
    slug: "university-placement-results-2025",
    date: "Dec 15, 2025",
    category: "Achievement",
    title: "Class of 2025 — Outstanding University Placements",
    excerpt: "98% acceptance rate with students admitted to top universities worldwide.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=450&fit=crop",
    author: "Career Counseling Office",
    readTime: "5 min read",
    tags: ["University", "Placements", "Alumni"],
    content: [
      "The Class of 2025 has achieved remarkable university placement results, with 98% of graduates accepted to their first or second choice institutions.",
      "Students received offers from prestigious universities including Oxford, MIT, University of Toronto, NUS Singapore, and IIT Delhi across diverse fields.",
      "Over ₹2.5 crore in cumulative scholarships was awarded to our graduates, reflecting both academic excellence and the strength of our counseling program.",
      "Our dedicated career counseling team provides personalized guidance from Grade 9 onwards, including SAT/ACT prep, essay workshops, and mock interviews.",
    ],
  },
];

export const admissionSteps: AdmissionStep[] = [
  { step: 1, title: "Submit Inquiry", description: "Fill out the online inquiry form or visit our admissions office." },
  { step: 2, title: "Campus Tour", description: "Schedule a personalized tour and meet our faculty and students." },
  { step: 3, title: "Application", description: "Complete the application form with required documents and references." },
  { step: 4, title: "Assessment", description: "Student assessment and parent interview with the admissions team." },
  { step: 5, title: "Enrollment", description: "Receive offer letter, pay fees, and complete enrollment formalities." },
];

export const feeStructure = [
  { grade: "Early Years (Ages 3–5)", tuition: "₹2,50,000", registration: "₹25,000" },
  { grade: "Primary (Grades 1–5)", tuition: "₹3,20,000", registration: "₹30,000" },
  { grade: "Middle (Grades 6–8)", tuition: "₹3,80,000", registration: "₹35,000" },
  { grade: "High School (Grades 9–12)", tuition: "₹4,50,000", registration: "₹40,000" },
];

export const admissionFAQs: FAQ[] = [
  {
    question: "What is the age requirement for Early Years admission?",
    answer: "Children must be 3 years old by March 31 of the admission year for Nursery, and 4 years for Kindergarten.",
  },
  {
    question: "Is financial aid or scholarship available?",
    answer: "Yes, we offer merit-based scholarships and need-based financial aid covering up to 50% of tuition fees.",
  },
  {
    question: "What documents are required for application?",
    answer: "Birth certificate, previous school records, passport-size photos, address proof, and parent ID are required.",
  },
  {
    question: "Do you offer boarding facilities?",
    answer: "Yes, we have separate boarding wings for boys and girls from Grade 6 onwards with 24/7 supervision.",
  },
  {
    question: "When does the academic year begin?",
    answer: "The academic year begins in April and runs through March, aligned with the Indian academic calendar.",
  },
];

export const accreditations: Accreditation[] = [
  { name: "International Baccalaureate (IB)", year: "2012", description: "Authorized IB World School offering PYP, MYP, and DP programmes." },
  { name: "Cambridge Assessment", year: "2008", description: "Registered Cambridge International School for Primary and IGCSE." },
  { name: "Council of International Schools", year: "2016", description: "Accredited member meeting global standards for international education." },
  { name: "NAAC A+ Grade", year: "2020", description: "National Assessment and Accreditation Council highest rating." },
];

export const facultyMembers: Faculty[] = [
  { name: "Dr. Meera Iyer", department: "Sciences", qualification: "PhD Chemistry, IIT Delhi", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b461f?w=200&h=200&fit=crop" },
  { name: "Mr. Thomas Wright", department: "Mathematics", qualification: "MSc Mathematics, Cambridge", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" },
  { name: "Ms. Lisa Chang", department: "English & Humanities", qualification: "MA English Literature, Oxford", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" },
  { name: "Mr. Ahmed Hassan", department: "Physical Education", qualification: "MPEd, Sports Science", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
  { name: "Mrs. Sunita Rao", department: "Visual Arts", qualification: "MFA Fine Arts, JJ School", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop" },
  { name: "Dr. Kevin O'Brien", department: "Computer Science", qualification: "PhD CS, Stanford", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop" },
];

export const scholarships: Scholarship[] = [
  { name: "Academic Excellence Scholarship", coverage: "Up to 50% tuition", criteria: "Top 5% in entrance assessment & previous academic records", deadline: "Feb 15, 2026" },
  { name: "Sports Talent Scholarship", coverage: "Up to 40% tuition", criteria: "National/state level sports achievements with trial assessment", deadline: "Feb 28, 2026" },
  { name: "Arts & Culture Scholarship", coverage: "Up to 30% tuition", criteria: "Portfolio review in music, dance, visual arts, or drama", deadline: "Mar 1, 2026" },
  { name: "Need-Based Financial Aid", coverage: "Up to 50% tuition", criteria: "Demonstrated financial need with supporting documentation", deadline: "Mar 15, 2026" },
];

export const requiredDocuments = [
  "Completed application form",
  "Birth certificate (original + copy)",
  "Previous 2 years academic records / report cards",
  "Transfer certificate (if applicable)",
  "Passport-size photographs (4 copies)",
  "Address proof (Aadhar / utility bill)",
  "Parent/Guardian ID proof",
  "Medical fitness certificate",
  "Immunization records",
];

export const calendarEvents: CalendarEvent[] = [
  { date: "Apr 10, 2026", title: "Academic Year Begins", type: "Academic", description: "Welcome back! New session starts for all grades." },
  { date: "Apr 5, 2026", title: "Open House & Campus Tour", type: "Event", description: "Prospective families invited for campus tours and info sessions." },
  { date: "Mar 15, 2026", title: "Science & Innovation Fair", type: "Event", description: "Annual student science exhibition and competition." },
  { date: "Mar 22, 2026", title: "Debate Championship Finals", type: "Event", description: "Regional debate team competes at national level." },
  { date: "May 1, 2026", title: "Labour Day Holiday", type: "Holiday", description: "School closed. Boarding students may go home." },
  { date: "May 15–30, 2026", title: "Mid-Term Examinations", type: "Exam", description: "Assessments for Grades 1–12." },
  { date: "Jun 21, 2026", title: "International Yoga Day", type: "Event", description: "Special wellness sessions and yoga workshops." },
  { date: "Jul 15, 2026", title: "Annual Sports Day", type: "Event", description: "Inter-house athletics, swimming, and team sports." },
  { date: "Aug 15, 2026", title: "Independence Day Celebration", type: "Event", description: "Flag hoisting, cultural performances, and parade." },
  { date: "Oct 2–12, 2026", title: "Dussehra & Gandhi Jayanti Break", type: "Holiday", description: "Autumn break for all students." },
  { date: "Nov 14, 2026", title: "Children's Day Festival", type: "Event", description: "Fun activities, games, and student performances." },
  { date: "Dec 20–Jan 5, 2027", title: "Winter Break", type: "Holiday", description: "School closed for winter holidays." },
];

export const departments: Department[] = [
  { name: "Admissions Office", email: "admissions@brightfuture.edu.in", phone: "+91 98765 43211", hours: "Mon–Sat: 9 AM – 5 PM" },
  { name: "Administration", email: "admin@brightfuture.edu.in", phone: "+91 98765 43212", hours: "Mon–Sat: 8 AM – 4 PM" },
  { name: "Accounts & Fees", email: "accounts@brightfuture.edu.in", phone: "+91 98765 43213", hours: "Mon–Fri: 9 AM – 3 PM" },
  { name: "IT Support", email: "it@brightfuture.edu.in", phone: "+91 98765 43214", hours: "Mon–Sat: 8 AM – 6 PM" },
];

export const parentPortalFeatures: PortalFeature[] = [
  { icon: "grades", title: "Academic Progress", description: "View report cards, grades, and teacher feedback in real time." },
  { icon: "attendance", title: "Attendance Tracking", description: "Monitor daily attendance and receive absence notifications." },
  { icon: "fees", title: "Fee Payments", description: "Pay tuition online, view invoices, and download receipts." },
  { icon: "messages", title: "School Communications", description: "Receive announcements, newsletters, and direct teacher messages." },
];

export const studentPortalFeatures: PortalFeature[] = [
  { icon: "assignments", title: "Assignments & Homework", description: "Submit work, track deadlines, and view graded feedback." },
  { icon: "timetable", title: "Class Timetable", description: "Daily schedule, room changes, and substitute teacher updates." },
  { icon: "library", title: "Library Resources", description: "Search catalog, reserve books, and access digital resources." },
  { icon: "events", title: "Events & Activities", description: "Club schedules, sports fixtures, and school event calendar." },
];

export const sportsTeams = [
  { name: "Football", level: "U12, U15, U18", achievements: "Regional Champions 2025" },
  { name: "Basketball", level: "U14, U16, U18", achievements: "State Runners-up 2025" },
  { name: "Swimming", level: "All ages", achievements: "12 national-level swimmers" },
  { name: "Cricket", level: "U13, U16, U19", achievements: "Inter-school league winners" },
  { name: "Athletics", level: "Track & Field", achievements: "5 district records held" },
  { name: "Tennis", level: "Singles & Doubles", achievements: "National junior tournament participants" },
];

export const privacySections = [
  { title: "Information We Collect", content: "We collect personal information including student names, parent contact details, academic records, and health information necessary for educational services. This data is collected through application forms, portal registrations, and direct communications." },
  { title: "How We Use Your Data", content: "Your information is used solely for educational purposes: enrollment processing, academic record keeping, communication with parents, fee management, and compliance with regulatory requirements. We never sell personal data to third parties." },
  { title: "Data Security", content: "We implement industry-standard security measures including encrypted databases, secure portal authentication, and restricted staff access. Regular security audits ensure your data remains protected." },
  { title: "Your Rights", content: "Parents and guardians may request access to, correction of, or deletion of their child's personal data by contacting our administration office. Requests are processed within 15 business days." },
  { title: "Contact for Privacy Concerns", content: "For privacy-related inquiries, email privacy@brightfuture.edu.in or write to our Data Protection Officer at the school address." },
];

export const footerLinks = {
  quick: [
    { label: "About Us", href: "/about" },
    { label: "Admissions", href: "/admissions" },
    { label: "Academics", href: "/academics" },
    { label: "Campus Life", href: "/campus-life" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Parent Portal", href: "/portal/parent" },
    { label: "Student Login", href: "/portal/student" },
    { label: "School Calendar", href: "/calendar" },
    { label: "Fee Structure", href: "/admissions#fees" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return newsEvents.find((n) => n.slug === slug);
}
