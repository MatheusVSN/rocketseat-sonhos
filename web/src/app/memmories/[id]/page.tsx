import { api } from '@/lib/api'
import { ChevronLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

export default async function MemmoriesPage({
  params,
}: {
  params: { id: string }
}) {
  const token = cookies().get('token')?.value

  const response = await api.get(`/memmories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memmory = response.data

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>

      <Image
        src={memmory.coverUrl}
        alt=""
        width={592}
        height={280}
        className="aspect-video w-full rounded-lg object-cover"
      />

      <p className="text-lg leading-relaxed text-gray-100">{memmory.content}</p>
    </div>
  )
}
