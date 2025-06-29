'use client'

import * as React from 'react'
import type { DialogProps } from '@radix-ui/react-dialog'
import { toast } from 'sonner'

import { shareChat } from '@/app/actions/chat' // ✅ Import directly
import type { Chat } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { IconSpinner } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, 'id' | 'title' | 'messages'>
}

export function ChatShareDialog({
  chat,
  ...props
}: ChatShareDialogProps) {
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 })
  const [isSharePending, startShareTransition] = React.useTransition()

  const handleCopyClick = async () => {
    const result = await shareChat(chat.id)

    if (!result || 'error' in result) {
      toast.error(result?.error ?? 'Unknown error')
      return
    }

    if (!result.sharePath) {
      toast.error('Could not copy share link to clipboard')
      return
    }

    const url = new URL(window.location.href)
    url.pathname = result.sharePath

    copyToClipboard(url.toString())
    toast.success('Share link copied to clipboard')
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share link to chat</DialogTitle>
          <DialogDescription>
            Anyone with the URL will be able to view the shared chat.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 space-y-1 text-sm border rounded-md">
          <div className="font-medium">{chat.title}</div>
          <div className="text-muted-foreground">
            {chat.messages.length} messages
          </div>
        </div>
        <DialogFooter className="items-center">
          <Button disabled={isSharePending} onClick={() => startShareTransition(handleCopyClick)}>
            {isSharePending ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                Copying...
              </>
            ) : (
              <>Copy link</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
