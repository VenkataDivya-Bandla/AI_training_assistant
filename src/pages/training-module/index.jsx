import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import VideoPlayer from './components/VideoPlayer';
import Quiz from './components/Quiz';

const TRAINING_LIBRARY = {
  // ENTRY LEVEL ROLES
  '1': {
    id: '1',
    title: 'Intern: Programming & Cloud Fundamentals',
    description: 'Master basics of programming, SQL, HTML/CSS, and cloud fundamentals for interns',
    instructor: 'Sarah Chen',
    durationMinutes: 240,
    youtubeId: 'kqtD5dpn9C8',
    topics: ['Programming', 'SQL', 'HTML/CSS', 'Cloud'],
    level: 'Entry Level',
    role: 'Intern',
    roleSpecificTopics: ['Basics of programming', 'SQL', 'HTML/CSS', 'Cloud fundamentals'],
    commonTopics: ['Intro to company culture', 'Communication skills', 'Time management', 'Basic Agile/Scrum']
  },
  '2': {
    id: '2',
    title: 'Software Engineer: DSA & Full-Stack Development',
    description: 'Comprehensive training in Data Structures, Databases, APIs, and Frontend development',
    instructor: 'Michael Rodriguez',
    durationMinutes: 480,
    youtubeId: '8hly31VKya0',
    topics: ['DSA', 'Databases', 'APIs', 'React', 'Cloud'],
    level: 'Entry Level',
    role: 'Software Engineer',
    roleSpecificTopics: ['DSA', 'Databases (SQL/NoSQL)', 'APIs', 'Frontend basics (React/JS)', 'Cloud basics'],
    commonTopics: ['Git/version control', 'Testing fundamentals', 'Collaboration tools (Jira, Slack)', 'Problem-solving mindset']
  },
  '3': {
    id: '3',
    title: 'Senior Software Engineer: Advanced Development',
    description: 'Advanced coding, microservices, CI/CD, and cloud deployment skills',
    instructor: 'Emily Johnson',
    durationMinutes: 540,
    youtubeId: 'HAnw168huqA',
    topics: ['Advanced Coding', 'Microservices', 'CI/CD', 'Cloud Deployment', 'Data Engineering'],
    level: 'Entry Level',
    role: 'Senior Software Engineer',
    roleSpecificTopics: ['Advanced coding', 'Microservices', 'CI/CD', 'Cloud deployment', 'Data Engineering basics'],
    commonTopics: ['Code reviews', 'Documentation practices', 'Agile ceremonies', 'Peer mentoring basics']
  },
  '4': {
    id: '4',
    title: 'Team Lead: Architecture & Leadership',
    description: 'Learn architecture overview, DevOps fundamentals, and team coordination',
    instructor: 'David Park',
    durationMinutes: 360,
    youtubeId: '8JJ101D3knE',
    topics: ['Architecture', 'DevOps', 'Team Coordination', 'Leadership'],
    level: 'Entry Level',
    role: 'Team Lead',
    roleSpecificTopics: ['Architecture overview', 'DevOps fundamentals', 'Team coordination'],
    commonTopics: ['Leadership basics', 'Conflict resolution', 'Effective communication', 'Task prioritization']
  },

  // MID LEVEL ROLES
  '5': {
    id: '5',
    title: 'Product Manager: Product Lifecycle & Strategy',
    description: 'Master product lifecycle, market research, and agile planning',
    instructor: 'Alex Thompson',
    durationMinutes: 420,
    youtubeId: 'uR6G2v_WsRA',
    topics: ['Product Lifecycle', 'Market Research', 'Agile Planning', 'Strategy'],
    level: 'Mid Level',
    role: 'Product Manager',
    roleSpecificTopics: ['Product lifecycle', 'Market research', 'Agile planning'],
    commonTopics: ['Stakeholder communication', 'Presentation skills', 'Business alignment', 'Decision-making']
  },
  '6': {
    id: '6',
    title: 'Assistant Manager: Project & Risk Management',
    description: 'Advanced project management, risk management, and infrastructure basics',
    instructor: 'Lisa Wang',
    durationMinutes: 380,
    youtubeId: 'Uszj_k0DGsg',
    topics: ['Project Management', 'Risk Management', 'Infrastructure', 'Leadership'],
    level: 'Mid Level',
    role: 'Assistant Manager',
    roleSpecificTopics: ['Project management', 'Risk management', 'Infra basics'],
    commonTopics: ['Reporting', 'Team motivation', 'Collaboration', 'Policy awareness']
  },
  '7': {
    id: '7',
    title: 'Deputy Manager: Advanced Management & Strategy',
    description: 'Advanced project management, cross-team collaboration, and strategic thinking',
    instructor: 'David Park',
    durationMinutes: 450,
    youtubeId: 'd5kW4pI_VQw',
    topics: ['Advanced Project Mgmt', 'Cross-team Collaboration', 'Strategic Thinking'],
    level: 'Mid Level',
    role: 'Deputy Manager',
    roleSpecificTopics: ['Advanced project mgmt', 'Cross-team collaboration'],
    commonTopics: ['People management', 'Change management', 'Strategic thinking', 'Performance reviews']
  },
  '8': {
    id: '8',
    title: 'Manager: Strategy Execution & Leadership',
    description: 'Strategy execution, cloud cost optimization, risk & compliance management',
    instructor: 'Emily Johnson',
    durationMinutes: 500,
    youtubeId: 'mKxZ-3G1d3c',
    topics: ['Strategy Execution', 'Cloud Cost Optimization', 'Risk & Compliance', 'Leadership'],
    level: 'Mid Level',
    role: 'Manager',
    roleSpecificTopics: ['Strategy execution', 'Cloud cost optimization', 'Risk & compliance'],
    commonTopics: ['Leadership', 'Delegation', 'Resource planning', 'Company policy alignment']
  },
  '9': {
    id: '9',
    title: 'Senior Manager: End-to-End Ownership',
    description: 'End-to-end ownership, data-driven decisions, and high-level leadership',
    instructor: 'Alex Thompson',
    durationMinutes: 560,
    youtubeId: '1eH3pQX9m8c',
    topics: ['End-to-End Ownership', 'Data-driven Decisions', 'High-level Leadership'],
    level: 'Mid Level',
    role: 'Senior Manager',
    roleSpecificTopics: ['End-to-end ownership', 'Data-driven decisions'],
    commonTopics: ['High-level reporting', 'Mentorship', 'Conflict management', 'Vision communication']
  },

  // SENIOR LEVEL ROLES
  '10': {
    id: '10',
    title: 'Executive Manager: Multi-team Leadership',
    description: 'Multi-team leadership, high-level architecture, security & compliance',
    instructor: 'Sarah Chen',
    durationMinutes: 600,
    youtubeId: 'bXGHT9Zz2YQ',
    topics: ['Multi-team Leadership', 'High-level Architecture', 'Security & Compliance'],
    level: 'Senior Level',
    role: 'Executive Manager',
    roleSpecificTopics: ['Multi-team leadership', 'High-level architecture', 'Security & compliance'],
    commonTopics: ['Organizational leadership', 'Advanced decision-making', 'Innovation mindset', 'Policy enforcement']
  },
  '11': {
    id: '11',
    title: 'Director: Tech Roadmap & AI/ML Strategy',
    description: 'Technology roadmap development, AI/ML adoption, and enterprise data strategy',
    instructor: 'Robert Kim',
    durationMinutes: 650,
    youtubeId: 'aircAruvnKk',
    topics: ['Tech Roadmap', 'AI/ML Adoption', 'Enterprise Data Strategy'],
    level: 'Senior Level',
    role: 'Director',
    roleSpecificTopics: ['Tech roadmap', 'AI/ML adoption', 'Enterprise data strategy'],
    commonTopics: ['Strategic leadership', 'Financial planning', 'Risk evaluation', 'Industry networking']
  },
  '12': {
    id: '12',
    title: 'Senior Director: Global Tech Alignment',
    description: 'Global technology alignment, innovation strategy, and cross-region leadership',
    instructor: 'Michelle Zhang',
    durationMinutes: 680,
    youtubeId: 'qP9TOX8T-kI',
    topics: ['Global Tech Alignment', 'Innovation Strategy', 'Cross-region Leadership'],
    level: 'Senior Level',
    role: 'Senior Director',
    roleSpecificTopics: ['Global tech alignment', 'Innovation strategy'],
    commonTopics: ['Company-wide alignment', 'Cross-region communication', 'Negotiation skills', 'Executive reporting']
  },
  '13': {
    id: '13',
    title: 'Assistant Vice President: Vision & Policy',
    description: 'Vision building, risk & policy making, and executive leadership development',
    instructor: 'James Wilson',
    durationMinutes: 720,
    youtubeId: '7sDY_mwcA6c',
    topics: ['Vision Building', 'Risk & Policy Making', 'Executive Leadership'],
    level: 'Senior Level',
    role: 'Assistant Vice President',
    roleSpecificTopics: ['Vision building', 'Risk & policy making'],
    commonTopics: ['Long-term vision', 'Multi-department alignment', 'Executive communication', 'Crisis handling']
  },

  // EXECUTIVE LEVEL ROLES
  '14': {
    id: '14',
    title: 'Vice President: Enterprise Strategy',
    description: 'Enterprise strategy development, AI/ML roadmap, and cloud partnerships',
    instructor: 'Jennifer Martinez',
    durationMinutes: 780,
    youtubeId: 'GZvSYJDk-us',
    topics: ['Enterprise Strategy', 'AI/ML Roadmap', 'Cloud Partnerships'],
    level: 'Executive Level',
    role: 'Vice President',
    roleSpecificTopics: ['Enterprise strategy', 'AI/ML roadmap', 'Cloud partnerships'],
    commonTopics: ['Business-technology alignment', 'Inspiring leadership', 'Global thinking', 'Company culture promotion']
  },
  '15': {
    id: '15',
    title: 'Senior Vice President: Enterprise Transformation',
    description: 'Enterprise transformation leadership, regulatory compliance, and global innovation',
    instructor: 'Christopher Lee',
    durationMinutes: 820,
    youtubeId: 'PXi3Cj5k6oI',
    topics: ['Enterprise Transformation', 'Regulatory Compliance', 'Global Innovation'],
    level: 'Executive Level',
    role: 'Senior Vice President',
    roleSpecificTopics: ['Enterprise transformation', 'Regulations'],
    commonTopics: ['Industry-wide networking', 'Driving change', 'Long-term sustainability']
  },
  '16': {
    id: '16',
    title: 'Executive Vice President: Innovation & Global Strategy',
    description: 'Innovation leadership, global strategy development, and executive decision-making',
    instructor: 'Amanda Brown',
    durationMinutes: 860,
    youtubeId: '7S8o6qcxFhA',
    topics: ['Innovation Leadership', 'Global Strategy', 'Executive Decision-Making'],
    level: 'Executive Level',
    role: 'Executive Vice President',
    roleSpecificTopics: ['Innovation & global strategy'],
    commonTopics: ['Policy frameworks', 'Mentoring executives', 'Representing company externally']
  },
  '17': {
    id: '17',
    title: 'C-Suite: Visionary Leadership & Global Strategy',
    description: 'Visionary leadership, global strategy, sustainability, and company culture shaping',
    instructor: 'Daniel Thompson',
    durationMinutes: 900,
    youtubeId: 'yFzF6YwRT8Y',
    topics: ['Visionary Leadership', 'Global Strategy', 'Sustainability', 'Culture Shaping'],
    level: 'Executive Level',
    role: 'C-Suite',
    roleSpecificTopics: ['Vision & culture', 'Global innovation', 'Compliance'],
    commonTopics: ['Visionary leadership', 'Values & ethics', 'Global strategy', 'Sustainability', 'Culture shaping']
  }
};

const TrainingModulePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const course = useMemo(() => TRAINING_LIBRARY[params?.id] || TRAINING_LIBRARY['1'], [params?.id]);
  
  const lessons = useMemo(() => {
    // Course-specific lesson structures
    const courseLessons = {
      // ENTRY LEVEL - Technical Roles
      '1': [ // Intern
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 8 },
        { id: 'l2', type: 'video', title: 'Programming Basics - Python Fundamentals', durationMin: 25, youtubeId: 'kqtD5dpn9C8' },
        { id: 'l3', type: 'video', title: 'SQL Database Fundamentals', durationMin: 20, youtubeId: 'HXV3zeQKqGY' },
        { id: 'l4', type: 'video', title: 'HTML/CSS Web Development Basics', durationMin: 30, youtubeId: 'qz0aGYrrlhU' },
        { id: 'l5', type: 'video', title: 'Cloud Computing Fundamentals (AWS)', durationMin: 35, youtubeId: '3hLmDS179YE' },
        { id: 'l6', type: 'reading', title: 'Company Culture & Communication', durationMin: 10 },
        { id: 'l7', type: 'video', title: 'Time Management & Agile Basics', durationMin: 15, youtubeId: 'Z9QbYZh1YXY' },
        { id: 'l8', type: 'quiz', title: 'Intern Fundamentals Quiz', durationMin: 15 }
      ],
      '2': [ // Software Engineer
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Data Structures & Algorithms Basics', durationMin: 45, youtubeId: '8hly31xKli0' },
        { id: 'l3', type: 'video', title: 'SQL & NoSQL Databases', durationMin: 30, youtubeId: 'HXV3zeQKqGY' },
        { id: 'l4', type: 'video', title: 'REST APIs Development', durationMin: 25, youtubeId: '7YcW25PHnAA' },
        { id: 'l5', type: 'video', title: 'React.js Frontend Development', durationMin: 40, youtubeId: 'SqcY0GlETPk' },
        { id: 'l6', type: 'video', title: 'Cloud Computing Basics', durationMin: 20, youtubeId: '3hLmDS179YE' },
        { id: 'l7', type: 'video', title: 'Git Version Control Mastery', durationMin: 25, youtubeId: 'RGOj5yH7evk' },
        { id: 'l8', type: 'reading', title: 'Problem-Solving Mindset', durationMin: 8 },
        { id: 'l9', type: 'quiz', title: 'Software Engineer Assessment', durationMin: 20 }
      ],
      '3': [ // Senior Software Engineer
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Microservices Architecture', durationMin: 35, youtubeId: 'rv4LlmLmVWk' },
        { id: 'l3', type: 'video', title: 'CI/CD Pipeline Implementation', durationMin: 25, youtubeId: 'scEDHsr3APg' },
        { id: 'l4', type: 'video', title: 'Cloud Deployment Strategies', durationMin: 30, youtubeId: '3hLmDS179YE' },
        { id: 'l5', type: 'video', title: 'Data Engineering Basics', durationMin: 25, youtubeId: 'hf2go3E2m8g' },
        { id: 'l6', type: 'video', title: 'Code Review Best Practices', durationMin: 20, youtubeId: '1Ge__2Yx_XQ' },
        { id: 'l7', type: 'reading', title: 'Advanced Development Patterns', durationMin: 12 },
        { id: 'l8', type: 'quiz', title: 'Senior Engineer Assessment', durationMin: 25 }
      ],
      '4': [ // Team Lead
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'DevOps Fundamentals', durationMin: 25, youtubeId: 'scEDHsr3APg' },
        { id: 'l3', type: 'video', title: 'Team Coordination Strategies', durationMin: 20, youtubeId: 'Z9QbYZh1YXY' },
        { id: 'l4', type: 'video', title: 'Leadership Basics', durationMin: 25, youtubeId: 'HAnw168huqA' },
        { id: 'l5', type: 'video', title: 'Conflict Resolution', durationMin: 20, youtubeId: 'D--X9-726bk' },
        { id: 'l6', type: 'reading', title: 'Team Management Principles', durationMin: 10 },
        { id: 'l7', type: 'quiz', title: 'Team Lead Assessment', durationMin: 20 }
      ],

      // MID LEVEL - Management Roles
      '5': [ // Product Manager
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Market Research Techniques', durationMin: 25, youtubeId: 'SUIglF1nhxE' },
        { id: 'l3', type: 'video', title: 'Agile Planning & Roadmapping', durationMin: 28, youtubeId: 'PLQ-THLk434' },
        { id: 'l4', type: 'video', title: 'Stakeholder Communication', durationMin: 20, youtubeId: 'jz7tPVDwb50' },
        { id: 'l5', type: 'reading', title: 'Product Strategy Principles', durationMin: 12 },
        { id: 'l6', type: 'quiz', title: 'Product Manager Assessment', durationMin: 22 }
      ],
      '6': [ // Assistant Manager
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Risk Management Strategies', durationMin: 25, youtubeId: '4SWEX4L2dOc' },
        { id: 'l3', type: 'video', title: 'Infrastructure Basics', durationMin: 20, youtubeId: 'j9nsDCCgp00' },
        { id: 'l4', type: 'video', title: 'Team Motivation Techniques', durationMin: 20, youtubeId: 'aTa1sHBlnqk' },
        { id: 'l5', type: 'reading', title: 'Management Principles', durationMin: 10 },
        { id: 'l6', type: 'quiz', title: 'Assistant Manager Assessment', durationMin: 20 }
      ],
      '7': [ // Deputy Manager
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Cross-team Collaboration', durationMin: 28, youtubeId: 'X81kCssaU8E' },
        { id: 'l3', type: 'video', title: 'People Management', durationMin: 30, youtubeId: 'kQ2ox4ZOHnI' },
        { id: 'l4', type: 'video', title: 'Strategic Thinking', durationMin: 32, youtubeId: 'FToIOGI1SIg' },
        { id: 'l5', type: 'reading', title: 'Advanced Management Concepts', durationMin: 15 },
        { id: 'l6', type: 'quiz', title: 'Deputy Manager Assessment', durationMin: 25 }
      ],
      '8': [ // Manager
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'Cloud Cost Optimization', durationMin: 28, youtubeId: 'TfvcLUbiSz4' },
        { id: 'l3', type: 'video', title: 'Risk & Compliance Management', durationMin: 30, youtubeId: 'cXAqQ7ofdHw' },
        { id: 'l4', type: 'video', title: 'Leadership Excellence', durationMin: 32, youtubeId: 'dIYmzf21d1g' },
        { id: 'l5', type: 'reading', title: 'Strategic Leadership Principles', durationMin: 18 },
        { id: 'l6', type: 'quiz', title: 'Manager Assessment', durationMin: 30 }
      ],
      '9': [ // Senior Manager
        { id: 'l1', type: 'reading', title: 'What You\'ll Learn', durationMin: 10 },
        { id: 'l2', type: 'video', title: 'End-to-End Ownership', durationMin: 40, youtubeId: '9XOf-GUMCXk' },
        { id: 'l3', type: 'video', title: 'Data-Driven Decision Making', durationMin: 35, youtubeId: 'EevYFzAqJ2M' },
        { id: 'l4', type: 'video', title: 'Mentorship & Development', durationMin: 30, youtubeId: 'rY7r6A_J_jQ' },
        { id: 'l5', type: 'reading', title: 'Executive Leadership Principles', durationMin: 20 },
        { id: 'l6', type: 'quiz', title: 'Senior Manager Assessment', durationMin: 35 }
      ],

      // SENIOR LEVEL - Executive Roles
      '10': [ // Executive Manager
        { id: 'l1', type: 'video', title: 'Multi-team Leadership', durationMin: 45, youtubeId: '2bnP2vIef4E' },
        { id: 'l2', type: 'video', title: 'High-Level Architecture', durationMin: 40, youtubeId: 'lfzojmTCIQw' },
        { id: 'l3', type: 'video', title: 'Security & Compliance', durationMin: 35, youtubeId: 'QgxC3H-OGmM' },
        { id: 'l4', type: 'reading', title: 'Executive Leadership Framework', durationMin: 25 },
        { id: 'l5', type: 'quiz', title: 'Executive Manager Assessment', durationMin: 40 }
      ],
      '11': [ // Director
        { id: 'l1', type: 'video', title: 'Technology Roadmap Development', durationMin: 50, youtubeId: 'szmdO2tm4vU' },
        { id: 'l2', type: 'video', title: 'AI/ML Strategy & Adoption', durationMin: 45, youtubeId: 'aircAruvnKk' },
        { id: 'l3', type: 'video', title: 'Enterprise Data Strategy', durationMin: 40, youtubeId: 'ktnQb5yX93E' },
        { id: 'l4', type: 'reading', title: 'Strategic Financial Planning', durationMin: 30 },
        { id: 'l5', type: 'quiz', title: 'Director Assessment', durationMin: 45 }
      ],
      '12': [ // Senior Director
        { id: 'l1', type: 'video', title: 'Global Technology Alignment', durationMin: 55, youtubeId: 'xwYgBNdZxc8' },
        { id: 'l2', type: 'video', title: 'Innovation Strategy Development', durationMin: 50, youtubeId: '94Oof3CC9G8' },
        { id: 'l3', type: 'video', title: 'Cross-region Leadership', durationMin: 45, youtubeId: 'rOZKWXTAfIU' },
        { id: 'l4', type: 'reading', title: 'Executive Communication', durationMin: 35 },
        { id: 'l5', type: 'quiz', title: 'Senior Director Assessment', durationMin: 50 }
      ],
      '13': [ // Assistant Vice President
        { id: 'l1', type: 'video', title: 'Vision Building & Strategy', durationMin: 60, youtubeId: 'Aag3duJSlms' },
        { id: 'l2', type: 'video', title: 'Risk & Policy Making', durationMin: 55, youtubeId: 'IP-E75FGFkU' },
        { id: 'l3', type: 'video', title: 'Crisis Management', durationMin: 50, youtubeId: 'xwYoJbsvlE4' },
        { id: 'l4', type: 'reading', title: 'Multi-department Alignment', durationMin: 40 },
        { id: 'l5', type: 'quiz', title: 'AVP Assessment', durationMin: 55 }
      ],

      // EXECUTIVE LEVEL - C-Suite
      '14': [ // Vice President
        { id: 'l1', type: 'video', title: 'Enterprise Strategy Development', durationMin: 65, youtubeId: 'GZvSYJDk-us' },
        { id: 'l2', type: 'video', title: 'AI/ML Enterprise Roadmap', durationMin: 60, youtubeId: 'aircAruvnKk' },
        { id: 'l3', type: 'video', title: 'Cloud Partnerships & Strategy', durationMin: 55, youtubeId: '3hLmDS179YE' },
        { id: 'l4', type: 'reading', title: 'Global Business Alignment', durationMin: 45 },
        { id: 'l5', type: 'quiz', title: 'VP Assessment', durationMin: 60 }
      ],
      '15': [ // Senior Vice President
        { id: 'l1', type: 'video', title: 'Enterprise Transformation', durationMin: 70, youtubeId: 'PXi3Cj5k6oI' },
        { id: 'l2', type: 'video', title: 'Regulatory Compliance Strategy', durationMin: 65, youtubeId: 'bXGHT9Zz2YQ' },
        { id: 'l3', type: 'video', title: 'Global Innovation Leadership', durationMin: 60, youtubeId: '7S8o6qcxFhA' },
        { id: 'l4', type: 'reading', title: 'Long-term Sustainability', durationMin: 50 },
        { id: 'l5', type: 'quiz', title: 'SVP Assessment', durationMin: 65 }
      ],
      '16': [ // Executive Vice President
        { id: 'l1', type: 'video', title: 'Innovation Leadership', durationMin: 75, youtubeId: 'Rqzfc-fiQLo' },
        { id: 'l2', type: 'video', title: 'Global Strategy Development', durationMin: 70, youtubeId: '92wHkQv2zuM' },
        { id: 'l3', type: 'video', title: 'Executive Decision-Making', durationMin: 65, youtubeId: '6EvH0Nz8528' },
        { id: 'l4', type: 'reading', title: 'Policy Framework Development', durationMin: 55 },
        { id: 'l5', type: 'quiz', title: 'EVP Assessment', durationMin: 70 }
      ],
      '17': [ // C-Suite
        { id: 'l1', type: 'video', title: 'Visionary Leadership', durationMin: 80, youtubeId: 'yFzF6YwRT8Y' },
        { id: 'l2', type: 'video', title: 'Global Strategy Execution', durationMin: 75, youtubeId: '15DCeacHq5M' },
        { id: 'l3', type: 'video', title: 'Sustainability & Ethics', durationMin: 70, youtubeId: '9gdfQz9K6kA' },
        { id: 'l4', type: 'reading', title: 'Company Culture Shaping', durationMin: 60 },
        { id: 'l5', type: 'quiz', title: 'C-Suite Assessment', durationMin: 75 }
      ]
    };

    return courseLessons[course.id] || [
      { id: 'l1', type: 'video', title: 'Course Introduction', durationMin: 10, youtubeId: course.youtubeId || '8JJ101D3knE' },
      { id: 'l2', type: 'video', title: 'Topic Overview', durationMin: 20, youtubeId: 'uR6G2v_WsRA' },
      { id: 'l3', type: 'reading', title: 'Key Concepts Reading', durationMin: 10 },
      { id: 'l4', type: 'video', title: 'Deep Dive', durationMin: 30, youtubeId: 'Uszj_k0DGsg' },
      { id: 'l5', type: 'quiz', title: 'Module Quiz', durationMin: 15 }
    ];
  }, [course.id, course.youtubeId]);

  // ... rest of the component code remains the same ...
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = lessons[currentIndex];
  const [lessonDurations, setLessonDurations] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [readingStartTime, setReadingStartTime] = useState(null);
  const completionKey = `course_steps_${course.id}`;
  const [completedSteps, setCompletedSteps] = useState(() => {
    try { return JSON.parse(localStorage.getItem(completionKey)) || {}; } catch { return {}; }
  });
  
  const setDurationFor = (id, seconds) => setLessonDurations(prev => ({ ...prev, [id]: seconds }));
  const gotoPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const gotoNext = () => setCurrentIndex(i => Math.min(lessons.length - 1, i + 1));

  const markStepCompleted = (id) => {
    const next = { ...completedSteps, [id]: true };
    setCompletedSteps(next);
    setVideoProgress(prev => ({ ...prev, [id]: 1.0 }));
    try { localStorage.setItem(completionKey, JSON.stringify(next)); } catch {}
  };

  const handleVideoProgress = (id, progress) => {
    setVideoProgress(prev => ({ ...prev, [id]: progress }));
    if (progress >= 0.9 && !completedSteps[id]) {
      markStepCompleted(id);
    }
  };

  const handleReadingStart = () => {
    setReadingStartTime(Date.now());
  };

  const handleReadingEnd = () => {
    if (readingStartTime && currentItem.type === 'reading') {
      const timeSpent = (Date.now() - readingStartTime) / 1000 / 60;
      const requiredTime = currentItem.durationMin * 0.8;
      if (timeSpent >= requiredTime && !completedSteps[currentItem.id]) {
        markStepCompleted(currentItem.id);
      }
    }
    setReadingStartTime(null);
  };

  React.useEffect(() => {
    if (currentItem.type === 'reading') {
      handleReadingStart();
      return () => handleReadingEnd();
    }
  }, [currentItem.id, currentItem.type]);

  const overallPercent = Math.round((Object.keys(completedSteps).length / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{course?.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
              <p className="text-muted-foreground">By {course?.instructor} • ~{Math.round(course?.durationMinutes / 60)} hours</p>
                {course?.level && course?.role && (
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                      {course.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate(-1)} iconName="ArrowLeft" iconPosition="left">Back</Button>
              <Button variant="default" onClick={() => navigate('/employee-dashboard')} iconName="LayoutDashboard" iconPosition="left">Dashboard</Button>
            </div>
          </div>

          {/* ... rest of the JSX remains the same ... */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar - curriculum */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border border-border p-4 h-full">
                <div className="flex items-center mb-3">
                  <Icon name="BookOpen" size={16} className="text-primary mr-2" />
                  <h3 className="font-semibold text-foreground">Course Material</h3>
                </div>
                <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
                  {lessons.map((item, idx) => {
                    const isCompleted = completedSteps[item.id];
                    const isCurrent = idx === currentIndex;
                    return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                          isCurrent ? 'bg-primary/10 border-primary/30' : 
                          isCompleted ? 'bg-green-50 border-green-200 hover:border-green-300' : 
                          'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {isCompleted ? (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <Icon name="Check" size={10} className="text-white" />
                              </div>
                            ) : (
                              <Icon 
                                name={item.type === 'video' ? 'PlayCircle' : item.type === 'reading' ? 'Book' : 'HelpCircle'} 
                                size={14} 
                                className={isCurrent ? 'text-primary' : 'text-muted-foreground'}
                              />
                            )}
                            <span className={`text-sm ${isCompleted ? 'text-green-700 font-medium' : isCurrent ? 'text-foreground' : 'text-foreground'}`}>
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isCompleted && (
                              <span className="text-xs text-green-600 font-medium">✓</span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {Math.round((lessonDurations[item.id] || (item.durationMin * 60)) / 60)} min
                            </span>
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="mt-1">
                            <div className="w-full bg-green-200 rounded-full h-1">
                              <div className="bg-green-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                        )}
                    </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-9">
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-soft">
                {currentItem.type === 'video' && (
                  <div>
                    <VideoPlayer 
                      src={currentItem.src} 
                      youtubeId={currentItem.youtubeId} 
                      startAt={currentItem.startAt} 
                      minDurationMinutes={30} 
                      onDuration={(s) => setDurationFor(currentItem.id, s)}
                      onProgress={(progress) => handleVideoProgress(currentItem.id, progress)}
                      onManualComplete={() => markStepCompleted(currentItem.id)}
                    />
                    
                    {completedSteps[currentItem.id] && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">Video Completed</span>
                          <span className="text-sm text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full"></div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">✓ Great job! This video is marked as completed</p>
                      </div>
                    )}
                  </div>
                )}
                {currentItem.type === 'reading' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">{currentItem.title}</h2>
                      {!completedSteps[currentItem.id] && (
                        <div className="text-xs text-muted-foreground">
                          Read for {Math.round(currentItem.durationMin * 0.8)} min to complete
                        </div>
                      )}
                    </div>
                    {/* Reading content would go here */}
                    <div className="space-y-4 text-muted-foreground">
                      <p>This reading material covers essential concepts and best practices for your role and level.</p>
                      <p>Take your time to understand the material thoroughly as it forms the foundation for your professional development.</p>
                    </div>
                  </div>
                )}
                {currentItem.type === 'quiz' && (
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Icon name="ClipboardList" size={18} className="text-primary mr-2" />
                      <h3 className="text-lg font-semibold text-foreground">Module Quiz</h3>
                    </div>
                    <Quiz courseId={course?.id} currentItem={currentItem} onPass={() => markStepCompleted(currentItem.id)} />
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" onClick={gotoPrev} disabled={currentIndex === 0} iconName="ArrowLeft" iconPosition="left">Previous</Button>
                <div className="flex items-center space-x-2">
                  {completedSteps[currentItem.id] && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Icon name="CheckCircle" size={16} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                  <Button variant="default" onClick={gotoNext} disabled={currentIndex === lessons.length - 1} iconName="ArrowRight" iconPosition="right">
                    {currentIndex === lessons.length - 1 ? 'Finish Course' : 'Next Lesson'}
                  </Button>
                </div>
              </div>

              <div className="mt-6 bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-foreground">About this course</h2>
                  <div className="text-sm text-muted-foreground">Progress: <strong>{overallPercent}%</strong></div>
                </div>
                <p className="text-muted-foreground">{course?.description}</p>
                
                {/* Role-Specific Topics */}
                {course?.roleSpecificTopics && course.roleSpecificTopics.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Role-Specific Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.roleSpecificTopics.map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Topics */}
                {course?.commonTopics && course.commonTopics.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Common Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.commonTopics.map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Topics */}
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Course Tags</h3>
                  <div className="flex flex-wrap gap-2">
                  {course?.topics?.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">{t}</span>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingModulePage;