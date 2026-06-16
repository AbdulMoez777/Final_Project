import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Youtube,
  Copy,
  Check,
  Download,
  FileText,
  Sparkles,
} from "lucide-react";
import html2pdf from "html2pdf.js";

const YoutubeNotesPage = () => {
  const navigate = useNavigate();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const contentRef = useRef();

  const handleExtract = async () => {
    // 1. Safe check: ensure youtubeUrl exists and is a string before doing anything
    if (!youtubeUrl || typeof youtubeUrl !== "string") {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    const trimmedUrl = youtubeUrl.trim();
    if (!trimmedUrl) {
      alert("URL cannot be empty.");
      return;
    }

    setIsLoading(true);
    setTranscript("");

    try {
      const response = await fetch("http://localhost:8000/api/extract-youtube/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmedUrl }), // Sending clean, trimmed string
      });

      const data = await response.json();

      if (response.ok) {
        setTranscript(data.text);
      } else {
        alert("Error: " + (data.error || "Failed to extract video transcript."));
      }
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to connect to the server. Is your Django backend running?");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);

    const options = {
      margin: 15,
      filename: "YouTube_Transcript.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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

  // Helper to jump straight to Summarizer with this text
  const handleSendToSummarizer = () => {
    // You could pass state through navigation if you want to auto-fill the summarizer!
    // For now, they can just copy it, or you can implement state passing.
    copyToClipboard();
    alert("Transcript copied! Head over to the Summarizer to paste it.");
    navigate("/summary");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div className="w-40">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-slate-500 hover:text-red-600 font-medium transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 flex-1">
          <Youtube className="text-red-600" size={32} /> YouTube to Notes
        </h1>

        <div className="w-40"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
        {/* Left Panel: Input */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-red-50/50 flex flex-col gap-3">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Youtube size={20} className="text-red-500" /> Extract Video Text
            </h2>
            <p className="text-sm text-slate-500">
              Paste a link to any educational YouTube video with subtitles to instantly extract the full transcript.
            </p>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-center">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              YouTube URL
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-700 mb-6"
            />

            <button
              onClick={handleExtract}
              disabled={isLoading || !youtubeUrl}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                isLoading || !youtubeUrl
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20"
              }`}
            >
              {isLoading ? (
                "Extracting Transcript..."
              ) : (
                <>
                  <FileText size={20} /> Get Transcript
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-800 flex justify-between items-center">
            <span>Video Transcript</span>
            {transcript && (
              <button
                onClick={copyToClipboard}
                className="text-slate-500 hover:text-red-600 transition flex items-center gap-1 text-sm font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} 
                {copied ? "Copied!" : "Copy All"}
              </button>
            )}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-pulse">
                <Youtube size={48} className="mb-4 text-red-300" />
                <p className="font-medium">Reading video subtitles...</p>
              </div>
            ) : transcript ? (
              <div 
                ref={contentRef} 
                className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm" 
                style={{ color: '#1e293b' }} 
              >
                <h2 
                  className="text-xl font-bold border-b pb-3 mb-4 flex items-center gap-2"
                  style={{ color: '#0f172a', borderColor: '#e2e8f0' }}
                >
                  <Youtube className="text-red-600" size={24} /> 
                  Extracted Notes
                </h2>
                <p 
                  className="leading-loose text-base whitespace-pre-wrap"
                  style={{ color: '#334155' }}
                >
                  {transcript}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <p>Transcript will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full max-w-5xl flex justify-end gap-4 mt-6">
        {transcript && (
          <>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all shadow-sm font-bold ${
                isGeneratingPdf
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              <Download size={18} />
              {isGeneratingPdf ? "Saving PDF..." : "Download as PDF"}
            </button>

            <button
              onClick={handleSendToSummarizer}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm font-bold hover:shadow-lg hover:-translate-y-0.5"
            >
              <Sparkles size={18} />
              Summarize This
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeNotesPage;