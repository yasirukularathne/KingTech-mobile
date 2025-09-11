export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <span>Loading authentication...</span>
      </div>
    </div>
  );
}
