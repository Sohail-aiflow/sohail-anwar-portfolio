"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ZoomIn, Minimize2 } from "lucide-react";
import { ContentImage } from "@/components/ui/content-image";
import type { ProjectScreenshot } from "@/types/project";

export function ProjectLightbox({
  screenshots,
  selected,
  onChange,
  onClose,
}: {
  screenshots: readonly ProjectScreenshot[];
  selected: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [actualSize, setActualSize] = useState(false);
  const [failed, setFailed] = useState<string>();
  const image = screenshots[selected];
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    closeButton.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [selected, actualSize]);
  if (!image) return null;
  const label = image.label ?? image.alt;
  const close = () => {
    dialog.current?.close();
    onClose();
  };
  return (
    <dialog
      ref={dialog}
      className="gallery-lightbox"
      aria-label="Application screenshot viewer"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const buttons = Array.from(
            dialog.current?.querySelectorAll<HTMLButtonElement>(
              "button:not(:disabled)",
            ) ?? [],
          );
          const first = buttons[0],
            last = buttons[buttons.length - 1];
          if (
            first &&
            last &&
            ((!event.shiftKey && document.activeElement === last) ||
              (event.shiftKey && document.activeElement === first))
          ) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
          }
          return;
        }
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          if (
            actualSize ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
          )
            return;
          event.preventDefault();
          onChange(
            Math.max(
              0,
              Math.min(
                screenshots.length - 1,
                selected + (event.key === "ArrowRight" ? 1 : -1),
              ),
            ),
          );
        }
      }}
    >
      <header className="lightbox-toolbar">
        <span>
          {selected + 1} / {screenshots.length}
        </span>
        <button
          type="button"
          onClick={() => setActualSize(!actualSize)}
          aria-pressed={actualSize}
        >
          {actualSize ? (
            <Minimize2 size={18} aria-hidden="true" />
          ) : (
            <ZoomIn size={18} aria-hidden="true" />
          )}
          {actualSize ? "Fit image" : "Actual size"}
        </button>
        <button
          type="button"
          ref={closeButton}
          onClick={close}
          aria-label="Close screenshot viewer"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div
        className={`lightbox-image-area${actualSize ? " is-actual-size" : ""}`}
        ref={scroller}
        onErrorCapture={() => setFailed(image.src)}
      >
        <ContentImage
          image={image}
          variant="full"
          sizes={actualSize ? `${image.width}px` : "100vw"}
          className="lightbox-image"
        />
        {failed === image.src && (
          <p role="status" className="lightbox-load-error">
            This screenshot could not load. Choose another image or close the
            viewer.
          </p>
        )}
      </div>
      <footer className="lightbox-footer">
        <div>
          <strong>{label}</strong>
          <p>{image.caption}</p>
          <span role="status" aria-live="polite" className="sr-only">
            Screenshot {selected + 1} of {screenshots.length}: {label}
          </span>
        </div>
        <div className="lightbox-navigation">
          <button
            type="button"
            aria-label="Previous screenshot"
            disabled={selected === 0}
            onClick={() => onChange(selected - 1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next screenshot"
            disabled={selected === screenshots.length - 1}
            onClick={() => onChange(selected + 1)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </dialog>
  );
}
