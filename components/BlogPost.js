import FormattedDate from "@/components/FormattedDate";
import Link from "next/link";
import { useConfig } from "@/lib/config";

const BlogPost = ({ post, blockMap }) => {
  const BLOG = useConfig();

  // Example function to find the first image URL
  // This assumes you pass blockMap as a prop to BlogPost, which would require adjustments in your page component
  const findFirstImage = (blocks) => {
    // This is a placeholder function. You'll need to implement logic based on your actual data structure
    // For demonstration purposes, let's assume it returns the first image URL or null if no image is found
    return blocks ? "URL_of_the_first_image_found_in_blocks" : null;
  };

  const firstImageUrl = findFirstImage(blockMap); // You'll need to pass blockMap to BlogPost for this to work

  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <article key={post.id} className="mb-6 md:mb-8">
        <header className="flex flex-col justify-between md:flex-row md:items-baseline">
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
          <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
            <FormattedDate date={post.date} />
          </time>
        </header>
        <main>
          {firstImageUrl && (
            <img src={firstImageUrl} alt="Post image" className="post-image" />
          )}
          <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
            {post.summary}
          </p>
        </main>
      </article>
    </Link>
  );
};

export default BlogPost;
