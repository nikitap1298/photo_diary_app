import React, { useEffect, useRef } from "react"
import Hammer from "hammerjs"

interface LongPressGestureProps {
  onLongPress: () => void
  children: JSX.Element
}

export default function LongPressGesture(props: LongPressGestureProps): JSX.Element {
  const { onLongPress, children } = props
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (elementRef.current) {
      const hammer = new Hammer(elementRef.current)

      hammer.on("press", () => {
        onLongPress()
      })

      return () => {
        hammer.off("press")
      }
    }
    return
  }, [onLongPress])

  return (
    <div
      ref={(el): HTMLDivElement | null => (elementRef.current = el)}
      style={{ display: "inline-block" }}
    >
      {children}
    </div>
  )
}
