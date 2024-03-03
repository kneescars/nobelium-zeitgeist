// Container.js adjustments
import Footer from '@/components/Footer'
import Head from 'next/head'
import Header from '@/components/Header'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { useConfig } from '@/lib/config'

const Container = ({ children, layout, fullWidth }) => {
  const BLOG = useConfig()

  return (
    <div>
      <Head>
        <title>{BLOG.title}</title>
        <meta name="robots" content="follow, index" />
        <meta charSet="UTF-8" />
        {/* Other general meta tags can remain */}
      </Head>
      <div className={`wrapper ${BLOG.font === 'serif' ? 'font-serif' : 'font-sans'}`}>
        <Header navBarTitle={layout === 'blog' ? BLOG.title : null} fullWidth={fullWidth} />
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
