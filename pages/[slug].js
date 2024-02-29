import { getAllPosts, getPostBlocks } from '@/lib/notion';

import Comments from '@/components/Comments';
import Container from '@/components/Container';
import Post from '@/components/Post';
import { clientConfig } from '@/lib/server/config';
import { createHash } from 'crypto';
import { useConfig } from '@/lib/config';
import { useLocale } from '@/lib/locale';
import { useRouter } from 'next/router';

export default function BlogPost({ post, blockMap, emailHash }) {
  const router = useRouter();
  const BLOG = useConfig();
  const locale = useLocale();

  if (router.isFallback) return null;

  const fullWidth = post.fullWidth ?? false;

  // Function to find the first image URL starting with the specific pattern
  const findDynamicOgImage = (blocks) => {
    for (const block of Object.values(blocks)) {
      if (block.type === 'image' && block.image && block.image.url.startsWith("https://www.notion.so/image/https")) {
        return block.image.url;
      }
    }
    return "https://troovr.com/img/dz_og.png"; // Fallback image URL
  };

  const dynamicOgImage = findDynamicOgImage(blockMap);

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      type="article"
      fullWidth={fullWidth}
      dynamicOgImage={dynamicOgImage} // Pass the dynamic image URL to Container
    >
      <Post
        post={post}
        blockMap={blockMap}
        emailHash={emailHash}
        fullWidth={fullWidth}
      />

      {/* Back and Top buttons omitted for brevity */}

      <Comments frontMatter={post} />
    </Container>
  );
}

export async function getStaticPaths() {
  const posts = await getAllPosts({ includePages: true });
  return {
    paths: posts.map(row => `${clientConfig.path}/${row.slug}`),
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const posts = await getAllPosts({ includePages: true });
  const post = posts.find(t => t.slug === slug);

  if (!post) return { notFound: true };

  const blockMap = await getPostBlocks(post.id);
  const emailHash = createHash('md5').update(clientConfig.email).digest('hex').trim().toLowerCase();

  return {
    props: { post, blockMap, emailHash },
    revalidate: 1,
  };
}
