// very important for listening to elements are not in th DOM
// elements in the drawer/sidebar
export function observeElementAndAddEventListener(
  elementId: string,
  eventType: string,
  eventHandler: (event: Event) => void
) {
  const addEventListenerToElement = () => {
    const element = document.getElementById(elementId);
    if (element) {
      //  console.log(`Element ${elementId} found, adding event listener`);
      element.addEventListener(eventType, eventHandler);
      // optional I am disconnecting observer. this should be used when an element will never be used again
      //  observer.disconnect(); // Stop observing once the element is found
    } else {
      //  console.log(`Element ${elementId} not found yet`);
    }
  };

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver(addEventListenerToElement);

  // Start observing the document with the configured callback
  observer.observe(document, { childList: true, subtree: true });

  // Call the function once to check if the element is already in the DOM
  addEventListenerToElement();
}

// Function to handle file upload
export const handleFileUpload = (file: File) => {
  if (file) {
    console.log(`File uploaded: ${file.name}`);
    // Process the file here (e.g., read its content, send to server, etc.)
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result;
      console.log(contents);
      // Further processing can be done here
    };
    reader.readAsText(file);
  } else {
    console.error("No file selected");
  }
}