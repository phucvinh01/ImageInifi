import MobieNav from '@/components/shared/MobieNav'
import SideBar from '@/components/shared/SideBar'
import { Toaster } from '@/components/ui/toaster'
import { Toast } from '@radix-ui/react-toast'
import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className='root'>
      <SideBar/>
      <MobieNav/>
        <div className='root-container'>
            <div className="wrapper">
                {children}
            </div>
        </div>
       <Toaster />
    </main>
  )
}

export default Layout