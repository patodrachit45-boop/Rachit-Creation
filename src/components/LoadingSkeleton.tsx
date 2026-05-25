export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] min-h-[540px] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-12 w-64 bg-gray-300 rounded" />
        <div className="h-4 w-48 bg-gray-300 rounded" />
        <div className="h-12 w-40 bg-gray-300 rounded-full mt-4" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FCEEE9]/30">
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 space-y-3">
          <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
