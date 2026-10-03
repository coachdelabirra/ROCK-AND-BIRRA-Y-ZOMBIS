import React, { useState } from 'react';
import { ClassKey, DifficultyKey } from '../types/game';
import { CHARACTER_CLASSES, GAME_DIFFICULTIES } from '../data/gameData';
import { sound } from '../utils/audio';
import { ArrowLeft, Shield, Zap, Flame, Skull, Pizza, Beer } from 'lucide-react';

interface CharacterSelectProps {
  onBack: () => void;
  onStartGame: (name: string, classKey: ClassKey, diffKey: DifficultyKey) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onBack,
  onStartGame,
}) => {
  const [name, setName] = useState('Coach de la Birra');
  const [selectedClass, setSelectedClass] = useState<ClassKey>('rockero');
  const [selectedDiff, setSelectedDiff] = useState<DifficultyKey>('normal');

  const currentClass = CHARACTER_CLASSES.find(c => c.key === selectedClass)!;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playRockPowerChord(220);
    onStartGame(name.trim() || 'Sobreviviente Sin Nombre', selectedClass, selectedDiff);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] p-4 md:p-8 flex flex-col items-center justify-center bg-stone-950 text-stone-100">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3">
          <button
            onClick={() => { sound.playBlip(); onBack(); }}
            className="nes-btn px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-pixel text-sm flex items-center gap-1.5 cursor-pointer rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLVER AL MENÚ
          </button>
          <div className="text-right">
            <span className="font-bungee text-amber-400 text-sm">FICHA DE SOBREVIVIENTE</span>
            <p className="font-pixel text-xs text-stone-400">Antes de que el mundo se termine de ir a la mierda</p>
          </div>
        </div>

        {/* Protagonist Lore Banner */}
        <div className="nes-box p-3 bg-stone-900 border-2 border-amber-500/70 text-xs text-stone-200">
          <div className="flex items-center gap-2 font-bungee text-amber-400 text-xs mb-1">
            <span>🍺</span>
            <span>PROTAGONISTA: EL COACH DE LA BIRRA</span>
          </div>
          <p className="font-body text-stone-300 text-xs leading-relaxed mb-2">
            Un sobreviviente común y corriente que, por alguna inexplicable razón, considera que sobrevivir al apocalipsis no tiene sentido si no puede terminar el día con una buena pizza y una cerveza helada.
          </p>
          <div className="bg-black/70 p-1.5 rounded border border-stone-800 font-pixel text-emerald-400 font-bold text-center">
            Regla Principal: “Mientras quede una pizza y una cerveza, todavía no se acaba el mundo.”
          </div>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          
          {/* Survivor Name Input */}
          <div className="nes-box p-4 bg-stone-900 border-2 border-stone-700">
            <label className="block font-bungee text-sm text-amber-400 mb-2">
              ¿CÓMO TE LLAMAS, SOBREVIVIENTE DEL ROCK?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                className="flex-1 bg-black border-2 border-amber-500/60 p-2.5 font-bungee text-stone-100 text-base focus:border-amber-400 focus:outline-none rounded"
                placeholder="Ingresa tu apodo..."
              />
              <button
                type="button"
                onClick={() => {
                  const nicknames = ['El Coach', 'Rulo El Sucio', 'Vane Punk', 'Tito Resaca', 'Charly Overdrive', 'Gaby Cadenazo'];
                  const picked = nicknames[Math.floor(Math.random() * nicknames.length)];
                  setName(picked);
                  sound.playBlip();
                }}
                className="nes-btn px-3 bg-stone-800 hover:bg-stone-700 text-amber-300 font-pixel text-xs rounded cursor-pointer"
              >
                Aleatorio
              </button>
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <h2 className="font-bungee text-sm text-stone-300 mb-3 flex items-center gap-2">
              <span>ELIGE TU BANDA O CLASE:</span>
              <span className="text-xs font-pixel text-amber-400 font-normal">
                (Define tus atributos y habilidad especial)
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CHARACTER_CLASSES.map((cls) => {
                const isSelected = selectedClass === cls.key;
                return (
                  <div
                    key={cls.key}
                    onClick={() => { sound.playBlip(); setSelectedClass(cls.key); }}
                    className={`nes-box p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-stone-900 shadow-[4px_4px_0px_#f8b800]'
                        : 'border-stone-800 bg-stone-950 opacity-80 hover:opacity-100 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bungee text-base text-amber-400">
                        {cls.name}
                      </span>
                      {cls.key === 'rockero' && <span className="text-2xl">🎸</span>}
                      {cls.key === 'punk' && <span className="text-2xl">🔥</span>}
                      {cls.key === 'motoquero' && <span className="text-2xl">🏍️</span>}
                    </div>

                    <p className="font-rock text-xs text-amber-200/90 mb-2">
                      "{cls.subtitle}"
                    </p>

                    <p className="font-body text-xs text-stone-300 leading-relaxed mb-4 min-h-[48px]">
                      {cls.description}
                    </p>

                    {/* Class Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-pixel mb-3 bg-black/60 p-2 rounded border border-stone-800">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">VIDA:</span>
                        <span className="font-bold text-emerald-400">{cls.maxHp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">ATAQUE:</span>
                        <span className="font-bold text-red-400">{cls.attack}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">DEFENSA:</span>
                        <span className="font-bold text-sky-400">{cls.defense}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">ENERGÍA:</span>
                        <span className="font-bold text-amber-400">{cls.maxEnergy}</span>
                      </div>
                    </div>

                    {/* Skill Info */}
                    <div className="bg-purple-950/40 border border-purple-800/60 p-2 rounded text-xs">
                      <div className="font-bungee text-[11px] text-purple-300 flex items-center justify-between mb-1">
                        <span>⚡ {cls.skillName}</span>
                        <span className="text-stone-400 font-pixel">Costo: {cls.skillCost} E</span>
                      </div>
                      <p className="font-body text-[11px] text-stone-300 leading-tight">
                        {cls.skillDesc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <h2 className="font-bungee text-sm text-stone-300 mb-3 flex items-center gap-2">
              <span>DIFICULTAD DEL APOCALIPSIS:</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {GAME_DIFFICULTIES.map((diff) => {
                const isSelected = selectedDiff === diff.key;
                return (
                  <div
                    key={diff.key}
                    onClick={() => { sound.playBlip(); setSelectedDiff(diff.key); }}
                    className={`nes-box p-3 cursor-pointer text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-stone-900 shadow-[3px_3px_0px_#f8b800]'
                        : 'border-stone-800 bg-stone-950 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="font-bungee text-xs text-amber-400 mb-1">
                      {diff.name}
                    </div>
                    <p className="font-body text-[11px] text-stone-300 mb-2">
                      {diff.desc}
                    </p>
                    <div className="flex items-center justify-center gap-2 font-pixel text-xs text-emerald-400 bg-black/60 py-1 rounded">
                      <span>🍕 {diff.pizzasRequired} Pizzas</span>
                      <span>·</span>
                      <span>🍺 {diff.beersRequired} Birras</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full nes-btn py-4 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] rounded"
            >
              <span>¡SALIR AL APOCALIPSIS CON GUITARRA Y SED! 🎸🍻</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
