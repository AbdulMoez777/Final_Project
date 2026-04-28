import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText, Zap, Layers, CheckCircle } from 'lucide-react';

const ActivityViewer = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        
        const response = await fetch(`http://127.0.0.1:8000/api/activity/${id}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setActivity(data);
        } else {
          alert('Could not load activity.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [id, navigate]);

  if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-500" size={40} /></div>;
  if (!activity) return <div>Not Found</div>;

  // Render logic based on type
  const renderContent = () => {
    if (!activity.content) return <p className="text-gray-500 italic">No content saved for this activity.</p>;

    if (activity.type === "Summary") {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-xl mb-4 text-blue-600 flex items-center gap-2"><FileText /> Summary</h3>
           <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{activity.content}</p>
        </div>
      );
    } 
    
    if (activity.type === "Flashcards") {
      // Flashcards are saved as a JSON string, so we have to parse them!
      const cards = JSON.parse(activity.content);
      return (
        <div>
           <h3 className="font-bold text-xl mb-4 text-orange-500 flex items-center gap-2"><Layers /> Your Revision Cards</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {cards.map((card, index) => (
                <div key={index} className="p-4 border border-orange-200 bg-orange-50 rounded-xl">
                  <p className="font-bold text-orange-800 mb-2">Q: {card.question}</p>
                  <p className="text-gray-700">A: {card.answer}</p>
                </div>
             ))}
           </div>
        </div>
      );
    }

    if (activity.type === "Quiz") {
      const questions = JSON.parse(activity.content);
      return (
        <div>
           <h3 className="font-bold text-xl mb-6 text-purple-600 flex items-center gap-2"><Zap /> Quiz Study Guide</h3>
           <div className="space-y-6">
             {questions.map((q, index) => (
                <div key={index} className="p-6 border border-purple-100 bg-white shadow-sm rounded-xl">
                  <p className="font-bold text-slate-800 mb-4 text-lg">Q{index + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg border text-sm flex items-center justify-between
                          ${opt === q.answer 
                            ? 'bg-green-50 border-green-200 text-green-800 font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        {opt}
                        {opt === q.answer && <CheckCircle size={16} className="text-green-600" />}
                      </div>
                    ))}
                  </div>
                </div>
             ))}
           </div>
        </div>
      );
    }

    return <p>Preview not available for this activity type yet.</p>;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <button onClick={() => navigate("/dashboard")} className="flex items-center text-slate-500 hover:text-slate-800 mb-8 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{activity.title}</h1>
        <p className="text-slate-500 mt-2">Generated on {activity.time}</p>
      </div>

      {renderContent()}
    </div>
  );
};

export default ActivityViewer;