import React, { createContext, useContext, useState, useEffect } from 'react';

const AssignmentContext = createContext();

export function useAssignments() {
  return useContext(AssignmentContext);
}

export function AssignmentProvider({ children }) {
  const [assignments, setAssignments] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);

  const addAssignment = (newAssignment) => {
    setAssignments(prevAssignments => {
      const updatedAssignments = [...prevAssignments, {
        ...newAssignment,
        id: Date.now(),
        status: 'pending',
        submissionDate: null
      }];
      // Update pending assignments
      setPendingAssignments(updatedAssignments.filter(a => a.status === 'pending'));
      return updatedAssignments;
    });
  };

  const updateAssignment = (assignmentId, updates) => {
    setAssignments(prevAssignments => {
      const updatedAssignments = prevAssignments.map(assignment =>
        assignment.id === assignmentId ? { ...assignment, ...updates } : assignment
      );
      // Update pending and completed assignments
      setPendingAssignments(updatedAssignments.filter(a => a.status === 'pending'));
      setCompletedAssignments(updatedAssignments.filter(a => a.status === 'completed'));
      return updatedAssignments;
    });
  };

  const getAssignmentsByStatus = (status) => {
    return assignments.filter(assignment => assignment.status === status);
  };

  const value = {
    assignments,
    pendingAssignments,
    completedAssignments,
    addAssignment,
    updateAssignment,
    getAssignmentsByStatus
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
}
