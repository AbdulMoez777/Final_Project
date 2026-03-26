import React, { useState } from "react";
import { ArrowLeft, BrainCircuit, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/extract-text/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // This drops the text into your text box!
        setInputText(data.text);
      } else {
        alert("Error reading file: " + data.error);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload the file.");
    } finally {
      setIsLoading(false);
      event.target.value = null;
    }
  };

  const handleGenerate = async () => {
    if (!inputText) return alert("Please enter some text first!");

    setIsLoading(true);
    setQuizData([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-quiz/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuizData(data.quiz);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ADD THIS NEW FUNCTION:
  const handleAnswerClick = (selectedOption) => {
    const isCorrect = selectedOption === quizData[currentQuestion].answer;

    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <BrainCircuit className="text-purple-600" size={32} /> AI Quiz
          Generator
        </h1>
        <p className="text-slate-500 mb-8">
          Paste your notes below, and AI will generate practice questions for
          you.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Input Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {/* 👇 NEW CODE ADDED HERE: The File Upload Button */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload a File (PDF, PPTX, TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.pptx,.txt"
                onChange={handleFileUpload}
                disabled={isLoading}
                // Notice the purple colors below to match your UI!
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"
              />
            </div>
            {/*  END OF  CODE */}
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Notes / Text
            </label>
            <textarea
              className="w-full h-64 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition"
              placeholder="Paste your study material here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Generating...
                </>
              ) : (
                "Generate Questions"
              )}
            </button>
          </div>

          {/* ✅ PASTE THE NEW GAME BOARD HERE: */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative min-h-[500px]">
            {/* Game Header */}
            <div className="p-4 border-b border-slate-100 bg-purple-50 font-semibold text-purple-800 flex justify-between items-center">
              <span>Interactive Quiz</span>
              {quizData.length > 0 && !showResults && (
                <span className="bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm">
                  Q {currentQuestion + 1} / {quizData.length}
                </span>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-slate-400 animate-pulse">
                  <BrainCircuit size={48} className="mb-4 text-purple-300" />
                  <p>Building your quiz...</p>
                </div>
              ) : showResults ? (
                // Final Score Screen
                <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Quiz Complete!
                  </h2>
                  <p className="text-lg text-slate-600 mb-6">You scored</p>
                  <div className="text-5xl font-extrabold text-purple-600 mb-8">
                    {score}{" "}
                    <span className="text-2xl text-slate-400">
                      / {quizData.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setQuizData([]);
                      setInputText("");
                    }}
                    className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
                  >
                    Create Another Quiz
                  </button>
                </div>
              ) : quizData.length > 0 ? (
                // Active Question Screen
                <div className="w-full max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
                    {quizData[currentQuestion].question}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {quizData[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        className="w-full p-4 text-left border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 rounded-xl transition text-slate-700 font-medium"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                  <BrainCircuit size={48} className="mb-2 opacity-20" />
                  <p>Your interactive quiz will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
