import { StorageError } from '@supabase/storage-js'
interface SupabaseStorageError extends StorageError {
    statusCode?: string;
    error?: string;

}

export {SupabaseStorageError}