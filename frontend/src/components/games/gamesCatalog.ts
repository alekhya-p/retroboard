export type GameId = 'doodle' | 'trivia' | 'emoji' | 'two_truths' | 'meeting_roulette';

export interface GameDef {
  id: GameId;
  name: string;
  emoji: string;
  description: string;
  players: string;
  /** card background (used by pickers) */
  bg: string;
}

/** Single source of truth for the game catalog (board games + /play). */
export const GAMES: GameDef[] = [
  {
    id: 'doodle',
    name: 'Doodle Quest',
    emoji: '🎨',
    description: 'Pictionary on the board. One person draws an AI-picked word, everyone else guesses live.',
    players: '3+ players · 5 min',
    bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
  },
  {
    id: 'trivia',
    name: 'Trivia Race',
    emoji: '🧠',
    description: 'AI-generated team trivia. First to answer correctly scores. Great for offshore/onshore mixes.',
    players: '2+ players · 5 min',
    bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  },
  {
    id: 'emoji',
    name: 'Emoji Tales',
    emoji: '😄',
    description: 'Tell your sprint as emojis only. The AI picks the most creative entry as the winner.',
    players: '2+ players · 3 min',
    bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  },
  {
    id: 'two_truths',
    name: 'Two Truths & a Lie',
    emoji: '🤥',
    description: "Share two truths and one lie. The team votes on the fib. AI can suggest plausible lies if you're stuck.",
    players: '3+ players · 8 min',
    bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  },
  {
    id: 'meeting_roulette',
    name: 'Meeting Roulette',
    emoji: '🎰',
    description: 'Randomly pair everyone for short 1:1 chats with AI icebreakers. Great for onboarding new joiners.',
    players: '2+ players · 5-15 min',
    bg: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
  },
];

export function getGame(id: string | undefined): GameDef | undefined {
  return GAMES.find((g) => g.id === id);
}
