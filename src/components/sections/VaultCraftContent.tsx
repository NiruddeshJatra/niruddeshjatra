import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getVaultText } from "@/lib/vault";
import { VaultMarkdown } from "@/vault/VaultMarkdown";

const VaultCraftContent = () => {
  const navigate = useNavigate();
  const text = getVaultText("series-craft");

  useEffect(() => {
    if (!text) {
      navigate("/vault");
    }
  }, [navigate, text]);

  if (!text) return null;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-2xl mx-auto px-4 py-6 font-mono text-[15px] leading-[1.7] text-foreground/85">
        <div className="mb-8">
          <h1 className="text-xl tracking-[0.15em] uppercase mb-1">series craft</h1>
          <p className="text-xs text-foreground/45">
            what series 001 actually does, so 002 can do it on purpose. nj · ongoing.
          </p>
        </div>

        <VaultMarkdown text={text} sectionClass="mb-10" />

        <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
          — nj · vault · series craft · ongoing
        </div>
      </div>
    </>
  );
};

export default VaultCraftContent;
