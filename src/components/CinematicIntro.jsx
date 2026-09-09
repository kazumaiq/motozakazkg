import { useEffect, useState } from 'react';

const INTRO_KEY = 'motozak-intro-seen';

export default function CinematicIntro({ onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(INTRO_KEY);
    if (seen) return;
    setVisible(true);
    const timeout = window.setTimeout(() => finish(), 2600);
    return () => window.clearTimeout(timeout);
  }, []);

  const finish = () => {
    sessionStorage.setItem(INTRO_KEY, '1');
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <div className="cinematic-intro" role="dialog" aria-label="MotoZakKG intro" aria-modal="true">
      <div className="intro-light" />
      <div className="intro-bike" aria-hidden="true" />
      <div className="intro-copy">
        <span className="intro-kicker">MOTOZAKKG · JAPAN → KYRGYZSTAN</span>
        <strong>MOTOZAK</strong>
        <span>МОТОЦИКЛЫ ИЗ ЯПОНИИ.</span>
      </div>
      <button className="intro-skip" type="button" onClick={finish}>Пропустить</button>
    </div>
  );
}
