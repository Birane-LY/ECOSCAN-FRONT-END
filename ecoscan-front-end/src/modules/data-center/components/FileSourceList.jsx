import React from 'react'
import { ChevronRight, FileSpreadsheet } from 'lucide-react'
import { StatusChip } from '@/components/ui'

export function FileSourceList({ files, onSelectFile }) {
  return (
    <div className="file-list">
      {files.map((file) => (
        <button
          className="file-row"
          key={file.id}
          onClick={() => onSelectFile(file.id)}
        >
          <span className="file-icon">
            <FileSpreadsheet size={17} />
          </span>
          <span className="file-name">
            <strong>{file.name}</strong>
            <small>
              {file.kind} · {file.rows} lignes
            </small>
          </span>
          <StatusChip status={file.status} />
          <span className="file-time">{file.time}</span>
          <ChevronRight size={15} />
        </button>
      ))}
    </div>
  )
}