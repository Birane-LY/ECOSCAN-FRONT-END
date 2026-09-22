import React from 'react'
import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import { StatusChip } from '@/components/ui/StatusChip'

export function FileSourceList({ files, onSelectFile }) {
  return (
    <div className="dc-list">
      {files.map((file) => (
        <button type="button" className="dc-row" key={file.id} onClick={() => onSelectFile(file.id)}>
          <span className="dc-file-icon">
            <FileSpreadsheet size={18} />
          </span>
          <span className="dc-file-name">
            <strong>{file.name}</strong>
            <small>
              {file.kind}, {file.rows ?? 0} lignes
            </small>
          </span>
          <StatusChip status={file.status} />
          <span className="dc-file-time">{file.time}</span>
          <ChevronRight size={16} />
        </button>
      ))}
    </div>
  )
}
