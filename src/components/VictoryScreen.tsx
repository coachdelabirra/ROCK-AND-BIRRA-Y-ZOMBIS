import React, { useEffect } from 'react';
import { PlayerState } from '../types/game';
import { GAME_MANIFESTO } from '../data/gameData';
import { sound } from '../utils/audio';
import { Trophy, Beer, Pizza, RotateCcw, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  player: PlayerState;
  onPlayAgain: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ player, onPlayAgain }) => {
  useEffect(() => {
    sound.playBeerSound();
    setTimeout(() => {
      sound.playLevelUp();
    }, 600);
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 md:p-8 bg-radial from-amber-950/40 via-stone-950 to-black text-stone-100">
      <div className="w-full max-w-2xl nes-box p-6 md:p-8 bg-stone-900 border-4 border-amber-400 text-center shadow-[10px_10px_0px_#000] space-y-6">
        
        {/* Victory Trophy & Emblems */}
        <div className="flex items-center justify-center gap-4 text-4xl">
          <span>🍕</span>
          <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-black flex items-center justify-center shadow-lg animate-bounce">
            <Trophy className="w-8 h-8 text-black fill-black" />
          </div>
          <span>🍺</span>
        </div>

        {/* Big Victory Heading */}
        <div>
          <span className="font-pixel text-xs text-amber-300 font-bold uppercase tracking-widest block mb-1">
            ¡MISIÓN CUMPLIDA! · EL BÚNKER ESTÁ DE FIESTA
          </span>
          <h1 className="font-bungee text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight">
            ¡VICTORIA TOTAL!
          </h1>
          <p className="font-rock text-lg text-emerald-400 mt-1">
            "Esta vaina se jodió... pero sobrevivimos con estilo."
          </p>
        </div>

        {/* Narrative Celebration Story */}
        <div className="bg-black/70 border-2 border-stone-800 p-4 rounded-lg text-left font-body text-sm space-y-3 text-stone-200">
          <p className="leading-relaxed">
            <strong className="text-amber-400 font-bungee">{player.name.toUpperCase()}</strong> entra pateando la puerta blindada del búnker con las bolsas rebalsando. Pones la pizza caliente en el medio de la mesa de madera y destapas una botella de cerveza artesanal con un chasquido celestial.
          </p>
          <p className="font-rock text-base text-amber-300 text-center py-1">
            “Mientras quede una pizza y una cerveza bien fría, todavía no se acaba el mundo.”
          </p>
          <p className="text-xs text-stone-400 text-center">
            El generador tose humo, la radio sintoniza un solo de guitarra atronador y los zombis afuera solo pueden escuchar la fiesta de la resistencia.
          </p>
        </div>

        {/* Quest Results breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-pixel text-xs bg-stone-950 p-3 rounded border border-stone-800">
          <div>
            <span className="text-stone-400 block">PIZZAS:</span>
            <span className="font-bungee text-sm text-orange-400">{player.pizzas}</span>
          </div>
          <div>
            <span className="text-stone-400 block">CERVEZAS:</span>
            <span className="font-bungee text-sm text-amber-400">{player.beers}</span>
          </div>
          <div>
            <span className="text-stone-400 block">TRIVIAS OK:</span>
            <span className="font-bungee text-sm text-emerald-400">{player.stats.triviaCorrect}</span>
          </div>
          <div>
            <span className="text-stone-400 block">ZOMBIS:</span>
            <span className="font-bungee text-sm text-red-400">{player.stats.zombiesDefeated}</span>
          </div>
        </div>

        {/* Game Manifesto */}
        <div className="border-t-2 border-stone-800 pt-4 space-y-2">
          <blockquote className="font-rock text-lg md:text-xl text-amber-200">
            "{GAME_MANIFESTO.text}"
          </blockquote>
          <div className="inline-block bg-amber-400 text-black font-bungee text-xs px-3 py-1 rounded border border-black shadow">
            {GAME_MANIFESTO.hashtag}
          </div>
        </div>

        {/* Play Again Button */}
        <div className="pt-2">
          <button
            onClick={() => { sound.playConfirm(); onPlayAgain(); }}
            className="w-full nes-btn py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] rounded"
          >
            <RotateCcw className="w-4 h-4" />
            <span>VOLVER A JUGAR OTRA RONDA</span>
          </button>
        </div>

      </div>
    </div>
  );
};
