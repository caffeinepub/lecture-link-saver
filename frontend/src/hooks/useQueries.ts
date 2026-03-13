import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Recording, RecordingId } from '../backend';

export const RECORDINGS_KEY = ['recordings'];

export function useGetAllRecordings() {
  const { actor, isFetching } = useActor();

  return useQuery<Recording[]>({
    queryKey: RECORDINGS_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecordings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRecording() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      url,
      desc,
      tag,
    }: {
      title: string;
      url: string;
      desc: string | null;
      tag: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRecording(title, url, desc, tag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDINGS_KEY });
    },
  });
}

export function useRemoveRecording() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: RecordingId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeRecording(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDINGS_KEY });
    },
  });
}

export function useUpdateRecording() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      url,
      desc,
      tag,
    }: {
      id: RecordingId;
      title: string;
      url: string;
      desc: string | null;
      tag: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateRecording(id, title, url, desc, tag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECORDINGS_KEY });
    },
  });
}
