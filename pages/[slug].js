import { getAllPosts, getPostBlocks } from '@/lib/notion'

import Comments from '@/components/Comments'
import Container from '@/components/Container'
import Head from 'next/head' // Import Head for setting meta tags
import Post from '@/components/Post'
// Import necessary dependencies
import { clientConfig } from '@/lib/server/config'
import cn from 'classnames'
import { createHash } from 'crypto'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'

export default function BlogPost ({ post, blockMap, emailHash }) {
  const router = useRouter()
  const BLOG = useConfig()
  const locale = useLocale()

  if (router.isFallback) return null

  const fullWidth = post.fullWidth ?? false

  // Determine the Open Graph image URL
  const ogImageUrl = post.ogImage ? post.ogImage : "YOUR_DEFAULT_IMAGE_URL"; // Fallback to a default image URL if post.ogImage is not available

  return (
    <>
      <Head>
        <title>{post.title} - {BLOG.title}</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:url" content={`${BLOG.link}/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImageUrl} /> {/* Dynamically set the image URL */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.summary} />
        <meta name="twitter:image" content={ogImageUrl} /> {/* Dynamically set the image URL */}
        {/* Additional meta tags as needed */}
      </Head>
      <Container layout="blog" fullWidth={fullWidth}>
        <Post post={post} blockMap={blockMap} emailHash={emailHash} fullWidth={fullWidth} />

        {/* Back and Top buttons */}
        <div
          className={cn(
            'px-4 flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5',
            fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
          )}
        >
          <a>
            <button
              onClick={() => router.push(BLOG.path || '/')}
              className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
            >
              ← {locale.POST.BACK}
            </button>
          </a>
          <a>
            <button
              onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })}
              className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
            >
              ↑ {locale.POST.TOP}
            </button>
          </a>
        </div>

        <Comments frontMatter={post} />
      </Container>
    </>
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  return {
    paths: posts.map(row => `${clientConfig.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true })
  const post = posts.find(t => t.slug === slug)

  if (!post) return { notFound: true }

  const blockMap = await getPostBlocks(post.id)
  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { post, blockMap, emailHash },
    revalidate: 1
  }
}
