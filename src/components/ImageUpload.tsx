import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export const ImageUpload = ({ value, onChange }: Props) => {
  const [preview, setPreview] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => { setPreview(''); onChange(''); };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Upload preview" className="h-40 w-auto rounded-lg object-cover" />
          <Button variant="destructive" size="icon" className="absolute -right-2 -top-2 h-6 w-6" onClick={clear}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <div className="text-center">
            <Upload className="mx-auto mb-2 h-8 w-8" />
            <span className="text-sm">Click to upload image</span>
          </div>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
};
