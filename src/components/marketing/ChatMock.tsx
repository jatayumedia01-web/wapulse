import { Check, CheckCheck, Sparkles, Megaphone, Users } from "lucide-react";

export default function ChatMock() {
  return (
    <div className="relative mx-auto w-full max-w-md anim-float">
      {/* Glow */}
      <div
        className="absolute -inset-6 -z-10 rounded-[40px] opacity-60"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)" }}
      />

      {/* Main inbox card */}
      <div
        className="overflow-hidden rounded-[28px] shadow-2xl"
        style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(255,255,255,0.9)" }}
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            RK
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold text-slate-800">Ravi Kumar</p>
            <p className="text-[11px] text-emerald-600 font-medium">Online · Team Inbox</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">AI Active</span>
        </div>

        <div className="chat-bg space-y-3 px-5 py-6">
          <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[13px] text-slate-700 shadow-sm">
            Hi! Do you have the Premium Hoodie in stock? 👀
          </div>
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] text-white shadow-sm" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            Yes! In stock in all sizes 🎉 Want me to send the payment link?
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-100">
              <span>09:41</span>
              <CheckCheck size={12} />
            </div>
          </div>
          <div className="flex max-w-[75%] items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[11.5px] font-medium text-indigo-500 shadow-sm">
            <Sparkles size={12} /> AI Copilot suggested this reply
          </div>
          <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[13px] text-slate-700 shadow-sm">
            Yes please! 🙌
            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
              <span>09:42</span>
              <Check size={12} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
          <div className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-[12px] text-slate-400">Type a message…</div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>→</div>
        </div>
      </div>

      {/* Floating campaign card */}
      <div
        className="absolute -left-8 -top-6 hidden w-44 rounded-2xl p-3.5 shadow-xl sm:block anim-float stagger-2"
        style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(255,255,255,0.9)" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}>
            <Megaphone size={13} />
          </span>
          <p className="text-[11px] font-bold text-slate-700">Festive Sale</p>
        </div>
        <p className="mt-2 text-[10px] text-slate-400">Sent to 4,820 contacts</p>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[82%] rounded-full" style={{ background: "linear-gradient(90deg,#f59e0b,#ea580c)" }} />
        </div>
        <p className="mt-1 text-[10px] font-semibold text-amber-600">82% delivered</p>
      </div>

      {/* Floating stats card */}
      <div
        className="absolute -bottom-7 -right-4 w-40 rounded-2xl p-3.5 shadow-xl anim-float stagger-4"
        style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(255,255,255,0.9)" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Users size={13} />
          </span>
          <p className="text-[11px] font-bold text-slate-700">This week</p>
        </div>
        <p className="mt-2 text-[20px] font-black text-slate-800">+1,204</p>
        <p className="text-[10px] text-emerald-600 font-semibold">new conversations</p>
      </div>
    </div>
  );
}
