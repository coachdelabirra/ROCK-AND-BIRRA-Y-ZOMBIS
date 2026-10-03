import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { GAME_MANIFESTO } from '../data/gameData';
import { Play, RotateCcw, BarChart2, Radio, Beer, Skull, Volume2, Sparkles } from 'lucide-react';

interface TitleScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenStats: () => void;
  onOpenRadio: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  onNewGame,
  onContinueGame,
  onOpenStats,
  onOpenRadio,
}) => {
  const [radioActive, setRadioActive] = useState(sound.isMusicPlaying);

  const toggleBackgroundRadio = () => {
    if (sound.isMusicPlaying) {
      sound.stopRadio();
      setRadioActive(false);
    } else {
      sound.startRadio(0);
      setRadioActive(true);
      sound.playRockPowerChord(220);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-4 md:p-8 bg-radial from-stone-900 via-black to-black text-stone-100 overflow-hidden">
      
      {/* Background ambient decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#f8b800_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Top Banner / Radio Station Indicator */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b-2 border-amber-500/40 pb-3 text-xs font-pixel text-amber-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>SINTONIZANDO: ROCK AND BIRRA RADIO (FM 99.1)</span>
        </div>
        <button
          onClick={toggleBackgroundRadio}
          className="nes-btn px-3 py-1 bg-amber-500 text-black font-bungee text-xs flex items-center gap-1.5 cursor-pointer hover:bg-amber-400"
        >
          <Volume2 className="w-3.5 h-3.5" />
          {radioActive ? 'PARAR MÚSICA' : 'ACTIVAR ROCK RADIO'}
        </button>
      </div>

      {/* Main Title Hero Box */}
      <div className="relative z-10 my-auto w-full max-w-2xl text-center py-6">
        
        {/* Retro 8-bit & Comic Emblem Header */}
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <span className="text-3xl animate-bounce">🎸</span>
          <div className="inline-block px-3 py-1 bg-red-600 text-white font-bungee text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_#000]">
            Aventura Gráfica Point & Click
          </div>
          <span className="text-3xl animate-bounce">🍺</span>
        </div>

        {/* Giant Retro Title */}
        <h1 className="font-bungee text-4xl sm:text-5xl md:text-6xl text-amber-400 drop-shadow-[4px_4px_0px_#000] tracking-tight leading-none mb-3">
          ROCK AND BIRRA
          <span className="block text-3xl sm:text-4xl md:text-5xl text-red-500 mt-1">
            AND PIZZA Y ZOMBIS
          </span>
        </h1>

        {/* Iconic Slogan & Hashtag */}
        <div className="space-y-1 mb-6">
          <p className="font-rock text-xl md:text-2xl text-stone-200 tracking-wide drop-shadow">
            {GAME_MANIFESTO.slogan}
          </p>
          <div className="inline-block bg-amber-400 text-stone-950 font-bungee px-3 py-0.5 text-xs rounded border border-black shadow-[2px_2px_0px_#000]">
            {GAME_MANIFESTO.hashtag}
          </div>
        </div>

        {/* Mascot & Skull Comic Showcase */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
          <div className="nes-box p-3 flex flex-col items-center justify-center bg-stone-900 border-2 border-amber-500/60 text-center">
            <div className="text-4xl mb-1 animate-beer-bubble">🍺</div>
            <span className="font-pixel text-[13px] text-amber-300 font-bold leading-tight">
              BIRRA FRÍA
            </span>
          </div>
          <div className="nes-box p-3 flex flex-col items-center justify-center bg-stone-900 border-2 border-orange-500/60 text-center">
            <div className="text-4xl mb-1">🍕</div>
            <span className="font-pixel text-[13px] text-orange-300 font-bold leading-tight">
              PIZZA CALIENTE
            </span>
          </div>
          <div className="nes-box p-3 flex flex-col items-center justify-center bg-stone-900 border-2 border-red-500/60 text-center">
            <div className="text-4xl mb-1">💀</div>
            <span className="font-pixel text-[13px] text-red-400 font-bold leading-tight">
              ZOMBIS ROCKEROS
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          {hasSavedGame && (
            <button
              onClick={() => { sound.playConfirm(); onContinueGame(); }}
              className="w-full nes-btn py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bungee text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
            >
              <RotateCcw className="w-4 h-4" />
              CONTINUAR PARTIDA
            </button>
          )}

          <button
            onClick={() => { sound.playConfirm(); onNewGame(); }}
            className="w-full nes-btn py-3 px-5 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
          >
            <Play className="w-4 h-4 fill-black" />
            NUEVA PARTIDA
          </button>
        </div>

        {/* Secondary options */}
        <div className="flex items-center justify-center gap-3 mt-4 text-xs">
          <button
            onClick={() => { sound.playBlip(); onOpenStats(); }}
            className="nes-btn px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-pixel text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
            ESTADÍSTICAS & TRIVIAS
          </button>
          
          <button
            onClick={() => { sound.playBlip(); onOpenRadio(); }}
            className="nes-btn px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-pixel text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            DIAL DE RADIO
          </button>
        </div>

      </div>

      {/* Manifesto & Credits Footer */}
      <div className="relative z-10 w-full max-w-3xl text-center space-y-2 border-t-2 border-stone-800 pt-4 pb-2">
        <blockquote className="font-body text-sm md:text-base text-amber-200/90 italic font-semibold">
          "{GAME_MANIFESTO.text}"
        </blockquote>
        <p className="font-pixel text-xs text-stone-500 tracking-wider">
          🍻 {GAME_MANIFESTO.credits} 🍻
        </p>
      </div>

    </div>
  );
};
