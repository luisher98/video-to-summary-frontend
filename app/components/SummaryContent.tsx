export default function SummaryContent({ info, summary }: SummaryContentProps) {
  if (!info || !summary) return null;
  const { title } = info;
  const { content } = summary;
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="max-w-2xl">
          <div className="space-y-5 md:space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold dark:text-white md:text-3xl">
                {title || "No title"}
              </h2>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {content || "No summary"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
