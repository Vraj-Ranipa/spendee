import { CheckCheckIcon, XCircle } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AlertSoftSuccessDemo = ({
  title = "File uploaded successfully",
  description = "Your document has been saved and is now available in your files.",
  variant = "success",
}: {
  title?: string;
  description?: string;
  variant?: "success" | "error";
}) => {
  const isSuccess = variant === "success";

  return (
    <Alert 
      className={`border-none ${
        isSuccess 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }`}
    >
      {isSuccess ? <CheckCheckIcon /> : <XCircle className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className={isSuccess ? "text-green-800/90 dark:text-green-300/90" : "text-red-800/90 dark:text-red-300/90"}>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AlertSoftSuccessDemo;
