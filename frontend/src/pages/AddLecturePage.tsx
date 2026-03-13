import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LectureForm } from '../components/LectureForm';
import { useAddRecording } from '../hooks/useQueries';
import { toast } from 'sonner';

export function AddLecturePage() {
  const navigate = useNavigate();
  const addMutation = useAddRecording();

  const handleSubmit = async (data: {
    title: string;
    url: string;
    desc: string | null;
    tag: string;
  }) => {
    try {
      await addMutation.mutateAsync(data);
      toast.success('Lecture saved to your vault!');
    } catch (err) {
      toast.error('Failed to save lecture. Please try again.');
      throw err;
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/' })}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Lectures
      </Button>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Save a Lecture Link
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Add a recorded lecture link to your vault so you can find and watch it later.
        </p>
      </div>

      {/* Form card */}
      <Card className="border border-border shadow-card bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-base font-medium text-foreground">
            Lecture Details
          </CardTitle>
          <CardDescription className="text-xs">
            Fields marked with <span className="text-destructive">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LectureForm
            onSubmit={handleSubmit}
            isSubmitting={addMutation.isPending}
            onSuccess={() => navigate({ to: '/' })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
