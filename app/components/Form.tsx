export default function Form({
  url,
  setUrl,
  handleSubmit,
  isLoading,
  numberOfWords,
  setNumberOfWords,
}) {
  return (
    <>
      <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
        <form onSubmit={handleSubmit}>
          <div className="relative z-10 flex space-x-3 rounded-lg border bg-white p-3 shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/[.2]">
            <div className="flex-[1_0_0%]">
              <label
                htmlFor="hs-search-article-1"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                <span className="sr-only">
                  https://www.youtube.com/watch?v=aXvDEmo6uS4
                </span>
              </label>
              <input
                type="text"
                name="hs-search-article-1"
                id="hs-search-article-1"
                className="block w-full rounded-md border-transparent p-3 dark:bg-gray-800 dark:text-gray-400"
                placeholder=""
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex-[0_0_auto]">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 p-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                href="#"
                type="submit"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
            </div>
          </div>
          <label
            htmlFor="minmax-Words"
            className="mt-4 block text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            Words: {numberOfWords}
          </label>
          <input
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            id="minmax-Words"
            type="range"
            min="100"
            max="500"
            step="100"
            value={numberOfWords}
            onChange={(e) => setNumberOfWords(e.target.value)}
            disabled={isLoading}
          />
        </form>
      </div>
    </>
  );
}
