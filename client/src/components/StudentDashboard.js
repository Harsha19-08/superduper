import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssignments } from '../context/AssignmentContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';
import StudentProfile from './StudentProfile';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function StudentDashboard() {
  const { user, logout } = useAuth();
  const { assignments, pendingAssignments, completedAssignments } = useAssignments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data
  const courses = [
    {
      id: 1,
      name: 'Mathematics 101',
      instructor: 'Dr. Smith',
      progress: 75,
      units: [
        {
          id: 1,
          name: 'Unit 1: Introduction to Calculus',
          materials: [
            {
              id: 1,
              title: 'Limits and Continuity',
              type: 'pdf',
              size: '2.5 MB',
              url: '/materials/math101/unit1/limits.pdf'
            },
            {
              id: 2,
              title: 'Differentiation Basics',
              type: 'doc',
              size: '1.8 MB',
              url: '/materials/math101/unit1/differentiation.doc'
            }
          ]
        },
        {
          id: 2,
          name: 'Unit 2: Integration',
          materials: [
            {
              id: 3,
              title: 'Integration Techniques',
              type: 'pdf',
              size: '3.2 MB',
              url: '/materials/math101/unit2/integration.pdf'
            },
            {
              id: 4,
              title: 'Practice Problems',
              type: 'pdf',
              size: '1.5 MB',
              url: '/materials/math101/unit2/practice.pdf'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Physics 101',
      instructor: 'Prof. Johnson',
      progress: 60,
      units: [
        {
          id: 1,
          name: 'Unit 1: Mechanics',
          materials: [
            {
              id: 1,
              title: 'Newton\'s Laws',
              type: 'pdf',
              size: '2.8 MB',
              url: '/materials/physics101/unit1/newton.pdf'
            },
            {
              id: 2,
              title: 'Motion and Forces',
              type: 'doc',
              size: '2.1 MB',
              url: '/materials/physics101/unit1/motion.doc'
            }
          ]
        },
        {
          id: 2,
          name: 'Unit 2: Thermodynamics',
          materials: [
            {
              id: 3,
              title: 'Laws of Thermodynamics',
              type: 'pdf',
              size: '3.5 MB',
              url: '/materials/physics101/unit2/thermo.pdf'
            },
            {
              id: 4,
              title: 'Heat Transfer',
              type: 'pdf',
              size: '2.2 MB',
              url: '/materials/physics101/unit2/heat.pdf'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Computer Science 101',
      instructor: 'Prof. Williams',
      progress: 85,
      units: [
        {
          id: 1,
          name: 'Unit 1: Introduction to Programming',
          materials: [
            {
              id: 1,
              title: 'Variables and Data Types',
              type: 'pdf',
              size: '2.5 MB',
              url: '/materials/cs101/unit1/variables.pdf'
            },
            {
              id: 2,
              title: 'Control Structures',
              type: 'doc',
              size: '1.8 MB',
              url: '/materials/cs101/unit1/control.doc'
            }
          ]
        },
        {
          id: 2,
          name: 'Unit 2: Functions and Modules',
          materials: [
            {
              id: 3,
              title: 'Functions',
              type: 'pdf',
              size: '3.2 MB',
              url: '/materials/cs101/unit2/functions.pdf'
            },
            {
              id: 4,
              title: 'Modules',
              type: 'pdf',
              size: '1.5 MB',
              url: '/materials/cs101/unit2/modules.pdf'
            }
          ]
        }
      ]
    }
  ];

  // Update analytics data with real assignment data
  const analyticsData = {
    overallProgress: Math.round((completedAssignments.length / (assignments.length || 1)) * 100),
    totalAssignments: assignments.length,
    completedAssignments: completedAssignments.length,
    pendingAssignments: pendingAssignments.length,
    courseGrades: {
      'Mathematics 101': calculateCourseGrade('Mathematics 101'),
      'Physics 101': calculateCourseGrade('Physics 101'),
      'Computer Science 101': calculateCourseGrade('Computer Science 101')
    },
    weeklyProgress: calculateWeeklyProgress(),
    assignmentTypes: {
      Completed: completedAssignments.length,
      Pending: pendingAssignments.length,
      Upcoming: assignments.filter(a => new Date(a.dueDate) > new Date()).length
    }
  };

  function calculateCourseGrade(courseName) {
    const courseAssignments = assignments.filter(a => a.course === courseName && a.status === 'completed');
    if (courseAssignments.length === 0) return 0;
    
    const totalScore = courseAssignments.reduce((sum, a) => sum + (a.score || 0), 0);
    const totalPossible = courseAssignments.reduce((sum, a) => sum + (a.maxMarks || 0), 0);
    return Math.round((totalScore / totalPossible) * 100);
  }

  function calculateWeeklyProgress() {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const weeklyData = weeks.map((week, index) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - ((3 - index) * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekAssignments = assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        return dueDate >= weekStart && dueDate < weekEnd;
      });

      if (weekAssignments.length === 0) return 0;
      const completed = weekAssignments.filter(a => a.status === 'completed').length;
      return Math.round((completed / weekAssignments.length) * 100);
    });

    return {
      labels: weeks,
      data: weeklyData
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff'
        }
      }
    }
  };

  const gradeChartData = {
    labels: Object.keys(analyticsData.courseGrades),
    datasets: [
      {
        label: 'Course Grades',
        data: Object.values(analyticsData.courseGrades),
        backgroundColor: [
          'rgba(29, 185, 84, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(29, 185, 84, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const progressChartData = {
    labels: analyticsData.weeklyProgress.labels,
    datasets: [
      {
        label: 'Weekly Progress',
        data: analyticsData.weeklyProgress.data,
        fill: true,
        borderColor: 'rgb(29, 185, 84)',
        backgroundColor: 'rgba(29, 185, 84, 0.2)',
        tension: 0.4
      }
    ]
  };

  const assignmentChartData = {
    labels: Object.keys(analyticsData.assignmentTypes),
    datasets: [
      {
        data: Object.values(analyticsData.assignmentTypes),
        backgroundColor: [
          'rgba(29, 185, 84, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(29, 185, 84, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ]
      }
    ]
  };

  const handleDownload = (material) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading ${material.title}`);
    // You would typically make an API call to your backend here
    alert(`Downloading ${material.title}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    return status === 'submitted' ? '#1db954' : '#ff9800';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Student Dashboard</h1>
          <p className="subtitle">Welcome back to your learning space</p>
        </div>
        <div className="header-right">
          <div 
            className="user-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">Student</span>
            </div>
          </div>
          <div className={`profile-menu ${showProfileMenu ? 'active' : ''}`}>
            <a href="#" className="menu-item">
              <i className="fas fa-user"></i>
              View Profile
            </a>
            <a href="#" className="menu-item">
              <i className="fas fa-cog"></i>
              Settings
            </a>
            <div className="menu-divider"></div>
            <a href="#" className="menu-item">
              <i className="fas fa-bell"></i>
              Notifications
            </a>
            <a href="#" className="menu-item">
              <i className="fas fa-question-circle"></i>
              Help Center
            </a>
            <div className="menu-divider"></div>
            <a 
              href="#" 
              className="menu-item logout-item"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </a>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button 
          className={`nav-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`nav-button ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
        <button 
          className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="dashboard-content">
        {showProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
              </div>
              <StudentProfile />
            </div>
          </div>
        )}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-section">
              <h2>Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Courses</h3>
                  <p className="stat-number">{courses.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Assignments</h3>
                  <p className="stat-number">{pendingAssignments.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Average Grade</h3>
                  <p className="stat-number">A-</p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Upcoming Deadlines</h2>
              <div className="deadline-list">
                {pendingAssignments
                  .slice(0, 3)
                  .map(assignment => (
                    <div key={assignment.id} className="deadline-card">
                      <h3>{assignment.title}</h3>
                      <p>{assignment.course}</p>
                      <p className="due-date">Due: {assignment.dueDate}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>My Courses</h2>
            </div>
            
            <div className="courses-container">
              {!selectedCourse ? (
                // Course selection view
                <div className="courses-grid">
                  {courses.map(course => (
                    <div 
                      key={course.id} 
                      className="course-card"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="course-header">
                        <h3>{course.name}</h3>
                        <span className="instructor">{course.instructor}</span>
                      </div>
                      <div className="course-progress">
                        <div className="progress-label">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="view-materials-button">
                        <i className="fas fa-book"></i>
                        View Materials
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // Course materials view
                <div className="course-materials">
                  <div className="materials-header">
                    <button 
                      className="back-button"
                      onClick={() => setSelectedCourse(null)}
                    >
                      <i className="fas fa-arrow-left"></i>
                      Back to Courses
                    </button>
                    <h2>{selectedCourse.name} Materials</h2>
                  </div>

                  <div className="units-container">
                    {selectedCourse.units.map(unit => (
                      <div key={unit.id} className="unit-card">
                        <div className="unit-header">
                          <h3>{unit.name}</h3>
                          <span className="material-count">
                            {unit.materials.length} materials
                          </span>
                        </div>
                        
                        <div className="materials-list">
                          {unit.materials.map(material => (
                            <div key={material.id} className="material-item">
                              <div className="material-info">
                                <i className={`fas fa-file-${material.type}`}></i>
                                <div className="material-details">
                                  <h4>{material.title}</h4>
                                  <span className="material-meta">
                                    {material.type.toUpperCase()} • {material.size}
                                  </span>
                                </div>
                              </div>
                              <button 
                                className="download-button"
                                onClick={() => handleDownload(material)}
                              >
                                <i className="fas fa-download"></i>
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-grid">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-header">
                  <h3>{assignment.title}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(assignment.status) }}
                  >
                    {assignment.status}
                  </span>
                </div>
                <p className="course-name">{assignment.course}</p>
                <p className="due-date">Due: {assignment.dueDate}</p>
                {assignment.status === 'pending' && (
                  <button className="submit-button">Submit Assignment</button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="announcements-grid">
            {assignments.map(assignment => (
              <div key={assignment.id} className="announcement-card">
                <div className="announcement-header">
                  <h3>{assignment.title}</h3>
                  <span className="announcement-date">{assignment.dueDate}</span>
                </div>
                <p className="course-name">{assignment.course}</p>
                <p className="announcement-content">{assignment.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Analytics & Progress</h2>
            </div>

            <div className="analytics-grid">
              {/* Summary Cards */}
              <div className="analytics-summary">
                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="summary-info">
                    <h3>Overall Progress</h3>
                    <p>{analyticsData.overallProgress}%</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div className="summary-info">
                    <h3>Completed Tasks</h3>
                    <p>{analyticsData.completedAssignments}/{analyticsData.totalAssignments}</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="summary-info">
                    <h3>Pending Tasks</h3>
                    <p>{analyticsData.pendingAssignments}</p>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="chart-container course-grades">
                <h3>Course Grades</h3>
                <div className="chart-wrapper">
                  <Bar data={gradeChartData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-container weekly-progress">
                <h3>Weekly Progress</h3>
                <div className="chart-wrapper">
                  <Line data={progressChartData} options={chartOptions} />
                </div>
              </div>

              <div className="chart-container assignment-distribution">
                <h3>Assignment Status</h3>
                <div className="chart-wrapper">
                  <Pie data={assignmentChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
