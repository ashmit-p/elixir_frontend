/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getBlogSubmissionBySlug } from '@/lib/blogSubmission';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const submission = await getBlogSubmissionBySlug(resolvedParams.slug);

  if (!submission) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-6 max-w-4xl mx-auto pt-24">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-slate-700/30">
          {/* Header Section */}
          <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {submission.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                Submitted by: {submission.username}
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                Status: {submission.status || 'pending'}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          {submission.description && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Description:</h3>
              <p className="text-slate-600 dark:text-slate-300">{submission.description}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="prose-content [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-800 [&_h1]:dark:text-slate-100 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:dark:text-slate-100 [&_h2]:mb-3 [&_h2]:border-l-4 [&_h2]:border-purple-500 [&_h2]:pl-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-700 [&_h3]:dark:text-slate-200 [&_h3]:mb-3 [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-purple-50 [&_blockquote]:dark:bg-purple-900/20 [&_blockquote]:rounded-r [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-slate-100 [&_pre]:dark:bg-slate-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_a]:text-purple-600 [&_a]:dark:text-purple-400 [&_a]:hover:text-purple-800 [&_a]:dark:hover:text-purple-300"
              dangerouslySetInnerHTML={{ __html: submission.content }} 
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              Approve & Publish
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              Reject
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
