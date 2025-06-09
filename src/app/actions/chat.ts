'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type Chat } from '@/lib/types'
import { getFullUserInfo } from './auth'
import { kv } from '@vercel/kv'
import { ExtendedSession } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) return []

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, { rev: true })
    for (const chat of chats) {
      pipeline.hgetall(chat)
    }
    const results = await pipeline.exec()
    return results as Chat[]
  } catch (err) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)
  if (!chat || (userId && chat.userId !== userId)) return null
  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await getFullUserInfo() as ExtendedSession
  if (!session) return { error: 'Unauthorized' }

  const uid = String(await kv.hget(`chat:${id}`, 'userId'))
  if (uid !== session.id) return { error: 'Unauthorized' }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await getFullUserInfo() as ExtendedSession
  if (!session) return { error: 'Unauthorized' }

  const chats: string[] = await kv.zrange(`user:chat:${session.id}`, 0, -1)
  if (!chats.length) return redirect('/')

  const pipeline = kv.pipeline()
  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/dashboard/chat')
  return redirect('/dashboard/chat')
}

export async function saveChat(chat: Chat) {
  const session = await getFullUserInfo() as ExtendedSession
  if (!session) return

  try {
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, chat)
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    })
    await pipeline.exec()
  } catch (err) {
    console.log(err)
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}

export async function shareChat(id: string) {
  const session = await getFullUserInfo() as ExtendedSession
  if (!session) return { error: 'Unauthorized' }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)
  if (!chat || chat.userId !== session.id) return { error: 'Not found' }

  const sharePath = `/share/${chat.id}`

  await kv.hmset(`chat:${chat.id}`, {
    ...chat,
    sharePath
  })

  return {
    ...chat,
    sharePath
  }
}
