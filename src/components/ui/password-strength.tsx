import * as React from "react"
import { cn } from "../../lib/utils"

export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  
  return (
    <div className={cn("mt-2", className)}>
      <div className="flex justify-between mb-1">
        <span className="text-xs">Force du mot de passe</span>
        <span className="text-xs font-medium">
          {strength === 0 && "Très faible"}
          {strength === 1 && "Faible"}
          {strength === 2 && "Moyen"}
          {strength === 3 && "Fort"}
          {strength === 4 && "Très fort"}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300",
            strength === 0 && "w-1/5 bg-red-500",
            strength === 1 && "w-2/5 bg-orange-500",
            strength === 2 && "w-3/5 bg-yellow-500",
            strength === 3 && "w-4/5 bg-lime-500",
            strength === 4 && "w-full bg-green-500",
          )}
        />
      </div>
      {password && (
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <li className={cn("flex items-center gap-1", password.length >= 8 ? "text-green-500" : "text-gray-500")}>
            <CheckIcon className={password.length >= 8 ? "text-green-500" : "text-gray-300"} />
            Minimum 8 caractères
          </li>
          <li className={cn("flex items-center gap-1", /[A-Z]/.test(password) ? "text-green-500" : "text-gray-500")}>
            <CheckIcon className={/[A-Z]/.test(password) ? "text-green-500" : "text-gray-300"} />
            Une majuscule
          </li>
          <li className={cn("flex items-center gap-1", /[0-9]/.test(password) ? "text-green-500" : "text-gray-500")}>
            <CheckIcon className={/[0-9]/.test(password) ? "text-green-500" : "text-gray-300"} />
            Un chiffre
          </li>
          <li className={cn("flex items-center gap-1", /[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-500")}>
            <CheckIcon className={/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-300"} />
            Un caractère spécial
          </li>
        </ul>
      )}
    </div>
  )
}

function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Contains number
  if (/[0-9]/.test(password)) strength += 1;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
