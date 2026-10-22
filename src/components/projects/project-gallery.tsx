"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { ContentImage } from "@/components/ui/content-image";
import { ProjectLightbox } from "./project-lightbox";
import type { ProjectScreenshot } from "@/types/project";

export function ProjectGallery({
  screenshots,
}: {
  screenshots: readonly ProjectScreenshot[];
}) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState<string>();
  const opener = useRef<HTMLAnchorElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const viewportId = useId();
  const image = screenshots[selected];
  if (!image) return null;
  const label = image.label ?? image.caption ?? `Screenshot ${selected + 1}`;
  const change = (index: number) => {
    setSelected(Math.max(0, Math.min(screenshots.length - 1, index)));
    setFailed(undefined);
  };
  return (
    <div
      className="project-gallery"
      role="region"
      aria-label="Application screenshot gallery"
      onKeyDown={(event) => {
        if (
          open ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey
        )
          return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          change(selected + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
    >
      <div className="gallery-topline">
        <p>Application screenshots</p>
        <span aria-hidden="true">
          {selected + 1} / {screenshots.length}
        </span>
      </div>
      <figure id={viewportId}>
        <a
          ref={opener}
          className="gallery-stage"
          href={image.src}
          aria-label={`Enlarge ${label}`}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.preventDefault();
            if (swiped.current && event.detail > 0) {
              swiped.current = false;
              return;
            }
            setOpen(true);
          }}
          onTouchStart={(event) => {
            swiped.current = false;
            const point = event.touches[0];
            if (event.touches.length === 1 && point)
              touch.current = { x: point.clientX, y: point.clientY };
            else touch.current = null;
          }}
          onTouchCancel={() => {
            touch.current = null;
          }}
          onTouchEnd={(event) => {
            const start = touch.current;
            touch.current = null;
            const point = event.changedTouches[0];
            if (
              !start ||
              !point ||
              (window.visualViewport && window.visualViewport.scale > 1)
            )
              return;
            const dx = point.clientX - start.x,
              dy = point.clientY - start.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              swiped.current = true;
              change(selected + (dx < 0 ? 1 : -1));
            }
          }}
          onErrorCapture={() => setFailed(image.src)}
        >
          <ContentImage
            image={image}
            sizes="(max-width: 767px) 90vw, 80vw"
            className="gallery-image"
          />
          <span className="gallery-enlarge">
            <Maximize2 size={16} aria-hidden="true" /> Enlarge
          </span>
        </a>
        {failed === image.src && (
          <p role="status" className="gallery-error">
            This preview could not load. Select another screenshot or open the
            full-size image.
          </p>
        )}
        <figcaption>
          <strong>{label}</strong>
          {image.caption && <span>{image.caption}</span>}
        </figcaption>
      </figure>
      <div className="gallery-controls">
        <button
          type="button"
          onClick={() => change(selected - 1)}
          disabled={selected === 0}
          aria-controls={viewportId}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Previous
        </button>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          Screenshot {selected + 1} of {screenshots.length}: {label}
        </p>
        <button
          type="button"
          onClick={() => change(selected + 1)}
          disabled={selected === screenshots.length - 1}
          aria-controls={viewportId}
        >
          Next <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="gallery-thumbnails" aria-label="Choose a screenshot">
        {screenshots.map((item, index) => (
          <button
            type="button"
            key={item.id ?? item.src}
            aria-label={`View ${item.label ?? `screenshot ${index + 1}`}`}
            aria-pressed={selected === index}
            aria-controls={viewportId}
            onClick={() => change(index)}
          >
            <ContentImage
              image={{ ...item, alt: "" }}
              variant="thumbnail"
              sizes="120px"
            />
            <span>{item.label ?? `${index + 1} of ${screenshots.length}`}</span>
          </button>
        ))}
      </div>
      <noscript>
        <p>Open an application screenshot:</p>
        <ul>
          {screenshots.map((item) => (
            <li key={item.src}>
              <a href={item.src}>{item.label ?? item.alt}</a>
            </li>
          ))}
        </ul>
      </noscript>
      {open && (
        <ProjectLightbox
          screenshots={screenshots}
          selected={selected}
          onChange={change}
          onClose={() => {
            setOpen(false);
            opener.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
}
