export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-md py-lg">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
