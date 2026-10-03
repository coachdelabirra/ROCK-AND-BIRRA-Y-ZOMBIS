import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { sound } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Radio, 
  Map as MapIcon, 
  Backpack, 
  BarChart2, 
  Sparkles, 
  Skull, 
  Pizza, 
  Beer,
  Zap,
  Heart
} from 'lucide-react';

interface HeaderHUDProps {
  player: PlayerState;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenStats: () => void;
  onOpenRadio: () => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  player,
  onOpenMap,
  onOpenInventory,
  onOpenStats,
  onOpenRadio,
  scanlines,
  onToggleScanlines,
}) => {
  const [muted, setMuted] = useState(sound.isMuted);
  const [vol, setVol] = useState(sound.volume);

  const handleMuteToggle = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  const handleVolChange = (delta: number) => {
    const next = Math.max(0, Math.min(1, Math.round((vol + delta) * 10) / 10));
    sound.setVolume(next);
    setVol(next);
    sound.playBlip();
  };

  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (player.energy / player.maxEnergy) * 100));
  const apocPercent = Math.max(0, Math.min(100, (player.apocalypse / player.apocalypseMax) * 100));

  return (
    <header className="bg-stone-950/95 border-b-4 border-stone-800 text-stone-100 px-3 py-2 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Character Tag */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-black font-bungee text-xs px-2 py-1 border-2 border-black rounded shadow-[2px_2px_0px_#000]">
            ROCK & BIRRA
          </div>
          <div>
            <div className="font-bungee text-sm tracking-wide text-amber-400 flex items-center gap-1.5">
              <span>{player.name}</span>
              <span className="text-xs text-stone-400 font-body uppercase font-bold">
                (Nv.{player.level})
              </span>
            </div>
            <div className="text-[11px] text-stone-400 font-pixel tracking-wider">
              #YConCervezaMejor · {player.classKey.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Vital Stats Gauges */}
        <div className="flex items-center gap-4 flex-wrap text-xs font-pixel tracking-wide">
          
          {/* Health Bar */}
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-stone-300 font-bold mb-0.5">
                <span>VIDA</span>
                <span>{player.hp}/{player.maxHp}</span>
              </div>
              <div className="w-24 h-2.5 bg-stone-900 border border-stone-700 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Energy Bar */}
          <div className="flex items-center gap-1.5 min-w-[110px]">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-stone-300 font-bold mb-0.5">
                <span>ENERGÍA</span>
                <span>{player.energy}/{player.maxEnergy}</span>
              </div>
              <div className="w-20 h-2.5 bg-stone-900 border border-stone-700 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Chapitas Currency */}
          <div className="flex items-center gap-1 bg-stone-900 px-2.5 py-1 border border-stone-700 rounded text-amber-300">
            <span className="text-sm">🔩</span>
            <span className="font-bungee text-xs">{player.caps}</span>
            <span className="text-[10px] text-stone-400">chapas</span>
          </div>

          {/* Mission Objective: Pizza & Beer */}
          <div className="flex items-center gap-2 bg-stone-900/80 px-2.5 py-1 border border-amber-600/50 rounded">
            <div className="flex items-center gap-1 text-orange-400" title="Pizzas conseguidas">
              <Pizza className="w-3.5 h-3.5" />
              <span className={`font-bungee text-xs ${player.pizzas >= player.pizzasRequired ? 'text-emerald-400 font-bold' : ''}`}>
                {player.pizzas}/{player.pizzasRequired}
              </span>
            </div>
            <span className="text-stone-600">|</span>
            <div className="flex items-center gap-1 text-amber-400" title="Cervezas frías conseguidas">
              <Beer className="w-3.5 h-3.5" />
              <span className={`font-bungee text-xs ${player.beers >= player.beersRequired ? 'text-emerald-400 font-bold' : ''}`}>
                {player.beers}/{player.beersRequired}
              </span>
            </div>
          </div>

          {/* Apocalypse Meter */}
          <div className="flex items-center gap-1.5" title="Reloj del Apocalipsis: ¡Si llega a 100 el mundo se termina de ir a la mierda!">
            <Skull className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <div>
              <div className="flex justify-between text-[10px] font-bold text-red-400 mb-0.5">
                <span>APOCALIPSIS</span>
                <span>{player.apocalypse}%</span>
              </div>
              <div className="w-20 h-2 bg-stone-900 border border-red-900/80 overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-500"
                  style={{ width: `${apocPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action Controls & Radio */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { sound.playConfirm(); onOpenRadio(); }}
            className="nes-btn px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded"
            title="Sintonizar Rock & Birra Radio"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-pixel text-xs">RADIO</span>
          </button>

          <button
            onClick={() => { sound.playConfirm(); onOpenMap(); }}
            className="nes-btn px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded"
            title="Ver mapa del barrio"
          >
            <MapIcon className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline font-pixel text-xs">MAPA</span>
          </button>

          <button
            onClick={() => { sound.playConfirm(); onOpenInventory(); }}
            className="nes-btn px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded relative"
            title="Abrir mochila / inventario"
          >
            <Backpack className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-pixel text-xs">MOCHILA</span>
            {player.inventory.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-bold px-1 rounded-full border border-black">
                {player.inventory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { sound.playConfirm(); onOpenStats(); }}
            className="nes-btn px-2 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer rounded"
            title="Ver estadísticas y trivias"
          >
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {/* CRT scanline toggle */}
          <button
            onClick={onToggleScanlines}
            className={`nes-btn px-2 py-1.5 text-xs font-bold rounded cursor-pointer ${scanlines ? 'bg-amber-500 text-black' : 'bg-stone-800 text-stone-400'}`}
            title="Activar/Desactivar efecto CRT Retro"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Audio Controls */}
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 px-1.5 py-1 rounded">
            <button
              onClick={() => handleVolChange(-0.1)}
              className="px-1 text-stone-400 hover:text-white font-mono text-xs cursor-pointer"
              title="Bajar volumen"
            >
              -
            </button>
            <span className="text-[10px] font-pixel text-stone-400 w-6 text-center">
              {Math.round(vol * 100)}%
            </span>
            <button
              onClick={() => handleVolChange(0.1)}
              className="px-1 text-stone-400 hover:text-white font-mono text-xs cursor-pointer"
              title="Subir volumen"
            >
              +
            </button>
            <button
              onClick={handleMuteToggle}
              className="text-stone-300 hover:text-amber-400 p-0.5 cursor-pointer"
              title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
