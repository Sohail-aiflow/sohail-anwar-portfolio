import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="footer">
      <div>
        <span className="footer-name">{name}.</span>
        <p>Software, design, and a little curiosity.</p>
      </div>
      <Link href="/#home" className="back-to-top">
        Back to top <ArrowUp size={16} aria-hidden="true" />
      </Link>
    </footer>
  );
}
