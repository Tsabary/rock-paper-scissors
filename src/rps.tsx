import type { Agent } from "./Agent";
import type { AgentType } from "./AgenType";
import { BALL_COLORS, BALL_RADIUS, BALL_SPEED } from "./config";




export const COLORS: Record<AgentType, string> = BALL_COLORS;

export function countByType(agents: Agent[]): Record<AgentType, number> {
  return agents.reduce((acc, agent) => {
    acc[agent.type]++;
    return acc;
  }, { rock: 0, paper: 0, scissors: 0 } as Record<AgentType, number>);
}

export function createAgents(
  countPerType: number,
  width: number,
  height: number
): Agent[] {
  const types: AgentType[] = ["rock", "paper", "scissors"];
  const agents: Agent[] = [];

  types.forEach((type) => {
    for (let i = 0; i < countPerType; i++) {
      const angle = Math.random() * Math.PI * 2;

      agents.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.cos(angle) * BALL_SPEED,
        dy: Math.sin(angle) * BALL_SPEED,
        radius: BALL_RADIUS,
        type,
        color: COLORS[type],
      });
    }
  });

  return agents;
}

export function beats(a: AgentType, b: AgentType): boolean {
  return (
    (a === "rock" && b === "scissors") ||
    (a === "scissors" && b === "paper") ||
    (a === "paper" && b === "rock")
  );
}

export function moveAgent(agent: Agent, width: number, height: number) {
  agent.x += agent.dx;
  agent.y += agent.dy;

  // Left wall
  if (agent.x < agent.radius) {
    agent.x = agent.radius; // <-- force inside
    agent.dx *= -1;
  }

  // Right wall
  if (agent.x > width - agent.radius) {
    agent.x = width - agent.radius; // <-- force inside
    agent.dx *= -1;
  }

  // Top wall
  if (agent.y < agent.radius) {
    agent.y = agent.radius; // <-- force inside
    agent.dy *= -1;
  }

  // Bottom wall
  if (agent.y > height - agent.radius) {
    agent.y = height - agent.radius; // <-- force inside
    agent.dy *= -1;
  }
}

export function agentsCollide(a: Agent, b: Agent): boolean {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return dist < a.radius + b.radius;
}

export function resolveCollision(a: Agent, b: Agent) {
  // Rock-Paper-Scissors result
  if (beats(a.type, b.type)) {
    b.type = a.type;
    b.color = a.color;
  } else if (beats(b.type, a.type)) {
    a.type = b.type;
    a.color = b.color;
  }

  // === SEPARATE THEM ===
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);

  // How much overlap?
  const overlap = a.radius + b.radius - dist;

  // Normalize
  const nx = dx / dist;
  const ny = dy / dist;

  // Push each ball away by half the overlap
  a.x -= nx * (overlap / 2);
  a.y -= ny * (overlap / 2);

  b.x += nx * (overlap / 2);
  b.y += ny * (overlap / 2);

  // === Perfect bounce: swap velocities ===
  const tempDx = a.dx;
  const tempDy = a.dy;

  a.dx = b.dx;
  a.dy = b.dy;

  b.dx = tempDx;
  b.dy = tempDy;
}
export function allSameType(agents: Agent[]): boolean {
  return agents.every((a) => a.type === agents[0].type);
}
