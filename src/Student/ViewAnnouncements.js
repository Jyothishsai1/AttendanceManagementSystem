import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ViewAnnouncements = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Fetch user data
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const studentDoc = usersSnapshot.docs.find(doc => doc.data().email.toLowerCase() === currentUser.email);
        const enrolledCourses = studentDoc?.data().enrolledCourses || [];

        // Fetch announcements
        const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
        const allAnnouncements = announcementsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch courses
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = {};
        coursesSnapshot.forEach(courseDoc => {
          coursesData[courseDoc.id] = courseDoc.data().courseName; // Map courseId to courseName
        });
        setCourses(coursesData);

        // Filter announcements for enrolled courses
        const filteredAnnouncements = allAnnouncements.filter(announcement =>
          enrolledCourses.includes(announcement.courseId)
        );

        setAnnouncements(filteredAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentUser.email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container text-center">
      <h2 className="m-5">Announcements</h2>
      {announcements.length > 0 ? (
        <table className="table table-striped ms-auto me-auto">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Announcement</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(announcement => (
              <tr key={announcement.id}>
                <td>{courses[announcement.courseId] || 'Unknown Course'}</td>
                <td>{announcement.announcement}</td>
                <td>{announcement.createdAt.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No announcements found for your enrolled courses.</p>
      )}
    </div>
  );
};

export default ViewAnnouncements;
