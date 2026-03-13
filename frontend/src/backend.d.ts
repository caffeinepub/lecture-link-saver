import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type RecordingId = bigint;
export type Time = bigint;
export interface Recording {
    id: RecordingId;
    tag: string;
    url: string;
    title: string;
    created: Time;
    desc?: string;
}
export interface backendInterface {
    addRecording(title: string, url: string, desc: string | null, tag: string): Promise<RecordingId>;
    getAllRecordings(): Promise<Array<Recording>>;
    getRecording(id: RecordingId): Promise<Recording>;
    getRecordingsByTag(tag: string): Promise<Array<Recording>>;
    removeRecording(id: RecordingId): Promise<void>;
    updateRecording(id: RecordingId, title: string, url: string, desc: string | null, tag: string): Promise<void>;
}
