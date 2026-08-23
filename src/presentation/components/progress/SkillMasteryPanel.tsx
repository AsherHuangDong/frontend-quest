export function SkillMasteryPanel({ skills }: { skills: unknown }) {
  return <section>Skills: {Object.keys(skills as object).length}</section>;
}
