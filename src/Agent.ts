import type { AgentType } from "./AgenType";

export interface Agent {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  type: AgentType;
  color: string;
  spawnCooldown?: number; // Frames remaining before this ball can trigger a spawn
}
