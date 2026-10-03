import React from 'react';
import { PlayerState, InventoryItem } from '../types/game';
import { sound } from '../utils/audio';
import { X, Backpack, Pizza, Beer, Sparkles, Heart, Zap } from 'lucide-react';

interface InventoryModalProps {
  player: PlayerState;
  onClose: () => void;
  onUseItem: (item: InventoryItem) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  player,
  onClose,
  onUseItem,
}) => {
  const handleUse = (item: InventoryItem) => {
    sound.playConfirm();
    onUseItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg nes-box p-4 md:p-6 bg-stone-950 border-4 border-emerald-500 text-stone-100 shadow-[8px_8px_0px_#000] relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Backpack className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-bungee text-base md:text-lg text-emerald-400">
                MOCHILA DEL SOBREVIVIENTE
              </h2>
              <p className="font-pixel text-xs text-stone-400">
                {player.inventory.length} provisiones guardadas · 🔩 {player.caps} chapas
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

        {/* Quest Items Box (Pizzas and Beers) */}
        <div className="bg-stone-900 border-2 border-amber-500/50 p-3 rounded-lg mb-4">
          <span className="font-bungee text-xs text-amber-400 block mb-2">
            OBJETIVOS SUPREMOS DEL APOCALIPSIS:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/60 p-2.5 rounded border border-stone-800 flex items-center gap-3">
              <span className="text-3xl">🍕</span>
              <div>
                <div className="font-bungee text-xs text-orange-400">
                  PIZZAS RESCATADAS
                </div>
                <div className="font-pixel text-xs text-stone-300">
                  {player.pizzas} de {player.pizzasRequired} necesarias
                </div>
              </div>
            </div>

            <div className="bg-black/60 p-2.5 rounded border border-stone-800 flex items-center gap-3">
              <span className="text-3xl">🍺</span>
              <div>
                <div className="font-bungee text-xs text-amber-400">
                  BIRRAS HELADAS
                </div>
                <div className="font-pixel text-xs text-stone-300">
                  {player.beers} de {player.beersRequired} necesarias
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backpack Items List */}
        <div>
          <span className="font-bungee text-xs text-stone-300 block mb-2">
            CONSUMIBLES Y OBJETOS DISPONIBLES:
          </span>

          {player.inventory.length === 0 ? (
            <div className="text-center py-8 font-pixel text-stone-500 bg-stone-900/40 rounded border border-stone-800">
              <p className="text-2xl mb-1">📭</p>
              <p>Mochila vacía. Viajas ligero por ahora.</p>
              <p className="text-[11px] text-stone-600 mt-1">Busca entre los escombros o revisa los comercios abandonados.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {player.inventory.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="nes-box p-3 bg-stone-900 border border-stone-700 rounded flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-black rounded border border-stone-800 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-bungee text-xs text-stone-100">
                        {item.name}
                      </div>
                      <p className="font-body text-xs text-stone-400 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUse(item)}
                    className="nes-btn px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bungee text-xs rounded shrink-0 cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    USAR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center font-rock text-xs text-amber-300/80">
          #YConCervezaMejor · "La vida es muy corta para tomar cerveza barata"
        </div>

      </div>
    </div>
  );
};
