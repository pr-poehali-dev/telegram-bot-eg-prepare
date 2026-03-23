import { useState } from "react";
import Icon from "@/components/ui/icon";

type Subject = "math" | "russian" | "cs";
type Screen = "home" | "task" | "wrong" | "material" | "recheck" | "success";

interface Task {
  id: number;
  subject: Subject;
  question: string;
  options: string[];
  correct: number;
  hint: string;
  material: string;
  materialTitle: string;
}

const SUBJECTS: Record<Subject, { label: string; emoji: string; color: string; bg: string; accent: string }> = {
  math: {
    label: "Математика",
    emoji: "📐",
    color: "text-violet-300",
    bg: "bg-violet-500/20",
    accent: "bg-violet-500",
  },
  russian: {
    label: "Русский язык",
    emoji: "📝",
    color: "text-emerald-300",
    bg: "bg-emerald-500/20",
    accent: "bg-emerald-500",
  },
  cs: {
    label: "Информатика",
    emoji: "💻",
    color: "text-sky-300",
    bg: "bg-sky-500/20",
    accent: "bg-sky-500",
  },
};

const TASKS: Task[] = [
  {
    id: 1,
    subject: "math",
    question:
      "Найдите значение выражения: log₂(8) + log₂(4)",
    options: ["3", "5", "6", "7"],
    correct: 1,
    hint: "Вспомни: logₐ(aⁿ) = n. Попробуй представить 8 и 4 как степени двойки.",
    materialTitle: "Логарифмы: основные свойства",
    material:
      "**Свойство суммы логарифмов:**\nlogₐ(m) + logₐ(n) = logₐ(m·n)\n\n**Пример:**\nlog₂(8) = log₂(2³) = 3\nlog₂(4) = log₂(2²) = 2\n\nlog₂(8) + log₂(4) = 3 + 2 = **5** ✅\n\n**Запомни:** Логарифм числа по основанию a — это показатель степени, в которую нужно возвести a, чтобы получить это число.",
  },
  {
    id: 2,
    subject: "russian",
    question:
      "Укажите слово, в котором пишется НН:",
    options: ["Стекля(н/нн)ый", "Песча(н/нн)ый", "Ветре(н/нн)ый", "Дли(н/нн)ый"],
    correct: 3,
    hint: "Обрати внимание: прилагательные с суффиксом -ИН-, -АН-, -ЯН- пишутся с одной Н. Исключения: оловянный, деревянный, стеклянный.",
    materialTitle: "Н и НН в прилагательных",
    material:
      "**Одна Н пишется:**\n• суффиксы -АН-, -ЯН-, -ИН-: кожаный, серебряный, куриный\n• Исключения: деревянный, оловянный, стеклянный\n\n**Две НН пишется:**\n• суффиксы -ОНН-, -ЕНН-: лимонный, клюквенный\n• основа на Н + суффикс Н: длинный (длин-а + н)\n\n**Длинный** = длин(а) + н → НН ✅",
  },
  {
    id: 3,
    subject: "cs",
    question:
      "Сколько бит содержится в числе 255, записанном в двоичной системе счисления?",
    options: ["6 бит", "7 бит", "8 бит", "9 бит"],
    correct: 2,
    hint: "255 в двоичной системе — это максимальное число, которое можно записать 8 битами. Попробуй перевести 255 в двоичную.",
    materialTitle: "Двоичная система счисления",
    material:
      "**Перевод 255 в двоичную:**\n255 = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1\n255 = 2⁷ + 2⁶ + 2⁵ + 2⁴ + 2³ + 2² + 2¹ + 2⁰\n255₁₀ = 11111111₂\n\n**8 единиц = 8 бит** ✅\n\n**Запомни:** 2ⁿ - 1 всегда даёт число из n единиц в двоичной записи. Именно поэтому 255 — максимальное значение для байта (8 бит).",
  },
];

const PROGRESS = { math: 7, russian: 5, cs: 3, streak: 12 };

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeSubject, setActiveSubject] = useState<Subject>("math");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [recheckSelected, setRecheckSelected] = useState<number | null>(null);

  const currentTask = TASKS.find((t) => t.subject === activeSubject)!;
  const subjectInfo = SUBJECTS[activeSubject];

  const handleSubjectStart = (subject: Subject) => {
    setActiveSubject(subject);
    setSelectedOption(null);
    setShowHint(false);
    setRecheckSelected(null);
    setScreen("task");
  };

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    setTimeout(() => {
      if (idx === currentTask.correct) {
        setScreen("success");
      } else {
        setScreen("wrong");
      }
    }, 400);
  };

  const handleRecheckAnswer = (idx: number) => {
    setRecheckSelected(idx);
    setTimeout(() => {
      if (idx === currentTask.correct) {
        setScreen("success");
      } else {
        setScreen("wrong");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] font-golos text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* HOME */}
        {screen === "home" && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-5 text-sm text-white/60">
                <span>🔥</span>
                <span>Серия: {PROGRESS.streak} дней подряд</span>
              </div>
              <h1 className="font-montserrat text-3xl font-black text-white mb-2 leading-tight">
                ЕГЭ-Бот 🚀
              </h1>
              <p className="text-white/50 text-sm">
                Ежедневные задания для уверенной сдачи
              </p>
            </div>

            {/* Progress bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Прогресс сегодня</span>
                <span className="text-xs text-white/60">2 / 3 предмета</span>
              </div>
              <div className="flex gap-2">
                {(["math", "russian", "cs"] as Subject[]).map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full ${s === "cs" ? "bg-white/10" : SUBJECTS[s].accent}`}
                  />
                ))}
              </div>
            </div>

            {/* Subject cards */}
            <div className="space-y-3 mb-6">
              {(["math", "russian", "cs"] as Subject[]).map((subject) => {
                const info = SUBJECTS[subject];
                const done = subject !== "cs";
                return (
                  <button
                    key={subject}
                    onClick={() => handleSubjectStart(subject)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left
                      ${done
                        ? "bg-white/5 border-white/10 opacity-60"
                        : "bg-white/8 border-white/20 hover:bg-white/12"
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {info.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm">{info.label}</span>
                        {done && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                            ✓ Выполнено
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full">
                          <div
                            className={`h-full rounded-full ${info.accent}`}
                            style={{ width: done ? "100%" : "40%" }}
                          />
                        </div>
                        <span className="text-xs text-white/30">
                          {subject === "math" ? PROGRESS.math : subject === "russian" ? PROGRESS.russian : PROGRESS.cs} зад.
                        </span>
                      </div>
                    </div>
                    <Icon
                      name={done ? "CheckCircle" : "ChevronRight"}
                      size={20}
                      className={done ? "text-emerald-400" : "text-white/30"}
                    />
                  </button>
                );
              })}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Всего решено", value: "47", icon: "✅" },
                { label: "Правильных", value: "83%", icon: "🎯" },
                { label: "Дней активен", value: "21", icon: "📅" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className="font-montserrat font-bold text-white text-lg">{stat.value}</div>
                  <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASK */}
        {screen === "task" && (
          <div className="animate-fade-in">
            <button
              onClick={() => setScreen("home")}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors mb-6 text-sm"
            >
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>

            {/* Subject badge */}
            <div className={`inline-flex items-center gap-2 ${subjectInfo.bg} rounded-full px-3 py-1.5 mb-5`}>
              <span>{subjectInfo.emoji}</span>
              <span className={`text-sm font-semibold ${subjectInfo.color}`}>{subjectInfo.label}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
              <div className="text-xs text-white/30 uppercase tracking-wider mb-3 font-medium">Задание дня</div>
              <p className="text-white font-medium text-base leading-relaxed">{currentTask.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-5">
              {currentTask.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                    ${selectedOption === idx
                      ? idx === currentTask.correct
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                        : "bg-red-500/20 border-red-500/60 text-red-300"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                    }`}
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              ))}
            </div>

            {/* Hint */}
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="w-full flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white/70 text-sm transition-colors border border-dashed border-white/10 rounded-xl hover:border-white/20"
              >
                <span>💡</span> Показать подсказку
              </button>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span>💡</span>
                  <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Подсказка</span>
                </div>
                <p className="text-amber-100/80 text-sm leading-relaxed">{currentTask.hint}</p>
              </div>
            )}
          </div>
        )}

        {/* WRONG */}
        {screen === "wrong" && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="font-montserrat text-2xl font-black text-white mb-2">Не совсем верно</h2>
            <p className="text-white/50 text-sm mb-8">Не переживай — ошибки помогают учиться!</p>

            <div className="flex gap-3">
              <button
                onClick={() => setScreen("material")}
                className="flex-1 bg-violet-500 hover:bg-violet-400 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                📚 Изучить тему
              </button>
              <button
                onClick={() => { setRecheckSelected(null); setScreen("recheck"); }}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] border border-white/10"
              >
                🔄 Попробовать снова
              </button>
            </div>
          </div>
        )}

        {/* MATERIAL */}
        {screen === "material" && (
          <div className="animate-fade-in">
            <button
              onClick={() => setScreen("wrong")}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors mb-6 text-sm"
            >
              <Icon name="ArrowLeft" size={16} /> Назад
            </button>

            <div className={`inline-flex items-center gap-2 ${subjectInfo.bg} rounded-full px-3 py-1.5 mb-5`}>
              <span>📚</span>
              <span className={`text-sm font-semibold ${subjectInfo.color}`}>Материал</span>
            </div>

            <h2 className="font-montserrat text-xl font-black text-white mb-4">{currentTask.materialTitle}</h2>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              {currentTask.material.split("\n").map((line, i) => {
                const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                return (
                  <p
                    key={i}
                    className={`text-sm leading-relaxed ${line.startsWith("**") && line.endsWith("**") ? "text-white font-semibold mt-3 mb-1 first:mt-0" : "text-white/70"} ${line === "" ? "mb-2" : "mb-1"}`}
                    dangerouslySetInnerHTML={{ __html: bold }}
                  />
                );
              })}
            </div>

            <button
              onClick={() => { setRecheckSelected(null); setScreen("recheck"); }}
              className="w-full bg-violet-500 hover:bg-violet-400 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ✅ Попробовать снова
            </button>
          </div>
        )}

        {/* RECHECK */}
        {screen === "recheck" && (
          <div className="animate-fade-in">
            <div className={`inline-flex items-center gap-2 ${subjectInfo.bg} rounded-full px-3 py-1.5 mb-5`}>
              <span>🔄</span>
              <span className={`text-sm font-semibold ${subjectInfo.color}`}>Повторная попытка</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
              <p className="text-white font-medium text-base leading-relaxed">{currentTask.question}</p>
            </div>

            <div className="space-y-3 mb-5">
              {currentTask.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecheckAnswer(idx)}
                  disabled={recheckSelected !== null}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                    ${recheckSelected === idx
                      ? idx === currentTask.correct
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                        : "bg-red-500/20 border-red-500/60 text-red-300"
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                    }`}
                >
                  <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium">{opt}</span>
                </button>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Подсказка</span>
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed">{currentTask.hint}</p>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {screen === "success" && (
          <div className="animate-fade-in text-center">
            <div className="relative inline-block mb-6">
              <div className="text-7xl animate-bounce">🎉</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                ⭐
              </div>
            </div>

            <h2 className="font-montserrat text-3xl font-black text-white mb-2">Отлично!</h2>
            <p className="text-white/50 text-sm mb-2">Задание выполнено верно</p>

            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-8">
              <span className="text-emerald-300 text-sm font-semibold">+10 очков</span>
              <span className="text-emerald-400">🔥</span>
              <span className="text-emerald-300 text-sm font-semibold">Серия продолжается!</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs text-white/30 uppercase tracking-wider mb-3 font-medium">Правильный ответ</div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-300">
                  {String.fromCharCode(65 + currentTask.correct)}
                </span>
                <span className="text-white font-medium text-sm">{currentTask.options[currentTask.correct]}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const subjects: Subject[] = ["math", "russian", "cs"];
                  const next = subjects[(subjects.indexOf(activeSubject) + 1) % subjects.length];
                  handleSubjectStart(next);
                }}
                className="w-full bg-violet-500 hover:bg-violet-400 text-white font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Следующий предмет →
              </button>
              <button
                onClick={() => setScreen("home")}
                className="w-full bg-white/5 hover:bg-white/10 text-white/70 font-semibold py-3 rounded-xl transition-all border border-white/10"
              >
                На главную
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
