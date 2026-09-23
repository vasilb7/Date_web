import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <>
      {/* 1. Background Video with fallback */}
      <div className="hero__bg">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.higgs.ai/?default=1&amp;output=webp&amp;url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260831_223518_f11bfa03-4e65-47e1-a4a7-30e42a7a8c2f.png&amp;w=1920&amp;q=85"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260831_232706_43757be4-2250-4f09-8cd7-23aebbf147ad.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Floating subtle romantic particles */}
      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
        <div
          className="absolute text-rose-500/20 text-2xl"
          style={{
            top: '25%',
            left: '12%',
            animation: 'float-heart 6s infinite ease-in'
          }}
        >
          ❤️
        </div>
        <div
          className="absolute text-rose-400/20 text-3xl"
          style={{
            top: '65%',
            right: '15%',
            animation: 'float-heart 8s infinite ease-in 2s'
          }}
        >
          ✨
        </div>
        <div
          className="absolute text-pink-400/25 text-xl"
          style={{
            top: '40%',
            right: '25%',
            animation: 'float-heart 7s infinite ease-in 4s'
          }}
        >
          🤍
        </div>
      </div>
    </>
  );
};
