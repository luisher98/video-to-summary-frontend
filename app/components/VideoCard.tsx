import Image from "next/image";

export default function VideoCard({ ...props }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="group flex h-full rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7]">
          <div className="flex aspect-video h-52 flex-col items-center justify-center rounded-t-xl bg-blue-600">
            {/* <Image src={thumbnail.medium.url} alt={title} width={thumbnail.medium.width} height={thumbnail.medium.height} className="rounded-t-xl" /> */}
          </div>
          <div className="p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 dark:hover:text-white">
              {props.title || 'No title'}
            </h3>
            <span className="mt-1 block text-xs font-semibold uppercase text-blue-600 dark:text-blue-500">
              by {props.channel || 'unknown' }
            </span>
            <p className="mt-3 text-gray-500">
              {/* {description || 'No description'} */}
              No description
            </p>
          </div>
          
        </div>
      
    </div>
  );
}
