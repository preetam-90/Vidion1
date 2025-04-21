import { ReportDialog } from "./report-dialog"

export default function History() {
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  const handleReport = (reason: string) => {
    if (selectedVideoId) {
      const reportedVideos = JSON.parse(localStorage.getItem("reportedVideos") || "[]") as string[]
      reportedVideos.push(selectedVideoId)
      localStorage.setItem("reportedVideos", JSON.stringify(reportedVideos))
      
      toast({
        description: "Thanks for reporting",
        className: "bg-background border absolute bottom-4 left-4 rounded-lg",
        duration: 3000,
      })
    }
    setIsReportOpen(false)
  }

  return (
    <>
      {/* ... existing JSX ... */}
      {isReportOpen && (
        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSubmit={handleReport}
        />
      )}
    </>
  )
} 