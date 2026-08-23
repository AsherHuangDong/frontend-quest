export interface BossViewModel {
  name: string;
  phase: string;
  status: string;
}

export function toBossViewModel(input: BossViewModel): BossViewModel {
  return input;
}
