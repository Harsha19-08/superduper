import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAssignments } from '../context/AssignmentContext';
import './Dashboard.css';
import { toast } from 'react-toastify';

function FacultyDashboard() {
  const { user, logout } = useAuth();
  const { addAssignment, assignments } = useAssignments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    dueDate: '',
    description: '',
    maxMarks: '',
    type: 'homework'
  });

  // Mock data
  const classes = [
    { 
      id: 1, 
      name: 'Mathematics 101', 
      students: 30, 
      averageGrade: 'B+',
      nextSession: 'Tomorrow, 10:00 AM',
      attendance: 85,
      submissions: 25
    },
    { 
      id: 2, 
      name: 'Physics 101', 
      students: 25, 
      averageGrade: 'A-',
      nextSession: 'Wednesday, 2:00 PM',
      attendance: 90,
      submissions: 20
    }
  ];

  // Mock student data with progress
  const students = [
    { 
      id: 1, 
      name: 'Alice Smith', 
      email: 'alice@example.com', 
      progress: {
        overallGrade: 85,
        completedAssignments: 8,
        totalAssignments: 10,
        courseGrades: {
          'Mathematics 101': 90,
          'Physics 101': 82,
          'Computer Science 101': 88
        }
      }
    },
    { 
      id: 2, 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      progress: {
        overallGrade: 78,
        completedAssignments: 7,
        totalAssignments: 10,
        courseGrades: {
          'Mathematics 101': 75,
          'Physics 101': 80,
          'Computer Science 101': 85
        }
      }
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      progress: {
        overallGrade: 92,
        completedAssignments: 9,
        totalAssignments: 10,
        courseGrades: {
          'Mathematics 101': 95,
          'Physics 101': 88,
          'Computer Science 101': 92
        }
      }
    }
  ];

  // Calculate class analytics
  const classAnalytics = {
    averageGrade: students.reduce((sum, student) => sum + student.progress.overallGrade, 0) / students.length,
    completionRate: (students.reduce((sum, student) => sum + student.progress.completedAssignments, 0) / 
                    students.reduce((sum, student) => sum + student.progress.totalAssignments, 0)) * 100,
    courseAverages: {
      'Mathematics 101': students.reduce((sum, student) => sum + student.progress.courseGrades['Mathematics 101'], 0) / students.length,
      'Physics 101': students.reduce((sum, student) => sum + student.progress.courseGrades['Physics 101'], 0) / students.length,
      'Computer Science 101': students.reduce((sum, student) => sum + student.progress.courseGrades['Computer Science 101'], 0) / students.length
    }
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const newAssignment = {
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: user.email,
    };
    
    addAssignment(newAssignment);
    setShowModal(false);
    setFormData({
      title: '',
      course: '',
      dueDate: '',
      description: '',
      maxMarks: '',
      type: 'homework'
    });

    // Show success notification
    toast.success('Assignment created successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Faculty Dashboard</h1>
          <p className="subtitle">Manage your classes and students</p>
        </div>
        <div className="header-right">
          <div 
            className="user-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0) : 'F'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">Faculty</span>
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
              <i className="fas fa-chalkboard"></i>
              My Classes
            </a>
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
          className={`nav-button ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          Classes
        </button>
        <button 
          className={`nav-button ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`nav-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
        <button 
          className={`nav-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-section">
              <h2>Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Classes</h3>
                  <p className="stat-number">{classes.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Students</h3>
                  <p className="stat-number">{students.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Grades</h3>
                  <p className="stat-number">
                    {assignments.reduce((acc, curr) => acc + curr.pending, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Upcoming Classes</h2>
              <div className="class-schedule">
                {classes.map(cls => (
                  <div key={cls.id} className="schedule-card">
                    <h3>{cls.name}</h3>
                    <p className="next-session">{cls.nextSession}</p>
                    <p className="attendance">Attendance: {cls.attendance}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="classes-grid">
            {classes.map(cls => (
              <div key={cls.id} className="class-card">
                <div className="class-header">
                  <h3>{cls.name}</h3>
                  <span className="student-count">{cls.students} Students</span>
                </div>
                <div className="class-stats">
                  <div className="stat">
                    <label>Average Grade</label>
                    <span>{cls.averageGrade}</span>
                  </div>
                  <div className="stat">
                    <label>Attendance</label>
                    <span>{cls.attendance}%</span>
                  </div>
                  <div className="stat">
                    <label>Submissions</label>
                    <span>{cls.submissions}</span>
                  </div>
                </div>
                <div className="class-actions">
                  <button className="action-button">View Details</button>
                  <button className="action-button">Take Attendance</button>
                </div>
              </div>
            ))}
            <div className="add-class-card">
              <button className="add-button">+ Add New Class</button>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <div className="section-header">
              <h2>Assignments</h2>
            </div>

            <div className="create-assignment-container">
              <div className="create-assignment-card">
                <div className="create-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <h3>Create New Assignment</h3>
                <p>Add a new assignment for your students</p>
                <button 
                  className="create-button"
                  onClick={() => setShowModal(true)}
                >
                  Create Assignment
                </button>
              </div>
            </div>

            {/* Display assignments grid */}
            <div className="assignments-grid">
              {assignments.map(assignment => (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-header">
                    <h3>{assignment.title}</h3>
                    <span className={`assignment-type ${assignment.type}`}>
                      {assignment.type}
                    </span>
                  </div>
                  <div className="assignment-details">
                    <p><i className="fas fa-book"></i> {assignment.course}</p>
                    <p><i className="fas fa-calendar"></i> Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    <p><i className="fas fa-star"></i> Points: {assignment.maxMarks}</p>
                  </div>
                  <div className="assignment-stats">
                    <div className="stat">
                      <span>Submitted</span>
                      <strong>{assignment.totalSubmissions}</strong>
                    </div>
                    <div className="stat">
                      <span>Pending</span>
                      <strong>{assignment.pending}</strong>
                    </div>
                    <div className="stat">
                      <span>Graded</span>
                      <strong>{assignment.graded}</strong>
                    </div>
                  </div>
                  <div className="assignment-actions">
                    <button className="action-button view-button">
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                    <button className="action-button grade-button">
                      <i className="fas fa-check-circle"></i>
                      Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>Create New Assignment</h3>
                    <button 
                      className="close-button"
                      onClick={() => setShowModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleCreateAssignment}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          title: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({
                          ...formData,
                          description: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Course</label>
                        <select
                          value={formData.course}
                          onChange={(e) => setFormData({
                            ...formData,
                            course: e.target.value
                          })}
                          required
                        >
                          <option value="">Select Course</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Assignment Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({
                            ...formData,
                            type: e.target.value
                          })}
                          required
                        >
                          <option value="homework">Homework</option>
                          <option value="quiz">Quiz</option>
                          <option value="project">Project</option>
                          <option value="exam">Exam</option>
                          <option value="lab">Lab Work</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Due Date</label>
                        <input
                          type="datetime-local"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({
                            ...formData,
                            dueDate: e.target.value
                          })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Max Marks</label>
                        <input
                          type="number"
                          value={formData.maxMarks}
                          onChange={(e) => setFormData({
                            ...formData,
                            maxMarks: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="submit" className="submit-button">
                        Create Assignment
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="students-section">
            <div className="section-header">
              <h2>Students</h2>
              <div className="search-box">
                <input type="text" placeholder="Search students..." />
              </div>
            </div>
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Performance</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${student.progress.overallGrade}%` }}
                          ></div>
                        </div>
                      </td>
                      <td>{student.progress.attendance}%</td>
                      <td>
                        <button className="action-button small">View Profile</button>
                        <button className="action-button small">Send Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="analytics-header">
              <h2>Class Analytics</h2>
            </div>
            
            <div className="analytics-overview">
              <div className="stat-card">
                <h3>Class Average</h3>
                <p className="stat-number">{classAnalytics.averageGrade.toFixed(1)}%</p>
              </div>
              <div className="stat-card">
                <h3>Completion Rate</h3>
                <p className="stat-number">{classAnalytics.completionRate.toFixed(1)}%</p>
              </div>
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-number">{students.length}</p>
              </div>
            </div>

            <div className="course-analytics">
              <h3>Course Performance</h3>
              <div className="course-progress-grid">
                {Object.entries(classAnalytics.courseAverages).map(([course, average]) => (
                  <div key={course} className="course-progress-card">
                    <h4>{course}</h4>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar"
                        style={{ width: `${average}%` }}
                      ></div>
                      <span className="progress-value">{average.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="student-analytics">
              <h3>Student Progress</h3>
              <div className="student-progress-grid">
                {students.map(student => (
                  <div key={student.id} className="student-progress-card">
                    <div className="student-info">
                      <h4>{student.name}</h4>
                      <p>{student.email}</p>
                    </div>
                    <div className="progress-stats">
                      <div className="progress-stat">
                        <span>Overall Grade</span>
                        <span className="grade">{student.progress.overallGrade}%</span>
                      </div>
                      <div className="progress-stat">
                        <span>Completed</span>
                        <span>{student.progress.completedAssignments}/{student.progress.totalAssignments}</span>
                      </div>
                    </div>
                    <div className="course-grades">
                      {Object.entries(student.progress.courseGrades).map(([course, grade]) => (
                        <div key={course} className="course-grade">
                          <span>{course}</span>
                          <div className="grade-bar-container">
                            <div 
                              className="grade-bar"
                              style={{ width: `${grade}%` }}
                            ></div>
                            <span>{grade}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
