import React, { useState } from 'react';

const FlashcardsPage = () => {
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]); // Keeps track of which cards are flipped

  // This function runs when you click "Generate"
  const handleGenerate = async () => {
    if (!inputText) return;
    
    setIsLoading(true);

    // 🛑 DUMMY DATA: Later, we will replace this with a call to your Django backend!
    // For now, this just proves the page works visually.
    setTimeout(() => {
      const dummyData = [
        { question: "What is an Artificial Neural Network?", answer: "A computing system inspired by the biological neural networks that constitute animal brains." },
        { question: "What does CNN stand for in Deep Learning?", answer: "Convolutional Neural Network, often used for image recognition." },
        { question: "What is Backpropagation?", answer: "An algorithm used to calculate derivatives quickly, widely used to train neural networks." }
      ];
      setFlashcards(dummyData);
      setIsLoading(false);
    }, 1500); // Fakes a 1.5 second loading time
  };

  // Function to flip a specific card
  const toggleCard = (index) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter(i => i !== index)); // Unflip
    } else {
      setFlippedCards([...flippedCards, index]); // Flip
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Generate Flashcards</h1>
      <p className="text-gray-600 mb-8">Paste your study notes below and let AI create revision cards for you.</p>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
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
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;