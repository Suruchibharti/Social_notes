const KEY = "notely_engagement";

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getEngagement(postId) {
  const store = readStore();
  return store[postId] || { liked: false, likes: 0, comments: [] };
}

export function toggleLike(postId) {
  const store = readStore();
  const current = getEngagement(postId);
  const next = {
    ...current,
    liked: !current.liked,
    likes: Math.max(0, current.likes + (current.liked ? -1 : 1))
  };
  store[postId] = next;
  writeStore(store);
  return next;
}

export function addComment(postId, comment) {
  const store = readStore();
  const current = getEngagement(postId);
  const next = {
    ...current,
    comments: [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...comment }, ...current.comments]
  };
  store[postId] = next;
  writeStore(store);
  return next;
}
