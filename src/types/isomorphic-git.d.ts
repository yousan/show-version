declare module 'isomorphic-git' {
  export interface GitObject {
    oid: string;
    type: string;
    object: Buffer;
  }

  export interface CommitObject {
    message: string;
    tree: string;
    parent: string[];
    author: {
      name: string;
      email: string;
      timestamp: number;
      timezoneOffset: number;
    };
    committer: {
      name: string;
      email: string;
      timestamp: number;
      timezoneOffset: number;
    };
  }

  export interface TreeObject {
    entries: Array<{
      mode: string;
      path: string;
      oid: string;
      type: string;
    }>;
  }

  export function init(options: { fs: any; dir: string }): Promise<void>;
  export function add(options: { fs: any; dir: string; filepath: string }): Promise<void>;
  export function commit(options: { fs: any; dir: string; message: string; author: { name: string; email: string } }): Promise<string>;
  export function push(options: { fs: any; dir: string; remote: string; ref: string; onAuth?: () => Promise<{ username: string; password: string }> }): Promise<void>;
} 