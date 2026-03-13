import { useState } from 'react';
import { ExternalLink, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Recording } from '../backend';

interface LectureCardProps {
  recording: Recording;
  onDelete: (id: bigint) => Promise<void>;
  isDeleting?: boolean;
}

const TAG_COLORS: Record<string, string> = {
  math: 'bg-blue-100 text-blue-800 border-blue-200',
  science: 'bg-green-100 text-green-800 border-green-200',
  history: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  english: 'bg-purple-100 text-purple-800 border-purple-200',
  physics: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  chemistry: 'bg-orange-100 text-orange-800 border-orange-200',
  biology: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  computer: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

function getTagColor(tag: string): string {
  const lower = tag.toLowerCase();
  for (const [key, cls] of Object.entries(TAG_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  // Hash-based fallback for unknown tags
  const colors = [
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-violet-100 text-violet-800 border-violet-200',
    'bg-sky-100 text-sky-800 border-sky-200',
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) % colors.length;
  return colors[hash];
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function LectureCard({ recording, onDelete, isDeleting }: LectureCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [localDeleting, setLocalDeleting] = useState(false);

  const handleDelete = async () => {
    setLocalDeleting(true);
    try {
      await onDelete(recording.id);
      setDeleteOpen(false);
    } finally {
      setLocalDeleting(false);
    }
  };

  const tagColor = recording.tag ? getTagColor(recording.tag) : '';

  return (
    <Card className="group border border-border shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-serif font-semibold text-base text-foreground leading-snug mb-2 line-clamp-2">
              {recording.title}
            </h3>

            {/* Tag badge */}
            {recording.tag && (
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tagColor}`}
                >
                  {recording.tag}
                </span>
              </div>
            )}

            {/* Notes preview */}
            {recording.desc && (
              <div className="flex items-start gap-1.5 mb-3">
                <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {recording.desc}
                </p>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {formatDate(recording.created)}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={localDeleting || isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Lecture?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>"{recording.title}"</strong>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={localDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={localDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {localDeleting ? 'Deleting…' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              size="sm"
              className="gap-1.5 text-xs h-8 px-3"
              onClick={() => window.open(recording.url, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Video
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
