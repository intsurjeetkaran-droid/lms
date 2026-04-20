import { PackageOpen, AlertCircle, Inbox, FileQuestion } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = "No data available", 
  message = "There's nothing to display at the moment.",
  actionLabel,
  onAction,
  variant = "default" // default, error, info
}) => {
  const iconColors = {
    default: "text-sky-500 dark:text-sky-400",
    error: "text-red-500 dark:text-red-400",
    info: "text-blue-500 dark:text-blue-400"
  };

  const bgColors = {
    default: "bg-sky-50 dark:bg-sky-900/20",
    error: "bg-red-50 dark:bg-red-900/20",
    info: "bg-blue-50 dark:bg-blue-900/20"
  };

  return (
    <div className={`${bgColors[variant]} border-2 border-dashed ${
      variant === 'error' ? 'border-red-200 dark:border-red-800' :
      variant === 'info' ? 'border-blue-200 dark:border-blue-800' :
      'border-sky-200 dark:border-sky-800'
    } rounded-2xl p-12 text-center`}>
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className={`${iconColors[variant]} mb-4`}>
          <Icon size={64} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
