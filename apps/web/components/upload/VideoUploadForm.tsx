"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon } from "lucide-react";
import {
  createChannelSchema,
  videoUploadFormSchema,
  type VideoUploadFormInput,
} from "@streamflow/validation";

import { useCreateChannel } from "@/hooks/useCreateChannel";
import { useMe } from "@/hooks/useMe";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { getApiErrorMessage } from "@/lib/api-errors";
import { useVideoUploadStore } from "@/store/useVideoUploadStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { VideoDropZone } from "@/components/upload/VideoDropZone";

export function VideoUploadForm() {
  const formId = useId();
  const [localError, setLocalError] = useState<string | null>(null);

  const { data: me, isPending: isMePending } = useMe();
  const channels = useMemo(() => me?.channels ?? [], [me?.channels]);

  const file = useVideoUploadStore((s) => s.file);
  const phase = useVideoUploadStore((s) => s.phase);
  const uploadProgress = useVideoUploadStore((s) => s.uploadProgress);
  const errorMessage = useVideoUploadStore((s) => s.errorMessage);
  const selectedChannelId = useVideoUploadStore((s) => s.selectedChannelId);
  const setSelectedChannelId = useVideoUploadStore((s) => s.setSelectedChannelId);
  const resetUpload = useVideoUploadStore((s) => s.reset);

  const {
    mutate: uploadVideo,
    isPending: isUploadPending,
    reset: resetMutation,
  } = useVideoUpload();

  const {
    mutate: createChannel,
    isPending: isCreatingChannel,
    isError: isCreateChannelError,
    error: createChannelError,
  } = useCreateChannel();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoUploadFormInput>({
    resolver: zodResolver(videoUploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      channelId: "",
    },
  });

  const channelIdValue = watch("channelId");

  useEffect(() => {
    if (!channels.length) return;

    const defaultChannelId = selectedChannelId ?? channels[0]?.id;
    if (!defaultChannelId) return;

    if (!selectedChannelId) {
      setSelectedChannelId(defaultChannelId);
    }
    setValue("channelId", defaultChannelId, { shouldValidate: true });
  }, [channels, selectedChannelId, setSelectedChannelId, setValue]);

  const isBusy =
    isUploadPending ||
    phase === "initializing" ||
    phase === "uploading" ||
    phase === "finalizing";

  const displayError =
    localError ?? errorMessage ?? getApiErrorMessage(createChannelError, "");

  const onSubmit = (data: VideoUploadFormInput) => {
    setLocalError(null);
    useVideoUploadStore.getState().setErrorMessage(null);

    if (!file) {
      setLocalError("Select an MP4 video before uploading.");
      return;
    }

    uploadVideo(
      {
        ...data,
        contentType: "video/mp4",
        description: data.description?.trim() ? data.description : undefined,
        file,
      },
      {
        onError: (error) => {
          useVideoUploadStore
            .getState()
            .setErrorMessage(
              getApiErrorMessage(error, "Video upload failed."),
            );
        },
      },
    );
  };

  const handleCreateChannel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("channelName") ?? ""),
      description: String(formData.get("channelDescription") ?? ""),
    };

    const parsed = createChannelSchema.safeParse(payload);
    if (!parsed.success) {
      setLocalError(parsed.error.issues[0]?.message ?? "Invalid channel details.");
      return;
    }

    setLocalError(null);
    createChannel(parsed.data, {
      onSuccess: (channel) => {
        setSelectedChannelId(channel.id);
        setValue("channelId", channel.id, { shouldValidate: true });
      },
      onError: (error) => {
        setLocalError(
          getApiErrorMessage(error, "Could not create channel."),
        );
      },
    });
  };

  const handleUploadAnother = () => {
    resetUpload();
    resetMutation();
    setLocalError(null);
  };

  if (isMePending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (phase === "success") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
            <CheckCircle2Icon className="text-primary" />
            Upload complete
          </CardTitle>
          <CardDescription>
            Your video has been uploaded and is now available on your channel.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button type="button" onClick={handleUploadAnother}>
            Upload another video
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!channels.length) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">
            Create a channel first
          </CardTitle>
          <CardDescription>
            You need a channel before you can upload videos to Streamflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateChannel} className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-disabled={isCreatingChannel ? true : undefined}>
                <FieldLabel htmlFor={`${formId}-channel-name`}>
                  Channel name
                </FieldLabel>
                <Input
                  id={`${formId}-channel-name`}
                  name="channelName"
                  placeholder="My channel"
                  disabled={isCreatingChannel}
                  required
                />
              </Field>
              <Field data-disabled={isCreatingChannel ? true : undefined}>
                <FieldLabel htmlFor={`${formId}-channel-description`}>
                  Description
                </FieldLabel>
                <Textarea
                  id={`${formId}-channel-description`}
                  name="channelDescription"
                  placeholder="What is your channel about?"
                  disabled={isCreatingChannel}
                  required
                />
              </Field>
              {displayError || isCreateChannelError ? (
                <FieldError>
                  {displayError || "Could not create channel."}
                </FieldError>
              ) : null}
            </FieldGroup>
            <Button type="submit" disabled={isCreatingChannel}>
              {isCreatingChannel ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Creating channel
                </>
              ) : (
                "Create channel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Upload a video</CardTitle>
        <CardDescription>
          Add an MP4 file, fill in the details, and publish to your channel.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {displayError ? (
          <Alert variant="destructive">
            <AlertTitle>Upload error</AlertTitle>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        ) : null}

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            {channels.length > 1 ? (
              <Field
                data-invalid={errors.channelId ? true : undefined}
                data-disabled={isBusy ? true : undefined}
              >
                <FieldLabel htmlFor={`${formId}-channel`}>Channel</FieldLabel>
                <Select
                  value={channelIdValue}
                  onValueChange={(value) => {
                    setValue("channelId", value, { shouldValidate: true });
                    setSelectedChannelId(value);
                  }}
                  disabled={isBusy}
                >
                  <SelectTrigger id={`${formId}-channel`} className="w-full">
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[errors.channelId]} />
              </Field>
            ) : (
              <input type="hidden" {...register("channelId")} />
            )}

            <Field
              data-invalid={errors.title ? true : undefined}
              data-disabled={isBusy ? true : undefined}
            >
              <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
              <Input
                id={`${formId}-title`}
                placeholder="My awesome video"
                disabled={isBusy}
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field
              data-invalid={errors.description ? true : undefined}
              data-disabled={isBusy ? true : undefined}
            >
              <FieldLabel htmlFor={`${formId}-description`}>
                Description
              </FieldLabel>
              <Textarea
                id={`${formId}-description`}
                placeholder="Tell viewers what this video is about (optional)"
                rows={4}
                disabled={isBusy}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldDescription>Optional. Minimum 3 characters if provided.</FieldDescription>
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>

          <VideoDropZone
            disabled={isBusy}
            onValidationError={(message) => {
              setLocalError(message || null);
            }}
          />

          {isBusy ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {phase === "initializing" && "Preparing upload…"}
                  {phase === "uploading" && "Uploading video…"}
                  {phase === "finalizing" && "Finalizing…"}
                </span>
                <span className="font-medium tabular-nums">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          ) : null}
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form={formId}
          className="w-full"
          size="lg"
          disabled={isBusy}
        >
          {isBusy ? (
            <>
              <Spinner data-icon="inline-start" />
              Uploading
            </>
          ) : (
            "Upload video"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Button variant="link" className="h-auto p-0 font-normal" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
