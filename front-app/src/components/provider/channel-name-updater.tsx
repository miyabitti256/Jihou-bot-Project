"use client";

import { useEffect } from "react";
import { useChannelContext } from "./channel-context";

export function ChannelNameUpdater({ name }: { name: string }) {
  const { setChannelName } = useChannelContext();

  useEffect(() => {
    setChannelName(name);
  }, [name, setChannelName]);

  return null;
}
