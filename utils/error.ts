export function toErrorMap(err: any) {
  const errorMap: Record<string, string> = {}
  for (const issue of err.data.data.issues) {
    errorMap[issue.path.join(', ')] = issue.message
  }
  return errorMap
}
