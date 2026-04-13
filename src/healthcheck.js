import { createSocket } from 'dgram';
import { log } from './logger.js';

function sdNotify(state) {
  const socketPath = process.env.NOTIFY_SOCKET;
  if (!socketPath) return;

  const msg = Buffer.from(state);
  const socket = createSocket('unix_dgram');

  // Abstract sockets start with '@', replace with null byte
  const path = socketPath.startsWith('@')
    ? '\0' + socketPath.slice(1)
    : socketPath;

  socket.send(msg, 0, msg.length, path, () => socket.close());
}

export function startWatchdog() {
  const usec = parseInt(process.env.WATCHDOG_USEC ?? '0', 10);
  if (!usec) return; // watchdog not configured in service file

  const intervalMs = usec / 1000 / 2; // ping at half the watchdog interval
  setInterval(() => sdNotify('WATCHDOG=1'), intervalMs);
  log(`Systemd watchdog active — pinging every ${intervalMs}ms`);
}
