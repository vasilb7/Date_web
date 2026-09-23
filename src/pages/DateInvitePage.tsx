import React, { useState } from 'react';
import { Heart, Utensils, Clock, RotateCcw } from 'lucide-react';
import { MatFormField } from '../components/MatFormField';
import { DATE_PLANS, TIME_OPTIONS, NO_PHRASES } from '../data/datePlans';

interface DateInvitePageProps {
  name: string;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  customNote: string;
  setCustomNote: (note: string) => void;
  onAccept: () => void;
  onChangeName: () => void;
}

export const DateInvitePage: React.FC<DateInvitePageProps> = ({
  name,
  selectedPlan,
  setSelectedPlan,
  selectedTime,
  setSelectedTime,
  customNote,
  setCustomNote,
  onAccept,
  onChangeName
}) => {
  // Evasive "No" button
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [isDodgeActive, setIsDodgeActive] = useState(false);

  const handleNoDodge = () => {
    setIsDodgeActive(true);
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 80;
    setNoPos({ x: randomX, y: randomY });
    setNoIndex((prev) => (prev + 1) % NO_PHRASES.length);
  };

  return (
    <>
      <div className="badge rise" style={{ ['--i' as string]: 2 }}>
        <span className="badge__tag bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1">
          <Heart className="w-3 h-3 fill-rose-600" />
          100% Match
        </span>
        <span className="text-neutral-800 font-medium">Само за {name}</span>
      </div>

      <h1 className="headline rise" style={{ ['--i' as string]: 4 }}>
        {name}, ще излезеш ли<br className="brk" /> с мен на среща?
      </h1>

      <p className="sub rise" style={{ ['--i' as string]: 6 }}>
        Не исках да бъде просто скучно съобщение в чата.
        <br className="brk" />
        Избери какво ти се прави най-много и ми кажи:
      </p>

      <div className="prompt rise max-w-2xl w-full" style={{ ['--i' as string]: 8 }}>
        {/* 1. Date Idea Selector */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-neutral-700" />
              1. Какво ти се прави?
            </label>
            <span className="text-xs text-neutral-400">Избери идея</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DATE_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`date-option ${isSelected ? 'is-selected ring-2 ring-neutral-900/10' : ''}`}
                >
                  <div className="p-2 rounded-lg bg-neutral-100 shrink-0">
                    {plan.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-neutral-900">{plan.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200/70 text-neutral-600 font-medium">
                        {plan.tag}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{plan.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Time selector */}
        <div className="mb-5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5 text-neutral-700" />
            2. Кога ти е най-удобно?
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((timeOption) => (
              <button
                key={timeOption}
                type="button"
                onClick={() => setSelectedTime(timeOption)}
                className={`time-chip ${selectedTime === timeOption ? 'is-selected shadow-sm' : ''}`}
              >
                {timeOption}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Custom note with MatFormField */}
        <div className="mb-6">
          <MatFormField
            id="customNote"
            label="3. Специално желание или любимо място (по желание)"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />
        </div>

        {/* Interactive Action Decision Buttons */}
        <div className="pt-3 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <button
            type="button"
            onClick={onChangeName}
            className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 order-2 sm:order-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Смени името ({name})</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
            {/* The Playful Dodging "No" Button */}
            <button
              type="button"
              onMouseEnter={handleNoDodge}
              onClick={handleNoDodge}
              style={{
                transform: isDodgeActive ? `translate(${noPos.x}px, ${noPos.y}px)` : 'none',
                transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="px-4 py-2.5 rounded-xl border border-neutral-300/80 bg-white/70 text-neutral-700 font-medium text-sm hover:bg-neutral-100 transition-colors shadow-xs"
            >
              {NO_PHRASES[noIndex]}
            </button>

            {/* The YES Button */}
            <button
              type="button"
              onClick={onAccept}
              className="btn-dark animate-pulse-subtle bg-neutral-900! hover:bg-black! flex items-center gap-2 py-3! px-6! rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="font-semibold text-white">Да, с удоволствие!</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
