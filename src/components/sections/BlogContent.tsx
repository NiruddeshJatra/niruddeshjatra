import { FileText } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  content: string;
}

const blogPosts: BlogPost[] = [];

const BlogContent = () => {
  return (
    <div className="space-y-6 animate-fade-in font-mono text-sm">
      <div className="space-y-2">
        <span className="text-phosphor">const</span>{" "}
        <span className="text-phosphor">blogPosts</span> ={" "}
        <span className="text-phosphor">{"["}</span>
        {blogPosts.length === 0 && (
          <span className="text-phosphor">{"];"}</span>
        )}
      </div>

      {blogPosts.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-6 bg-card/20">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-phosphor flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-foreground/90">
                <span className="text-phosphor-soft">blog.md</span> — unwritten.
              </p>
              <p className="text-xs text-muted-foreground">
                Essays published here once drafts leave{" "}
                <span className="text-phosphor">/notes</span>. Seedling thoughts
                live there first; finished pieces land here.
              </p>
              <p className="text-xs text-muted-foreground">
                Status: <span className="text-phosphor">in progress</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-8 pl-4">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="border border-border rounded-lg p-4 bg-card/30 hover:bg-card/50 transition-colors"
              >
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-phosphor">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-phosphor">{"]"}</span>;
          </div>
        </>
      )}
    </div>
  );
};

export default BlogContent;
