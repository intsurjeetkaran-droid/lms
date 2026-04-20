import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  title = "Something went wrong", 
  message = "An error occurred while processing your request.",
  onRetry,
  variant = "error" // error, warning
}) => {
  const Icon = variant === 'warning' ? AlertCircle : XCircle;
  
  const colors = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500 dark:text-red-400',
      text: 'text-red-900 dark:text-red-100',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500 dark:text-yellow-400',
      text: 'text-yellow-900 dark:text-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    }
  };

  const style = colors[variant];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-6`}>
      <div className="flex items-start gap-4">
        <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} size={24} />
        <div className="flex-1">
          <h3 className={`font-semibold ${style.text} mb-1`}>{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-4 ${style.button} text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm`}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
