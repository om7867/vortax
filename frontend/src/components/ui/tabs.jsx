import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = React.ForwardRef = React.forwardRef(({ className, defaultValue, onValueChange, children, ...props }, ref) => {
    const [value, setValue] = React.useState(defaultValue)

    // Allow controlled or uncontrolled
    const currentValue = props.value !== undefined ? props.value : value
    const handleValueChange = (newValue) => {
        setValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <div ref={ref} className={cn("w-full", className)} {...props} data-state={currentValue}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { value: currentValue, onValueChange: handleValueChange })
                }
                return child
            })}
        </div>
    )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-transparent p-1 text-muted-foreground",
            className
        )}
        {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { selectedValue: value, onValueChange })
            }
            return child
        })}
    </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, selectedValue, onValueChange, ...props }, ref) => {
    const isSelected = value === selectedValue
    return (
        <button
            ref={ref}
            onClick={() => onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                className
            )}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
    // We need to access the parent Tabs value. 
    // Since we are doing a lightweight implementation without Context for speed, 
    // we need to be careful.
    // Actually, for simplicity in this specific "UserProfile" use case where structure is static:
    // We can rely on the simple logic or just use Context which is safer.

    // Let's use Context to be safe for nested usage.
    return (
        <TabsContextConsumer>
            {({ value: selectedValue }) => {
                if (value !== selectedValue) return null
                return (
                    <div
                        ref={ref}
                        className={cn(
                            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </div>
                )
            }}
        </TabsContextConsumer>
    )
})
TabsContent.displayName = "TabsContent"


// Simple Context for reliable communication
const TabsContext = React.createContext({ value: null })

const TabsRoot = React.forwardRef(({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue

    return (
        <TabsContext.Provider value={{
            value, onValueChange: (v) => {
                setUncontrolledValue(v)
                onValueChange?.(v)
            }
        }}>
            <div ref={ref} className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
})
TabsRoot.displayName = "Tabs"

const List = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500",
            className
        )}
        {...props}
    />
))
List.displayName = "TabsList"

const Trigger = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
    const isSelected = selectedValue === value

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isSelected && "bg-white text-gray-950 shadow-sm",
                !isSelected && "hover:bg-gray-200/50 hover:text-gray-700",
                className
            )}
            {...props}
        />
    )
})
Trigger.displayName = "TabsTrigger"

const Content = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext)
    if (value !== selectedValue) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
Content.displayName = "TabsContent"

export { TabsRoot as Tabs, List as TabsList, Trigger as TabsTrigger, Content as TabsContent }
