import React, { useState, useEffect, useCallback } from 'react';
import { HeroBackground } from './components/HeroBackground';
import { Toast } from './components/Toast';
import { HeroPage } from './pages/HeroPage';
import { DateInvitePage } from './pages/DateInvitePage';
import { CelebrationPage } from './pages/CelebrationPage';
import { DATE_PLANS } from './data/datePlans';
import { playRomanticChime } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { saveDateResponse } from './utils/supabase';

// ── URL helpers ──────────────────────────────────────────
function getStepFromUrl(): 1 | 2 | 3 {
  const params = new URLSearchParams(window.location.search);
  const s = Number(params.get('step'));
  if (s === 2 || s === 3) return s;
  return 1;
}

function pushStepUrl(step: 1 | 2 | 3, name: string) {
  const params = new URLSearchParams(window.location.search);
  if (step === 1) {
    params.delete('step');
    params.delete('to');
  } else {
    params.set('step', String(step));
    if (name) params.set('to', name);
  }
  const qs = params.toString();
  const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}`;
  window.history.pushState({ step }, '', newUrl);
}

export default function App() {
  // Step 1: Name entry (Hero)
  // Step 2: Date invite selection
  // Step 3: Accepted celebration & VIP ticket
  const [step, setStep] = useState<1 | 2 | 3>(getStepFromUrl);
  const [name, setName] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('to') || params.get('name') || '').trim();
  });
  const [nameError, setNameError] = useState(false);

  // Customization
  const [selectedPlan, setSelectedPlan] = useState<string>('dinner');
  const [selectedTime, setSelectedTime] = useState<string>('Този петък вечер');
  const [customNote, setCustomNote] = useState('');

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Navigate to step with URL update
  const goToStep = useCallback((nextStep: 1 | 2 | 3, currentName?: string) => {
    const n = currentName ?? name;
    pushStepUrl(nextStep, n);
    setStep(nextStep);
  }, [name]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state?.step as 1 | 2 | 3) ?? getStepFromUrl();
      setStep(s);
    };
    window.addEventListener('popstate', onPop);
    // Set initial history state so back button works from step 1
    window.history.replaceState({ step }, '', window.location.href);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    goToStep(2, name.trim());
  };

  const handleAccept = () => {
    playRomanticChime();
    triggerConfetti();
    saveDateResponse({
      name,
      selected_plan: selectedPlan,
      selected_time: selectedTime,
      custom_note: customNote,
      status: 'accepted',
    });
    goToStep(3);
  };

  const activePlanObj =
    DATE_PLANS.find((p) => p.id === selectedPlan) || DATE_PLANS[0];

  const shareText = `Хей! Официално приех поканата за среща за „${activePlanObj.title}“ (${selectedTime})! ❤️🥂`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    showToast('Текстът е копиран! Можеш да го изпратиш в чата 💌');
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    showToast(`Линкът за ${name} е копиран!`);
  };

  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="hero">
      {/* Dynamic background with romantic video & particles */}
      <HeroBackground />

      {/* Main Hero Container */}
      <div className="hero__inner">
        <div className="stage">
          {step === 1 && (
            <HeroPage
              name={name}
              setName={setName}
              nameError={nameError}
              setNameError={setNameError}
              onSubmit={handleNameSubmit}
            />
          )}

          {step === 2 && (
            <DateInvitePage
              name={name}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              customNote={customNote}
              setCustomNote={setCustomNote}
              onAccept={handleAccept}
              onChangeName={() => goToStep(1)}
            />
          )}

          {step === 3 && (
            <CelebrationPage
              name={name}
              activePlan={activePlanObj}
              selectedTime={selectedTime}
              customNote={customNote}
              onWhatsApp={openWhatsApp}
              onCopyResponse={copyToClipboard}
              onCopyInviteLink={copyInviteLink}
              onBackToInvite={() => goToStep(2)}
            />
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      <Toast message={toastMsg} />
    </section>
  );
}
