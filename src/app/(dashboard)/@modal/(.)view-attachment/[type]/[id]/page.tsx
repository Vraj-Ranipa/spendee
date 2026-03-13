import { prisma } from "@/lib/prisma";
import { AttachmentViewer } from "@/components/shared/attachment-viewer";
import { Modal } from "@/components/shared/modal";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import Link from "next/link";

// Reuse the fetch logic (or extraction to lib if shared often, but fine here for simplicity)
async function getAttachmentPath(type: string, id: string) {
  const recordId = parseInt(id);
  if (isNaN(recordId)) return null;

  if (type === "expense") {
    const record = await prisma.expenses.findUnique({
        where: { ExpenseID: recordId },
        select: { AttachmentPath: true }
    });
    return record?.AttachmentPath;
  } else if (type === "income") {
    const record = await prisma.incomes.findUnique({
        where: { IncomeID: recordId },
        select: { AttachmentPath: true }
    });
    return record?.AttachmentPath;
  }
  return null;
}

export default async function InterceptedPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const path = await getAttachmentPath(type, id);

  if (!path) notFound();

  const fileName = path.split(/[/\\]/).pop() || "Attachment";
  const downloadUrl = path.startsWith("http") 
    ? path 
    : process.env.NEXT_PUBLIC_URL_ENDPOINT 
        ? `${process.env.NEXT_PUBLIC_URL_ENDPOINT.replace(/\/$/, "")}/${path.replace(/^\//, "")}` 
        : path;

  // Theme definition based on type
  const isExpense = type === "expense";
  const themeColor = isExpense ? "text-rose-500" : "text-emerald-500";
  const borderColor = isExpense ? "border-rose-500/20" : "border-emerald-500/20";
  const softBg = isExpense ? "bg-rose-500/5" : "bg-emerald-500/5";

  return (
    <Modal>
          {/* Header Section */}
          <div className={`flex-none p-4 border-b flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${borderColor}`}>
             <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-semibold leading-none flex items-center gap-2">
                    <span className={`capitalize ${themeColor}`}>{type}</span> 
                    Attachment
                </h2>
                <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md" title={fileName}>
                    {decodeURIComponent(fileName)}
                </p>
             </div>
             
             {/* Action Buttons - margin right to avoid overlapping transparent close button */}
             <div className="flex items-center gap-1 sm:gap-2 mr-8"> 
                <Button variant="ghost" size="icon" className={`h-8 w-8 hover:${softBg} hover:${themeColor}`} asChild title="Open Full Page">
                    <Link href={`/view-attachment/${type}/${id}`} target="_blank" rel="noopener noreferrer">
                        <Maximize2 className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 hover:${softBg} hover:${themeColor}`} asChild title="Download">
                    <a href={`/api/download?path=${encodeURIComponent(path)}&filename=${encodeURIComponent(fileName)}`}>
                        <Download className="h-4 w-4" />
                    </a>
                </Button>
             </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 relative w-full h-full bg-muted/20 flex items-center justify-center p-4 overflow-hidden">
             <AttachmentViewer 
                path={path} 
                alt={fileName}
                className="object-contain max-h-full max-w-full shadow-sm rounded-md"
             />
          </div>
    </Modal>
  );
}
