// Utility: convert a base64 public VAPID key into a Uint8Array
// (the Push API requires the key in this format)
const urlBase64ToUint8Array = (base64String) => {
  // Add '=' padding if needed (base64 strings must be multiple of 4 chars)
  const padding = '='.repeat((4 - base64String.length % 4) % 4);

  // Replace URL-safe base64 chars with standard base64 chars
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  // Decode base64 string into binary data
  const raw = atob(base64);

  // Create a typed array to hold the binary values
  const output = new Uint8Array(raw.length);

  // Copy each char code into the typed array
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }

  // Return usable Uint8Array
  return output;
};


// Ensure the user has a valid push subscription
export async function ensurePushSubscription({ publicKey, apiBase }) {
  // Exit early if the browser does not support Service Workers or Push
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  // Ask the user for permission to show notifications
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return null; // Stop if user denied

  // Get the active service worker registration
  const reg = await navigator.serviceWorker.ready;

  // Try to retrieve an existing push subscription
  let sub = await reg.pushManager.getSubscription();

  // If no subscription exists, create a new one
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true, // ensures notifications must always be shown
      applicationServerKey: urlBase64ToUint8Array(publicKey), // VAPID public key
    });
  }

  // Send the subscription object to backend to save in DB
  await fetch(`${apiBase}/push/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'), // identify the user
    },
    body: JSON.stringify(sub), // subscription includes endpoint + crypto keys
  });

  // Return subscription so caller can use it if needed
  return sub;
}
