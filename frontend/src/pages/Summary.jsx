import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  PlusCircle,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

const Summary = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [summaryType, setSummaryType] = useState("default");

  // Reference for PDF export targeting
  const contentRef = useRef();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
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
      setLoading(false);
      event.target.value = null;
    }
  };

  const handleSummarize = async () => {
    if (!inputText) return;

    setLoading(true);
    setSummary("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ 
          text: inputText,
          type: summaryType 
        }),
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

  const handleGenerateNew = () => {
    setSummary("");
    setInputText("");
    setSummaryType("default");
  };

  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;

    setIsGeneratingPdf(true); 

    const options = {
      margin:       15,
      filename:     'AI_Study_Summary.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0, 
        windowWidth: document.documentElement.offsetWidth 
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="w-40">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 flex-1">
          <Sparkles className="text-blue-600" /> AI Summarizer
        </h1>

        <div className="w-40"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
            <span className="font-semibold text-slate-700">
              Paste your text or upload a file
            </span>
            <input
              type="file"
              accept=".pdf,.docx, .doc,.pptx,.txt"
              onChange={handleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
            />
          </div>
          <textarea
            className="flex-1 p-6 resize-none focus:outline-none text-slate-600 leading-relaxed"
            placeholder="Paste a long article, notes, or paragraph here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Style:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSummaryType('default')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${summaryType === 'default' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => setSummaryType('short')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${summaryType === 'short' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
              >
                Short
              </button>
              <button 
                onClick={() => setSummaryType('bullets')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${summaryType === 'bullets' ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
              >
                Bullet Points
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleSummarize}
              disabled={loading || !inputText}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"}`}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Sparkles size={18} /> Generate Summary
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 bg-blue-50 font-semibold text-blue-800 flex justify-between items-center">
            <span>AI Summary</span>
            {summary && (
              <button
                onClick={copyToClipboard}
                className="text-blue-600 hover:text-blue-800 transition"
              >
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
              // Inline styles used to prevent html2canvas parsing errors with Tailwind oklch colors
              <div 
                ref={contentRef} 
                className="p-8" 
                style={{ backgroundColor: '#ffffff', color: '#1e293b' }} 
              >
                <h2 
                  className="text-2xl font-bold border-b pb-2 mb-4"
                  style={{ color: '#0f172a', borderColor: '#e2e8f0' }}
                >
                  Study Notes
                </h2>
                <p 
                  className="leading-loose text-lg whitespace-pre-wrap"
                  style={{ color: '#334155' }}
                >
                  {summary}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>Summary will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-end gap-4 mt-6">
        {summary && (
          <>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-xl transition-all shadow-sm font-medium ${isGeneratingPdf ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5'}`}
            >
              <Download size={18} />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>

            <button
              onClick={handleGenerateNew}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm font-medium hover:shadow-md hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              Generate New Summary
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;