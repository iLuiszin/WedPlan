import type { Document, Types } from 'mongoose';

export type MongooseDocument<T> = Document<Types.ObjectId> & T;

export type SerializedDocument<T> = Omit<T, '_id' | 'createdAt' | 'updatedAt'> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export const serializeDocument = <T>(doc: MongooseDocument<T>): SerializedDocument<T> => {
  return JSON.parse(JSON.stringify(doc.toObject())) as SerializedDocument<T>;
};

export const serializeDocuments = <T>(docs: MongooseDocument<T>[]): SerializedDocument<T>[] => {
  return docs.map(serializeDocument);
};
