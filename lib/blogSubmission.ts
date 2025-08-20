import { supabase } from './supabase/client';
import TurndownService from 'turndown';
import slugify from 'slugify';

export type BlogSubmission = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  submitted_at: string;
  username: string;
  slug: string;
  description: string;
  status?: 'pending' | 'approved' | 'rejected';
};

const turndownService = new TurndownService();

export async function getBlogSubmissionBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('blog_submissions')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching blog submission:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogSubmissionBySlug:', error);
    return null;
  }
}

export async function getPendingBlogSubmissions() {
  const { data, error } = await supabase
    .from('blog_submissions')
    .select(`
      id,
      title,
      content,
      user_id,
      submitted_at,
      username,
      slug,
      description
    `)
    .eq('status', 'pending');

  if (error) throw error;

  return data;
}

export async function getAllBlogSubmissions() {
  try {
    const { data, error } = await supabase
      .from('blog_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog submissions:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in getAllBlogSubmissions:', error);
    return [];
  }
}

export async function updateBlogSubmissionStatus({
  id,
  approved,
  reviewerId,
}: {
  id: string;
  approved: boolean;
  reviewerId: string;
}) {
  console.log('🔍 Starting blog submission update...');

  if (!approved) {
    console.log('🟥 Submission is being rejected...');

    const { error } = await supabase
      .from('blog_submissions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Error rejecting submission:', error);
      throw error;
    }

    console.log('✅ Rejected successfully.');
    return { success: true, message: 'Submission rejected' };
  }

  console.log('🟩 Submission is being approved...');

  const { data: submission, error: fetchError } = await supabase
    .from('blog_submissions')
    .select(`title, content, user_id, username, slug, description`)
    .eq('id', id)
    .single();

  if (fetchError || !submission) {
    console.error('❌ Failed to fetch submission:', fetchError);
    throw fetchError;
  }

  console.log('✅ Submission fetched:', submission);

  const markdownContent = turndownService.turndown(submission.content);
  const finalSlug = submission.slug || slugify(submission.title, { lower: true, strict: true });

  const { error: insertError } = await supabase.from('blogs').insert({
    title: submission.title,
    slug: finalSlug,
    content: markdownContent,
    written_by: submission.username,
    created_at: new Date().toISOString(),
    description: submission.description,
  });

  if (insertError) {
    console.error('❌ Failed to insert blog:', insertError);
    throw insertError;
  }

  console.log('✅ Blog post created successfully');

  // Update submission status to approved
  const { error: updateError } = await supabase
    .from('blog_submissions')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq('id', id);

  if (updateError) {
    console.error('❌ Failed to update submission status:', updateError);
    // Don't throw here as the blog was already created
    console.warn('⚠️ Blog was created but submission status update failed');
  }

  console.log('✅ Submission approved and blog published successfully');
  return { success: true, message: 'Blog approved and published', slug: finalSlug };
}

// Optional: Update submission status (legacy function)
export async function updateSubmissionStatus(slug: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from('blog_submissions')
      .update({ status })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating submission status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSubmissionStatus:', error);
    return null;
  }
}
