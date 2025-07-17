import React, { useState } from 'react';
import { useTimetableStore } from '../store/timetableStore';

export default function FacultyForm() {
  const { faculties, setFaculties, subjects, nextStep, previousStep } = useTimetableStore();
  const [newFaculty, setNewFaculty] = useState<FacultyState>({
    name: '',
    subjectTaught: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaculty.name && newFaculty.subjectTaught) {
      setFaculties([...faculties, newFaculty]);
      setNewFaculty({ name: '', subjectTaught: '' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Faculties</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Faculty Name
          </label>
          <input
            type="text"
            value={newFaculty.name}
            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Taught
          </label>
          <select
            value={newFaculty.subjectTaught}
            onChange={(e) => setNewFaculty({ ...newFaculty, subjectTaught: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Faculty
        </button>
      </form>

      <div className="space-y-2">
        {faculties.map((faculty, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">{faculty.name}</p>
              <p className="text-sm text-gray-600">Subject: {faculty.subjectTaught}</p>
            </div>
            <button
              onClick={() => setFaculties(faculties.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={previousStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}