/**
 * Audio Telemetry Utility
 * Synthesizes sound effects for TokVault
 */

const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  switch (type) {
    case "beep":
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.1);
      break;

    case "chime":
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(
        880,
        audioCtx.currentTime + 0.2,
      );
      gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.5);
      break;

    case "success":
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc3.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      osc3.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.3); // C6
      gain3.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start();
      osc3.stop(audioCtx.currentTime + 0.6);
      break;

    case "error":
      const osc4 = audioCtx.createOscillator();
      const gain4 = audioCtx.createGain();
      osc4.type = "sawtooth";
      osc4.frequency.setValueAtTime(150, audioCtx.currentTime);
      gain4.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain4.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc4.connect(gain4);
      gain4.connect(audioCtx.destination);
      osc4.start();
      osc4.stop(audioCtx.currentTime + 0.3);
      break;
  }
};

export default playSound;
