import { useState } from 'react';
import { toast } from 'react-toastify';
export default function useClipboard() {
  const [copied, setCopied] = useState(false);

  const handleItemCopy = (type, item, enableToast) => {
    setCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      setCopied(true);
      const notify = () => {
        toast.success(`${type} copied!`, {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      if (enableToast) {
        notify();
      }
    });
  };

  return [copied, handleItemCopy];
}
