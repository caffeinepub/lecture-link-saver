import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { PlusCircle, BookOpen, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LectureCard } from '../components/LectureCard';
import { LectureFilters } from '../components/LectureFilters';
import { useGetAllRecordings, useRemoveRecording } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Recording } from '../backend';

function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-5 bg-card shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function LectureListPage() {
  const { data: recordings = [], isLoading, isError } = useGetAllRecordings();
  const removeMutation = useRemoveRecording();

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Collect unique tags
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    recordings.forEach((r: Recording) => {
      if (r.tag && r.tag.trim()) tagSet.add(r.tag.trim());
    });
    return Array.from(tagSet).sort();
  }, [recordings]);

  // Filter recordings
  const filtered = useMemo(() => {
    let result = [...recordings];
    if (selectedTag !== 'all') {
      result = result.filter((r) => r.tag === selectedTag);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.desc && r.desc.toLowerCase().includes(q))
      );
    }
    // Sort newest first
    return result.sort((a, b) => Number(b.created - a.created));
  }, [recordings, search, selectedTag]);

  const handleDelete = async (id: bigint) => {
    try {
      await removeMutation.mutateAsync(id);
      toast.success('Lecture removed from vault.');
    } catch {
      toast.error('Failed to delete lecture. Please try again.');
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="font-serif text-2xl font-semibold text-foreground">My Lectures</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Loading your vault…'
              : `${recordings.length} lecture${recordings.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        <Link to="/add">
          <Button className="gap-2 flex-shrink-0">
            <PlusCircle className="w-4 h-4" />
            Add Lecture
          </Button>
        </Link>
      </div>

      {/* Filters */}
      {!isLoading && recordings.length > 0 && (
        <div className="mb-6">
          <LectureFilters
            search={search}
            onSearchChange={setSearch}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            tags={tags}
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-foreground">Failed to load lectures</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There was a problem connecting to the backend. Please refresh the page.
            </p>
          </div>
        </div>
      ) : recordings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-lg text-foreground">Your vault is empty</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Save your first recorded lecture link to get started. You can add notes and categories to stay organized.
            </p>
          </div>
          <Link to="/add">
            <Button className="gap-2 mt-2">
              <PlusCircle className="w-4 h-4" />
              Add Your First Lecture
            </Button>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-serif font-medium text-foreground">No results found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filtered.map((recording) => (
            <LectureCard
              key={String(recording.id)}
              recording={recording}
              onDelete={handleDelete}
              isDeleting={removeMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
