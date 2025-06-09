'use server'

import {
  createAI,
  getMutableAIState,
  getAIState
} from 'ai/rsc'
import OpenAI from 'openai'
import { BotCard, BotMessage, UserMessage } from '@/components/chatui/message'
import { nanoid } from '@/lib/utils'
import { saveChat } from '@/app/actions/chat'
import { Chat, type ExtendedSession } from '@/lib/types'
import { getFullUserInfo } from '@/app/actions/auth'
import CategoryTransactions from '@/components/chatui/category-transaction'
import RecurringTransactions from '@/components/chatui/recurring-transactions'
import AccountCards from '@/components/chatui/account-cards'
import AccountDetail from '@/components/chatui/account-detail'
import { getChartInfo, getDashboard, getUserInfo } from '@/server/user'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

async function submitUserMessage(content: string) {
  'use server'

  const filterDate = {
    startDate: new Date().getFullYear() + '-01-01',
    endDate: new Date().toISOString().split('T')[0]
  }

  const chatData = await getChartInfo({ filterDate })
  const chatData2 = await getDashboard()
  const chatData3 = await getUserInfo()

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  const ui = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a personal finance assistant. Here's the chart data, dashboard metrics, and account info:

Chart Data: ${JSON.stringify(chatData)}
Filter Date: ${JSON.stringify(filterDate)}
Dashboard: ${JSON.stringify(chatData2)}
Accounts: ${JSON.stringify(chatData3)}

Respond helpfully based on the data.`
      },
      ...aiState.get().messages.map(({ role, content }) => ({
        role: role as 'user' | 'assistant' | 'system',
        content
      }))
    ],
    stream: false
  })

  const finalText = ui.choices?.[0]?.message?.content ?? ''

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'assistant',
        content: finalText
      }
    ]
  })

  return {
    id: nanoid(),
    display: <BotMessage content={finalText} />
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await getFullUserInfo() as ExtendedSession
    if (!session) return

    const aiState = getAIState() as Chat
    if (!aiState) return

    return await getUIStateFromAIState(aiState)
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await getFullUserInfo() as ExtendedSession
    if (!session) return

    const { chatId, messages } = state
    const createdAt = new Date()
    const userId = session.id
    const path = `/dashboard/chat/${chatId}`
    const title = messages[0]?.content?.slice(0, 100) ?? 'Chat'

    const chat: Chat = {
      id: chatId,
      title,
      userId,
      createdAt,
      messages,
      path
    }

    await saveChat(chat)
  }
})

export const getUIStateFromAIState = async (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function'
          ? renderFunctionOutput(message)
          : message.role === 'user'
            ? <UserMessage>{message.content}</UserMessage>
            : <BotMessage content={message.content} />
    }))
}

function renderFunctionOutput(message: Message) {
  try {
    const data = JSON.parse(message.content)
    switch (message.name) {
      case 'showSpendCategories':
        return <BotCard><CategoryTransactions props={data} /></BotCard>
      case 'showRecurringSpend':
        return <BotCard><RecurringTransactions props={data} /></BotCard>
      case 'showAccounts':
        return <BotCard><AccountCards props={data} /></BotCard>
      case 'showAccountDetail':
        return <BotCard><AccountDetail props={data} /></BotCard>
      default:
        return null
    }
  } catch {
    return <BotMessage content="⚠️ Failed to render function output." />
  }
}
