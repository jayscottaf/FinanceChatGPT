import { Sidebar } from '@/components/sidebar'

// import { auth } from '@/lib/auth'
import { ChatHistory } from '@/components/chat-history'
import { getFullUserInfo } from '@/app/actions/auth'
import type { ExtendedSession } from '@/lib/types'
import { SidebarMobile } from './sidebar-mobile';

export async function SidebarDesktop() {
  // const session = await auth()
  const session = (await getFullUserInfo()) as ExtendedSession;

  if (!session?.id) {
    return null
  }

  return (
    <>
      <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
        {/* @ts-ignore */}
        <ChatHistory userId={session.id} />
      </Sidebar>
      <SidebarMobile>
        <ChatHistory userId={session.id} />
      </SidebarMobile>
    </>
  )
}
