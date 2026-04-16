import { useCallback, useState } from "react";

export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const handleIsOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleIsClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen])

  return {
    isOpen,
    handleIsOpen,
    handleIsClose,
    handleToggle,
    setIsOpen,
  }
}