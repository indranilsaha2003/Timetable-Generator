import React from 'react';
import { useTimetableStore } from '../store/timetableStore';

function TimingForm() {
  const { timing, setTiming, nextStep } = useTimetableStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Institute Start Time
          </label>
          <input
            type="time"
            required
            value={timing.startTime}
            onChange={(e) =>
              setTiming({ ...timing, startTime: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Institute End Time
          </label>
          <input
            type="time"
            required
            value={timing.endTime}
            onChange={(e) =>
              setTiming({ ...timing, endTime: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Break Start Time
          </label>
          <input
            type="time"
            required
            value={timing.breakStart}
            onChange={(e) =>
              setTiming({ ...timing, breakStart: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Break End Time
          </label>
          <input
            type="time"
            required
            value={timing.breakEnd}
            onChange={(e) =>
              setTiming({ ...timing, breakEnd: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default TimingForm;