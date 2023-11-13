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
                {summary}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-6 text-center">
          <div className="inline-block rounded-full bg-white px-4 py-3 shadow-md dark:bg-gray-800">
            <div className="flex items-center gap-x-1.5">
              <div className="hs-tooltip inline-block">
                {/* <button
                  formAction="/#"
                  type="button"
                  className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z" />
                  </svg>
                  back to top
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
