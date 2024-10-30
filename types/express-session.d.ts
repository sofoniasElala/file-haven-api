import 'express-session';
/**
 * Naming this file express-session.d.ts causes imports from "express-session"
 * to reference this file and not the node_modules package. (from typescript-node-starter project)
 */
declare module 'express-session' {
  export interface SessionData {
    messages?: string[];
  }
}