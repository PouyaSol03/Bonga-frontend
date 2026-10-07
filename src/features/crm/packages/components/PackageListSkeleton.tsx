export function PackageListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="h-[405px] animate-pulse rounded-2xl border border-[#e4e7ed] bg-[#fafbfc] p-5"
          key={index}
        >
          <div className="h-5 w-24 rounded bg-[#e9edf3]" />
          <div className="mt-5 h-6 w-2/3 rounded bg-[#e9edf3]" />
          <div className="mt-8 h-12 w-1/2 rounded bg-[#eef1f5]" />
          <div className="mt-6 h-40 rounded-xl bg-[#eaf5ef]" />
        </div>
      ))}
    </>
  );
}
