
export const ACTION_TYPE = {
    WAIT: 1,
    ATTACK: 2,
    GUARD: 3,
    HEAL: 4,
    SKILL: 5,
    POISON: 6
} as const;

export type ActionType = typeof ACTION_TYPE[keyof typeof ACTION_TYPE];