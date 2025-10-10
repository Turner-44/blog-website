export default function BlogCardSkeleton() {
  return (
    <div
      className="w-90 mx-auto sm:w-96 h-80 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-2xl"
      aria-hidden="true"
    >
      <div className="h-full w-full flex flex-col justify-end rounded-2xl overflow-hidden">
        <div className="h-2/5 bg-gradient-to-t from-black/30 to-transparent p-5 space-y-3">
          <div className="h-5 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-300 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 w-full bg-gray-300 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 w-5/6 bg-gray-300 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
