import React, { useState } from 'react';

interface MatFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  suffix?: React.ReactNode;
  className?: string;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MatFormField: React.FC<MatFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  hasError = false,
  errorMessage = 'Полето е задължително',
  autoFocus = false,
  autoComplete = 'off',
  suffix,
  className = '',
  onBlur,
  onKeyDown
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || Boolean(value && value.trim().length > 0);

  return (
    <div
      className={`mat-mdc-form-field full-width mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary mat-form-field-animations-enabled ${
        isFocused ? 'mat-focused' : ''
      } ${hasError ? 'mat-form-field-invalid ng-invalid ng-touched' : ''} ${
        isFloating ? '' : 'mat-form-field-hide-placeholder'
      } ${className}`}
    >
      <div
        className={`mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined ${
          isFocused ? 'mdc-text-field--focused' : ''
        } ${hasError ? 'mdc-text-field--invalid' : ''}`}
      >
        {/* Notched outline placed directly on the wrapper so width matches 100% */}
        <div
          className={`mdc-notched-outline mdc-notched-outline--upgraded ${
            isFloating ? 'mdc-notched-outline--notched' : ''
          }`}
        >
          <div className="mat-mdc-notch-piece mdc-notched-outline__leading" />
          <div className="mat-mdc-notch-piece mdc-notched-outline__notch">
            <label
              className={`mdc-floating-label mat-mdc-floating-label ${
                isFloating ? 'mdc-floating-label--float-above' : ''
              }`}
              htmlFor={id}
            >
              <span className="mat-label">{label}</span>
              {required && (
                <span
                  aria-hidden="true"
                  className="mat-mdc-form-field-required-marker mdc-floating-label--required"
                >
                  *
                </span>
              )}
            </label>
          </div>
          <div className="mat-mdc-notch-piece mdc-notched-outline__trailing" />
        </div>

        {/* Content flex: input + suffix */}
        <div className="mat-mdc-form-field-flex">
          <div className="mat-mdc-form-field-infix">
            <input
              id={id}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur?.();
              }}
              onKeyDown={onKeyDown}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              required={required}
              className="mat-mdc-input-element mat-mdc-form-field-input-control mdc-text-field__input"
            />
          </div>

          {suffix && (
            <div className="mat-mdc-form-field-icon-suffix flex items-center shrink-0">
              {suffix}
            </div>
          )}
        </div>
      </div>

      {hasError && (
        <div
          aria-atomic="true"
          aria-live="polite"
          className="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"
        >
          <div className="mat-mdc-form-field-error-wrapper">
            <div className="mat-mdc-form-field-error mat-mdc-form-field-bottom-align">
              {errorMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
