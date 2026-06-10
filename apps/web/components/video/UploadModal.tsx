"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileVideo,
  PlusCircle,
  LogIn,
  ImageIcon,
  X
} from "lucide-react";

import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/auth/store";
import { useUploadVideo } from "@/hooks/videos/useUploadVideo";
import { useCreateChannel } from "@/hooks/channel/useCreateChannel";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getApiErrorMessage } from "@/lib/apiClient";

export function UploadModal() {
  const router = useRouter();

  // Store state
  const { isUploadModalOpen, closeUploadModal } = useUIStore();
  const { user, isLoggedIn } = useAuthStore();

  // API Mutations
  const {
    mutate: startUpload,
    isPending: isUploading,
    isError: isUploadError,
    error: uploadError,
    isSuccess: isUploadSuccess,
    reset: resetUpload
  } = useUploadVideo();

  const {
    mutate: createChannel,
    isPending: isCreatingChannel
  } = useCreateChannel();

  // Local UI state
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Channel Creation state
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  // Refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  /**
   * Resets all modal state
   */
  const resetState = () => {
    setFile(null);
    setThumbnailFile(null);
    setTitle("");
    setProgress(0);
    setValidationError(null);
    setChannelName("");
    setChannelDescription("");
    resetUpload();
  };

  /**
   * Handles modal open/close
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeUploadModal();
      setTimeout(resetState, 300);
    }
  };

  /**
   * Handles video file selection
   */
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "video/mp4") {
      setValidationError("Only valid video/mp4 files are supported.");
      return;
    }

    setFile(selectedFile);
    if (!title) setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
  };

  /**
   * Handles thumbnail file selection
   */
  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "image/png") {
      setValidationError("Only PNG images are supported for thumbnails.");
      return;
    }

    setThumbnailFile(selectedFile);
  };

  /**
   * Submits the upload form
   */
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !thumbnailFile || !title.trim() || !user?.channels?.[0]) return;

    startUpload({
      title,
      channelId: user.channels[0].id,
      file,
      thumbnailFile,
      onProgress: (p) => setProgress(p),
    });
  };

  /**
   * Submits the channel creation form
   */
  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;
    createChannel({
      name: channelName,
      description: channelDescription,
    });
  };

  /**
   * Renders the appropriate modal content based on authentication and channel state
   */
  const renderContent = () => {
    // 1. Not Logged In
    if (!isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <LogIn className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Login Required</h3>
            <p className="text-sm text-muted-foreground">You need to be logged in to upload videos.</p>
          </div>
          <Button onClick={() => { closeUploadModal(); router.push("/login"); }} className="w-full">
            Login Now
          </Button>
        </div>
      );
    }

    // 2. No Channel Found
    if (!user?.channels || user.channels.length === 0) {
      return (
        <form onSubmit={handleCreateChannelSubmit} className="space-y-4 p-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Create a Channel</h3>
            <p className="text-sm text-muted-foreground">You need a channel to start uploading videos.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelName">Channel Name</Label>
            <Input
              id="channelName"
              placeholder="My Awesome Channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
              disabled={isCreatingChannel}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelDescription">Description</Label>
            <Input
              id="channelDescription"
              placeholder="What is your channel about?"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              disabled={isCreatingChannel}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isCreatingChannel || !channelName.trim()}>
            {isCreatingChannel ? "Creating..." : "Create Channel & Continue"}
          </Button>
        </form>
      );
    }

    // 3. Upload Success
    if (isUploadSuccess) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <PlusCircle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">Upload Successful!</h3>
            <p className="text-sm text-muted-foreground">Your video and thumbnail have been uploaded and are being processed.</p>
          </div>
          <Button onClick={closeUploadModal} className="w-full">Close Window</Button>
        </div>
      );
    }

    // 4. Default Upload Form
    return (
      <form onSubmit={handleUploadSubmit} className="space-y-4">
        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {isUploadError && (
          <Alert variant="destructive">
            <AlertDescription>
              {uploadError instanceof Error ? uploadError.message : getApiErrorMessage(uploadError, "Upload failed. Please try again.")}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Thumbnail Selection */}
          <div className="space-y-2">
            <Label>Thumbnail (Mandatory PNG)</Label>
            {!thumbnailFile ? (
              <div
                onClick={() => !isUploading && thumbInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium">Select PNG Thumbnail</span>
                <input
                  type="file"
                  ref={thumbInputRef}
                  className="hidden"
                  accept="image/png"
                  onChange={handleThumbChange}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3 bg-muted/30 p-2 rounded-lg border border-primary/20">
                <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{thumbnailFile.name}</p>
                </div>
                {!isUploading && (
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setThumbnailFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Video Selection */}
          <div className="space-y-2">
            <Label>Video File (MP4)</Label>
            {!file ? (
              <div
                onClick={() => !isUploading && videoInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium">Select MP4 Video</span>
                <input
                  type="file"
                  ref={videoInputRef}
                  className="hidden"
                  accept="video/mp4"
                  onChange={handleVideoChange}
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3 bg-muted/30 p-2 rounded-lg border border-primary/20">
                <FileVideo className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                </div>
                {!isUploading && (
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Video Metadata */}
          <div className="space-y-2">
            <Label htmlFor="videoTitle">Video Title</Label>
            <Input
              id="videoTitle"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              required
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Uploading files...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={closeUploadModal}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isUploading || !title.trim() || !file || !thumbnailFile}
            >
              {isUploading ? "Processing..." : "Upload Video"}
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <Dialog open={isUploadModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLoggedIn ? (user?.channels?.length ? "Upload Video" : "Create Channel") : "Sign In Required"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Modal to upload videos and thumbnails to your channel.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
