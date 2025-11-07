export default function BlogCardSkeleton() {
  return (
    <div className="relative w-96 h-60 2xl:w-116 2xl:h-72 3xl:w-146 3xl:h-84 rounded-2xl bg-gray-400 dark:bg-zinc-800 animate-pulse">
      <div className="h-full w-full flex flex-col justify-end rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-t from-black/30 to-transparent p-5 space-y-3">
          <div className="h-7 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-1/3 bg-gray-300 dark:bg-zinc-700 rounded" />
          <div className="h-3 w-full bg-gray-300 dark:bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}
