import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from '@/components/mode-toggle'

export default function Home(){
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      {/* <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold tracking-tight">Company Name</h1>
        </div>
        <ModeToggle />
      </header> */}
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 max-w-md p-8 bg-white rounded-md shadow-lg'>
          <div className='flex flex-col items-center space-y-3'>
            <h1 className='text-2xl font-semibold tracking-tight'>Admin Login</h1>
            <p className='text-sm text-muted-foreground'>
              Enter Username and Password
              </p>
          </div>
          <div className='grid gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor="username">Username</Label>
              <Input
               id="username"
               type="username"
               placeholder="Username"
               />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder='**********' />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center spax-x-4 '>
              <Input id="remember" type="checkbox" className='w-4 h-4' />
              <div className='ml-2'>
              <Label htmlFor="remember" className='text-sm text-muted-foreground hover:text-muted-foreground cursor-pointer'>
                Remember me
                </Label>
              </div>
            </div>
          <a 
          href="#"
          className='text-sm font-medium text-primary-foreground hover:underline'>
            Forgot password?
          </a>
          </div>
          <Button className='w-full'>Login</Button>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-muted-foreground'></span>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>
          <Button variant='outline' className='w-full'>
            Google
          </Button>
          <div className='flex justify-center'>
            <span className='text-sm text-muted-foreground'>
              Don&apos;t have an account?{ ' ' }
              <Link href="/signup" className='text-secondary-foreground hover:underline'>
                Sign up
                </Link>
            </span>
          </div>
        </div>
    </div>
  )
  
}