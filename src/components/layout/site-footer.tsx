import { BackToTop } from "./back-to-top";

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="footer">
      <div>
        <span className="footer-name">{name}.</span>
        <p>Software, design, and a little curiosity.</p>
      </div>
      <BackToTop />
    </footer>
  );
}
