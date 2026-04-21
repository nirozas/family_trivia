import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FamilyGroup, GameState } from '../types/index';

type GameContextType = {
  gameState: GameState;
  addFamily: (name: string, avatar: string) => void;
  removeFamily: (id: string) => void;
  updateScore: (familyId: string, points: number, isCorrect: boolean) => void;
  nextTurn: () => void;
  resetGame: () => void;
  markQuestionAsAnswered: (id: string) => void;
};

const defaultState: GameState = {
  families: [],
  currentFamilyIndex: 0,
  answeredQuestionIds: [],
  isGameOver: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('heritage_quest_state');
      if (!saved) return defaultState;
      const parsed = JSON.parse(saved);
      // Migration: handle old 'questionsAnswered' key
      return {
        ...defaultState,
        ...parsed,
        answeredQuestionIds: parsed.answeredQuestionIds || parsed.questionsAnswered || [],
      };
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem('heritage_quest_state', JSON.stringify(gameState));
  }, [gameState]);

  const addFamily = (name: string, avatar: string) => {
    const newFamily: FamilyGroup = {
      id: Math.random().toString(36).slice(2),
      name,
      avatar,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    };
    setGameState((prev) => ({ ...prev, families: [...prev.families, newFamily] }));
  };

  const removeFamily = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      families: prev.families.filter((f) => f.id !== id),
    }));
  };

  const updateScore = (familyId: string, points: number, isCorrect: boolean) => {
    setGameState((prev) => ({
      ...prev,
      families: prev.families.map((f) =>
        f.id === familyId 
          ? { 
              ...f, 
              score: Math.max(0, f.score + points),
              correctAnswers: isCorrect ? f.correctAnswers + 1 : f.correctAnswers,
              wrongAnswers: !isCorrect ? f.wrongAnswers + 1 : f.wrongAnswers
            } 
          : f
      ),
    }));
  };

  const nextTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentFamilyIndex: prev.families.length > 0 ? (prev.currentFamilyIndex + 1) % prev.families.length : 0,
    }));
  };

  const markQuestionAsAnswered = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      answeredQuestionIds: [...prev.answeredQuestionIds, id],
    }));
  };

  const resetGame = () => {
    setGameState(defaultState);
    localStorage.removeItem('heritage_quest_state');
  };

  return (
    <GameContext.Provider
      value={{ gameState, addFamily, removeFamily, updateScore, nextTurn, resetGame, markQuestionAsAnswered }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
