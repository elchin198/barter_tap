
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "inline" | "card" | "full";
}

export function ErrorMessage({
  title = "Xəta baş verdi",
  message = "Məlumatları yükləyərkən problem yarandı. Zəhmət olmasa bir daha cəhd edin.",
  onRetry,
  className,
  variant = "card",
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center text-red-600 text-sm gap-1.5 mt-1", className)}>
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="text-primary hover:text-primary/80 font-medium ml-1 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Yenilə</span>
          </button>
        )}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("h-[70vh] flex flex-col items-center justify-center text-center px-4", className)}>
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Yenidən cəhd et</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4", className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-100"
                onClick={onRetry}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Yenidən cəhd edin
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
