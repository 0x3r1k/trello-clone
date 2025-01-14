"use client";

import { useState } from "react";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useMutation, useStorage } from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";

import { Board } from "@/types/board";
import type { List, Card } from "@/types/board";

import { Input } from "@/components/ui/input";

import {
  addCard as addCardAction,
  addList as addListAction,
} from "@/actions/board";

export function BoardClientSkeleton() {
  return (
    <div className="flex flex-row w-full h-full space-x-4 max-h-full overflow-auto">
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="bg-primary-foreground rounded w-64 h-full p-2.5 overflow-x-auto"
        >
          <div className="animate-pulse">
            <div className="bg-primary-foreground/20 h-6 w-3/4 rounded mb-2" />
            <div className="bg-primary-foreground/20 h-6 w-3/4 rounded mb-2" />
            <div className="bg-primary-foreground/20 h-6 w-3/4 rounded mb-2" />
            <div className="bg-primary-foreground/20 h-6 w-3/4 rounded mb-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BoardClient({
  board,
  initialLists,
  initialCards,
}: {
  board: Board;
  initialLists: List[];
  initialCards: Card[];
}) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_OiIgwg5Ntsx2cX_7g3hPv9zNtDwIrAMAokIfwowfN2INJU1nGyRdpAi7yT_qE7bX"
      }
    >
      <RoomProvider
        id={`board-${board.id.toString()}-prod`}
        initialStorage={{
          lists: new LiveList(initialLists),
          cards: new LiveList(initialCards),
        }}
      >
        <ClientSideSuspense fallback={<BoardClientSkeleton />}>
          <BoardLists board={board} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function BoardLists({ board }: { board: Board }) {
  const lists = useStorage((root) => root.lists);
  const cards = useStorage((root) => root.cards);

  const addList = useMutation(
    ({ storage }, { id, title, position, board_id }) => {
      storage.get("lists").push({ id, title, position, board_id });
    },
    []
  );

  const [newList, setNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddList = async () => {
    if (newListTitle.trim() === "") {
      return;
    }

    const { success, id } = await addListAction({
      title: newListTitle,
      position: 0,
      board_id: board.id,
    });

    if (success)
      addList({
        id,
        title: newListTitle,
        position: 0,
        board_id: board.id,
      });

    setNewList(false);
    setNewListTitle("");
  };

  return (
    <div className="flex flex-row w-full h-auto space-x-4 max-h-full overflow-auto">
      {lists?.map((list, index) => (
        <List
          key={index}
          list={list}
          cards={cards?.filter((c) => c.list_id === list.id)}
        />
      ))}

      <div className="bg-transparent rounded w-64">
        {newList ? (
          <div className="bg-primary-foreground rounded w-64 h-auto p-2.5 transition-all">
            <Input
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddList();
                }
              }}
              onBlur={() => {
                setNewList(false);
                setNewListTitle("");
              }}
              autoFocus
            />
          </div>
        ) : (
          <div
            className="bg-sidebar-primary/20 h-auto w-full p-2.5 rounded cursor-pointer transition-all hover:bg-sidebar-primary text-primary text-sm font-semibold"
            onClick={() => setNewList(true)}
          >
            Add a list
          </div>
        )}
      </div>
    </div>
  );
}

function List({ list, cards }: { list: List; cards?: Card[] }) {
  const [editingListTitle, setEditingListTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const [newCard, setNewCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const addCard = useMutation(
    ({ storage }, { id, title, position, list_id }) => {
      storage
        .get("cards")
        .push({ id, title, position, list_id, board_id: list.board_id });
    },
    []
  );

  const handleAddCard = async () => {
    if (newCardTitle.trim() === "") {
      return;
    }

    const { success, id } = await addCardAction({
      title: newCardTitle,
      position: 0,
      list_id: list.id,
      board_id: list.board_id,
    });

    if (success)
      addCard({
        id,
        title: newCardTitle,
        position: 0,
        list_id: list.id,
      });

    setNewCard(false);
    setNewCardTitle("");
  };

  return (
    <div className="bg-primary-foreground rounded w-64 h-full p-2.5 overflow-x-auto">
      {editingListTitle ? (
        <Input
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          onBlur={() => setEditingListTitle(false)}
          autoFocus
        />
      ) : (
        <span
          className="text-lg font-semibold cursor-pointer"
          onClick={() => setEditingListTitle(true)}
        >
          {list.title}
        </span>
      )}

      <div className="mt-2 space-y-2">
        {cards?.map((card, index) => (
          <Card key={index} card={card} />
        ))}

        {newCard ? (
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCard();
              }
            }}
            onBlur={() => {
              setNewCard(false);
              setNewCardTitle("");
            }}
            autoFocus
          />
        ) : (
          <div
            className="bg-sidebar-primary/20 rounded p-2 cursor-pointer transition-all hover:bg-sidebar-primary text-primary text-sm font-semibold"
            onClick={() => setNewCard(true)}
          >
            + Add a card
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ card }: { card: Card }) {
  return (
    <div className="bg-sidebar-primary rounded p-2 cursor-pointer transition-all hover:bg-sidebar-primary/70 text-primary text-sm font-semibold">
      {card.title}
    </div>
  );
}
