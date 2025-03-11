export default function NotFound() {
  return (
    <div className="flex items-center min-h-[90vh] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tighter animate-bounce">
            404
          </h1>
          <h2 className="text-3xl">Page Not Found</h2>
          <p className="text-muted-foreground px-10">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
      </div>
    </div>
  );
}
