import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon, X, ArrowRight } from "lucide-react"
import { format, parseISO, isValid, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"

const DateRangePicker = React.forwardRef(({
    className,
    value,
    onChange,
    placeholder = "Select date range...",
    disabled = false,
    size = "default",
    ...props
}, ref) => {
    const [open, setOpen] = React.useState(false)
    const [range, setRange] = React.useState({
        from: undefined,
        to: undefined
    })

    // Parse the incoming value (dates in YYYY-MM-DD format)
    React.useEffect(() => {
        if (value?.from || value?.to) {
            const from = value.from ? (typeof value.from === 'string' ? parseISO(value.from) : value.from) : undefined
            const to = value.to ? (typeof value.to === 'string' ? parseISO(value.to) : value.to) : undefined

            setRange({
                from: from && isValid(from) ? from : undefined,
                to: to && isValid(to) ? to : undefined
            })
        } else {
            setRange({ from: undefined, to: undefined })
        }
    }, [value])

    const handleSelect = (selectedRange) => {
        setRange(selectedRange || { from: undefined, to: undefined })

        if (onChange) {
            if (selectedRange?.from || selectedRange?.to) {
                onChange({
                    from: selectedRange.from ? format(selectedRange.from, 'yyyy-MM-dd') : '',
                    to: selectedRange.to ? format(selectedRange.to, 'yyyy-MM-dd') : ''
                })
            } else {
                onChange({ from: '', to: '' })
            }
        }

        // Close popover when both dates are selected
        if (selectedRange?.from && selectedRange?.to) {
            setOpen(false)
        }
    }

    const handleClear = (e) => {
        e.stopPropagation()
        setRange({ from: undefined, to: undefined })
        if (onChange) {
            onChange({ from: '', to: '' })
        }
    }

    // Preset ranges
    const presetRanges = [
        {
            label: "Today",
            range: () => {
                const today = new Date()
                return { from: today, to: today }
            }
        },
        {
            label: "Yesterday",
            range: () => {
                const yesterday = subDays(new Date(), 1)
                return { from: yesterday, to: yesterday }
            }
        },
        {
            label: "Last 7 days",
            range: () => ({
                from: subDays(new Date(), 6),
                to: new Date()
            })
        },
        {
            label: "Last 30 days",
            range: () => ({
                from: subDays(new Date(), 29),
                to: new Date()
            })
        },
        {
            label: "This week",
            range: () => ({
                from: startOfWeek(new Date()),
                to: endOfWeek(new Date())
            })
        },
        {
            label: "This month",
            range: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date())
            })
        }
    ]

    const handlePresetSelect = (preset) => {
        const newRange = preset.range()
        handleSelect(newRange)
    }

    const formatDisplayText = () => {
        if (!range.from && !range.to) {
            return placeholder
        }

        if (range.from && !range.to) {
            return `${format(range.from, 'MMM dd, yyyy')} - Select end date`
        }

        if (range.from && range.to) {
            if (format(range.from, 'yyyy-MM-dd') === format(range.to, 'yyyy-MM-dd')) {
                return format(range.from, 'MMM dd, yyyy')
            }
            return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`
        }

        return placeholder
    }

    const hasValue = range.from || range.to

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !hasValue && "text-muted-foreground",
                            size === "sm" && "h-9 text-sm"
                        )}
                        disabled={disabled}
                        {...props}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="flex-1 truncate">{formatDisplayText()}</span>
                        {hasValue && (
                            <X
                                className="ml-2 h-4 w-4 hover:text-destructive transition-colors"
                                onClick={handleClear}
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex">
                        {/* Preset ranges sidebar */}
                        <div className="border-r border-border p-3 space-y-1 min-w-[140px]">
                            <div className="text-sm font-medium text-muted-foreground mb-2">Quick select</div>
                            {presetRanges.map((preset, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm h-8"
                                    onClick={() => handlePresetSelect(preset)}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="p-3">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={range.from}
                                selected={range}
                                onSelect={handleSelect}
                                numberOfMonths={2}
                                className="rounded-md border-0"
                            />
                            <div className="flex items-center justify-between pt-3 border-t mt-3">
                                <div className="text-sm text-muted-foreground">
                                    {range.from && range.to ? (
                                        `${Math.ceil((range.to - range.from) / (1000 * 60 * 60 * 24)) + 1} days selected`
                                    ) : range.from ? (
                                        "Select end date"
                                    ) : (
                                        "Select start date"
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleClear}
                                        disabled={!hasValue}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setOpen(false)}
                                        disabled={!range.from || !range.to}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
})

DateRangePicker.displayName = "DateRangePicker"

export { DateRangePicker }