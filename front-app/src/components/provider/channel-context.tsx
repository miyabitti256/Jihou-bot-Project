"use client";

import { createContext, useContext, useState } from "react";

type ChannelContextType = {
  channelName: string;
  setChannelName: (name: string) => void;
};

const ChannelContext = createContext<ChannelContextType>({
  channelName: "",
  setChannelName: () => {},
});

export function ChannelProvider({ children }: { children: React.ReactNode }) {
  const [channelName, setChannelName] = useState("");
  return (
    <ChannelContext.Provider value={{ channelName, setChannelName }}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannelContext() {
  return useContext(ChannelContext);
}
