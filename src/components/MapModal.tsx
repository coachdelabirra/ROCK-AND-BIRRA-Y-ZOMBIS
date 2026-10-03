import React from 'react';
import { PlayerState, ZoneKey } from '../types/game';
import { ZONES_DATA } from '../data/gameData';
import { sound } from '../utils/audio';
import { X, Navigation, Skull, Shield, Lock, MapPin } from 'lucide-react';

interface MapModalProps {
  player: PlayerState;
  onClose: () => void;
  onTravelToZone: (targetZone: ZoneKey) => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  player,
  onClose,
  onTravelToZone,
}) => {
  const currentZoneData = ZONES_DATA[player.currentZone];
  const bothBossesDefeated = player.bossFerroDefeated && player.bossAlmaDefeated;

  // Node positions on the map canvas
  const mapNodes: { key: ZoneKey; label: string; x: number; y: number; isBoss?: boolean; isDefeated?: boolean }[] = [
    { key: 'bunker', label: 'El Búnker', x: 50, y: 15 },
    { key: 'supermercado', label: 'Supermercado', x: 22, y: 40 },
    { key: 'barrio', label: 'Barrio', x: 78, y: 40 },
    { key: 'bar', label: 'Bar El Aullido', x: 28, y: 70, isBoss: true, isDefeated: player.bossAlmaDefeated },
    { key: 'gasolinera', label: 'Gasolinera', x: 72, y: 70, isBoss: true, isDefeated: player.bossFerroDefeated },
    { key: 'secreta', label: 'Refugio Secreto', x: 50, y: 88 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl nes-box p-4 md:p-6 bg-stone-950 border-4 border-sky-400 text-stone-100 shadow-[8px_8px_0px_#000] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="font-bungee text-base md:text-lg text-sky-400">
                MAPA DEL BARRIO APOCALÍPTICO
              </h2>
              <p className="font-pixel text-xs text-stone-400">
                Haz click en una zona conectada para viajar
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

        {/* Map Visual Interactive Canvas */}
        <div className="relative aspect-video w-full bg-stone-900 border-2 border-stone-700 rounded-lg p-4 overflow-hidden mb-4 select-none">
          
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-stone-700 stroke-2">
            {/* Bunker to Supermercado */}
            <line x1="50%" y1="15%" x2="22%" y2="40%" />
            {/* Bunker to Barrio */}
            <line x1="50%" y1="15%" x2="78%" y2="40%" />
            {/* Supermercado to Barrio */}
            <line x1="22%" y1="40%" x2="78%" y2="40%" strokeDasharray="4 4" />
            {/* Supermercado to Bar */}
            <line x1="22%" y1="40%" x2="28%" y2="70%" />
            {/* Barrio to Gasolinera */}
            <line x1="78%" y1="40%" x2="72%" y2="70%" />
            {/* Bar to Gasolinera */}
            <line x1="28%" y1="70%" x2="72%" y2="70%" strokeDasharray="4 4" />
            {/* Secret connections if unlocked */}
            {bothBossesDefeated && (
              <>
                <line x1="28%" y1="70%" x2="50%" y2="88%" stroke="#f59e0b" strokeWidth="3" />
                <line x1="72%" y1="70%" x2="50%" y2="88%" stroke="#f59e0b" strokeWidth="3" />
              </>
            )}
          </svg>

          {/* Map Interactive Nodes */}
          {mapNodes.map((node) => {
            const isCurrent = player.currentZone === node.key;
            const isConnected = currentZoneData.connections.includes(node.key);
            const isSecretLocked = node.key === 'secreta' && !bothBossesDefeated;

            return (
              <div
                key={node.key}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                {isCurrent && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-black font-bungee text-[9px] px-1.5 py-0.5 rounded border border-black animate-bounce shadow">
                    ESTÁS ACÁ
                  </div>
                )}

                <button
                  disabled={isCurrent || (!isConnected && !isCurrent) || isSecretLocked}
                  onClick={() => {
                    sound.playConfirm();
                    onTravelToZone(node.key);
                    onClose();
                  }}
                  className={`nes-btn p-2 rounded flex flex-col items-center justify-center min-w-[90px] cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-black border-black shadow-[3px_3px_0px_#000]'
                      : isSecretLocked
                        ? 'bg-stone-950 text-stone-600 border-stone-800 opacity-50 cursor-not-allowed'
                        : isConnected
                          ? 'bg-stone-800 hover:bg-sky-600 text-stone-100 hover:text-white border-stone-600 hover:border-white shadow-[2px_2px_0px_#000]'
                          : 'bg-stone-900 text-stone-500 border-stone-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    {node.key === 'bunker' && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                    {node.isBoss && !node.isDefeated && <Skull className="w-3.5 h-3.5 text-red-500" />}
                    {isSecretLocked && <Lock className="w-3.5 h-3.5 text-stone-500" />}
                    <span className="font-bungee text-[11px] leading-tight">
                      {node.label}
                    </span>
                  </div>

                  <span className="font-pixel text-[10px]">
                    {isCurrent ? 'Actual' : isSecretLocked ? 'Bloqueado' : isConnected ? 'Viajar' : 'Lejos'}
                  </span>
                </button>
              </div>
            );
          })}

        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-pixel text-stone-400 bg-stone-900/80 p-2.5 rounded border border-stone-800">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zona segura (Búnker)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Skull className="w-3.5 h-3.5 text-red-500" />
            <span>Jefe hostil (Alma / Ferro)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Refugio Secreto (requiere vencer a ambos jefes)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
