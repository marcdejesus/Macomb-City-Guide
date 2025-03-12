export function LoadingSpinner({ size = "medium", className = "" }) {
  const sizeClasses = {
    small: "h-5 w-5 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4"
  };
  
  return (
    <div className="flex justify-center items-center w-full">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-primary border-primary/30 animate-spin ${className}`}
      />
    </div>
  );
}