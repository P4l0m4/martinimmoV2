export function stringToSlug(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]+/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}
