// Listen for "push" events sent from your server through Web Push
self.addEventListener('push', (event) => {
  let data = {};

  // Try to parse the incoming payload as JSON (e.g. { title, body, url })
  try { 
      data = event.data ? event.data.json() : {}; 
    } catch (e) {
      // If parsing fails, just keep "data" as an empty object
        console.log(e)
  }

  // Title of the notification (fallback to a default)
  const title = data.title || 'Notice reminder!';

  // Options for how the notification should look
  const options = {
    body: data.body || '',                               // text under the title
    icon: data.icon || '/assets/icons/alert-icon.svg',   // main icon
    badge: data.badge || '/assets/icons/alert-icon.svg', // small monochrome badge (Android)
    data: { url: data.url || '/' },                      // store a URL for later (used on click)
    actions: data.actions || [],                         // buttons
  };

  // Show the notification. waitUntil() keeps the SW alive until it's displayed
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// Listen for when the user clicks the notification
self.addEventListener('notificationclick', (event) => {
  // Close the notification immediately
  event.notification.close();

  if (event.action === "snooze") {
    // 🕑 Your custom snooze logic
    console.log("User clicked Snooze");
  } else if (event.action === "dismiss") {
    console.log("User clicked Dismiss");
  } else {


  // Get the stored URL (fallback to site root)
  const url = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        // If a window/tab is already open, focus it
        for (const client of list) {
          if ('focus' in client) return client.focus();
        }
        // Otherwise open a brand new tab/window to the target URL
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
