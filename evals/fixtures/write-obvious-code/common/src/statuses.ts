export function activeLabels(values: Array<{ active: boolean; label: string }>): string[] {
  return values.filter((value) => value.active).map((value) => value.label);
}
