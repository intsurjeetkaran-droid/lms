import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', message = 'Loading...' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className={`${sizes[size]} text-sky-500 dark:text-sky-400 animate-spin mb-4`} />
      <p className="text-slate-600 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
