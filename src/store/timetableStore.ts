import { create } from 'zustand';

interface TimingState {
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
}

interface FacultyState {
  name: string;
  subjectTaught: string;
}

interface SubjectState {
  name: string;
  classesPerWeek: number;
  subjectCode?: string;
}

interface RoomState {
  roomNumber: string;
}

interface TimetableStore {
  currentStep: number;
  timing: TimingState;
  faculties: FacultyState[];
  subjects: SubjectState[];
  rooms: RoomState[];
  generatedTimetable: any;
  
  setTiming: (timing: TimingState) => void;
  setFaculties: (faculties: FacultyState[]) => void;
  setSubjects: (subjects: SubjectState[]) => void;
  setRooms: (rooms: RoomState[]) => void;
  setGeneratedTimetable: (timetable: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: number) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  currentStep: 0,
  timing: {
    startTime: '',
    endTime: '',
    breakStart: '',
    breakEnd: '',
  },
  faculties: [],
  subjects: [],
  rooms: [],
  generatedTimetable: null,
  
  setTiming: (timing) => set({ timing }),
  setFaculties: (faculties) => set({ faculties }),
  setSubjects: (subjects) => set({ subjects }),
  setRooms: (rooms) => set({ rooms }),
  setGeneratedTimetable: (timetable) => set({ generatedTimetable: timetable }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setStep: (step) => set({ currentStep: step }),
}));