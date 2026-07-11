export default function Loading() {
  return (
    <div className="container-tight flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
          <div className="border-primary absolute inset-1 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}
