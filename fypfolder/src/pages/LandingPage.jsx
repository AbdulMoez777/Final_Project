import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import heropng from '../assets/Hero.png';
import testinomialmoez from '../assets/testinomialmoez.jpeg'; 
import testinomialibtihaj from '../assets/testinomialibtihaj.jpeg'; 
import testinomialhassan from '../assets/testinomialhassan.jpeg'; 

import { 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  UploadCloud, 
  PieChart, 
  Lock, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                AI
              </div>
              <span className="text-xl font-bold text-slate-900">Study Assistant</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 font-medium">How It Works</a>
              <a href="#faq" className="text-slate-600 hover:text-blue-600 font-medium">FAQ</a>
              
              <button 
                onClick={() => navigate('/login')} 
                className="px-5 py-2 text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition"
              >
                Login
              </button>
              
              <button 
                onClick={() => navigate('/signup')} 
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-4 shadow-xl">
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#how-it-works" className="block text-slate-600 font-medium">How It Works</a>
            <a href="#faq" className="block text-slate-600 font-medium">FAQ</a>
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-2 text-blue-600 font-semibold border border-blue-600 rounded-lg"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-20 lg:pt-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
              🚀 AI-Powered Learning
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Study Smarter With <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                AI Powered Tools
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Upload your PDFs, slides, or notes. Let our AI generate summaries, quizzes, and flashcards instantly. Save time and boost your grades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/signup')} 
                className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3.5 text-slate-700 font-bold bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition">
                View Demo
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                ))}
              </div>
              <p>Trusted by 5,000+ Students</p>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden transform rotate-2 hover:rotate-0 transition duration-500">
              <div className="bg-slate-100 rounded-xl h-64 md:h-96 w-full flex items-center justify-center">
                <img src={heropng} alt="Study Dashboard" className='w-full h-full object-cover'/>
              </div>
            </div>
            <div className="absolute top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Tools to Boost Your Productivity
            </h2>
            <p className="text-lg text-slate-600">Everything you need to master your subjects in one place.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BookOpen size={24} className="text-blue-600" />} 
              title="Smart Summaries" 
              desc="Turn long lecture notes into concise, easy-to-read summaries instantly." 
            />
            <FeatureCard 
              icon={<BrainCircuit size={24} className="text-purple-600" />} 
              title="Quiz Generator" 
              desc="Generate practice questions from your material to test your knowledge." 
            />
            <FeatureCard 
              icon={<FileText size={24} className="text-green-600" />} 
              title="Flashcards Creator" 
              desc="Convert key concepts into interactive flashcards for quick revision." 
            />
            <FeatureCard 
              icon={<UploadCloud size={24} className="text-orange-600" />} 
              title="File Upload Support" 
              desc="Upload PDFs, DOCX, and text files. We handle the processing securely." 
            />
            <FeatureCard 
              icon={<PieChart size={24} className="text-red-600" />} 
              title="Progress Tracking" 
              desc="Visualize your learning journey with detailed analytics and charts." 
            />
            <FeatureCard 
              icon={<Lock size={24} className="text-teal-600" />} 
              title="Secure Storage" 
              desc="Your data is encrypted and stored securely in the cloud." 
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Three simple steps to better grades.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100 -z-10 mx-16"></div>
            <StepCard 
              number="01" 
              title="Upload Your Notes" 
              desc="Upload your slides, PDFs or handwritten notes to the system."
            />
            <StepCard 
              number="02" 
              title="AI Processes Everything" 
              desc="Our smart algorithms analyze your content and extract key info."
            />
            <StepCard 
              number="03" 
              title="Start Studying Smarter" 
              desc="Access generated quizzes and summaries immediately."
            />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION (UPDATED) --- */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Students Say</h2>
            <p className="text-slate-600">Join thousands of students upgrading their study habits.</p>
          </div>
          
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              image={testinomialmoez}
              quote="The quizzes feel like real exam questions. It helped me prepare more effectively and saved me hours of manual note-taking."
              name="Abdul Moez"
              role="UOG Student"
            />
            <TestimonialCard 
              image={testinomialibtihaj}
              quote="The automated flashcards cut my study time in half. I can easily review chapters on my phone right before class!"
              name="Ibtihaj"
              role="UOG Student"
            />
            <TestimonialCard 
              image={testinomialhassan} 
              quote="The AI summaries are an absolute lifesaver for long research papers. Highly recommend this tool for any university student."
              name="Hassan Ali Tahir"
              role="UOG Student"
            />
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <FaqItem 
              index={1} 
              question="Do I need to create an account?" 
              answer="Yes, creating an account allows you to save your notes, track progress, and access your history from any device."
              isOpen={openFaq === 1}
              onClick={() => toggleFaq(1)}
            />
            <FaqItem 
              index={2} 
              question="What types of files can I upload?" 
              answer="We currently support PDF, DOCX, PowerPoint (PPTX), and plain text files. Image-to-text support is coming soon!"
              isOpen={openFaq === 2}
              onClick={() => toggleFaq(2)}
            />
            <FaqItem 
              index={3} 
              question="Is my data stored securely?" 
              answer="Absolutely. We use industry-standard encryption to protect your files and personal information."
              isOpen={openFaq === 3}
              onClick={() => toggleFaq(3)}
            />
            <FaqItem 
              index={4} 
              question="Is the tool free to use?" 
              answer="There is a free tier available for all students. We also offer premium features for advanced usage."
              isOpen={openFaq === 4}
              onClick={() => toggleFaq(4)}
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-2xl shadow-blue-900/50">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Studying Smarter Today</h3>
              <p className="text-blue-100">Let AI simplify your study routine.</p>
            </div>
            <button 
              onClick={() => navigate('/signup')} 
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-slate-100 transition"
            >
              Join Now
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-800 pb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-white">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">AI</div>
                <span className="font-bold text-lg">Study Assistant</span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering students at University of Gujrat and beyond with cutting-edge AI tools.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@smartstudy.com</li>
                <li>+92 300 1234567</li>
                <li>Gujrat, Pakistan</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Study Assistant. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="relative z-10 flex flex-col items-center">
    <div className="w-16 h-16 bg-white border-4 border-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm max-w-xs">{desc}</p>
  </div>
);

const FaqItem = ({ index, question, answer, isOpen, onClick }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <button 
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-900 focus:outline-none"
    >
      <span>{index}. {question}</span>
      {isOpen ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-slate-400" />}
    </button>
    <div 
      className={`px-4 text-slate-600 text-sm transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
    >
      {answer}
    </div>
  </div>
);

// 👇 NEW: Reusable Testimonial Card Component
const TestimonialCard = ({ image, quote, name, role }) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 flex flex-col h-full hover:-translate-y-1 transition duration-300">
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl overflow-hidden shadow-inner">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>
    </div>
    <p className="text-slate-700 italic mb-6 flex-1 text-center leading-relaxed">
      "{quote}"
    </p>
    <div className="text-center mt-auto">
      <h4 className="font-bold text-slate-900">{name}</h4>
      <p className="text-blue-600 text-sm font-medium">{role}</p>
    </div>
  </div>
);

export default LandingPage;