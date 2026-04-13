const ts = () => new Date().toISOString();

export const log   = (...args) => console.log(`[${ts()}]`, ...args);
export const warn  = (...args) => console.warn(`[${ts()}] WARN`, ...args);
export const error = (...args) => console.error(`[${ts()}] ERROR`, ...args);
