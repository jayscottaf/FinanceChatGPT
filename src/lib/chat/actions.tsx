import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import { BotCard, BotMessage } from '@/components/chatui/message'

import { z } from 'zod'
import {
  nanoid, sleep
} from '@/lib/utils'
import { saveChat } from '@/app/actions/chat'
import { SpinnerMessage, UserMessage } from '@/components/chatui/message'
import { Chat, type ExtendedSession } from '@/lib/types'
import { getFullUserInfo, getAccessToken } from '@/app/actions/auth'
import CategoryTransactionsSkeleton from '@/components/chatui/category-transaction-skeleton'
import CategoryTransactions from '@/components/chatui/category-transaction'
import RecurringTransactionsSkeleton from '@/components/chatui/recurring-transactions-skeleton'
import RecurringTransactions from '@/components/chatui/recurring-transactions'
import AccountCardsSkeleton from '@/components/chatui/account-cards-skeleton'
import AccountCards from '@/components/chatui/account-cards'
import AccountDetailSkeleton from '@/components/chatui/account-detail-skeleton'
import AccountDetail from '@/components/chatui/account-detail'
import { getChartInfo, getDashboard, getUserInfo } from '@/server/user'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

async function submitUserMessage(content: string) {
  'use server'

  const accessToken = await getAccessToken();
  const filterDate = {
    startDate: new Date().getFullYear() + '-01-01',
    endDate: new Date().toISOString().split('T')[0]
  };

  // const res = await fetch(`/api/v1/user/charts`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`
  //   },
  //   body: JSON.stringify({ filterDate }),
  //   cache: 'force-cache'
  // });
  // const chatData = await res.json();
  const chatData = await getChartInfo({ filterDate });

  // const res2 = await fetch(`/api/v1/user/dashboard`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`
  //   },
  //   cache: 'force-cache'
  // });

  // const chatData2 = await res2.json();
  const chatData2 = await getDashboard();

  // const res3 = await fetch(`/api/v1/user`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`
  //   },
  //   cache: 'force-cache'
  // });

  // const chatData3 = await res3.json();
  const chatData3 = await getUserInfo();

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

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-4o',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
        You are personal finance assistant. This is Chart data which represents transactions of my accounts.
        User Chart Data: ${JSON.stringify(chatData)},
        FilterDate of User Chart Data: ${JSON.stringify(filterDate)},
        Current Dashboard Metrics: ${JSON.stringify(chatData2)},
        Bank accounts information from plaid.com: ${JSON.stringify(chatData3)}

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
- "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.

If you want to show transactions by category, call \`show_spend_categories\`.
If you want to show recurring transactions, call \`show_recurring_spend\`.
If you want to show connected accounts, call \`show_accounts\`.
If the user wants to sell stock, or complete another impossible task, respond that you are a demo and cannot do that.

Besides that, you can also chat with users and do some calculations if needed.`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    functions: {
      showSpendCategories: {
        description: 'Get the chartDataByMonth and filterDate from given User Chart Data',
        parameters: z.object({
          chartDataByMonth: z.array(z.object({
            name: z.string().describe('The name of merchant'),
            value: z.number().describe('The value of total spend'),
            count: z.number().describe('The count of transactions'),
          })),
          filterDate: z.object({
            startDate: z.string().describe('The start date of filterDate'),
            endDate: z.string().describe('The end date of filterDate')
          })
        }),
        render: async function* ({ chartDataByMonth, filterDate }) {
          yield (
            <BotCard>
              <CategoryTransactionsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
             ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name:'showSpendCategories',
                content: JSON.stringify({
                  chartDataByMonth,
                  filterDate
                })
              }
            ]
          })

          return (
            <BotCard>
              <CategoryTransactions
                props={{
                  chartDataByMonth,
                  filterDate
                }}
              />
            </BotCard>
          )
        }
      },
      showRecurringSpend: {
        description: 'Get the barListData from given User Chart Data',
        parameters: z.object({
          barListData: z.array(z.object({
            name: z.string().describe('The name of merchant'),
            value: z.number().describe('The value of total spend'),
            count: z.number().describe('The count of transactions'),
          })),
        }),
        render: async function* ({ barListData }) {
          yield (
            <BotCard>
              <RecurringTransactionsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
             ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name:'showRecurringSpend',
                content: JSON.stringify(
                  barListData
                )
              }
            ]
          })

          return (
            <BotCard>
              <RecurringTransactions props={barListData} />
            </BotCard>
          )
        }
      },
      showAccounts: {
        description: 'Get information of connected accounts',
        parameters: z.object({
          accounts: z.array(z.object({
            name: z.string().describe('The name of bank name'),
            type: z.string().describe('The type of account'),
            balance: z.number().describe('The current balance of account'),
            available: z.number().describe('The available balance of account'),
          })),
        }),
        render: async function* ({ accounts }) {
          yield (
            <BotCard>
              <AccountCardsSkeleton />
            </BotCard>
          )

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
             ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name:'showAccounts',
                content: JSON.stringify(
                  accounts
                )
              }
            ]
          });

          return (
            <BotCard>
              <AccountCards props={accounts} />
            </BotCard>
          )
        }
      },
      showAccountDetail: {
        description: 'Get detailed information of given account',
        parameters: z.object({
          account: z.object({
            id: z.string().describe('The id of account'),
            bank: z.string().describe('The name of bank name'),
            name: z.string().describe('The name of account'),
            type: z.string().describe('The type of account'),
            balance: z.number().describe('The current balance of account'),
            transactions: z.array(z.object({
              name: z.string().describe('The name of transaction'),
              value: z.number().describe('The amount of transaction'),
              date: z.string().describe('The date of transaction')
            }))
          }),
        }),
        render: async function* ({ account }) {
          yield (
            <BotCard>
              <AccountDetailSkeleton />
            </BotCard>
          )

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
             ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name:'showAccountDetail',
                content: JSON.stringify(
                  account
                )
              }
            ]
          });

          return (
            <BotCard>
              <AccountDetail props={account} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
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

      const session = (await getFullUserInfo()) as ExtendedSession

    if (session) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    // const session = await auth()
      const session = (await getFullUserInfo()) as ExtendedSession;

    if (session) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.id as string
      const path = `/dashboard/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat);
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'showRecurringSpend' ? (
            <BotCard>
              <RecurringTransactions props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showSpendCategories' ? (
            <BotCard>
              <CategoryTransactions props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showAccounts' ? (
            <BotCard>
              <AccountCards props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showAccountDetail' ? (
            <BotCard>
              <AccountDetail props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
