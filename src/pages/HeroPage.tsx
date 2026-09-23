import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MatFormField } from '../components/MatFormField';

interface HeroPageProps {
  name: string;
  setName: (name: string) => void;
  nameError: boolean;
  setNameError: (hasError: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  name,
  setName,
  nameError,
  setNameError,
  onSubmit
}) => {
  return (
    <div
      className="w-full max-w-md mx-auto rise flex flex-col items-center"
      style={{ ['--i' as string]: 6 }}
    >
      <div className="relative w-full">
        {/* Jerry pointing down into the input field */}
        <div
          className="absolute pointer-events-none select-none z-20 flex justify-center w-full"
          style={{
            top: -99,
            left: 0,
            right: 0,
          }}
        >
          <div className="w-36 h-36 relative">
            <img
              src="/img/name_log/jerry_pointing.png"
              alt="Jerry pointing"
              className="w-full h-full object-contain pointer-events-none select-none border-0 drop-shadow-md"
            />
          </div>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className={`w-full ${nameError ? 'animate-shake' : ''}`}
        >
          <MatFormField
            id="firstName"
            label="Име"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(false);
            }}
            hasError={nameError}
            errorMessage="Полето е задължително"
            autoFocus
            suffix={
              <button
                type="submit"
                aria-label="Продължи"
                className="search-arrow-btn"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            }
          />
        </form>
      </div>
    </div>
  );
};
