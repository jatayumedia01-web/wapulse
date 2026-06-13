import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4ff]">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        {/* Decorative background blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{
            position: "absolute", top: "-120px", right: "-80px",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-100px", left: "20%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: "40%", right: "15%",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }} />
        </div>
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
