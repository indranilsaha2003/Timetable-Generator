import React, { useState } from 'react';
import { useTimetableStore } from '../store/timetableStore';

export default function RoomForm() {
  const { rooms, setRooms, nextStep, previousStep } = useTimetableStore();
  const [roomCount, setRoomCount] = useState(rooms.length || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const handleRoomChange = (index: number, roomNumber: string) => {
    const newRooms = [...rooms];
    newRooms[index] = { roomNumber };
    setRooms(newRooms);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Rooms
        </label>
        <input
          type="number"
          min="1"
          value={roomCount}
          onChange={(e) => {
            const count = parseInt(e.target.value);
            setRoomCount(count);
            setRooms(
              Array(count)
                .fill(null)
                .map((_, i) => rooms[i] || { roomNumber: '' })
            );
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-4">
        {Array(roomCount)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="border p-4 rounded-md">
              <h3 className="font-medium mb-3">Room {index + 1}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Number
                </label>
                <input
                  type="text"
                  required
                  value={rooms[index]?.roomNumber || ''}
                  onChange={(e) => handleRoomChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={previousStep}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Previous
        </button>
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