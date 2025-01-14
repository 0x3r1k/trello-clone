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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/loading-button";
import { Check, X } from "lucide-react";

import {
  addCard as addCardAction,
  addList as addListAction,
} from "@/actions/board";

export function BoardClientSkeleton() {
  return (
    <div className="flex flex-row w-full h-auto space-x-4 overflow-auto">
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
    <div className="flex flex-row w-full h-auto space-x-4 max-h-full overflow-x-auto">
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
            + Add another list
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
  const [addingCardPending, setAddingCardPending] = useState(false);

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

    setAddingCardPending(true);

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

    setAddingCardPending(false);
    setNewCard(false);
    setNewCardTitle("");
  };

  return (
    <div className="bg-primary-foreground rounded w-64 h-full p-2.5 overflow-x-auto">
      {editingListTitle ? (
        <Input
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          onBlur={() => {
            setEditingListTitle(false);
            setListTitle(list.title);
          }}
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
        {cards &&
          cards
            .sort((a, b) => a.position - b.position)
            .map((card, index) => <Card key={index} card={card} />)}

        {newCard ? (
          <div className="flex flex-row items-center space-x-2">
            <Textarea
              placeholder="Enter a title for this card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              readOnly={addingCardPending}
              autoFocus
            />

            <div className="flex flex-col items-center space-y-2">
              <LoadingButton
                onClick={handleAddCard}
                pending={addingCardPending}
                className="w-8 h-8 bg-blue-500 rounded cursor-pointer transition-all hover:bg-blue-600 text-primary text-sm font-semibold"
              >
                <Check className="w-4 h-4" />
              </LoadingButton>

              <Button
                onClick={() => {
                  setNewCard(false);
                  setNewCardTitle("");
                }}
                className="w-8 h-8 bg-red-500 rounded cursor-pointer transition-all hover:bg-red-600 text-primary text-sm font-semibold"
                disabled={addingCardPending}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
    <div className="bg-sidebar-primary rounded p-2 cursor-pointer transition-all hover:bg-sidebar-primary/70 text-primary text-sm font-normal">
      {card.title}
    </div>
  );
}
