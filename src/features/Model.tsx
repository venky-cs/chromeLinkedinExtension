import React, { useEffect, useState } from "react"

const LinkedInComponent = () => {
  const [messageField, setMessageField] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [apiResponse, setApiResponse] = useState(null)

  const handleFocus = () => {
    setTimeout(() => {
      setShowPopup(true)
    })
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setMessages([])
  }

  const handleInsert = () => {
    messageField.querySelector("p").innerText = apiResponse
    messageField.removeAttribute("aria-label")
    document
      .querySelector(".msg-form__placeholder")
      .setAttribute("data-placeholder", "")

    handleClosePopup()
  }

  const handleConfirmPopup = async () => {
    setLoading(true)
    setApiResponse("")
    if (inputValue) {
      setMessages((prevMessages) => [...prevMessages, inputValue])
      setInputValue("")
    }
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      const data = await response.json()
      setApiResponse(data?.title)

      setMessages((prevMessages) => [...prevMessages, data?.title])
    } catch (error) {
      console.error("Error:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    const observeMessageField = () => {
      const field = document.querySelector(
        '.msg-form__contenteditable[role="textbox"]'
      )
      if (field) {
        setMessageField(field)
      }
    }

    observeMessageField()

    const observer = new MutationObserver(observeMessageField)
    observer.observe(document.body, { subtree: true, childList: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (messageField) {
      const rect = messageField.getBoundingClientRect()
      const top = rect.top - 200
      const left = rect.left

      setPopupPosition({ top, left })
      const paragraph = messageField.querySelector("p")
      if (paragraph) {
        handleFocus()
      }
    } else {
      handleClosePopup()
    }
  }, [messageField])

  return (
    <div>
      {showPopup && (
        <div
          className="fixed z-50"
          style={{ top: popupPosition.top, left: popupPosition.left }}>
          <div className="flex justify-end p-0 m-0">
            <button
              onClick={handleClosePopup}
              className=" px-4 py-2 mr-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded">
              X
            </button>
          </div>

          <div
            className="bg-white rounded-lg shadow-lg p-6 m-4"
            style={{ width: "300px" }}>
            <div className="flex flex-col mt-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-md mx-2 my-1 p-2 rounded-lg ${
                    index % 2 === 0
                      ? "bg-blue-100 self-end"
                      : "bg-gray-100 self-start"
                  }`}>
                  {message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
              placeholder="Enter your text..."
            />
            <div className="flex justify-end ">
              {apiResponse && (
                <button
                  onClick={handleInsert}
                  disabled={loading}
                  className="px-4 py-2 mx-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded">
                  Insert
                </button>
              )}
              <button
                onClick={handleConfirmPopup}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded">
                {loading
                  ? "Loading..."
                  : messages?.length
                    ? "Regenerate"
                    : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkedInComponent
