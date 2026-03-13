'use client'

import { logout } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return (
    <Button variant="ghost" onClick={() => logout()}>
      Logout
    </Button>
  )
}
