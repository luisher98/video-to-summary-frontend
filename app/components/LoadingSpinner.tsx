export default function LoadingSpinner({ message }: { message: string }) {
  return (
    <>
      <div className="flex h-[20vh] items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600 dark:text-blue-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="p-4 text-gray-600 dark:text-gray-300">
            Loading...
            <br />
            {message}
          </p>
        </div>
      </div>
    </>
  );
}
