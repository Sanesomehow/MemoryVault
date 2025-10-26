"use client";

import React from "react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { X, AlertCircle, RotateCcw } from "lucide-react";

interface ErrorAlertProps {
  title: string;
  message: string;
  retry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ 
  title, 
  message, 
  retry, 
  onDismiss, 
  className = "" 
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={`border-red-500 bg-red-50 ${className}`}>
      <AlertCircle className="h-4 w-4 text-red-600" />
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <AlertTitle className="text-red-800">{title}</AlertTitle>
          <AlertDescription className="text-red-700 mt-1">
            {message}
          </AlertDescription>
          {retry && (
            <button
              onClick={retry}
              className="mt-3 inline-flex items-center space-x-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors ml-4"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
}

export default ErrorAlert;