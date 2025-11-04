import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingModules = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Modules', icon: 'Grid3X3' },
    { id: 'entry-level', label: 'Entry Level', icon: 'GraduationCap' },
    { id: 'mid-level', label: 'Mid Level', icon: 'TrendingUp' },
    { id: 'senior-level', label: 'Senior Level', icon: 'Award' },
    { id: 'executive-level', label: 'Executive Level', icon: 'Crown' },
    { id: 'role-specific', label: 'Role Specific', icon: 'Target' },
    { id: 'common-skills', label: 'Common Skills', icon: 'Users' }
  ];

  const trainingModules = [
    // ENTRY LEVEL COURSES
    {
      id: 1,
      title: "Intern: Programming & Cloud Fundamentals",
      description: "Master basics of programming, SQL, HTML/CSS, and cloud fundamentals for interns",
      category: "entry-level",
      level: "Entry Level",
      role: "Intern",
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200&fit=crop",
      modules: 8,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Sarah Chen",
      rating: 4.8,
      tags: ["Programming", "SQL", "HTML/CSS", "Cloud"],
      roleSpecificTopics: ["Basics of programming", "SQL", "HTML/CSS", "Cloud fundamentals"],
      commonTopics: ["Intro to company culture", "Communication skills", "Time management", "Basic Agile/Scrum"]
    },
    {
      id: 2,
      title: "Software Engineer: DSA & Full-Stack Development",
      description: "Comprehensive training in Data Structures, Databases, APIs, and Frontend development",
      category: "entry-level",
      level: "Entry Level",
      role: "Software Engineer",
      duration: "6 hours",
      difficulty: "Beginner",
      progress: 25,
      status: "in-progress",
      thumbnail: "https://images.pixabay.com/photo/2018/05/14/16/54/cyber-3400789_1280.jpg?w=300&h=200&fit=crop",
      modules: 12,
      completedModules: 3,
      lastAccessed: "2025-08-12",
      instructor: "Michael Rodriguez",
      rating: 4.9,
      tags: ["DSA", "Databases", "APIs", "React", "Cloud"],
      roleSpecificTopics: ["DSA", "Databases (SQL/NoSQL)", "APIs", "Frontend basics (React/JS)", "Cloud basics"],
      commonTopics: ["Git/version control", "Testing fundamentals", "Collaboration tools (Jira, Slack)", "Problem-solving mindset"]
    },
    {
      id: 3,
      title: "Senior Software Engineer: Advanced Development",
      description: "Advanced coding, microservices, CI/CD, and cloud deployment skills",
      category: "entry-level",
      level: "Entry Level",
      role: "Senior Software Engineer",
      duration: "8 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      modules: 15,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Emily Johnson",
      rating: 4.7,
      tags: ["Advanced Coding", "Microservices", "CI/CD", "Cloud Deployment", "Data Engineering"],
      roleSpecificTopics: ["Advanced coding", "Microservices", "CI/CD", "Cloud deployment", "Data Engineering basics"],
      commonTopics: ["Code reviews", "Documentation practices", "Agile ceremonies", "Peer mentoring basics"]
    },
    {
      id: 4,
      title: "Team Lead: Architecture & Leadership",
      description: "Learn architecture overview, DevOps fundamentals, and team coordination",
      category: "entry-level",
      level: "Entry Level",
      role: "Team Lead",
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop",
      modules: 10,
      completedModules: 0,
      lastAccessed: null,
      instructor: "David Park",
      rating: 4.6,
      tags: ["Architecture", "DevOps", "Team Coordination", "Leadership"],
      roleSpecificTopics: ["Architecture overview", "DevOps fundamentals", "Team coordination"],
      commonTopics: ["Leadership basics", "Conflict resolution", "Effective communication", "Task prioritization"]
    },

    // MID LEVEL COURSES
    {
      id: 5,
      title: "Product Manager: Product Lifecycle & Strategy",
      description: "Master product lifecycle, market research, and agile planning",
      category: "mid-level",
      level: "Mid Level",
      role: "Product Manager",
      duration: "6 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2633373/pexels-photo-2633373.jpeg?w=300&h=200&fit=crop",
      modules: 12,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Alex Thompson",
      rating: 4.8,
      tags: ["Product Lifecycle", "Market Research", "Agile Planning", "Strategy"],
      roleSpecificTopics: ["Product lifecycle", "Market research", "Agile planning"],
      commonTopics: ["Stakeholder communication", "Presentation skills", "Business alignment", "Decision-making"]
    },
    {
      id: 6,
      title: "Assistant Manager: Project & Risk Management",
      description: "Advanced project management, risk management, and infrastructure basics",
      category: "mid-level",
      level: "Mid Level",
      role: "Assistant Manager",
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1611224923853/80b023f02d71?w=300&h=200&fit=crop",
      modules: 10,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Lisa Wang",
      rating: 4.5,
      tags: ["Project Management", "Risk Management", "Infrastructure", "Leadership"],
      roleSpecificTopics: ["Project management", "Risk management", "Infra basics"],
      commonTopics: ["Reporting", "Team motivation", "Collaboration", "Policy awareness"]
    },
    {
      id: 7,
      title: "Deputy Manager: Advanced Management & Strategy",
      description: "Advanced project management, cross-team collaboration, and strategic thinking",
      category: "mid-level",
      level: "Mid Level",
      role: "Deputy Manager",
      duration: "7 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop",
      modules: 14,
      completedModules: 0,
      lastAccessed: null,
      instructor: "David Park",
      rating: 4.7,
      tags: ["Advanced Project Mgmt", "Cross-team Collaboration", "Strategic Thinking"],
      roleSpecificTopics: ["Advanced project mgmt", "Cross-team collaboration"],
      commonTopics: ["People management", "Change management", "Strategic thinking", "Performance reviews"]
    },
    {
      id: 8,
      title: "Manager: Strategy Execution & Leadership",
      description: "Strategy execution, cloud cost optimization, risk & compliance management",
      category: "mid-level",
      level: "Mid Level",
      role: "Manager",
      duration: "8 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      modules: 16,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Emily Johnson",
      rating: 4.9,
      tags: ["Strategy Execution", "Cloud Cost Optimization", "Risk & Compliance", "Leadership"],
      roleSpecificTopics: ["Strategy execution", "Cloud cost optimization", "Risk & compliance"],
      commonTopics: ["Leadership", "Delegation", "Resource planning", "Company policy alignment"]
    },
    {
      id: 9,
      title: "Senior Manager: End-to-End Ownership",
      description: "End-to-end ownership, data-driven decisions, and high-level leadership",
      category: "mid-level",
      level: "Mid Level",
      role: "Senior Manager",
      duration: "9 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2633373/pexels-photo-2633373.jpeg?w=300&h=200&fit=crop",
      modules: 18,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Alex Thompson",
      rating: 4.8,
      tags: ["End-to-End Ownership", "Data-driven Decisions", "High-level Leadership"],
      roleSpecificTopics: ["End-to-end ownership", "Data-driven decisions"],
      commonTopics: ["High-level reporting", "Mentorship", "Conflict management", "Vision communication"]
    },

    // SENIOR LEVEL COURSES
    {
      id: 10,
      title: "Executive Manager: Multi-team Leadership",
      description: "Multi-team leadership, high-level architecture, security & compliance",
      category: "senior-level",
      level: "Senior Level",
      role: "Executive Manager",
      duration: "10 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200&fit=crop",
      modules: 20,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Sarah Chen",
      rating: 4.9,
      tags: ["Multi-team Leadership", "High-level Architecture", "Security & Compliance"],
      roleSpecificTopics: ["Multi-team leadership", "High-level architecture", "Security & compliance"],
      commonTopics: ["Organizational leadership", "Advanced decision-making", "Innovation mindset", "Policy enforcement"]
    },
    {
      id: 11,
      title: "Director: Tech Roadmap & AI/ML Strategy",
      description: "Technology roadmap, AI/ML adoption, and enterprise data strategy",
      category: "senior-level",
      level: "Senior Level",
      role: "Director",
      duration: "12 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2018/05/14/16/54/cyber-3400789_1280.jpg?w=300&h=200&fit=crop",
      modules: 24,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Michael Rodriguez",
      rating: 4.8,
      tags: ["Tech Roadmap", "AI/ML Adoption", "Enterprise Data Strategy"],
      roleSpecificTopics: ["Tech roadmap", "AI/ML adoption", "Enterprise data strategy"],
      commonTopics: ["Strategic leadership", "Financial planning", "Risk evaluation", "Industry networking"]
    },
    {
      id: 12,
      title: "Senior Director: Global Tech Alignment",
      description: "Global tech alignment, innovation strategy, and cross-region communication",
      category: "senior-level",
      level: "Senior Level",
      role: "Senior Director",
      duration: "14 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      modules: 28,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Emily Johnson",
      rating: 4.9,
      tags: ["Global Tech Alignment", "Innovation Strategy", "Cross-region Communication"],
      roleSpecificTopics: ["Global tech alignment", "Innovation strategy"],
      commonTopics: ["Company-wide alignment", "Cross-region communication", "Negotiation skills", "Executive reporting"]
    },
    {
      id: 13,
      title: "Assistant Vice President: Vision & Policy",
      description: "Vision building, risk & policy making, and executive communication",
      category: "senior-level",
      level: "Senior Level",
      role: "Assistant Vice President",
      duration: "16 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop",
      modules: 32,
      completedModules: 0,
      lastAccessed: null,
      instructor: "David Park",
      rating: 4.7,
      tags: ["Vision Building", "Risk & Policy Making", "Executive Communication"],
      roleSpecificTopics: ["Vision building", "Risk & policy making"],
      commonTopics: ["Long-term vision", "Multi-department alignment", "Executive communication", "Crisis handling"]
    },

    // EXECUTIVE LEVEL COURSES
    {
      id: 14,
      title: "Vice President: Enterprise Strategy",
      description: "Enterprise strategy, AI/ML roadmap, cloud partnerships, and global thinking",
      category: "executive-level",
      level: "Executive Level",
      role: "Vice President",
      duration: "18 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2633373/pexels-photo-2633373.jpeg?w=300&h=200&fit=crop",
      modules: 36,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Alex Thompson",
      rating: 4.9,
      tags: ["Enterprise Strategy", "AI/ML Roadmap", "Cloud Partnerships", "Global Thinking"],
      roleSpecificTopics: ["Enterprise strategy", "AI/ML roadmap", "Cloud partnerships"],
      commonTopics: ["Business-technology alignment", "Inspiring leadership", "Global thinking", "Company culture promotion"]
    },
    {
      id: 15,
      title: "Senior Vice President: Enterprise Transformation",
      description: "Enterprise transformation, regulations, industry-wide networking",
      category: "executive-level",
      level: "Executive Level",
      role: "Senior Vice President",
      duration: "20 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1611224923853/80b023f02d71?w=300&h=200&fit=crop",
      modules: 40,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Lisa Wang",
      rating: 4.8,
      tags: ["Enterprise Transformation", "Regulations", "Industry Networking"],
      roleSpecificTopics: ["Enterprise transformation", "Regulations"],
      commonTopics: ["Industry-wide networking", "Driving change", "Long-term sustainability"]
    },
    {
      id: 16,
      title: "Executive Vice President: Innovation & Global Strategy",
      description: "Innovation & global strategy, policy frameworks, executive mentoring",
      category: "executive-level",
      level: "Executive Level",
      role: "Executive Vice President",
      duration: "22 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=300&h=200&fit=crop",
      modules: 44,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Sarah Chen",
      rating: 4.9,
      tags: ["Innovation & Global Strategy", "Policy Frameworks", "Executive Mentoring"],
      roleSpecificTopics: ["Innovation & global strategy"],
      commonTopics: ["Policy frameworks", "Mentoring executives", "Representing company externally"]
    },
    {
      id: 17,
      title: "C-Suite: Visionary Leadership & Global Strategy",
      description: "Vision & culture, global innovation, compliance, and sustainability",
      category: "executive-level",
      level: "Executive Level",
      role: "C-Suite (CIO, CTO, CFO, COO)",
      duration: "24 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2018/05/14/16/54/cyber-3400789_1280.jpg?w=300&h=200&fit=crop",
      modules: 48,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Michael Rodriguez",
      rating: 4.9,
      tags: ["Vision & Culture", "Global Innovation", "Compliance", "Sustainability"],
      roleSpecificTopics: ["Vision & culture", "Global innovation", "Compliance"],
      commonTopics: ["Visionary leadership", "Values & ethics", "Global strategy", "Sustainability", "Culture shaping"]
    },

    // COMMON SKILLS COURSES
    {
      id: 18,
      title: "Communication & Presentation Skills",
      description: "Essential communication and presentation skills for all levels",
      category: "common-skills",
      level: "All Levels",
      role: "Universal",
      duration: "3 hours",
      difficulty: "Beginner",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
      modules: 6,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Emily Johnson",
      rating: 4.7,
      tags: ["Communication", "Presentation", "Public Speaking"],
      roleSpecificTopics: [],
      commonTopics: ["Effective communication", "Presentation skills", "Public speaking", "Active listening"]
    },
    {
      id: 19,
      title: "Leadership & Team Management",
      description: "Core leadership principles and team management skills",
      category: "common-skills",
      level: "All Levels",
      role: "Universal",
      duration: "4 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=300&h=200&fit=crop",
      modules: 8,
      completedModules: 0,
      lastAccessed: null,
      instructor: "David Park",
      rating: 4.6,
      tags: ["Leadership", "Team Management", "Mentoring"],
      roleSpecificTopics: [],
      commonTopics: ["Leadership principles", "Team management", "Mentoring", "Conflict resolution"]
    },
    {
      id: 20,
      title: "Agile & Project Management",
      description: "Agile methodologies and project management fundamentals",
      category: "common-skills",
      level: "All Levels",
      role: "Universal",
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "not-started",
      thumbnail: "https://images.pixabay.com/photo/2633373/pexels-photo-2633373.jpeg?w=300&h=200&fit=crop",
      modules: 10,
      completedModules: 0,
      lastAccessed: null,
      instructor: "Alex Thompson",
      rating: 4.8,
      tags: ["Agile", "Project Management", "Scrum", "Kanban"],
      roleSpecificTopics: [],
      commonTopics: ["Agile principles", "Scrum methodology", "Project planning", "Risk management"]
    }
  ];

  // Derive dynamic progress and lockout from localStorage
  const withDynamicProgress = useMemo(() => {
    const now = Date.now();
    return trainingModules.map(m => {
      const courseId = String(m.id);
      const raw = typeof window !== 'undefined' ? localStorage.getItem(`quiz_${courseId}`) : null;
      const stepsRaw = typeof window !== 'undefined' ? localStorage.getItem(`course_steps_${courseId}`) : null;
      let dynamicProgress = m.progress;
      let status = m.status;
      try {
        if (raw) {
          const parsed = JSON.parse(raw);
          const lastPct = Number(parsed?.lastPercentage) || 0;
          const passed = Boolean(parsed?.passed);
          const lockedUntil = Number(parsed?.lockedUntil) || 0;
          const isLocked = lockedUntil && now < lockedUntil;
          if (!isNaN(lastPct)) dynamicProgress = Math.max(0, Math.min(100, Math.round(lastPct)));
          if (passed) {
            dynamicProgress = 100;
            status = 'completed';
          } else if (isLocked) {
            status = 'locked';
          } else if (dynamicProgress > 0) {
            status = 'in-progress';
          } else {
            status = 'not-started';
          }
        } else {
          // If there are step completions, compute percent from them
          if (stepsRaw) {
            try {
              const steps = JSON.parse(stepsRaw) || {};
              const total = m.modules || 0;
              const done = Object.keys(steps).length;
              if (total > 0) dynamicProgress = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
              // If everything else is done but there is no quiz pass record, cap at 99%
              if (dynamicProgress === 100) dynamicProgress = 99;
            } catch {}
          }
          // When no persisted state exists, ignore seeded progress and default to 0
          if (!stepsRaw) dynamicProgress = 0;
          status = dynamicProgress > 0 ? 'in-progress' : 'not-started';
        }
      } catch {}
      return { ...m, progress: dynamicProgress, status };
    });
  }, [trainingModules]);

  const filteredModules = useMemo(() => {
    if (selectedCategory === 'all') return withDynamicProgress;
    if (selectedCategory === 'role-specific') {
      return withDynamicProgress?.filter(module => module.roleSpecificTopics && module.roleSpecificTopics.length > 0);
    }
    if (selectedCategory === 'common-skills') {
      return withDynamicProgress?.filter(module => module.commonTopics && module.commonTopics.length > 0);
    }
    return withDynamicProgress?.filter(module => module.category === selectedCategory);
  }, [selectedCategory, withDynamicProgress]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-primary';
      case 'locked': return 'text-warning';
      case 'not-started': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10';
      case 'in-progress': return 'bg-primary/10';
      case 'locked': return 'bg-warning/10';
      case 'not-started': return 'bg-muted/50';
      default: return 'bg-muted/50';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'locked': return 'Locked';
      case 'not-started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleModuleClick = (module) => {
    navigate(`/training/${module.id}`);
  };

  const handleContinue = (module) => {
    navigate(`/training/${module.id}`);
  };

  const formatLastAccessed = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Training Modules</h2>
          <p className="text-muted-foreground">Continue your learning journey with these courses</p>
        </div>
        <Button variant="outline" iconName="Search" iconPosition="left" iconSize={16}>
          Search Modules
        </Button>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <Button
            key={category?.id}
            variant={selectedCategory === category?.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category?.id)}
            iconName={category?.icon}
            iconPosition="left"
            iconSize={14}
          >
            {category?.label}
          </Button>
        ))}
      </div>
      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules?.map((module) => (
          <div
            key={module.id}
            className="bg-card rounded-lg border border-border shadow-soft overflow-hidden hover:shadow-elevated transition-all duration-300 cursor-pointer"
            onClick={() => handleModuleClick(module)}
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={module.thumbnail}
                alt={module.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(module.status)} ${getStatusColor(module.status)}`}>
                  {getStatusLabel(module.status)}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-500"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
                <p className="text-white text-xs mt-1">{module.progress}% Complete</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm leading-tight">{module.title}</h3>
                  {module.level && module.role && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {module.level}
                      </span>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {module.role}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <span className="text-xs text-muted-foreground">{module.rating}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{module.description}</p>

              {/* Module Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Icon name="Clock" size={12} className="mr-1" />
                    {module.duration}
                  </span>
                  <span className="flex items-center">
                    <Icon name="BookOpen" size={12} className="mr-1" />
                    {module.completedModules}/{module.modules}
                  </span>
                </div>
                <span className={`text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
              </div>

              {/* Role-Specific Topics */}
              {module.roleSpecificTopics && module.roleSpecificTopics.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-foreground mb-1">Role-Specific Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.roleSpecificTopics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {module.roleSpecificTopics.length > 3 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        +{module.roleSpecificTopics.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Common Topics */}
              {module.commonTopics && module.commonTopics.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-foreground mb-1">Common Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {module.commonTopics.slice(0, 2).map((topic, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {module.commonTopics.length > 2 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{module.commonTopics.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {module.tags?.slice(0, 2)?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {tag}
                  </span>
                ))}
                {module.tags?.length > 2 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    +{module.tags?.length - 2}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <p>By {module.instructor}</p>
                  <p>Last accessed: {formatLastAccessed(module.lastAccessed)}</p>
                </div>
                
                <Button
                  variant={module.status === 'completed' ? 'outline' : 'default'}
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleContinue(module);
                  }}
                  iconName={
                    module.status === 'completed' ? 'RotateCcw' :
                    module.status === 'in-progress' ? 'Play' :
                    module.status === 'locked' ? 'Lock' : 'BookOpen'
                  }
                  iconPosition="left"
                  iconSize={14}
                  disabled={module.status === 'locked'}
                >
                  {module.status === 'completed' ? 'Review' :
                   module.status === 'in-progress' ? 'Continue' :
                   module.status === 'locked' ? 'Locked' : 'Start'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredModules?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No modules found</h3>
          <p className="text-muted-foreground">Try selecting a different category or search for specific topics.</p>
        </div>
      )}
    </div>
  );
};

export default TrainingModules;