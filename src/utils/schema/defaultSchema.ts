import type { ResumeSchema } from '../../types/resume';

export const defaultResumeSchema: ResumeSchema = {
  content: {
    personalInfo: {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA'
    },
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development. Proven track record of building scalable web applications and leading development teams. Passionate about clean code, user experience, and continuous learning.',
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        startDate: '2020-01',
        endDate: '',
        current: true,
        description: [
          'Led development of core platform features serving 1M+ users',
          'Architected microservices infrastructure reducing response time by 40%',
          'Mentored junior developers and established coding standards',
          'Collaborated with product team to define technical requirements'
        ]
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: '2018-03',
        endDate: '2019-12',
        current: false,
        description: [
          'Built responsive web applications using React and Node.js',
          'Implemented CI/CD pipelines improving deployment efficiency by 60%',
          'Developed RESTful APIs handling 10K+ requests per minute',
          'Optimized database queries reducing load times by 50%'
        ]
      },
      {
        id: '3',
        company: 'Digital Agency',
        position: 'Junior Developer',
        startDate: '2016-06',
        endDate: '2018-02',
        current: false,
        description: [
          'Developed custom WordPress themes and plugins',
          'Created responsive websites for 20+ clients',
          'Collaborated with designers to implement pixel-perfect designs',
          'Maintained and updated existing client websites'
        ]
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2016-05',
        gpa: '3.8'
      }
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 
      'MongoDB', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL'
    ]
  },
  format: {
    fontFamily: 'Arial',
    fontSize: 11,
    lineHeight: 1.4,
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    pageSize: 'A4',
    sectionSpacing: 16,
    itemSpacing: 8
  }
}; 