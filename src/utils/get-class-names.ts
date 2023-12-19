export function getClassNames(...classNames: unknown[]): string {
  const ArrayOfClassNames: string[] = [];
  for (const i of classNames) {
      if (typeof i === 'string') {
          if (!i.length || !i) continue;
          ArrayOfClassNames.push(i);
      }
  }
  return ArrayOfClassNames.join(' ');
}