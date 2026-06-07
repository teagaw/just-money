import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6 py-12">
        <p className="text-2xs uppercase tracking-widest text-fg-muted">
          404 · Not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          That product does not exist
        </h1>
        <p className="mt-3 text-sm text-fg-muted text-pretty">
          It may have been archived, or the link is off. Try the catalog to
          find what you are looking for.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to overview
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="primary">Browse products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
