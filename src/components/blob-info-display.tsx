'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Download, FileText, ImageIcon, Code, File } from 'lucide-react'
import type { BlobInfo } from '~/hooks/tip-dialog-store'

interface BlobInfoDisplayProps {
  blobInfo: BlobInfo
  onDownload?: () => void
}

export function BlobInfoDisplay({
  blobInfo,
  onDownload,
}: BlobInfoDisplayProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    )
  }

  const getContentIcon = (contentType: string) => {
    if (contentType.startsWith('image/'))
      return <ImageIcon className="h-4 w-4" />
    if (contentType.startsWith('text/') || contentType === 'application/json')
      return <FileText className="h-4 w-4" />
    if (contentType.includes('svg')) return <Code className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getContentTypeColor = (contentType: string) => {
    if (contentType.startsWith('image/')) return 'bg-green-100 text-green-800'
    if (contentType.startsWith('text/') || contentType === 'application/json')
      return 'bg-blue-100 text-blue-800'
    if (contentType.includes('svg')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getContentIcon(blobInfo.contentType)}
          Blob Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Blob ID
            </label>
            <p className="font-mono text-sm break-all">{blobInfo.id}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Status
            </label>
            <div className="flex items-center gap-2">
              <Badge
                variant={blobInfo.status === 'active' ? 'default' : 'secondary'}
              >
                {blobInfo.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Size
            </label>
            <p className="text-sm">{formatFileSize(blobInfo.size)}</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Content Type
            </label>
            <Badge className={getContentTypeColor(blobInfo.contentType)}>
              {blobInfo.contentType}
            </Badge>
          </div>
        </div>

        {blobInfo.isTextContent && blobInfo.contentPreview && (
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Content Preview
            </label>
            <div className="bg-muted mt-1 rounded-md p-3">
              <pre className="text-xs break-words whitespace-pre-wrap">
                {blobInfo.contentPreview}
              </pre>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Tip Balance
            </label>
            <p className="text-sm">{blobInfo.tipBalance} FROST</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Cost/Epoch
            </label>
            <p className="text-sm">{blobInfo.costPerEpoch} FROST</p>
          </div>
          <div>
            <label className="text-muted-foreground text-sm font-medium">
              Epochs Left
            </label>
            <p className="text-sm">{blobInfo.epochsLeft}</p>
          </div>
        </div>

        {onDownload && (
          <Button
            onClick={onDownload}
            className="w-full bg-transparent"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Blob
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
