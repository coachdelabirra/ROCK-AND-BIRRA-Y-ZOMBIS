import React, { useState } from 'react';
import { PlayerState, ZoneKey, CombatLog, PointAndClickHotspot } from '../types/game';
import { ZONES_DATA } from '../data/gameData';
import { sound } from '../utils/audio';
import { 
  Navigation, 
  Search, 
  Bed, 
  Save, 
  Trophy, 
  Gift, 
  Backpack, 
  Map as MapIcon, 
  Info, 
  AlertTriangle,
  Radio
} from 'lucide-react';

interface PointAndClickSceneProps {
  player: PlayerState;
  logs: CombatLog[];
  onMoveToZone: (targetZone: ZoneKey) => void;
  onExploreRubble: () => void;
  onRestInBunker: () => void;
  onSaveGame: () => void;
  onDeclareVictory: () => void;
  onLootSecretRefuge: () => void;
  onInteractHotspot: (hotspot: PointAndClickHotspot) => void;
  onStupidDecision: () => void;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenRadio: () => void;
}

export const PointAndClickScene: React.FC<PointAndClickSceneProps> = ({
  player,
  logs,
  onMoveToZone,
  onExploreRubble,
  onRestInBunker,
  onSaveGame,
  onDeclareVictory,
  onLootSecretRefuge,
  onInteractHotspot,
  onStupidDecision,
  onOpenMap,
  onOpenInventory,
  onOpenRadio,
}) => {
  const currentZone = ZONES_DATA[player.currentZone] || ZONES_DATA.bunker;
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const canWin = player.pizzas >= player.pizzasRequired && player.beers >= player.beersRequired;
  const bothBossesDefeated = player.bossFerroDefeated && player.bossAlmaDefeated;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 space-y-4">
      
      {/* Zone Title & Atmosphere Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-stone-800 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="font-bungee text-lg md:text-xl text-amber-400">
              {currentZone.name.toUpperCase()}
            </h2>
            {currentZone.isSafeBunker && (
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-700 font-pixel text-xs px-2 py-0.5 rounded">
                ZONA SEGURA
              </span>
            )}
          </div>
          <p className="font-body text-xs text-stone-300">
            {currentZone.tagline}
          </p>
        </div>

        {/* Quest Status reminder */}
        <div className="flex items-center gap-3 text-xs font-pixel bg-stone-900 border border-stone-800 px-3 py-1.5 rounded">
          <span className="text-stone-400">MISIÓN:</span>
          <span className={player.pizzas >= player.pizzasRequired ? 'text-emerald-400 font-bold' : 'text-orange-400'}>
            🍕 {player.pizzas}/{player.pizzasRequired} Pizzas
          </span>
          <span>·</span>
          <span className={player.beers >= player.beersRequired ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
            🍺 {player.beers}/{player.beersRequired} Birras
          </span>
        </div>
      </div>

      {/* Main Interactive Graphical Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left 3 cols: Point & Click Viewport with Hotspots */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border-4 border-stone-800 shadow-[6px_6px_0px_#000] bg-black group select-none">
            
            {/* Background Graphic Asset */}
            <img 
              src={currentZone.bgImage} 
              alt={currentZone.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />

            {/* Subtle Vignette & Comic Lighting */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Clickable Hotspots overlay */}
            {currentZone.hotspots.map((hs) => {
              const isLooted = player.lootedHotspots.includes(hs.id);
              if (hs.actionType === 'secret' && player.secretRefugeLooted) return null;

              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.yPercent}%`, left: `${hs.xPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onMouseEnter={() => { setActiveTooltip(hs.tooltip); sound.playBlip(); }}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => onInteractHotspot(hs)}
                >
                  <div className="relative group/hotspot">
                    
                    {/* Glowing pulse ring */}
                    <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                    
                    {/* Hotspot Icon Button */}
                    <button className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bungee text-xs shadow-lg transition-transform hover:scale-125 cursor-pointer ${
                      isLooted 
                        ? 'bg-stone-700 text-stone-400' 
                        : hs.actionType === 'radio'
                          ? 'bg-purple-500 text-white'
                          : hs.actionType === 'rest'
                            ? 'bg-emerald-500 text-black'
                            : 'bg-amber-400 text-black'
                    }`}>
                      {hs.actionType === 'loot' && '📦'}
                      {hs.actionType === 'inspect' && '🔍'}
                      {hs.actionType === 'radio' && '📻'}
                      {hs.actionType === 'rest' && '🛏️'}
                      {hs.actionType === 'secret' && '🎁'}
                    </button>

                    {/* Hover Label */}
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-amber-400 text-amber-300 font-pixel text-xs px-2 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover/hotspot:opacity-100 transition-opacity">
                      {hs.label}
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Active Tooltip Bar at bottom of viewport */}
            {activeTooltip && (
              <div className="absolute bottom-2 left-2 right-2 bg-stone-950/90 border border-amber-500 px-3 py-1.5 rounded text-amber-300 font-pixel text-sm flex items-center gap-2 animate-fadeIn z-30">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeTooltip}</span>
              </div>
            )}

            {/* Bottom-right Zone Flavor Indicator */}
            <div className="absolute bottom-2 right-2 hidden sm:block bg-black/80 px-2 py-1 rounded text-[11px] font-pixel text-stone-400 border border-stone-800">
              {currentZone.shortName}
            </div>

          </div>

          {/* Connected Zones Direct Travel Buttons */}
          <div className="bg-stone-900/90 border-2 border-stone-800 p-3 rounded-lg shadow-[3px_3px_0px_#000]">
            <span className="font-bungee text-xs text-stone-400 block mb-2">
              CAMINOS CONECTADOS (POINT & CLICK):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {currentZone.connections.map((targetKey) => {
                // Secret zone only unlocked if both bosses are down
                if (targetKey === 'secreta' && !bothBossesDefeated) {
                  return (
                    <div
                      key="locked_secret"
                      className="px-3 py-2 bg-stone-950 border border-stone-800 text-stone-600 font-pixel text-xs flex items-center justify-between rounded opacity-60"
                      title="Derrota a la Sirena en el Bar y al Comandante en la Gasolinera para descubrir este acceso"
                    >
                      <span>🔒 Refugio Secreto</span>
                      <span className="text-[10px]">BLOQUEADO</span>
                    </div>
                  );
                }

                const targetZone = ZONES_DATA[targetKey];
                return (
                  <button
                    key={targetKey}
                    onClick={() => { sound.playFootstepsRubble(); onMoveToZone(targetKey); }}
                    className="nes-btn px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-left flex items-center justify-between gap-2 rounded cursor-pointer group"
                  >
                    <div>
                      <div className="font-bungee text-xs text-amber-400 group-hover:text-amber-300">
                        ➡ {targetZone.shortName}
                      </div>
                      <div className="font-pixel text-[11px] text-stone-400 truncate max-w-[170px]">
                        {targetZone.tagline}
                      </div>
                    </div>
                    {targetZone.isSafeBunker && <span className="text-sm">🛡️</span>}
                    {targetKey === 'gasolinera' && !player.bossFerroDefeated && <span className="text-sm">☠️</span>}
                    {targetKey === 'bar' && !player.bossAlmaDefeated && <span className="text-sm">☠️</span>}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 col: Actions & Exploration Commands */}
        <div className="space-y-3 flex flex-col">
          
          <div className="nes-box p-3 bg-stone-900 border-2 border-stone-700 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bungee text-xs text-amber-400 mb-2 border-b border-stone-800 pb-1">
                ACCIONES DE ZONA
              </h3>

              <div className="space-y-2">
                {/* Rubble Search / Combat Encounter Trigger */}
                {currentZone.templates.length > 0 && (
                  <button
                    onClick={() => { sound.playFootstepsRubble(); onExploreRubble(); }}
                    className="w-full nes-btn p-2.5 bg-red-600 hover:bg-red-500 text-white font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left"
                  >
                    <Search className="w-4 h-4 shrink-0 text-amber-300" />
                    <div>
                      <div>BUSCAR ENTRE ESCOMBROS</div>
                      <div className="font-pixel text-[11px] text-stone-200 font-normal">
                        Riesgo zombi / Posible pizza o birra
                      </div>
                    </div>
                  </button>
                )}

                {/* Tomar Decisión Estúpida / Situación Absurda */}
                <button
                  onClick={() => onStupidDecision()}
                  className="w-full nes-btn p-2.5 bg-amber-600 hover:bg-amber-500 text-black font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left shadow-[2px_2px_0px_#000]"
                  title="Meterse en problemas absurdos y sobrevivir de milagro"
                >
                  <span className="text-base">🤪</span>
                  <div>
                    <div>TOMAR DECISIÓN ESTÚPIDA</div>
                    <div className="font-pixel text-[11px] text-stone-950 font-bold">
                      Comedia negra / Sobrevivir de milagro
                    </div>
                  </div>
                </button>

                {/* Bunker Rest */}
                {currentZone.isSafeBunker && (
                  <button
                    onClick={() => onRestInBunker()}
                    disabled={player.caps < 5}
                    className="w-full nes-btn p-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left"
                  >
                    <Bed className="w-4 h-4 shrink-0" />
                    <div>
                      <div>DESCANSAR EN COLCHÓN</div>
                      <div className="font-pixel text-[11px] text-emerald-200 font-normal">
                        Cura 100% de vida y energía (5 chapas)
                      </div>
                    </div>
                  </button>
                )}

                {/* Bunker Save */}
                {currentZone.isSafeBunker && (
                  <button
                    onClick={() => { sound.playConfirm(); onSaveGame(); }}
                    className="w-full nes-btn p-2.5 bg-sky-700 hover:bg-sky-600 text-white font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left"
                  >
                    <Save className="w-4 h-4 shrink-0" />
                    <div>
                      <div>GUARDAR PARTIDA</div>
                      <div className="font-pixel text-[11px] text-sky-200 font-normal">
                        Asegura tu progreso en el búnker
                      </div>
                    </div>
                  </button>
                )}

                {/* Declare Victory if in bunker & goals met */}
                {currentZone.isSafeBunker && canWin && (
                  <button
                    onClick={() => onDeclareVictory()}
                    className="w-full nes-btn p-3 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left shadow-[3px_3px_0px_#000] animate-pulse"
                  >
                    <Trophy className="w-5 h-5 shrink-0 text-black fill-black" />
                    <div>
                      <div>¡DECLARAR LA VICTORIA!</div>
                      <div className="font-pixel text-[11px] text-stone-900 font-bold">
                        Tienes las pizzas y cervezas listas
                      </div>
                    </div>
                  </button>
                )}

                {/* Secret Refuge Safe */}
                {currentZone.key === 'secreta' && !player.secretRefugeLooted && (
                  <button
                    onClick={() => onLootSecretRefuge()}
                    className="w-full nes-btn p-3 bg-purple-600 hover:bg-purple-500 text-white font-bungee text-xs flex items-center gap-2 rounded cursor-pointer text-left animate-bounce"
                  >
                    <Gift className="w-5 h-5 shrink-0" />
                    <div>
                      <div>ABRIR CAJA FUERTE VIP</div>
                      <div className="font-pixel text-[11px] text-purple-200">
                        25 chapas + Pizza + Birra + Botiquín
                      </div>
                    </div>
                  </button>
                )}

                {/* Quick Radio Toggle */}
                <button
                  onClick={() => { sound.playMapStatic(); onOpenRadio(); }}
                  className="w-full nes-btn p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs flex items-center gap-2 rounded cursor-pointer text-left"
                >
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>Sintonizar Estaciones de Rock</span>
                </button>

                {/* Quick Map Button */}
                <button
                  onClick={() => { sound.playMapStatic(); onOpenMap(); }}
                  className="w-full nes-btn p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-pixel text-xs flex items-center gap-2 rounded cursor-pointer text-left"
                >
                  <MapIcon className="w-4 h-4 text-sky-400" />
                  <span>Ver Mapa y Posición Actual</span>
                </button>
              </div>
            </div>

            {/* Apocalypse Warning reminder */}
            <div className="mt-3 bg-red-950/40 border border-red-800/60 p-2 rounded text-xs font-pixel text-red-300">
              <div className="flex items-center gap-1 font-bold mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>ESTADO DEL MUNDO:</span>
              </div>
              <p className="text-[11px] leading-tight text-stone-300">
                Apocalipsis al {player.apocalypse}%. Cada movimiento por el barrio consume tiempo. ¡No te demores!
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Narrative Terminal / Bitácora */}
      <div className="nes-box p-3 bg-black border-2 border-stone-700 text-stone-100 font-pixel">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1 mb-2">
          <span className="font-bungee text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            BITÁCORA DE SUPERVIVENCIA:
          </span>
          <span className="text-xs text-stone-500">
            {player.name} · REGISTRO EN TIEMPO REAL
          </span>
        </div>

        <div className="h-28 overflow-y-auto space-y-1 text-xs pr-2 flex flex-col-reverse font-pixel tracking-wide">
          {logs.slice(-12).reverse().map((entry) => (
            <div 
              key={entry.id}
              className={`leading-relaxed ${
                entry.type === 'crit' ? 'text-amber-400 font-bold' :
                entry.type === 'enemy' ? 'text-red-400' :
                entry.type === 'player' ? 'text-emerald-400' :
                entry.type === 'item' ? 'text-sky-300' :
                'text-stone-300'
              }`}
            >
              {entry.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
