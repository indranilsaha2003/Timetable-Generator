import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { useTimetableStore } from './store/timetableStore';
import TimingForm from './components/TimingForm';
import FacultyForm from './components/FacultyForm';
import SubjectForm from './components/SubjectForm';
import RoomForm from './components/RoomForm';
import Summary from './components/Summary';
import AuthForm from './components/AuthForm';
import { supabase } from './lib/supabase';

const steps = ['Select Timing', 'Select Subjects', 'Select Faculties', 'Select Rooms', 'Summary'];

function App() {
  const { currentStep } = useTimetableStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Sign Out
        </button>
      </div>

      {currentStep === 0 ? (
        <header className="py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">SynClass</h1>
          </div>
          <p className="text-lg text-gray-600">Intelligent Timetable Generation System</p>
        </header>
      ) : null}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <span
                  key={step}
                  className="text-sm text-gray-600 w-24 text-center"
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <TimingForm />;
      case 1:
        return <SubjectForm />;
      case 2:
        return <FacultyForm />;
      case 3:
        return <RoomForm />;
      case 4:
        return <Summary />;
      default:
        return null;
    }
  }
}

export default App;