import SEO from "../SEO";
import { personSchema } from "../../lib/structuredData";

const RESUME_PATH = "/Nasiful_Alam_Resume.pdf";

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
        <p><span className="text-phosphor">&gt; </span>client work: same address.</p>
        <p>
          <span className="text-phosphor">&gt; </span>
          github:{" "}
          <a
            href="https://github.com/niruddeshjatra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            niruddeshjatra
          </a>
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>
          linkedin:{" "}
          <a
            href="https://www.linkedin.com/in/nasiful-alam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            nasiful-alam
          </a>
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>
          strava:{" "}
          <a
            href="https://www.strava.com/athletes/102295099"
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            @nj
          </a>
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>
          resume:{" "}
          <a
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            open
          </a>
          {" · "}
          <a
            href={RESUME_PATH}
            download
            className="text-phosphor hover:underline"
          >
            download
          </a>
        </p>
      </div>
      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 2026-10 · 158 bytes
      </div>
    </div>
    </>
  );
};

export default ContactContent;
