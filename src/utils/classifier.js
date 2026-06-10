export function classifyDocument(
  text
) {
  const lower =
    text.toLowerCase();

  if (
    lower.includes(
      "certificate"
    ) ||
    lower.includes(
      "certifies"
    )
  ) {
    return "Certificate";
  }

  if (
    lower.includes(
      "permanent account number"
    )
  ) {
    return "PAN Card";
  }

  if (
    lower.includes(
      "skills"
    ) &&
    lower.includes(
      "education"
    )
  ) {
    return "Resume";
  }

  return "Unknown";
}