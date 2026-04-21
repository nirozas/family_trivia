import type { TriviaQuestion } from '../types/index';
import { globalTrailblazersQuestions } from './categories/global-trailblazers';
import { thePitchSoccerBeyondQuestions } from './categories/the-pitch-soccer-beyond';
import { weirdButTrueQuestions } from './categories/weird-but-true';
import { disneyAnimationMagicQuestions } from './categories/disney-animation-magic';
import { worldShapersGlobalIconsQuestions } from './categories/world-shapers-global-icons';
import { expeditionGeographyQuestions } from './categories/expedition-geography';
import { timeMachineHistoryQuestions } from './categories/time-machine-history';
import { theLabScienceQuestions } from './categories/the-lab-science';
import { brainFlexMathChallengesQuestions } from './categories/brain-flex-math-challenges';
import { animalKingdomQuestions } from './categories/animal-kingdom';
import { theGlobalKitchenQuestions } from './categories/the-global-kitchen';
import { riddleMeThisQuestions } from './categories/riddle-me-this';
import { screenTimeModernTechAppsQuestions } from './categories/screen-time-modern-tech-apps';
import { artsMasterpiecesQuestions } from './categories/arts-masterpieces';
import { dailyLifeInventionsQuestions } from './categories/daily-life-inventions';

export const QUESTIONS: TriviaQuestion[] = [
  // Core Categories
  ...animalKingdomQuestions,
  ...globalTrailblazersQuestions,
  ...thePitchSoccerBeyondQuestions,
  ...weirdButTrueQuestions,
  ...disneyAnimationMagicQuestions,
  ...worldShapersGlobalIconsQuestions,
  ...expeditionGeographyQuestions,
  ...timeMachineHistoryQuestions,
  ...theLabScienceQuestions,
  ...brainFlexMathChallengesQuestions,
  ...theGlobalKitchenQuestions,
  ...riddleMeThisQuestions,
  ...screenTimeModernTechAppsQuestions,
  ...artsMasterpiecesQuestions,
  ...dailyLifeInventionsQuestions
];
