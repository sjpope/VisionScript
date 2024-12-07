// utils/Utility.js

export function sendLog(message) {
    fetch('http://localhost:5000/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    }).catch(console.error);
  }


  