export default function SummaryContent({ title, summary }) {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="max-w-2xl">
          <div className="space-y-5 md:space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold dark:text-white md:text-3xl">
                {title}
              </h2>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {summary.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
