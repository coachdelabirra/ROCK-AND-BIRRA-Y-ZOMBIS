import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { X, Radio, Volume2, Play, Pause, SkipForward, Music } from 'lucide-react';

interface RadioModalProps {
  onClose: () => void;
}

export const RadioModal: React.FC<RadioModalProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(sound.isMusicPlaying);
  const [currentStation, setCurrentStation] = useState(sound.currentStationIndex);
  const [volume, setVolume] = useState(sound.volume);

  const stations = sound.stations;
  const activeStation = stations[currentStation];

  const handleTogglePlay = () => {
    if (isPlaying) {
      sound.stopRadio();
      setIsPlaying(false);
    } else {
      sound.startRadio(currentStation);
      setIsPlaying(true);
      sound.playRockPowerChord(220);
    }
  };

  const handleSelectStation = (index: number) => {
    setCurrentStation(index);
    sound.startRadio(index);
    setIsPlaying(true);
    sound.playConfirm();
  };

  const handleNext = () => {
    const nextIdx = sound.nextStation();
    setCurrentStation(nextIdx);
    setIsPlaying(true);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sound.setVolume(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg nes-box p-5 bg-stone-950 border-4 border-amber-500 text-stone-100 shadow-[8px_8px_0px_#000] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-bungee text-base md:text-lg text-amber-400">
                SINTONIZADOR ROCK & BIRRA RADIO
              </h2>
              <p className="font-pixel text-xs text-stone-400">
                La voz del Coach en el apocalipsis
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

        {/* Radio Boombox Display */}
        <div className="bg-stone-900 border-4 border-stone-800 rounded-lg p-4 mb-4 shadow-inner relative overflow-hidden">
          
          {/* LCD Screen */}
          <div className="bg-emerald-950/70 border-2 border-emerald-600/80 p-3 rounded text-emerald-300 font-pixel mb-3">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-stone-600'}`} />
                {isPlaying ? 'EN EL AIRE' : 'EN ESPERA'}
              </span>
              <span>FM STEREO · {activeStation.bpm} BPM</span>
            </div>

            <div className="font-bungee text-base text-emerald-200 mb-1">
              {activeStation.name}
            </div>

            <div className="text-xs text-emerald-400 font-semibold mb-2">
              {activeStation.genre}
            </div>

            <p className="text-[11px] text-emerald-300/80 italic">
              {activeStation.description}
            </p>

            {/* Equalizer Frequency Bars */}
            <div className="flex items-end gap-1 h-8 mt-3 pt-1 border-t border-emerald-800/60">
              {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60, 100, 50, 75, 85, 65].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-100 ${isPlaying ? 'bg-emerald-400' : 'bg-emerald-900/40'}`}
                  style={{ 
                    height: isPlaying ? `${Math.max(15, (h + Math.sin(Date.now() / 150 + i) * 35)) % 100}%` : '15%' 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="nes-btn px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-xs rounded flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{isPlaying ? 'PAUSAR' : 'REPRODUCIR'}</span>
              </button>

              <button
                onClick={handleNext}
                className="nes-btn px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bungee text-xs rounded flex items-center gap-1 cursor-pointer"
                title="Siguiente dial"
              >
                <SkipForward className="w-4 h-4" />
                <span className="hidden sm:inline">CAMBIAR DIAL</span>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-stone-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolume}
                className="w-20 md:w-28 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Stations List */}
        <div>
          <span className="font-bungee text-xs text-stone-300 block mb-2">
            FRECUENCIAS DISPONIBLES:
          </span>
          <div className="space-y-2">
            {stations.map((st, idx) => {
              const isSelected = currentStation === idx;
              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectStation(idx)}
                  className={`w-full nes-btn p-2.5 text-left rounded flex items-center justify-between cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[2px_2px_0px_#f8b800]' 
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div>
                    <div className="font-bungee text-xs">
                      {st.name}
                    </div>
                    <div className="font-pixel text-[11px] text-stone-400">
                      {st.genre}
                    </div>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="text-xs font-pixel text-emerald-400 font-bold animate-pulse">
                      ▶ SONANDO
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center font-rock text-xs text-stone-400">
          "La música de garage y la cerveza bien fría son lo único que nos salva del apocalipsis."
        </div>

      </div>
    </div>
  );
};
