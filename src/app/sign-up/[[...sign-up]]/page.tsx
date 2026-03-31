import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Create an account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join the golf charity community
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-xl border border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm",
              headerTitle: "text-2xl font-bold text-slate-900",
              headerSubtitle: "text-slate-600",
              formButtonPrimary:
                "bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-md",
              footerActionLink: "text-emerald-600 hover:text-emerald-700",
            },
          }}
          signInUrl="/sign-in"
          
        />
      </div>
    </div>
  );
}