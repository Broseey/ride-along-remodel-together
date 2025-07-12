import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { sanityClient } from "../../sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  MessageCircle,
  Twitter,
  Instagram,
  Linkedin,
  Share2,
  Link2,
} from "lucide-react";

interface Post {
  title: string;
  slug: { current: string };
  body: any;
  publishedAt: string;
  mainImage?: { asset: { url: string } };
  author?: {
    name: string;
    image?: { asset: { url: string } };
    bio?: any;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: { asset: { url: string } };
  };
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img
        src={value?.asset?.url}
        alt="Post content"
        className="my-6 rounded-xl"
      />
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-6 text-black">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-5 text-black">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold my-4 text-black">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-medium my-3 text-black">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">
        {children}
      </blockquote>
    ),
    justify: ({ children }) => (
      <p className="my-4 leading-7 text-gray-800 text-justify">{children}</p>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-7 text-gray-800">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 text-gray-800 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 text-gray-800 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline underline-offset-2 hover:text-gray-800"
      >
        {children}
      </a>
    ),
  },
};

const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  const calculateReadingTime = (body: any): string => {
    const plainText = body
      ?.map((block: any) =>
        typeof block.children === "object"
          ? block.children.map((child: any) => child.text).join(" ")
          : ""
      )
      .join(" ");
    const wordCount = plainText.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  useEffect(() => {
    sanityClient
      .fetch<Post>(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          slug,
          body,
          publishedAt,
          mainImage { asset->{url} },
          author->{name, bio, image { asset->{url} }},
          seo { metaTitle, metaDescription, ogImage { asset->{url} }}
        }`,
        { slug }
      )
      .then((data) => {
        setPost(data);
        sanityClient
          .fetch<Post[]>(
            `*[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3] {
              title,
              slug,
              publishedAt,
              mainImage { asset->{url} }
            }`,
            { slug }
          )
          .then(setRelatedPosts);
      })
      .catch(console.error);
  }, [slug]);

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  const shareUrl = `https://uniride.ng/blog/${post.slug.current}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} | Uniride Blog</title>
        <meta
          name="description"
          content={
            post.seo?.metaDescription ||
            `Read ${post.title} on the Uniride Blog. Student mobility tips, updates, and more.`
          }
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        <meta
          property="og:description"
          content={
            post.seo?.metaDescription ||
            `Discover: ${post.title} on the Uniride Blog.`
          }
        />
        <meta
          property="og:url"
          content={`https://uniride.ng/blog/${post.slug.current}`}
        />
        {(post.seo?.ogImage?.asset?.url || post.mainImage?.asset?.url) && (
          <meta
            property="og:image"
            content={
              post.seo?.ogImage?.asset?.url || post.mainImage?.asset?.url
            }
          />
        )}
      </Helmet>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-0 py-16 text-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-3">
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-black">
              <MessageCircle className="w-4 h-4 text-green-600" />
              {calculateReadingTime(post.body)}
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-black">{post.title}</h1>

        {post.mainImage?.asset?.url && (
          <img
            src={post.mainImage.asset.url}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl mb-10"
          />
        )}

        <div className="flex gap-4 items-center text-sm mb-6">
          <span className="text-gray-600">Share:</span>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600 text-[#5e5e5e]"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black text-[#5e5e5e]"
          >
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
              <title>X social</title>
              <path
                d="M14.094 10.317 22.28 1H20.34l-7.11 8.088L7.557 1H1.01l8.583 12.231L1.01 23H2.95l7.503-8.543L16.446 23h6.546M3.649 2.432h2.978L20.34 21.639h-2.98"
                fill="currentColor"
              ></path>
            </svg>
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 text-[#5e5e5e]"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={`https://www.instagram.com/`} // Static placeholder
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-600 text-[#5e5e5e]"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://uniride.ng/blog/${post.slug.current}`
              );
            }}
            className="flex items-center text-sm gap-1 hover:text-black text-[#5e5e5e]"
          >
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
              <title>Link</title>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.5 1c1.7 0 3.3.6 4.6 1.9 2.5 2.5 2.5 6.7 0 9.2l-3 3c-1.3 1.3-2.9 1.9-4.6 1.9-1.7 0-3.3-.6-4.6-1.9l-1-1L10 12l1 1c.7.6 1.5 1 2.5 1s1.8-.3 2.5-1l1.5-1.5L19 10c1.4-1.4 1.4-3.6 0-5-.7-.6-1.5-1-2.5-1s-1.8.3-2.5 1l-.5.6c-.9-.4-2-.6-3-.6h-.7l2.1-2.1C13.2 1.6 14.8 1 16.5 1ZM10 19l.5-.6c.9.4 2 .6 3 .6h.7l-2.1 2.1C10.8 22.4 9.2 23 7.5 23c-1.7 0-3.3-.6-4.6-1.9-2.5-2.5-2.5-6.7 0-9.2l3-3C7.2 7.6 8.8 7 10.5 7c1.7 0 3.3.6 4.6 1.9l1 1L14 12l-1-1c-.7-.6-1.5-1-2.5-1s-1.8.3-2.5 1l-1.5 1.5L5 14c-1.4 1.4-1.4 3.6 0 5 .7.6 1.5 1 2.5 1s1.8-.3 2.5-1Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>

        <div className="prose prose-lg max-w-none prose-img:rounded-xl prose-a:text-gray-800 prose-h1:text-black prose-h2:text-black prose-p:text-gray-700">
          <PortableText value={post.body} components={components} />
        </div>

        {post.author?.name && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {post.author?.image?.asset?.url && (
                <img
                  src={post.author.image.asset.url}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-black">
                  Written by {post.author.name}
                </p>
                {post.author?.bio && (
                  <div className="text-sm text-gray-600 mt-1">
                    <PortableText
                      value={post.author.bio}
                      components={components}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-black">
              More from the Blog
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((item, i) => (
                <Link
                  key={i}
                  to={`/blog/${item.slug.current}`}
                  className="group border border-gray-100 rounded-xl p-4 hover:shadow-md transition bg-white"
                >
                  {item.mainImage?.asset?.url && (
                    <img
                      src={item.mainImage.asset.url}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-sm text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                  <h3 className="text-lg font-semibold text-black group-hover:underline">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </HelmetProvider>
  );
};

export default SinglePost;
