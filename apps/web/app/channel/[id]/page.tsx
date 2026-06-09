"use client";

import { useChannelProfile } from "@/hooks/channel/useChannelProfile";
import { useSubscription } from "@/hooks/channel/useSubscription";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/ui/videocard";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useParams } from "next/navigation";
import { use } from "react";

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;
  const { user: currentUser } = useAuth();

  const { data: channel, isLoading, error } = useChannelProfile(channelId);
  const { isSubscribed, toggleSubscription, isSubscribing, isLoading: isSubLoading } = useSubscription(channelId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold">Channel not found</h1>
          <p className="text-muted-foreground">The channel you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === channel.userId;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
        <Avatar className="h-32 w-32 md:h-40 md:w-40">
          <AvatarFallback className="text-4xl">
            {channel.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold md:text-4xl">{channel.name}</h1>
            <p className="mt-1 text-muted-foreground">
              {channel.subscriberCount.toLocaleString()} subscribers • {channel.videos?.length || 0} videos
            </p>
            {channel.description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {channel.description}
              </p>
            )}
          </div>

          {!isOwner && (
            <Button
              size="lg"
              variant={isSubscribed ? "secondary" : "default"}
              className="mt-2 min-w-[140px] rounded-full font-semibold"
              onClick={toggleSubscription}
              disabled={isSubscribing}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-12 border-t pt-8 px-4 md:px-8">
        <h2 className="mb-6 text-xl font-bold">Videos</h2>
        
        {!channel.videos || channel.videos.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground">
            <p>No videos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {channel.videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnailUrl={video.thumbnailUrl || ""}
                channelName={channel.name}
                channelAvatarUrl={undefined} // We are on the channel page, avatar is already shown above
                views={video.viewsCount.toLocaleString()}
                postedAt={new Date(video.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
