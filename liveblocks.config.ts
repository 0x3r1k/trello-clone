/* eslint-disable @typescript-eslint/no-empty-object-type */
// Define Liveblocks types for your application

import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import { Card, List } from "@/types/board";

const client = createClient({
  publicApiKey:
    "pk_prod_OiIgwg5Ntsx2cX_7g3hPv9zNtDwIrAMAokIfwowfN2INJU1nGyRdpAi7yT_qE7bX",
  throttle: 100,
});

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      boardId?: string;
      listId?: string;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      lists: LiveList<List>;
      cards: LiveList<Card>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

type Presence = {
  boardId?: string;
  listId?: string;
};

type Storage = {
  lists: LiveList<List>;
  cards: LiveList<Card>;
};

interface UserMeta {
  id: string;
}

type RoomEvent = {};
type ThreadMetadata = {};

export const {
  RoomProvider,
  useMyPresence,
  useUpdateMyPresence,
  useStorage,
  useMutation,
  useRoom,
  useSelf,
  useOthers,
  useThreads,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);
