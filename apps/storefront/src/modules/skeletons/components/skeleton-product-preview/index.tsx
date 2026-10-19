const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-card bg-ink" />
      <div className="mt-3 flex flex-col gap-y-1.5 px-0.5">
        <div className="h-2.5 w-1/3 rounded-control bg-ink" />
        <div className="h-3.5 w-3/4 rounded-control bg-ink" />
        <div className="h-3.5 w-1/4 rounded-control bg-ink" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
