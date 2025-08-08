import NextLink from 'next/link'
import { subtitle, title } from '@/components/primitives'

export default function PostCard() {
  return (
    <article className="bg-gray-100 p-4 rounded-xl mt-6">
      <NextLink href='#' className={title({ size: 'xs' })}>Implement charts</NextLink>
      <h5 className='line-clamp-2 mt-2'>descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption descrioption </h5>
      <div className='flex items-center mt-5'>
        <h2 className={subtitle() + ' !max-w-[200px]'}>by John Doe</h2>
        <NextLink href='#'>Comments 3</NextLink>
      </div>
    </article>
  )
}