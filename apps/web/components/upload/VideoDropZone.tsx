"use client";

import { useId, useRef } from "react";
import { UploadIcon, FileVideoIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVideoUploadStore } from "@/store/useVideoUploadStore";

const ACCEPTED_TYPE = "video/mp4";
const MAX_SIZE_BYTES = 500 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateVideoFile(file: File): string | null {
  if (file.type !== ACCEPTED_TYPE) {
    return "Only MP4 videos are supported.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "File must be 500 MB or smaller.";
  }
  return null;
}

type VideoDropZoneProps = {
  disabled?: boolean;
  onValidationError: (message: string) => void;
};

export function VideoDropZone({
  disabled = false,
  onValidationError,
}: VideoDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const file = useVideoUploadStore((s) => s.file);
  const isDragging = useVideoUploadStore((s) => s.isDragging);
  const setFile = useVideoUploadStore((s) => s.setFile);
  const setIsDragging = useVideoUploadStore((s) => s.setIsDragging);

  const applyFile = (nextFile: File | null) => {
    if (!nextFile) {
      setFile(null);
      return;
    }
    const error = validateVideoFile(nextFile);
    if (error) {
      onValidationError(error);
      return;
    }
    onValidationError("");
    setFile(nextFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      applyFile(droppedFile);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      applyFile(selected);
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Drop a video file here or browse to upload"
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        className={cn(
          "flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <UploadIcon className="mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop your video here
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          MP4 only, up to 500 MB
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse files
        </Button>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPE}
        className="sr-only"
        disabled={disabled}
        onChange={handleInputChange}
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
          <FileVideoIcon className="shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label="Remove selected file"
            onClick={() => applyFile(null)}
          >
            <XIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
