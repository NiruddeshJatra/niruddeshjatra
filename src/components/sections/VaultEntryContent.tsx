import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassphrase, unlockVault } from "@/lib/vault";

const VaultEntryContent = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const valid = await verifyPassphrase(input);
    if (valid) {
      unlockVault();
      navigate("/vault/the-real-story");
    } else {
      setError("! incorrect");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 font-mono text-[15px] leading-[1.7] text-foreground/85">
      <div className="pl-2 mb-6">
        <p>
          <span className="text-phosphor">&gt; </span>there's a page here. it's
          not for everyone.
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>if you have the password,
          type it below.
        </p>
        <p>
          <span className="text-phosphor">&gt; </span>if you don't, you don't.
        </p>
      </div>

      <div className="mt-10">
        {error && <p className="text-danger mb-4">{error}</p>}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="passphrase"
          className="font-mono bg-transparent border-b border-phosphor-dim focus:border-phosphor focus:outline-none px-1 py-1 text-foreground w-full max-w-sm placeholder:text-foreground/30"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="mt-4 block font-mono text-sm text-phosphor hover:text-phosphor/70 transition-colors"
        >
          enter →
        </button>
      </div>

      <p className="mt-8 text-xs text-foreground/45">
        if you don't know the password, that's the answer.
      </p>
    </div>
  );
};

export default VaultEntryContent;
