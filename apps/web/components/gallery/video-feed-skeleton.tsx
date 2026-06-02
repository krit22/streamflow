export function VideoFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-gutter gap-y-16 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="mb-6 aspect-video rounded-xl bg-surface-container-high" />
          <div className="mb-2 h-6 w-3/4 rounded bg-surface-container-high" />
          <div className="mb-1 h-4 w-1/3 rounded bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}
