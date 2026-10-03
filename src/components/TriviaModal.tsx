import React, { useState } from 'react';
import { TriviaQuestion } from '../types/game';
import { sound } from '../utils/audio';
import { Film, Music, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface TriviaModalProps {
  question: TriviaQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export const TriviaModal: React.FC<TriviaModalProps> = ({
  question,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const correct = option === question.correctAnswer;
    if (correct) {
      sound.playTriviaCorrect();
    } else {
      sound.playTriviaWrong();
    }
  };

  const handleProceed = () => {
    sound.playConfirm();
    onAnswer(selectedAnswer === question.correctAnswer);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg nes-box p-5 bg-stone-900 border-4 border-amber-400 text-stone-100 shadow-[8px_8px_0px_#000] relative">
        
        {/* Category Header Badge */}
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            {question.category === 'rock' ? (
              <span className="p-1.5 bg-amber-500 text-black rounded font-bungee text-xs flex items-center gap-1">
                <Music className="w-3.5 h-3.5" />
                TRIVIA ROCK
              </span>
            ) : (
              <span className="p-1.5 bg-red-600 text-white rounded font-bungee text-xs flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                TRIVIA CINE
              </span>
            )}
            {question.isHard && (
              <span className="bg-purple-950 text-purple-300 border border-purple-600 text-[10px] font-pixel px-2 py-0.5 rounded uppercase font-bold">
                PREGUNTA MAESTRA
              </span>
            )}
          </div>
          <span className="font-rock text-xs text-amber-400">
            ¡Responde para golpear!
          </span>
        </div>

        {/* The Question */}
        <div className="mb-6">
          <h3 className="font-bungee text-base md:text-lg text-stone-100 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="space-y-2.5 mb-6">
          {question.options.map((option, idx) => {
            let btnStyle = 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700';

            if (isAnswered) {
              if (option === question.correctAnswer) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-[3px_3px_0px_#000]';
              } else if (option === selectedAnswer) {
                btnStyle = 'bg-red-600 text-white border-red-400 shadow-[3px_3px_0px_#000]';
              } else {
                btnStyle = 'bg-stone-900 text-stone-500 border-stone-800 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(option)}
                className={`w-full nes-btn p-3 text-left font-body text-sm font-semibold rounded flex items-center justify-between cursor-pointer transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs font-bold text-amber-400">
                    [{String.fromCharCode(65 + idx)}]
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && option === question.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                )}
                {isAnswered && option === selectedAnswer && option !== question.correctAnswer && (
                  <XCircle className="w-4 h-4 text-red-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner & Continue Button */}
        {isAnswered && (
          <div className="border-t-2 border-stone-800 pt-4 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3 bg-black/60 p-3 rounded border border-stone-800">
              <div className="text-3xl shrink-0">
                {isCorrect ? '🍺' : '💀'}
              </div>
              <div className="flex-1">
                <div className={`font-bungee text-sm ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '¡CORRECTO! 🤘 ¡SOS UNA LEYENDA DEL ROCK!' : 'INCORRECTO... ESO SONÓ DESAFINADO'}
                </div>
                <div className="font-pixel text-xs text-stone-400">
                  {isCorrect 
                    ? 'Tu ataque conecta con toda la potencia de un riff distorsionado.' 
                    : 'Golpe flojo y sin onda. ¡A estudiar más rock y cine clásico!'}
                </div>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full nes-btn py-3 bg-amber-400 hover:bg-amber-300 text-black font-bungee text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] rounded"
            >
              <span>CONTINUAR COMBATE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
