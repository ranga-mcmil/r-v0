export default function AddReferrerLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <div className="h-7 w-7 rounded-md bg-muted" />
          <div>
            <div className="h-8 w-48 rounded-md bg-muted" />
            <div className="mt-1 h-4 w-64 rounded-md bg-muted" />
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-32 rounded-md bg-muted" />
              <div className="h-4 w-48 rounded-md bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-10 w-full rounded-md bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-10 w-full rounded-md bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-10 w-full rounded-md bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-10 w-full rounded-md bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-10 w-full rounded-md bg-muted" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-16 rounded-md bg-muted" />
                <div className="h-20 w-full rounded-md bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-16 rounded-md bg-muted" />
                <div className="h-20 w-full rounded-md bg-muted" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-6 pt-0">
            <div className="h-10 w-24 rounded-md bg-muted" />
            <div className="h-10 w-24 rounded-md bg-muted" />
          </div>
        </div>
      </main>
    </div>
  )
}
