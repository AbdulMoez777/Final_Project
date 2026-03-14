import React, { useState } from 'react';
import { ArrowLeft, BrainCircuit, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/extract-text/', {
        method: 'POST',
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
    setQuestions([]);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.quiz);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <BrainCircuit className="text-purple-600" size={32} /> AI Quiz Generator
        </h1>
        <p className="text-slate-500 mb-8">Paste your notes below, and AI will generate practice questions for you.</p>

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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Notes / Text</label>
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
                <><Loader2 className="animate-spin" /> Generating...</>
              ) : (
                "Generate Questions"
              )}
            </button>
          </div>

          {/* Right: Output Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Generated Questions</h2>
            
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex gap-3">
                    <span className="font-bold text-purple-600">Q{index + 1}.</span>
                    <p className="text-slate-700 font-medium">{q}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                <BrainCircuit size={48} className="mb-2 opacity-20" />
                <p>Questions will appear here</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;