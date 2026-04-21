export type CategoryType = 
  | 'Global Trailblazers'
  | 'The Pitch: Soccer & Beyond'
  | 'Weird But True?'
  | 'Disney & Animation Magic'
  | 'World Shapers: Global Icons'
  | 'Expedition: Geography'
  | 'Time Machine: History'
  | 'The Lab: Science'
  | 'Brain Flex: Math Challenges'
  | 'Animal Kingdom'
  | 'The Global Kitchen'
  | 'Riddle Me This'
  | 'Screen Time: Modern Tech & Apps'
  | 'Arts & Masterpieces'
  | 'Daily Life & Inventions';

export type DifficultyType = 'easy' | 'medium' | 'hard';

export type TriviaQuestion = {
  id: string;
  category: CategoryType;
  difficulty: DifficultyType;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
  explanation?: string;
};

export type FamilyGroup = {
  id: string;
  name: string;
  avatar: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
};

export type GameState = {
  families: FamilyGroup[];
  currentFamilyIndex: number;
  answeredQuestionIds: string[];
  isGameOver: boolean;
};
