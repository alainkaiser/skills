import { Menu } from '@base-ui/react/menu';

export function AccountMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="rounded-md border px-3 py-2">Account</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="origin-[var(--transform-origin)] rounded-md border bg-white p-1 shadow-lg">
            <Menu.Item className="data-[highlighted]:bg-slate-100">Profile</Menu.Item>
            <Menu.Item className="data-[highlighted]:bg-slate-100">Sign out</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
