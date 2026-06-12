import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // 1. Create the reference for the PDF generator
  const contentRef = useRef();

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
    if (!inputText) return;

    setIsLoading(true);
    setFlashcards([]);
    setFlippedCards([]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/generate-flashcards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to generate flashcards.'); 
        setIsLoading(false);
        return; 
      }

      const data = await response.json();
      setFlashcards(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server. Is Django running?");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (index) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index));
    } else {
      setFlippedCards([...flippedCards, index]);
    }
  };

  const handleGenerateNew = () => {
    setFlashcards([]);
    setInputText('');
    setFlippedCards([]);
  };

  // 2. The PDF Download Function
  const handleDownloadPDF = async () => {
    const element = contentRef.current;
    if (!element) return;

    setIsGeneratingPdf(true); 

    const options = {
      margin:       15,
      filename:     'AI_Study_Flashcards.pdf',
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
    <div className="p-8 max-w-6xl mx-auto">
      <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-slate-500 hover:text-orange-500 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>
      <h1 className="text-3xl font-bold mb-2">Generate Flashcards</h1>
      <p className="text-gray-600 mb-8">Paste your study notes below and let AI create revision cards for you.</p>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload a File (PDF, PPTX, TXT) or Paste Text
          </label>
          <input
            type="file"
            accept=".pdf,.pptx,.txt"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>
        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Paste your lecture notes, slides text, or study material here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !inputText}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Generating AI Cards...' : 'Generate Flashcards ⚡'}
          </button>
        </div>
      </div>

      
      {flashcards.length > 0 && (
        <div>
          {/* 3. Wrap the Output in the contentRef and bypass Tailwind colors */}
          <div ref={contentRef} className="p-4" style={{ backgroundColor: '#f8fafc' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#0f172a' }}>Your Revision Cards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, index) => {
                const isFlipped = flippedCards.includes(index);

                return (
                  <div
                    key={index}
                    onClick={() => toggleCard(index)}
                    className={`relative p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center text-center border-2 
                      ${isFlipped ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-orange-200 text-gray-800 hover:border-orange-500'}`}
                    // 4. Force standard hex colors here to stop the PDF crash
                    style={{
                      backgroundColor: isFlipped ? '#f97316' : '#ffffff',
                      borderColor: isFlipped ? '#f97316' : '#fed7aa',
                      color: isFlipped ? '#ffffff' : '#1f2937'
                    }}
                  >
                    <span className="absolute top-3 left-4 text-xs font-bold opacity-50 uppercase tracking-wider">
                      {isFlipped ? 'Answer' : 'Question'}
                    </span>

                    <h3 className="text-lg font-medium mt-4">
                      {isFlipped ? card.answer : card.question}
                    </h3>

                    {/* Hide the "Click to flip" text from the PDF since it's a printed document */}
                    <span 
                      className="absolute bottom-3 text-xs opacity-60"
                      data-html2canvas-ignore="true" 
                    >
                      Click to flip
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full flex justify-end gap-4 mt-10">
            {/* 5. The Download Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-xl transition-all shadow-sm font-medium ${isGeneratingPdf ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-md hover:-translate-y-0.5'}`}
            >
              <Download size={18} />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>

            <button
              onClick={handleGenerateNew}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-sm font-medium hover:shadow-md hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              Generate New Flashcards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;