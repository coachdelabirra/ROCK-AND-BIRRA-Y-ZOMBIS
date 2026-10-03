export type ClassKey = 'rockero' | 'punk' | 'motoquero';
export type DifficultyKey = 'facil' | 'normal' | 'dificil';
export type ZoneKey = 'bunker' | 'supermercado' | 'barrio' | 'bar' | 'gasolinera' | 'secreta';

export interface CharacterClass {
  key: ClassKey;
  name: string;
  subtitle: string;
  description: string;
  maxHp: number;
  attack: number;
  defense: number;
  maxEnergy: number;
  skillName: string;
  skillCost: number;
  skillDesc: string;
}

export interface Difficulty {
  key: DifficultyKey;
  name: string;
  desc: string;
  apocalypseMult: number;
  enemyMult: number;
  pizzasRequired: number;
  beersRequired: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  desc: string;
  type: 'health' | 'energy' | 'special';
  value: number;
  icon: string;
}

export interface TriviaQuestion {
  id: string;
  category: 'rock' | 'cine';
  isHard: boolean;
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface EnemyTemplate {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  exp: number;
  caps: number;
  isBoss?: boolean;
  bossType?: 'golpe' | 'drenaje';
}

export interface ActiveEnemy {
  name: string;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  exp: number;
  caps: number;
  isBoss: boolean;
  bossType?: 'golpe' | 'drenaje';
  image?: string;
}

export interface PointAndClickHotspot {
  id: string;
  label: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  tooltip: string;
  actionType: 'loot' | 'inspect' | 'radio' | 'rest' | 'secret';
  itemReward?: string;
  capsReward?: number;
  flavorText: string;
}

export interface ZoneData {
  key: ZoneKey;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  bgImage: string;
  connections: ZoneKey[];
  isSafeBunker?: boolean;
  enemyEncounterRate: number;
  pizzaChance: number;
  beerChance: number;
  templates: EnemyTemplate[];
  hotspots: PointAndClickHotspot[];
}

export interface GameStats {
  triviaCorrect: number;
  triviaFailed: number;
  bestStreak: number;
  currentStreak: number;
  zombiesDefeated: number;
  itemsFound: number;
  pizzasFound: number;
  beersFound: number;
}

export interface PlayerState {
  name: string;
  classKey: ClassKey;
  difficultyKey: DifficultyKey;
  level: number;
  exp: number;
  expNext: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  caps: number;
  currentZone: ZoneKey;
  pizzas: number;
  pizzasRequired: number;
  beers: number;
  beersRequired: number;
  apocalypse: number; // 0 - 100
  apocalypseMax: number;
  inventory: InventoryItem[];
  bossFerroDefeated: boolean;
  bossAlmaDefeated: boolean;
  secretRefugeLooted: boolean;
  lootedHotspots: string[];
  usedTriviaQuestions: string[];
  stats: GameStats;
}

export type GameScreen = 
  | 'TITLE'
  | 'CLASS_SELECT'
  | 'DIFFICULTY_SELECT'
  | 'EXPLORING'
  | 'COMBAT'
  | 'MAP_VIEW'
  | 'INVENTORY_VIEW'
  | 'STATS_VIEW'
  | 'RADIO_VIEW'
  | 'VICTORY'
  | 'GAME_OVER'
  | 'APOCALYPSE_OVER';

export interface CombatLog {
  id: string;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'crit' | 'item';
}
