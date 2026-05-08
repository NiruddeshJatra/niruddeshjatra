import { useLocation, Link } from "react-router-dom";

const NotFoundContent = () => {
  const location = useLocation();
  const requestedPath = location.pathname;

  return (
    <div className="animate-fade-in font-mono max-w-xl mx-auto px-4 py-6 text-foreground/85 text-[15px] leading-[1.7]">
      <div className="pl-2 mb-6">
        <p className="mb-1"><span className="text-phosphor">$ </span>cat {requestedPath}</p>
        <p className="mb-1"><span className="text-danger">! </span>cat: {requestedPath}: no such file or directory</p>
      </div>

      <div className="mb-6" />

      <div className="pl-2 mb-6">
        <p className="mb-1"><span className="text-phosphor">$ </span>ls</p>
        <p className="text-foreground/85">
          <Link to="/about" className="text-phosphor hover:underline">me/</Link>{"  "}
          <Link to="/games" className="text-phosphor hover:underline">games/</Link>{"  "}
          <Link to="/writing" className="text-phosphor hover:underline">writing/</Link>{"  "}
          <Link to="/journey" className="text-phosphor hover:underline">journey/</Link>{"  "}
          <Link to="/field-notes" className="text-phosphor hover:underline">field-notes/</Link>{"  "}
          <Link to="/now" className="text-phosphor hover:underline">now.md</Link>{"  "}
          <Link to="/contact" className="text-phosphor hover:underline">contact.md</Link>
        </p>
      </div>

      <div className="pl-2 mb-6">
        <p className="mb-1"><span className="text-phosphor">$ </span><Link to="/" className="text-phosphor hover:underline">cd ~</Link></p>
        <p className="text-foreground/55 text-xs">[back to home]</p>
      </div>

      <div className="mt-12 pt-3 border-t border-border/40 text-[10px] text-phosphor-dim font-mono">
        — nj · 404 · this file does not exist
      </div>
    </div>
  );
};

export default NotFoundContent;
