import { useState } from 'react';
import { Link2, BookOpen, Tag, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LectureFormData {
  title: string;
  url: string;
  desc: string;
  tag: string;
}

interface LectureFormProps {
  onSubmit: (data: { title: string; url: string; desc: string | null; tag: string }) => Promise<void>;
  isSubmitting: boolean;
  onSuccess?: () => void;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function LectureForm({ onSubmit, isSubmitting, onSuccess }: LectureFormProps) {
  const [form, setForm] = useState<LectureFormData>({
    title: '',
    url: '',
    desc: '',
    tag: '',
  });
  const [errors, setErrors] = useState<Partial<LectureFormData>>({});
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<LectureFormData> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.url.trim()) {
      newErrors.url = 'Video URL is required.';
    } else if (!isValidUrl(form.url.trim())) {
      newErrors.url = 'Please enter a valid URL (e.g. https://...).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof LectureFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: form.title.trim(),
      url: form.url.trim(),
      desc: form.desc.trim() || null,
      tag: form.tag.trim(),
    });

    setSuccess(true);
    setForm({ title: '', url: '', desc: '', tag: '' });
    setTimeout(() => {
      setSuccess(false);
      onSuccess?.();
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-serif font-semibold text-lg text-foreground">Lecture Saved!</h3>
          <p className="text-sm text-muted-foreground mt-1">Your lecture link has been added to your vault.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="flex items-center gap-1.5 text-sm font-medium">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
          Lecture Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Chapter 5 – Thermodynamics"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-1.5">
        <Label htmlFor="url" className="flex items-center gap-1.5 text-sm font-medium">
          <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
          Video URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://drive.google.com/file/d/..."
          value={form.url}
          onChange={(e) => handleChange('url', e.target.value)}
          className={errors.url ? 'border-destructive focus-visible:ring-destructive' : ''}
          disabled={isSubmitting}
        />
        {errors.url && (
          <p className="text-xs text-destructive">{errors.url}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Paste the link to your recorded lecture (Google Drive, YouTube, Zoom, etc.)
        </p>
      </div>

      {/* Tag / Category */}
      <div className="space-y-1.5">
        <Label htmlFor="tag" className="flex items-center gap-1.5 text-sm font-medium">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          Category / Subject
        </Label>
        <Input
          id="tag"
          placeholder="e.g. Physics, Math, History…"
          value={form.tag}
          onChange={(e) => handleChange('tag', e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="desc" className="flex items-center gap-1.5 text-sm font-medium">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          Notes / Reminder
        </Label>
        <Textarea
          id="desc"
          placeholder="Add any notes or reminders about this lecture…"
          value={form.desc}
          onChange={(e) => handleChange('desc', e.target.value)}
          rows={3}
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            Save to Vault
          </>
        )}
      </Button>
    </form>
  );
}
