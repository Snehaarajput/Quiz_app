// src/components/MainContent.js
import React, { useEffect, useState } from "react";
import Group from "../../../assets/images/Group.png";
import "./MainContent.css"; // Add styles for MainContent
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainContent = ({ userData }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://quizee-backend-0ltq.onrender.com/quiz/all");
        // console.log(response.data);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes data:", error);
      }
    };
    fetchData();
  }, []);
  // console.log(userData);
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
  };


  const handleQuizClick = (quizId) => {
    navigate(`/quiz-interface/${quizId}`); // Redirect to the quiz page
  };

  return (
    <div className="main-content">
      <div className="metrics">
        <div className="metric-box orange">
          <h2>
            {userData.totalQuizzes}{" "}
            <span>
              Quiz <br />
              Created
            </span>
          </h2>
        </div>
        <div className="metric-box green">
          <h2>
            {userData.totalQuestions}{" "}
            <span>
              Questions <br />
              Created
            </span>
          </h2>
        </div>
        <div className="metric-box blue">
          <h2>
            {userData.totalImpressions}{" "}
            <span>
              Total <br />
              Impressions
            </span>
          </h2>
        </div>
      </div>

      <div className="trending-quizzes">
        <h2>Trending Quizzes</h2>
        <div className="quiz_list">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="quiz_item"
              onClick={() => handleQuizClick(quiz._id)} // Add onClick handler
              style={{ cursor: "pointer" }} // Add pointer cursor to indicate clickability
            >
              <div className="quiz_header">
                <h3>{quiz.quizName}</h3>
                <p>
                  {quiz.impressions}
                  <img src={Group} alt="eye Icon" className="eye-icon" />
                </p>
              </div>
              <div className="quiz_footer">
                <p>
                  {/* Created on: {new Date(quiz.createdAt).toLocaleDateString()} */}
                  Created on: {formatDate(quiz.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
