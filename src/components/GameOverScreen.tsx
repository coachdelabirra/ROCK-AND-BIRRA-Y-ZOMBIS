import React from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameOverScreenProps {
  player: PlayerState;
  reason: 'combat' | 'apocalypse';
  onTryAgain: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  player,
  reason,
  onTryAgain,
}) => {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 md:p-8 bg-radial from-red-950/50 via-stone-950 to-black text-stone-100">
      <div className="w-full max-w-lg nes-box p-6 md:p-8 bg-stone-900 border-4 border-red-600 text-center shadow-[10px_10px_0px_#000] space-y-6">
        
        {/* Skull Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-600 border-4 border-black flex items-center justify-center shadow-lg animate-bounce">
            <Skull className="w-10 h-10 text-black fill-black" />
          </div>
        </div>

        {/* Big Game Over Heading */}
        <div>
          <span className="font-pixel text-xs text-red-400 font-bold uppercase tracking-widest block mb-1">
            ROCK AND BIRRA Y ZOMBIS · {reason === 'apocalypse' ? 'EL RELOJ LLEGÓ A CERO' : 'CAÍSTE EN COMBATE'}
          </span>
          <h1 className="font-bungee text-3xl sm:text-4xl text-red-500 leading-tight">
            {reason === 'apocalypse' 
              ? '¡EL MUNDO SE TERMINÓ DE IR A LA MIERDA!' 
              : '☠ GAME OVER ☠'}
          </h1>
        </div>

        {/* Narrative Defeat Flavor Text */}
        <div className="bg-black/70 border-2 border-stone-800 p-4 rounded-lg font-body text-sm text-stone-300 leading-relaxed">
          {reason === 'apocalypse' ? (
            <p>
              El cielo tomó un color violeta radioactivo definitivo. Los zombis coparon hasta el último rincón del barrio. En algún lugar, una guitarra desafinada suena por última vez... y el Coach se quedó sin pizza ni cerveza fría.
            </p>
          ) : (
            <p>
              Tu cuerpo se suma a la colección de huesos del barrio abandonado. Sin pizza. Sin birra. Sin gloria. Los zombis ahora usan tu campera de cuero como trapo de piso.
            </p>
          )}
          <p className="font-rock text-xs text-amber-300 mt-2 text-center">
            Regla del Coach: "Mientras quede una pizza y una cerveza, todavía no se acaba el mundo."
          </p>
        </div>

        {/* Stats summary before death */}
        <div className="grid grid-cols-2 gap-2 font-pixel text-xs bg-stone-950 p-2.5 rounded border border-stone-800">
          <div>
            <span className="text-stone-400 block">PIZZAS CONSEGUIDAS:</span>
            <span className="font-bungee text-sm text-orange-400">{player.pizzas} / {player.pizzasRequired}</span>
          </div>
          <div>
            <span className="text-stone-400 block">BIRRAS SALVADAS:</span>
            <span className="font-bungee text-sm text-amber-400">{player.beers} / {player.beersRequired}</span>
          </div>
        </div>

        {/* Try Again Button */}
        <div>
          <button
            onClick={() => { sound.playConfirm(); onTryAgain(); }}
            className="w-full nes-btn py-3.5 bg-red-600 hover:bg-red-500 text-white font-bungee text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000] rounded"
          >
            <RotateCcw className="w-4 h-4" />
            <span>INTENTAR DE NUEVO DESDE EL BÚNKER</span>
          </button>
        </div>

      </div>
    </div>
  );
};
