"use client"

import { useState } from 'react';

export default function BrandInitPage() {
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleInput = (e) => {
    setLink(e.target.value);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Enter your brand's link</h2>
            <input type="text" value={link} onChange={handleInput} />
            <button onClick={handleNext}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Loading...</h2>
            <p>We're checking your link...</p>
            <button onClick={handleNext}>Next</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderStep()}
    </div>
  );
}
