import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
// import { auth } from '@/lib/auth'
import { ExtendedSession } from '@/lib/types'
import { getMissingKeys } from '@/app/actions/chat';
import { getFullUserInfo } from '@/app/actions/auth';

export default async function IndexPage() {
  const id = nanoid()
  // const session = await auth()
  const session = (await getFullUserInfo()) as ExtendedSession;
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session as ExtendedSession} missingKeys={missingKeys} />
    </AI>
  )
}
