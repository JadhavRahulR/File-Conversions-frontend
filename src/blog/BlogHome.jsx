import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./bloghome.css";

function BlogHome() {
  const blogs = [
    {
      title: "How to Convert Word to PDF",
      description:
        "Learn how to convert Word documents to PDF files quickly and easily.",
      slug: "/blog/how-to-convert-word-to-pdf",
    },
    {
      title: "How to Convert PDF to Word",
      description:
        "Convert PDF files into editable Word documents in a few simple steps.",
      slug: "/blog/how-to-convert-pdf-to-word",
    },
    {
      title: "How to Merge MP3 Files",
      description:
        "Combine multiple MP3 files into a single audio track online.",
      slug: "/blog/how-to-join-mp3-file",
    },
    
  ];

  return (
    <>
      <Helmet>
        <title>FileUnivers Blog | Tutorials, Guides & Tips</title>

        <meta
          name="description"
          content="Read tutorials, guides, and tips about PDF tools, file converters, image tools, audio tools, and productivity software."
        />

        <link
          rel="canonical"
          href="https://fileunivers.com/blog"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      <div className="blogHome">
        <div className="blogHero">
          <h1>FileUnivers Blog</h1>

          <p>
            Explore helpful tutorials, conversion guides, file management
            tips, and productivity resources for documents, images, audio,
            video, and more.
          </p>
        </div>

        <div className="blogGrid">
          {blogs.map((blog, index) => (
            <Link
              key={index}
              to={blog.slug}
              className="blogCard"
            >
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>

              <span>Read Article →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default BlogHome;