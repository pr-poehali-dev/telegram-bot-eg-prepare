import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MATH_TASKS, type Task } from "@/data/mathTasks";
import { RUSSIAN_TASKS } from "@/data/russianTasks";
import { CS_TASKS } from "@/data/csTasks";

type Subject = "math" | "russian" | "cs";
type Screen = "subjects" | "home" | "task" | "result" | "solution";

interface SubjectConfig {
  id: Subject;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  accent: string;
  border: string;
  bg: string;
  glow: string;
  tasks: Task[];
  description: string;
}

const SUBJECTS: SubjectConfig[] = [
  {
    id: "math",
    label: "Профильная математика",
    shortLabel: "Математика",
    emoji: "📐",
    color: "text-violet-300",
    accent: "bg-violet-600 hover:bg-violet-500",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
    glow: "shadow-violet-500/20",
    tasks: MATH_TASKS,
    description: "12 заданий части 1 + 1 задание части 2",
  },
  {
    id: "russian",
    label: "Русский язык",
    shortLabel: "Русский",
    emoji: "📝",
    color: "text-emerald-300",
    accent: "bg-emerald-600 hover:bg-emerald-500",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/20",
    tasks: RUSSIAN_TASKS,
    description: "26 заданий части 1 (без сочинения)",
  },
  {
    id: "cs",
    label: "Информатика",
    shortLabel: "Информатика",
    emoji: "💻",
    color: "text-sky-300",
    accent: "bg-sky-600 hover:bg-sky-500",
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
    glow: "shadow-sky-500/20",
    tasks: CS_TASKS,
    description: "23 задания части 1",
  },
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>("subjects");
  const [activeSubject, setActiveSubject] = useState<Subject>("math");
  const [currentTaskId, setCurrentTaskId] = useState<number>(1);
  const [allAnswers, setAllAnswers] = useState<Record<Subject, Record<number, number | string>>>({
    math: {}, russian: {}, cs: {},
  });
  const [inputValue, setInputValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [solutionTaskId, setSolutionTaskId] = useState<number>(1);

  const subjectConfig = SUBJECTS.find((s) => s.id === activeSubject)!;
  const tasks = subjectConfig.tasks;
  const answers = allAnswers[activeSubject];
  const currentTask = tasks.find((t) => t.id === currentTaskId)!;

  const getTaskStatus = (task: Task) => {
    const ans = answers[task.id];
    if (ans === undefined) return "unanswered";
    const isCorrect =
      task.type === "choice"
        ? (ans as number) === task.correct
        : String(ans).trim() === String(task.correct).trim();
    return isCorrect ? "correct" : "wrong";
  };

  const openTask = (id: number) => {
    const task = tasks.find((t) => t.id === id)!;
    setCurrentTaskId(id);
    setShowHint(false);
    setSubmitted(answers[id] !== undefined);
    setInputValue(answers[id] !== undefined ? String(answers[id]) : "");
    setSelectedOption(
      answers[id] !== undefined && task.type === "choice" ? (answers[id] as number) : null
    );
    setScreen("task");
  };

  const submitAnswer = () => {
    if (currentTask.type === "choice") {
      if (selectedOption === null) return;
      setAllAnswers((prev) => ({
        ...prev,
        [activeSubject]: { ...prev[activeSubject], [currentTaskId]: selectedOption },
      }));
    } else {
      if (!inputValue.trim()) return;
      setAllAnswers((prev) => ({
        ...prev,
        [activeSubject]: { ...prev[activeSubject], [currentTaskId]: inputValue.trim() },
      }));
    }
    setSubmitted(true);
  };

  const isCurrentCorrect = () => {
    if (!submitted) return false;
    const ans = currentTask.type === "choice" ? selectedOption : inputValue.trim();
    if (currentTask.type === "choice") return (ans as number) === currentTask.correct;
    return String(ans).trim() === String(currentTask.correct).trim();
  };

  const nextTask = () => {
    const allIds = tasks.map((t) => t.id);
    const idx = allIds.indexOf(currentTaskId);
    if (idx < allIds.length - 1) {
      openTask(allIds[idx + 1]);
    } else {
      setScreen("result");
    }
  };

  const getSubjectStats = (subj: Subject) => {
    const subjTasks = SUBJECTS.find((s) => s.id === subj)!.tasks;
    const subjAnswers = allAnswers[subj];
    const answered = Object.keys(subjAnswers).length;
    const correct = subjTasks.filter((t) => {
      const ans = subjAnswers[t.id];
      if (ans === undefined) return false;
      return t.type === "choice"
        ? (ans as number) === t.correct
        : String(ans).trim() === String(t.correct).trim();
    }).length;
    return { answered, correct, total: subjTasks.length };
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = tasks.filter((t) => {
    const ans = answers[t.id];
    if (ans === undefined) return false;
    return t.type === "choice"
      ? (ans as number) === t.correct
      : String(ans).trim() === String(t.correct).trim();
  }).length;
  const totalPoints = tasks.reduce((sum, t) => {
    const ans = answers[t.id];
    if (ans === undefined) return sum;
    const ok =
      t.type === "choice"
        ? (ans as number) === t.correct
        : String(ans).trim() === String(t.correct).trim();
    return sum + (ok ? t.points : 0);
  }, 0);
  const maxPoints = tasks.reduce((s, t) => s + t.points, 0);

  const accentBtnCls = subjectConfig.accent;
  const colorCls = subjectConfig.color;
  const borderCls = subjectConfig.border;
  const bgCls = subjectConfig.bg;

  // ── SUBJECTS SCREEN ───────────────────────────────────────────
  if (screen === "subjects") {
    return (
      <div className="min-h-screen bg-[#0a0a14] font-golos text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="font-montserrat text-4xl font-black text-white mb-2 leading-tight">
              ЕГЭ 2026
            </h1>
            <p className="text-white/50">Тренажёр заданий — выбери предмет</p>
          </div>

          <div className="space-y-3">
            {SUBJECTS.map((subj) => {
              const stats = getSubjectStats(subj.id);
              const pct = stats.total > 0 ? (stats.answered / stats.total) * 100 : 0;
              return (
                <button
                  key={subj.id}
                  onClick={() => {
                    setActiveSubject(subj.id);
                    setScreen("home");
                  }}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border ${subj.border} ${subj.bg} hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-left`}
                >
                  <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 flex-shrink-0">
                    {subj.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-montserrat font-bold text-white text-base leading-tight mb-0.5">
                      {subj.label}
                    </div>
                    <div className="text-xs text-white/40 mb-2">{subj.description}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${subj.id === "math" ? "bg-violet-500" : subj.id === "russian" ? "bg-emerald-500" : "bg-sky-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/30 flex-shrink-0">
                        {stats.answered}/{stats.total}
                      </span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-white/30 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-white/20 mt-8">
            Все задания соответствуют структуре ЕГЭ 2026
          </p>
        </div>
      </div>
    );
  }

  // ── HOME (subject) ────────────────────────────────────────────
  if (screen === "home") {
    const part1 = tasks.filter((t) => t.part === 1);
    const part2 = tasks.filter((t) => t.part === 2);
    return (
      <div className="min-h-screen bg-[#0a0a14] font-golos text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
          {/* Back */}
          <button
            onClick={() => setScreen("subjects")}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            <Icon name="ArrowLeft" size={16} />
            Все предметы
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 ${bgCls} border ${borderCls} rounded-full px-4 py-1.5 mb-4 text-xs ${colorCls} uppercase tracking-widest font-semibold`}>
              <span>{subjectConfig.emoji}</span> {subjectConfig.label}
            </div>
            <h1 className="font-montserrat text-3xl font-black text-white mb-1 leading-tight">
              Тренажёр заданий
            </h1>
            <p className="text-white/40 text-sm">{subjectConfig.description}</p>
          </div>

          {/* Stats */}
          <div className={`${bgCls} border ${borderCls} rounded-2xl p-5 mb-6 flex items-center justify-between`}>
            <div>
              <div className="text-2xl font-montserrat font-black text-white">{answeredCount}/{tasks.length}</div>
              <div className="text-white/40 text-xs mt-0.5">выполнено</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-emerald-400">{correctCount}</div>
              <div className="text-white/40 text-xs mt-0.5">верных</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className={`text-2xl font-montserrat font-black ${colorCls}`}>{totalPoints}/{maxPoints}</div>
              <div className="text-white/40 text-xs mt-0.5">баллов</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
            <div
              className={`h-full rounded-full transition-all duration-500 ${subjectConfig.id === "math" ? "bg-violet-500" : subjectConfig.id === "russian" ? "bg-emerald-500" : "bg-sky-500"}`}
              style={{ width: `${(answeredCount / tasks.length) * 100}%` }}
            />
          </div>

          {/* Part 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Часть 1</div>
              <div className="flex-1 h-px bg-white/10" />
              <div className="text-xs text-white/30">1 балл</div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {part1.map((task) => {
                const st = getTaskStatus(task);
                return (
                  <button
                    key={task.id}
                    onClick={() => openTask(task.id)}
                    className={`relative p-2.5 rounded-xl border text-left transition-all duration-150 hover:scale-[1.05] active:scale-[0.95]
                      ${st === "correct" ? "bg-emerald-500/15 border-emerald-500/30" :
                        st === "wrong" ? "bg-rose-500/15 border-rose-500/30" :
                        `${bgCls} border-white/10 hover:border-white/20`}`}
                  >
                    <div className="text-[9px] text-white/30 font-medium">№{task.id}</div>
                    <div className="text-[10px] text-white/60 leading-tight mt-0.5 line-clamp-2">
                      {task.topic.split(" · ")[1]}
                    </div>
                    {st === "correct" && (
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Icon name="Check" size={8} className="text-white" />
                      </div>
                    )}
                    {st === "wrong" && (
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center">
                        <Icon name="X" size={8} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part 2 (if exists) */}
          {part2.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Часть 2</div>
                <div className="flex-1 h-px bg-white/10" />
                <div className="text-xs text-white/30">до 4 баллов</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {part2.map((task) => {
                  const st = getTaskStatus(task);
                  return (
                    <button
                      key={task.id}
                      onClick={() => openTask(task.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.97]
                        ${st === "correct" ? "bg-emerald-500/15 border-emerald-500/30" :
                          st === "wrong" ? "bg-rose-500/15 border-rose-500/30" :
                          `${bgCls} border-white/10 hover:border-white/20`}`}
                    >
                      <div className={`text-[10px] ${colorCls} opacity-70 mb-1 font-semibold uppercase tracking-wider`}>
                        {task.topic.split(" · ")[0]}
                      </div>
                      <div className="text-sm text-white font-medium leading-tight">
                        {task.topic.split(" · ")[1]}
                      </div>
                      <div className="text-xs text-white/30 mt-1">Развёрнутый ответ · {task.points} балла</div>
                      {st !== "unanswered" && (
                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${st === "correct" ? "bg-emerald-500" : "bg-rose-500"}`}>
                          <Icon name={st === "correct" ? "Check" : "X"} size={11} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          {answeredCount === 0 ? (
            <button
              onClick={() => openTask(tasks[0].id)}
              className={`w-full py-4 ${accentBtnCls} active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base`}
            >
              Начать тренировку →
            </button>
          ) : answeredCount === tasks.length ? (
            <button
              onClick={() => setScreen("result")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base"
            >
              Смотреть результат →
            </button>
          ) : (
            <button
              onClick={() => {
                const first = tasks.find((t) => answers[t.id] === undefined);
                if (first) openTask(first.id);
              }}
              className={`w-full py-4 ${accentBtnCls} active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base`}
            >
              Продолжить ({tasks.length - answeredCount} осталось) →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── TASK ─────────────────────────────────────────────────────
  if (screen === "task" && currentTask) {
    return (
      <div className="min-h-screen bg-[#0a0a14] font-golos text-white">
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          {/* Nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setScreen("home")}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <Icon name="ArrowLeft" size={16} />
              {subjectConfig.shortLabel}
            </button>
            <div className="text-xs text-white/30">{answers[currentTaskId] !== undefined ? "✓ Выполнено" : `Часть ${currentTask.part}`}</div>
          </div>

          {/* Task navigator */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {tasks.map((t) => {
              const st = getTaskStatus(t);
              return (
                <button
                  key={t.id}
                  onClick={() => openTask(t.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all
                    ${t.id === currentTaskId
                      ? `${subjectConfig.id === "math" ? "bg-violet-500" : subjectConfig.id === "russian" ? "bg-emerald-600" : "bg-sky-600"} text-white scale-110`
                      : st === "correct" ? "bg-emerald-500/30 text-emerald-300"
                      : st === "wrong" ? "bg-rose-500/30 text-rose-300"
                      : "bg-white/10 text-white/40 hover:bg-white/20"
                    }`}
                >
                  {t.id}
                </button>
              );
            })}
          </div>

          {/* Topic badge */}
          <div className={`inline-flex items-center gap-2 ${bgCls} border ${borderCls} rounded-full px-3 py-1 mb-4 text-xs ${colorCls} font-semibold`}>
            {subjectConfig.emoji} {currentTask.topic}
          </div>

          {/* Question */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <p className="text-white text-base leading-relaxed whitespace-pre-line font-medium">
              {currentTask.question}
            </p>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4 animate-fade-in">
              <div className="text-xs text-amber-300/70 font-semibold uppercase tracking-wider mb-1.5">💡 Подсказка</div>
              <p className="text-amber-100 text-sm leading-relaxed">{currentTask.hint}</p>
            </div>
          )}

          {/* Options */}
          {currentTask.type === "choice" && currentTask.options && (
            <div className="space-y-2 mb-4">
              {currentTask.options.map((opt, idx) => {
                let state = "default";
                if (submitted) {
                  if (idx === currentTask.correct) state = "correct";
                  else if (idx === selectedOption) state = "wrong";
                } else if (idx === selectedOption) {
                  state = "selected";
                }
                const selectedColor = subjectConfig.id === "math" ? "bg-violet-500/20 border-violet-500/50 text-white" :
                  subjectConfig.id === "russian" ? "bg-emerald-600/20 border-emerald-500/50 text-white" :
                  "bg-sky-500/20 border-sky-500/50 text-white";
                const selectedBadge = subjectConfig.id === "math" ? "bg-violet-500" : subjectConfig.id === "russian" ? "bg-emerald-600" : "bg-sky-600";
                return (
                  <button
                    key={idx}
                    disabled={submitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                      ${state === "correct" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200" :
                        state === "wrong" ? "bg-rose-500/20 border-rose-500/50 text-rose-200" :
                        state === "selected" ? selectedColor :
                        "bg-white/5 border-white/10 text-white/80 hover:bg-white/8 hover:border-white/20"
                      } ${submitted ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${state === "correct" ? "bg-emerald-500 text-white" :
                        state === "wrong" ? "bg-rose-500 text-white" :
                        state === "selected" ? `${selectedBadge} text-white` :
                        "bg-white/10 text-white/50"
                      }`}>
                      {["А","Б","В","Г"][idx]}
                    </div>
                    <span className="font-medium text-sm">{opt}</span>
                    {state === "correct" && <Icon name="Check" size={16} className="ml-auto text-emerald-400" />}
                    {state === "wrong" && <Icon name="X" size={16} className="ml-auto text-rose-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Input */}
          {currentTask.type === "input" && (
            <div className="mb-4">
              <div className="text-xs text-white/40 mb-2 font-medium">Введи ответ (в долях π, например: 0.5 = π/2)</div>
              <div className="flex gap-3">
                <input
                  disabled={submitted}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ответ..."
                  className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-base outline-none focus:ring-2 transition-all
                    ${submitted
                      ? isCurrentCorrect() ? "border-emerald-500/50 ring-emerald-500/20" : "border-rose-500/50 ring-rose-500/20"
                      : `border-white/10 focus:border-${subjectConfig.id === "math" ? "violet" : subjectConfig.id === "russian" ? "emerald" : "sky"}-500/50`
                    }`}
                />
                {submitted && (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCurrentCorrect() ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                    <Icon name={isCurrentCorrect() ? "Check" : "X"} size={20} className={isCurrentCorrect() ? "text-emerald-400" : "text-rose-400"} />
                  </div>
                )}
              </div>
              {submitted && !isCurrentCorrect() && (
                <div className="mt-2 text-sm text-white/50">
                  Правильный ответ: <span className="text-emerald-300 font-bold">{String(currentTask.correct)}</span>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {submitted && (
            <div className={`rounded-xl p-4 mb-4 animate-fade-in border ${isCurrentCorrect() ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{isCurrentCorrect() ? "✅" : "❌"}</span>
                <span className={`text-sm font-bold ${isCurrentCorrect() ? "text-emerald-300" : "text-rose-300"}`}>
                  {isCurrentCorrect() ? "Правильно!" : "Неверно"}
                </span>
              </div>
              <button
                onClick={() => { setSolutionTaskId(currentTaskId); setScreen("solution"); }}
                className="text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
              >
                Посмотреть полное решение →
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2.5">
            {!showHint && !submitted && (
              <button
                onClick={() => setShowHint(true)}
                className="flex-1 py-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-sm font-semibold hover:bg-amber-500/20 transition-all active:scale-[0.98]"
              >
                💡 Подсказка
              </button>
            )}
            {!submitted ? (
              <button
                onClick={submitAnswer}
                disabled={currentTask.type === "choice" ? selectedOption === null : !inputValue.trim()}
                className={`flex-1 py-3.5 ${accentBtnCls} disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98]`}
              >
                Проверить →
              </button>
            ) : (
              <button
                onClick={nextTask}
                className={`flex-1 py-3.5 ${accentBtnCls} text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98]`}
              >
                {currentTaskId === tasks[tasks.length - 1].id ? "Результаты →" : "Следующее →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SOLUTION ──────────────────────────────────────────────────
  if (screen === "solution") {
    const st = tasks.find((t) => t.id === solutionTaskId)!;
    return (
      <div className="min-h-screen bg-[#0a0a14] font-golos text-white">
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          <button
            onClick={() => setScreen("task")}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад к заданию
          </button>
          <div className={`inline-flex items-center gap-2 ${bgCls} border ${borderCls} rounded-full px-3 py-1 mb-5 text-xs ${colorCls} font-semibold`}>
            📖 Разбор · {st.topic}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <div className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">Задание</div>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{st.question}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">Решение</div>
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">{st.solution}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────
  if (screen === "result") {
    return (
      <div className="min-h-screen bg-[#0a0a14] font-golos text-white">
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          <button
            onClick={() => setScreen("home")}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-8"
          >
            <Icon name="ArrowLeft" size={16} />
            {subjectConfig.shortLabel}
          </button>
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">
              {correctCount >= tasks.length * 0.8 ? "🏆" : correctCount >= tasks.length * 0.5 ? "🎯" : "📚"}
            </div>
            <h2 className="font-montserrat text-3xl font-black text-white mb-2">
              {correctCount >= tasks.length * 0.8 ? "Отлично!" : correctCount >= tasks.length * 0.5 ? "Хорошо!" : "Нужно поработать"}
            </h2>
            <p className="text-white/50">{subjectConfig.label}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className={`${bgCls} border ${borderCls} rounded-2xl p-4 text-center`}>
              <div className={`text-3xl font-montserrat font-black ${colorCls}`}>{totalPoints}</div>
              <div className="text-xs text-white/40 mt-1">из {maxPoints} баллов</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-montserrat font-black text-emerald-300">{correctCount}</div>
              <div className="text-xs text-white/40 mt-1">правильных</div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-montserrat font-black text-rose-300">{tasks.length - correctCount}</div>
              <div className="text-xs text-white/40 mt-1">с ошибкой</div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {tasks.map((task) => {
              const status = getTaskStatus(task);
              const ans = answers[task.id];
              return (
                <button
                  key={task.id}
                  onClick={() => { setSolutionTaskId(task.id); setScreen("solution"); }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.01] text-left
                    ${status === "correct" ? "bg-emerald-500/10 border-emerald-500/20" :
                      status === "wrong" ? "bg-rose-500/10 border-rose-500/20" :
                      "bg-white/5 border-white/10"
                    }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${status === "correct" ? "bg-emerald-500 text-white" :
                      status === "wrong" ? "bg-rose-500 text-white" :
                      "bg-white/10 text-white/50"}`}>
                    {task.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/70 truncate">{task.topic}</div>
                    {ans !== undefined && task.type === "choice" && task.options && (
                      <div className="text-xs text-white/30 mt-0.5">
                        Ваш: {task.options[ans as number]}
                        {status === "wrong" && ` → верно: ${task.options[task.correct as number]}`}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/30 flex-shrink-0">разбор →</div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setScreen("subjects")}
              className="flex-1 py-4 bg-white/10 hover:bg-white/15 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white/70 text-sm"
            >
              ← Предметы
            </button>
            <button
              onClick={() => {
                setAllAnswers((prev) => ({ ...prev, [activeSubject]: {} }));
                setScreen("home");
              }}
              className={`flex-1 py-4 ${accentBtnCls} active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-sm`}
            >
              Заново →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
