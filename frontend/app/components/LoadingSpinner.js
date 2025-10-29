export default function LoadingSpinner({ message = "Creating magic..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-story-purple/30 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-story-purple rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-gray-600 font-story">{message}</p>
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-story-pink rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}