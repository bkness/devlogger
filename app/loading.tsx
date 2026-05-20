export default function Loading() {
  return (
    <main className="max-w-10xl mx-auto p-8">
      {/* h1 placeholder */}
      <div className="skeleton h-9 w-48 mb-8 rounded" />

      {/* Form skeleton */}
      <div className="form-wrapper flex flex-col lg:flex-row gap-4 mb-8">
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="skeleton h-12 w-full rounded" />
          <div className="skeleton h-[230px] w-full rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-[230px] w-full rounded" />
        </div>
        <div className="skeleton w-full lg:w-2/3 rounded" style={{ minHeight: "400px" }} />
      </div>

      {/* Card grid skeleton */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-8 items-start">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="skeleton border border-[rgba(0,229,255,0.08)] rounded p-4 flex flex-col gap-3" style={{ height: "170px" }}>
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="mt-auto flex justify-between items-end">
              <div className="skeleton h-4 w-16 rounded" />
              <div className="skeleton h-4 w-20 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
