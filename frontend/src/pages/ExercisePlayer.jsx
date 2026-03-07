import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

// ─── Exercise Definitions ────────────────────────────────────────────────────

const EXERCISES = {
  'box-breathing': {
    title: 'Box Breathing',
    subtitle: 'Inhale · Hold · Exhale · Hold',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    type: 'breathing',
    phases: [
      { label: 'Inhale',  duration: 4 },
      { label: 'Hold',    duration: 4 },
      { label: 'Exhale',  duration: 4 },
      { label: 'Hold',    duration: 4 },
    ],
    totalCycles: 4,
    intro: 'Breathe in sync with the circle. This pattern activates your parasympathetic nervous system — your built-in calm switch.',
  },
  'sunlight': {
    title: 'Sunlight Reset',
    subtitle: 'Breathe · Hydrate · Reset',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.25)',
    type: 'breathing',
    phases: [
      { label: 'Breathe In',  duration: 5 },
      { label: 'Breathe Out', duration: 5 },
    ],
    totalCycles: 3,
    intro: 'Step near a window if you can. Breathe slowly and drink a glass of water. Let the light reset your mind.',
  },
  'chunking': {
    title: 'Study Chunking',
    subtitle: '25 min focus · 5 min break',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.25)',
    type: 'timer',
    intro: 'Set a single goal for this session. Work only on that one thing. When the timer ends, take a real break.',
  },
  'active-recall': {
    title: 'Active Recall',
    subtitle: 'Test · Recall · Retain',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.25)',
    type: 'guide',
    steps: [
      { title: 'Close your notes',        desc: 'Put away everything. Only a blank page in front of you.' },
      { title: 'Write what you remember', desc: 'Dump everything you know about the topic onto the page. No peeking.' },
      { title: 'Check and compare',       desc: 'Open your notes. Highlight only the gaps — what did you miss?' },
      { title: 'Repeat the gaps',         desc: 'Close notes again. Recall only the parts you missed. Repeat until no gaps remain.' },
    ],
    intro: 'Active recall is the single most effective study technique proven by cognitive science. Follow each step.',
  },
  'pmr': {
    title: 'Progressive Muscle Relaxation',
    subtitle: 'Tense · Hold · Release',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.25)',
    type: 'pmr',
    groups: [
      { name: 'Feet & Toes',     instruction: 'Curl your toes tightly downward. Hold the tension.' },
      { name: 'Calves',          instruction: 'Flex your calves by pointing your feet upward. Hold.' },
      { name: 'Thighs',          instruction: 'Squeeze your thigh muscles together firmly. Hold.' },
      { name: 'Stomach',         instruction: 'Pull your stomach in, tighten your core. Hold.' },
      { name: 'Hands & Fists',   instruction: 'Clench both fists as tight as you can. Hold.' },
      { name: 'Arms',            instruction: 'Flex both biceps like a bodybuilder pose. Hold.' },
      { name: 'Shoulders',       instruction: 'Shrug your shoulders up to your ears. Hold.' },
      { name: 'Face & Jaw',      instruction: 'Scrunch your whole face — eyes, nose, jaw. Hold.' },
    ],
    tenseDuration: 5,
    releaseDuration: 8,
    intro: 'You will tense each muscle group for 5 seconds, then fully release for 8 seconds. Notice the contrast between tension and relaxation.',
  },
};

// ─── Breathing Circle Component ──────────────────────────────────────────────

function BreathingCircle({ phase, progress, color, glow }) {
  const isExpand = phase === 'Inhale' || phase === 'Breathe In';
  const scale = isExpand ? 1 + progress * 0.5 : phase === 'Exhale' || phase === 'Breathe Out' ? 1.5 - progress * 0.5 : phase === 'Hold' ? 1.5 : 1;

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Outer glow ring */}
        <motion.div
          animate={{ scale, opacity: 0.15 }}
          transition={{ duration: 0.1 }}
          className="absolute w-full h-full rounded-full"
          style={{ background: color, filter: `blur(30px)` }}
        />
        {/* Main circle */}
        <motion.div
          animate={{ scale }}
          transition={{ duration: 0.1 }}
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}55, ${color}22)`,
            border: `1.5px solid ${color}66`,
            boxShadow: `0 0 40px ${glow}`,
          }}
        />
        {/* Center dot */}
        <div className="w-3 h-3 rounded-full z-10" style={{ background: color }} />
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-light tracking-widest uppercase"
        style={{ color }}
      >
        {phase}
      </motion.p>
    </div>
  );
}

// ─── PMR Component ───────────────────────────────────────────────────────────

function PMRExercise({ exercise }) {
  const [step, setStep] = useState(-1); // -1 = intro
  const [phase, setPhase] = useState('tense'); // tense | release | done
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  const group = exercise.groups[step];

  const startStep = (idx) => {
    setStep(idx);
    setPhase('tense');
    setTimeLeft(exercise.tenseDuration);
  };

  useEffect(() => {
    if (step < 0 || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (phase === 'tense') {
            setPhase('release');
            setTimeLeft(exercise.releaseDuration);
          } else {
            // move to next
            const next = step + 1;
            if (next < exercise.groups.length) {
              setStep(next);
              setPhase('tense');
              setTimeLeft(exercise.tenseDuration);
            } else {
              setFinished(true);
            }
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, phase]);

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 text-center">
        <div className="text-6xl">🌿</div>
        <h3 className="text-2xl font-light text-white/80">Complete</h3>
        <p className="text-slate-400 max-w-sm">Your muscles are relaxed. Your body is calm. Take a moment to just exist.</p>
      </motion.div>
    );
  }

  if (step < 0) {
    return (
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <p className="text-slate-300 text-lg leading-relaxed font-light">{exercise.intro}</p>
        <p className="text-slate-500 text-sm">{exercise.groups.length} muscle groups · ~{Math.round(exercise.groups.length * (exercise.tenseDuration + exercise.releaseDuration) / 60)} min</p>
        <button
          onClick={() => startStep(0)}
          className="px-8 py-3 rounded-xl font-semibold text-white"
          style={{ background: `${exercise.color}33`, border: `1px solid ${exercise.color}55` }}
        >
          Begin
        </button>
      </div>
    );
  }

  const isTense = phase === 'tense';
  const totalTime = isTense ? exercise.tenseDuration : exercise.releaseDuration;
  const progress = 1 - timeLeft / totalTime;

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-md w-full">

      {/* Progress dots */}
      <div className="flex gap-2">
        {exercise.groups.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i < step ? exercise.color : i === step ? exercise.color : 'rgba(255,255,255,0.1)',
              opacity: i < step ? 0.4 : 1,
            }}
          />
        ))}
      </div>

      {/* Muscle group */}
      <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2">
        <p className="text-slate-500 text-sm uppercase tracking-widest">{step + 1} of {exercise.groups.length}</p>
        <h3 className="text-2xl font-bold text-white/90">{group.name}</h3>
        <p className="text-slate-300 font-light">{group.instruction}</p>
      </motion.div>

      {/* Timer circle */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={exercise.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-3xl font-bold text-white">{timeLeft}</p>
          <p className="text-xs uppercase tracking-wider" style={{ color: exercise.color }}>
            {isTense ? 'Tense' : 'Release'}
          </p>
        </div>
      </div>

    </div>
  );
}

// ─── Guide Component ─────────────────────────────────────────────────────────

function GuideExercise({ exercise }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col items-center gap-8 max-w-md w-full">
      <p className="text-slate-400 text-center font-light">{exercise.intro}</p>

      <div className="flex flex-col gap-3 w-full">
        {exercise.steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setCurrent(i)}
            className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
            style={{
              background: current === i ? `${exercise.color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${current === i ? exercise.color + '44' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
              style={{ background: current === i ? exercise.color : 'rgba(255,255,255,0.08)', color: current === i ? '#000' : '#888' }}
            >
              {i + 1}
            </div>
            <div>
              <p className="font-semibold text-white/80 text-sm">{s.title}</p>
              <p className="text-slate-400 text-sm font-light mt-0.5">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Timer Component ─────────────────────────────────────────────────────────

function PomodoroTimer({ exercise }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // focus | break
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s === 0) {
            if (minutes === 0) {
              clearInterval(timerRef.current);
              setRunning(false);
              if (mode === 'focus') { setMode('break'); setMinutes(5); setSeconds(0); }
              else { setMode('focus'); setMinutes(25); setSeconds(0); }
              return 0;
            }
            setMinutes((m) => m - 1);
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, minutes]);

  const reset = () => { setRunning(false); setMinutes(25); setSeconds(0); setMode('focus'); };
  const total = mode === 'focus' ? 25 * 60 : 5 * 60;
  const elapsed = total - (minutes * 60 + seconds);
  const progress = elapsed / total;

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-slate-400 text-center font-light max-w-sm">{exercise.intro}</p>

      <p className="text-sm uppercase tracking-widest" style={{ color: exercise.color }}>
        {mode === 'focus' ? '🎯 Focus Session' : '☕ Break Time'}
      </p>

      {/* Timer ring */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={exercise.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="text-center z-10">
          <p className="text-4xl font-bold text-white font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setRunning((r) => !r)}
          className="px-8 py-3 rounded-xl font-semibold text-white flex items-center gap-2"
          style={{ background: `${exercise.color}33`, border: `1px solid ${exercise.color}55` }}
        >
          <Play size={16} />
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Breathing Exercise Component ────────────────────────────────────────────

function BreathingExercise({ exercise }) {
  const [started, setStarted] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(exercise.phases[0].duration);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const phase = exercise.phases[phaseIdx];

  useEffect(() => {
    if (!started || done) return;

    startTimeRef.current = Date.now();
    const phaseDuration = phase.duration * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / phaseDuration, 1);
      setProgress(p);
      setTimeLeft(Math.max(phase.duration - Math.floor(elapsed / 1000), 0));

      if (p >= 1) {
        clearInterval(timerRef.current);
        const nextPhase = (phaseIdx + 1) % exercise.phases.length;
        const isNewCycle = nextPhase === 0;
        const nextCycle = isNewCycle ? cycle + 1 : cycle;

        if (isNewCycle && nextCycle > exercise.totalCycles) {
          setDone(true);
        } else {
          if (isNewCycle) setCycle(nextCycle);
          setPhaseIdx(nextPhase);
          setTimeLeft(exercise.phases[nextPhase].duration);
          setProgress(0);
        }
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [started, phaseIdx, done]);

  if (done) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 text-center">
        <div className="text-6xl">✨</div>
        <h3 className="text-2xl font-light text-white/80">Beautiful</h3>
        <p className="text-slate-400 max-w-sm">You completed {exercise.totalCycles} cycles. Your nervous system thanks you.</p>
      </motion.div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <p className="text-slate-300 text-lg leading-relaxed font-light">{exercise.intro}</p>
        <p className="text-slate-500 text-sm">{exercise.totalCycles} cycles · {exercise.phases.length} phases · ~{Math.round(exercise.totalCycles * exercise.phases.reduce((a, p) => a + p.duration, 0) / 60)} min</p>
        <button
          onClick={() => setStarted(true)}
          className="px-8 py-3 rounded-xl font-semibold text-white"
          style={{ background: `${exercise.color}33`, border: `1px solid ${exercise.color}55` }}
        >
          Begin
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-slate-500 text-sm">Cycle {cycle} of {exercise.totalCycles}</p>
      <BreathingCircle phase={phase.label} progress={progress} color={exercise.color} glow={exercise.glow} />
      <p className="text-slate-500 font-mono text-sm">{timeLeft}s</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExercisePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level;

  const exercise = EXERCISES[id];

  if (!exercise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-400">Exercise not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300">Go back</button>
      </div>
    );
  }

  const renderExercise = () => {
    switch (exercise.type) {
      case 'breathing': return <BreathingExercise exercise={exercise} />;
      case 'pmr':       return <PMRExercise exercise={exercise} />;
      case 'guide':     return <GuideExercise exercise={exercise} />;
      case 'timer':     return <PomodoroTimer exercise={exercise} />;
      default:          return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center min-h-[85vh]">

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
        className="self-start flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-10 text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: exercise.color }}
        >
          {exercise.title}
        </h2>
        <p className="text-slate-500 text-sm tracking-widest uppercase">{exercise.subtitle}</p>
      </motion.div>

      {/* Exercise Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-col items-center"
      >
        {renderExercise()}
      </motion.div>

    </div>
  );
}
