import React, { useState } from "react";
import { ArrowLeft, BrainCircuit, CheckCircle, Loader2, Sparkles, FileText, Trophy } from "lucide-react";
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

  // Helper array to show A, B, C, D on options
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-500 hover:text-purple-600 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3 flex items-center gap-3 tracking-tight">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl shadow-inner">
              <BrainCircuit size={32} />
            </div>
            AI Quiz Generator
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Transform your study materials into an interactive assessment in seconds. Paste your notes or upload a file to begin.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Input Area */}
          <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            
            <div className="mb-6 group">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                <FileText size={16} className="text-purple-500" />
                Upload Document
              </label>
              <div className="relative border-2 border-dashed border-purple-200 rounded-2xl p-4 hover:bg-purple-50 hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.pptx,.txt"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition cursor-pointer"
                />
              </div>
            </div>
            
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
               Text Content
            </label>
            <textarea
              className="w-full h-60 p-5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none transition-all text-slate-600 leading-relaxed"
              placeholder="Paste your syllabus, textbook chapter, or lecture notes here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles size={24} /> Create My Quiz
                </>
              )}
            </button>
          </div>

          {/* RIGHT SIDE: Game Board */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col relative min-h-[600px]">
            
            {/* Game Header with Progress Bar */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-xl text-slate-800 tracking-tight">Live Assessment</span>
                {quizData.length > 0 && !showResults && (
                  <span className="bg-white text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-purple-100">
                    Question {currentQuestion + 1} of {quizData.length}
                  </span>
                )}
              </div>
              
              {/* Progress Bar Line */}
              {quizData.length > 0 && !showResults && (
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500 ease-out" 
                    style={{ width: `${((currentQuestion) / quizData.length) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/30 flex flex-col justify-center">
              {isLoading ? (
                
                // Loading State
                <div className="flex flex-col items-center justify-center text-purple-400">
                  <div className="relative">
                    <BrainCircuit size={64} className="animate-pulse text-purple-300" />
                    <Sparkles size={24} className="absolute -top-2 -right-2 animate-bounce text-indigo-400" />
                  </div>
                  <p className="mt-6 font-semibold text-lg animate-pulse text-slate-500">Analyzing text and writing questions...</p>
                </div>

              ) : showResults ? (
                
                // Final Score Screen
                <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Trophy size={48} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 mb-3">Assessment Complete!</h2>
                  <p className="text-xl text-slate-500 mb-8 font-medium">Here is your final score</p>
                  
                  <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <div className="relative bg-white border-4 border-purple-100 px-12 py-8 rounded-[3rem] shadow-xl">
                      <span className="text-7xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {score}
                      </span>
                      <span className="text-3xl text-slate-400 font-bold ml-2">/ {quizData.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setQuizData([]);
                      setInputText("");
                      setShowResults(false); // Closes the score screen
                      setScore(0);           // Resets the score
                      setCurrentQuestion(0); // Resets the question counter
                    }}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    Start a New Session
                  </button>
                </div>

              ) : quizData.length > 0 ? (
                
                // Active Question Screen
                <div className="w-full max-w-xl mx-auto animate-in slide-in-from-right-8 fade-in duration-300">
                  <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                    {quizData[currentQuestion].question}
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {quizData[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        className="group w-full p-5 text-left bg-white border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md rounded-2xl transition-all duration-200 flex items-center"
                      >
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 group-hover:bg-purple-200 group-hover:text-purple-700 text-slate-500 flex items-center justify-center font-bold text-lg mr-4 transition-colors">
                          {optionLetters[index]}
                        </span>
                        <span className="text-slate-700 font-semibold text-lg group-hover:text-purple-900">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              ) : (
                
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                    <BrainCircuit size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to test your knowledge?</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Upload a file or paste your notes on the left, and your AI-generated assessment will appear right here.
                  </p>
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