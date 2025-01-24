import { useState } from 'react';
import { toast } from 'sonner';
export default function useClipboard() {
  const [copied, setCopied] = useState(false);

  const handleItemCopy = (type, item, enableToast) => {
    setCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      setCopied(true);
      const notify = () => {
        toast.success(`${type} copied!`);
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
