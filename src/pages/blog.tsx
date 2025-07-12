import { useEffect, useState } from "react";
import { sanityClient } from "../sanity";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface Post {
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage?: { asset: { url: string } };
  body?: any;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    sanityClient
      .fetch<Post[]>(
        `*[_type == "post"] | order(publishedAt desc){
          title,
          slug,
          publishedAt,
          mainImage { asset->{url} },
          body
        }`
      )
      .then((data) => setPosts(data))
      .catch(console.error);
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  // Get plain text excerpt from body
  const getExcerpt = (body: any) => {
    if (!body) return "";
    const text = body
      .map((block: any) =>
        typeof block.children === "object"
          ? block.children.map((child: any) => child.text).join(" ")
          : ""
      )
      .join(" ");
    return text.split(" ").slice(0, 28).join(" ") + "...";
  };

  return (
    <HelmetProvider>
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 bg-white text-neutral-900">
        <Helmet>
          <title>Campus travel tips, safety & stories | Uniride</title>
          <meta
            name="description"
            content="Explore smart student travel stories, safety tips, feature updates and real Uniride journeys across Nigeria."
          />
        </Helmet>

        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-left text-black">
            Stories, Safety Tips & Campus Travel Culture
          </h1>
        </div>

        {/* 🔥 Featured Post */}
        {featuredPost && (
          <Link
            to={`/blog/${featuredPost.slug.current}`}
            className="group block md:flex gap-8 items-start mb-20 bg-gray-50 p-6 rounded-2xl"
          >
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
              {featuredPost.mainImage?.asset?.url && (
                <img
                  src={featuredPost.mainImage.asset.url}
                  alt={featuredPost.title || "Blog image"}
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-300 ease-in-out"
                />
              )}
            </div>
            <div className="w-full md:w-1/2 mt-6 md:mt-0">
              <p className="text-sm text-gray-400">
                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-black mt-2 group-hover:underline">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed text-base">
                {getExcerpt(featuredPost.body)}
              </p>
            </div>
          </Link>
        )}

        {/* 🗂 Grid of Other Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherPosts.map((post, i) => (
            <Link
              to={`/blog/${post.slug.current}`}
              key={i}
              className="group rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md border border-gray-100 transition"
            >
              {post.mainImage?.asset?.url && (
                <img
                  src={post.mainImage.asset.url}
                  alt={post.title || "Blog image"}
                  className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-in-out"
                />
              )}
              <div className="p-5">
                <p className="text-sm text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="text-lg font-semibold text-black mt-2 mb-2 group-hover:underline">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {getExcerpt(post.body)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Blog;
