// src/pages/Blog.tsx
import { useEffect, useState } from 'react'
import { sanityClient } from '../sanity'
import { Link } from 'react-router-dom'

interface Post {
  title: string
  slug: { current: string }
  publishedAt: string
  mainImage?: { asset: { url: string } }
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    sanityClient.fetch<Post[]>(`*[_type == "post"]{title, slug, mainImage, publishedAt}`)
      .then(data => setPosts(data))
      .catch(console.error)
  }, [])

  return (
    <div>
      <h1>Uniride Blog</h1>
      {posts.map((post, i) => (
        <div key={i}>
          <Link to={`/blog/${post.slug.current}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
          {post.mainImage?.asset?.url && (
            <img src={post.mainImage.asset.url} alt={post.title} width="200" />
          )}
        </div>
      ))}
    </div>
  )
}

export default Blog
