/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { markdownToSafeHTML } from '@/lib/markdown-to-text';
import { Calendar, User, Clock } from 'lucide-react';
import { Suspense } from 'react';
import { Metadata } from 'next';

// Define proper types
type BlogPageProps = {
  params: Promise<{ slug: string }>
}

// Optimize fetch with proper caching
async function getBlogBySlug(slug: string) {
  const baseUrl = process.env.SITE_URL;
  const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
    cache: 'force-cache',
    next: { revalidate: 3600 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog')
  }
  
  return res.json()
}

// Extract common CSS classes to reduce bundle size
const cardStyles = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-slate-700/30"
const gradientBg = "absolute inset-0 rounded-3xl"
const iconContainer = "w-10 h-10 rounded-xl flex items-center justify-center"

// Lazy loaded iframe component for better performance
function LazyIframe({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-2xl"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}

// Generate metadata for better SEO and performance
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { blog } = await getBlogBySlug(resolvedParams.slug)
    
    if (!blog) {
      return {
        title: 'Blog Not Found',
      }
    }

    return {
      title: blog.title,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        type: 'article',
        publishedTime: blog.created_at,
        authors: [blog.written_by],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.description,
      },
    }
  } catch {
    return {
      title: 'Blog Not Found',
    }
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  try {
    const resolvedParams = await params; // Await the params Promise
    const { blog } = await getBlogBySlug(resolvedParams.slug)
    
    if (!blog) return notFound()
    
    const contentHtml = await markdownToSafeHTML(blog.content)

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
          {/* Enhanced Blog Header */}
          <div className={`${cardStyles} mb-8`}>
            <div className="relative">
              {/* Background decoration */}
              <div className={`${gradientBg} bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-900/10 dark:to-pink-900/10`}></div>
              
              <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  {blog.title}
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {blog.description}
                </p>
                
                {/* Enhanced Meta Information */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`${iconContainer} bg-gradient-to-r from-blue-500 to-indigo-600`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Written by</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{blog.written_by}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`${iconContainer} bg-gradient-to-r from-emerald-500 to-teal-600`}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Published</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(blog.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`${iconContainer} bg-gradient-to-r from-purple-500 to-pink-600`}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Reading time</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {Math.max(1, Math.ceil(blog.content.split(' ').length / 200))} min read
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className={`${cardStyles} mb-8`}>
            <div className="relative">
              <div className={`${gradientBg} bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-900/10 dark:to-indigo-900/10`}></div>
              
              <div className="relative z-10 max-w-none prose prose-lg dark:prose-invert">
                <div
                  className="prose-content [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-slate-800 [&_h1]:dark:text-slate-100 [&_h1]:mb-6 [&_h1]:mt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:dark:text-slate-100 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:border-l-4 [&_h2]:border-purple-500 [&_h2]:pl-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-slate-700 [&_h3]:dark:text-slate-200 [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:mb-6 [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_ol]:space-y-2 [&_li]:text-lg [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_li]:leading-relaxed [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:bg-purple-50 [&_blockquote]:dark:bg-purple-900/20 [&_blockquote]:rounded-r-lg [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-slate-100 [&_pre]:dark:bg-slate-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_a]:text-purple-600 [&_a]:dark:text-purple-400 [&_a]:hover:text-purple-800 [&_a]:dark:hover:text-purple-300 [&_a]:underline [&_strong]:font-semibold [&_strong]:text-slate-800 [&_strong]:dark:text-slate-200 [&_em]:italic [&_em]:text-slate-600 [&_em]:dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Video Section */}
          {blog.iframe_link && (
            <Suspense fallback={
              <div className={cardStyles}>
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                </div>
              </div>
            }>
              <div className={cardStyles}>
                <div className="relative">
                  <div className={`${gradientBg} bg-gradient-to-br from-red-500/5 to-pink-500/5 dark:from-red-900/10 dark:to-pink-900/10`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Related Video</h3>
                    </div>
                    
                    <LazyIframe src={blog.iframe_link} title="YouTube video player" />
                  </div>
                </div>
              </div>
            </Suspense>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    return notFound()
  }
}


