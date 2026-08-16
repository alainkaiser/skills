import { Dialog } from '@base-ui/react/dialog';

export function HelpDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <a href="/help">Open help</a>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/40" />
        <Dialog.Popup className="fixed left-1/2 top-1/2">Help content</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
