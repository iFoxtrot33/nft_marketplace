'use client'

import { Button } from '@/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/Dialog'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading = false }: LogoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-2rem)] bg-[var(--color-background-black-2)] border-2 border-[var(--color-purple-light)] bottom-0 top-auto left-1/2 translate-x-[-50%] rounded-t-lg rounded-b-none md:top-[50%] md:translate-y-[-50%] md:rounded-lg md:bottom-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            Are you sure you want to log in?
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={onClose} className="flex-1 text-background-black" disabled={isLoading}>
            Continue shopping
          </Button>

          <Button variant="danger" onClick={onConfirm} disabled={isLoading} className="flex-1 text-white">
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
