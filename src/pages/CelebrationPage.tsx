import React from 'react';
import { Heart, CheckCircle2, Copy, Share2, MessageCircle } from 'lucide-react';
import { DatePlan } from '../data/datePlans';

interface CelebrationPageProps {
  name: string;
  activePlan: DatePlan;
  selectedTime: string;
  customNote: string;
  onWhatsApp: () => void;
  onCopyResponse: () => void;
  onCopyInviteLink: () => void;
  onBackToInvite: () => void;
}

export const CelebrationPage: React.FC<CelebrationPageProps> = ({
  name,
  activePlan,
  selectedTime,
  customNote,
  onWhatsApp,
  onCopyResponse,
  onCopyInviteLink,
  onBackToInvite
}) => {
  return (
    <>
      <div className="badge rise" style={{ ['--i' as string]: 2 }}>
        <span className="badge__tag bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Потвърдено
        </span>
        <span className="text-neutral-800 font-medium">Срещата е договорена! 🎉</span>
      </div>

      <h1 className="headline rise" style={{ ['--i' as string]: 4 }}>
        Ура, {name}! Ще бъде<br className="brk" /> страхотно! 🥂
      </h1>

      <p className="sub rise" style={{ ['--i' as string]: 6 }}>
        Поканата беше приета официално. Ето твоята резервация за вечерта:
      </p>

      <div className="prompt rise max-w-lg w-full" style={{ ['--i' as string]: 8 }}>
        {/* Boarding-Pass / Date Ticket */}
        <div className="ticket-card mb-5">
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />

          <div className="flex items-center justify-between pb-3 border-b border-dashed border-neutral-300">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Покана за среща
                </span>
                <span className="font-bold text-base text-neutral-900">{name}</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              VIP Среща
            </span>
          </div>

          <div className="py-3 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
                План за вечерта:
              </span>
              <span className="font-semibold text-sm text-neutral-900 flex items-center gap-1.5 mt-0.5">
                {activePlan.title}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
                Време & ден:
              </span>
              <span className="font-semibold text-sm text-neutral-900 mt-0.5 block">
                {selectedTime}
              </span>
            </div>
          </div>

          {customNote && (
            <div className="pt-2 border-t border-dashed border-neutral-200 text-xs text-neutral-600">
              <span className="font-medium text-neutral-800">Специално желание:</span> {customNote}
            </div>
          )}

          <div className="pt-3 mt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span>✨ Дрескод: Усмивка и добро настроение</span>
            <span>100% Романтика</span>
          </div>
        </div>

        {/* Actions: WhatsApp, Copy, Reset */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onWhatsApp}
            className="w-full btn-dark bg-emerald-600! hover:bg-emerald-700! flex items-center justify-center gap-2 py-3! rounded-xl shadow-md transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Изпрати потвърждение във WhatsApp 📲</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCopyResponse}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Копирай отговора</span>
            </button>

            <button
              type="button"
              onClick={onCopyInviteLink}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white/80 hover:bg-white text-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Копирай линк за поканата</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToInvite}
            className="text-xs text-neutral-500 hover:text-neutral-800 mt-2 text-center transition-colors"
          >
            ← Промени активността или часа
          </button>
        </div>
      </div>
    </>
  );
};
