"use client";

import { useRef } from "react";
import { FileIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CloudUploadIcon } from "@/components/icons/cloud-upload-icon";
import { cn } from "@/lib/utils";

type AuthFileUploadProps = {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  error?: string;
  className?: string;
  /** Tighter dropzone for tall auth frames (signup). */
  compact?: boolean;
};

/**
 * Dashed document dropzone from Figma registration frame.
 */
export function AuthFileUpload({
  files,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  multiple = true,
  error,
  className,
  compact = false,
}: AuthFileUploadProps) {
  const t = useTranslations("auth");
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const next = multiple ? [...files, ...Array.from(list)] : [list[0]!];
    onChange(next);
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-neutral-300 bg-white px-4 transition-colors",
          compact ? "min-h-[72px] gap-1 py-2" : "min-h-[139px] gap-2 px-6 py-4",
          "hover:border-brand-700 focus-visible:border-brand-700 focus-visible:outline-none",
          error && "border-destructive",
        )}
      >
        <CloudUploadIcon
          size={compact ? 32 : 60}
          className="text-brand-700"
        />
        <span
          className={cn(
            "max-w-[265px] text-center leading-[1.4] text-neutral-400",
            compact ? "text-[11px]" : "text-xs",
          )}
        >
          {t("uploadHint")}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {files.length > 0 ? (
        <ul className="flex w-full flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
            >
              <FileIcon className="size-4 shrink-0 text-brand-700" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-neutral-400 hover:text-neutral-800"
                aria-label={t("removeFile")}
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
