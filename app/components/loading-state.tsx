import { Spinner } from "@/components/ui/spinner"

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spinner size={32} />
    </div>
  )
} 