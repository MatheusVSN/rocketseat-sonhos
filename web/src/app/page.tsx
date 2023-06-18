import EmptyMemmories from '@/components/EmptyMemmories'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

dayjs.locale(ptBr)

interface Memmory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemmories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memmories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memmmories: Memmory[] = response.data

  if (memmmories.length === 0) {
    return <EmptyMemmories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memmmories.map((memmory) => {
        return (
          <div key={memmory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memmory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>
            <Image
              src={memmory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />

            <p className="text-lg leading-relaxed text-gray-100">
              {memmory.excerpt}
            </p>

            <Link
              href={`/memmories/${memmory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler Mais <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
