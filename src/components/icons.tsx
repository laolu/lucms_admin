import { LucideProps } from "lucide-react"
import { Loader2, LogIn } from "lucide-react"

export const Icons = {
  spinner: Loader2,
  logo: LogIn,
}

export type Icon = keyof typeof Icons 