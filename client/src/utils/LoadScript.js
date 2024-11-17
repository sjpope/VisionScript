// utils/loadScript.js

const LoadScript = (src, id) => {
    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (document.getElementById(id)) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.id = id;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Script load error for ${src}`));
      
      document.head.appendChild(script);
    });
  };
  