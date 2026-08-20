"use client";

import React from "react";
import { IStory } from "@/services/stories";
import { Api } from "@/services/api-client";
import { cn } from "@/lib/utils";
import { Container } from "@/shared/components";
import ReactStories from "react-insta-stories";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  className?: string;
}

const ITEM_WIDTH = 200;
const ITEM_GAP = 12;
const STEP = ITEM_WIDTH + ITEM_GAP;

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [currentStory, setCurrentStory] = React.useState<IStory>();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const dragState = React.useRef({
    dragging: false,
    moved: false,
    startX: 0,
    startOffset: 0,
  });

  React.useEffect(() => {
    async function fetchStories() {
      try {
        const data = await Api.stories.getAll();
        setStories(data);
      } catch (error) {
        console.log("Error [FETCH_STORIES] " + error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  React.useEffect(() => {
    if (open) {
      scroll({ top: 0 });
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [open]);

  const getMaxOffset = React.useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    return Math.max(0, track.scrollWidth - viewport.clientWidth);
  }, []);

  const clampOffset = React.useCallback(
    (value: number) => Math.min(Math.max(value, 0), getMaxOffset()),
    [getMaxOffset],
  );

  const updateNav = React.useCallback(
    (newOffset: number) => {
      const max = getMaxOffset();
      setCanPrev(newOffset > 0);
      setCanNext(newOffset < max);
    },
    [getMaxOffset],
  );

  React.useEffect(() => {
    const clamped = clampOffset(offset);
    if (clamped !== offset) {
      setOffset(clamped);
    }
    updateNav(clamped);
  }, [stories, offset, clampOffset, updateNav]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleResize = () => {
      setOffset((prev) => {
        const clamped = clampOffset(prev);
        updateNav(clamped);
        return clamped;
      });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(viewport);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [clampOffset, updateNav]);

  const scrollByPixels = (pixels: number) => {
    setOffset((prev) => {
      const next = clampOffset(prev + pixels);
      updateNav(next);
      return next;
    });
  };

  const visibleCount = React.useMemo(() => {
    if (typeof window === "undefined") return 4;
    const viewport = viewportRef.current;
    if (!viewport) return 4;
    return Math.max(1, Math.floor(viewport.clientWidth / STEP));
  }, [stories, offset]);

  const handlePrev = () => scrollByPixels(-STEP * visibleCount);
  const handleNext = () => scrollByPixels(STEP * visibleCount);

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startOffset: offset,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;

    const delta = dragState.current.startX - e.clientX;
    if (Math.abs(delta) > 5) dragState.current.moved = true;

    const next = clampOffset(dragState.current.startOffset + delta);
    setOffset(next);
    updateNav(next);
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  const onClickStory = (story: IStory) => {
    if (dragState.current.moved) return;
    setCurrentStory(story);
    if (story.items.length > 0) setOpen(true);
  };

  if (!loading && stories.length === 0) {
    return null;
  }

  return (
    <>
      <Container className={cn("relative my-10", className)}>
        {canPrev && (
          <button
            onClick={handlePrev}
            aria-label="Предыдущие сторис"
            className="absolute -left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50">
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        <div
          ref={viewportRef}
          className="overflow-hidden select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}>
          <div
            ref={trackRef}
            className={cn(
              "flex touch-pan-y",
              !dragState.current.moved &&
                "transition-transform duration-300 ease-out",
            )}
            style={{ transform: `translateX(-${offset}px)` }}>
            {loading &&
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="mr-[12px] h-[250px] w-[200px] shrink-0 animate-pulse rounded-md bg-gray-200"
                />
              ))}
            {stories.map((story) => (
              <img
                key={story.id}
                onClick={() => onClickStory(story)}
                draggable={false}
                className="mr-[12px] h-[250px] w-[200px] shrink-0 cursor-pointer rounded-md object-cover"
                src={story.previewImageUrl}
                alt={`Сторис #${story.id}`}
              />
            ))}
          </div>
        </div>

        {canNext && (
          <button
            onClick={handleNext}
            aria-label="Следующие сторис"
            className="absolute -right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50">
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}
      </Container>

      {open && (
        <div className="fixed left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30">
          <div className="relative" style={{ width: 520 }}>
            <button
              className="absolute -right-10 -top-5 z-30"
              onClick={() => setOpen(false)}>
              <X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
            </button>
            <ReactStories
              onAllStoriesEnd={() => setOpen(false)}
              stories={
                currentStory?.items.map((item) => ({ url: item.sourceUrl })) ||
                []
              }
              defaultInterval={5000}
              width={520}
              height={800}
            />
          </div>
        </div>
      )}
    </>
  );
};
