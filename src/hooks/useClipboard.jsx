import { useState } from 'react';
import { toast } from 'react-toastify';
export default function useClipboard() {
  const [copied, setCopied] = useState(false);

  const handleItemCopy = (type, item) => {
    setCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      const notify = () => {
        toast.success(`${type} copied!`, {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };
      setCopied(true);
      notify();
    });
  };

  return [copied, handleItemCopy];
}
