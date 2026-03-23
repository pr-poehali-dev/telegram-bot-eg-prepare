import { useState } from "react";
import Icon from "@/components/ui/icon";

type Screen = "home" | "task" | "result" | "solution";

interface Task {
  id: number;
  part: 1 | 2;
  topic: string;
  question: string;
  options?: string[];
  correct: number | string;
  type: "choice" | "input";
  hint: string;
  solution: string;
  points: number;
}

const TASKS: Task[] = [
  // ─── ЧАСТЬ 1 ───────────────────────────────────────────────
  {
    id: 1,
    part: 1,
    topic: "Задание 1 · Вычисления",
    question: "Найдите значение выражения:\n(2⁻³ · 8²) / (4³ · 2⁻⁵)",
    options: ["1/2", "2", "4", "1/4"],
    correct: 1,
    type: "choice",
    hint: "Приведи все степени к основанию 2 и используй правила: aᵐ·aⁿ = aᵐ⁺ⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ",
    solution: "2⁻³ · 8² = 2⁻³ · 2⁶ = 2³\n4³ · 2⁻⁵ = 2⁶ · 2⁻⁵ = 2¹\n\n2³ / 2¹ = 2² = 4\n\nОтвет: **4** ✅",
    points: 1,
  },
  {
    id: 2,
    part: 1,
    topic: "Задание 2 · Логарифмы",
    question: "Вычислите:\nlog₃(81) + log₃(1/3)",
    options: ["2", "3", "4", "5"],
    correct: 1,
    type: "choice",
    hint: "log₃(81) = log₃(3⁴) = 4, а log₃(1/3) = log₃(3⁻¹) = -1",
    solution: "log₃(81) = log₃(3⁴) = 4\nlog₃(1/3) = log₃(3⁻¹) = −1\n\n4 + (−1) = **3** ✅",
    points: 1,
  },
  {
    id: 3,
    part: 1,
    topic: "Задание 3 · Тригонометрия",
    question: "Найдите значение выражения:\nsin²(30°) + cos²(30°) + tg(45°)",
    options: ["1", "2", "3", "0"],
    correct: 1,
    type: "choice",
    hint: "Используй основное тригонометрическое тождество sin²α + cos²α = 1, и значение tg(45°) = 1",
    solution: "sin²(30°) + cos²(30°) = 1  (основное тождество)\ntg(45°) = 1\n\n1 + 1 = **2** ✅",
    points: 1,
  },
  {
    id: 4,
    part: 1,
    topic: "Задание 4 · Прогрессия",
    question: "Геометрическая прогрессия: первый член b₁ = 4, знаменатель q = 3. Найдите b₄.",
    options: ["36", "54", "108", "324"],
    correct: 2,
    type: "choice",
    hint: "Формула n-го члена: bₙ = b₁ · qⁿ⁻¹. Подставь n = 4.",
    solution: "bₙ = b₁ · qⁿ⁻¹\nb₄ = 4 · 3³ = 4 · 27 = **108** ✅",
    points: 1,
  },
  {
    id: 5,
    part: 1,
    topic: "Задание 5 · Уравнения",
    question: "Решите уравнение:\n3^(2x−1) = 27",
    options: ["x = 1", "x = 2", "x = 3", "x = 1,5"],
    correct: 1,
    type: "choice",
    hint: "27 = 3³. Приравняй показатели: 2x − 1 = 3",
    solution: "27 = 3³\n3^(2x−1) = 3³\n2x − 1 = 3\n2x = 4\nx = **2** ✅",
    points: 1,
  },
  {
    id: 6,
    part: 1,
    topic: "Задание 6 · Неравенства",
    question: "Решите неравенство:\n2^(x−1) < 8\n\nУкажи множество решений:",
    options: ["x < 3", "x < 4", "x ≤ 4", "x < 2"],
    correct: 1,
    type: "choice",
    hint: "8 = 2³. Показательная функция с основанием 2 > 1 возрастает, знак неравенства не меняется.",
    solution: "8 = 2³\n2^(x−1) < 2³\nx − 1 < 3\nx < **4** ✅",
    points: 1,
  },
  {
    id: 7,
    part: 1,
    topic: "Задание 7 · Производная",
    question: "Найдите производную функции:\nf(x) = 3x⁴ − 5x² + 2x − 7",
    options: ["12x³ − 10x + 2", "12x³ − 5x + 2", "12x³ − 10x", "3x³ − 10x + 2"],
    correct: 0,
    type: "choice",
    hint: "Правило: (xⁿ)' = n·xⁿ⁻¹. Применяй к каждому слагаемому по отдельности.",
    solution: "(3x⁴)' = 12x³\n(−5x²)' = −10x\n(2x)' = 2\n(−7)' = 0\n\nf'(x) = **12x³ − 10x + 2** ✅",
    points: 1,
  },
  {
    id: 8,
    part: 1,
    topic: "Задание 8 · Интеграл",
    question: "Вычислите интеграл:\n∫₀² (3x² − 2x) dx",
    options: ["4", "6", "8", "2"],
    correct: 0,
    type: "choice",
    hint: "∫xⁿdx = xⁿ⁺¹/(n+1). Подставь пределы: F(2) − F(0).",
    solution: "∫(3x² − 2x)dx = x³ − x²\n\nF(2) = 8 − 4 = 4\nF(0) = 0 − 0 = 0\n\n4 − 0 = **4** ✅",
    points: 1,
  },
  {
    id: 9,
    part: 1,
    topic: "Задание 9 · Планиметрия",
    question: "В прямоугольном треугольнике гипотенуза равна 10, один катет равен 6. Найди другой катет.",
    options: ["6", "8", "7", "4"],
    correct: 1,
    type: "choice",
    hint: "Теорема Пифагора: a² + b² = c². Подставь c = 10, a = 6.",
    solution: "a² + b² = c²\n6² + b² = 10²\n36 + b² = 100\nb² = 64\nb = **8** ✅",
    points: 1,
  },
  {
    id: 10,
    part: 1,
    topic: "Задание 10 · Стереометрия",
    question: "Куб со стороной 3. Найдите площадь полной поверхности.",
    options: ["27", "36", "54", "72"],
    correct: 2,
    type: "choice",
    hint: "Куб имеет 6 граней, каждая — квадрат со стороной a. S = 6a²",
    solution: "Площадь одной грани = 3² = 9\nГраней у куба = 6\n\nS = 6 · 9 = **54** ✅",
    points: 1,
  },
  {
    id: 11,
    part: 1,
    topic: "Задание 11 · Теория вероятностей",
    question: "В ящике 5 красных и 3 синих шара. Один шар вынули наугад. Какова вероятность, что он красный?",
    options: ["3/8", "5/8", "1/2", "5/3"],
    correct: 1,
    type: "choice",
    hint: "P = (число благоприятных исходов) / (общее число исходов). Всего шаров = 5 + 3 = 8.",
    solution: "Всего шаров: 5 + 3 = 8\nКрасных: 5\n\nP = 5/8 = **0,625** ✅",
    points: 1,
  },
  {
    id: 12,
    part: 1,
    topic: "Задание 12 · Функции и графики",
    question: "При каком значении x функция f(x) = x² − 6x + 8 принимает наименьшее значение?",
    options: ["x = 2", "x = 3", "x = 4", "x = 6"],
    correct: 1,
    type: "choice",
    hint: "Вершина параболы x₀ = −b/(2a). Здесь a = 1, b = −6.",
    solution: "f(x) = x² − 6x + 8\nВершина: x₀ = −(−6)/(2·1) = 6/2 = **3** ✅\n\nПроверка: f(3) = 9 − 18 + 8 = −1 (минимум)",
    points: 1,
  },
  // ─── ЧАСТЬ 2 ───────────────────────────────────────────────
  {
    id: 13,
    part: 2,
    topic: "Задание 13 · Тригонометрическое уравнение",
    question: "Решите уравнение:\n2sin²x − sinx − 1 = 0\n\nВведи наименьший положительный корень (в виде числа через π, например: 0.5):",
    options: undefined,
    correct: "0.5",
    type: "input",
    hint: "Сделай замену t = sinx, реши квадратное уравнение 2t² − t − 1 = 0. Найди значения sinx и стандартные формулы корней.",
    solution: "Замена: t = sinx\n2t² − t − 1 = 0\nD = 1 + 8 = 9\nt₁ = (1+3)/4 = 1\nt₂ = (1−3)/4 = −1/2\n\nsinx = 1  →  x = π/2 + 2πn\nsinx = −1/2  →  x = −π/6 + 2πn  или  x = π + π/6 + 2πn\n\nНаименьший положит. корень: x = **π/2** (≈ 1.571)\n\nОтвет вводится как **0.5** (т.е. π/2 = 0.5·π) ✅",
    points: 4,
  },
];

const PART1 = TASKS.filter((t) => t.part === 1);
const PART2 = TASKS.filter((t) => t.part === 2);

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentTaskId, setCurrentTaskId] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [inputValue, setInputValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [solutionTaskId, setSolutionTaskId] = useState<number>(1);

  const currentTask = TASKS.find((t) => t.id === currentTaskId)!;
  const answeredCount = Object.keys(answers).length;
  const correctCount = TASKS.filter((t) => {
    const ans = answers[t.id];
    if (ans === undefined) return false;
    if (t.type === "choice") return (ans as number) === t.correct;
    return String(ans).trim() === String(t.correct).trim();
  }).length;

  const totalPoints = TASKS.reduce((sum, t) => {
    const ans = answers[t.id];
    if (ans === undefined) return sum;
    const isCorrect =
      t.type === "choice"
        ? (ans as number) === t.correct
        : String(ans).trim() === String(t.correct).trim();
    return sum + (isCorrect ? t.points : 0);
  }, 0);
  const maxPoints = TASKS.reduce((s, t) => s + t.points, 0);

  const openTask = (id: number) => {
    setCurrentTaskId(id);
    setShowHint(false);
    setSubmitted(false);
    setInputValue(answers[id] !== undefined ? String(answers[id]) : "");
    setSelectedOption(answers[id] !== undefined && TASKS.find((t) => t.id === id)?.type === "choice" ? (answers[id] as number) : null);
    setScreen("task");
  };

  const submitAnswer = () => {
    if (currentTask.type === "choice") {
      if (selectedOption === null) return;
      setAnswers((prev) => ({ ...prev, [currentTaskId]: selectedOption }));
    } else {
      if (!inputValue.trim()) return;
      setAnswers((prev) => ({ ...prev, [currentTaskId]: inputValue.trim() }));
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
    const allIds = TASKS.map((t) => t.id);
    const idx = allIds.indexOf(currentTaskId);
    if (idx < allIds.length - 1) {
      openTask(allIds[idx + 1]);
    } else {
      setScreen("result");
    }
  };

  const getTaskStatus = (task: Task) => {
    const ans = answers[task.id];
    if (ans === undefined) return "unanswered";
    const isCorrect =
      task.type === "choice"
        ? (ans as number) === task.correct
        : String(ans).trim() === String(task.correct).trim();
    return isCorrect ? "correct" : "wrong";
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] font-golos text-white">
      {/* ── HOME ──────────────────────────────────────────────── */}
      {screen === "home" && (
        <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4 text-xs text-violet-300 uppercase tracking-widest font-semibold">
              <span>📐</span> ЕГЭ · Профильная математика
            </div>
            <h1 className="font-montserrat text-4xl font-black text-white mb-2 leading-tight">
              Тренажёр заданий
            </h1>
            <p className="text-white/50 text-base">
              12 заданий первой части + 1 задание второй части
            </p>
          </div>

          {/* Progress card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex items-center justify-between">
            <div>
              <div className="text-2xl font-montserrat font-black text-white">
                {answeredCount} / {TASKS.length}
              </div>
              <div className="text-white/40 text-sm mt-0.5">заданий выполнено</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-emerald-400">{correctCount}</div>
              <div className="text-white/40 text-sm mt-0.5">правильных</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-montserrat font-black text-violet-400">{totalPoints}/{maxPoints}</div>
              <div className="text-white/40 text-sm mt-0.5">баллов</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / TASKS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Part 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Часть 1</div>
              <div className="flex-1 h-px bg-white/10" />
              <div className="text-xs text-white/30">1 балл за задание</div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {PART1.map((task) => {
                const status = getTaskStatus(task);
                return (
                  <button
                    key={task.id}
                    onClick={() => openTask(task.id)}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] group
                      ${status === "correct" ? "bg-emerald-500/15 border-emerald-500/30" :
                        status === "wrong" ? "bg-rose-500/15 border-rose-500/30" :
                        "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"}`}
                  >
                    <div className="text-[10px] text-white/30 mb-1 font-medium">№{task.id}</div>
                    <div className="text-xs text-white/70 leading-tight line-clamp-2">
                      {task.topic.split(" · ")[1]}
                    </div>
                    {status === "correct" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-white" />
                      </div>
                    )}
                    {status === "wrong" && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                        <Icon name="X" size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Часть 2</div>
              <div className="flex-1 h-px bg-white/10" />
              <div className="text-xs text-white/30">до 4 баллов</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PART2.map((task) => {
                const status = getTaskStatus(task);
                return (
                  <button
                    key={task.id}
                    onClick={() => openTask(task.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]
                      ${status === "correct" ? "bg-emerald-500/15 border-emerald-500/30" :
                        status === "wrong" ? "bg-rose-500/15 border-rose-500/30" :
                        "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"}`}
                  >
                    <div className="text-[10px] text-violet-300/70 mb-1 font-semibold uppercase tracking-wider">{task.topic.split(" · ")[0]}</div>
                    <div className="text-sm text-white font-medium leading-tight">
                      {task.topic.split(" · ")[1]}
                    </div>
                    <div className="text-xs text-white/30 mt-1">Развёрнутый ответ · {task.points} балла</div>
                    {status !== "unanswered" && (
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${status === "correct" ? "bg-emerald-500" : "bg-rose-500"}`}>
                        <Icon name={status === "correct" ? "Check" : "X"} size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start button */}
          {answeredCount === 0 ? (
            <button
              onClick={() => openTask(1)}
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base"
            >
              Начать тренировку →
            </button>
          ) : answeredCount === TASKS.length ? (
            <button
              onClick={() => setScreen("result")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base"
            >
              Смотреть результат →
            </button>
          ) : (
            <button
              onClick={() => {
                const first = TASKS.find((t) => answers[t.id] === undefined);
                if (first) openTask(first.id);
              }}
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base"
            >
              Продолжить ({TASKS.length - answeredCount} осталось) →
            </button>
          )}
        </div>
      )}

      {/* ── TASK ──────────────────────────────────────────────── */}
      {screen === "task" && currentTask && (
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setScreen("home")}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <Icon name="ArrowLeft" size={16} />
              Все задания
            </button>
            <div className="text-xs text-white/30 font-medium">
              {answers[currentTaskId] !== undefined ? "✓ Выполнено" : `Часть ${currentTask.part}`}
            </div>
          </div>

          {/* Task number navigator */}
          <div className="flex gap-1.5 mb-6 flex-wrap">
            {TASKS.map((t) => {
              const st = getTaskStatus(t);
              return (
                <button
                  key={t.id}
                  onClick={() => openTask(t.id)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all
                    ${t.id === currentTaskId
                      ? "bg-violet-500 text-white scale-110"
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
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-5 text-xs text-violet-300 font-semibold">
            📐 {currentTask.topic}
          </div>

          {/* Question */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
            <p className="text-white text-base leading-relaxed whitespace-pre-line font-medium">
              {currentTask.question}
            </p>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-5 animate-fade-in">
              <div className="text-xs text-amber-300/70 font-semibold uppercase tracking-wider mb-2">💡 Подсказка</div>
              <p className="text-amber-100 text-sm leading-relaxed">{currentTask.hint}</p>
            </div>
          )}

          {/* Options (Part 1) */}
          {currentTask.type === "choice" && currentTask.options && (
            <div className="space-y-2.5 mb-5">
              {currentTask.options.map((opt, idx) => {
                let state = "default";
                if (submitted) {
                  if (idx === currentTask.correct) state = "correct";
                  else if (idx === selectedOption) state = "wrong";
                } else if (idx === selectedOption) {
                  state = "selected";
                }
                return (
                  <button
                    key={idx}
                    disabled={submitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                      ${state === "correct" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200" :
                        state === "wrong" ? "bg-rose-500/20 border-rose-500/50 text-rose-200" :
                        state === "selected" ? "bg-violet-500/20 border-violet-500/50 text-white" :
                        "bg-white/5 border-white/10 text-white/80 hover:bg-white/8 hover:border-white/20"
                      } ${submitted ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${state === "correct" ? "bg-emerald-500 text-white" :
                        state === "wrong" ? "bg-rose-500 text-white" :
                        state === "selected" ? "bg-violet-500 text-white" :
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

          {/* Input (Part 2) */}
          {currentTask.type === "input" && (
            <div className="mb-5">
              <div className="text-xs text-white/40 mb-2 font-medium">Ответ (в долях π, например: 0.5 = π/2)</div>
              <div className="flex gap-3">
                <input
                  disabled={submitted}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Введи ответ..."
                  className={`flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 text-base outline-none focus:ring-2 transition-all
                    ${submitted
                      ? isCurrentCorrect()
                        ? "border-emerald-500/50 ring-emerald-500/20"
                        : "border-rose-500/50 ring-rose-500/20"
                      : "border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20"
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
                  Правильный ответ: <span className="text-emerald-300 font-bold">{String(currentTask.correct)}·π</span>
                </div>
              )}
            </div>
          )}

          {/* Feedback after submit */}
          {submitted && (
            <div className={`rounded-xl p-4 mb-5 animate-fade-in border ${isCurrentCorrect() ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{isCurrentCorrect() ? "✅" : "❌"}</span>
                <span className={`text-sm font-bold ${isCurrentCorrect() ? "text-emerald-300" : "text-rose-300"}`}>
                  {isCurrentCorrect() ? "Правильно!" : "Неверно"}
                </span>
              </div>
              <button
                onClick={() => { setSolutionTaskId(currentTaskId); setScreen("solution"); }}
                className="text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors mt-1"
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
                className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
              >
                Проверить →
              </button>
            ) : (
              <button
                onClick={nextTask}
                className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
              >
                {currentTaskId === TASKS[TASKS.length - 1].id ? "Результаты →" : "Следующее →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SOLUTION ──────────────────────────────────────────── */}
      {screen === "solution" && (
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          <button
            onClick={() => setScreen("task")}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
          >
            <Icon name="ArrowLeft" size={16} />
            Назад к заданию
          </button>

          {(() => {
            const st = TASKS.find((t) => t.id === solutionTaskId)!;
            return (
              <>
                <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-5 text-xs text-violet-300 font-semibold">
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
              </>
            );
          })()}
        </div>
      )}

      {/* ── RESULT ────────────────────────────────────────────── */}
      {screen === "result" && (
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          <button
            onClick={() => setScreen("home")}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm mb-8"
          >
            <Icon name="ArrowLeft" size={16} />
            Все задания
          </button>

          <div className="text-center mb-10">
            <div className="text-6xl mb-4">
              {correctCount >= 10 ? "🏆" : correctCount >= 7 ? "🎯" : "📚"}
            </div>
            <h2 className="font-montserrat text-3xl font-black text-white mb-2">
              {correctCount >= 10 ? "Отлично!" : correctCount >= 7 ? "Хорошо!" : "Ещё поработать"}
            </h2>
            <p className="text-white/50 text-base">Тренировочный вариант завершён</p>
          </div>

          {/* Score */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-montserrat font-black text-violet-300">{totalPoints}</div>
              <div className="text-xs text-white/40 mt-1">баллов из {maxPoints}</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-montserrat font-black text-emerald-300">{correctCount}</div>
              <div className="text-xs text-white/40 mt-1">правильных</div>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">
              <div className="text-3xl font-montserrat font-black text-rose-300">{TASKS.length - correctCount}</div>
              <div className="text-xs text-white/40 mt-1">с ошибкой</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-8">
            {TASKS.map((task) => {
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
                      "bg-white/10 text-white/50"
                    }`}>
                    {task.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white/70 truncate">{task.topic}</div>
                    {ans !== undefined && task.type === "choice" && task.options && (
                      <div className="text-xs text-white/30 mt-0.5">
                        Ваш ответ: {task.options[ans as number]}
                        {status === "wrong" && ` → правильно: ${task.options[task.correct as number]}`}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/30">разбор →</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setAnswers({});
              setScreen("home");
            }}
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all rounded-2xl font-montserrat font-bold text-white text-base"
          >
            Начать заново
          </button>
        </div>
      )}
    </div>
  );
}
