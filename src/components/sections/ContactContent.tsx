import SEO from "../SEO";
import { personSchema } from "../../lib/structuredData";

const ContactContent = () => {
  return (
    <>
      <SEO
        title="contact — niruddeshjatra"
        description="how to reach nj. email, github, strava."
        path="/contact"
        structuredData={personSchema()}
      />
    <div className="animate-fade-in font-mono text-sm leading-relaxed max-w-xl mx-auto px-4 py-6">
      <div className="space-y-3 text-foreground/80">
        <p><span className="text-phosphor">&gt; </span>the door's open.</p>
        <p>
          <span className="text-phosphor">&gt; </span>
          mail:{" "}
          <a
            href="mailto:nasifulalam1212@gmail.com"
            className="text-phosphor hover:underline"
          >
            nasifulalam1212@gmail.com
          </a>
        </p>
        <p><span className="text-phosphor">&gt; </span>i'll add other ways to reach me when i feel like it.</p>
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 2026-04 · 89 bytes
      </div>
    </div>
    </>
  );
};

export default ContactContent;
