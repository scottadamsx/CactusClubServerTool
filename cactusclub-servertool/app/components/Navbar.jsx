import React from 'react'
import Link from "next/link"

const Navbar = () => {
  return (
    <div>
        <Link href="/">Home</Link>
        <Link href="/order">Order</Link>
        <Link href="/myOrders">MyOrders</Link>
    </div>
  )
}

export default Navbar