import { prisma } from "@/lib/prisma";
import { AttachmentViewer } from "@/components/shared/attachment-viewer";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

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

export default async function Page({
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
  const backLink = `/${type}s/${id}`;
  const themeColor = isExpense ? "text-rose-500" : "text-emerald-500";
  const badgeClass = isExpense ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/50" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50";

  return (
    <div className="container mx-auto p-4 md:px-4 md:py-6 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href={backLink} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-border/60 mx-2 hidden sm:block" />
              <h1 className="text-lg font-semibold flex items-center gap-2 hidden sm:flex">
                  <span className={`capitalize ${themeColor}`}>{type}</span> 
                  Attachment
              </h1>
          </div>

          <Button variant="outline" asChild>
            <a href={`/api/download?path=${encodeURIComponent(path)}&filename=${encodeURIComponent(fileName)}`}>
                <Download className="w-4 h-4 mr-2" />
                Download
            </a>
          </Button>
       </div>

       <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed p-4 min-h-[500px]">
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <AttachmentViewer 
                path={path} 
                alt={fileName}
                className="object-contain" // Important for responsive sizing
            />
          </div>
       </div>
    </div>
  );
}
