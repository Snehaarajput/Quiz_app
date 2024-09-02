import React, { useState, useEffect } from 'react';
import './Analytics.css'; // Assuming you will have some CSS for styling
import edit from '../../../assets/images/edit.png'
import Vector from '../../../assets/images/Vector.png';
import Share from '../../../assets/images/Share.png'
import QuestionAnalytics from '../Question Analytics/QuestionAnalytics';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Analytics = ({userData}) => { 

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);

    const [questionAnalyticsVisible, setQuestionAnalyticsVisible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizes, setQuizzes] = useState({});

    const showToastMessage = (message) => {
      toast.success(message);
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://quizee-backend-0ltq.onrender.com/user/${userData.id}/analytics`
          );
        //   console.log(response.data.quizzes);
          setQuizzes(response.data.quizzes);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [userData.id]); // Empty array means this effect runs once after the initial render

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleDeleteClick = (id) => {
        // console.log(quiz);
        setQuizToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://quizee-backend-0ltq.onrender.com/quiz/${quizToDelete}`);
            // Re-fetch quizzes after deletion
            const response = await axios.get(`https://quizee-backend-0ltq.onrender.com/user/${userData.id}/analytics`);
            setQuizzes(response.data.quizzes);
            showToastMessage('Quiz deleted successfully!');
            } catch (err) {
                setError(err);
            } finally {
                setDeleteModalOpen(false);
                setQuizToDelete(null);
            }
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setQuizToDelete(null);
    };


    const handleQuestionWiseAnalysisClick = (quizId) => {
        // const foundQuiz = quizes.find((quiz) => quiz._id === quizId);
        setSelectedQuiz(quizId);
        setQuestionAnalyticsVisible(true);
    };

    const handleShareClick = (quizId) => {
        const quizLink = `http://localhost:5173/quiz-interface/${quizId}`;
        navigator.clipboard.writeText(quizLink)
            .then(() => {
                showToastMessage("Link copied to clipboard!");
                // alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
      }).format(new Date(date));
    };

    return (
      <div>
        {questionAnalyticsVisible ? (
          <QuestionAnalytics quizId={selectedQuiz} />
        ) : (
          <div className="analytics">
            <h1>Quiz Analytics</h1>
            <div className="table-container">
              <table className="quiz-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created On</th>
                    <th>Impressions</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizes.map((quiz, index) => (
                    <tr key={quiz._id}>
                      <td>{index + 1}</td>
                      <td>{quiz.quizName}</td>
                      <td>{formatDate(quiz.createdAt)}</td>
                      <td>{quiz.impressions}</td>
                      <td>
                        <button className="edit-btn">
                          <img src={edit} alt="edit" />
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteClick(quiz._id)}
                        >
                          <img src={Vector} alt="Delete" />
                        </button>
                      </td>
                      <td>
                        <button
                          className="share-btn"
                          onClick={() => handleShareClick(quiz._id)}
                        >
                          <img src={Share} alt="Delete" />
                        </button>
                      </td>
                      <td>
                        <button
                          className="analysis-btn"
                          onClick={() =>
                            handleQuestionWiseAnalysisClick(quiz._id)
                          }
                        >
                          Question Wise Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {deleteModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>
                      Are you confirm you <br />
                      want to delete?
                    </h2>
                    <div className="modal-actions">
                      <button
                        className="confirm-delete-btn"
                        onClick={confirmDelete}
                      >
                        Confirm Delete
                      </button>
                      <button className="cancel-btn" onClick={closeDeleteModal}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    );
};

export default Analytics;







