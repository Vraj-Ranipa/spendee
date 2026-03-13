'use client'

import { useActionState, useState, useEffect } from 'react'
import Image from "next/image"
import { signup } from '@/actions/auth'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Save, Check, X, Eye, EyeOff } from "lucide-react"

// ... imports

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, isPending] = useActionState(signup, undefined)
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordCriteria, setPasswordCriteria] = useState({
      length: false,
      number: false,
      special: false
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    setPasswordCriteria({
        length: password.length >= 8,
        number: /[0-9]/.test(password),
        special: /[^a-zA-Z0-9]/.test(password) // Simplified special char check
    })
  }, [password])

  useEffect(() => {
    if (confirmPassword) {
        setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean)
  const isFormValid = isPasswordValid && passwordsMatch && password && confirmPassword




  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:p-0 md:grid-cols-2">
          <form action={action} className="p-6 md:p-6 lg:p-8">
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-full bg-white p-1 mb-2 overflow-hidden">
                       <Image
                           src="/spendee_logo.png" 
                           alt="Spendee Logo" 
                          width={40} 
                          height={40} 
                          className="object-contain" 
                          priority
                      />
                  </div>

                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for Spendee
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input id="name" name="name" type="text" placeholder="Enter your username" required />
                {state?.errors?.name && (
                  <p className="text-red-500 text-sm">{state.errors.name}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                {state?.errors?.email && (
                   <p className="text-red-500 text-sm">{state.errors.email}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                    <Input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setIsTouched(true)
                        }}
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {state?.errors?.password && (
                   <p className="text-red-500 text-sm">{state.errors.password}</p>
                )}
                {/* Client-side feedback */}
                {isTouched && (
                    <div className="text-xs space-y-1 mt-1 text-muted-foreground">
                        <div className={cn("flex items-center gap-1", passwordCriteria.length ? "text-green-600" : "")}>
                            {passwordCriteria.length ? <Check className="size-3"/> : <div className="size-3 rounded-full border" />}
                            At least 8 characters
                        </div>
                        <div className={cn("flex items-center gap-1", passwordCriteria.number ? "text-green-600" : "")}>
                            {passwordCriteria.number ? <Check className="size-3"/> : <div className="size-3 rounded-full border" />}
                            At least one number
                        </div>
                        <div className={cn("flex items-center gap-1", passwordCriteria.special ? "text-green-600" : "")}>
                            {passwordCriteria.special ? <Check className="size-3"/> : <div className="size-3 rounded-full border" />}
                            At least one special character
                        </div>
                    </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <div className="relative">
                    <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        required 
                        placeholder="Confirm your password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                {!passwordsMatch && confirmPassword && (
                   <p className="text-red-500 text-sm flex items-center gap-1 mt-1"><X className="size-3"/> Passwords do not match</p>
                )}
                {state?.errors?.confirmPassword && (
                   <p className="text-red-500 text-sm">{state.errors.confirmPassword}</p>
                )}
              </Field>
              
              <Field>
                <Button type="submit" disabled={isPending || !isFormValid}>
                  {isPending ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Field>
              <div className="text-center text-sm">
                Already have an account? <a href="/login" className="underline underline-offset-4">Log in</a>
              </div>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/40 via-primary/20 to-background flex items-center justify-center text-muted-foreground p-10">
              <div className="text-center space-y-8">
                <div className="relative inline-block group">
                  <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative">
                    <Image
                      src="/spendee_logo_black.png"
                      alt="Spendee Logo"
                      width={320}
                      height={320}
                      className="object-contain mx-auto mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    Join Spendee
                  </h3>
                  <p className="text-base text-white/90 max-w-sm mx-auto leading-relaxed font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    Create an account to start managing your finances and tracking expenses today with <span className="text-white font-bold">Spendee</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

