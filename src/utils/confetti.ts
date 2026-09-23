import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 70,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#e11d48', '#fb7185', '#f43f5e', '#ffffff', '#f59e0b']
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#e11d48', '#fda4af', '#ffffff']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#e11d48', '#fb7185', '#ffffff']
    });
  }, 250);
};
