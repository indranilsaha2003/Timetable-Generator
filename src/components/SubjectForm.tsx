import React, { useState } from 'react';
import { useTimetableStore } from '../store/timetableStore';

export default function SubjectForm() {
  const { subjects, setSubjects, nextStep, previousStep } = useTimetableStore();
  const [newSubject, setNewSubject] = useState<SubjectState>({
    name: '',
    classesPerWeek: 1,
    subjectCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.classesPerWeek) {
      setSubjects([...subjects, newSubject]);
      setNewSubject({ name: '', classesPerWeek: 1, subjectCode: '' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Subjects</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Name
          </label>
          <input
            type="text"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject Code
          </label>
          <input
            type="text"
            value={newSubject.subjectCode}
            onChange={(e) => setNewSubject({ ...newSubject, subjectCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Classes Per Week
          </label>
          <input
            type="number"
            min="1"
            value={newSubject.classesPerWeek}
            onChange={(e) => setNewSubject({ ...newSubject, classesPerWeek: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Subject
        </button>
      </form>

      <div className="space-y-2">
        {subjects.map((subject, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">{subject.name}</p>
              <p className="text-sm text-gray-600">
                Code: {subject.subjectCode} | Classes per week: {subject.classesPerWeek}
              </p>
            </div>
            <button
              onClick={() => setSubjects(subjects.filter((_, i) => i !== index))}
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