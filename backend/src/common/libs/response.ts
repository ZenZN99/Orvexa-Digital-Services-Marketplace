export function response(data: any, message: string | null = null) {
  return {
    message,
    data,
  };
}
