export function showToast(message: string) {
  const toastElement = document.createElement('div');
  toastElement.className = 'fixed left-1/2 transform -translate-x-1/2 bottom-24 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm shadow-lg';
  toastElement.textContent = message;
  
  document.body.appendChild(toastElement);
  
  setTimeout(() => {
    document.body.removeChild(toastElement);
  }, 1700);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}