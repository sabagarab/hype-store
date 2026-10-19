const SkeletonCardDetails = () => {
  return (
    <div className="flex flex-col gap-1 my-4 transition-all duration-fast ease-premium">
      <div className="mb-1 h-4 w-1/4 animate-pulse rounded-control bg-ink"></div>
      <div className="pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ink border rounded-card appearance-none border-hairline animate-pulse" />
    </div>
  )
}

export default SkeletonCardDetails
