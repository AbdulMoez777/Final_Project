import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText) return;
    
    setLoading(true);
    setSummary(''); // Clear old summary

    try {
      const response = await fetch('http://127.0.0.1:8000/api/summarize/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.summary);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to AI server.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-blue-600 font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-blue-600" /> AI Summarizer
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
        
        {/* Input Side */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">
            Paste your text here
          </div>
          <textarea 
            className="flex-1 p-6 resize-none focus:outline-none text-slate-600 leading-relaxed"
            placeholder="Paste a long article, notes, or paragraph here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <div className="p-4 border-t border-slate-100 bg-white">
            <button 
              onClick={handleSummarize}
              disabled={loading || !inputText}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <><Sparkles size={18} /> Generate Summary</>
              )}
            </button>
          </div>
        </div>

        {/* Output Side */}
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 bg-blue-50 font-semibold text-blue-800 flex justify-between items-center">
            <span>AI Summary</span>
            {summary && (
              <button onClick={copyToClipboard} className="text-blue-600 hover:text-blue-800 transition">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                <Sparkles size={48} className="mb-4 text-blue-300" />
                <p>Analyzing text...</p>
              </div>
            ) : summary ? (
              <p className="text-slate-700 leading-loose text-lg">{summary}</p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>Summary will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Summary;