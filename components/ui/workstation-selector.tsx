"use client"

import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Slot } from "@radix-ui/react-slot"
import {
  type ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
} from "react"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandSeparator
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface WorkstationSelectorContextType {
  value: string | undefined
  onValueChange?: (value: string) => void
  open: boolean
  onOpenChange?: (open: boolean) => void
  width: number
  setWidth?: (width: number) => void
}

const WorkstationSelectorContext = createContext<WorkstationSelectorContextType>({
  value: undefined,
  onValueChange: undefined,
  open: false,
  onOpenChange: undefined,
  width: 200,
  setWidth: undefined,
})

export const useWorkstationSelector = () => useContext(WorkstationSelectorContext)

export type WorkstationSelectorProps = ComponentProps<typeof Popover> & {
  defaultValue?: string
  value?: string | undefined
  onValueChange?: (value: string | undefined) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const WorkstationSelector = ({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: WorkstationSelectorProps) => {
  const [value, onValueChange] = useControllableState<string | undefined>({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  })
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange,
  })
  const [width, setWidth] = useState(200)

  return (
    <WorkstationSelectorContext.Provider
      value={{
        value,
        onValueChange,
        open: open ?? false,
        onOpenChange,
        width,
        setWidth,
      }}
    >
      <Popover {...props} onOpenChange={onOpenChange} open={open} />
    </WorkstationSelectorContext.Provider>
  )
}

export type WorkstationSelectorTriggerProps = ComponentProps<typeof PopoverTrigger>

export const WorkstationSelectorTrigger = forwardRef<HTMLElement, WorkstationSelectorTriggerProps>(
  ({ asChild, children, ...props }, forwardedRef) => {
    const { setWidth } = useContext(WorkstationSelectorContext)
    const innerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const newWidth = (entry.target as HTMLElement).offsetWidth
          if (newWidth) {
            setWidth?.(newWidth)
          }
        }
      })

      if (innerRef.current) {
        resizeObserver.observe(innerRef.current)
      }

      return () => {
        resizeObserver.disconnect()
      }
    }, [setWidth])

    return (
      <PopoverTrigger asChild {...props}>
        <Slot ref={(node) => {
          innerRef.current = node as HTMLElement;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node as HTMLElement;
        }}>
          {children}
        </Slot>
      </PopoverTrigger>
    )
  }
)
WorkstationSelectorTrigger.displayName = "WorkstationSelectorTrigger"

export type WorkstationSelectorContentProps = ComponentProps<typeof Command> & {
  popoverOptions?: ComponentProps<typeof PopoverContent>
}

export const WorkstationSelectorContent = ({
  className,
  popoverOptions,
  ...props
}: WorkstationSelectorContentProps) => {
  const { width, onValueChange, value } = useContext(WorkstationSelectorContext)

  return (
    <PopoverContent 
      className={cn("p-0 bg-popover border-border backdrop-blur-2xl shadow-2xl overflow-hidden rounded-xl", className)} 
      style={{ width }} 
      align="start"
      {...popoverOptions}
    >
      <Command 
        className="bg-transparent" 
        value={value} 
        onValueChange={onValueChange}
        {...props} 
      />
    </PopoverContent>
  )
}

export type WorkstationSelectorInputProps = ComponentProps<typeof CommandInput>

export const WorkstationSelectorInput = ({ className, ...props }: WorkstationSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3 text-xs", className)} {...props} />
)

export type WorkstationSelectorListProps = ComponentProps<typeof CommandList>

export const WorkstationSelectorList = ({ className, ...props }: WorkstationSelectorListProps) => (
  <CommandList className={cn("max-h-[300px] overflow-y-auto scrollbar-hide", className)} {...props} />
)

export type WorkstationSelectorEmptyProps = ComponentProps<typeof CommandEmpty>

export const WorkstationSelectorEmpty = ({ className, ...props }: WorkstationSelectorEmptyProps) => (
  <CommandEmpty className={cn("py-6 text-center text-xs text-muted-foreground", className)} {...props} />
)

export type WorkstationSelectorGroupProps = ComponentProps<typeof CommandGroup>

export const WorkstationSelectorGroup = ({ className, ...props }: WorkstationSelectorGroupProps) => (
  <CommandGroup className={cn("px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:tracking-widest", className)} {...props} />
)

export type WorkstationSelectorItemProps = ComponentProps<typeof CommandItem>

export const WorkstationSelectorItem = ({ className, onSelect, value, ...props }: WorkstationSelectorItemProps) => {
  const { onValueChange, onOpenChange } = useContext(WorkstationSelectorContext)
  
  return (
    <CommandItem 
      value={value}
      onSelect={(currentValue) => {
        onValueChange?.(currentValue)
        onOpenChange?.(false)
        onSelect?.(currentValue)
      }}
      className={cn("px-3 py-2 rounded-xl cursor-default transition-all aria-selected:bg-secondary aria-selected:text-secondary-foreground", className)} 
      {...props} 
    />
  )
}

export type WorkstationSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>

export const WorkstationSelectorSeparator = (props: WorkstationSelectorSeparatorProps) => (
  <CommandSeparator className="bg-border" {...props} />
)

export type WorkstationSelectorNameProps = ComponentProps<"span">

export const WorkstationSelectorName = ({ className, ...props }: WorkstationSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-left font-medium text-[11px] text-foreground", className)} {...props} />
)

export type WorkstationSelectorDescriptionProps = ComponentProps<"span">

export const WorkstationSelectorDescription = ({
  className,
  ...props
}: WorkstationSelectorDescriptionProps) => (
  <span className={cn("text-muted-foreground text-[10px]", className)} {...props} />
)
