import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
export default function NavSidebar({
    children
  }) {
  return (
    <>
        <Navbar />
          <div className="mcw">
            <div className="cv">
            <div>
            <div className="inbox">
                <div className="inbox-sb">
                
                </div>
                <div className="inbox-bx container-fluid">
                    <div className="row">
                        {children}
                    </div>
                </div>
            </div>
            </div>
            </div>
        </div>
    </>
  )
}
