import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { sanityClient } from '../../sanity'
import { PortableText } from '@portabletext/react'

interface Post {
  title: string
  slug: { current: string }
  body: any
  publishedAt: string
  mainImage?: { asset: { url: string } }
}

const SinglePost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    sanityClient.fetch<Post>(
      `*[_type == "post" && slug.current == $slug][0]{
        title, slug, body, publishedAt, mainImage { asset->{url} }
      }`,
      { slug }
    ).then(setPost).catch(console.error)
  }, [slug])

  if (!post) return <p>Loading...</p>

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
      {post.mainImage?.asset?.url && (
        <img src={post.mainImage.asset.url} alt={post.title} width="400" />
      )}
      <PortableText value={post.body} />
    </article>
  )
}

export default SinglePost
