import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";

const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]); // Keeps track of which cards are flipped


  //  Function to handle file uploads
  // This function takes the selected file and sends it to your new Django extract-text API
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create a form package to send the file (since it's a file, not text)
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
        // Drop the extracted text straight into your existing textarea!
        setInputText(data.text);
      } else {
        alert("Error reading file: " + data.error);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload the file.");
    } finally {
      setIsLoading(false);
      // Reset the file input so you can upload the exact same file again if you want to
      event.target.value = null;
    }
  };
  //  END OF File Upload CODE

  // This function runs when you click "Generate"
  const handleGenerate = async () => {
    if (!inputText) return;

    setIsLoading(true);
    setFlashcards([]); // Clear previous cards
    setFlippedCards([]); // Reset flipped state

    try {
      // Send the text to my Django backend
      const response = await fetch('http://localhost:8000/api/generate-flashcards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      // Get the JSON array back from DJANGO/OpenAI
      const data = await response.json();

      //Put the real AI flascards on the screen
      setFlashcards(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Backend error! Check your Django terminal to see what crashed.");
    } finally {
      setIsLoading(false);
    }

  };




  // Function to flip a specific card
  const toggleCard = (index) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index)); // Unflip
    } else {
      setFlippedCards([...flippedCards, index]); // Flip
    }
  };

  // Function to clear the board and start over
  const handleGenerateNew = () => {
    setFlashcards([]);
    setInputText('');
    setFlippedCards([]);
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
        {/* The Upload File Button */}
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

      {/* Flashcards Display Section */}
      {flashcards.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Revision Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {flashcards.map((card, index) => {
              const isFlipped = flippedCards.includes(index);

              return (
                <div
                  key={index}
                  onClick={() => toggleCard(index)}
                  className={`relative p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center text-center border-2 
                    ${isFlipped ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-orange-200 text-gray-800 hover:border-orange-500'}`}
                >
                  <span className="absolute top-3 left-4 text-xs font-bold opacity-50 uppercase tracking-wider">
                    {isFlipped ? 'Answer' : 'Question'}
                  </span>

                  <h3 className="text-lg font-medium mt-4">
                    {isFlipped ? card.answer : card.question}
                  </h3>

                  <span className="absolute bottom-3 text-xs opacity-60">
                    Click to flip
                  </span>
                </div>
              );
            })}

          </div>

          <div className="w-full flex justify-end mt-10">
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