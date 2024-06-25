import * as LR from '@uploadcare/blocks';
import React, { useEffect, useRef, useState } from 'react';

LR.registerBlocks(LR);

interface FileEntry {
  uuid: string;
  cdnUrl: string;
  fileInfo: {
    originalFilename: string;
    size: number;
  };
  status: string;
}

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const [file, setFile] = useState<FileEntry>();

  const ctxProviderRef = useRef<any | null>(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    ctxProvider.addEventListener('file-url-changed', (e: CustomEvent) => {console.log(e.detail);onChange(e.detail?.cdnUrl + ((endpoint === "messageFile")?("#" + e.detail?.name):""));});
    ctxProvider.addEventListener('file-upload-failed', (error: Error) => {console.log(error);});
    ctxProvider.addEventListener('file-removed', (e: CustomEvent) => {onChange("");});
    return () => {
      ctxProvider.removeEventListener('file-url-changed', (e: CustomEvent) => {console.log(e.detail);onChange(e.detail?.cdnUrl + ((endpoint === "messageFile")?("#" + e.detail?.name):""));});
      ctxProvider.removeEventListener('file-upload-failed', (error: Error) => {console.log(error);});
      ctxProvider.removeEventListener('file-removed', (e: CustomEvent) => {onChange("");});
    };
  }, [setFile]);

  return (
    <div>        
      <lr-config
      ctx-name="my-uploader"
      pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
      maxLocalFileSizeBytes={10000000}
      multiple={false}
      imgOnly={endpoint === "serverImage"}
      ></lr-config>
      <lr-file-uploader-minimal
      css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-minimal.min.css"
      ctx-name="my-uploader"
      class="my-config"
      >
      </lr-file-uploader-minimal>
      <lr-upload-ctx-provider
        ctx-name="my-uploader"
        ref={ctxProviderRef}
      ></lr-upload-ctx-provider>
    </div> 
  );
}