import React, { useState, useEffect } from "react";
import "./QuestionAnalytics.css";
import axios from "axios";


const QuestionAnalytics = ({ quizId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quesData, setQuestionData] = useState({});
  const [quizInfo, setQuizInfo] = useState({});

  // Sample data structure for question analytics
  useEffect(() => {
    const fetchData = async () => {
      // setQuestionData(selectedQuiz.questions);
      // setQuizInfo(selectedQuiz);
      // console.log(quizInfo);
      // console.log(quesData);
      try {
        const response = await axios.get(
          `https://quizee-backend-0ltq.onrender.com/quiz/${quizId}`
        );
        // console.log(response.data);
        setQuestionData(response.data.questions);
        setQuizInfo(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  // console.log(quesData);
  // console.log(quizInfo);
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
  };
  return (
    <div className="ques-analytics" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="heading">
        <h2 className="title"> {quizInfo.quizName} Question Analysis</h2>
        <div className="quiz-info">
          <p>Created on: {formatDate(quizInfo.createdAt)}</p>
          <p>Impressions: {quizInfo.impressions}</p>
        </div>
      </div>
      {quesData.map((data, index) => (
        <div key={index} className="question-container">
          <h3 className="question-title">
            Q.{index + 1} {data.text}
          </h3>
          {quizInfo.quizType === "Q&A" ? (
            <div className="metrics">
              <div className="metric-card qna">
                <h4>{data.attempted}</h4>
                <p>people Attempted the question</p>
              </div>
              <div className="metric-card qna">
                <h4>{data.correct}</h4>
                <p>people Answered Correctly</p>
              </div>
              <div className="metric-card qna">
                <h4>{data.incorrect}</h4>
                <p>people Answered Incorrectly</p>
              </div>
              <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
            </div>
          ) : (
            <div className="metrics">
              {data.options.map((curr, index) => (
                <div key={index} className="metric-card-poll">
                  <h4>{curr.optionCount}</h4>
                  {<p>{curr.optionText}</p>}
                </div>
              ))}
              <span>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionAnalytics;
