import type { Module, Question } from './types';

export const MODULES: Module[] = Array.from({ length: 27 }, (_, i) => ({
  id: `M${i + 1}`,
  title: `Module ${i + 1} — Traffic Rules & Safety`,
  progress: Math.floor(Math.random() * 100),
}));

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    moduleId: "M1",
    text: "What should a driver do when approaching a yellow traffic light?",
    imageUrl: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800",
    options: [
      { id: "o1", text: "Speed up to pass through" },
      { id: "o2", text: "Slow down and prepare to stop" },
      { id: "o3", text: "Come to an immediate stop" },
      { id: "o4", text: "Sound the horn" },
    ],
    correctOptionId: "o2",
    explanation: "Yellow lights warn drivers to prepare to stop safely before the intersection.",
  },
  {
    id: "q2",
    moduleId: "M2",
    text: "When must drivers yield to pedestrians?",
    options: [
      { id: "o1", text: "Never" },
      { id: "o2", text: "Always, at all crosswalks" },
      { id: "o3", text: "Only at night" },
      { id: "o4", text: "Only when police are present" },
    ],
    correctOptionId: "o2",
    explanation: "Pedestrian safety is the top priority; drivers must always yield at crosswalks.",
  },
  {
    id: "q3",
    moduleId: "M3",
    text: "Who has the right of way when entering a roundabout?",
    options: [
      { id: "o1", text: "Vehicles already in the roundabout yield to entering vehicles" },
      { id: "o2", text: "Entering vehicles yield to those already in the roundabout" },
      { id: "o3", text: "No one has right of way" },
      { id: "o4", text: "Only buses have right of way" },
    ],
    correctOptionId: "o2",
    explanation: "Standard rule: vehicles entering a roundabout must yield to traffic already circulating.",
  },
  {
    id: "q4",
    moduleId: "M4",
    text: "What is the recommended following distance in normal conditions?",
    options: [
      { id: "o1", text: "1 second" },
      { id: "o2", text: "2 seconds" },
      { id: "o3", text: "3 seconds" },
      { id: "o4", text: "5 seconds" },
    ],
    correctOptionId: "o3",
    explanation: "The 3-second rule provides adequate stopping distance in normal driving conditions.",
  },
  {
    id: "q5",
    moduleId: "M5",
    text: "When is it legal to use a mobile phone while driving?",
    options: [
      { id: "o1", text: "When using hands-free devices" },
      { id: "o2", text: "During traffic jams" },
      { id: "o3", text: "Only for emergencies" },
      { id: "o4", text: "Never while the vehicle is in motion" },
    ],
    correctOptionId: "o1",
    explanation: "Hands-free devices allow communication while keeping hands on the wheel and eyes on the road.",
  },
];
