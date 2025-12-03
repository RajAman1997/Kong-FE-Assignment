export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `API Error (${response.status}): ${errorText || response.statusText}`
      );
    }

    try {
      return (await response.json()) as T;
    } catch (jsonError) {
      throw new Error('Failed to parse server response as JSON.');
    }
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}
