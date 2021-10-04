const csrfTag = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfTag ? csrfTag.getAttribute('content') : null;

export { csrfToken };
