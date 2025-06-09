import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

// import { auth } from '@/auth'
import { getFullUserInfo } from '@/app/actions/auth'
import { getChat, getMissingKeys } from '@/app/actions/chat'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { UserSession } from '@/lib/types'

interface ExtendedSession extends UserSession {
  id: string  // ensure it's required
}


export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  // const session = await auth()
  const session = await getFullUserInfo() as ExtendedSession;

  if (!session?.id) {
    return {}
  }

  const chat = await getChat(params.id, session.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  // const session = (await auth()) as Session
  const session = await getFullUserInfo() as ExtendedSession;
  const missingKeys = await getMissingKeys()

  if (!session?.id) {
    redirect(`/login?next=/dashboard/chat/${params.id}`)
  }

  const userId = session.id as string
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/dashboard/chat')
  }

  // if (chat?.userId !== session?.id) {
  //   notFound()
  // }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        session={session}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
