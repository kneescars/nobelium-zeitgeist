import Footer from '@/components/Footer'
import Head from 'next/head'
import Header from '@/components/Header'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useConfig } from '@/lib/config'

const Container = ({ children, layout, fullWidth, ...customMeta }) => {
  const BLOG = useConfig()

  const url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link
  const meta = {
    title: BLOG.title,
    type: 'website',
    ...customMeta
  }

  // URL of your static image
  const staticImageUrl = "https://troovr.com/img/dz_og.png";

  return (
    <div>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta charSet="UTF-8" />
        {/* Other meta tags... */}
        <meta name="description" content={meta.description} />
        <meta property="og:locale" content={BLOG.lang} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.slug ? `${url}/${meta.slug}` : url} />

        {/* Updated og:image meta tag */}
        <meta property="og:image" content={staticImageUrl} />

        <meta property="og:type" content={meta.type} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:title" content={meta.title} />

        {/* Updated twitter:image meta tag */}
        <meta name="twitter:image" content={staticImageUrl} />

        {meta.type === 'article' && (
          <>
            <meta property="article:published_time" content={meta.date} />
            <meta property="article:author" content={BLOG.author} />
          </>
        )}
      </Head>
      <div className={`wrapper ${BLOG.font === 'serif' ? 'font-serif' : 'font-sans'}`}>
        <Header navBarTitle={layout === 'blog' ? meta.title : null} fullWidth={fullWidth} />
        <main className={cn('flex-grow transition-all', layout !== 'blog' && ['self-center px-4', fullWidth ? 'md:px-24' : 'w-full max-w-2xl'])}>
          {children}
        </main>
        <Footer fullWidth={fullWidth} />
      </div>
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
