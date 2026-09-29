// Small helper: try the real backend first; if it's not running yet
// (fresh clone, no API configured), gracefully fall back to bundled
// mock data so the UI stays fully usable out of the box.
export async function withFallback(apiCall, mockValue, delay = 250) {
  try {
    return await apiCall()
  } catch (err) {
    await new Promise((r) => setTimeout(r, delay))
    return mockValue
  }
}
