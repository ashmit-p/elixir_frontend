import { supabase } from '@/lib/supabase/client';

export async function getBlogSubmissionBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('blog_submissions') // Replace with your actual table name
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

// Optional: Get all blog submissions
export async function getAllBlogSubmissions() {
  try {
    const { data, error } = await supabase
      .from('blog_submissions')
      .select('*')
      .order('created_at', { ascending: false });

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

// Optional: Update submission status
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
