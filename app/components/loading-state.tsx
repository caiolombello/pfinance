import { Spinner } from "./ui/spinner"

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size={32} />
    </div>
  )
} 