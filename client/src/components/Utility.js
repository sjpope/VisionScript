// utils/Utility.js

function sendLog(message) {
    fetch('http://localhost:5000/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }).catch(console.error);
  }


  