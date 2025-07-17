import React, { useState, useEffect } from 'react';
import { useTimetableStore } from '../store/timetableStore';
import { supabase } from '../lib/supabase';
import TimetableView from './TimetableView';

export default function Summary() {
  const { timing, faculties, subjects, rooms, previousStep } = useTimetableStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);
  const [showTimetable, setShowTimetable] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (session?.user) {
      setUserId(session.user.id);
    }
  };

  // Display the summary data section
  const renderSummaryData = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Institute Timing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Time</p>
            <p>{timing.startTime}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">End Time</p>
            <p>{timing.endTime}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Break Start</p>
            <p>{timing.breakStart}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Break End</p>
            <p>{timing.breakEnd}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Faculties ({faculties.length})</h3>
        <div className="space-y-2">
          {faculties.map((faculty, index) => (
            <div key={index} className="p-2 border rounded">
              <p className="font-medium">{faculty.name}</p>
              <p className="text-sm text-gray-600">Subject: {faculty.subjectTaught}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Subjects ({subjects.length})</h3>
        <div className="space-y-2">
          {subjects.map((subject, index) => (
            <div key={index} className="p-2 border rounded">
              <p className="font-medium">{subject.name}</p>
              <p className="text-sm text-gray-600">
                Code: {subject.subjectCode} | Classes per week: {subject.classesPerWeek}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Rooms ({rooms.length})</h3>
        <div className="grid grid-cols-3 gap-2">
          {rooms.map((room, index) => (
            <div key={index} className="p-2 border rounded text-center">
              <p className="font-medium">{room.roomNumber}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={previousStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Previous Step
        </button>
        {isAuthenticated && (
          <button
            onClick={handleGenerateTimetable}
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Generating...' : 'Generate Timetable'}
          </button>
        )}
      </div>
    </div>
  );

  const handleGenerateTimetable = async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Save institute timing
      const { error: timingError } = await supabase.from('institute_timings').insert([
        {
          start_time: timing.startTime,
          end_time: timing.endTime,
          break_start: timing.breakStart,
          break_end: timing.breakEnd,
          user_id: userId
        }
      ]);

      if (timingError) throw timingError;

      // Save faculties
      const { error: facultiesError } = await supabase.from('faculties').insert(
        faculties.map(faculty => ({
          name: faculty.name,
          subject_taught: faculty.subjectTaught,
          user_id: userId
        }))
      );

      if (facultiesError) throw facultiesError;

      // Save subjects
      const { error: subjectsError } = await supabase.from('subjects').insert(
        subjects.map(subject => ({
          name: subject.name,
          classes_per_week: subject.classesPerWeek,
          subject_code: subject.subjectCode,
          user_id: userId
        }))
      );

      if (subjectsError) throw subjectsError;

      // Save rooms
      const { error: roomsError } = await supabase.from('rooms').insert(
        rooms.map(room => ({
          room_number: room.roomNumber,
          user_id: userId
        }))
      );

      if (roomsError) throw roomsError;

      // Simple timetable generation logic (placeholder)
      const timetable = generateBasicTimetable();
      setGeneratedTimetable(timetable);
      setShowTimetable(true);

      alert('Timetable generated successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function for basic timetable generation
  const generateBasicTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const startHour = parseInt(timing.startTime.split(':')[0]);
    const endHour = parseInt(timing.endTime.split(':')[0]);
    
    const timetable: Record<string, Record<number, string>> = {};
    
    // Keep track of last subject for each day
    const lastSubjects: Record<string, string> = {};
    
    days.forEach(day => {
      timetable[day] = {};
      for (let hour = startHour; hour < endHour; hour++) {
        if (hour === parseInt(timing.breakStart.split(':')[0])) {
          timetable[day][hour] = 'Break';
          continue;
        }
        
        // Filter out the last subject used to avoid consecutive classes
        const availableSubjects = subjects.filter(subject => 
          subject.name !== lastSubjects[day]
        );
        
        if (availableSubjects.length > 0) {
          const randomSubject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
          // Find faculty teaching this subject
          const availableFaculties = faculties.filter(faculty => 
            faculty.subjectTaught === randomSubject.name
          );
          
          if (availableFaculties.length > 0) {
            const randomFaculty = availableFaculties[Math.floor(Math.random() * availableFaculties.length)];
            const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
            
            timetable[day][hour] = `${randomSubject.name}\n${randomFaculty.name}\nRoom ${randomRoom.roomNumber}`;
            lastSubjects[day] = randomSubject.name;
          }
        }
      }
    });
    
    return timetable;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Summary & Generation</h2>
      {renderSummaryData()}
      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
      
      {showTimetable && generatedTimetable && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Generated Timetable</h3>
          <TimetableView 
            schedule={generatedTimetable} 
            timing={timing}
          />
        </div>
      )}
    </div>
  );
}