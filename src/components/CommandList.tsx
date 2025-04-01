import { Badge } from "@/components/ui/badge"
import type { Command } from "./types"

interface CommandListProps {
  commands: Command[]
  maxDisplay?: number
}

export function CommandList({ commands, maxDisplay = 3 }: CommandListProps) {
  if (!commands || commands.length === 0) {
    return <span className="text-muted-foreground text-xs">Sin comandos</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {commands.slice(0, maxDisplay).map((command) => (
        <Badge key={command.id} variant="secondary" className="text-xs">
          {command.syntax || command.name}
        </Badge>
      ))}
      {commands.length > maxDisplay && (
        <Badge variant="outline" className="text-xs">
          +{commands.length - maxDisplay} más
        </Badge>
      )}
    </div>
  )
}

