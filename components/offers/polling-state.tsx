"use client";

import { useEffect, useState } from "react";
import { PollingLoader } from "@/components/offers/polling-loader";

export const PollingState = ({ message }: { message?: string }) => {
  const defaultMessage = "Searching for best offers";
  const hasCustomMessage = Boolean(message?.trim());

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (hasCustomMessage) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasCustomMessage]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="px-4 py-12 text-center">
      <PollingLoader className="mb-12" showSearchIcon={!hasCustomMessage} />
      <p className="mb-4"></p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {message || defaultMessage}
      </h2>

      
        <div className="text-gray-600 mb-6 max-w-sm mx-auto">
          <div>
            {!hasCustomMessage && (
              <p className="mb-2">
                We are checking with our lender partners to find the best loan
                offers for you.
              </p>
            )}

          {!hasCustomMessage&&(<p className="font-semibold text-blue-600">
            Time remaining: {formattedTime}
          </p>)}
          </div>

          <p className="text-sm mt-2">
            Please do not refresh or navigate away from the page.
          </p>
        </div>
      

      <div className="flex justify-center gap-1">
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
};