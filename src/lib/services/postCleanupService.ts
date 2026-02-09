import { deleteFolder } from '@/lib/minio/minio-client';

export class PostCleanupService {
  static async cleanupPost(postId: string): Promise<void> {
    try {
      await deleteFolder(postId);
      console.log(`Successfully deleted Minio folder for post: ${postId}`);
    } catch (error) {
      console.error(`Failed to clean up post ${postId} from Minio:`, error);
      throw new Error(`Failed to clean up post resources: ${error}`);
    }
  }

  static async safeCleanupPost(postId: string): Promise<boolean> {
    try {
      await this.cleanupPost(postId);
      return true;
    } catch (error) {
      console.error(`Safe cleanup failed for post ${postId}:`, error);
      return false;
    }
  }
}
