import React from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { X, BarChart2, Award, Zap, Skull, CheckCircle, XCircle } from 'lucide-react';

interface StatsModalProps {
  player: PlayerState;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ player, onClose }) => {
  const stats = player.stats;
  const totalTrivia = stats.triviaCorrect + stats.triviaFailed;
  const accuracy = totalTrivia > 0 ? Math.round((stats.triviaCorrect / totalTrivia) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md nes-box p-5 bg-stone-950 border-4 border-indigo-400 text-stone-100 shadow-[8px_8px_0px_#000] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="font-bungee text-base md:text-lg text-indigo-400">
                BITÁCORA Y ESTADÍSTICAS
              </h2>
              <p className="font-pixel text-xs text-stone-400">
                {player.name} · {player.classKey.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playBlip(); onClose(); }}
            className="nes-btn p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3 font-pixel text-sm mb-4">
          
          <div className="bg-stone-900 border border-stone-800 p-3 rounded space-y-2">
            <span className="font-bungee text-xs text-amber-400 block border-b border-stone-800 pb-1">
              CONOCIMIENTO ROCKERO & CINÉFILO:
            </span>
            <div className="flex justify-between items-center text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Trivias Acertadas:
              </span>
              <span className="font-bungee text-base">{stats.triviaCorrect}</span>
            </div>
            <div className="flex justify-between items-center text-red-400">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Trivias Falladas:
              </span>
              <span className="font-bungee text-base">{stats.triviaFailed}</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span>🎯 Precisión de Respuestas:</span>
              <span className="font-bungee text-base">{accuracy}%</span>
            </div>
            <div className="flex justify-between items-center text-purple-400">
              <span>🔥 Mejor Racha de Aciertos:</span>
              <span className="font-bungee text-base">{stats.bestStreak} seguidas</span>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-3 rounded space-y-2">
            <span className="font-bungee text-xs text-amber-400 block border-b border-stone-800 pb-1">
              SUPERVIVENCIA EN EL BARRIO:
            </span>
            <div className="flex justify-between items-center">
              <span>🧟 Zombies Aniquilados:</span>
              <span className="font-bungee text-base text-red-400">{stats.zombiesDefeated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🍕 Porciones de Pizza Rescatadas:</span>
              <span className="font-bungee text-base text-orange-400">{player.pizzas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🍺 Cervezas Frías Aseguradas:</span>
              <span className="font-bungee text-base text-amber-400">{player.beers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🔩 Chapitas en Bolsillo:</span>
              <span className="font-bungee text-base text-stone-200">{player.caps}</span>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 p-3 rounded space-y-1.5">
            <span className="font-bungee text-xs text-amber-400 block border-b border-stone-800 pb-1">
              JEFES Y SECRETOS:
            </span>
            <div className="flex justify-between text-xs">
              <span>👑 Comandante Ferro (Gasolinera):</span>
              <span className={player.bossFerroDefeated ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                {player.bossFerroDefeated ? 'DERROTADO' : 'PENDIENTE'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>👑 Alma, la Sirena (Bar El Aullido):</span>
              <span className={player.bossAlmaDefeated ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                {player.bossAlmaDefeated ? 'DERROTADA' : 'PENDIENTE'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>🔐 Refugio Secreto de Alma y Ferro:</span>
              <span className={player.secretRefugeLooted ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                {player.secretRefugeLooted ? 'SAQUEADO' : 'POR DESCUBRIR'}
              </span>
            </div>
          </div>

        </div>

        <button
          onClick={() => { sound.playConfirm(); onClose(); }}
          className="w-full nes-btn py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bungee text-xs rounded cursor-pointer"
        >
          CERRAR ESTADÍSTICAS
        </button>

      </div>
    </div>
  );
};
