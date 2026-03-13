import { LoginForm } from "@/components/forms/login-form"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-background">
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[150vmax] h-[150vmax] absolute opacity-70"
          style={{ animation: 'spin 40s linear infinite' }}
        >
          <div className="absolute top-[0%] left-[0%] w-[38%] h-[38%] rounded-full bg-primary/40 blur-[200px]" />
          <div className="absolute top-[0%] right-[0%] w-[38%] h-[38%] rounded-full bg-pink-500/30 blur-[200px]" />
          <div className="absolute bottom-[0%] left-[0%] w-[38%] h-[38%] rounded-full bg-blue-500/30 blur-[200px]" />
          <div className="absolute bottom-[0%] right-[0%] w-[38%] h-[38%] rounded-full bg-purple-500/30 blur-[200px]" />
        </div>
      </div>

      <div className="w-full max-w-sm md:max-w-4xl z-10">
        <LoginForm />
      </div>
    </div>
  )
}
